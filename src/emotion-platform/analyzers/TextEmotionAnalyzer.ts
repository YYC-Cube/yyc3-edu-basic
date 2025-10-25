import { BaseEmotionAnalyzer } from './BaseEmotionAnalyzer';
import { EmotionData } from '../types';

/**
 * 文本情感分析器
 * 分析文本输入中的情感
 */
export class TextEmotionAnalyzer extends BaseEmotionAnalyzer {
  private text: string;
  private debounceTimer: number | null = null;
  private debounceDelay: number;
  private analysisCallback?: (emotionData: EmotionData) => void;
  
  constructor(text: string = '', debounceDelay: number = 300) {
    super('text');
    this.text = text;
    this.debounceDelay = debounceDelay;
  }
  
  /**
   * 设置文本内容
   * @param text 要分析的文本
   */
  setText(text: string): void {
    this.text = text;
    
    // 如果设置了回调，使用防抖处理
    if (this.analysisCallback) {
      this.debouncedAnalyze();
    }
  }
  
  /**
   * 设置分析完成的回调函数
   * @param callback 回调函数
   */
  setCallback(callback: (emotionData: EmotionData) => void): void {
    this.analysisCallback = callback;
  }
  
  /**
   * 分析文本情感
   * @returns 情感分析结果
   */
  async analyze(): Promise<EmotionData> {
    if (!this.text || this.text.trim().length === 0) {
      return this.createDefaultEmotionData();
    }
    
    try {
      // 实现基础的文本情感分析逻辑
      const partialEmotionData = this.performTextAnalysis(this.text);
      
      // 规范化结果
      const emotionData = this.normalizeEmotionData(partialEmotionData);
      
      return emotionData;
    } catch (error) {
      console.error('Text emotion analysis failed:', error);
      return this.createDefaultEmotionData();
    }
  }
  
  /**
   * 执行文本分析的核心逻辑
   * @param text 文本内容
   * @returns 初步分析结果
   */
  private performTextAnalysis(text: string): Partial<EmotionData> {
    const lowerText = text.toLowerCase();
    
    // 情感词汇库（简化版）
    const positiveWords = ['happy', 'joy', 'excited', 'love', 'great', 'wonderful', 'amazing', 'excellent', 'good', 'positive', '喜', '乐', '好', '棒', '赞', '开心', '高兴', '愉快'];
    const negativeWords = ['sad', 'angry', 'hate', 'disgust', 'bad', 'terrible', 'awful', 'horrible', 'negative', '不', '坏', '差', '讨厌', '悲伤', '生气', '难过'];
    const highArousalWords = ['excited', 'angry', 'amazing', 'horrible', 'urgent', 'quick', 'fast', '立即', '紧急', '快速', '激动', '生气'];
    const lowArousalWords = ['calm', 'relaxed', 'peaceful', 'slow', 'gentle', '安静', '平静', '放松', '缓慢'];
    
    // 计算词汇匹配度
    const positiveCount = this.countWordMatches(lowerText, positiveWords);
    const negativeCount = this.countWordMatches(lowerText, negativeWords);
    const highArousalCount = this.countWordMatches(lowerText, highArousalWords);
    const lowArousalCount = this.countWordMatches(lowerText, lowArousalWords);
    
    // 计算情感效价（-1 到 1）
    const totalSentimentWords = positiveCount + negativeCount;
    let valence = 0;
    if (totalSentimentWords > 0) {
      valence = (positiveCount - negativeCount) / totalSentimentWords;
    }
    
    // 计算唤醒度（0 到 1）
    const totalArousalWords = highArousalCount + lowArousalCount;
    let arousal = 0.5; // 默认中等唤醒度
    if (totalArousalWords > 0) {
      arousal = highArousalCount / totalArousalWords;
    }
    
    // 确定主要情绪
    let primary = 'neutral';
    let confidence = 0.5;
    
    if (positiveCount > negativeCount) {
      primary = 'happiness';
      confidence = Math.min(1, positiveCount / 3);
    } else if (negativeCount > positiveCount) {
      if (arousal > 0.7) {
        primary = 'anger';
      } else {
        primary = 'sadness';
      }
      confidence = Math.min(1, negativeCount / 3);
    }
    
    // 检查特殊情绪触发词
    if (lowerText.includes('surprise') || lowerText.includes('惊讶') || lowerText.includes('震惊')) {
      primary = 'surprise';
      confidence = Math.min(1, confidence * 1.2);
    }
    
    if (lowerText.includes('fear') || lowerText.includes('害怕') || lowerText.includes('恐惧')) {
      primary = 'fear';
    }
    
    if (lowerText.includes('disgust') || lowerText.includes('恶心') || lowerText.includes('厌恶')) {
      primary = 'disgust';
    }
    
    return {
      primary,
      confidence,
      valence,
      arousal,
      timestamp: Date.now(),
      source: this.source
    };
  }
  
  /**
   * 计算文本中特定词汇的出现次数
   * @param text 文本内容
   * @param words 词汇数组
   * @returns 匹配次数
   */
  private countWordMatches(text: string, words: string[]): number {
    return words.reduce((count, word) => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      const matches = text.match(regex);
      return count + (matches ? matches.length : 0);
    }, 0);
  }
  
  /**
   * 防抖处理分析请求
   */
  private debouncedAnalyze(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    
    this.debounceTimer = window.setTimeout(async () => {
      const result = await this.analyze();
      if (this.analysisCallback) {
        this.analysisCallback(result);
      }
    }, this.debounceDelay);
  }
  
  /**
   * 清理资源
   */
  dispose(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
  }
}