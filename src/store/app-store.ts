// 全局状态管理架构建议

import { create } from 'zustand'
import { persist, subscribeWithSelector } from 'zustand/middleware'
import { StateCreator } from 'zustand'

// 基础类型定义
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  // 其他用户属性
}

export interface EmotionData {
  type: string;
  intensity: number;
  timestamp: number;
  // 其他情感数据属性
}

export interface ContextData {
  lightLevel?: string;
  // 其他上下文属性
}

export interface InteractionRecord {
  type: string;
  timestamp: number;
  data?: unknown;
}

export interface CourseData {
  id: string;
  name: string;
  // 其他课程属性
}

export type ProgressData = Record<string, unknown>

export type AdaptiveConfig = Record<string, unknown>

export type AccessibilitySettings = Record<string, unknown>

// 应用状态接口
export interface AppState {
  // 用户状态
  user: UserProfile | null
  isAuthenticated: boolean
  
  // 多模态数据状态
  currentEmotion: EmotionData | null
  contextAwareness: ContextData
  interactionHistory: InteractionRecord[]
  
  // 教育系统状态
  currentCourse: CourseData | null
  learningProgress: ProgressData
  adaptiveSettings: AdaptiveConfig
  
  // UI状态
  theme: 'light' | 'dark' | 'auto'
  language: string
  accessibility: AccessibilitySettings
}

// Actions定义
export interface AppActions {
  // 用户操作
  setUser: (user: UserProfile) => void
  logout: () => void
  
  // 多模态操作
  updateEmotion: (emotion: EmotionData) => void
  updateContext: (context: ContextData) => void
  addInteraction: (interaction: InteractionRecord) => void
  
  // 教育系统操作
  setCourse: (course: CourseData) => void
  updateProgress: (progress: ProgressData) => void
  updateAdaptiveSettings: (settings: AdaptiveConfig) => void
  
  // UI操作
  toggleTheme: () => void
  setLanguage: (lang: string) => void
  updateAccessibility: (settings: AccessibilitySettings) => void
}

// 定义AllSlices类型
export type AllSlices = AppState & AppActions;

// 创建状态管理器
const createAppStore: StateCreator<AllSlices> = (set, get) => ({
  // 初始状态
  user: null as UserProfile | null,
  isAuthenticated: false,
  currentEmotion: null as EmotionData | null,
  contextAwareness: {} as ContextData,
  interactionHistory: [] as InteractionRecord[],
  currentCourse: null as CourseData | null,
  learningProgress: {} as ProgressData,
  adaptiveSettings: {} as AdaptiveConfig,
  theme: 'auto' as 'light' | 'dark' | 'auto',
  language: 'zh-CN',
  accessibility: {} as AccessibilitySettings,

  // Actions实现
  setUser: (user: UserProfile) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
  
  updateEmotion: (emotion: EmotionData) => {
    set({ currentEmotion: emotion })
    // 触发相关副作用
    get().addInteraction({
      type: 'emotion_update',
      timestamp: Date.now(),
      data: emotion
    })
  },
  
  updateContext: (context: ContextData) => {
    set({ contextAwareness: context })
    // 自动适应UI/功能
    if (context.lightLevel === '较暗') {
      set({ theme: 'dark' })
    }
  },
  
  addInteraction: (interaction: InteractionRecord) => set((state) => ({
    interactionHistory: [...state.interactionHistory.slice(-99), interaction]
  })),
  
  setCourse: (course: CourseData) => set({ currentCourse: course }),
  updateProgress: (progress: ProgressData) => set({ learningProgress: progress }),
  updateAdaptiveSettings: (settings: AdaptiveConfig) => set({ adaptiveSettings: settings }),
  
  toggleTheme: () => set((state) => ({
    theme: state.theme === 'light' ? 'dark' : 'light'
  })),
  setLanguage: (lang: string) => set({ language: lang }),
  updateAccessibility: (settings: AccessibilitySettings) => set({ accessibility: settings })
});

export const useAppStore = create<AllSlices>()(
  subscribeWithSelector(
    persist(
      createAppStore,
      {
        name: 'yyc3-app-storage',
        partialize: (state) => ({
          user: state.user,
          theme: state.theme,
          language: state.language,
          accessibility: state.accessibility,
          adaptiveSettings: state.adaptiveSettings
        })
      }
    )
  )
)

// 4. 选择器hooks
export const useUser = () => useAppStore((state) => state.user)
export const useCurrentEmotion = () => useAppStore((state) => state.currentEmotion)
export const useTheme = () => useAppStore((state) => state.theme)
export const useLanguage = () => useAppStore((state) => state.language)

// 5. 数据流监听
useAppStore.subscribe(
  (state) => state.currentEmotion,
  (currentEmotion) => {
    if (currentEmotion) {
      // 自动触发相关模块
    }
  }
)