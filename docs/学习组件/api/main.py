import logging
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse
from prometheus_fastapi_instrumentator import Instrumentator
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration
from sentry_sdk.integrations.logging import LoggingIntegration
from config import config
from api.routes import learning_path_router, student_router
from api.dependencies import get_learning_path_service, get_student_service
from api.middlewares import (
    RequestIdMiddleware,
    RateLimitMiddleware,
    CircuitBreakerMiddleware
)

# 初始化日志
logging.basicConfig(
    level=config.get("logging.level"),
    format=config.get("logging.format")
)
logger = logging.getLogger(__name__)

# 初始化Sentry错误跟踪
if config.get("sentry.dsn"):
    sentry_logging = LoggingIntegration(
        level=logging.INFO,
        event_level=logging.ERROR
    )
    sentry_sdk.init(
        dsn=config.get("sentry.dsn"),
        integrations=[
            sentry_logging,
            FastApiIntegration()
        ],
        traces_sample_rate=0.1
    )

# 初始化FastAPI应用
app = FastAPI(
    title="个性化学习路径API",
    description="基于AI的个性化学习路径生成系统",
    version="1.0.0"
)

# 添加中间件
app.add_middleware(RequestIdMiddleware)
app.add_middleware(GZipMiddleware, minimum_size=1000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=config.get("api.cors.allow_origins", ["*"]),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(
    RateLimitMiddleware,
    global_limit=config.get("api.rate_limit.global", "100/minute"),
    endpoint_limits=config.get("api.rate_limit.endpoints", {})
)
app.add_middleware(
    CircuitBreakerMiddleware,
    failure_threshold=5,
    recovery_timeout=60
)

# 注册路由
app.include_router(learning_path_router, prefix="/api/v1/learning-paths")
app.include_router(student_router, prefix="/api/v1/students")

# 添加Prometheus监控
Instrumentator().instrument(app).expose(app, path="/metrics")

# 健康检查接口
@app.get("/health", tags=["系统"])
async def health_check():
    return {
        "status": "healthy",
        "service": "learning-path-service",
        "version": "1.0.0",
        "timestamp": datetime.now().isoformat()
    }

# 全局异常处理
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logger.error(f"全局异常: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": "服务器内部错误",
            "message": str(exc) if config.get("env") != "production" else "请联系管理员",
            "request_id": request.state.request_id
        }
    )
