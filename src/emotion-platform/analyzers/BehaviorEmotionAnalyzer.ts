import { BaseEmotionAnalyzer } from './BaseEmotionAnalyzer';
import { EmotionData } from '../types';

/**
 * 用户行为数据点
 */
interface BehaviorDataPoint {
  type: 'mousemove' | 'click' | 'scroll' | 'keypress';
  timestamp: number;
  x?: number;
  y?: number;
  deltaX?: number;
  deltaY?: number;
  duration?: number;
}

/**
 * 行为情感分析器
 * 通过分析用户的交互行为（鼠标移动、点击、滚动等）来推断情感状态
 */
export class BehaviorEmotionAnalyzer extends BaseEmotionAnalyzer {
  private behaviorData: BehaviorDataPoint[] = [];
  private maxDataPoints: number;
  private lastMousePosition: { x: number; y: number } | null = null;
  private clickTimes: number[] = [];
  private lastClickTime: number = 0;
  private scrollData: { time: number; delta: number }[] = [];
  private isTracking: boolean = false;
  private eventListeners: Map<string, EventListenerOrEventListenerObject> = new Map();
  
  constructor(maxDataPoints: number = 100) {
    super('behavior');
    this.maxDataPoints = maxDataPoints;
  }
  
  /**
   * 开始跟踪用户行为
   */
  startTracking(): void {
    if (this.isTracking) {
      return;
    }
    
    // 添加事件监听器
    this.addEventListeners();
    this.isTracking = true;
  }
  
  /**
   * 停止跟踪用户行为
   */
  stopTracking(): void {
    if (!this.isTracking) {
      return;
    }
    
    // 移除事件监听器
    this.removeEventListeners();
    this.isTracking = false;
  }
  
  /**
   * 分析用户行为情感
   * @returns 情感分析结果
   */
  async analyze(): Promise<EmotionData> {
    if (this.behaviorData.length === 0) {
      return this.createDefaultEmotionData();
    }
    
    try {
      // 计算鼠标速度
      const mouseSpeed = this.calculateMouseSpeed();
      
      // 计算点击频率
      const clickFrequency = this.calculateClickFrequency();
      
      // 计算滚动速度
      const scrollSpeed = this.calculateScrollSpeed();
      
      // 映射行为特征到情感
      const valence = this.mapBehaviorToValence(mouseSpeed, clickFrequency, scrollSpeed);
      const arousal = this.mapBehaviorToArousal(mouseSpeed, clickFrequency, scrollSpeed);
      
      // 确定主要情绪
      const { primary, confidence } = this.determinePrimaryEmotion(valence, arousal);
      
      return this.normalizeEmotionData({
        primary,
        confidence,
        valence,
        arousal,
        timestamp: Date.now(),
        source: this.source
      });
    } catch (error) {
      console.error('Behavior emotion analysis failed:', error);
      return this.createDefaultEmotionData();
    }
  }
  
  /**
   * 添加事件监听器
   */
  private addEventListeners(): void {
    // 鼠标移动事件
    const mouseMoveListener = (event: Event) => this.handleMouseMove(event as MouseEvent);
    window.addEventListener('mousemove', mouseMoveListener);
    this.eventListeners.set('mousemove', mouseMoveListener);
    
    // 鼠标点击事件
    const clickListener = (event: Event) => this.handleClick(event as MouseEvent);
    window.addEventListener('click', clickListener);
    this.eventListeners.set('click', clickListener);
    
    // 滚动事件
    const scrollListener = () => this.handleScroll();
    window.addEventListener('scroll', scrollListener);
    this.eventListeners.set('scroll', scrollListener);
    
    // 键盘按下事件
    const keypressListener = () => this.handleKeypress();
    window.addEventListener('keypress', keypressListener);
    this.eventListeners.set('keypress', keypressListener);
  }
  
  /**
   * 移除事件监听器
   */
  private removeEventListeners(): void {
    this.eventListeners.forEach((listener, eventType) => {
      window.removeEventListener(eventType, listener);
    });
    this.eventListeners.clear();
  }
  
  /**
   * 处理鼠标移动事件
   */
  private handleMouseMove(event: MouseEvent): void {
    const now = Date.now();
    const dataPoint: BehaviorDataPoint = {
      type: 'mousemove',
      timestamp: now,
      x: event.clientX,
      y: event.clientY
    };
    
    this.addDataPoint(dataPoint);
    
    // 更新上次鼠标位置
    this.lastMousePosition = { x: event.clientX, y: event.clientY };
  }
  
  /**
   * 处理点击事件
   */
  private handleClick(event: MouseEvent): void {
    const now = Date.now();
    const dataPoint: BehaviorDataPoint = {
      type: 'click',
      timestamp: now,
      x: event.clientX,
      y: event.clientY
    };
    
    this.addDataPoint(dataPoint);
    
    // 更新点击时间记录
    this.clickTimes.push(now);
    if (this.clickTimes.length > 10) {
      this.clickTimes.shift();
    }
    this.lastClickTime = now;
  }
  
  /**
   * 处理滚动事件
   */
  private handleScroll(): void {
    const now = Date.now();
    const deltaY = window.scrollY - (this.scrollData.length > 0 ? this.scrollData[this.scrollData.length - 1].delta : 0);
    
    const dataPoint: BehaviorDataPoint = {
      type: 'scroll',
      timestamp: now,
      deltaY: Math.abs(deltaY)
    };
    
    this.addDataPoint(dataPoint);
    
    // 更新滚动数据
    this.scrollData.push({ time: now, delta: window.scrollY });
    if (this.scrollData.length > 20) {
      this.scrollData.shift();
    }
  }
  
  /**
   * 处理键盘按下事件
   */
  private handleKeypress(): void {
    const now = Date.now();
    const dataPoint: BehaviorDataPoint = {
      type: 'keypress',
      timestamp: now
    };
    
    this.addDataPoint(dataPoint);
  }
  
  /**
   * 添加数据点
   */
  private addDataPoint(dataPoint: BehaviorDataPoint): void {
    this.behaviorData.push(dataPoint);
    
    // 保持数据点数量在限制范围内
    if (this.behaviorData.length > this.maxDataPoints) {
      this.behaviorData.shift();
    }
  }
  
  /**
   * 计算鼠标移动速度
   */
  private calculateMouseSpeed(): number {
    const moveEvents = this.behaviorData.filter(event => event.type === 'mousemove');
    if (moveEvents.length < 2) {
      return 0;
    }
    
    let totalDistance = 0;
    let totalTime = 0;
    
    for (let i = 1; i < moveEvents.length; i++) {
      const prev = moveEvents[i - 1];
      const current = moveEvents[i];
      
      if (prev.x !== undefined && prev.y !== undefined && current.x !== undefined && current.y !== undefined) {
        const distance = Math.sqrt(
          Math.pow(current.x - prev.x, 2) + Math.pow(current.y - prev.y, 2)
        );
        const timeDiff = current.timestamp - prev.timestamp;
        
        totalDistance += distance;
        totalTime += timeDiff;
      }
    }
    
    // 计算平均速度（像素/毫秒）
    return totalTime > 0 ? totalDistance / totalTime : 0;
  }
  
  /**
   * 计算点击频率
   */
  private calculateClickFrequency(): number {
    if (this.clickTimes.length < 2) {
      return 0;
    }
    
    // 计算最近点击的平均间隔
    let totalInterval = 0;
    for (let i = 1; i < this.clickTimes.length; i++) {
      totalInterval += this.clickTimes[i] - this.clickTimes[i - 1];
    }
    
    const avgInterval = totalInterval / (this.clickTimes.length - 1);
    
    // 转换为频率（点击/秒）
    return avgInterval > 0 ? 1000 / avgInterval : 0;
  }
  
  /**
   * 计算滚动速度
   */
  private calculateScrollSpeed(): number {
    if (this.scrollData.length < 2) {
      return 0;
    }
    
    let totalDistance = 0;
    let totalTime = 0;
    
    for (let i = 1; i < this.scrollData.length; i++) {
      const prev = this.scrollData[i - 1];
      const current = this.scrollData[i];
      
      const distance = Math.abs(current.delta - prev.delta);
      const timeDiff = current.time - prev.time;
      
      totalDistance += distance;
      totalTime += timeDiff;
    }
    
    // 计算平均速度（像素/毫秒）
    return totalTime > 0 ? totalDistance / totalTime : 0;
  }
  
  /**
   * 将行为特征映射到情感效价
   */
  private mapBehaviorToValence(mouseSpeed: number, clickFrequency: number, scrollSpeed: number): number {
    // 适中的鼠标速度通常表示积极情绪
    // 非常快或非常慢的速度可能表示消极情绪
    let speedFactor = 0;
    if (mouseSpeed > 0.5 && mouseSpeed < 2) {
      speedFactor = 0.3;
    } else if (mouseSpeed > 5) {
      speedFactor = -0.2;
    } else if (mouseSpeed < 0.1) {
      speedFactor = -0.3;
    }
    
    // 适中的点击频率表示积极参与
    let clickFactor = 0;
    if (clickFrequency > 0.5 && clickFrequency < 3) {
      clickFactor = 0.3;
    } else if (clickFrequency > 10) {
      clickFactor = -0.4; // 快速连续点击可能表示挫折或愤怒
    }
    
    // 平滑的滚动表示舒适的浏览体验
    let scrollFactor = 0;
    if (scrollSpeed > 0.5 && scrollSpeed < 5) {
      scrollFactor = 0.2;
    } else if (scrollSpeed > 20) {
      scrollFactor = -0.2; // 快速滚动可能表示不耐烦
    }
    
    // 综合计算效价
    const valence = speedFactor + clickFactor + scrollFactor;
    
    // 限制在 -1 到 1 范围内
    return Math.max(-1, Math.min(1, valence));
  }
  
  /**
   * 将行为特征映射到情感唤醒度
   */
  private mapBehaviorToArousal(mouseSpeed: number, clickFrequency: number, scrollSpeed: number): number {
    // 高鼠标速度表示高唤醒度
    const speedArousal = Math.min(1, mouseSpeed / 10);
    
    // 高点击频率表示高唤醒度
    const clickArousal = Math.min(1, clickFrequency / 15);
    
    // 高滚动速度表示高唤醒度
    const scrollArousal = Math.min(1, scrollSpeed / 30);
    
    // 综合计算唤醒度（加权平均）
    const arousal = (speedArousal * 0.4 + clickArousal * 0.4 + scrollArousal * 0.2);
    
    // 限制在 0 到 1 范围内
    return Math.max(0, Math.min(1, arousal));
  }
  
  /**
   * 确定主要情绪
   */
  private determinePrimaryEmotion(valence: number, arousal: number): { primary: string; confidence: number } {
    let primary = 'neutral';
    let confidence = 0.5;
    
    // 基于效价-唤醒度模型确定主要情绪
    if (valence > 0.3) {
      if (arousal > 0.6) {
        primary = 'happiness';
        confidence = Math.min(1, (valence + arousal) / 2);
      } else if (arousal < 0.4) {
        primary = 'happiness';
        confidence = Math.min(1, valence * 0.8);
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
    
    // 高唤醒度且接近中性效价可能是惊讶
    if (arousal > 0.7 && Math.abs(valence) < 0.4) {
      primary = 'surprise';
      confidence = arousal;
    }
    
    // 低唤醒度且略微负面可能是厌恶
    if (valence < -0.2 && arousal < 0.4) {
      primary = 'disgust';
      confidence = Math.min(1, Math.abs(valence) * 0.7);
    }
    
    // 中等唤醒度且负面可能是恐惧
    if (valence < -0.3 && arousal > 0.3 && arousal < 0.6) {
      primary = 'fear';
      confidence = Math.min(1, Math.abs(valence) * 0.8);
    }
    
    return { primary, confidence };
  }
  
  /**
   * 清理资源
   */
  dispose(): void {
    this.stopTracking();
    this.behaviorData = [];
    this.clickTimes = [];
    this.scrollData = [];
    this.lastMousePosition = null;
    this.lastClickTime = 0;
  }
}