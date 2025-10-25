"use client"

import React, { useState, useEffect } from 'react'
import { User, Star, Target, TrendingUp, Award, Palette } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface UserPersonality {
  type: string
  traits: string[]
  preferences: {
    learningStyle: string
    interactionMode: string
    feedbackType: string
    visualTheme: string
  }
  skills: {
    name: string
    level: number
  }[]
  achievements: string[]
  growthPath: string[]
}

interface PersonalizationSettings {
  uiDensity: 'compact' | 'comfortable' | 'spacious'
  colorScheme: 'light' | 'dark' | 'auto' | 'custom'
  animationLevel: 'none' | 'reduced' | 'full'
  notificationStyle: 'minimal' | 'standard' | 'rich'
}

interface PersonalityEngineProps {
  userId?: string
  onPersonalityUpdate?: (personality: UserPersonality) => void
  onSettingsChange?: (settings: PersonalizationSettings) => void
}

export const PersonalityEngine: React.FC<PersonalityEngineProps> = ({
  onPersonalityUpdate,
  onSettingsChange
}) => {
  const [userPersonality, setUserPersonality] = useState<UserPersonality>({
    type: '探索者型学习者',
    traits: ['好奇', '喜欢挑战', '注重实践', '创新思维'],
    preferences: {
      learningStyle: '实践导向',
      interactionMode: '引导式',
      feedbackType: '鼓励型',
      visualTheme: '活力橙色'
    },
    skills: [
      { name: 'JavaScript', level: 75 },
      { name: 'React', level: 60 },
      { name: 'UI设计', level: 45 },
      { name: '项目管理', level: 30 }
    ],
    achievements: ['首次项目完成', '连续学习7天', '创意设计奖'],
    growthPath: ['掌握TypeScript', '学习Node.js', '全栈开发']
  })

  const [settings, setSettings] = useState<PersonalizationSettings>({
    uiDensity: 'comfortable',
    colorScheme: 'auto',
    animationLevel: 'full',
    notificationStyle: 'standard'
  })

  const [personalityScore, setPersonalityScore] = useState(85)
  const [adaptationLevel, setAdaptationLevel] = useState(92)

  // 模拟个性化学习
  const analyzeUserBehavior = () => {
    const personalityTypes = [
      '探索者型学习者',
      '系统化学习者', 
      '创意型学习者',
      '社交型学习者',
      '分析型学习者'
    ]

    const traits = [
      ['好奇', '喜欢挑战', '注重实践', '创新思维'],
      ['逻辑清晰', '步骤明确', '注重基础', '系统学习'],
      ['想象力丰富', '艺术感强', '直觉思维', '个性表达'],
      ['团队合作', '沟通能力', '分享精神', '互助学习'],
      ['数据驱动', '深度思考', '严谨态度', '问题导向']
    ]

    const randomIndex = Math.floor(Math.random() * personalityTypes.length)
    const newPersonality = {
      ...userPersonality,
      type: personalityTypes[randomIndex],
      traits: traits[randomIndex]
    }

    setUserPersonality(newPersonality)
    setPersonalityScore(70 + Math.random() * 30)
    setAdaptationLevel(80 + Math.random() * 20)
    onPersonalityUpdate?.(newPersonality)
  }

  const updateSettings = (key: keyof PersonalizationSettings, value: unknown) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    onSettingsChange?.(newSettings)
  }

  const getPersonalityIcon = (type: string) => {
    if (type.includes('探索')) return <Target className="w-5 h-5 text-blue-500" />
    if (type.includes('系统')) return <Star className="w-5 h-5 text-purple-500" />
    if (type.includes('创意')) return <Palette className="w-5 h-5 text-pink-500" />
    if (type.includes('社交')) return <User className="w-5 h-5 text-green-500" />
    if (type.includes('分析')) return <TrendingUp className="w-5 h-5 text-orange-500" />
    return <User className="w-5 h-5 text-gray-500" />
  }

  const getSkillColor = (level: number) => {
    if (level > 70) return 'bg-green-500'
    if (level > 40) return 'bg-yellow-500'
    return 'bg-gray-400'
  }

  useEffect(() => {
    // 定期更新个性化数据
    const interval = setInterval(analyzeUserBehavior, 10000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-6">
      {/* 用户画像概览 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="text-blue-500" />
            个性化用户画像
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="w-16 h-16">
              <AvatarImage src="/placeholder-user.webp" />
              <AvatarFallback>YY</AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {getPersonalityIcon(userPersonality.type)}
                <h3 className="text-lg font-semibold">{userPersonality.type}</h3>
              </div>
              
              <div className="flex gap-2 flex-wrap">
                {userPersonality.traits.map((trait, index) => (
                  <Badge key={index} variant="secondary">
                    {trait}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* 技能水平 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {userPersonality.skills.map((skill, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{skill.name}</span>
                  <Badge variant="outline">{skill.level}%</Badge>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`${getSkillColor(skill.level)} h-2 rounded-full`} 
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 个性化设置 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="text-yellow-500" />
            个性化设置
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-700 mb-2">界面密度</div>
              <div className="flex gap-2">
                {(['compact', 'comfortable', 'spacious'] as const).map(density => (
                  <Button 
                    key={density}
                    variant={settings.uiDensity === density ? 'default' : 'outline'}
                    onClick={() => updateSettings('uiDensity', density)}
                  >
                    {density}
                  </Button>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-700 mb-2">颜色主题</div>
              <div className="flex gap-2">
                {(['light', 'dark', 'auto', 'custom'] as const).map(scheme => (
                  <Button 
                    key={scheme}
                    variant={settings.colorScheme === scheme ? 'default' : 'outline'}
                    onClick={() => updateSettings('colorScheme', scheme)}
                  >
                    {scheme}
                  </Button>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-700 mb-2">动画效果</div>
              <div className="flex gap-2">
                {(['none', 'reduced', 'full'] as const).map(level => (
                  <Button 
                    key={level}
                    variant={settings.animationLevel === level ? 'default' : 'outline'}
                    onClick={() => updateSettings('animationLevel', level)}
                  >
                    {level}
                  </Button>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-700 mb-2">通知风格</div>
              <div className="flex gap-2">
                {(['minimal', 'standard', 'rich'] as const).map(style => (
                  <Button 
                    key={style}
                    variant={settings.notificationStyle === style ? 'default' : 'outline'}
                    onClick={() => updateSettings('notificationStyle', style)}
                  >
                    {style}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 适应性评分 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="text-green-500" />
            学习适应性评分
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-700 mb-2">个性化评分</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${personalityScore}%` }}
                />
              </div>
              <div className="text-sm text-gray-600">{personalityScore.toFixed(0)}%</div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-700 mb-2">系统适应性</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full" 
                  style={{ width: `${adaptationLevel}%` }}
                />
              </div>
              <div className="text-sm text-gray-600">{adaptationLevel.toFixed(0)}%</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}