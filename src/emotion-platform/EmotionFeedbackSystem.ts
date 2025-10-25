import { EmotionData, EmotionFeedback, EMOTION_STANDARDS } from './types';

/**
 * 情感反馈系统
 * 根据当前情感状态提供匹配的反馈内容
 */
export class EmotionFeedbackSystem {
  /**
   * 获取情感反馈
   * @param emotion 情感数据
  /**
   * 获取情感反馈
   */
  public static getFeedback(emotion: EmotionData): EmotionFeedback {
    const { primary, valence, arousal } = emotion;
    const secondary: string | null = null; // 由于EmotionData中没有secondary属性，设置为null
    
    // 基础反馈结构 - 只包含EmotionFeedback接口定义的属性
    const feedback: EmotionFeedback = {
      message: this.getFeedbackMessage(primary, secondary, valence, arousal),
      emoji: this.getEmoji(primary),
      animation: this.getAnimation(primary),
      sound: this.getSound(primary)
    };
    
    return feedback;
  }
  
  /**
   * 获取情感对应的动画
   */
  private static getAnimation(emotion: string): string {
    // 返回动画类型字符串，与EmotionFeedback接口保持一致
    switch (emotion) {
      case 'joy': return 'happy';
      case 'sadness': return 'sad';
      case 'anger': return 'angry';
      case 'fear': return 'fearful';
      case 'surprise': return 'surprised';
      case 'disgust': return 'disgusted';
      case 'neutral': return 'neutral';
      default: return 'default';
    }
  }

  /**
   * 获取推荐的动画列表
   */
  private static getRecommendedAnimations(): string[] {
    // 返回默认的动画列表
    return ['fade', 'scale', 'slide', 'bounce'];
  }
  
  /**
   * 获取情感对应的音效
   */
  private static getSound(emotion: string): string {
    // 返回音效类型字符串，与EmotionFeedback接口保持一致
    switch (emotion) {
      case 'joy': return 'positive';
      case 'sadness': return 'negative';
      case 'anger': return 'warning';
      case 'fear': return 'alert';
      case 'surprise': return 'attention';
      case 'disgust': return 'negative';
      case 'neutral': return 'neutral';
      default: return 'default';
    }
  }
  
  /**
   * 获取反馈消息
   */
  private static getFeedbackMessage(
    primary: string, 
    secondary: string | null, 
    valence: number, 
    arousal: number
  ): string {
    // 如果有预定义的消息模板，优先使用
    const messageTemplates = EMOTION_STANDARDS.MESSAGE_TEMPLATES;
    
    if (messageTemplates && messageTemplates[primary as keyof typeof messageTemplates]) {
      const templates = messageTemplates[primary as keyof typeof messageTemplates];
      
      // 根据唤醒度和效价选择合适的消息
      if (arousal > 0.7 && templates.highArousal) {
        return templates.highArousal;
      } else if (arousal < 0.3 && templates.lowArousal) {
        return templates.lowArousal;
      } else {
        // 根据效价选择中性唤醒度的消息
        if (valence > 0.5 && templates.positive) {
          return templates.positive;
        } else if (valence < -0.5 && templates.negative) {
          return templates.negative;
        } else if (templates.neutral) {
          return templates.neutral;
        }
      }
    }
    
    // 返回默认消息
    return this.getDefaultMessage(primary);
  }
  
  /**
   * 获取默认消息
   */
  private static getDefaultMessage(emotion: string): string {
    const defaultMessages: Record<string, string> = {
      joy: '你看起来很开心！保持这种积极的状态！',
      anger: '我注意到你可能感到有些生气或沮丧。',
      sadness: '你似乎感到低落，需要一些支持吗？',
      fear: '你可能感到有些紧张或不安。',
      surprise: '有什么让你感到惊讶的事情吗？',
      disgust: '这个内容可能不太符合你的喜好。',
      neutral: '你保持着平静的状态。'
    };
    
    return defaultMessages[emotion] || '我注意到了你的情绪变化。';
  }
  
  /**
   * 获取情感对应的表情符号
   */
  private static getEmoji(emotion: string): string {
    const emojiMap: Record<string, string> = {
      joy: '😊',
      anger: '😠',
      sadness: '😢',
      fear: '😨',
      surprise: '😮',
      disgust: '🤢',
      neutral: '😐'
    };
    
    return emojiMap[emotion] || '😐';
  }
  
  /**
   * 获取基于情感状态的推荐
   */
  private static getRecommendations(
    primary: string, 
    valence: number, 
    arousal: number
  ): string[] {
    const recommendations: string[] = [];
    
    // 根据主要情绪添加推荐
    switch (primary) {
      case 'joy':
        recommendations.push('保持积极的心态！');
        recommendations.push('考虑分享你的快乐！');
        if (arousal > 0.7) {
          recommendations.push('也许可以尝试一些创意活动！');
        }
        break;
        
      case 'sadness':
        recommendations.push('给自己一些时间和空间。');
        recommendations.push('与朋友或家人交流可能会有所帮助。');
        if (arousal < 0.3) {
          recommendations.push('尝试一些轻松的活动来提升心情。');
        }
        break;
        
      case 'anger':
        recommendations.push('深呼吸，给自己冷静的时间。');
        recommendations.push('思考一下是什么触发了这种情绪。');
        if (arousal > 0.7) {
          recommendations.push('暂时离开当前环境可能有所帮助。');
        }
        break;
        
      case 'fear':
        recommendations.push('尝试进行正念呼吸练习。');
        recommendations.push('将注意力集中在当下。');
        if (arousal > 0.7) {
          recommendations.push('渐进式肌肉放松可能会有帮助。');
        }
        break;
        
      case 'surprise':
        recommendations.push('探索新事物可以带来成长！');
        if (valence > 0) {
          recommendations.push('享受这个惊喜的时刻！');
        }
        break;
        
      case 'disgust':
        recommendations.push('尊重自己的感受很重要。');
        recommendations.push('考虑为什么会有这种反应。');
        break;
        
      case 'neutral':
        recommendations.push('保持这种平静的状态。');
        recommendations.push('你的专注力很好。');
        if (arousal < 0.5) {
          recommendations.push('适合进行需要冷静思考的任务。');
        }
        break;
        
      default:
        if (valence > 0.5) {
          recommendations.push('继续保持积极的状态！');
        } else if (valence < -0.5) {
          recommendations.push('对自己好一点，照顾好自己的情绪。');
        }
        break;
    }
    
    // 根据效价-唤醒度模型添加通用推荐
    if (valence > 0.7 && arousal > 0.7) {
      // 积极且高唤醒
      recommendations.push('这种活力状态很适合创造性工作！');
    } else if (valence > 0.7 && arousal < 0.3) {
      // 积极且低唤醒
      recommendations.push('这种平静的快乐状态有利于反思和放松。');
    } else if (valence < -0.7 && arousal > 0.7) {
      // 消极且高唤醒
      recommendations.push('现在可能需要一些情绪调节技巧。');
    } else if (valence < -0.7 && arousal < 0.3) {
      // 消极且低唤醒
      recommendations.push('温柔地对待自己，逐步恢复能量。');
    }
    
    return recommendations.slice(0, 3); // 限制推荐数量
  }
  
  /**
   * 根据情感变化提供过渡反馈
   * @param previousEmotion 之前的情感数据
   * @param currentEmotion 当前的情感数据
   * @returns 过渡反馈消息
   */
  static getTransitionFeedback(
    previousEmotion: EmotionData | null, 
    currentEmotion: EmotionData
  ): string | null {
    if (!previousEmotion) {
      return null;
    }
    
    // 计算情感变化幅度
    const valenceChange = currentEmotion.valence - previousEmotion.valence;
    const arousalChange = currentEmotion.arousal - previousEmotion.arousal;
    const emotionChanged = currentEmotion.primary !== previousEmotion.primary;
    
    // 显著的积极变化
    if (valenceChange > 0.5) {
      if (arousalChange > 0.3) {
        return '你的情绪明显变得更加积极和充满活力！';
      } else {
        return '你似乎感到更加平静和满足了。';
      }
    }
    
    // 显著的消极变化
    if (valenceChange < -0.5) {
      if (arousalChange > 0.3) {
        return '我注意到你的情绪变得有些激动。';
      } else {
        return '你似乎感到更加低落了。';
      }
    }
    
    // 主要情绪发生变化
    if (emotionChanged) {
      return `从${this.getEmotionLabel(previousEmotion.primary)}转变为${this.getEmotionLabel(currentEmotion.primary)}。`;
    }
    
    // 唤醒度显著变化
    if (Math.abs(arousalChange) > 0.5) {
      if (arousalChange > 0) {
        return '你变得更加警觉和专注了。';
      } else {
        return '你似乎放松下来了。';
      }
    }
    
    return null; // 没有显著变化
  }
  
  /**
   * 获取情感的中文标签
   */
  private static getEmotionLabel(emotion: string): string {
    const labelMap: Record<string, string> = {
      happiness: '快乐',
      anger: '愤怒',
      sadness: '悲伤',
      fear: '恐惧',
      surprise: '惊讶',
      disgust: '厌恶',
      trust: '信任',
      anticipation: '期待',
      joy: '喜悦',
      love: '爱',
      confusion: '困惑',
      boredom: '无聊'
    };
    
    return labelMap[emotion] || emotion;
  }
  
  /**
   * 验证反馈内容是否适合当前场景
   * @param feedback 情感反馈
   * @param context 上下文信息
   * @returns 是否适合
   */
  static isValidForContext(): boolean {
    // 简化实现，始终返回true
    return true;
  }
  
  /**
   * 获取适合上下文的修改版反馈
   * @param feedback 原始反馈
   * @param context 上下文
   * @returns 修改后的反馈
   */
  static getContextualizedFeedback(feedback: EmotionFeedback, context: string): EmotionFeedback {
    // 复制原始反馈以避免修改
    const contextualizedFeedback = { ...feedback };
    
    // 根据上下文调整反馈内容
    switch (context) {
      case 'work':
        // 工作环境：降低负面情绪的强度表达
        contextualizedFeedback.message = this.getNeutralMessage();
        break;
        
      case 'education':
        // 教育环境：增强鼓励性内容
        contextualizedFeedback.message = contextualizedFeedback.message + ' 继续学习，你做得很好！';
        break;
        
      case 'public':
        // 公共环境：简化反馈，保持私密性
        contextualizedFeedback.message = this.getNeutralMessage();
        break;
        
      default:
        break;
    }
    
    return contextualizedFeedback;
  }
  
  /**
   * 获取中性化的消息
   */
  private static getNeutralMessage(): string {
    return '注意到了情绪变化。';
  }
  
  /**
   * 获取弱化的消息
   */
  private static getMutedMessage(emotion: string): string {
    const mutedMessages: Record<string, string> = {
      anger: '注意到有些不平静的情绪。',
      disgust: '对内容可能有不同看法。',
      sadness: '感到有些低落。'
    };
    
    return mutedMessages[emotion] || '注意到了情绪变化。';
  }
}