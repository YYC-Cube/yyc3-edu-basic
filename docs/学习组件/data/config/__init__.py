import os
import yaml
from typing import Dict, Any
from functools import lru_cache

class Config:
    """系统配置管理类"""
    
    def __init__(self, env: str = "production"):
        """初始化配置，支持多环境"""
        self.env = env
        self.config = self._load_config()
        self._validate_config()
    
    @lru_cache(maxsize=None)
    def _load_config(self) -> Dict[str, Any]:
        """加载配置文件，支持环境变量覆盖"""
        # 加载基础配置
        base_path = os.path.join(os.path.dirname(__file__), "base.yaml")
        with open(base_path, "r", encoding="utf-8") as f:
            config = yaml.safe_load(f)
        
        # 加载环境特定配置
        env_path = os.path.join(os.path.dirname(__file__), f"{self.env}.yaml")
        if os.path.exists(env_path):
            with open(env_path, "r", encoding="utf-8") as f:
                env_config = yaml.safe_load(f)
                config.update(env_config)
        
        # 环境变量覆盖配置
        self._override_with_env(config)
        return config
    
    def _override_with_env(self, config: Dict[str, Any]):
        """用环境变量覆盖配置"""
        for key, value in os.environ.items():
            parts = key.lower().split("__")  # 用双下划线分隔层级
            current = config
            for i, part in enumerate(parts):
                if i == len(parts) - 1:
                    current[part] = value
                    break
                if part not in current:
                    current[part] = {}
                current = current[part]
    
    def _validate_config(self):
        """验证配置完整性"""
        required_sections = ["database", "redis", "neo4j", "model", "service"]
        for section in required_sections:
            if section not in self.config:
                raise ValueError(f"配置缺失必要部分: {section}")
    
    def get(self, key: str, default: Any = None) -> Any:
        """获取配置项，支持点分路径（如"database.host"）"""
        parts = key.split(".")
        current = self.config
        for part in parts:
            if part not in current:
                return default
            current = current[part]
        return current
    
    def reload(self):
        """重新加载配置"""
        self._load_config.cache_clear()
        self.config = self._load_config()
        self._validate_config()

# 全局配置实例
config = Config(os.environ.get("LEARNING_PATH_ENV", "production"))
