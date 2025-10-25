import logging
from typing import Optional, List, Dict, Any
from datetime import datetime
import numpy as np
import networkx as nx
from data import student_repo, knowledge_repo, path_repo, record_repo
from models import model_manager, StudentProfile, LearningPath, KnowledgeNode, LearningStrategy

logger = logging.getLogger(__name__)

class LearningPathService:
    """学习路径服务，负责生成和更新个性化学习路径"""
    
    def __init__(self):
        self.learning_strategies = self._load_learning_strategies()
    
    def _load_learning_strategies(self) -> Dict[str, LearningStrategy]:
        """加载学习策略"""
        return {
            "visual_demonstration": LearningStrategy(
                id="visual_demonstration",
                name="视觉演示策略",
                description="通过图表、动画和视觉辅助工具进行教学",
                suitable_styles=["visual"],
                suitable_levels=[1, 2, 3, 4, 5, 6],
                parameters={
                    "visual_ratio": 0.8,
                    "animation_speed": "medium",
                    "color_scheme": "vibrant"
                }
            ),
            "step_by_step": LearningStrategy(
                id="step_by_step",
                name="分步学习策略",
                description="将复杂概念分解为简单步骤，循序渐进",
                suitable_styles=["reading", "auditory"],
                suitable_levels=[1, 2, 3],
                parameters={
                    "step_size": "small",
                    "review_frequency": "high",
                    "examples_per_step": 3
                }
            ),
            # 其他策略...
        }
    
    def generate_path(self, student_id: str, subject: str) -> Optional[LearningPath]:
        """生成个性化学习路径"""
        try:
            # 1. 获取学生画像
            student = student_repo.get_student(student_id)
            if not student:
                logger.error(f"学生 {student_id} 不存在")
                return None
            
            # 2. 评估学生知识掌握程度
            mastery_levels = self.assess_knowledge(student, subject)
            
            # 3. 找出薄弱知识点
            weak_nodes = self.find_weak_nodes(mastery_levels)
            
            # 4. 选择学习策略
            strategy = self.select_learning_strategy(student)
            
            # 5. 生成学习路径序列
            path_sequence = self._generate_path_sequence(weak_nodes, student, strategy, subject)
            
            # 6. 获取路径中的知识点详情
            path_nodes = knowledge_repo.get_knowledge_nodes(path_sequence)
            
            # 7. 计算预计总学习时间
            total_time = sum(node.estimated_time for node in path_nodes)
            
            # 8. 生成自适应元素
            adaptive_elements = self._generate_adaptive_elements(student, path_nodes, strategy)
            
            # 9. 创建学习路径对象
            learning_path = LearningPath(
                student_id=student.id,
                subject=subject,
                nodes=path_nodes,
                sequence=path_sequence,
                estimated_time=total_time,
                adaptive_elements=adaptive_elements,
                created_at=datetime.now(),
                updated_at=datetime.now()
            )
            
            # 10. 保存学习路径
            path_repo.save_learning_path(learning_path)
            
            logger.info(f"为学生 {student_id} 生成 {subject} 学习路径成功")
            return learning_path
        except Exception as e:
            logger.error(f"生成学习路径失败: {str(e)}")
            return None
    
    def assess_knowledge(self, student: StudentProfile, subject: str) -> Dict[str, float]:
        """评估学生知识掌握程度"""
        # 1. 获取学生答题记录和学习行为
        answer_records = record_repo.get_student_answer_records(student.id, subject)
        learning_behavior = record_repo.get_student_learning_behavior(student.id, subject)
        
        # 2. 提取特征
        answer_features = self._prepare_answer_features(answer_records)
        behavior_features = self._prepare_behavior_features(learning_behavior)
        
        # 3. 获取该学科所有知识点
        knowledge_nodes = knowledge_repo.get_knowledge_node_ids_by_subject(subject)
        if not knowledge_nodes:
            return {}
        
        # 4. 批量获取知识点特征并组合
        batch_features = []
        for node_id in knowledge_nodes:
            node_features = knowledge_repo.get_node_features(node_id)
            combined = np.concatenate([answer_features, behavior_features, node_features])
            batch_features.append(combined)
        
        # 5. 批量预测
        if batch_features:
            batch_features = np.array(batch_features)
            mastery_scores = model_manager.predict("knowledge_assessment", batch_features).flatten()
            mastery_levels = {
                node_id: float(score) 
                for node_id, score in zip(knowledge_nodes, mastery_scores)
            }
        else:
            mastery_levels = {}
        
        # 6. 更新学生知识状态
        student.knowledge_state.update(mastery_levels)
        student_repo.update_student(student)
        
        return mastery_levels
    
    def find_weak_nodes(self, mastery_levels: Dict[str, float], threshold: float = 0.6) -> List[str]:
        """找出知识薄弱点"""
        weak_nodes = [
            node_id for node_id, mastery in mastery_levels.items() 
            if mastery < threshold
        ]
        # 按掌握程度排序，最薄弱的在前
        weak_nodes.sort(key=lambda x: mastery_levels[x])
        return weak_nodes
    
    def select_learning_strategy(self, student: StudentProfile) -> LearningStrategy:
        """选择学习策略"""
        # 筛选适合学生学习风格和年级的策略
        suitable_strategies = [
            strategy for strategy in self.learning_strategies.values()
            if student.learning_style.value in strategy.suitable_styles and 
               student.grade_level in strategy.suitable_levels
        ]
        
        if not suitable_strategies:
            suitable_strategies = list(self.learning_strategies.values())
        
        # 根据学生情感状态调整
        if student.emotional_state.get("frustration", 0) > 0.7:
            suitable_strategies = [
                s for s in suitable_strategies 
                if s.id in ["step_by_step", "visual_demonstration"]
            ]
        
        return suitable_strategies[0]
    
    def _generate_path_sequence(self, weak_nodes: List[str], student: StudentProfile, 
                               strategy: LearningStrategy, subject: str) -> List[str]:
        """生成学习路径序列"""
        if not weak_nodes:
            return []
        
        # 获取学科知识子图
        knowledge_graph = knowledge_repo.get_knowledge_subgraph(subject)
        
        # 构建包含薄弱点及其前置知识的子图
        subgraph_nodes = set(weak_nodes)
        for node in weak_nodes:
            if node in knowledge_graph:
                subgraph_nodes.update(nx.ancestors(knowledge_graph, node))
        
        subgraph = knowledge_graph.subgraph(subgraph_nodes)
        
        # 拓扑排序
        try:
            sequence = list(nx.topological_sort(subgraph))
        except nx.NetworkXError:
            # 存在环时使用启发式排序
            sequence = self._heuristic_sort(subgraph, weak_nodes)
        
        # 根据学习策略调整序列
        if strategy.id == "step_by_step":
            sequence = self._break_down_complex_nodes(sequence, student, knowledge_graph)
        elif strategy.id == "exploratory":
            sequence = self._reorder_for_exploration(sequence)
        
        # 确保薄弱点在序列中
        for node in weak_nodes:
            if node not in sequence:
                sequence.append(node)
        
        # 限制序列长度
        max_length = 20
        if len(sequence) > max_length:
            weak_set = set(weak_nodes)
            sequence = [node for node in sequence if node in weak_set][:max_length]
        
        return sequence
    
    def update_path(self, student_id: str, subject: str, progress: Dict[str, float]) -> Optional[LearningPath]:
        """更新学习路径"""
        # 检查是否需要更新
        current_path = path_repo.get_latest_learning_path(student_id, subject)
        if not current_path:
            return self.generate_path(student_id, subject)
        
        # 判断是否需要更新路径
        if self._check_path_update_needed(current_path, progress):
            return self.generate_path(student_id, subject)
        
        return None
    
    def _check_path_update_needed(self, path: LearningPath, progress: Dict[str, float]) -> bool:
        """检查是否需要更新路径"""
        current_sequence = path.sequence
        if not current_sequence:
            return True
        
        # 计算已掌握的知识点比例
        mastered_count = sum(1 for node_id in current_sequence if progress.get(node_id, 0) > 0.8)
        mastery_ratio = mastered_count / len(current_sequence)
        
        return mastery_ratio > 0.7
    
    # 其他辅助方法...
