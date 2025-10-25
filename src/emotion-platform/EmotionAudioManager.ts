import { EmotionData, AudioParams, SoundEffect } from './types';

// 类型定义扩展
declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

/**
 * 情感音效管理器
 * 使用Web Audio API基于情感状态提供音频反馈
 */
export class EmotionAudioManager {
  private audioContext: AudioContext | null = null;
  private oscillators: Map<string, OscillatorNode> = new Map();
  private gainNodes: Map<string, GainNode> = new Map();
  private soundEffects: Map<string, SoundEffect> = new Map();
  private isInitialized = false;
  private masterVolume = 0.3;
  private emotionHistory: EmotionData[] = [];
  private maxHistoryLength = 5;

  /**
   * 初始化音频上下文
   * @returns 初始化是否成功
   */
  async initialize(): Promise<boolean> {
    try {
      // 创建音频上下文
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // 预定义情感音效
        this.setupDefaultSoundEffects();
        
        this.isInitialized = true;
        console.log('EmotionAudioManager initialized successfully');
      }
      return true;
    } catch (error) {
      console.error('Failed to initialize EmotionAudioManager:', error);
      return false;
    }
  }

  /**
   * 设置默认音效映射
   */
  private setupDefaultSoundEffects(): void {
    // 为每种基本情绪设置对应的音效参数
    const defaultEffects: Record<string, SoundEffect> = {
      happiness: {
        type: 'sine',
        frequency: 523.25, // C5
        duration: 1000,
        volume: 0.6,
        fadeIn: 100,
        fadeOut: 300,
        delay: 0
      },
      anger: {
        type: 'sawtooth',
        frequency: 220.00, // A3
        duration: 800,
        volume: 0.8,
        fadeIn: 50,
        fadeOut: 200,
        delay: 0
      },
      sadness: {
        type: 'triangle',
        frequency: 195.99, // G3
        duration: 1500,
        volume: 0.4,
        fadeIn: 300,
        fadeOut: 600,
        delay: 0
      },
      fear: {
        type: 'square',
        frequency: 440.00, // A4
        duration: 600,
        volume: 0.7,
        fadeIn: 150,
        fadeOut: 100,
        delay: 0,
        modulator: {
          type: 'sine',
          frequency: 5,
          depth: 10
        }
      },
      surprise: {
        type: 'sine',
        frequency: 1046.50, // C6
        duration: 500,
        volume: 0.6,
        fadeIn: 50,
        fadeOut: 200,
        delay: 0
      },
      disgust: {
        type: 'sawtooth',
        frequency: 110.00, // A2
        duration: 1200,
        volume: 0.5,
        fadeIn: 200,
        fadeOut: 400,
        delay: 0
      }
    };

    // 将默认音效添加到映射中
    Object.entries(defaultEffects).forEach(([emotion, effect]) => {
      this.soundEffects.set(emotion, effect);
    });
  }

  /**
   * 根据情感数据更新音效参数
   * @param emotion 情感数据
   * @returns 更新后的音频参数
   */
  updateAudioForEmotion(emotion: EmotionData): AudioParams {
    // 记录情感历史
    this.emotionHistory.push(emotion);
    if (this.emotionHistory.length > this.maxHistoryLength) {
      this.emotionHistory.shift();
    }

    const { primary, valence, arousal, intensity } = emotion;
    
    // 获取基础音效或创建默认音效
    const baseEffect = this.soundEffects.get(primary) || this.createDefaultEffect();
    
    // 计算音频参数
    const audioParams = this.calculateAudioParams(baseEffect, valence ?? 0, arousal ?? 0, intensity ?? 0);
    
    return audioParams;
  }

  /**
   * 计算音频参数
   */
  private calculateAudioParams(
    baseEffect: SoundEffect,
    valence: number,
    arousal: number,
    intensity: number
  ): AudioParams {
    // 效价影响音高：积极情绪音高较高，消极情绪音高较低
    const pitchFactor = 1 + (valence * 0.5);
    
    // 唤醒度影响节奏和音量：高唤醒度节奏更快，音量更大
    const tempoFactor = 1 + (arousal * 0.8);
    const volumeFactor = 0.5 + (arousal * 0.5);
    
    // 强度影响整体表现力
    const intensityFactor = 0.5 + (intensity * 0.5);
    
    // 计算具体参数
    const frequency = baseEffect.frequency * pitchFactor;
    const duration = baseEffect.duration / tempoFactor;
    const volume = Math.min(1.0, baseEffect.volume * volumeFactor * intensityFactor * this.masterVolume);
    
    // 根据情感调整音色
    let type = baseEffect.type;
    if (valence > 0.7) {
      type = 'sine'; // 积极情绪使用正弦波
    } else if (valence < -0.7) {
      type = 'sawtooth'; // 消极情绪使用锯齿波
    }
    
    return {
      type,
      frequency,
      duration,
      volume,
      fadeIn: baseEffect.fadeIn || 0,
      fadeOut: baseEffect.fadeOut || 0,
      delay: baseEffect.delay || 0,
      modulator: baseEffect.modulator
    };
  }

  /**
   * 创建默认音效
   */
  private createDefaultEffect(): SoundEffect {
    return {
      type: 'sine',
      frequency: 440.00, // A4
      duration: 800,
      volume: 0.5,
      fadeIn: 100,
      fadeOut: 200,
      delay: 0
    };
  }

  /**
   * 播放与情感匹配的音效
   * @param emotionData 情感数据
   * @returns 播放是否成功
   */
  async playEmotionSound(emotionData: EmotionData): Promise<boolean> {
    try {
      // 确保已初始化
      if (!this.isInitialized) {
        const success = await this.initialize();
        if (!success) {
          return false;
        }
      }

      // 确保音频上下文处于运行状态
      if (this.audioContext?.state === 'suspended') {
        await this.audioContext.resume();
      }

      // 停止之前的音效
      this.stopAllSounds();

      // 更新并获取音频参数
      const audioParams = this.updateAudioForEmotion(emotionData);
      
      // 播放音效
      this.playSound(audioParams, emotionData.primary);
      
      return true;
    } catch (error) {
      console.error('Failed to play emotion sound:', error);
      return false;
    }
  }

  /**
   * 播放指定参数的音效
   */
  private playSound(audioParams: AudioParams, id: string): void {
    if (!this.audioContext) return;

    // 创建振荡器
    const oscillator = this.audioContext.createOscillator();
    oscillator.type = audioParams.type;
    oscillator.frequency.setValueAtTime(audioParams.frequency, this.audioContext.currentTime);
    
    // 创建增益节点
    const gainNode = this.audioContext.createGain();
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    
    // 应用淡入
    gainNode.gain.linearRampToValueAtTime(
      audioParams.volume,
      this.audioContext.currentTime + audioParams.fadeIn / 1000
    );
    
    // 应用淡出
      gainNode.gain.setValueAtTime(
        audioParams.volume,
        this.audioContext.currentTime + (audioParams.duration - (audioParams.fadeOut || 0)) / 1000
      );
    gainNode.gain.linearRampToValueAtTime(
      0,
      this.audioContext.currentTime + audioParams.duration / 1000
    );
    
    // 如果有调制器，添加频率调制效果
    if (audioParams.modulator) {
      const modulator = this.audioContext.createOscillator();
      modulator.type = audioParams.modulator.type;
      modulator.frequency.setValueAtTime(audioParams.modulator.frequency, this.audioContext.currentTime);
      
      const modulatorGain = this.audioContext.createGain();
      modulatorGain.gain.setValueAtTime(audioParams.modulator.depth, this.audioContext.currentTime);
      
      modulator.connect(modulatorGain);
      modulatorGain.connect(oscillator.frequency);
      modulator.start();
      modulator.stop(this.audioContext.currentTime + audioParams.duration / 1000);
    }
    
    // 连接节点
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    // 存储引用以便后续控制
    this.oscillators.set(id, oscillator);
    this.gainNodes.set(id, gainNode);
    
    // 启动振荡器
    oscillator.start(this.audioContext.currentTime + audioParams.delay / 1000);
    oscillator.stop(this.audioContext.currentTime + (audioParams.duration + audioParams.delay) / 1000);
    
    // 清理引用
    oscillator.onended = () => {
      this.oscillators.delete(id);
      this.gainNodes.delete(id);
    };
  }

  /**
   * 停止所有音效
   */
  stopAllSounds(): void {
    if (!this.audioContext) return;
    
    // 停止所有活动的振荡器
    this.oscillators.forEach((oscillator, id) => {
      try {
        const gainNode = this.gainNodes.get(id);
        if (gainNode && this.audioContext) {
          // 快速淡出
          gainNode.gain.cancelScheduledValues(this.audioContext.currentTime);
          gainNode.gain.setValueAtTime(
            gainNode.gain.value,
            this.audioContext.currentTime
          );
          gainNode.gain.exponentialRampToValueAtTime(
            0.001,
            this.audioContext.currentTime + 0.1
          );
        }
        
        if (this.audioContext) {
          oscillator.stop(this.audioContext.currentTime + 0.1);
        }
      } catch {
          // 忽略已经停止的振荡器错误
        }
    });
    
    // 清空引用
    this.oscillators.clear();
    this.gainNodes.clear();
  }

  /**
   * 设置主音量
   * @param volume 音量值（0-1）
   */
  setVolume(volume: number): void {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    
    // 更新当前播放的所有音效音量
    this.gainNodes.forEach(gainNode => {
      if (this.audioContext) {
        const currentVolume = gainNode.gain.value / this.masterVolume;
        gainNode.gain.setValueAtTime(
          currentVolume * this.masterVolume,
          this.audioContext.currentTime
        );
      }
    });
  }

  /**
   * 添加自定义音效
   * @param emotion 情感类型
   * @param effect 音效参数
   */
  addCustomEffect(emotion: string, effect: SoundEffect): void {
    this.soundEffects.set(emotion, effect);
  }

  /**
   * 暂停音频上下文
   */
  async suspend(): Promise<void> {
    if (this.audioContext && this.audioContext.state === 'running') {
      await this.audioContext.suspend();
    }
  }

  /**
   * 恢复音频上下文
   */
  async resume(): Promise<void> {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  /**
   * 释放资源
   */
  dispose(): void {
    this.stopAllSounds();
    
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    
    this.isInitialized = false;
    this.emotionHistory = [];
  }
}