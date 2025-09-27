// YYC³ 可视化编程平台 - 统一入口
"use client"

import React from 'react'
import { VisualEditor } from '../src/visual-editor/VisualEditor'

// 导入类型（这些会在运行时从实际文件中导入）
interface VisualProject {
  id: string
  name: string
  version: string
  nodes: any[]
  edges: any[]
  metadata: Record<string, any>
}

interface CompileResult {
  code: string
  errors: any[]
  warnings: any[]
  metrics: any
}

export interface UserProfile {
  id: string
  name: string
  avatar?: string
}

export interface YYCVisualPlatformProps {
  // 项目配置
  initialProject?: VisualProject
  projectName?: string
  readOnly?: boolean
  
  // 功能开关
  enableEducationMode?: boolean
  enableAIAssistant?: boolean
  enableCollaboration?: boolean
  
  // 环境配置
  targetFramework?: 'React' | 'Vue' | 'VanillaJS'
  currentUser?: UserProfile
  
  // 回调函数
  onProjectSave?: (project: VisualProject) => void
  onCodeGenerate?: (result: CompileResult) => void
  onEducationProgress?: (progress: any) => void
  
  // 样式和国际化
  theme?: 'light' | 'dark'
  className?: string
  locale?: string
}

/**
 * YYC³ 可视化编程平台主入口
 * 
 * 功能特性：
 * ✅ 拖拽式可视化编程
 * ✅ 多框架代码生成 (React/Vue/Vanilla JS)
 * ✅ 实时编译和预览
 * ✅ 智能代码优化
 * ✅ 教育模式集成
 * ✅ AI 编程助手
 * ✅ 实时协作功能
 * ✅ 移动端优化
 * ✅ 只读展示模式
 * ✅ 国际化支持
 * 
 * 使用示例：
 * ```tsx
 * import { YYCVisualPlatform } from '@/components/visual-programming'
 * 
 * function App() {
 *   return (
 *     <YYCVisualPlatform
 *       enableEducationMode
 *       enableAIAssistant
 *     />
 *   )
 * }
 * ```
 */
export function YYCVisualPlatform({
  initialProject,
  projectName = "YYC³ 可视化项目",
  readOnly = false,
  enableEducationMode = true,
  enableAIAssistant = true,
  enableCollaboration = false,
  targetFramework = 'React',
  currentUser,
  onProjectSave,
  onCodeGenerate,
  onEducationProgress,
  theme = 'light',
  className = '',
  locale = 'zh-CN'
}: YYCVisualPlatformProps) {
  const handleProjectChange = (project: VisualProject) => {
    onProjectSave?.(project)
  }

  const handleCompileComplete = (result: CompileResult) => {
    onCodeGenerate?.(result)
  }

  return (
    <div className={`yyc-visual-platform ${theme} ${className} flex flex-col h-full w-full`}>
      {/* 平台头部，可放置项目名、保存按钮、用户头像等 */}
      <header className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-lg font-semibold">{projectName}</h1>
        {/* 这里可以添加更多头部控件，如保存、发布按钮等 */}
      </header>
      
      <main className="flex-grow">
        <VisualEditor
          initialProject={initialProject}
          onProjectChange={handleProjectChange}
          onCompileComplete={handleCompileComplete}
          // 传递核心功能 props
          readOnly={readOnly}
          enableAIAssistant={enableAIAssistant}
          enableEducationMode={enableEducationMode}
          enableCollaboration={enableCollaboration}
          targetFramework={targetFramework}
          currentUser={currentUser}
          locale={locale}
          className="h-full w-full"
        />
      </main>
    </div>
  )
}

// 导出核心类型和功能（类型定义）
export type { VisualProject, CompileResult, UserProfile }

// 导出主组件
export { VisualEditor } from '../src/visual-editor/VisualEditor'

// 平台信息
export const PLATFORM_INFO = {
  name: 'YYC³ Visual Programming Platform',
  version: '1.0.0',
  description: '基于 React + Next.js 的可视化编程平台',
  features: [
    '拖拽式可视化编程',
    '多框架代码生成',
    '实时编译预览',
    '智能代码优化',
    '教育模式集成',
    'AI 编程助手',
    '实时协作功能',
    '只读展示模式',
    '国际化支持'
  ],
  frameworks: ['React', 'Vue.js', 'Vanilla JS'],
  languages: ['TypeScript', 'JavaScript'],
  author: 'YanyuCloud Cube',
  license: 'MIT'
}