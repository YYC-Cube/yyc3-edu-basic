// YYC³ 情感声效交互平台 - React组件库
// 提供完整的情感声效交互UI组件

import React, { useState, useEffect, useRef, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Slider,
  Switch,
  Button,
  Chip,
  Avatar,
  LinearProgress,
  Box,
  Grid,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material'
import {
  VolumeUp,
  VolumeOff,
  PlayArrow,
  Settings,
  Psychology,
  MoodBad,
  Mood,
  SentimentVeryDissatisfied,
  SentimentDissatisfied,
  SentimentNeutral,
  SentimentSatisfied,
  SentimentVerySatisfied
} from '@mui/icons-material'

import {
  useYYC3EmotionSound,
  YYC3EmotionState,
  YYC3PrimaryEmotion,
  YYC3SoundParameters,
  YYC3EmotionSoundPreset,
  YYC3PresetUsage
} from './index'

// YYC³ 情感声效控制面板组件
export const YYC3EmotionSoundControlPanel: React.FC<{
  className?: string
  compact?: boolean
}> = ({ className, compact = false }) => {
  const { setEnabled, setVolume, getCurrentEmotion } = useYYC3EmotionSound()
  const [isEnabled, setIsEnabled] = useState(true)
  const [volume, setVolumeState] = useState(0.3)
  const [showSettings, setShowSettings] = useState(false)
  
  const currentEmotion = getCurrentEmotion()
  
  const handleEnabledChange = (checked: boolean) => {
    setIsEnabled(checked)
    setEnabled(checked)
  }
  
  const handleVolumeChange = (_: Event, value: number | number[]) => {
    const newVolume = Array.isArray(value) ? value[0] : value
    setVolumeState(newVolume / 100)
    setVolume(newVolume / 100)
  }
  
  const getEmotionIcon = (emotion: YYC3PrimaryEmotion) => {
    const iconMap = {
      [YYC3PrimaryEmotion.JOY]: <SentimentVerySatisfied color="success" />,
      [YYC3PrimaryEmotion.SADNESS]: <SentimentVeryDissatisfied color="info" />,
      [YYC3PrimaryEmotion.ANGER]: <MoodBad color="error" />,
      [YYC3PrimaryEmotion.FEAR]: <SentimentDissatisfied color="warning" />,
      [YYC3PrimaryEmotion.SURPRISE]: <SentimentSatisfied color="secondary" />,
      [YYC3PrimaryEmotion.DISGUST]: <SentimentNeutral color="action" />,
      [YYC3PrimaryEmotion.NEUTRAL]: <Mood color="disabled" />
    }
    return iconMap[emotion] || <Mood />
  }
  
  if (compact) {
    return (
      <Paper className={className} sx={{ p: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Switch
          size="small"
          checked={isEnabled}
          onChange={(e) => handleEnabledChange(e.target.checked)}
        />
        <Slider
          size="small"
          value={volume * 100}
          onChange={handleVolumeChange}
          min={0}
          max={100}
          sx={{ width: 80 }}
        />
        {currentEmotion && getEmotionIcon(currentEmotion.primaryEmotion)}
      </Paper>
    )
  }
  
  return (
    <Card className={className}>
      <CardHeader
        title="情感声效控制"
        action={
          <IconButton onClick={() => setShowSettings(true)}>
            <Settings />
          </IconButton>
        }
        avatar={
          <Avatar sx={{ bgcolor: 'primary.main' }}>
            <Psychology />
          </Avatar>
        }
      />
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={isEnabled}
                  onChange={(e) => handleEnabledChange(e.target.checked)}
                />
              }
              label="启用情感声效"
            />
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="body2" color="textSecondary">
              音量控制
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <VolumeOff />
              <Slider
                value={volume * 100}
                onChange={handleVolumeChange}
                min={0}
                max={100}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${value}%`}
                sx={{ flex: 1 }}
              />
              <VolumeUp />
            </Box>
          </Grid>
          
          {currentEmotion && (
            <Grid item xs={12}>
              <Typography variant="body2" color="textSecondary">
                当前情感状态
              </Typography>
              <YYC3EmotionStateDisplay emotion={currentEmotion} />
            </Grid>
          )}
        </Grid>
        
        {/* 设置对话框 */}
        <YYC3EmotionSoundSettings
          open={showSettings}
          onClose={() => setShowSettings(false)}
        />
      </CardContent>
    </Card>
  )
}

// YYC³ 情感状态显示组件
export const YYC3EmotionStateDisplay: React.FC<{
  emotion: YYC3EmotionState
  showDetails?: boolean
}> = ({ emotion, showDetails = false }) => {
  const getEmotionColor = (primaryEmotion: YYC3PrimaryEmotion): string => {
    const colorMap = {
      [YYC3PrimaryEmotion.JOY]: '#4caf50',      // 绿色 - 快乐
      [YYC3PrimaryEmotion.SADNESS]: '#2196f3',  // 蓝色 - 悲伤
      [YYC3PrimaryEmotion.ANGER]: '#f44336',    // 红色 - 愤怒
      [YYC3PrimaryEmotion.FEAR]: '#ff9800',     // 橙色 - 恐惧
      [YYC3PrimaryEmotion.SURPRISE]: '#9c27b0', // 紫色 - 惊讶
      [YYC3PrimaryEmotion.DISGUST]: '#795548',  // 棕色 - 厌恶
      [YYC3PrimaryEmotion.NEUTRAL]: '#9e9e9e'   // 灰色 - 中性
    }
    return colorMap[primaryEmotion]
  }
  
  const getEmotionLabel = (primaryEmotion: YYC3PrimaryEmotion): string => {
    const labelMap = {
      [YYC3PrimaryEmotion.JOY]: '快乐',
      [YYC3PrimaryEmotion.SADNESS]: '悲伤',
      [YYC3PrimaryEmotion.ANGER]: '愤怒',
      [YYC3PrimaryEmotion.FEAR]: '恐惧',
      [YYC3PrimaryEmotion.SURPRISE]: '惊讶',
      [YYC3PrimaryEmotion.DISGUST]: '厌恶',
      [YYC3PrimaryEmotion.NEUTRAL]: '中性'
    }
    return labelMap[primaryEmotion]
  }
  
  const emotionColor = getEmotionColor(emotion.primaryEmotion)
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Paper 
        sx={{ 
          p: 2, 
          borderLeft: `4px solid ${emotionColor}`,
          background: `linear-gradient(135deg, ${emotionColor}10, transparent)`
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Chip
            label={getEmotionLabel(emotion.primaryEmotion)}
            sx={{
              bgcolor: emotionColor,
              color: 'white',
              fontWeight: 'bold'
            }}
            size="small"
          />
          <Typography variant="body2" color="textSecondary">
            强度: {(emotion.emotionIntensity * 100).toFixed(0)}%
          </Typography>
          <Typography variant="body2" color="textSecondary">
            置信度: {(emotion.confidence * 100).toFixed(0)}%
          </Typography>
        </Box>
        
        {showDetails && (
          <Grid container spacing={1}>
            <Grid item xs={4}>
              <Typography variant="caption" color="textSecondary">效价</Typography>
              <LinearProgress
                variant="determinate"
                value={(emotion.valence + 1) * 50}
                color={emotion.valence > 0 ? 'success' : 'error'}
                sx={{ height: 6, borderRadius: 3 }}
              />
              <Typography variant="caption">
                {emotion.valence.toFixed(2)}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="caption" color="textSecondary">唤醒度</Typography>
              <LinearProgress
                variant="determinate"
                value={(emotion.arousal + 1) * 50}
                color="info"
                sx={{ height: 6, borderRadius: 3 }}
              />
              <Typography variant="caption">
                {emotion.arousal.toFixed(2)}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="caption" color="textSecondary">支配性</Typography>
              <LinearProgress
                variant="determinate"
                value={(emotion.dominance + 1) * 50}
                color="secondary"
                sx={{ height: 6, borderRadius: 3 }}
              />
              <Typography variant="caption">
                {emotion.dominance.toFixed(2)}
              </Typography>
            </Grid>
          </Grid>
        )}
        
        {emotion.secondaryEmotions.length > 0 && (
          <Box sx={{ mt: 1 }}>
            <Typography variant="caption" color="textSecondary">
              次要情绪:
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 0.5 }}>
              {emotion.secondaryEmotions.map((secondary, index) => (
                <Chip
                  key={index}
                  label={`${getEmotionLabel(secondary.emotion)} ${(secondary.weight * 100).toFixed(0)}%`}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: '0.7rem' }}
                />
              ))}
            </Box>
          </Box>
        )}
      </Paper>
    </motion.div>
  )
}

// YYC³ 情感声效可视化器组件
export const YYC3EmotionSoundVisualizer: React.FC<{
  soundParameters?: YYC3SoundParameters
  emotion?: YYC3EmotionState
  width?: number
  height?: number
}> = ({ soundParameters, emotion, width = 300, height = 150 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  
  useEffect(() => {
    if (!canvasRef.current || (!soundParameters && !emotion)) return
    
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // 设置画布尺寸
    canvas.width = width * window.devicePixelRatio
    canvas.height = height * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    
    let time = 0
    
    const animate = () => {
      // 清除画布
      ctx.clearRect(0, 0, width, height)
      
      if (emotion) {
        drawEmotionVisualization(ctx, emotion, width, height, time)
      }
      
      if (soundParameters) {
        drawSoundVisualization(ctx, soundParameters, width, height, time)
      }
      
      time += 0.016 // 60 FPS
      animationRef.current = requestAnimationFrame(animate)
    }
    
    animate()
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [soundParameters, emotion, width, height])
  
  const drawEmotionVisualization = (
    ctx: CanvasRenderingContext2D,
    emotion: YYC3EmotionState,
    width: number,
    height: number,
    time: number
  ) => {
    const centerX = width / 2
    const centerY = height / 2
    
    // 基于情感状态的颜色
    const hue = (emotion.valence + 1) * 180 // 0-360度
    const saturation = Math.abs(emotion.arousal) * 100
    const lightness = 50 + emotion.emotionIntensity * 30
    
    // 绘制情感波形
    ctx.strokeStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`
    ctx.lineWidth = 2 + emotion.emotionIntensity * 3
    ctx.beginPath()
    
    for (let x = 0; x < width; x++) {
      const frequency = 0.02 + Math.abs(emotion.arousal) * 0.05
      const amplitude = (height / 4) * emotion.emotionIntensity
      const phase = time * 2 + emotion.valence * Math.PI
      
      const y = centerY + Math.sin(x * frequency + phase) * amplitude
      
      if (x === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    }
    
    ctx.stroke()
    
    // 绘制情感强度指示器
    const radius = 5 + emotion.emotionIntensity * 15
    ctx.fillStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, 0.7)`
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
    ctx.fill()
  }
  
  const drawSoundVisualization = (
    ctx: CanvasRenderingContext2D,
    params: YYC3SoundParameters,
    width: number,
    height: number,
    time: number
  ) => {
    const centerY = height / 2
    
    // 绘制频率波形
    ctx.strokeStyle = '#00bcd4'
    ctx.lineWidth = 2
    ctx.beginPath()
    
    for (let x = 0; x < width; x++) {
      const normalizedX = x / width
      const frequency = (params.frequency / 1000) * 0.1 // 标准化频率
      const amplitude = (height / 3) * params.amplitude
      
      const y = centerY + Math.sin(normalizedX * Math.PI * frequency * 10 + time * 5) * amplitude
      
      if (x === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    }
    
    ctx.stroke()
  }
  
  return (
    <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, overflow: 'hidden' }}>
      <canvas
        ref={canvasRef}
        style={{
          width: width,
          height: height,
          display: 'block',
          background: 'rgba(0, 0, 0, 0.05)'
        }}
      />
    </Box>
  )
}

// YYC³ 情感声效预设选择器组件
export const YYC3EmotionSoundPresetSelector: React.FC<{
  presets: YYC3EmotionSoundPreset[]
  selectedPreset?: string
  onPresetChange: (presetId: string) => void
  filterBy?: {
    emotion?: YYC3PrimaryEmotion
    usage?: YYC3PresetUsage
    tags?: string[]
  }
}> = ({ presets, selectedPreset, onPresetChange, filterBy }) => {
  const filteredPresets = useMemo(() => {
    if (!filterBy) return presets
    
    return presets.filter(preset => {
      if (filterBy.emotion && preset.targetEmotion !== filterBy.emotion) {
        return false
      }
      if (filterBy.usage && preset.usage !== filterBy.usage) {
        return false
      }
      if (filterBy.tags && !filterBy.tags.some(tag => preset.tags.includes(tag))) {
        return false
      }
      return true
    })
  }, [presets, filterBy])
  
  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        声效预设
      </Typography>
      <Grid container spacing={1}>
        {filteredPresets.map(preset => (
          <Grid item xs={6} sm={4} md={3} key={preset.id}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                sx={{
                  cursor: 'pointer',
                  borderColor: selectedPreset === preset.id ? 'primary.main' : 'divider',
                  borderWidth: selectedPreset === preset.id ? 2 : 1,
                  borderStyle: 'solid'
                }}
                onClick={() => onPresetChange(preset.id)}
              >
                <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                  <Typography variant="caption" component="div" noWrap>
                    {preset.name}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
                    <Chip
                      label={preset.targetEmotion}
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{ fontSize: '0.6rem' }}
                    />
                    <Typography variant="caption" color="textSecondary">
                      {preset.usage}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

// YYC³ 情感声效测试器组件
export const YYC3EmotionSoundTester: React.FC = () => {
  const { playEmotionSound } = useYYC3EmotionSound()
  const [testEmotion, setTestEmotion] = useState<YYC3EmotionState>({
    valence: 0,
    arousal: 0,
    dominance: 0,
    primaryEmotion: YYC3PrimaryEmotion.NEUTRAL,
    emotionIntensity: 0.5,
    secondaryEmotions: [],
    confidence: 1.0,
    timestamp: new Date()
  })
  
  const handleEmotionChange = (key: keyof YYC3EmotionState, value: number | string) => {
    setTestEmotion(prev => ({
      ...prev,
      [key]: value,
      timestamp: new Date()
    }))
  }
  
  const handlePlaySound = async () => {
    await playEmotionSound(testEmotion)
  }
  
  return (
    <Card>
      <CardHeader
        title="情感声效测试器"
        action={
          <Button
            variant="contained"
            startIcon={<PlayArrow />}
            onClick={handlePlaySound}
          >
            播放测试音效
          </Button>
        }
      />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" gutterBottom>
              效价 (负面 ↔ 正面)
            </Typography>
            <Slider
              value={testEmotion.valence}
              onChange={(_, value) => handleEmotionChange('valence', value)}
              min={-1}
              max={1}
              step={0.1}
              marks={[
                { value: -1, label: '负面' },
                { value: 0, label: '中性' },
                { value: 1, label: '正面' }
              ]}
              valueLabelDisplay="auto"
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" gutterBottom>
              唤醒度 (平静 ↔ 兴奋)
            </Typography>
            <Slider
              value={testEmotion.arousal}
              onChange={(_, value) => handleEmotionChange('arousal', value)}
              min={-1}
              max={1}
              step={0.1}
              marks={[
                { value: -1, label: '平静' },
                { value: 0, label: '中等' },
                { value: 1, label: '兴奋' }
              ]}
              valueLabelDisplay="auto"
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" gutterBottom>
              支配性 (被动 ↔ 主动)
            </Typography>
            <Slider
              value={testEmotion.dominance}
              onChange={(_, value) => handleEmotionChange('dominance', value)}
              min={-1}
              max={1}
              step={0.1}
              marks={[
                { value: -1, label: '被动' },
                { value: 0, label: '中性' },
                { value: 1, label: '主动' }
              ]}
              valueLabelDisplay="auto"
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" gutterBottom>
              情绪强度
            </Typography>
            <Slider
              value={testEmotion.emotionIntensity}
              onChange={(_, value) => handleEmotionChange('emotionIntensity', value)}
              min={0}
              max={1}
              step={0.1}
              marks={[
                { value: 0, label: '微弱' },
                { value: 0.5, label: '中等' },
                { value: 1, label: '强烈' }
              ]}
              valueLabelDisplay="auto"
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel>主要情绪</InputLabel>
              <Select
                value={testEmotion.primaryEmotion}
                onChange={(e) => handleEmotionChange('primaryEmotion', e.target.value)}
              >
                <MenuItem value={YYC3PrimaryEmotion.JOY}>快乐</MenuItem>
                <MenuItem value={YYC3PrimaryEmotion.SADNESS}>悲伤</MenuItem>
                <MenuItem value={YYC3PrimaryEmotion.ANGER}>愤怒</MenuItem>
                <MenuItem value={YYC3PrimaryEmotion.FEAR}>恐惧</MenuItem>
                <MenuItem value={YYC3PrimaryEmotion.SURPRISE}>惊讶</MenuItem>
                <MenuItem value={YYC3PrimaryEmotion.DISGUST}>厌恶</MenuItem>
                <MenuItem value={YYC3PrimaryEmotion.NEUTRAL}>中性</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="body2" gutterBottom>
              当前情感状态预览
            </Typography>
            <YYC3EmotionStateDisplay emotion={testEmotion} showDetails />
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="body2" gutterBottom>
              声效可视化
            </Typography>
            <YYC3EmotionSoundVisualizer emotion={testEmotion} />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

// YYC³ 情感声效设置对话框
export const YYC3EmotionSoundSettings: React.FC<{
  open: boolean
  onClose: () => void
}> = ({ open, onClose }) => {
  const [settings, setSettings] = useState({
    sensitivity: 0.5,
    adaptation: 0.3,
    spatialAudio: false,
    culturalAdaptation: true,
    personalityAware: true
  })
  
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>情感声效设置</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <Typography variant="body2" gutterBottom>
              情感敏感度
            </Typography>
            <Slider
              value={settings.sensitivity}
              onChange={(_, value) => setSettings(prev => ({ ...prev, sensitivity: value as number }))}
              min={0}
              max={1}
              step={0.1}
              marks={[
                { value: 0, label: '低' },
                { value: 0.5, label: '中' },
                { value: 1, label: '高' }
              ]}
              valueLabelDisplay="auto"
            />
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="body2" gutterBottom>
              适应速度
            </Typography>
            <Slider
              value={settings.adaptation}
              onChange={(_, value) => setSettings(prev => ({ ...prev, adaptation: value as number }))}
              min={0}
              max={1}
              step={0.1}
              marks={[
                { value: 0, label: '缓慢' },
                { value: 0.5, label: '中等' },
                { value: 1, label: '快速' }
              ]}
              valueLabelDisplay="auto"
            />
          </Grid>
          
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.spatialAudio}
                  onChange={(e) => setSettings(prev => ({ ...prev, spatialAudio: e.target.checked }))}
                />
              }
              label="启用空间音频"
            />
          </Grid>
          
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.culturalAdaptation}
                  onChange={(e) => setSettings(prev => ({ ...prev, culturalAdaptation: e.target.checked }))}
                />
              }
              label="文化适应性调整"
            />
          </Grid>
          
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.personalityAware}
                  onChange={(e) => setSettings(prev => ({ ...prev, personalityAware: e.target.checked }))}
                />
              }
              label="个性化音效"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>取消</Button>
        <Button variant="contained" onClick={onClose}>保存</Button>
      </DialogActions>
    </Dialog>
  )
}

// 导出所有组件
export {
  YYC3EmotionSoundControlPanel,
  YYC3EmotionStateDisplay,
  YYC3EmotionSoundVisualizer,
  YYC3EmotionSoundPresetSelector,
  YYC3EmotionSoundTester,
  YYC3EmotionSoundSettings
}