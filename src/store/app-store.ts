// 全局状态管理架构建议

import { create } from 'zustand'
import { persist, subscribeWithSelector } from 'zustand/middleware'
import { UISlice, createUISlice } from './slices/createUISlice';
import { AccessibilitySlice, createAccessibilitySlice } from './slices/createAccessibilitySlice';

// 1. 全局应用状态
interface AppState {
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

// 2. Actions定义
interface AppActions {
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

// 将所有 Slice 类型合并
export type AllSlices = UISlice & AccessibilitySlice;

// 3. 创建状态管理器
export const useAppStore = create<AllSlices>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        // 初始状态
        user: null,
        isAuthenticated: false,
        currentEmotion: null,
        contextAwareness: {} as ContextData,
        interactionHistory: [],
        currentCourse: null,
        learningProgress: {} as ProgressData,
        adaptiveSettings: {} as AdaptiveConfig,
        theme: 'auto',
        language: 'zh-CN',
        accessibility: {} as AccessibilitySettings,

        // Actions实现
        setUser: (user) => set({ user, isAuthenticated: true }),
        logout: () => set({ user: null, isAuthenticated: false }),
        
        updateEmotion: (emotion) => {
          set({ currentEmotion: emotion })
          // 触发相关副作用
          get().addInteraction({
            type: 'emotion_update',
            timestamp: Date.now(),
            data: emotion
          })
        },
        
        updateContext: (context) => {
          set({ contextAwareness: context })
          // 自动适应UI/功能
          if (context.lightLevel === '较暗') {
            set({ theme: 'dark' })
          }
        },
        
        addInteraction: (interaction) => set((state) => ({
          interactionHistory: [...state.interactionHistory.slice(-99), interaction]
        })),
        
        setCourse: (course) => set({ currentCourse: course }),
        updateProgress: (progress) => set({ learningProgress: progress }),
        updateAdaptiveSettings: (settings) => set({ adaptiveSettings: settings }),
        
        toggleTheme: () => set((state) => ({
          theme: state.theme === 'light' ? 'dark' : 'light'
        })),
        setLanguage: (lang) => set({ language: lang }),
        updateAccessibility: (settings) => set({ accessibility: settings })
      }),
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