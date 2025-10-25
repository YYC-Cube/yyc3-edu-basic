// YYC³ 情感声效交互平台 - 类型定义文件
// 详细的TypeScript类型定义和接口说明

// 基础类型定义，避免循环依赖
export enum YYC3PrimaryEmotion {
  JOY = 'joy',
  SADNESS = 'sadness',
  ANGER = 'anger',
  FEAR = 'fear',
  SURPRISE = 'surprise',
  DISGUST = 'disgust',
  NEUTRAL = 'neutral'
}

export interface YYC3EmotionState {
  valence: number;
  arousal: number;
  dominance: number;
  primaryEmotion: YYC3PrimaryEmotion;
  emotionIntensity: number;
  secondaryEmotions: Array<{emotion: string; intensity: number}>;
}

export interface YYC3EmotionTrigger {
  type: string;
  source: string;
  content: string | number | boolean | object | null;
  timestamp: Date;
}

export enum YYC3Waveform {
  SINE = 'sine',
  SQUARE = 'square',
  TRIANGLE = 'triangle',
  SAWTOOTH = 'sawtooth'
}

export interface YYC3SoundParameters {
  frequency: number;
  amplitude: number;
  waveform: YYC3Waveform;
  duration: number;
  harmonics: number[];
  attack: number;
  decay: number;
  sustain: number;
  release: number;
}

export interface YYC3EmotionContext {
  currentEmotion: YYC3EmotionState;
  audioContext: AudioContext | null;
  config: {enabled: boolean; autoStart?: boolean; priority?: number; environment?: object; resources?: object; parameters?: object};
}

// 扩展的情感状态类型定义
export interface YYC3EmotionStateExtended extends YYC3EmotionState {
  // 情感历史轨迹
  trajectory: YYC3EmotionTrajectory
  
  // 文化背景影响
  culturalContext?: YYC3CulturalContext
  
  // 个性化参数
  personalityFactors?: YYC3PersonalityFactors
  
  // 生理指标 (如果可用)
  physiologicalData?: YYC3PhysiologicalData
}

// YYC³ 情感轨迹
export interface YYC3EmotionTrajectory {
  history: YYC3EmotionDataPoint[]
  trend: YYC3EmotionTrend
  stability: number  // [0, 1]: 情感稳定性
  volatility: number // [0, 1]: 情感波动性
}

// YYC³ 情感数据点
export interface YYC3EmotionDataPoint {
  timestamp: Date
  emotion: YYC3EmotionState
  trigger?: YYC3EmotionTrigger
  confidence: number
}

// YYC³ 情感趋势
export enum YYC3EmotionTrend {
  IMPROVING = 'improving',     // 情绪好转
  DECLINING = 'declining',     // 情绪下降
  STABLE = 'stable',          // 情绪稳定
  FLUCTUATING = 'fluctuating' // 情绪波动
}

// YYC³ 文化背景
export interface YYC3CulturalContext {
  region: string              // 地区代码
  emotionExpression: number   // 情感表达强度 [0, 1]
  socialNorms: YYC3SocialNorm[]
  languageStyle: 'direct' | 'indirect' | 'contextual'
}

// YYC³ 社会规范
export interface YYC3SocialNorm {
  context: string             // 社会情境
  acceptableEmotions: YYC3PrimaryEmotion[]
  intensityRange: [number, number] // 可接受的情感强度范围
}

// YYC³ 个性因素
export interface YYC3PersonalityFactors {
  // 大五人格模型
  openness: number       // 开放性 [0, 1]
  conscientiousness: number // responsibility [0, 1]
  extraversion: number   // 外向性 [0, 1]
  agreeableness: number  // 宜人性 [0, 1]
  neuroticism: number    // 神经质 [0, 1]
  
  // 情感相关特质
  emotionalIntelligence: number // 情商 [0, 1]
  empathy: number        // 共情能力 [0, 1]
  emotionRegulation: number // 情绪调节能力 [0, 1]
}

// YYC³ 生理数据
export interface YYC3PhysiologicalData {
  heartRate?: number          // 心率 (BPM)
  skinConductance?: number    // 皮肤电导 (μS)
  bloodPressure?: [number, number] // 血压 [收缩压, 舒张压]
  temperature?: number        // 体温 (°C)
  respirationRate?: number    // 呼吸频率 (次/分)
  muscleTension?: number      // 肌肉张力 [0, 1]
  eyeTracking?: YYC3EyeTrackingData
}

// YYC³ 眼动追踪数据
export interface YYC3EyeTrackingData {
  pupilDilation: number      // 瞳孔扩张度 [0, 1]
  blinkRate: number          // 眨眼频率 (次/分)
  gazeStability: number      // 注视稳定性 [0, 1]
  fixationDuration: number   // 注视持续时间 (ms)
}

// 高级音效参数
export interface YYC3AdvancedSoundParameters extends YYC3SoundParameters {
  // 动态参数
  dynamicParams: YYC3DynamicParameters
  
  // 空间音频增强
  spatialAudio: YYC3SpatialAudioConfig
  
  // 情感学习参数
  learningParams: YYC3LearningParameters
  
  // 多声道配置
  multichannelConfig?: YYC3MultichannelConfig
}

// YYC³ 动态参数
export interface YYC3DynamicParameters {
  // 频率调制
  frequencyModulation: {
    enabled: boolean
    rate: number      // Hz
    depth: number     // 调制深度 [0, 1]
    waveform: YYC3Waveform
  }
  
  // 振幅调制
  amplitudeModulation: {
    enabled: boolean
    rate: number
    depth: number
    waveform: YYC3Waveform
  }
  
  // 滤波器扫频
  filterSweep: {
    enabled: boolean
    startFreq: number
    endFreq: number
    duration: number  // ms
    curve: 'linear' | 'exponential' | 'logarithmic'
  }
  
  // 立体声平移
  stereoPanning: {
    enabled: boolean
    startPan: number  // [-1, 1]
    endPan: number    // [-1, 1]
    duration: number
  }
}

// YYC³ 空间音频配置
export interface YYC3SpatialAudioConfig {
  enabled: boolean
  
  // HRTF (头相关传递函数) 设置
  hrtf: {
    enabled: boolean
    profile: 'generic' | 'personalized'
    headSize: 'small' | 'medium' | 'large'
  }
  
  // 房间声学模拟
  roomAcoustics: {
    enabled: boolean
    roomSize: YYC3RoomSize
    wallMaterial: YYC3WallMaterial
    reverbTime: number  // RT60 in seconds
    earlyReflections: boolean
  }
  
  // 距离衰减
  distanceAttenuation: {
    model: 'linear' | 'inverse' | 'exponential'
    referenceDistance: number
    maxDistance: number
    rolloffFactor: number
  }
}

// YYC³ 房间尺寸
export enum YYC3RoomSize {
  SMALL = 'small',      // 小房间 (<50m³)
  MEDIUM = 'medium',    // 中等房间 (50-200m³)
  LARGE = 'large',      // 大房间 (200-1000m³)
  HALL = 'hall'         // 大厅 (>1000m³)
}

// YYC³ 墙面材质
export enum YYC3WallMaterial {
  CONCRETE = 'concrete',    // 混凝土 (高反射)
  WOOD = 'wood',           // 木材 (中等吸收)
  CARPET = 'carpet',       // 地毯 (高吸收)
  GLASS = 'glass',         // 玻璃 (高反射)
  ACOUSTIC_FOAM = 'foam'   // 吸音泡沫 (极高吸收)
}

// YYC³ 学习参数
export interface YYC3LearningParameters {
  // 用户反馈学习
  userFeedbackWeight: number    // [0, 1]
  
  // 行为模式学习
  behaviorPatternWeight: number // [0, 1]
  
  // 情绪识别准确性学习
  emotionAccuracyWeight: number // [0, 1]
  
  // 遗忘因子
  forgettingFactor: number      // [0, 1]
  
  // 适应速度
  adaptationRate: number        // [0, 1]
}

// YYC³ 多声道配置
export interface YYC3MultichannelConfig {
  channelCount: 2 | 4 | 6 | 8  // 支持立体声、四声道、5.1、7.1
  
  channelMapping: {
    [key: number]: YYC3ChannelRole
  }
  
  // 低频效果 (LFE) 配置
  lfeConfig?: {
    enabled: boolean
    crossoverFrequency: number  // Hz
    gain: number               // [0, 1]
  }
}

// YYC³ 声道角色
export enum YYC3ChannelRole {
  FRONT_LEFT = 'front_left',
  FRONT_RIGHT = 'front_right',
  FRONT_CENTER = 'front_center',
  REAR_LEFT = 'rear_left',
  REAR_RIGHT = 'rear_right',
  SIDE_LEFT = 'side_left',
  SIDE_RIGHT = 'side_right',
  LFE = 'lfe'  // 低频效果声道
}

// 情感声效预设
export interface YYC3EmotionSoundPreset {
  id: string
  name: string
  description: string
  targetEmotion: YYC3PrimaryEmotion
  soundParameters: YYC3AdvancedSoundParameters
  culturalAdaptation: boolean
  personalityAware: boolean
  tags: string[]
  usage: YYC3PresetUsage
}

// YYC³ 预设使用场景
export enum YYC3PresetUsage {
  NOTIFICATION = 'notification',     // 通知提醒
  FEEDBACK = 'feedback',            // 用户反馈
  AMBIENT = 'ambient',              // 环境音效
  TRANSITION = 'transition',        // 状态转换
  CELEBRATION = 'celebration',      // 庆祝音效
  WARNING = 'warning',              // 警告提示
  MEDITATION = 'meditation',        // 冥想放松
  FOCUS = 'focus'                   // 专注辅助
}

// 情感声效分析结果
export interface YYC3EmotionSoundAnalysis {
  // 声效效果评估
  effectiveness: number             // [0, 1]: 声效有效性
  userSatisfaction: number         // [0, 1]: 用户满意度
  emotionAlignment: number         // [0, 1]: 情感匹配度
  
  // 声学特性分析
  acousticFeatures: YYC3AcousticFeatures
  
  // 用户行为分析
  behaviorAnalysis: YYC3BehaviorAnalysis
  
  // 改进建议
  recommendations: YYC3SoundRecommendation[]
}

// YYC³ 声学特征
export interface YYC3AcousticFeatures {
  spectralCentroid: number         // 频谱质心 (Hz)
  spectralRolloff: number          // 频谱衰减点 (Hz)
  mfcc: number[]                   // 梅尔频率倒谱系数
  zeroCrossingRate: number         // 过零率
  energy: number                   // 能量
  pitch: number                    // 基频 (Hz)
  harmonicity: number              // 谐波性 [0, 1]
  noisiness: number               // 噪声度 [0, 1]
}

// YYC³ 行为分析
export interface YYC3BehaviorAnalysis {
  // 注意力变化
  attentionChange: number          // [-1, 1]: 注意力变化
  
  // 交互频率变化
  interactionFrequencyChange: number // [-1, 1]
  
  // 停留时间变化
  dwellTimeChange: number          // [-1, 1]
  
  // 用户反馈
  explicitFeedback?: YYC3UserFeedback
  
  // 生理反应 (如果可用)
  physiologicalResponse?: YYC3PhysiologicalResponse
}

// YYC³ 用户反馈
export interface YYC3UserFeedback {
  rating: number                   // [1, 5]: 用户评分
  sentiment: 'positive' | 'neutral' | 'negative'
  comments?: string
  timestamp: Date
}

// YYC³ 生理反应
export interface YYC3PhysiologicalResponse {
  heartRateChange: number          // BPM变化
  skinConductanceChange: number    // μS变化
  pupilDilationChange: number      // 瞳孔变化
  muscleTensionChange: number      // 肌肉张力变化
}

// YYC³ 声效改进建议
export interface YYC3SoundRecommendation {
  category: 'frequency' | 'amplitude' | 'timbre' | 'timing' | 'spatial'
  priority: 'high' | 'medium' | 'low'
  description: string
  suggestedChange: string | number | boolean | object | null
  expectedImprovement: number      // [0, 1]: 预期改进效果
}

// 情感声效库接口
export interface YYC3EmotionSoundLibrary {
  // 预设管理
  getPreset(id: string): YYC3EmotionSoundPreset | null
  getAllPresets(): YYC3EmotionSoundPreset[]
  addPreset(preset: YYC3EmotionSoundPreset): void
  updatePreset(id: string, updates: Partial<YYC3EmotionSoundPreset>): boolean
  removePreset(id: string): boolean
  
  // 预设搜索
  searchPresets(query: YYC3PresetQuery): YYC3EmotionSoundPreset[]
  
  // 预设推荐
  recommendPresets(
    emotion: YYC3EmotionState,
    context: YYC3EmotionContext,
    count?: number
  ): YYC3EmotionSoundPreset[]
}

// YYC³ 预设查询
export interface YYC3PresetQuery {
  emotion?: YYC3PrimaryEmotion
  usage?: YYC3PresetUsage
  tags?: string[]
  culturalAdaptation?: boolean
  personalityAware?: boolean
  effectiveness?: [number, number] // 效果范围
}

// 情感声效事件接口
export interface YYC3EmotionSoundEvent {
  type: YYC3SoundEventType
  timestamp: Date
  emotion: YYC3EmotionState
  soundParameters: YYC3SoundParameters
  context: YYC3EmotionContext
  result?: YYC3EmotionSoundResult
}

// YYC³ 声效事件类型
export enum YYC3SoundEventType {
  SOUND_STARTED = 'sound_started',
  SOUND_FINISHED = 'sound_finished',
  SOUND_INTERRUPTED = 'sound_interrupted',
  EMOTION_CHANGED = 'emotion_changed',
  PARAMETER_UPDATED = 'parameter_updated',
  USER_FEEDBACK = 'user_feedback',
  ERROR_OCCURRED = 'error_occurred'
}

// YYC³ 情感声效结果
export interface YYC3EmotionSoundResult {
  success: boolean
  duration: number                 // 实际播放时长 (ms)
  acousticAnalysis?: YYC3AcousticFeatures
  userResponse?: YYC3BehaviorAnalysis
  error?: string
}

// 情感声效配置接口
export interface YYC3EmotionSoundConfig {
  // 全局设置
  globalSettings: {
    enabled: boolean
    masterVolume: number           // [0, 1]
    sampleRate: number            // 采样率 (Hz)
    bufferSize: number            // 缓冲区大小
    maxPolyphony: number          // 最大同时声音数
  }
  
  // 情感映射设置
  emotionMapping: {
    sensitivityLevel: number       // [0, 1]: 情感敏感度
    adaptationRate: number        // [0, 1]: 适应速度
    smoothingFactor: number       // [0, 1]: 平滑因子
    thresholds: {
      [key in YYC3PrimaryEmotion]: number // 各情感的触发阈值
    }
  }
  
  // 音频质量设置
  audioQuality: {
    bitDepth: 16 | 24 | 32
    dynamicRange: number          // dB
    noiseFloor: number            // dB
    distortionLimit: number       // %
  }
  
  // 性能设置
  performance: {
    cpuUsageLimit: number         // %
    memoryUsageLimit: number      // MB
    latencyTarget: number         // ms
    priorityLevel: 'low' | 'normal' | 'high'
  }
  
  // 可访问性设置
  accessibility: {
    hearingImpaired: boolean      // 听力障碍支持
    visualFeedback: boolean       // 视觉反馈
    hapticFeedback: boolean       // 触觉反馈
    subtitles: boolean           // 字幕支持
  }
}

// 只导出此文件中定义的类型和接口，避免与index.ts中的导出冲突
// 由于index.ts会重新导出所有需要的内容，这里暂时注释掉直接导出
// type YYC3EmotionStateType = YYC3EmotionState
// YYC3情感组件类型
export interface YYC3EmotionComponentProps {
  emotionState: YYC3EmotionState;
  onEmotionChange?: (emotion: string, intensity: number) => void;
  config?: Record<string, unknown>;
}

export type YYC3EmotionComponentType = React.ComponentType<YYC3EmotionComponentProps>
// type YYC3EmotionTriggerType = YYC3EmotionTrigger
// type YYC3EmotionContextType = YYC3EmotionContext
// type YYC3SoundParametersType = YYC3SoundParameters

// 保留枚举定义但暂时不直接导出，通过index.ts统一导出