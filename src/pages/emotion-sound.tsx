// YYC³ 情感声效交互平台集成页面
// 将情感声效模块集成到主应用的演示页面

import dynamic from 'next/dynamic'
import * as React from 'react'

// 使用 Next.js 的 dynamic 导入功能，仅在客户端渲染
// 修复动态导入的类型问题，移除对default的引用
const DynamicEmotionSoundDemo = dynamic(
  () => import('../modules/emotion-sound-platform/demo'),
  { 
    ssr: false, 
    loading: () => <div className="p-4">加载中...</div>
  }
)

export default function EmotionSoundPlatformPage() {
  // 使用 div 包装动态导入的组件，确保它只在客户端渲染
  return <div>{typeof window !== 'undefined' && <DynamicEmotionSoundDemo />}</div>;
}