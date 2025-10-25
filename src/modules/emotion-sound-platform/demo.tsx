// YYC³ 情感声效交互平台 - 演示页面
// 展示完整的情感声效交互功能

// 修复React导入方式，避免使用默认导入
import * as React from 'react'
import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Box,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Paper,
  Divider,
  Alert,
  Snackbar
} from '@mui/material'
// Grid组件已替换为div元素，不再需要导入Grid组件
import {
  Psychology,
  RecordVoiceOver,
  Videocam,
  GraphicEq,
  Settings,
  PlayArrow,
  Stop,
  Favorite,
  Science
} from '@mui/icons-material'

import { YYC3EmotionState, YYC3PrimaryEmotion } from './index'

// 缺失组件的临时实现
const YYC3EmotionSoundControlPanel = () => (
  <Card>
    <CardHeader title="控制面板" />
    <CardContent>
      <Typography variant="body2">情感声效控制面板</Typography>
    </CardContent>
  </Card>
)

const YYC3EmotionStateDisplay = ({ emotion, showDetails = false }: { emotion: YYC3EmotionState, showDetails?: boolean }) => (
  <Box>
    <Typography variant="h6">{emotion.primaryEmotion}</Typography>
    {showDetails && (
      <Box sx={{ mt: 1 }}>
        <Typography variant="body2">强度: {emotion.emotionIntensity}</Typography>
        <Typography variant="body2">信心度: {emotion.confidence}</Typography>
      </Box>
    )}
  </Box>
)

const YYC3EmotionSoundVisualizer = ({ width, height }: { width: number, height: number }) => (
  <Box sx={{ width, height, bgcolor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <Typography>情感可视化区域</Typography>
  </Box>
)

const YYC3EmotionSoundTester = () => (
  <Card>
    <CardHeader title="情感声效测试器" />
    <CardContent>
      <Typography variant="body2">测试情感声效的组件</Typography>
    </CardContent>
  </Card>
)

// YYC³ 情感声效演示页面主组件
  export const YYC3EmotionSoundDemoPage = () => {
    return (
      <div>
        <EmotionSoundDemoContent />
      </div>
    );
  };

// 演示页面内容组件
const EmotionSoundDemoContent: React.FC = () => {
  // 临时模拟useYYC3EmotionSound钩子的功能
  // 使用严格类型避免any
  const [currentEmotion, setCurrentEmotion] = useState<YYC3EmotionState | null>(null)
  const playEmotionSound = (emotion: YYC3EmotionState) => {
    console.log(`Playing sound for emotion: ${emotion}`)
    setCurrentEmotion(emotion)
  }
  const getCurrentEmotion = () => currentEmotion
  const [, setCurrentDemo] = useState<'manual' | 'voice' | 'text' | 'auto'>('manual')
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState('')
  const [autoEmotionTimer, setAutoEmotionTimer] = useState<NodeJS.Timeout | null>(null)
  
  // 自动情感演示模式
  const startAutoEmotionDemo = () => {
    const emotions: YYC3EmotionState[] = [
      {
        valence: 0.8,
        arousal: 0.6,
        dominance: 0.4,
        primaryEmotion: YYC3PrimaryEmotion.JOY,
        emotionIntensity: 0.8,
        secondaryEmotions: [],
        confidence: 0.9,
        timestamp: new Date()
      },
      {
        valence: -0.6,
        arousal: 0.3,
        dominance: -0.2,
        primaryEmotion: YYC3PrimaryEmotion.SADNESS,
        emotionIntensity: 0.6,
        secondaryEmotions: [],
        confidence: 0.8,
        timestamp: new Date()
      },
      {
        valence: -0.7,
        arousal: 0.8,
        dominance: 0.6,
        primaryEmotion: YYC3PrimaryEmotion.ANGER,
        emotionIntensity: 0.9,
        secondaryEmotions: [],
        confidence: 0.85,
        timestamp: new Date()
      },
      {
        valence: 0.2,
        arousal: 0.9,
        dominance: -0.3,
        primaryEmotion: YYC3PrimaryEmotion.SURPRISE,
        emotionIntensity: 0.7,
        secondaryEmotions: [],
        confidence: 0.75,
        timestamp: new Date()
      },
      {
        valence: -0.4,
        arousal: 0.7,
        dominance: -0.5,
        primaryEmotion: YYC3PrimaryEmotion.FEAR,
        emotionIntensity: 0.6,
        secondaryEmotions: [],
        confidence: 0.8,
        timestamp: new Date()
      }
    ]
    
    let index = 0
    const timer = setInterval(async () => {
      const emotion = emotions[index % emotions.length]
      await playEmotionSound(emotion)
      
      setNotificationMessage(`播放 ${getEmotionLabel(emotion.primaryEmotion)} 情感声效`)
      setShowNotification(true)
      
      index++
      if (index >= emotions.length * 2) { // 循环2轮
        stopAutoEmotionDemo()
      }
    }, 3000)
    
    setAutoEmotionTimer(timer)
    setCurrentDemo('auto')
  }
  
  const stopAutoEmotionDemo = () => {
    if (autoEmotionTimer) {
      clearInterval(autoEmotionTimer)
      setAutoEmotionTimer(null)
    }
    setCurrentDemo('manual')
  }
  
  const getEmotionLabel = (emotion: YYC3PrimaryEmotion): string => {
    const labels = {
      [YYC3PrimaryEmotion.JOY]: '快乐',
      [YYC3PrimaryEmotion.SADNESS]: '悲伤',
      [YYC3PrimaryEmotion.ANGER]: '愤怒',
      [YYC3PrimaryEmotion.FEAR]: '恐惧',
      [YYC3PrimaryEmotion.SURPRISE]: '惊讶',
      [YYC3PrimaryEmotion.DISGUST]: '厌恶',
      [YYC3PrimaryEmotion.NEUTRAL]: '中性'
    }
    return labels[emotion]
  }
  
  // 快捷情感测试按钮
  const quickEmotionTests = [
    {
      name: '快乐',
      emotion: YYC3PrimaryEmotion.JOY,
      color: '#4caf50',
      state: {
        valence: 0.8,
        arousal: 0.6,
        dominance: 0.4,
        primaryEmotion: YYC3PrimaryEmotion.JOY,
        emotionIntensity: 0.8,
        secondaryEmotions: [],
        confidence: 0.9,
        timestamp: new Date()
      } as YYC3EmotionState
    },
    {
      name: '悲伤',
      emotion: YYC3PrimaryEmotion.SADNESS,
      color: '#2196f3',
      state: {
        valence: -0.6,
        arousal: 0.3,
        dominance: -0.2,
        primaryEmotion: YYC3PrimaryEmotion.SADNESS,
        emotionIntensity: 0.6,
        secondaryEmotions: [],
        confidence: 0.8,
        timestamp: new Date()
      } as YYC3EmotionState
    },
    {
      name: '愤怒',
      emotion: YYC3PrimaryEmotion.ANGER,
      color: '#f44336',
      state: {
        valence: -0.7,
        arousal: 0.8,
        dominance: 0.6,
        primaryEmotion: YYC3PrimaryEmotion.ANGER,
        emotionIntensity: 0.9,
        secondaryEmotions: [],
        confidence: 0.85,
        timestamp: new Date()
      } as YYC3EmotionState
    },
    {
      name: '恐惧',
      emotion: YYC3PrimaryEmotion.FEAR,
      color: '#ff9800',
      state: {
        valence: -0.4,
        arousal: 0.7,
        dominance: -0.5,
        primaryEmotion: YYC3PrimaryEmotion.FEAR,
        emotionIntensity: 0.6,
        secondaryEmotions: [],
        confidence: 0.8,
        timestamp: new Date()
      } as YYC3EmotionState
    }
  ]
  
  const handleQuickTest = async (emotionState: YYC3EmotionState) => {
    await playEmotionSound(emotionState)
    setNotificationMessage(`播放 ${getEmotionLabel(emotionState.primaryEmotion)} 情感声效`)
    setShowNotification(true)
  }
  
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* 页面标题 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box textAlign="center" mb={4}>
          <Typography variant="h3" component="h1" gutterBottom>
            YYC³ 情感声效交互平台
          </Typography>
          <Typography variant="h6" color="textSecondary" paragraph>
            「万象归元于云枢」- 让情感与声音共舞，创造有温度的人机交互体验
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 2 }}>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Alert severity="info" sx={{ display: 'inline-flex' }}>
                基于言语云立方³架构的情感化智能声效系统
              </Alert>
            </motion.div>
          </Box>
        </Box>
      </motion.div>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px' }}>
        {/* 左侧：控制面板和当前状态 */}
        <div style={{ width: '100%', maxWidth: '33.333%', minWidth: '300px', boxSizing: 'border-box' }}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* 控制面板 */}
              <div style={{ width: '100%' }}>
                <YYC3EmotionSoundControlPanel />
              </div>
              
              {/* 当前情感状态 */}
              <div style={{ width: '100%' }}>
                <Card>
                  <CardHeader title="当前情感状态" />
                  <CardContent>
                    {getCurrentEmotion() ? (
                      <YYC3EmotionStateDisplay 
                        emotion={getCurrentEmotion()!} 
                        showDetails 
                      />
                    ) : (
                      <Typography variant="body2" color="textSecondary">
                        暂无情感数据，请播放声效进行测试
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              {/* 快捷测试按钮 */}
              <div style={{ width: '100%' }}>
                <Card>
                  <CardHeader title="快捷情感测试" />
                  <CardContent>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {quickEmotionTests.map((test) => (
                        <div style={{ width: '50%', boxSizing: 'border-box', padding: '4px' }} key={test.name}>
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Paper
                              style={{
                                padding: '12px',
                                textAlign: 'center',
                                cursor: 'pointer',
                                backgroundColor: `${test.color}15`,
                                border: `1px solid ${test.color}40`
                              }}
                              onClick={() => handleQuickTest(test.state)}
                            >
                              <Typography 
                                variant="body2" 
                                style={{ color: test.color, fontWeight: 'bold' }}
                              >
                                {test.name}
                              </Typography>
                            </Paper>
                          </motion.div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* 中间：可视化器 */}
        <div style={{ width: '100%', maxWidth: '33.333%', minWidth: '300px', boxSizing: 'border-box' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card style={{ height: 'fit-content' }}>
              <CardHeader title="情感声效可视化" />
              <CardContent>
                <YYC3EmotionSoundVisualizer 
                  width={350}
                  height={200}
                />
                <Divider style={{ margin: '16px 0' }} />
                <Typography variant="body2" color="textSecondary" textAlign="center">
                  实时展示情感状态的声效波形和视觉特征
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </div>
        
        {/* 右侧：测试器 */}
        <div style={{ width: '100%', maxWidth: '33.333%', minWidth: '300px', boxSizing: 'border-box' }}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <YYC3EmotionSoundTester />
          </motion.div>
        </div>
      
      </div>
        
        {/* 功能介绍卡片 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Box mt={4}>
          <Typography variant="h5" gutterBottom textAlign="center">
            平台核心功能
          </Typography>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '16px' }}>
            <div style={{ width: '100%', maxWidth: '25%', minWidth: '280px' }}>
              <Card sx={{ height: '100%', textAlign: 'center' }}>
                <CardContent>
                  <Psychology style={{ fontSize: '48px', color: 'primary.main', marginBottom: '16px' }} />
                  <Typography variant="h6" gutterBottom>
                    情感识别
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    多模态情感识别，支持文本、语音、视觉等输入方式
                  </Typography>
                </CardContent>
              </Card>
            </div>
            
            <div style={{ width: '100%', maxWidth: '25%', minWidth: '280px' }}>
              <Card sx={{ height: '100%', textAlign: 'center' }}>
                <CardContent>
                  <GraphicEq style={{ fontSize: '48px', color: 'secondary.main', marginBottom: '16px' }} />
                  <Typography variant="h6" gutterBottom>
                    声效合成
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    实时音频合成，基于情感状态生成对应的声效反馈
                  </Typography>
                </CardContent>
              </Card>
            </div>
            
            <div style={{ width: '100%', maxWidth: '25%', minWidth: '280px' }}>
              <Card sx={{ height: '100%', textAlign: 'center' }}>
                <CardContent>
                  <Favorite style={{ fontSize: '48px', color: 'error.main', marginBottom: '16px' }} />
                  <Typography variant="h6" gutterBottom>
                    情感共鸣
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    智能情感映射，创造与用户情感状态同频的交互体验
                  </Typography>
                </CardContent>
              </Card>
            </div>
            
            <div style={{ width: '100%', maxWidth: '25%', minWidth: '280px' }}>
              <Card sx={{ height: '100%', textAlign: 'center' }}>
                <CardContent>
                  <Science style={{ fontSize: '48px', color: 'info.main', marginBottom: '16px' }} />
                  <Typography variant="h6" gutterBottom>
                    个性化适应
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    基于用户行为和反馈，持续学习和优化声效体验
                  </Typography>
                </CardContent>
              </Card>
            </div>
          </div>
        </Box>
      </motion.div>
      
      {/* 悬浮操作按钮 */}
      <SpeedDial
        ariaLabel="情感声效操作"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
      >
        <SpeedDialAction
          key="auto-demo"
          icon={autoEmotionTimer ? <Stop /> : <PlayArrow />}
          tooltipTitle={autoEmotionTimer ? "停止自动演示" : "开始自动演示"}
          onClick={autoEmotionTimer ? stopAutoEmotionDemo : startAutoEmotionDemo}
        />
        <SpeedDialAction
          key="voice-input"
          icon={<RecordVoiceOver />}
          tooltipTitle="语音情感识别"
          onClick={() => setCurrentDemo('voice')}
        />
        <SpeedDialAction
          key="video-input"
          icon={<Videocam />}
          tooltipTitle="视觉情感识别"
          onClick={() => setCurrentDemo('text')}
        />
        <SpeedDialAction
          key="settings"
          icon={<Settings />}
          tooltipTitle="系统设置"
        />
      </SpeedDial>
      
      {/* 通知消息 */}
      <Snackbar
        open={showNotification}
        autoHideDuration={3000}
        onClose={() => setShowNotification(false)}
        message={notificationMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      />
    </Container>
  )
}

// 组件已定义并可直接使用，无需额外导出