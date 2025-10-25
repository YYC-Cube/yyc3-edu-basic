import psycopg2
from psycopg2 import pool
from contextlib import contextmanager
from config import config
import logging

logger = logging.getLogger(__name__)

class DBConnector:
    """数据库连接池管理"""
    
    def __init__(self):
        self.master_pool = None
        self.slave_pool = None
        self._init_pools()
    
    def _init_pools(self):
        """初始化主从连接池"""
        # 主库连接池（写操作）
        try:
            self.master_pool = psycopg2.pool.ThreadedConnectionPool(
                minconn=5,
                maxconn=config.get("database.pool_size"),
                host=config.get("database.master.host"),
                port=config.get("database.master.port"),
                database=config.get("database.name"),
                user=config.get("database.user"),
                password=config.get("database.password")
            )
            logger.info("主库连接池初始化成功")
        except Exception as e:
            logger.error(f"主库连接池初始化失败: {str(e)}")
            raise
        
        # 从库连接池（读操作）
        try:
            if config.get("database.slave.host"):
                self.slave_pool = psycopg2.pool.ThreadedConnectionPool(
                    minconn=5,
                    maxconn=config.get("database.pool_size"),
                    host=config.get("database.slave.host"),
                    port=config.get("database.slave.port"),
                    database=config.get("database.name"),
                    user=config.get("database.user"),
                    password=config.get("database.password")
                )
                logger.info("从库连接池初始化成功")
        except Exception as e:
            logger.warning(f"从库连接池初始化失败，将使用主库: {str(e)}")
            self.slave_pool = None
    
    @contextmanager
    def get_connection(self, read_only: bool = False):
        """获取数据库连接上下文管理器"""
        conn = None
        try:
            # 优先使用从库读，主库写
            if read_only and self.slave_pool:
                conn = self.slave_pool.getconn()
            else:
                conn = self.master_pool.getconn()
            
            yield conn
        except Exception as e:
            logger.error(f"数据库操作失败: {str(e)}")
            if conn:
                conn.rollback()
            raise
        finally:
            if conn:
                conn.commit()
                # 归还连接到池
                if read_only and self.slave_pool:
                    self.slave_pool.putconn(conn)
                else:
                    self.master_pool.putconn(conn)
    
    def close(self):
        """关闭连接池"""
        if self.master_pool:
            self.master_pool.closeall()
        if self.slave_pool:
            self.slave_pool.closeall()
        logger.info("数据库连接池已关闭")
