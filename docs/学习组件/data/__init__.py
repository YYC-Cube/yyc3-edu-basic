from .db_connector import DBConnector
from .redis_client import RedisClient
from .neo4j_client import Neo4jClient
from .repositories import (
    StudentRepository,
    KnowledgeRepository,
    LearningPathRepository,
    LearningRecordRepository
)

# 初始化客户端
db_connector = DBConnector()
redis_client = RedisClient()
neo4j_client = Neo4jClient()

# 初始化仓库
student_repo = StudentRepository(db_connector, redis_client)
knowledge_repo = KnowledgeRepository(neo4j_client, redis_client)
path_repo = LearningPathRepository(db_connector, redis_client)
record_repo = LearningRecordRepository(db_connector, redis_client)
