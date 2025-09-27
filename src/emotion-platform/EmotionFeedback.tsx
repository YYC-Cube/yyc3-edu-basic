"use client"

import React, { useState, useEffect } from 'react'
import { Palette, Volume2, Vibrate, Eye, Lightbulb, Settings } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

interface EmotionState {
  primary: string
  intensity: number
  valence: number // 情感效价 (-1 到 1，负面到正面)
  arousal: number // 情感唤醒 (0 到 1，平静到兴奋)
}

interface FeedbackConfig {
  visual: {
    enabled: boolean
    colorIntensity: number
    animationSpeed: number
    particleEffects: boolean
  }
  audio: {
    enabled: boolean
    volume: number
    spatialAudio: boolean
    adaptiveEQ: boolean
  }
  haptic: {
    enabled: boolean
    intensity: number
    pattern: 'subtle' | 'standard' | 'strong'
  }
  ambient: {
    lightAdaptation: boolean
    temperatureSync: boolean
    aromatherapy: boolean
  }
}

interface EmotionFeedbackProps {
  emotionState?: EmotionState
  onConfigChange?: (config: FeedbackConfig) => void
  onEmotionVisualization?: (emotion: string, intensity: number) => void
}

export const EmotionFeedback: React.FC<EmotionFeedbackProps> = ({
  emotionState = { primary: 'calm', intensity: 0.5, valence: 0.2, arousal: 0.3 },
  onConfigChange,
  onEmotionVisualization
}) => {
  const [config, setConfig] = useState<FeedbackConfig>({
    visual: {
      enabled: true,
      colorIntensity: 70,
      animationSpeed: 50,
      particleEffects: true
    },
    audio: {
      enabled: true,
      volume: 60,
      spatialAudio: true,
      adaptiveEQ: true
    },
    haptic: {
      enabled: true,
      intensity: 40,
      pattern: 'standard'
    },
    ambient: {
      lightAdaptation: true,
      temperatureSync: false,
      aromatherapy: false
    }
  })

  const [currentEmotion, setCurrentEmotion] = useState(emotionState)
  const [feedbackActive, setFeedbackActive] = useState(false)
  const [visualPreview, setVisualPreview] = useState('')

  // 更新配置
  const updateConfig = (category: keyof FeedbackConfig, key: string, value: any) => {
    const newConfig = {
      ...config,
      [category]: {
        ...config[category],
        [key]: value
      }
    }
    setConfig(newConfig)
    onConfigChange?.(newConfig)
  }

  // 情感可视化
  const generateEmotionVisualization = (emotion: EmotionState) => {
    const emotionColors = {
      happy: { primary: '#FFD700', secondary: '#FFA500', accent: '#FF6347' },
      excited: { primary: '#FF4500', secondary: '#FF6347', accent: '#FFD700' },
      calm: { primary: '#87CEEB', secondary: '#B0E0E6', accent: '#ADD8E6' },
      focused: { primary: '#9370DB', secondary: '#8A2BE2', accent: '#DDA0DD' },
      curious: { primary: '#32CD32', secondary: '#98FB98', accent: '#90EE90' },
      frustrated: { primary: '#DC143C', secondary: '#B22222', accent: '#FF6B6B' },
      confident: { primary: '#FF8C00', secondary: '#FFA500', accent: '#FFB347' }
    }

    const colors = emotionColors[emotion.primary as keyof typeof emotionColors] || emotionColors.calm
    return colors
  }

  // 音频反馈控制
  const generateAudioFeedback = (emotion: EmotionState) => {
    const audioProfiles = {
      happy: { frequency: 'major', tempo: 'upbeat', instruments: ['piano', 'strings'] },
      excited: { frequency: 'major', tempo: 'fast', instruments: ['drums', 'synth'] },
      calm: { frequency: 'minor', tempo: 'slow', instruments: ['ambient', 'nature'] },
      focused: { frequency: 'neutral', tempo: 'steady', instruments: ['white-noise', 'binaural'] },
      curious: { frequency: 'major', tempo: 'medium', instruments: ['chimes', 'bells'] },
      frustrated: { frequency: 'minor', tempo: 'irregular', instruments: ['muted', 'bass'] },
      confident: { frequency: 'major', tempo: 'strong', instruments: ['brass', 'percussion'] }
    }

    return audioProfiles[emotion.primary as keyof typeof audioProfiles] || audioProfiles.calm
  }

  // 触觉反馈模式
  const getHapticPattern = (emotion: string, intensity: number) => {
    const patterns = {
      happy: '轻快脉动',
      excited: '强烈震动',
      calm: '柔和波动',
      focused: '稳定节拍',
      curious: '探索性点击',
      frustrated: '不规则震动',
      confident: '坚定敲击'
    }

    return patterns[emotion as keyof typeof patterns] || '标准反馈'
  }

  // 模拟情感状态变化
  const simulateEmotionChange = () => {
    const emotions = ['happy', 'excited', 'calm', 'focused', 'curious', 'confident']
    const newEmotion = emotions[Math.floor(Math.random() * emotions.length)]
    
    const newEmotionState: EmotionState = {
      primary: newEmotion,
      intensity: Math.random(),
      valence: (Math.random() - 0.5) * 2,
      arousal: Math.random()
    }

    setCurrentEmotion(newEmotionState)
    onEmotionVisualization?.(newEmotion, newEmotionState.intensity)
  }

  // 启动情感反馈演示
  const startFeedbackDemo = () => {
    setFeedbackActive(true)
    simulateEmotionChange()
    
    // 演示持续5秒
    setTimeout(() => {
      setFeedbackActive(false)
    }, 5000)
  }

  useEffect(() => {
    const colors = generateEmotionVisualization(currentEmotion)
    setVisualPreview(`linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 50%, ${colors.accent} 100%)`)
  }, [currentEmotion])

  const getEmotionEmoji = (emotion: string) => {
    const emojis = {
      happy: '😊',
      excited: '🤩',
      calm: '😌',
      focused: '🧘‍♂️',
      curious: '🤔',
      frustrated: '😤',
      confident: '😎'
    }
    return emojis[emotion as keyof typeof emojis] || '😐'
  }

  return (
    <div className="space-y-6">
      {/* 情感状态可视化 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="text-pink-500" />
            情感反馈系统
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* 当前情感显示 */}
            <div className="text-center space-y-4">
              <div 
                className="w-32 h-32 mx-auto rounded-full flex items-center justify-center text-6xl shadow-lg transition-all duration-1000"
                style={{ 
                  background: visualPreview,
                  transform: feedbackActive ? 'scale(1.1)' : 'scale(1)',
                  filter: feedbackActive ? 'brightness(1.2) saturate(1.3)' : 'brightness(1) saturate(1)'
                }}
              >
                {getEmotionEmoji(currentEmotion.primary)}
              </div>
              
              <div className="space-y-2">
                <Badge className="text-lg px-4 py-2">
                  {currentEmotion.primary.toUpperCase()}
                </Badge>
                
                <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                  <div className="text-center">
                    <div className="text-sm text-gray-500">强度</div>
                    <Progress value={currentEmotion.intensity * 100} className="h-2 mt-1" />
                    <div className="text-xs mt-1">{(currentEmotion.intensity * 100).toFixed(0)}%</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-sm text-gray-500">情感效价</div>
                    <Progress 
                      value={((currentEmotion.valence + 1) / 2) * 100} 
                      className="h-2 mt-1" 
                    />
                    <div className="text-xs mt-1">{currentEmotion.valence > 0 ? '正面' : '负面'}</div>\n                  </div>\n                  \n                  <div className=\"text-center\">\n                    <div className=\"text-sm text-gray-500\">唤醒度</div>\n                    <Progress value={currentEmotion.arousal * 100} className=\"h-2 mt-1\" />\n                    <div className=\"text-xs mt-1\">{currentEmotion.arousal > 0.5 ? '兴奋' : '平静'}</div>\n                  </div>\n                </div>\n              </div>\n            </div>\n            \n            <div className=\"flex justify-center\">\n              <Button onClick={startFeedbackDemo} disabled={feedbackActive}>\n                {feedbackActive ? '反馈演示中...' : '启动情感反馈演示'}\n              </Button>\n            </div>\n          </div>\n        </CardContent>\n      </Card>\n\n      {/* 视觉反馈配置 */}\n      <Card>\n        <CardHeader>\n          <CardTitle className=\"flex items-center gap-2\">\n            <Eye className=\"text-blue-500\" />\n            视觉反馈设置\n          </CardTitle>\n        </CardHeader>\n        <CardContent className=\"space-y-4\">\n          <div className=\"flex items-center justify-between\">\n            <Label>启用视觉反馈</Label>\n            <Switch \n              checked={config.visual.enabled}\n              onCheckedChange={(checked) => updateConfig('visual', 'enabled', checked)}\n            />\n          </div>\n          \n          <div className=\"space-y-2\">\n            <Label>色彩强度: {config.visual.colorIntensity}%</Label>\n            <Slider\n              value={[config.visual.colorIntensity]}\n              onValueChange={([value]) => updateConfig('visual', 'colorIntensity', value)}\n              max={100}\n              step={1}\n              disabled={!config.visual.enabled}\n            />\n          </div>\n          \n          <div className=\"space-y-2\">\n            <Label>动画速度: {config.visual.animationSpeed}%</Label>\n            <Slider\n              value={[config.visual.animationSpeed]}\n              onValueChange={([value]) => updateConfig('visual', 'animationSpeed', value)}\n              max={100}\n              step={1}\n              disabled={!config.visual.enabled}\n            />\n          </div>\n          \n          <div className=\"flex items-center justify-between\">\n            <Label>粒子效果</Label>\n            <Switch \n              checked={config.visual.particleEffects}\n              onCheckedChange={(checked) => updateConfig('visual', 'particleEffects', checked)}\n              disabled={!config.visual.enabled}\n            />\n          </div>\n        </CardContent>\n      </Card>\n\n      {/* 音频反馈配置 */}\n      <Card>\n        <CardHeader>\n          <CardTitle className=\"flex items-center gap-2\">\n            <Volume2 className=\"text-green-500\" />\n            音频反馈设置\n          </CardTitle>\n        </CardHeader>\n        <CardContent className=\"space-y-4\">\n          <div className=\"flex items-center justify-between\">\n            <Label>启用音频反馈</Label>\n            <Switch \n              checked={config.audio.enabled}\n              onCheckedChange={(checked) => updateConfig('audio', 'enabled', checked)}\n            />\n          </div>\n          \n          <div className=\"space-y-2\">\n            <Label>音量: {config.audio.volume}%</Label>\n            <Slider\n              value={[config.audio.volume]}\n              onValueChange={([value]) => updateConfig('audio', 'volume', value)}\n              max={100}\n              step={1}\n              disabled={!config.audio.enabled}\n            />\n          </div>\n          \n          <div className=\"flex items-center justify-between\">\n            <Label>空间音效</Label>\n            <Switch \n              checked={config.audio.spatialAudio}\n              onCheckedChange={(checked) => updateConfig('audio', 'spatialAudio', checked)}\n              disabled={!config.audio.enabled}\n            />\n          </div>\n          \n          <div className=\"flex items-center justify-between\">\n            <Label>自适应均衡器</Label>\n            <Switch \n              checked={config.audio.adaptiveEQ}\n              onCheckedChange={(checked) => updateConfig('audio', 'adaptiveEQ', checked)}\n              disabled={!config.audio.enabled}\n            />\n          </div>\n          \n          <div className=\"p-3 bg-gray-50 rounded-lg\">\n            <div className=\"text-sm font-medium mb-2\">当前音频配置:</div>\n            <div className=\"text-xs space-y-1\">\n              {(() => {\n                const audioProfile = generateAudioFeedback(currentEmotion)\n                return (\n                  <>\n                    <div>音调: {audioProfile.frequency}</div>\n                    <div>节拍: {audioProfile.tempo}</div>\n                    <div>乐器: {audioProfile.instruments.join(', ')}</div>\n                  </>\n                )\n              })()}\n            </div>\n          </div>\n        </CardContent>\n      </Card>\n\n      {/* 触觉反馈配置 */}\n      <Card>\n        <CardHeader>\n          <CardTitle className=\"flex items-center gap-2\">\n            <Vibrate className=\"text-purple-500\" />\n            触觉反馈设置\n          </CardTitle>\n        </CardHeader>\n        <CardContent className=\"space-y-4\">\n          <div className=\"flex items-center justify-between\">\n            <Label>启用触觉反馈</Label>\n            <Switch \n              checked={config.haptic.enabled}\n              onCheckedChange={(checked) => updateConfig('haptic', 'enabled', checked)}\n            />\n          </div>\n          \n          <div className=\"space-y-2\">\n            <Label>震动强度: {config.haptic.intensity}%</Label>\n            <Slider\n              value={[config.haptic.intensity]}\n              onValueChange={([value]) => updateConfig('haptic', 'intensity', value)}\n              max={100}\n              step={1}\n              disabled={!config.haptic.enabled}\n            />\n          </div>\n          \n          <div className=\"space-y-2\">\n            <Label>震动模式</Label>\n            <div className=\"flex gap-2\">\n              {(['subtle', 'standard', 'strong'] as const).map((pattern) => (\n                <Button\n                  key={pattern}\n                  variant={config.haptic.pattern === pattern ? 'default' : 'outline'}\n                  size=\"sm\"\n                  onClick={() => updateConfig('haptic', 'pattern', pattern)}\n                  disabled={!config.haptic.enabled}\n                >\n                  {pattern === 'subtle' ? '轻微' : pattern === 'standard' ? '标准' : '强烈'}\n                </Button>\n              ))}\n            </div>\n          </div>\n          \n          <div className=\"p-3 bg-gray-50 rounded-lg\">\n            <div className=\"text-sm font-medium mb-1\">当前触觉模式:</div>\n            <div className=\"text-xs\">\n              {getHapticPattern(currentEmotion.primary, currentEmotion.intensity)}\n            </div>\n          </div>\n        </CardContent>\n      </Card>\n\n      {/* 环境氛围配置 */}\n      <Card>\n        <CardHeader>\n          <CardTitle className=\"flex items-center gap-2\">\n            <Lightbulb className=\"text-yellow-500\" />\n            环境氛围设置\n          </CardTitle>\n        </CardHeader>\n        <CardContent className=\"space-y-4\">\n          <div className=\"flex items-center justify-between\">\n            <Label>智能光线适配</Label>\n            <Switch \n              checked={config.ambient.lightAdaptation}\n              onCheckedChange={(checked) => updateConfig('ambient', 'lightAdaptation', checked)}\n            />\n          </div>\n          \n          <div className=\"flex items-center justify-between\">\n            <Label>温度同步</Label>\n            <Switch \n              checked={config.ambient.temperatureSync}\n              onCheckedChange={(checked) => updateConfig('ambient', 'temperatureSync', checked)}\n            />\n          </div>\n          \n          <div className=\"flex items-center justify-between\">\n            <Label>香氛疗法</Label>\n            <Switch \n              checked={config.ambient.aromatherapy}\n              onCheckedChange={(checked) => updateConfig('ambient', 'aromatherapy', checked)}\n            />\n          </div>\n        </CardContent>\n      </Card>\n    </div>\n  )\n}