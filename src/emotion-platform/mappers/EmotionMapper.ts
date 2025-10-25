import { EmotionData, ColorMapping, TypographyMapping, LayoutMapping, AnimationParams, EmotionUIParams, EMOTION_STANDARDS } from '../types';

/**
 * 情感映射器
 * 将情感数据映射到UI参数
 */
export class EmotionMapper {
  /**
   * 将情感数据映射到颜色
   * @param emotion 情感数据
   * @returns 颜色映射结果
   */
  static mapEmotionToColor(emotion: EmotionData): ColorMapping {
    const { primary, valence, arousal } = emotion;
    
    // 如果有预定义的颜色映射，优先使用
    if (EMOTION_STANDARDS.COLOR_MAPPINGS[primary as keyof typeof EMOTION_STANDARDS.COLOR_MAPPINGS]) {
      const colorMapping = EMOTION_STANDARDS.COLOR_MAPPINGS[primary as keyof typeof EMOTION_STANDARDS.COLOR_MAPPINGS];
      
      // 根据效价和唤醒度调整颜色
      const adjustedHue = colorMapping.hue + (valence * 20); // 效价影响色调
      const adjustedSaturation = Math.min(100, Math.max(0, colorMapping.saturation + (arousal * 20 - 10))); // 唤醒度影响饱和度
      const adjustedLightness = Math.min(100, Math.max(0, 50 + (valence * 10))); // 效价影响亮度
      
      const hsl = `hsl(${adjustedHue}, ${adjustedSaturation}%, ${adjustedLightness}%)`;
      const hex = this.hslToHex(adjustedHue, adjustedSaturation, adjustedLightness);
      const rgb = this.hslToRgb(adjustedHue, adjustedSaturation, adjustedLightness);
      
      return {
        hsl,
        hex,
        rgb,
        cssVars: {
          '--emotion-color-hsl': hsl,
          '--emotion-color-hex': hex,
          '--emotion-color-r': rgb.r.toString(),
          '--emotion-color-g': rgb.g.toString(),
          '--emotion-color-b': rgb.b.toString()
        }
      };
    }
    
    // 基于效价-唤醒度模型动态计算颜色
    // 效价决定色调：负 -> 蓝色/紫色，正 -> 黄色/红色
    // 唤醒度决定饱和度和亮度
    const hue = 220 - (valence * 180); // 从蓝色到红色的变化
    const saturation = 50 + (arousal * 30); // 唤醒度越高，饱和度越高
    const lightness = 50 + (valence * 10); // 效价越高，亮度越高
    
    const hsl = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    const hex = this.hslToHex(hue, saturation, lightness);
    const rgb = this.hslToRgb(hue, saturation, lightness);
    
    return {
      hsl,
      hex,
      rgb,
      cssVars: {
        '--emotion-color-hsl': hsl,
        '--emotion-color-hex': hex,
        '--emotion-color-r': rgb.r.toString(),
        '--emotion-color-g': rgb.g.toString(),
        '--emotion-color-b': rgb.b.toString()
      }
    };
  }
  
  /**
   * 将情感数据映射到排版
   * @param emotion 情感数据
   * @returns 排版映射结果
   */
  static mapEmotionToTypography(emotion: EmotionData): TypographyMapping {
    const { primary, valence, arousal } = emotion;
    
    // 基础字体大小
    let fontSize = '16px';
    // 基础字重
    let fontWeight = 400;
    // 基础行高
    let lineHeight = 1.5;
    // 基础字间距
    let letterSpacing = '0.03em';
    
    // 根据唤醒度调整字体大小
    if (arousal > 0.7) {
      fontSize = '18px';
    } else if (arousal < 0.3) {
      fontSize = '15px';
    }
    
    // 根据效价和唤醒度调整字重
    if (valence > 0.5 && arousal > 0.5) {
      fontWeight = 700; // 积极且高唤醒 -> 粗体
    } else if (valence < -0.5) {
      fontWeight = 500; // 消极 -> 稍微加粗
    }
    
    // 根据唤醒度调整行高
    if (arousal > 0.7) {
      lineHeight = 1.3; // 高唤醒 -> 紧凑的行高
    } else if (arousal < 0.3) {
      lineHeight = 1.8; // 低唤醒 -> 宽松的行高
    }
    
    // 根据效价调整字间距
    if (valence > 0.5) {
      letterSpacing = '0.05em'; // 积极 -> 宽松的字间距
    } else if (valence < -0.5) {
      letterSpacing = '0.01em'; // 消极 -> 紧凑的字间距
    }
    
    // 根据主要情绪选择字体
    let fontFamily = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    
    switch (primary) {
      case 'happiness':
        fontFamily = '"Comic Sans MS", cursive, sans-serif';
        break;
      case 'anger':
        fontFamily = '"Impact", sans-serif';
        break;
      case 'sadness':
        fontFamily = 'Georgia, serif';
        break;
      case 'fear':
        fontFamily = '"Courier New", monospace';
        break;
      case 'surprise':
        fontFamily = '"Arial Black", sans-serif';
        break;
      case 'disgust':
        fontFamily = '"Times New Roman", serif';
        break;
      default:
        break;
    }
    
    return {
      fontFamily,
      fontSize,
      fontWeight,
      lineHeight,
      letterSpacing,
      cssVars: {
        '--emotion-font-family': fontFamily,
        '--emotion-font-size': fontSize,
        '--emotion-font-weight': fontWeight.toString(),
        '--emotion-line-height': lineHeight.toString(),
        '--emotion-letter-spacing': letterSpacing
      }
    };
  }
  
  /**
   * 将情感数据映射到布局
   * @param emotion 情感数据
   * @returns 布局映射结果
   */
  static mapEmotionToLayout(emotion: EmotionData): LayoutMapping {
    const { valence, arousal } = emotion;
    
    // 基础间距
    let spacing = '16px';
    // 密度
    let density: 'low' | 'high' = 'low';
    // 网格列数
    let gridColumns = 12;
    // 圆角
    let borderRadius = '8px';
    // 阴影强度
    let shadowIntensity = 1;
    
    // 根据效价调整间距
    if (valence > 0.5) {
      spacing = '24px'; // 积极 -> 宽松间距
      density = 'low';
    } else if (valence < -0.5) {
      spacing = '8px'; // 消极 -> 紧凑间距
      density = 'high';
    }
    
    // 根据唤醒度调整网格列数
    if (arousal > 0.7) {
      gridColumns = 16; // 高唤醒 -> 更多列
    } else if (arousal < 0.3) {
      gridColumns = 8; // 低唤醒 -> 更少列
    }
    
    // 根据效价调整圆角
    if (valence > 0.5) {
      borderRadius = '16px'; // 积极 -> 更圆润
    } else if (valence < -0.5) {
      borderRadius = '4px'; // 消极 -> 更尖锐
    }
    
    // 根据唤醒度调整阴影
    shadowIntensity = 0.5 + (arousal * 1.5);
    
    return {
      spacing,
      density,
      gridColumns,
      borderRadius,
      shadowIntensity,
      cssVars: {
        '--emotion-spacing': spacing,
        '--emotion-grid-columns': gridColumns.toString(),
        '--emotion-border-radius': borderRadius,
        '--emotion-shadow-intensity': shadowIntensity.toString()
      }
    };
  }
  
  /**
   * 将情感数据映射到动画参数
   * @param emotion 情感数据
   * @returns 动画映射结果
   */
  static mapEmotionToAnimation(emotion: EmotionData): AnimationParams {
    const { primary, valence, arousal } = emotion;
    
    // 如果有预定义的动画映射，优先使用
    if (EMOTION_STANDARDS.ANIMATION_MAPPINGS[primary as keyof typeof EMOTION_STANDARDS.ANIMATION_MAPPINGS]) {
      const animationMapping = EMOTION_STANDARDS.ANIMATION_MAPPINGS[primary as keyof typeof EMOTION_STANDARDS.ANIMATION_MAPPINGS];
      
      // 根据唤醒度调整持续时间
      const duration = Math.floor(animationMapping.duration * (1 / Math.max(0.1, arousal)));
      
      // 根据效价调整延迟
      const delay = Math.floor((1 - valence) * 100);
      
      // 推荐的动画类型
      const recommendedAnimations = this.getRecommendedAnimations(primary, valence, arousal);
      
      return {
        duration,
        easing: animationMapping.easing,
        intensity: animationMapping.intensity,
        delay,
        recommendedAnimations
      };
    }
    
    // 基于效价-唤醒度动态计算动画参数
    // 唤醒度越高，动画越快
    const duration = Math.floor((1 - arousal) * 1500 + 300);
    
    // 效价影响缓动函数
    let easing = 'ease-in-out';
    if (valence > 0.5) {
      easing = 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'; // 弹性
    } else if (valence < -0.5) {
      easing = 'cubic-bezier(0.6, -0.28, 0.735, 0.045)'; // 反弹
    }
    
    // 唤醒度影响强度
    const intensity = arousal;
    
    // 效价影响延迟
    const delay = Math.floor((1 - valence) * 100);
    
    // 推荐的动画类型
    const recommendedAnimations = this.getRecommendedAnimations(primary, valence, arousal);
    
    return {
      duration,
      easing,
      intensity,
      delay,
      recommendedAnimations
    };
  }
  
  /**
   * 获取推荐的动画类型
   */
  private static getRecommendedAnimations(primary: string, valence: number, arousal: number): string[] {
    const animations: string[] = [];
    
    switch (primary) {
      case 'happiness':
        animations.push('bounce', 'scale', 'rotate');
        break;
      case 'anger':
        animations.push('shake', 'pulse', 'jiggle');
        break;
      case 'sadness':
        animations.push('fade', 'slide', 'sink');
        break;
      case 'fear':
        animations.push('jump', 'twitch', 'blink');
        break;
      case 'surprise':
        animations.push('pop', 'expand', 'flip');
        break;
      case 'disgust':
        animations.push('shrink', 'slide', 'rotate');
        break;
      default:
        animations.push('fade', 'slide');
    }
    
    // 根据唤醒度添加更多动画
    if (arousal > 0.7) {
      animations.push('bounce', 'shake');
    } else if (arousal < 0.3) {
      animations.push('fade', 'slide');
    }
    
    return Array.from(new Set(animations)); // 去重，使用Array.from避免TypeScript配置问题
  }
  
  /**
   * 将情感数据映射到完整的UI参数
   * @param emotion 情感数据
   * @returns UI参数映射结果
   */
  static mapEmotionToUI(emotion: EmotionData): EmotionUIParams {
    const color = this.mapEmotionToColor(emotion);
    const typography = this.mapEmotionToTypography(emotion);
    const layout = this.mapEmotionToLayout(emotion);
    const animation = this.mapEmotionToAnimation(emotion);
    
    // 合并所有CSS变量
    const cssVars = {
      ...color.cssVars,
      ...typography.cssVars,
      ...layout.cssVars,
      '--emotion-animation-duration': `${animation.duration}ms`,
      '--emotion-animation-easing': animation.easing,
      '--emotion-animation-intensity': animation.intensity.toString(),
      '--emotion-animation-delay': `${animation.delay}ms`
    };
    
    return {
      color,
      typography,
      layout,
      animation,
      cssVars
    };
  }
  
  /**
   * HSL转RGB
   */
  private static hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
    h /= 360;
    s /= 100;
    l /= 100;
    
    let r, g, b;
    
    if (s === 0) {
      r = g = b = l; // 灰度
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };
      
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }
    
    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  }
  
  /**
   * HSL转HEX
   */
  private static hslToHex(h: number, s: number, l: number): string {
    const rgb = this.hslToRgb(h, s, l);
    const toHex = (c: number) => {
      const hex = c.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    
    return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
  }
}