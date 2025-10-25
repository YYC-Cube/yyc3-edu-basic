"use client"

import React, { useState, useEffect, useRef } from 'react'
import { MessageCircle, Mic, Send } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface DialogMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  emotion?: string
  confidence?: number
}

interface DialogContext {
  topic: string
  mood: string
  userPreferences: string[]
  conversationFlow: string[]
}

interface NaturalDialogProps {
  onMessageSent?: (message: DialogMessage) => void
  onEmotionDetected?: (emotion: string, confidence: number) => void
  userName?: string
  assistantName?: string
}

export const NaturalDialog: React.FC<NaturalDialogProps> = ({
  onMessageSent,
  onEmotionDetected,
  userName = '你',
  assistantName = 'YYC³ AI'
}) => {
  const [messages, setMessages] = useState<DialogMessage[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [context] = useState<DialogContext>({
    topic: '学习与创作',
    mood: '积极',
    userPreferences: ['直观解释', '示例驱动', '简洁回答'],
    conversationFlow: []
  })
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const detectUserEmotion = (message: string) => {
    const frustrationWords = ['难', '不懂', '复杂', '困惑', '错误']
    const excitementWords = ['太好了', '明白了', '学会了', '有趣', '酷']
    const questionWords = ['为什么', '怎么', '如何', '什么', '哪个']
    
    if (frustrationWords.some(word => message.includes(word))) {
      return { emotion: 'frustrated', confidence: 0.8 }
    }
    
    if (excitementWords.some(word => message.includes(word))) {
      return { emotion: 'excited', confidence: 0.9 }
    }
    
    if (questionWords.some(word => message.includes(word))) {
      return { emotion: 'curious', confidence: 0.7 }
    }
    
    return { emotion: 'neutral', confidence: 0.5 }
  }

  const getResponse = (userMessage: string) => {
    const { emotion } = detectUserEmotion(userMessage)
    
    if (emotion === 'frustrated') {
      return '别急，我来把它拆解成简单步骤，一步一步带你过。'
    }
    
    if (emotion === 'excited') {
      return '太棒了！我们可以把这个主题延展成一个小项目，继续探索更酷的玩法。'
    }
    
    if (emotion === 'curious') {
      return '好问题！我们一起来从原因、原理、实践三个层面来理解它。'
    }
    
    return '收到~我会根据你的习惯给出清晰直观的解释。'
  }

  const handleSend = () => {
    const text = inputMessage.trim()
    if (!text) return
    
    const userMsg: DialogMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: Date.now()
    }
    
    setMessages(prev => [...prev, userMsg])
    onMessageSent?.(userMsg)
    
    const { emotion, confidence } = detectUserEmotion(text)
    onEmotionDetected?.(emotion, confidence)
    
    const aiMsg: DialogMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: getResponse(text),
      timestamp: Date.now(),
      emotion,
      confidence
    }
    
    setMessages(prev => [...prev, aiMsg])
    setInputMessage('')
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle />
            自然对话系统
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 对话上下文 */}
            <div className="space-y-2">
              <div className="text-sm text-gray-600">当前主题</div>
              <div className="text-sm font-medium">{context.topic}</div>
              
              <div className="text-sm text-gray-600">心情状态</div>
              <Badge variant="outline">{context.mood}</Badge>
              
              <div className="text-sm text-gray-600">偏好设置</div>
              <div className="flex flex-wrap gap-2">
                {context.userPreferences.map((pref) => (
                  <Badge key={pref} variant="secondary">{pref}</Badge>
                ))}
              </div>
            </div>

            {/* 对话区 */}
            <div className="md:col-span-2">
              <ScrollArea className="h-64 border rounded-md p-3">
                <div className="space-y-3">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex items-start gap-2 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                      {msg.role === 'assistant' && (
                        <Avatar className="w-6 h-6">
                          <AvatarImage src="/placeholder-user.jpg" />
                          <AvatarFallback>AI</AvatarFallback>
                        </Avatar>
                      )}
                      
                      <div className={`max-w-[70%] rounded-md p-2 text-sm ${msg.role === 'user' ? 'bg-blue-50 text-blue-700' : 'bg-gray-50 text-gray-800'}`}>
                        <div>{msg.content}</div>
                        <div className="flex items-center gap-2 mt-1 text-xs">
                          <Badge variant="outline">{msg.role === 'user' ? userName : assistantName}</Badge>
                          {msg.emotion && (
                            <Badge variant="secondary">情感：{msg.emotion}（{Math.round((msg.confidence || 0) * 100)}%）</Badge>
                          )}
                          <span className="text-gray-500">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                        </div>
                      </div>
                      
                      {msg.role === 'user' && (
                        <Avatar className="w-6 h-6">
                          <AvatarImage src="/placeholder.jpg" />
                          <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}
                </div>
                <div ref={endRef} />
              </ScrollArea>
              
              <div className="flex gap-2 mt-2">
                <Input 
                  placeholder="输入你的问题或想法..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                />
                <Button onClick={handleSend} className="flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  发送
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Mic className="w-4 h-4" />
                  语音输入
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
