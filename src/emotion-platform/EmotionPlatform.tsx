"use client"

import React, { useState } from 'react'
import { Heart } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface EmotionPlatformProps {
  className?: string
}

export const EmotionPlatform: React.FC<EmotionPlatformProps> = ({
  className = ""
}) => {
  const [platformStats] = useState({
    totalInteractions: 147,
    emotionAccuracy: 89,
    adaptationScore: 92,
    userSatisfaction: 94
  })

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
              <div className="text-sm text-gray-500">用户满意度</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}