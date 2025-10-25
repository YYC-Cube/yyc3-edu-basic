import time
import uuid
from typing import Callable, Dict, Any
from fastapi import Request, Response
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from pybreaker import CircuitBreaker, CircuitBreakerError

# 请求ID中间件
class RequestIdMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        request_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))
        request.state.request_id = request_id
        response = await call_next(request)
        response.headers["X-Request-ID"] = request_id
        return response

# 限流中间件
limiter = Limiter(key_func=get_remote_address)

class RateLimitMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, global_limit: str, endpoint_limits: Dict[str, str] = None):
        super().__init__(app)
        self.global_limit = global_limit
        self.endpoint_limits = endpoint_limits or {}
    
    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        # 获取端点路径
        path = request.url.path
        method = request.method
        
        # 查找端点特定的限流配置
        limit_key = f"{method}:{path}"
        limit = self.endpoint_limits.get(limit_key, self.global_limit)
        
        # 应用限流
        try:
            @limiter.limit(limit)
            async def limited_call(request: Request):
                return await call_next(request)
            
            return await limited_call(request)
        except RateLimitExceeded as e:
            return await _rate_limit_exceeded_handler(request, e)

# 熔断中间件
class CircuitBreakerMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, failure_threshold: int = 5, recovery_timeout: int = 60):
        super().__init__(app)
        self.breakers: Dict[str, CircuitBreaker] = {}
        self.failure_threshold = failure_threshold
        self.recovery_timeout = recovery_timeout
    
    def get_breaker(self, key: str) -> CircuitBreaker:
        if key not in self.breakers:
            self.breakers[key] = CircuitBreaker(
                fail_max=self.failure_threshold,
                reset_timeout=self.recovery_timeout,
                name=key
            )
        return self.breakers[key]
    
    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        # 按端点路径创建熔断器
        key = f"{request.method}:{request.url.path}"
        breaker = self.get_breaker(key)
        
        try:
            # 执行请求处理
            def wrapped_call():
                return call_next(request)
            
            response = await breaker.call(wrapped_call)
            
            # 如果是服务器错误，记录失败
            if 500 <= response.status_code < 600:
                breaker.fail()
            
            return response
        except CircuitBreakerError:
            return JSONResponse(
                status_code=503,
                content={
                    "error": "服务暂时不可用",
                    "message": "当前请求过于频繁，请稍后再试",
                    "request_id": getattr(request.state, "request_id", "")
                }
            )
        except Exception as e:
            # 其他异常也记录为失败
            breaker.fail()
            raise e
