import { EmotionData } from '../types';

/**
 * 情感分析器基类
 * 定义所有情感分析器需要实现的接口
 */
export abstract class BaseEmotionAnalyzer {
  protected source: string;
  
  constructor(source: string) {
    this.source = source;
  }
  
  /**
   * 分析情感数据
   * @returns 分析后的情感数据
   */
  abstract analyze(): Promise<EmotionData>;
  
  /**
   * 验证情感数据的有效性
   * @param emotionData 情感数据
   * @returns 是否有效
   */
  protected isValidEmotionData(emotionData: EmotionData): boolean {
    return (
      emotionData !== null &&
      emotionData !== undefined &&
      typeof emotionData === 'object' &&
      typeof emotionData.primary === 'string' &&
      typeof emotionData.confidence === 'number' &&
      typeof emotionData.valence === 'number' &&
      typeof emotionData.arousal === 'number' &&
      emotionData.confidence >= 0 &&
      emotionData.confidence <= 1 &&
      emotionData.valence >= -1 &&
      emotionData.valence <= 1 &&
      emotionData.arousal >= 0 &&
      emotionData.arousal <= 1
    );
  }
  
  /**
   * 创建默认情感数据
   * @returns 默认情感数据（中性）
   */
  protected createDefaultEmotionData(): EmotionData {
    return {
      primary: 'neutral',
      confidence: 1.0,
      timestamp: Date.now(),
      valence: 0,
      arousal: 0.5,
      source: this.source
    };
  }
  
  /**
   * 规范化情感数据
   * @param emotionData 原始情感数据
   * @returns 规范化后的情感数据
   */
  protected normalizeEmotionData(emotionData: Partial<EmotionData>): EmotionData {
    const base: EmotionData = this.createDefaultEmotionData();
    
    return {
      ...base,
      ...emotionData,
      timestamp: emotionData.timestamp || Date.now(),
      source: this.source,
      // 确保数值在有效范围内
      confidence: Math.max(0, Math.min(1, emotionData.confidence || 0)),
      valence: Math.max(-1, Math.min(1, emotionData.valence || 0)),
      arousal: Math.max(0, Math.min(1, emotionData.arousal || 0.5))
    };
  }
}