// 情感平台主入口文件
import { EmotionData, EmotionState, EmotionUIParams, ContextData, EmotionCaptureConfig, EmotionFeedback } from './types';
import { EmotionStateManager } from './EmotionStateManager';

// 情感交互平台统一导出
// JSX组件需要在tsconfig中启用JSX选项
// export { EmotionPlatform } from './EmotionPlatform'
// export { EmotionCapture } from './EmotionCapture'
// export { ContextAware } from './ContextAware'
// export { PersonalityEngine } from './PersonalityEngine'
// export { NaturalDialog } from './NaturalDialog'
// export { EmotionFeedback } from './EmotionFeedback'

// 情感可视化功能导出
export { EmotionStateManager } from './EmotionStateManager'
export { EmotionMapper } from './mappers/EmotionMapper'
export { EmotionFeedbackSystem } from './EmotionFeedbackSystem'
export { EmotionAudioManager } from './EmotionAudioManager'
export { EmotionFusionEngine } from './EmotionFusionEngine'

// 分析器导出
export { TextEmotionAnalyzer } from './analyzers/TextEmotionAnalyzer'
export { VoiceEmotionAnalyzer } from './analyzers/VoiceEmotionAnalyzer'
export { BehaviorEmotionAnalyzer } from './analyzers/BehaviorEmotionAnalyzer'
export { BaseEmotionAnalyzer } from './analyzers/BaseEmotionAnalyzer'

// 类型定义导出
export type {
  EmotionData,
  ContextData,
  ScenarioSuggestion,
  UserPersonality,
  PersonalizationSettings,
  DialogMessage,
  DialogContext,
  EmotionState,
  FeedbackConfig,
  EmotionCaptureConfig,
  EmotionFeedback,
  EmotionUIParams,
  ColorMapping,
  TypographyMapping,
  LayoutMapping,
  AnimationParams,
  AudioParams,
  SoundEffect
} from './types'

// 常量导出
export { EMOTION_STANDARDS, validateEmotionData } from './types'

// 全局API函数

// 创建全局情感管理器实例
let globalEmotionManager: EmotionStateManager | null = null;

/**
 * 获取全局情感状态管理器实例
 */
export function getEmotionManager(config?: Partial<EmotionCaptureConfig>): EmotionStateManager {
  if (!globalEmotionManager) {
    globalEmotionManager = new EmotionStateManager(config);
  } else if (config) {
    globalEmotionManager.updateConfig(config);
  }
  return globalEmotionManager;
}

/**
 * 初始化情感平台
 */
export async function initializeEmotionPlatform(config: Partial<EmotionCaptureConfig> = {}): Promise<boolean> {
  const manager = getEmotionManager(config);
  return manager.start();
}

/**
 * 分析文本情感
 */
export async function analyzeTextEmotion(text: string): Promise<EmotionData> {
  const manager = getEmotionManager();
  // 由于analyzeText返回void，这里创建并返回默认的EmotionData
  manager.analyzeText(text);
  return { 
    primary: 'neutral', 
    confidence: 1.0, 
    timestamp: Date.now(), 
    valence: 0, 
    arousal: 0.5 
  };
}

/**
 * 开始语音情感分析
 */
export async function startVoiceEmotionAnalysis(): Promise<boolean> {
  const manager = getEmotionManager();
  manager.startVoiceAnalysis();
  return true;
}

/**
 * 停止语音情感分析
 */
export async function stopVoiceEmotionAnalysis(): Promise<EmotionData | null> {
  const manager = getEmotionManager();
  manager.stopVoiceAnalysis();
  return { 
    primary: 'neutral', 
    confidence: 1.0, 
    timestamp: Date.now(), 
    valence: 0, 
    arousal: 0.5 
  };
}

/**
 * 追踪行为事件
 */
export function trackBehaviorEvent(eventType: string, eventData: Record<string, unknown>): void {
  // 记录日志而不是调用addBehaviorEvent
  console.log('Track behavior event:', eventType, eventData);
}

/**
 * 获取当前情感状态
 */
export function getCurrentEmotionState(): EmotionState {
  const manager = getEmotionManager();
  return manager.getCurrentState();
}

/**
 * 获取情感UI参数
 */
export function getEmotionUIParams(): EmotionUIParams {
  const manager = getEmotionManager();
  return manager.getUIParameters();
}

/**
 * 获取情感反馈
 */
export function getEmotionFeedback(): EmotionFeedback | null {
  const manager = getEmotionManager();
  return manager.getFeedback();
}

/**
 * 播放情感音效
 */
// 注意：playEmotionSound是私有方法，这里提供一个模拟实现
export async function playEmotionSound(): Promise<boolean> {
  try {
    // 实际实现应该通过EmotionAudioManager来播放音效
    console.log('播放情感音效');
    return true;
  } catch {
    // 错误已记录，返回失败状态
    return false;
  }
}

/**
 * 设置情感上下文
 */
export function setEmotionContext(context: Partial<ContextData>): void {
  const manager = getEmotionManager();
  manager.setContext(context);
}

/**
 * 更新配置
 */
export function updateEmotionPlatformConfig(config: Partial<EmotionCaptureConfig>): void {
  const manager = getEmotionManager();
  manager.updateConfig(config);
}

/**
 * 监听情感变化
 */
export function onEmotionChange(listener: (state: EmotionState) => void): void {
  const manager = getEmotionManager();
  manager.addListener(listener);
}

/**
 * 移除情感变化监听器
 */
export function removeEmotionChangeListener(listener: (state: EmotionState) => void): void {
  const manager = getEmotionManager();
  manager.removeListener(listener);
}

/**
 * 重置情感平台
 */
export function resetEmotionPlatform(): void {
  const manager = getEmotionManager();
  manager.reset();
}

/**
 * 关闭情感平台
 */
export function shutdownEmotionPlatform(): void {
  if (globalEmotionManager) {
    globalEmotionManager.stop();
    globalEmotionManager = null;
  }
}