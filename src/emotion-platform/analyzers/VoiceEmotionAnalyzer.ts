import { BaseEmotionAnalyzer } from './BaseEmotionAnalyzer';
import { EmotionData } from '../types';

/**
 * 语音情感分析器
 * 分析语音输入中的情感特征
 */
export class VoiceEmotionAnalyzer extends BaseEmotionAnalyzer {
  private audioContext: AudioContext | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private audioStream: MediaStream | null = null;
  private audioChunks: Blob[] = [];
  private isRecording: boolean = false;
  private recordingTimeout: number | null = null;
  private recordingTimeoutDuration: number;
  private analysisCallback?: (emotionData: EmotionData) => void;
  
  constructor(recordingTimeoutDuration: number = 5000) {
    super('voice');
    this.recordingTimeoutDuration = recordingTimeoutDuration;
  }
  
  /**
   * 初始化音频上下文
   * @returns Promise<boolean> 初始化是否成功
   */
  async init(): Promise<boolean> {
    try {
      // 创建音频上下文
      this.audioContext = new (window.AudioContext || (window as Window & typeof globalThis).webkitAudioContext)();
      return true;
    } catch (error) {
      console.error('Failed to initialize audio context:', error);
      return false;
    }
  }
  
  /**
   * 开始录制音频
   * @returns Promise<boolean> 录制是否开始成功
   */
  async startRecording(): Promise<boolean> {
    try {
      // 如果正在录制，先停止
      if (this.isRecording) {
        await this.stopRecording();
      }
      
      // 获取麦克风权限
      this.audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // 创建媒体录制器
      this.mediaRecorder = new MediaRecorder(this.audioStream);
      this.audioChunks = [];
      
      // 监听数据可用事件
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };
      
      // 监听录制结束事件
      this.mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
        await this.analyzeAudioBlob(audioBlob);
      };
      
      // 开始录制
      this.mediaRecorder.start();
      this.isRecording = true;
      
      // 设置自动停止超时
      this.recordingTimeout = window.setTimeout(() => {
        this.stopRecording();
      }, this.recordingTimeoutDuration);
      
      return true;
    } catch (error) {
      console.error('Failed to start recording:', error);
      return false;
    }
  }
  
  /**
   * 停止录制音频
   * @returns Promise<boolean> 停止是否成功
   */
  async stopRecording(): Promise<boolean> {
    try {
      if (!this.isRecording || !this.mediaRecorder) {
        return false;
      }
      
      // 清除超时计时器
      if (this.recordingTimeout) {
        clearTimeout(this.recordingTimeout);
        this.recordingTimeout = null;
      }
      
      // 停止录制
      this.mediaRecorder.stop();
      this.isRecording = false;
      
      // 停止音频流
      if (this.audioStream) {
        this.audioStream.getTracks().forEach(track => track.stop());
        this.audioStream = null;
      }
      
      return true;
    } catch (error) {
      console.error('Failed to stop recording:', error);
      return false;
    }
  }
  
  /**
   * 分析音频数据
   * @param audioBlob 音频数据块
   * @returns Promise<EmotionData> 情感分析结果
   */
  private async analyzeAudioBlob(audioBlob: Blob): Promise<EmotionData> {
    try {
      // 从Blob创建ArrayBuffer
      const arrayBuffer = await this.blobToArrayBuffer(audioBlob);
      
      // 分析音频特征
      const audioFeatures = this.extractAudioFeatures(arrayBuffer);
      
      // 基于音频特征分析情感
      const emotionData = this.analyzeEmotionFromFeatures(audioFeatures);
      
      // 触发回调
      if (this.analysisCallback) {
        this.analysisCallback(emotionData);
      }
      
      return emotionData;
    } catch (error) {
      console.error('Audio emotion analysis failed:', error);
      const defaultData = this.createDefaultEmotionData();
      
      if (this.analysisCallback) {
        this.analysisCallback(defaultData);
      }
      
      return defaultData;
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
   * 分析情感（此方法用于符合基类接口，但语音分析主要通过录制触发）
   * @returns Promise<EmotionData> 情感分析结果
   */
  async analyze(): Promise<EmotionData> {
    // 如果正在录制，返回默认数据
    if (this.isRecording) {
      return this.createDefaultEmotionData();
    }
    
    // 启动录制并返回默认数据，真正的分析会在录制结束后通过回调返回
    await this.startRecording();
    return this.createDefaultEmotionData();
  }
  
  /**
   * 从Blob提取ArrayBuffer
   * @param blob 音频Blob数据
   * @returns Promise<ArrayBuffer> 提取的ArrayBuffer
   */
  private blobToArrayBuffer(blob: Blob): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = reject;
      reader.readAsArrayBuffer(blob);
    });
  }
  
  /**
   * 提取音频特征
   * @param arrayBuffer 音频数据的ArrayBuffer
   * @returns 提取的音频特征
   */
  private extractAudioFeatures(arrayBuffer: ArrayBuffer): {
    volume: number;
    pitch: number;
    pitchVariance: number;
    energy: number;
  } {
    // 这是一个简化的音频特征提取实现
    // 在实际应用中，应该使用更复杂的音频处理库
    
    // 创建一个Float32Array来存储音频数据
    const audioData = new Float32Array(arrayBuffer);
    
    // 计算平均音量
    let sumSquares = 0;
    for (let i = 0; i < audioData.length; i++) {
      sumSquares += audioData[i] * audioData[i];
    }
    const rms = Math.sqrt(sumSquares / audioData.length);
    
    // 简化的音高估计（基于能量分布）
    const pitch = Math.min(1, rms * 10); // 范围 0-1
    
    // 计算音高变化（简化版）
    const pitchVariance = rms * 5; // 范围 0-5，映射到唤醒度
    
    // 计算能量
    const energy = rms * 2; // 范围 0-2，归一化到 0-1
    
    return {
      volume: Math.min(1, rms * 3),
      pitch,
      pitchVariance: Math.min(1, pitchVariance),
      energy: Math.min(1, energy)
    };
  }
  
  /**
   * 基于音频特征分析情感
   * @param features 音频特征
   * @returns 情感分析结果
   */
  private analyzeEmotionFromFeatures(features: {
    volume: number;
    pitch: number;
    pitchVariance: number;
    energy: number;
  }): EmotionData {
    // 基于音量和能量判断唤醒度
    const arousal = Math.min(1, (features.volume + features.energy + features.pitchVariance) / 3);
    
    // 基于音高和音高变化判断效价
    // 较高的音高通常与积极情绪相关，但过高可能表示紧张或愤怒
    let valence = (features.pitch - 0.5) * 2;
    
    // 调整：如果音量和能量都很高，但音高适中，可能是积极的兴奋
    if (features.volume > 0.7 && features.energy > 0.7 && features.pitch > 0.4 && features.pitch < 0.8) {
      valence = Math.min(1, valence + 0.3);
    }
    
    // 调整：如果音量高但音高低，可能是愤怒
    if (features.volume > 0.7 && features.pitch < 0.4) {
      valence = Math.max(-1, valence - 0.4);
    }
    
    // 确定主要情绪
    let primary = 'neutral';
    let confidence = 0.5;
    
    if (valence > 0.3) {
      if (arousal > 0.7) {
        primary = 'happiness';
        confidence = Math.min(1, (valence + arousal) / 2);
      } else if (arousal < 0.4) {
        primary = 'happiness';
        confidence = Math.min(1, valence);
      }
    } else if (valence < -0.3) {
      if (arousal > 0.6) {
        primary = 'anger';
        confidence = Math.min(1, Math.abs(valence));
      } else {
        primary = 'sadness';
        confidence = Math.min(1, Math.abs(valence) * 0.8);
      }
    }
    
    // 高唤醒度且中等效价可能是惊讶
    if (arousal > 0.8 && Math.abs(valence) < 0.5) {
      primary = 'surprise';
      confidence = arousal;
    }
    
    return this.normalizeEmotionData({
      primary,
      confidence,
      valence,
      arousal,
      timestamp: Date.now(),
      source: this.source
    });
  }
  
  /**
   * 获取录制状态
   * @returns 是否正在录制
   */
  isCurrentlyRecording(): boolean {
    return this.isRecording;
  }
  
  /**
   * 清理资源
   */
  dispose(): void {
    // 停止录制
    if (this.isRecording) {
      this.stopRecording().catch(console.error);
    }
    
    // 清除超时计时器
    if (this.recordingTimeout) {
      clearTimeout(this.recordingTimeout);
      this.recordingTimeout = null;
    }
    
    // 关闭音频上下文
    if (this.audioContext) {
      this.audioContext.close().catch(console.error);
      this.audioContext = null;
    }
    
    // 清除其他资源
    this.mediaRecorder = null;
    this.audioStream = null;
    this.audioChunks = [];
    this.analysisCallback = undefined;
  }
}