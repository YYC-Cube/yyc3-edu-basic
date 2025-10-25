import os
import json
import logging
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model
from typing import Dict, Any, List, Optional
from datetime import datetime
from config import config
from data import redis_client

logger = logging.getLogger(__name__)

class ModelManager:
    """模型管理服务，负责模型加载、推理和训练"""
    
    def __init__(self):
        self.models = {}  # 模型缓存 {模型名称: (模型对象, 版本, 加载时间)}
        self.model_path = config.get("model.path")
        self.model_versions = self._load_model_versions()
        self._load_default_models()
    
    def _load_model_versions(self) -> Dict[str, str]:
        """加载模型版本配置"""
        version_path = os.path.join(self.model_path, "versions.json")
        if os.path.exists(version_path):
            with open(version_path, "r", encoding="utf-8") as f:
                return json.load(f)
        return {
            "path_recommendation": "latest",
            "knowledge_assessment": "latest"
        }
    
    def _save_model_versions(self):
        """保存模型版本配置"""
        version_path = os.path.join(self.model_path, "versions.json")
        with open(version_path, "w", encoding="utf-8") as f:
            json.dump(self.model_versions, f, indent=2)
    
    def _get_model_file_path(self, model_name: str, version: str = "latest") -> str:
        """获取模型文件路径"""
        if version == "latest":
            version = self.model_versions.get(model_name, "latest")
        
        if version == "latest":
            # 如果没有指定版本，使用默认文件名
            return os.path.join(self.model_path, f"{model_name}_model.h5")
        
        return os.path.join(self.model_path, version, f"{model_name}_model.h5")
    
    def _load_default_models(self):
        """加载默认模型"""
        self.load_model("path_recommendation")
        self.load_model("knowledge_assessment")
    
    def load_model(self, model_name: str, version: str = "latest") -> bool:
        """加载指定模型"""
        try:
            model_path = self._get_model_file_path(model_name, version)
            if not os.path.exists(model_path):
                logger.warning(f"模型文件不存在: {model_path}，将创建新模型")
                model = self._create_model(model_name)
            else:
                model = load_model(model_path)
            
            # 更新模型缓存
            self.models[model_name] = (model, version, datetime.now())
            logger.info(f"模型 {model_name} (版本: {version}) 加载成功")
            return True
        except Exception as e:
            logger.error(f"加载模型 {model_name} 失败: {str(e)}")
            return False
    
    def _create_model(self, model_name: str) -> tf.keras.Model:
        """创建新模型"""
        if model_name == "path_recommendation":
            # 路径推荐模型
            student_input = tf.keras.layers.Input(shape=(20,), name='student_features')
            knowledge_input = tf.keras.layers.Input(shape=(50,), name='knowledge_features')
            
            student_dense = tf.keras.layers.Dense(64, activation='relu')(student_input)
            student_dense = tf.keras.layers.Dropout(0.2)(student_dense)
            student_dense = tf.keras.layers.Dense(32, activation='relu')(student_dense)
            
            knowledge_dense = tf.keras.layers.Dense(128, activation='relu')(knowledge_input)
            knowledge_dense = tf.keras.layers.Dropout(0.3)(knowledge_dense)
            knowledge_dense = tf.keras.layers.Dense(64, activation='relu')(knowledge_dense)
            
            merged = tf.keras.layers.Concatenate()([student_dense, knowledge_dense])
            merged = tf.keras.layers.Dense(128, activation='relu')(merged)
            merged = tf.keras.layers.Dropout(0.2)(merged)
            merged = tf.keras.layers.Dense(64, activation='relu')(merged)
            
            output = tf.keras.layers.Dense(1, activation='sigmoid', name='path_score')(merged)
            
            model = tf.keras.models.Model(
                inputs=[student_input, knowledge_input],
                outputs=output
            )
            model.compile(
                optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
                loss='binary_crossentropy',
                metrics=['accuracy']
            )
            return model
            
        elif model_name == "knowledge_assessment":
            # 知识评估模型
            input_shape = (30 + 15 + 50,)  # 答题特征 + 行为特征 + 节点特征
            input_layer = tf.keras.layers.Input(shape=input_shape, name='combined_features')
            
            dense = tf.keras.layers.Dense(64, activation='relu')(input_layer)
            dense = tf.keras.layers.Dropout(0.2)(dense)
            dense = tf.keras.layers.Dense(32, activation='relu')(dense)
            
            output = tf.keras.layers.Dense(1, activation='sigmoid', name='mastery_level')(dense)
            
            model = tf.keras.models.Model(inputs=input_layer, outputs=output)
            model.compile(
                optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
                loss='mse',
                metrics=['mae']
            )
            return model
        
        raise ValueError(f"未知模型类型: {model_name}")
    
    def predict(self, model_name: str, features: np.ndarray) -> np.ndarray:
        """模型推理"""
        # 检查模型是否加载
        if model_name not in self.models:
            if not self.load_model(model_name):
                raise ValueError(f"模型 {model_name} 无法加载")
        
        model, version, load_time = self.models[model_name]
        
        # 检查模型是否需要重新加载（超过24小时）
        if (datetime.now() - load_time).total_seconds() > 86400:
            self.load_model(model_name, version)
            model, _, _ = self.models[model_name]
        
        try:
            return model.predict(features, verbose=0)
        except Exception as e:
            logger.error(f"模型 {model_name} 推理失败: {str(e)}")
            # 尝试重新加载模型后再预测
            if self.load_model(model_name, version):
                model, _, _ = self.models[model_name]
                return model.predict(features, verbose=0)
            raise
    
    def train(self, model_name: str, train_data: Dict[str, Any], version: str = None) -> bool:
        """训练模型"""
        try:
            # 获取或创建模型
            if model_name in self.models:
                model, _, _ = self.models[model_name]
            else:
                model = self._create_model(model_name)
            
            # 准备训练数据
            X_train = train_data["X_train"]
            y_train = train_data["y_train"]
            X_val = train_data.get("X_val")
            y_val = train_data.get("y_val")
            
            # 训练模型
            callbacks = [
                tf.keras.callbacks.EarlyStopping(
                    patience=config.get("model.early_stopping_patience"),
                    restore_best_weights=True
                )
            ]
            
            validation_data = (X_val, y_val) if X_val is not None and y_val is not None else None
            
            history = model.fit(
                X_train,
                y_train,
                validation_data=validation_data,
                epochs=config.get("model.epochs"),
                batch_size=config.get("model.batch_size"),
                callbacks=callbacks,
                verbose=1
            )
            
            # 保存模型
            if not version:
                version = datetime.now().strftime("%Y%m%d_%H%M%S")
                model_dir = os.path.join(self.model_path, version)
                os.makedirs(model_dir, exist_ok=True)
                model_path = os.path.join(model_dir, f"{model_name}_model.h5")
            else:
                model_path = self._get_model_file_path(model_name, version)
            
            model.save(model_path)
            
            # 更新模型版本和缓存
            self.model_versions[model_name] = version
            self._save_model_versions()
            self.models[model_name] = (model, version, datetime.now())
            
            logger.info(f"模型 {model_name} (版本: {version}) 训练并保存成功")
            return True
        except Exception as e:
            logger.error(f"模型 {model_name} 训练失败: {str(e)}")
            return False
    
    def get_model_version(self, model_name: str) -> str:
        """获取模型当前版本"""
        return self.model_versions.get(model_name, "latest")
    
    def close(self):
        """释放模型资源"""
        self.models.clear()
        logger.info("模型资源已释放")
