"use client"

import React, { useState, useEffect } from 'react'
import { User, Star, Target, TrendingUp, Award, Palette } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
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
  userId = 'user-001',
  onPersonalityUpdate,
  onSettingsChange
}) => {
  const [userPersonality, setUserPersonality] = useState<UserPersonality>({
    type: '探索者型学习者',
    traits: ['好奇心强', '喜欢挑战', '注重实践', '创新思维'],
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
      ['好奇心强', '喜欢挑战', '注重实践', '创新思维'],
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

  const updateSettings = (key: keyof PersonalizationSettings, value: any) => {
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
  }, [])\n\n  return (\n    <div className=\"space-y-6\">\n      {/* 用户画像概览 */}\n      <Card>\n        <CardHeader>\n          <CardTitle className=\"flex items-center gap-2\">\n            <User className=\"text-blue-500\" />\n            个性化用户画像\n          </CardTitle>\n        </CardHeader>\n        <CardContent>\n          <div className=\"flex items-center gap-4 mb-6\">\n            <Avatar className=\"w-16 h-16\">\n              <AvatarImage src=\"/placeholder-user.webp\" />\n              <AvatarFallback>YY</AvatarFallback>\n            </Avatar>\n            \n            <div className=\"flex-1\">\n              <div className=\"flex items-center gap-2 mb-2\">\n                {getPersonalityIcon(userPersonality.type)}\n                <h3 className=\"text-lg font-semibold\">{userPersonality.type}</h3>\n              </div>\n              \n              <div className=\"flex gap-2 flex-wrap\">\n                {userPersonality.traits.map((trait, index) => (\n                  <Badge key={index} variant=\"secondary\">\n                    {trait}\n                  </Badge>\n                ))}\n              </div>\n            </div>\n            \n            <div className=\"text-center\">\n              <div className=\"text-2xl font-bold text-blue-600\">{personalityScore.toFixed(0)}</div>\n              <div className=\"text-sm text-gray-500\">匹配度</div>\n            </div>\n          </div>\n          \n          <div className=\"grid grid-cols-2 md:grid-cols-4 gap-4\">\n            <div className=\"text-center space-y-1\">\n              <div className=\"font-medium text-sm\">{userPersonality.preferences.learningStyle}</div>\n              <div className=\"text-xs text-gray-500\">学习风格</div>\n            </div>\n            \n            <div className=\"text-center space-y-1\">\n              <div className=\"font-medium text-sm\">{userPersonality.preferences.interactionMode}</div>\n              <div className=\"text-xs text-gray-500\">交互模式</div>\n            </div>\n            \n            <div className=\"text-center space-y-1\">\n              <div className=\"font-medium text-sm\">{userPersonality.preferences.feedbackType}</div>\n              <div className=\"text-xs text-gray-500\">反馈类型</div>\n            </div>\n            \n            <div className=\"text-center space-y-1\">\n              <div className=\"font-medium text-sm\">{userPersonality.preferences.visualTheme}</div>\n              <div className=\"text-xs text-gray-500\">视觉主题</div>\n            </div>\n          </div>\n        </CardContent>\n      </Card>\n\n      {/* 技能成长图谱 */}\n      <Card>\n        <CardHeader>\n          <CardTitle>技能成长图谱</CardTitle>\n        </CardHeader>\n        <CardContent>\n          <div className=\"space-y-4\">\n            {userPersonality.skills.map((skill, index) => (\n              <div key={index} className=\"space-y-2\">\n                <div className=\"flex justify-between items-center\">\n                  <span className=\"font-medium\">{skill.name}</span>\n                  <Badge className={`${getSkillColor(skill.level)} text-white`}>\n                    Lv.{Math.floor(skill.level / 20) + 1}\n                  </Badge>\n                </div>\n                <Progress value={skill.level} className=\"h-2\" />\n                <div className=\"text-right text-xs text-gray-500\">{skill.level}%</div>\n              </div>\n            ))}\n          </div>\n        </CardContent>\n      </Card>\n\n      {/* 成就系统 */}\n      <Card>\n        <CardHeader>\n          <CardTitle className=\"flex items-center gap-2\">\n            <Award className=\"text-yellow-500\" />\n            成就与里程碑\n          </CardTitle>\n        </CardHeader>\n        <CardContent>\n          <div className=\"space-y-4\">\n            <div>\n              <h4 className=\"font-medium mb-2\">🏆 已获得成就</h4>\n              <div className=\"flex gap-2 flex-wrap\">\n                {userPersonality.achievements.map((achievement, index) => (\n                  <Badge key={index} variant=\"outline\" className=\"border-yellow-400 text-yellow-600\">\n                    {achievement}\n                  </Badge>\n                ))}\n              </div>\n            </div>\n            \n            <div>\n              <h4 className=\"font-medium mb-2\">🎯 成长路径</h4>\n              <div className=\"space-y-2\">\n                {userPersonality.growthPath.map((path, index) => (\n                  <div key={index} className=\"flex items-center gap-2\">\n                    <div className=\"w-2 h-2 bg-blue-400 rounded-full\"></div>\n                    <span className=\"text-sm\">{path}</span>\n                  </div>\n                ))}\n              </div>\n            </div>\n          </div>\n        </CardContent>\n      </Card>\n\n      {/* 个性化设置 */}\n      <Card>\n        <CardHeader>\n          <CardTitle>千人千面个性化设置</CardTitle>\n        </CardHeader>\n        <CardContent>\n          <div className=\"space-y-6\">\n            <div>\n              <h4 className=\"font-medium mb-3\">界面密度</h4>\n              <div className=\"flex gap-2\">\n                {(['compact', 'comfortable', 'spacious'] as const).map((density) => (\n                  <Button\n                    key={density}\n                    variant={settings.uiDensity === density ? 'default' : 'outline'}\n                    size=\"sm\"\n                    onClick={() => updateSettings('uiDensity', density)}\n                  >\n                    {density === 'compact' ? '紧凑' : density === 'comfortable' ? '舒适' : '宽松'}\n                  </Button>\n                ))}\n              </div>\n            </div>\n            \n            <div>\n              <h4 className=\"font-medium mb-3\">色彩主题</h4>\n              <div className=\"flex gap-2\">\n                {(['light', 'dark', 'auto', 'custom'] as const).map((theme) => (\n                  <Button\n                    key={theme}\n                    variant={settings.colorScheme === theme ? 'default' : 'outline'}\n                    size=\"sm\"\n                    onClick={() => updateSettings('colorScheme', theme)}\n                  >\n                    {theme === 'light' ? '浅色' : theme === 'dark' ? '深色' : theme === 'auto' ? '自动' : '自定义'}\n                  </Button>\n                ))}\n              </div>\n            </div>\n            \n            <div>\n              <h4 className=\"font-medium mb-3\">动画效果</h4>\n              <div className=\"flex gap-2\">\n                {(['none', 'reduced', 'full'] as const).map((level) => (\n                  <Button\n                    key={level}\n                    variant={settings.animationLevel === level ? 'default' : 'outline'}\n                    size=\"sm\"\n                    onClick={() => updateSettings('animationLevel', level)}\n                  >\n                    {level === 'none' ? '无动画' : level === 'reduced' ? '简化' : '完整'}\n                  </Button>\n                ))}\n              </div>\n            </div>\n            \n            <div className=\"pt-4 border-t\">\n              <div className=\"flex justify-between items-center\">\n                <span className=\"font-medium\">智能适配程度</span>\n                <Badge variant=\"outline\">{adaptationLevel.toFixed(0)}%</Badge>\n              </div>\n              <Progress value={adaptationLevel} className=\"mt-2\" />\n            </div>\n          </div>\n        </CardContent>\n      </Card>\n    </div>\n  )\n}