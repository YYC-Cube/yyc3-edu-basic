// YYC³ 情感声效交互平台 - 核心模块
// 基于言语云立方³架构的情感化智能交互系统

import React, { createContext, useContext, useRef, useEffect, useCallback } from 'react'
// 临时定义YYC3CubeModule接口以避免导入错误
export interface YYC3CubeModule {
  metadata: {
    id: string;
    name: string;
    version: string;
    description: string;
    author: string;
    license: string;
    category: string;
    tags: string[];
    brandCompliance: object;
    createdAt: Date;
    updatedAt: Date;
    repository: string;
    documentation: string;
  };
  config: {
    enabled: boolean;
    autoStart: boolean;
    priority: number;
    environment: object;
    resources: object;
    parameters: object;
  };
  dependencies: Array<{
    id: string;
    version: string;
    type: string;
    source: string;
  }>;
  lifecycle: {
    onInit: string;
    onStart: string;
    onStop: string;
    onDestroy: string;
  };
  capabilities: Array<{
    name: string;
    type: string;
    interface: string;
    version: string;
    description: string;
  }>;
  status: {
    phase: string;
    healthy: boolean;
    lastActivity: Date;
    metrics: object;
    errors: string[];
  };
}

// YYC³ 情感状态定义
export interface YYC3EmotionState {
  // 核心情感维度 (基于Russell的情感环型模型)
  valence: number      // 效价 [-1, 1]: 负面到正面
  arousal: number      // 唤醒度 [-1, 1]: 平静到兴奋
  dominance: number    // 支配性 [-1, 1]: 被动到主动
  
  // 基础情绪分类 (Ekman六基本情绪)
  primaryEmotion: YYC3PrimaryEmotion
  emotionIntensity: number  // [0, 1]: 情绪强度
  
  // 复合情绪
  secondaryEmotions: YYC3EmotionComponent[]
  
  // 置信度和时间戳
  confidence: number
  timestamp: Date
  duration?: number    // 情绪持续时间预估
  
  // 上下文信息
  trigger?: YYC3EmotionTrigger
  context?: YYC3EmotionContext
}

// YYC³ 基础情绪枚举
export enum YYC3PrimaryEmotion {
  JOY = 'joy',           // 快乐
  SADNESS = 'sadness',   // 悲伤
  ANGER = 'anger',       // 愤怒
  FEAR = 'fear',         // 恐惧
  SURPRISE = 'surprise', // 惊讶
  DISGUST = 'disgust',   // 厌恶
  NEUTRAL = 'neutral'    // 中性
}

// YYC³ 情绪成分
export interface YYC3EmotionComponent {
  emotion: YYC3PrimaryEmotion
  weight: number    // [0, 1]: 该情绪的权重
}

// YYC³ 情绪触发源
export interface YYC3EmotionTrigger {
  type: 'text' | 'voice' | 'visual' | 'behavior' | 'system'
  source: string
  content?: string | number | boolean | object | null
}

// YYC³ 情绪上下文
export interface YYC3EmotionContext {
  userId?: string
  sessionId: string
  deviceType: string
  environment: 'work' | 'entertainment' | 'education' | 'social' | 'personal'
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night'
  previousEmotions: YYC3EmotionState[]
}

// YYC³ 声效参数
export interface YYC3SoundParameters {
  // 基础音频参数
  frequency: number      // 频率 (Hz)
  amplitude: number      // 振幅 [0, 1]
  duration: number       // 持续时间 (ms)
  
  // 音色参数
  waveform: YYC3Waveform    // 波形类型
  harmonics: number[]       // 泛音列表
  envelope: YYC3SoundEnvelope  // 包络参数
  
  // 空间音频
  spatialPosition?: YYC3SpatialPosition
  reverbLevel?: number      // 混响级别 [0, 1]
  
  // 情感映射参数
  emotionalTone: YYC3EmotionalTone
  adaptiveParams: YYC3AdaptiveParameters
}

// YYC³ 波形类型
export enum YYC3Waveform {
  SINE = 'sine',
  SQUARE = 'square',
  SAWTOOTH = 'sawtooth',
  TRIANGLE = 'triangle',
  NOISE = 'noise',
  CUSTOM = 'custom'
}

// YYC³ 声音包络
export interface YYC3SoundEnvelope {
  attack: number    // 起音时间 (ms)
  decay: number     // 衰减时间 (ms)
  sustain: number   // 延音级别 [0, 1]
  release: number   // 释音时间 (ms)
}

// YYC³ 空间位置
export interface YYC3SpatialPosition {
  x: number    // 水平位置 [-1, 1]
  y: number    // 垂直位置 [-1, 1]
  z: number    // 深度位置 [-1, 1]
  distance: number  // 距离 [0, 1]
}

// YYC³ 情感音调
export interface YYC3EmotionalTone {
  warmth: number      // 温暖度 [-1, 1]
  brightness: number  // 明亮度 [-1, 1]
  roughness: number   // 粗糙度 [0, 1]
  clarity: number     // 清晰度 [0, 1]
}

// YYC³ 自适应参数
export interface YYC3AdaptiveParameters {
  userPreference: number     // 用户偏好权重 [0, 1]
  contextSensitivity: number // 上下文敏感度 [0, 1]
  learningRate: number       // 学习率 [0, 1]
}

// YYC³ 情感音效映射器
export class YYC3EmotionSoundMapper {
  private brandId: string = 'YYC3'
  private version: string = '1.0.0'
  
  // 核心映射方法：情感状态到声效参数
  public mapEmotionToSound(emotion: YYC3EmotionState): YYC3SoundParameters {
    const { valence, arousal, dominance, primaryEmotion, emotionIntensity } = emotion
    
    return {
      // 基于效价映射频率 (正面情绪 -> 高频, 负面情绪 -> 低频)
      frequency: this.mapValenceToFrequency(valence, primaryEmotion),
      
      // 基于唤醒度映射振幅 (高唤醒 -> 大振幅)
      amplitude: this.mapArousalToAmplitude(arousal, emotionIntensity),
      
      // 基于情绪强度映射持续时间
      duration: this.mapIntensityToDuration(emotionIntensity, arousal),
      
      // 基于主要情绪映射波形
      waveform: this.mapEmotionToWaveform(primaryEmotion),
      
      // 基于支配性映射泛音
      harmonics: this.mapDominanceToHarmonics(dominance), // 修复参数数量，只传递一个参数
      
      // 基于情绪类型映射包络
      envelope: this.mapEmotionToEnvelope(primaryEmotion, arousal),
      
      // 生成情感音调
      emotionalTone: this.generateEmotionalTone(emotion),
      
      // 生成自适应参数
      adaptiveParams: this.generateAdaptiveParams(emotion)
    }
  }
  
  private mapValenceToFrequency(valence: number, emotion: YYC3PrimaryEmotion): number {
    const baseFrequency = 440 // A4基准频率
    
    // 情绪特定的频率偏移
    const emotionOffsets: Record<YYC3PrimaryEmotion, number> = {
      [YYC3PrimaryEmotion.JOY]: 1.2,      // 快乐 -> 明亮高频
      [YYC3PrimaryEmotion.SURPRISE]: 1.4,  // 惊讶 -> 更高频率
      [YYC3PrimaryEmotion.ANGER]: 0.8,     // 愤怒 -> 中低频
      [YYC3PrimaryEmotion.FEAR]: 1.1,      // 恐惧 -> 略高频
      [YYC3PrimaryEmotion.SADNESS]: 0.6,   // 悲伤 -> 低频
      [YYC3PrimaryEmotion.DISGUST]: 0.7,   // 厌恶 -> 较低频
      [YYC3PrimaryEmotion.NEUTRAL]: 1.0    // 中性 -> 基准频率
    }
    
    // 效价影响频率：正面情绪倾向高频，负面情绪倾向低频
    const valenceMultiplier = 0.8 + (valence + 1) * 0.4 // 0.8 - 1.6
    const emotionMultiplier = emotionOffsets[emotion]
    
    return baseFrequency * valenceMultiplier * emotionMultiplier
  }
  
  private mapArousalToAmplitude(arousal: number, intensity: number): number {
    // 唤醒度越高，振幅越大；情绪强度也影响振幅
    const baseAmplitude = 0.3
    const arousalFactor = (arousal + 1) / 2 // 标准化到 [0, 1]
    const intensityFactor = intensity
    
    return Math.min(baseAmplitude * (0.5 + arousalFactor * 0.8) * (0.7 + intensityFactor * 0.3), 1.0)
  }
  
  private mapIntensityToDuration(intensity: number, arousal: number): number {
    // 情绪强度越高，持续时间越长；高唤醒度会缩短持续时间
    const baseDuration = 800 // 800ms基础持续时间
    const intensityMultiplier = 0.5 + intensity * 1.0  // 0.5 - 1.5
    const arousalMultiplier = 1.2 - Math.abs(arousal) * 0.4  // 0.8 - 1.2
    
    return baseDuration * intensityMultiplier * arousalMultiplier
  }
  
  private mapEmotionToWaveform(emotion: YYC3PrimaryEmotion): YYC3Waveform {
    const emotionWaveforms: Record<YYC3PrimaryEmotion, YYC3Waveform> = {
      [YYC3PrimaryEmotion.JOY]: YYC3Waveform.SINE,      // 快乐 -> 纯净正弦波
      [YYC3PrimaryEmotion.SURPRISE]: YYC3Waveform.TRIANGLE, // 惊讶 -> 锐利三角波
      [YYC3PrimaryEmotion.ANGER]: YYC3Waveform.SQUARE,   // 愤怒 -> 尖锐方波
      [YYC3PrimaryEmotion.FEAR]: YYC3Waveform.SAWTOOTH,  // 恐惧 -> 不稳定锯齿波
      [YYC3PrimaryEmotion.SADNESS]: YYC3Waveform.SINE,   // 悲伤 -> 柔和正弦波
      [YYC3PrimaryEmotion.DISGUST]: YYC3Waveform.NOISE,  // 厌恶 -> 噪声
      [YYC3PrimaryEmotion.NEUTRAL]: YYC3Waveform.SINE    // 中性 -> 基础正弦波
    }
    
    return emotionWaveforms[emotion]
  }
  
  private mapDominanceToHarmonics(dominance: number): number[] {
    const baseHarmonics = [1.0] // 基频
    
    // 支配性高的情绪添加更多泛音，使声音更丰富
    const harmonicCount = Math.floor(2 + Math.abs(dominance) * 3) // 2-5个泛音
    
    for (let i = 2; i <= harmonicCount + 1; i++) {
      const amplitude = Math.pow(0.6, i - 1) * (0.5 + Math.abs(dominance) * 0.5)
      baseHarmonics.push(amplitude)
    }
    
    return baseHarmonics
  }
  
  private mapEmotionToEnvelope(emotion: YYC3PrimaryEmotion, arousal: number): YYC3SoundEnvelope {
    const baseEnvelope: YYC3SoundEnvelope = {
      attack: 50,   // 50ms起音
      decay: 100,   // 100ms衰减
      sustain: 0.7, // 70%延音
      release: 200  // 200ms释音
    }
    
    // 不同情绪的包络特征
    const emotionEnvelopes: Record<YYC3PrimaryEmotion, Partial<YYC3SoundEnvelope>> = {
      [YYC3PrimaryEmotion.JOY]: { attack: 30, sustain: 0.8, release: 150 },     // 快速起音，持续较长
      [YYC3PrimaryEmotion.SURPRISE]: { attack: 10, decay: 50, release: 100 },   // 极快起音，快速衰减
      [YYC3PrimaryEmotion.ANGER]: { attack: 20, sustain: 0.9, release: 300 },   // 快速起音，强烈持续
      [YYC3PrimaryEmotion.FEAR]: { attack: 80, decay: 200, sustain: 0.4 },      // 缓慢起音，不稳定
      [YYC3PrimaryEmotion.SADNESS]: { attack: 100, sustain: 0.6, release: 400 }, // 缓慢起音，长释音
      [YYC3PrimaryEmotion.DISGUST]: { attack: 60, decay: 150, sustain: 0.3 },   // 中等起音，快速衰减
      [YYC3PrimaryEmotion.NEUTRAL]: baseEnvelope                                 // 标准包络
    }
    
    const emotionEnvelope = { ...baseEnvelope, ...emotionEnvelopes[emotion] }
    
    // 唤醒度影响包络时间：高唤醒度 -> 更快的包络
    const arousalFactor = 1 - Math.abs(arousal) * 0.3 // 0.7 - 1.0
    
    return {
      attack: emotionEnvelope.attack * arousalFactor,
      decay: emotionEnvelope.decay * arousalFactor,
      sustain: emotionEnvelope.sustain,
      release: emotionEnvelope.release * arousalFactor
    }
  }
  
  private generateEmotionalTone(emotion: YYC3EmotionState): YYC3EmotionalTone {
    const { valence, arousal, primaryEmotion } = emotion
    
    return {
      // 温暖度：正面情绪更温暖
      warmth: valence * 0.8 + (primaryEmotion === YYC3PrimaryEmotion.JOY ? 0.2 : 0),
      
      // 明亮度：高效价和高唤醒度的情绪更明亮
      brightness: (valence * 0.6) + (arousal * 0.4),
      
      // 粗糙度：负面情绪（特别是愤怒）更粗糙
      roughness: Math.max(0, -valence * 0.7 + (primaryEmotion === YYC3PrimaryEmotion.ANGER ? 0.3 : 0)),
      
      // 清晰度：高置信度和中等唤醒度的情绪更清晰
      clarity: emotion.confidence * (1 - Math.abs(arousal) * 0.3)
    }
  }
  
  private generateAdaptiveParams(emotion: YYC3EmotionState): YYC3AdaptiveParameters {
    return {
      // 用户偏好权重基于情绪强度
      userPreference: emotion.emotionIntensity,
      
      // 上下文敏感度基于情绪复杂性
      contextSensitivity: emotion.secondaryEmotions.length > 0 ? 0.8 : 0.5,
      
      // 学习率基于置信度（低置信度需要更多学习）
      learningRate: 1 - emotion.confidence
    }
  }
}

// YYC³ 音频合成引擎
export class YYC3AudioSynthesizer {
  private audioContext?: AudioContext
  private masterGain?: GainNode
  private activeOscillators: Set<OscillatorNode> = new Set()
  private brandId: string = 'YYC3'
  private isBrowser: boolean
  
  constructor() {
    // 检查是否在浏览器环境中
    this.isBrowser = typeof window !== 'undefined'
    
    // 只在浏览器环境中初始化音频上下文
    if (this.isBrowser) {
      this.audioContext = new window.AudioContext()
      this.masterGain = this.audioContext.createGain()
      this.masterGain.connect(this.audioContext.destination)
      this.masterGain.gain.value = 0.3 // 主音量
    }
  }
  
  public async synthesizeEmotionSound(
    _emotion: YYC3EmotionState,
    soundParams: YYC3SoundParameters
  ): Promise<void> {
    // 检查是否在浏览器环境中
    if (!this.isBrowser || !this.audioContext) {
      return
    }
    
    try {
      // 创建音频节点网络
      const oscillators = this.createOscillators(soundParams)
      const gainNode = this.createGainNode(soundParams)
      const filterNode = this.createFilterNode(soundParams)
      const reverbNode = await this.createReverbNode(soundParams)
      
      // 连接音频节点
      oscillators.forEach(osc => {
          osc.connect(gainNode)
        })
        
        gainNode.connect(filterNode)
        if (reverbNode) {
          filterNode.connect(reverbNode)
          if (this.masterGain) {
            reverbNode.connect(this.masterGain)
          }
        } else {
          if (this.masterGain) {
            filterNode.connect(this.masterGain)
          }
        }
      
      // 应用包络
      this.applyEnvelope(gainNode.gain, soundParams.envelope, soundParams.duration)
      
      // 启动振荡器
      const startTime = this.audioContext.currentTime
      oscillators.forEach((osc) => {
        // 添加轻微的随机延迟以创建更自然的声音
        const randomDelay = Math.random() * 0.01 // 0-10ms随机延迟
        osc.start(startTime + randomDelay)
        
        // 设置停止时间
        const stopTime = startTime + soundParams.duration / 1000 + soundParams.envelope.release / 1000
        osc.stop(stopTime)
        
        // 清理资源
        osc.addEventListener('ended', () => {
          this.activeOscillators.delete(osc)
        })
        
        this.activeOscillators.add(osc)
      })
    } catch (error) {
      console.warn('YYC3EmotionSound: 音频合成失败', error)
    }
  }
  
  private createOscillators(params: YYC3SoundParameters): OscillatorNode[] {
    const oscillators: OscillatorNode[] = []
    
    // 检查是否在浏览器环境中
    if (!this.isBrowser || !this.audioContext) {
      return oscillators
    }
    
    try {
      // 确保 audioContext 存在
      if (!this.audioContext) return oscillators
      
      // 创建基础振荡器
      const mainOsc = this.audioContext.createOscillator()
      mainOsc.type = params.waveform as OscillatorType
      mainOsc.frequency.value = params.frequency
      oscillators.push(mainOsc)
      
      // 创建泛音振荡器
      params.harmonics.slice(1).forEach((amplitude, index) => {
        if (amplitude > 0.05 && this.audioContext) { // 只创建有意义的泛音，并再次检查 audioContext
          const harmonicOsc = this.audioContext.createOscillator()
          harmonicOsc.type = 'sine' // 泛音使用正弦波
          harmonicOsc.frequency.value = params.frequency * (index + 2) // 2次、3次、4次谐波等
          
          // 为泛音创建独立的增益节点
          const harmonicGain = this.audioContext.createGain()
          harmonicGain.gain.value = amplitude
          harmonicOsc.connect(harmonicGain)
          
          oscillators.push(harmonicOsc)
        }
      })
    } catch (error) {
      console.warn('YYC3EmotionSound: 创建振荡器失败', error)
    }
    
    return oscillators
  }
  
  private createGainNode(params: YYC3SoundParameters): GainNode {
    // 检查是否在浏览器环境中
    if (!this.isBrowser || !this.audioContext) {
      return {} as GainNode
    }
    
    try {
      const gainNode = this.audioContext.createGain()
      gainNode.gain.value = params.amplitude
      return gainNode
    } catch (error) {
      console.warn('YYC3EmotionSound: 创建增益节点失败', error)
      return {} as GainNode
    }
  }
  
  private createFilterNode(params: YYC3SoundParameters): BiquadFilterNode {
    // 检查是否在浏览器环境中
    if (!this.isBrowser || !this.audioContext) {
      return {} as BiquadFilterNode
    }
    
    try {
      const filter = this.audioContext.createBiquadFilter()
      
      // 基于情感音调设置滤波器参数
      const tone = params.emotionalTone
      
      // 明亮度影响截止频率
      filter.frequency.value = 1000 + tone.brightness * 2000 // 1000-3000Hz
      
      // 温暖度影响滤波器类型和Q值
      if (tone.warmth > 0) {
        filter.type = 'lowpass' // 温暖 -> 低通滤波
        filter.Q.value = 1 + tone.warmth * 2 // 1-3
      } else {
        filter.type = 'highpass' // 冷酷 -> 高通滤波
        filter.Q.value = 1 + Math.abs(tone.warmth) // 1-2
      }
      
      return filter;
    } catch (error) {
      console.warn('YYC3EmotionSound: 创建滤波器节点失败', error)
      return {} as BiquadFilterNode
    }
  }
  
  private async createReverbNode(params: YYC3SoundParameters): Promise<ConvolverNode | null> {
    // 检查是否在浏览器环境中
    if (!this.isBrowser || !this.audioContext) {
      return null
    }
    
    if (!params.reverbLevel || params.reverbLevel < 0.1) return null
    
    try {
      const convolver = this.audioContext.createConvolver()
      
      // 创建人工混响脉冲响应
      const length = this.audioContext.sampleRate * 2 // 2秒混响
      const impulse = this.audioContext.createBuffer(2, length, this.audioContext.sampleRate)
      
      for (let channel = 0; channel < 2; channel++) {
        const channelData = impulse.getChannelData(channel)
        for (let i = 0; i < length; i++) {
          const decay = Math.pow(1 - i / length, 2) * params.reverbLevel
          channelData[i] = (Math.random() * 2 - 1) * decay
        }
      }
      
      convolver.buffer = impulse
      
      // 创建湿/干混合
      const wetGain = this.audioContext.createGain()
      const dryGain = this.audioContext.createGain()
      wetGain.gain.value = params.reverbLevel
      dryGain.gain.value = 1 - params.reverbLevel
      
      return convolver
    } catch (error) {
      console.warn('YYC3EmotionSound: 创建混响节点失败', error)
      return null
    }
  }
  
  private applyEnvelope(
    gainParam: AudioParam,
    envelope: YYC3SoundEnvelope,
    duration: number
  ): void {
    // 检查是否在浏览器环境中
    if (!this.isBrowser || !this.audioContext || !gainParam || typeof gainParam.setValueAtTime !== 'function') {
      return
    }
    
    try {
      const now = this.audioContext.currentTime
      const attackTime = envelope.attack / 1000
      const decayTime = envelope.decay / 1000
      const releaseTime = envelope.release / 1000
      const totalDuration = duration / 1000
      
      // 起音阶段
      gainParam.setValueAtTime(0, now)
      gainParam.linearRampToValueAtTime(1, now + attackTime)
      
      // 衰减阶段
      gainParam.linearRampToValueAtTime(envelope.sustain, now + attackTime + decayTime)
      
      // 延音阶段
      gainParam.setValueAtTime(envelope.sustain, now + totalDuration - releaseTime)
      
      // 释音阶段
      gainParam.linearRampToValueAtTime(0, now + totalDuration)
    } catch (error) {
      console.warn('YYC3EmotionSound: 应用包络失败', error)
    }
  }
  
  public stopAllSounds(): void {
    this.activeOscillators.forEach(osc => {
      try {
        osc.stop()
      } catch {
        // 忽略已经停止的振荡器
      }
    })
    this.activeOscillators.clear()
  }
  
  public setMasterVolume(volume: number): void {
    // 检查是否在浏览器环境中，以及 masterGain 和 audioContext 是否存在
    if (!this.isBrowser || !this.masterGain || !this.audioContext) {
      return
    }
    
    try {
      this.masterGain.gain.setTargetAtTime(Math.max(0, Math.min(1, volume)), this.audioContext.currentTime, 0.1)
    } catch (error) {
      console.warn('YYC3EmotionSound: 设置主音量失败', error)
    }
  }
}

// YYC³ 情感声效管理器
export class YYC3EmotionSoundManager {
  private mapper: YYC3EmotionSoundMapper
  private synthesizer: YYC3AudioSynthesizer | null = null
  private currentEmotion: YYC3EmotionState | null = null
  private isEnabled: boolean = true
  private soundQueue: YYC3SoundParameters[] = []
  private brandId: string = 'YYC3'
  private isBrowser: boolean
  
  constructor() {
    // 检查是否在浏览器环境中
    this.isBrowser = typeof window !== 'undefined'
    this.mapper = new YYC3EmotionSoundMapper()
    
    // 只在浏览器环境中初始化音频合成器
    if (this.isBrowser) {
      this.synthesizer = new YYC3AudioSynthesizer()
    }
  }
  
  public async playEmotionSound(emotion: YYC3EmotionState): Promise<void> {
    if (!this.isEnabled || !this.synthesizer) return
    
    // 映射情感到声效参数
    const soundParams = this.mapper.mapEmotionToSound(emotion)
    
    // 如果有情感变化且强度足够，播放声效
    if (this.shouldPlaySound(emotion)) {
      try {
        await this.synthesizer.synthesizeEmotionSound(emotion, soundParams)
        this.currentEmotion = emotion
      } catch (error) {
        console.error('YYC3 情感声效播放失败:', error)
      }
    }
  }
  
  private shouldPlaySound(newEmotion: YYC3EmotionState): boolean {
    // 如果没有当前情感，播放新情感
    if (!this.currentEmotion) return true
    
    // 计算情感变化程度
    const emotionDiff = this.calculateEmotionDifference(this.currentEmotion, newEmotion)
    
    // 情感变化足够大或新情感强度足够高时播放
    return emotionDiff > 0.3 || newEmotion.emotionIntensity > 0.7
  }
  
  private calculateEmotionDifference(
    emotion1: YYC3EmotionState,
    emotion2: YYC3EmotionState
  ): number {
    const valenceDiff = Math.abs(emotion1.valence - emotion2.valence)
    const arousalDiff = Math.abs(emotion1.arousal - emotion2.arousal)
    const dominanceDiff = Math.abs(emotion1.dominance - emotion2.dominance)
    
    // 欧几里得距离
    return Math.sqrt(valenceDiff ** 2 + arousalDiff ** 2 + dominanceDiff ** 2) / Math.sqrt(3)
  }
  
  public setEnabled(enabled: boolean): void {
    this.isEnabled = enabled
    if (!enabled && this.synthesizer) {
      this.synthesizer.stopAllSounds()
    }
  }
  
  public setVolume(volume: number): void {
    if (this.synthesizer) {
      this.synthesizer.setMasterVolume(volume)
    }
  }
  
  public getCurrentEmotion(): YYC3EmotionState | null {
    return this.currentEmotion ? { ...this.currentEmotion } : null
  }
}

// YYC³ 情感声效上下文
// 创建上下文，不使用显式类型参数
export const YYC3EmotionSoundContext = createContext(null)

// YYC³ 情感声效提供者组件
export const YYC3EmotionSoundProvider: React.FC<{
  children: React.ReactNode
  enabled?: boolean
  volume?: number
}> = ({
  children,
  enabled = true,
  volume = 0.3
}) => {
  // 检查是否在浏览器环境中
  const isBrowser = typeof window !== 'undefined'
  
  // 创建一个符合YYC3EmotionSoundManager接口的模拟对象
  const mockSoundManager = {
    setEnabled: () => {},
    setVolume: () => {},
    playEmotionSound: async () => {},
    getCurrentEmotion: () => null,
    mapper: null,
    synthesizer: null,
    currentEmotion: null,
    isEnabled: false,
    volume: 0,
    emotionThreshold: 0.3,
    audioContext: null,
    initialize: async () => {},
    destroy: () => {},
    soundQueue: [],
    brandId: 'yyc3',
    isBrowser: false,
    shouldPlaySound: () => false,
    calculateEmotionDifference: () => 0
  } as unknown as YYC3EmotionSoundManager
  
  // 使用useRef不使用显式类型参数
  const soundManagerRef = useRef(mockSoundManager)
  
  if (!soundManagerRef.current && isBrowser) {
    soundManagerRef.current = new YYC3EmotionSoundManager()
  }
  
  const soundManager = soundManagerRef.current
  
  useEffect(() => {
    soundManager.setEnabled(enabled)
  }, [enabled, soundManager])
  
  useEffect(() => {
    soundManager.setVolume(volume)
  }, [volume, soundManager])
  
  const playEmotionSound = useCallback(async (emotion: YYC3EmotionState) => {
    await soundManager.playEmotionSound(emotion)
  }, [soundManager])
  
  const setEnabled = useCallback((enabled: boolean) => {
    soundManager.setEnabled(enabled)
  }, [soundManager])
  
  const setVolume = useCallback((volume: number) => {
    soundManager.setVolume(volume)
  }, [soundManager])
  
  const getCurrentEmotion = useCallback(() => {
    return soundManager.getCurrentEmotion()
  }, [soundManager])
  
  const contextValue = {
    soundManager,
    playEmotionSound,
    setEnabled,
    setVolume,
    getCurrentEmotion
  }
  
  return (
    <YYC3EmotionSoundContext.Provider value={contextValue}>
      {children}
    </YYC3EmotionSoundContext.Provider>
  )
}

// YYC³ 情感声效钩子
export const useYYC3EmotionSound = () => {
  const context = useContext(YYC3EmotionSoundContext)
  if (!context) {
    throw new Error('useYYC3EmotionSound 必须在 YYC3EmotionSoundProvider 内使用')
  }
  return context
}

// YYC³ 情感声效模块元数据
export const YYC3_EMOTION_SOUND_MODULE: YYC3CubeModule = {
  metadata: {
    id: 'yyc3-emotion-sound-platform',
    name: 'YYC³ 情感声效交互平台',
    version: '1.0.0',
    description: '基于言语云立方³架构的情感化智能声效交互系统',
    author: 'YYC³ Team',
    license: 'MIT',
    category: 'cube.integration' as string,
    tags: ['emotion', 'sound', 'interaction', 'ai'],
    brandCompliance: {
      version: '1.0',
      compliant: true,
      issues: [],
      lastChecked: new Date()
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    repository: 'https://github.com/yyc3/emotion-sound-platform',
    documentation: 'https://docs.yyc3.dev/emotion-sound'
  },
  config: {
    enabled: true,
    autoStart: true,
    priority: 85,
    environment: {
      runtime: 'browser',
      features: ['Web Audio API', 'AudioContext', 'OscillatorNode']
    },
    resources: {
      memory: { default: 64, unit: 'MB' },
      cpu: { default: 10, unit: '%' },
      storage: { default: 5, unit: 'MB' },
      network: { default: 0, unit: 'KB/s' }
    },
    parameters: {
      enabled: {
        type: 'boolean',
        default: true,
        required: false,
        description: '是否启用情感声效'
      },
      volume: {
        type: 'number',
        default: 0.3,
        required: false,
        description: '主音量 [0-1]',
        validation: { min: 0, max: 1 }
      },
      emotionThreshold: {
        type: 'number',
        default: 0.3,
        required: false,
        description: '情感变化阈值 [0-1]',
        validation: { min: 0, max: 1 }
      }
    }
  },
  dependencies: [
    {
      id: 'yyc3-core',
      version: '^1.0.0',
      type: 'required',
      source: 'local'
    },
    {
      id: 'react',
      version: '^18.0.0',
      type: 'required',
      source: 'npm'
    }
  ],
  lifecycle: {
    onInit: 'initializeEmotionSoundSystem',
    onStart: 'startEmotionSoundService',
    onStop: 'stopEmotionSoundService',
    onDestroy: 'cleanupEmotionSoundResources'
  },
  capabilities: [
    {
      name: 'emotion-to-sound-mapping',
      type: 'transformer' as string,
      interface: 'YYC3EmotionSoundMapper',
      version: '1.0.0',
      description: '情感状态到声效参数的映射转换'
    },
    {
      name: 'audio-synthesis',
      type: 'processor' as string,
      interface: 'YYC3AudioSynthesizer',
      version: '1.0.0',
      description: '实时音频合成和播放'
    },
    {
      name: 'emotion-sound-management',
      type: 'service' as string,
      interface: 'YYC3EmotionSoundManager',
      version: '1.0.0',
      description: '情感声效的统一管理和控制'
    }
  ],
  status: {
    phase: 'ready' as string,
    healthy: true,
    lastActivity: new Date(),
    metrics: {
      uptime: 0,
      requests: 0,
      errors: 0,
      avgResponseTime: 0,
      memoryUsage: 0,
      cpuUsage: 0
    },
    errors: []
  }
}

// 导出所有公共接口和类型
export * from './emotion-sound-types'