from typing import Optional, Dict, List
from dataclasses import asdict
import json
import logging
from datetime import datetime, timedelta
from ...models.student import StudentProfile, LearningStyle

logger = logging.getLogger(__name__)

class StudentRepository:
    """学生数据仓库"""
    
    def __init__(self, db_connector, redis_client):
        self.db_connector = db_connector
        self.redis_client = redis_client
        self.cache_ttl = 3600  # 缓存1小时
    
    def get_student(self, student_id: str) -> Optional[StudentProfile]:
        """获取学生画像"""
        # 1. 尝试从缓存获取
        cache_key = f"student:{student_id}"
        cached = self.redis_client.get(cache_key)
        if cached:
            data = json.loads(cached)
            return StudentProfile(
                id=data["id"],
                name=data["name"],
                grade_level=data["grade_level"],
                learning_style=LearningStyle(data["learning_style"]),
                cognitive_style=data["cognitive_style"],
                knowledge_state=data["knowledge_state"],
                learning_history=data["learning_history"],
                preferences=data["preferences"],
                emotional_state=data["emotional_state"],
                learning_goals=data["learning_goals"],
                available_time=data["available_time"]
            )
        
        # 2. 从数据库获取
        with self.db_connector.get_connection(read_only=True) as conn:
            with conn.cursor() as cur:
                cur.execute("""
                    SELECT id, name, grade_level, learning_style, cognitive_style,
                           knowledge_state, learning_history, preferences,
                           emotional_state, learning_goals, available_time
                    FROM students WHERE id = %s
                """, (student_id,))
                row = cur.fetchone()
                if not row:
                    return None
                
                # 转换为StudentProfile对象
                student = StudentProfile(
                    id=row[0],
                    name=row[1],
                    grade_level=row[2],
                    learning_style=LearningStyle(row[3]),
                    cognitive_style=row[4],
                    knowledge_state=json.loads(row[5]),
                    learning_history=json.loads(row[6]),
                    preferences=json.loads(row[7]),
                    emotional_state=json.loads(row[8]),
                    learning_goals=json.loads(row[9]),
                    available_time=row[10]
                )
                
                # 缓存结果
                self.redis_client.setex(
                    cache_key, 
                    self.cache_ttl, 
                    json.dumps(asdict(student))
                )
                return student
    
    def update_student(self, student: StudentProfile) -> bool:
        """更新学生画像"""
        try:
            with self.db_connector.get_connection() as conn:
                with conn.cursor() as cur:
                    cur.execute("""
                        UPDATE students SET
                            name = %s,
                            grade_level = %s,
                            learning_style = %s,
                            cognitive_style = %s,
                            knowledge_state = %s,
                            learning_history = %s,
                            preferences = %s,
                            emotional_state = %s,
                            learning_goals = %s,
                            available_time = %s,
                            updated_at = NOW()
                        WHERE id = %s
                    """, (
                        student.name,
                        student.grade_level,
                        student.learning_style.value,
                        student.cognitive_style,
                        json.dumps(student.knowledge_state),
                        json.dumps(student.learning_history),
                        json.dumps(student.preferences),
                        json.dumps(student.emotional_state),
                        json.dumps(student.learning_goals),
                        student.available_time,
                        student.id
                    ))
            
            # 更新缓存
            cache_key = f"student:{student.id}"
            self.redis_client.setex(
                cache_key, 
                self.cache_ttl, 
                json.dumps(asdict(student))
            )
            return True
        except Exception as e:
            logger.error(f"更新学生信息失败: {str(e)}")
            return False
    
    def batch_get_students(self, student_ids: List[str]) -> Dict[str, StudentProfile]:
        """批量获取学生画像"""
        # 1. 先从缓存获取
        cache_keys = [f"student:{sid}" for sid in student_ids]
        cached_results = self.redis_client.mget(cache_keys)
        
        students = {}
        missing_ids = []
        
        for sid, cached in zip(student_ids, cached_results):
            if cached:
                data = json.loads(cached)
                students[sid] = StudentProfile(
                    id=data["id"],
                    name=data["name"],
                    grade_level=data["grade_level"],
                    learning_style=LearningStyle(data["learning_style"]),
                    cognitive_style=data["cognitive_style"],
                    knowledge_state=data["knowledge_state"],
                    learning_history=data["learning_history"],
                    preferences=data["preferences"],
                    emotional_state=data["emotional_state"],
                    learning_goals=data["learning_goals"],
                    available_time=data["available_time"]
                )
            else:
                missing_ids.append(sid)
        
        # 2. 从数据库获取缺失的学生
        if missing_ids:
            with self.db_connector.get_connection(read_only=True) as conn:
                with conn.cursor() as cur:
                    placeholders = ", ".join(["%s"] * len(missing_ids))
                    cur.execute(f"""
                        SELECT id, name, grade_level, learning_style, cognitive_style,
                               knowledge_state, learning_history, preferences,
                               emotional_state, learning_goals, available_time
                        FROM students WHERE id IN ({placeholders})
                    """, tuple(missing_ids))
                    
                    for row in cur.fetchall():
                        student = StudentProfile(
                            id=row[0],
                            name=row[1],
                            grade_level=row[2],
                            learning_style=LearningStyle(row[3]),
                            cognitive_style=row[4],
                            knowledge_state=json.loads(row[5]),
                            learning_history=json.loads(row[6]),
                            preferences=json.loads(row[7]),
                            emotional_state=json.loads(row[8]),
                            learning_goals=json.loads(row[9]),
                            available_time=row[10]
                        )
                        students[row[0]] = student
                        
                        # 缓存结果
                        self.redis_client.setex(
                            f"student:{row[0]}", 
                            self.cache_ttl, 
                            json.dumps(asdict(student))
                        )
        
        return students
