// 情感交互平台类型定义

// Web Audio API 振荡器类型定义
export type OscillatorType = 'sine' | 'square' | 'sawtooth' | 'triangle' | 'custom';

// 情感数据类型 (兼容设计文档的情感数据结构)
export interface EmotionData {
  emotion?: string
  primary: string; // 主要情绪类别
  confidence: number
  intensity?: number
  timestamp: number
  valence: number; // 效价，范围 -1 到 1
  arousal: number; // 唤醒度，范围 0 到 1
  source?: string; // 数据来源
}

// 情感捕捉配置
export interface EmotionCaptureConfig {
  textDebounceDelay?: number;
  voiceRecordingTimeout?: number;
  behaviorDataSize?: number;
  fusionWeights?: {
    text: number;
    voice: number;
    behavior: number;
  };
}

// 情感状态类型  
export interface EmotionState {
  primary: string
  intensity: number
  valence: number // 情感效价 (-1 到 1，负面到正面)
  arousal: number // 情感唤醒 (0 到 1，平静到兴奋)
}

// 场景上下文数据
export interface ContextData {
  location: string
  timeOfDay: string
  deviceType: string
  networkStatus: string
  batteryLevel: number
  lightLevel: string
  noiseLevel: string
  userActivity: string
}

// 场景建议类型
export interface ScenarioSuggestion {
  scenario: string
  confidence: number
  actions: string[]
  uiAdaptations: string[]
}

// 用户个性类型
export interface UserPersonality {
  type: string
  traits: string[]
  preferences: {
    learningStyle: string
    interactionMode: string
    feedbackType: string
    visualTheme: string
  }
  skills: {
    name: string
    level: number
  }[]
  achievements: string[]
  growthPath: string[]
}

// 音频参数配置
export interface AudioParams {
  type: OscillatorType;
  frequency: number;
  volume: number;
  duration: number;
  fadeIn: number;
  fadeOut: number;
  delay: number;
  modulator?: {
    type: OscillatorType;
    frequency: number;
    depth: number;
  };
  waveform?: OscillatorType;
  lfoRate?: number;
  lfoIntensity?: number;
}

// 音效定义
export interface SoundEffect {
  type: OscillatorType;
  frequency: number;
  duration: number;
  volume: number;
  fadeIn: number;
  fadeOut: number;
  delay: number;
  modulator?: {
    type: OscillatorType;
    frequency: number;
    depth: number;
  };
}

// 情感反馈类型
export interface EmotionFeedback {
  message: string;
  emoji: string;
  animation: string;
  sound: string;
}

// 动画参数
export interface AnimationParams {
  duration: number;
  easing: string;
  intensity: number;
  delay: number;
  recommendedAnimations: string[];
}

// 个性化设置类型
export interface PersonalizationSettings {
  uiDensity: 'compact' | 'comfortable' | 'spacious'
  colorScheme: 'light' | 'dark' | 'auto' | 'custom'
  animationLevel: 'none' | 'reduced' | 'full'
  notificationStyle: 'minimal' | 'standard' | 'rich'
}

// 对话消息类型
export interface DialogMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  emotion?: string
  confidence?: number
}

// 对话上下文类型
export interface DialogContext {
  topic: string
  mood: string
  userPreferences: string[]
  conversationFlow: string[]
}

// 情感反馈配置
export interface FeedbackConfig {
  visual: {
    enabled: boolean
    colorIntensity: number
    animationSpeed: number
    particleEffects: boolean
  }
  audio: {
    enabled: boolean
    volume: number
    spatialAudio: boolean
    adaptiveEQ: boolean
  }
  haptic: {
    enabled: boolean
    intensity: number
    pattern: 'subtle' | 'standard' | 'strong'
  }
  ambient: {
    lightAdaptation: boolean
    temperatureSync: boolean
    aromatherapy: boolean
  }
}

// 颜色映射结果
export interface ColorMapping {
  hsl: string;
  hex: string;
  rgb: {
    r: number;
    g: number;
    b: number;
  };
  cssVars?: Record<string, string>;
}

// 字体映射结果
export interface TypographyMapping {
  fontFamily: string;
  fontSize: string;
  fontWeight: number;
  lineHeight: number;
  letterSpacing: string;
  cssVars: Record<string, string>;
}

// 布局映射结果
export interface LayoutMapping {
  spacing: string;
  density: 'low' | 'high';
  gridColumns: number;
  borderRadius: string;
  shadowIntensity: number;
  cssVars: Record<string, string>;
}

// 情感映射UI参数
export interface EmotionUIParams {
  color: ColorMapping;
  typography: TypographyMapping;
  layout: LayoutMapping;
  animation: AnimationParams;
  cssVars: Record<string, string>;
}

// 情感标准定义
export const EMOTION_STANDARDS = {
  // 埃克曼六基本情绪（使用统一的命名约定）
  BASIC_EMOTIONS: ['joy', 'sadness', 'anger', 'fear', 'surprise', 'disgust', 'neutral'],
  
  // 效价-唤醒度模型参数范围
  VALENCE_RANGE: { min: -1, max: 1 },
  AROUSAL_RANGE: { min: 0, max: 1 },
  
  // 情感到消息模板的映射
  MESSAGE_TEMPLATES: {
    joy: {
      highArousal: '你看起来非常兴奋！太棒了！',
      lowArousal: '你看起来心情平静而愉悦。',
      positive: '你看起来很开心！',
      negative: '',
      neutral: '你心情不错。'
    },
    sadness: {
      highArousal: '你看起来非常难过...',
      lowArousal: '你似乎感到有些低落。',
      positive: '',
      negative: '你心情不太好。',
      neutral: '你看起来有些沉默。'
    },
    anger: {
      highArousal: '你看起来很生气！深呼吸，冷静一下。',
      lowArousal: '你似乎有些烦躁。',
      positive: '',
      negative: '你看起来不太开心。',
      neutral: '你心情有些波动。'
    },
    fear: {
      highArousal: '你看起来很紧张或害怕！',
      lowArousal: '你似乎有些不安。',
      positive: '',
      negative: '这个内容让你感到不适吗？',
      neutral: '你看起来很谨慎。'
    },
    surprise: {
      highArousal: '哇！你看起来很惊讶！',
      lowArousal: '你似乎有些意外。',
      positive: '这让你感到惊喜！',
      negative: '这让你感到震惊！',
      neutral: '你看起来很意外。'
    },
    disgust: {
      highArousal: '这个内容让你感到很反感！',
      lowArousal: '你似乎不太喜欢这个。',
      positive: '',
      negative: '这个内容不合你的口味。',
      neutral: '你看起来不太感兴趣。'
    },
    neutral: {
      highArousal: '你看起来很平静但精神集中。',
      lowArousal: '你看起来很放松。',
      positive: '你心情不错。',
      negative: '你看起来有些疲惫。',
      neutral: '你保持着平静的状态。'
    }
  },
  
  // 情感到颜色的标准映射
  COLOR_MAPPINGS: {
    joy: { hue: 60, saturation: 90, lightness: 50 },     // 黄色/金色 - 对应happiness
    sadness: { hue: 220, saturation: 60, lightness: 40 }, // 蓝色
    anger: { hue: 0, saturation: 80, lightness: 50 },    // 红色
    fear: { hue: 270, saturation: 70, lightness: 40 },   // 紫色
    surprise: { hue: 120, saturation: 80, lightness: 50 }, // 绿色
    disgust: { hue: 30, saturation: 60, lightness: 45 },  // 橙色
    neutral: { hue: 0, saturation: 0, lightness: 50 }    // 灰色
  },
  
  // 情感到动画的标准映射
  ANIMATION_MAPPINGS: {
    joy: { duration: 600, easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)', intensity: 0.9 },
    sadness: { duration: 2000, easing: 'ease-in-out', intensity: 0.4 },
    anger: { duration: 800, easing: 'ease-out', intensity: 0.8 },
    fear: { duration: 1500, easing: 'ease-in', intensity: 0.7 },
    surprise: { duration: 500, easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)', intensity: 1.0 },
    disgust: { duration: 1000, easing: 'ease-in-out', intensity: 0.6 },
    neutral: { duration: 1000, easing: 'ease-in-out', intensity: 0.3 }
  },
  
  // 情感到音效的标准映射
  SOUND_MAPPINGS: {
    joy: { frequency: 440, waveform: 'triangle' as OscillatorType, volume: 0.5 },
    sadness: { frequency: 220, waveform: 'sine' as OscillatorType, volume: 0.3 },
    anger: { frequency: 150, waveform: 'sawtooth' as OscillatorType, volume: 0.3 },
    fear: { frequency: 100, waveform: 'sine' as OscillatorType, volume: 0.4 },
    surprise: { frequency: 880, waveform: 'triangle' as OscillatorType, volume: 0.4 },
    disgust: { frequency: 200, waveform: 'square' as OscillatorType, volume: 0.2 },
    neutral: { frequency: 330, waveform: 'sine' as OscillatorType, volume: 0.2 }
  }
};

// 标准化情感数据验证函数
export function validateEmotionData(emotion: EmotionData): string[] {
  const errors: string[] = [];
  
  // 验证主要情绪是否存在且有效
  if (!emotion.primary || !EMOTION_STANDARDS.BASIC_EMOTIONS.includes(emotion.primary)) {
    errors.push(`Invalid primary emotion: ${emotion.primary}`);
  }
  
  // 验证情感属性类型
  if (typeof emotion.valence !== 'number') {
    errors.push('Valence must be a number');
  }
  
  // 验证效价范围
  if (typeof emotion.valence === 'number' && (emotion.valence < EMOTION_STANDARDS.VALENCE_RANGE.min || 
      emotion.valence > EMOTION_STANDARDS.VALENCE_RANGE.max)) {
    errors.push(`Valence out of range: ${emotion.valence}`);
  }
  
  // 验证唤醒度类型
  if (typeof emotion.arousal !== 'number') {
    errors.push('Arousal must be a number');
  }
  
  // 验证唤醒度范围
  if (typeof emotion.arousal === 'number' && (emotion.arousal < EMOTION_STANDARDS.AROUSAL_RANGE.min || 
      emotion.arousal > EMOTION_STANDARDS.AROUSAL_RANGE.max)) {
    errors.push(`Arousal out of range: ${emotion.arousal}`);
  }
  
  // 验证置信度类型
  if (typeof emotion.confidence !== 'number') {
    errors.push('Confidence must be a number');
  }
  
  // 验证置信度范围
  if (typeof emotion.confidence === 'number' && (emotion.confidence < 0 || emotion.confidence > 1)) {
    errors.push(`Confidence out of range: ${emotion.confidence}`);
  }
  
  return errors;
}