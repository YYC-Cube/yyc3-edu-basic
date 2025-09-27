// YYC³ 情感声效交互平台集成页面
// 将情感声效模块集成到主应用的演示页面

import React from 'react'
import { YYC3EmotionSoundProvider, YYC3EmotionSoundDemoPage } from '../modules/emotion-sound-platform'

export default function EmotionSoundPlatformPage() {
  return (
    <YYC3EmotionSoundProvider enabled={true} volume={0.3}>
      <YYC3EmotionSoundDemoPage />
    </YYC3EmotionSoundProvider>
  )
}