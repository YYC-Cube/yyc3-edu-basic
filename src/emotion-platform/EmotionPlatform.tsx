"use client"

import React, { useState } from 'react'
import { Heart, Brain, Sparkles, Settings, Activity } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// 导入各个子组件
import { EmotionCapture } from './EmotionCapture'
import { ContextAware } from './ContextAware'
import { PersonalityEngine } from './PersonalityEngine'
import { NaturalDialog } from './NaturalDialog'
import { EmotionFeedback } from './EmotionFeedback'

interface EmotionPlatformProps {
  className?: string
}

export const EmotionPlatform: React.FC<EmotionPlatformProps> = ({
  className = ""
}) => {
  const [activeModules, setActiveModules] = useState({
    capture: true,
    context: true,
    personality: true,
    dialog: true,
    feedback: true
  })

  const [platformStats, setPlatformStats] = useState({
    totalInteractions: 147,
    emotionAccuracy: 89,
    adaptationScore: 92,
    userSatisfaction: 94
  })

  const toggleModule = (module: keyof typeof activeModules) => {
    setActiveModules(prev => ({
      ...prev,
      [module]: !prev[module]
    }))
  }

  const getModuleIcon = (module: string) => {
    const icons = {
      capture: <Heart className="w-4 h-4" />,
      context: <Activity className="w-4 h-4" />,
      personality: <Brain className="w-4 h-4" />,
      dialog: <Sparkles className="w-4 h-4" />,
      feedback: <Settings className="w-4 h-4" />
    }
    return icons[module as keyof typeof icons]
  }

  const getModuleName = (module: string) => {
    const names = {
      capture: '情感捕获',
      context: '场景感知', 
      personality: '个性引擎',
      dialog: '自然对话',
      feedback: '情感反馈'
    }
    return names[module as keyof typeof names]
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 平台概览 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="text-red-500" />
            多模态情感交互平台
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center space-y-1">
              <div className="text-2xl font-bold text-blue-600">{platformStats.totalInteractions}</div>
              <div className="text-sm text-gray-500">总交互次数</div>
            </div>
            
            <div className="text-center space-y-1">
              <div className="text-2xl font-bold text-green-600">{platformStats.emotionAccuracy}%</div>
              <div className="text-sm text-gray-500">情感识别准确率</div>
            </div>
            
            <div className="text-center space-y-1">
              <div className="text-2xl font-bold text-purple-600">{platformStats.adaptationScore}%</div>
              <div className="text-sm text-gray-500">智能适配评分</div>
            </div>
            
            <div className="text-center space-y-1">
              <div className="text-2xl font-bold text-orange-600">{platformStats.userSatisfaction}%</div>
