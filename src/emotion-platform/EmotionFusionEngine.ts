import { EmotionData, EmotionCaptureConfig } from './types';
import { TextEmotionAnalyzer } from './analyzers/TextEmotionAnalyzer';
import { VoiceEmotionAnalyzer } from './analyzers/VoiceEmotionAnalyzer';
import { BehaviorEmotionAnalyzer } from './analyzers/BehaviorEmotionAnalyzer';

/**
 * 情感融合引擎
 * 整合多种来源的情感分析结果
 */
export class EmotionFusionEngine {
  private textAnalyzer: TextEmotionAnalyzer;
  private voiceAnalyzer: VoiceEmotionAnalyzer;
  private behaviorAnalyzer: BehaviorEmotionAnalyzer;
  private config: EmotionCaptureConfig;
  private recentEmotions: EmotionData[] = [];
  private maxRecentEmotions: number = 10;
  private fusionCallback?: (emotionData: EmotionData) => void;
  private isInitialized: boolean = false;
  
  constructor(config: EmotionCaptureConfig = {}) {
    // 设置默认配置
    this.config = {
      textDebounceDelay: 300,
      voiceRecordingTimeout: 5000,
      behaviorDataSize: 100,
      fusionWeights: {
        text: 0.4,
        voice: 0.3,
        behavior: 0.3
      },
      ...config
    };
    
    // 初始化各个分析器
    this.textAnalyzer = new TextEmotionAnalyzer('', this.config.textDebounceDelay!);
    this.voiceAnalyzer = new VoiceEmotionAnalyzer(this.config.voiceRecordingTimeout!);
    this.behaviorAnalyzer = new BehaviorEmotionAnalyzer(this.config.behaviorDataSize!);
    
    // 设置回调
    this.setupAnalyzersCallbacks();
  }
  
  /**
   * 初始化情感融合引擎
   */
  async initialize(): Promise<boolean> {
    try {
      // 初始化语音分析器
      const voiceInit = await this.voiceAnalyzer.init();
      if (!voiceInit) {
        console.warn('Voice emotion analyzer initialization failed');
      }
      
      // 开始行为跟踪
      this.behaviorAnalyzer.startTracking();
      
      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('Emotion fusion engine initialization failed:', error);
      return false;
    }
  }
  
  /**
   * 设置分析器回调
   */
  private setupAnalyzersCallbacks(): void {
    // 设置文本分析器回调
      this.textAnalyzer.setCallback(async () => {
        await this.fuseEmotions();
      });
    
    // 设置语音分析器回调
      this.voiceAnalyzer.setCallback(async () => {
      await this.fuseEmotions();
    });
  }
  
  /**
   * 设置融合结果回调
   */
  setFusionCallback(callback: (emotionData: EmotionData) => void): void {
    this.fusionCallback = callback;
  }
  
  /**
   * 分析文本情感
   */
  async analyzeText(text: string): Promise<void> {
    if (!this.isInitialized) {
      console.warn('Emotion fusion engine not initialized');
      return;
    }
    
    this.textAnalyzer.setText(text);
  }
  
  /**
   * 开始语音录制和分析
   */
  async startVoiceAnalysis(): Promise<boolean> {
    if (!this.isInitialized) {
      console.warn('Emotion fusion engine not initialized');
      return false;
    }
    
    return this.voiceAnalyzer.startRecording();
  }
  
  /**
   * 停止语音录制
   */
  async stopVoiceAnalysis(): Promise<boolean> {
    if (!this.isInitialized) {
      return false;
    }
    
    return this.voiceAnalyzer.stopRecording();
  }
  
  /**
   * 融合多种情感分析结果
   */
  private async fuseEmotions(): Promise<EmotionData> {
    try {
      // 并行分析所有来源
      const [textEmotion, voiceEmotion, behaviorEmotion] = await Promise.all([
        this.textAnalyzer.analyze(),
        // 对于语音，如果没有正在录制，返回默认值
        this.voiceAnalyzer.isCurrentlyRecording() 
          ? Promise.resolve(this.createDefaultEmotionData('voice'))
          : this.voiceAnalyzer.analyze(),
        this.behaviorAnalyzer.analyze()
      ]);
      
      // 应用权重融合
      const fusedEmotion = this.performWeightedFusion([
        { emotion: textEmotion, weight: this.config.fusionWeights!.text },
        { emotion: voiceEmotion, weight: this.config.fusionWeights!.voice },
        { emotion: behaviorEmotion, weight: this.config.fusionWeights!.behavior }
      ]);
      
      // 应用时间平滑
      const smoothedEmotion = this.applyTemporalSmoothing(fusedEmotion);
      
      // 应用情感平滑
      const finalEmotion = this.applyEmotionSmoothing(smoothedEmotion);
      
      // 存储最近的情感数据
      this.storeRecentEmotion(finalEmotion);
      
      // 触发回调
      if (this.fusionCallback) {
        this.fusionCallback(finalEmotion);
      }
      
      return finalEmotion;
    } catch (error) {
      console.error('Emotion fusion failed:', error);
      const defaultEmotion = this.createDefaultEmotionData('fusion');
      
      if (this.fusionCallback) {
        this.fusionCallback(defaultEmotion);
      }
      
      return defaultEmotion;
    }
  }
  
  /**
   * 执行加权融合
   */
  private performWeightedFusion(sources: Array<{ emotion: EmotionData; weight: number }>): EmotionData {
    let totalWeight = 0;
    let weightedValence = 0;
    let weightedArousal = 0;
    let weightedConfidence = 0;
    
    // 计算加权平均值
    sources.forEach(source => {
      weightedValence += source.emotion.valence * source.weight * source.emotion.confidence;
      weightedArousal += source.emotion.arousal * source.weight * source.emotion.confidence;
      weightedConfidence += source.weight * source.emotion.confidence;
      totalWeight += source.weight;
    });
    
    // 归一化
    const valence = weightedConfidence > 0 ? weightedValence / weightedConfidence : 0;
    const arousal = weightedConfidence > 0 ? weightedArousal / weightedConfidence : 0.5;
    const confidence = totalWeight > 0 ? weightedConfidence / totalWeight : 0.5;
    
    // 确定主要情绪（基于效价-唤醒度）
    const primary = this.determinePrimaryEmotionFromValenceArousal(valence, arousal);
    
    return {
      primary,
      confidence,
      valence: Math.max(-1, Math.min(1, valence)),
      arousal: Math.max(0, Math.min(1, arousal)),
      timestamp: Date.now(),
      source: 'fused'
    };
  }
  
  /**
   * 应用时间平滑
   */
  private applyTemporalSmoothing(currentEmotion: EmotionData): EmotionData {
    if (this.recentEmotions.length === 0) {
      return currentEmotion;
    }
    
    // 使用指数加权移动平均
    const alpha = 0.3; // 平滑因子
    const recentEmotion = this.recentEmotions[this.recentEmotions.length - 1];
    
    return {
      ...currentEmotion,
      valence: recentEmotion.valence * (1 - alpha) + currentEmotion.valence * alpha,
      arousal: recentEmotion.arousal * (1 - alpha) + currentEmotion.arousal * alpha,
      confidence: recentEmotion.confidence * (1 - alpha) + currentEmotion.confidence * alpha
    };
  }
  
  /**
   * 应用情感平滑
   */
  private applyEmotionSmoothing(emotion: EmotionData): EmotionData {
    // 情感平滑逻辑：避免情感在短期内剧烈波动
    const { valence, arousal } = emotion;
    
    // 如果情感变化过大，可以进一步平滑
    if (this.recentEmotions.length > 0) {
      const previousEmotion = this.recentEmotions[this.recentEmotions.length - 1];
      const valenceDiff = Math.abs(valence - previousEmotion.valence);
      const arousalDiff = Math.abs(arousal - previousEmotion.arousal);
      
      // 如果变化过大，进一步平滑
      if (valenceDiff > 0.5 || arousalDiff > 0.5) {
        const smoothingFactor = 0.7;
        return {
          ...emotion,
          valence: previousEmotion.valence * smoothingFactor + valence * (1 - smoothingFactor),
          arousal: previousEmotion.arousal * smoothingFactor + arousal * (1 - smoothingFactor)
        };
      }
    }
    
    return emotion;
  }
  
  /**
   * 存储最近的情感数据
   */
  private storeRecentEmotion(emotion: EmotionData): void {
    this.recentEmotions.push(emotion);
    
    // 保持最近情感数据的数量限制
    if (this.recentEmotions.length > this.maxRecentEmotions) {
      this.recentEmotions.shift();
    }
  }
  
  /**
   * 基于效价和唤醒度确定主要情绪
   */
  private determinePrimaryEmotionFromValenceArousal(valence: number, arousal: number): string {
    // 基于效价-唤醒度二维空间确定主要情绪
    if (valence > 0.3) {
      if (arousal > 0.6) return 'happiness';
      if (arousal < 0.4) return 'happiness';
    } else if (valence < -0.3) {
      if (arousal > 0.6) return 'anger';
      return 'sadness';
    }
    
    if (arousal > 0.7) return 'surprise';
    if (valence < -0.2 && arousal < 0.4) return 'disgust';
    if (valence < -0.3 && arousal > 0.3 && arousal < 0.6) return 'fear';
    
    return 'neutral';
  }
  
  /**
   * 创建默认情感数据
   */
  private createDefaultEmotionData(source: string): EmotionData {
    return {
      primary: 'neutral',
      confidence: 1.0,
      timestamp: Date.now(),
      valence: 0,
      arousal: 0.5,
      source
    };
  }
  
  /**
   * 获取当前融合的情感数据
   */
  async getCurrentEmotion(): Promise<EmotionData> {
    if (this.recentEmotions.length > 0) {
      return this.recentEmotions[this.recentEmotions.length - 1];
    }
    
    // 如果没有历史数据，执行一次融合
    return this.fuseEmotions();
  }
  
  /**
   * 获取情感历史数据
   */
  getEmotionHistory(): EmotionData[] {
    return [...this.recentEmotions];
  }
  
  /**
   * 清理资源
   */
  dispose(): void {
    this.textAnalyzer.dispose();
    this.voiceAnalyzer.dispose();
    this.behaviorAnalyzer.dispose();
    this.recentEmotions = [];
    this.fusionCallback = undefined;
    this.isInitialized = false;
  }
}