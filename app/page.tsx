"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"
import { Mic, Send, Download, Upload, X, Volume2, VolumeX, Square, Brain, Wand2, Shield, Gauge, Palette } from "lucide-react"
import { AnimatedTextBlock } from "@/components/typewriter-effect"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useLocalModels } from "@/hooks/use-local-models"
import { useEducationAI } from "@/hooks/use-education-ai"
import { ModelSelector } from "@/components/model-selector"
import { GeometricAnimation } from "@/components/geometric-animation"
import GlobalAuditDashboard from "@/components/global-audit-dashboard"
import type { LocalModel } from "@/lib/local-models"

type AppState = "splash" | "main"

interface SmartSuggestion {
  title: string
  description: string
  icon: string
  action: string
}

export default function Dashboard() {
  const [isMounted, setIsMounted] = useState(false)
  const [appState, setAppState] = useState<AppState>("splash")
  const [showSplashHint, setShowSplashHint] = useState(false)
  const [userInput, setUserInput] = useState("")
  const [chatMessages, setChatMessages] = useState<
    Array<{
      type: "user" | "ai" | "system"
      content: string
      timestamp: Date
      isAnimated?: boolean
    }>
  >([])

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [chatMode, setChatMode] = useState<"deep" | "fast">("fast")
  const [selectedModel, setSelectedModel] = useState("gpt-4")
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [smartSuggestions, setSmartSuggestions] = useState<SmartSuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  // 语音功能状态
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [audioChunks, setAudioChunks] = useState<Blob[]>([])

  const { localModels, sendMessage: sendLocalMessage } = useLocalModels()
  const { subjects, askQuestion, analyzeLearningProgress } = useEducationAI()
  const [selectedModelType, setSelectedModelType] = useState<"cloud" | "local">("cloud")
  const [selectedLocalModel, setSelectedLocalModel] = useState<LocalModel | null>(null)

  // 教育AI智能提示配置
  const educationSuggestions = {
    subjects: [
      {
        title: "语文学习",
        description: "古诗词、作文、阅读理解",
        icon: "📚",
        action: "我想学习语文，请帮我制定学习计划",
      },
      {
        title: "数学训练",
        description: "基础数学、逻辑思维",
        icon: "🔢",
        action: "我需要数学学习指导，请帮我分析薄弱环节",
      },
      {
        title: "奥数竞赛",
        description: "数学竞赛专项训练",
        icon: "🏆",
        action: "我想参加奥数竞赛，请为我制定训练方案",
      },
      {
        title: "英语提升",
        description: "听说读写全面发展",
        icon: "🌍",
        action: "我想提高英语水平，请帮我规划学习路径",
      },
      { title: "科学探索", description: "物理化学生物综合", icon: "🔬", action: "我对科学很感兴趣，请推荐学习内容" },
      { title: "艺术创作", description: "绘画音乐创意培养", icon: "🎨", action: "我想培养艺术创作能力，请给我建议" },
    ],
  }

  // 自动滚动到最新消息
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [chatMessages])

  // 智能提示逻辑
  useEffect(() => {
    if (!userInput.trim()) {
      setShowSuggestions(false)
      return
    }

    const lowerInput = userInput.toLowerCase()
    let suggestions: SmartSuggestion[] = []

    // 检查教育相关关键词
    const educationKeywords = ["学习", "数学", "语文", "英语", "科学", "奥数", "竞赛", "作业", "考试", "提高", "辅导"]
    if (educationKeywords.some((keyword) => lowerInput.includes(keyword))) {
      suggestions = [...suggestions, ...educationSuggestions.subjects.slice(0, 3)]
    }

    setSmartSuggestions(suggestions)
    setShowSuggestions(suggestions.length > 0)
  }, [userInput])

  // 语音识别功能
  const startVoiceRecording = async () => {
    if (!isMounted || typeof window === 'undefined' || !navigator.mediaDevices) return
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setAudioChunks((prev) => [...prev, event.data])
        }
      }

      recorder.onstop = () => {
        setTimeout(() => {
          setUserInput("语音输入：老师，我想学习奥数竞赛")
        }, 1000)
        stream.getTracks().forEach((track) => track.stop())
      }

      recorder.start()
      setMediaRecorder(recorder)
      setIsRecording(true)
    } catch (error) {
      console.error("无法访问麦克风:", error)
    }
  }

  const stopVoiceRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop()
      setIsRecording(false)
      setMediaRecorder(null)
    }
  }

  // 语音播放功能
  const speakText = (text: string) => {
    if (!voiceEnabled || !isMounted || typeof window === 'undefined' || !speechSynthesis) return

    speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = "zh-CN"
    utterance.rate = 0.9
    utterance.pitch = 1

    utterance.onstart = () => setIsPlaying(true)
    utterance.onend = () => setIsPlaying(false)
    utterance.onerror = () => setIsPlaying(false)

    speechSynthesis.speak(utterance)
  }

  const stopSpeaking = () => {
    if (!isMounted || typeof window === 'undefined' || !speechSynthesis) return
    
    speechSynthesis.cancel()
    setIsPlaying(false)
  }

  // 客户端挂载检查
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // 启动页面逻辑
  useEffect(() => {
    if (isMounted && appState === "splash") {
      const timer = setTimeout(() => {
        setShowSplashHint(true)
      }, 3000)

      const handleKeyPress = (e: KeyboardEvent) => {
        const splashElement = document.querySelector(".splash-container")
        if (splashElement) {
          splashElement.classList.add("animate-fade-out")
          setTimeout(() => {
            setAppState("main")
          }, 800)
        } else {
          setAppState("main")
        }
      }

      const handleClick = () => {
        const splashElement = document.querySelector(".splash-container")
        if (splashElement) {
          splashElement.classList.add("animate-scale-out")
          setTimeout(() => {
            setAppState("main")
          }, 600)
        } else {
          setAppState("main")
        }
      }

      document.addEventListener("keydown", handleKeyPress)
      document.addEventListener("click", handleClick)

      return () => {
        clearTimeout(timer)
        document.removeEventListener("keydown", handleKeyPress)
        document.removeEventListener("click", handleClick)
      }
    }
  }, [appState, isMounted])

  // 处理用户输入
  const handleSendMessage = () => {
    if (!userInput.trim() || !isMounted) return

    const newUserMessage = {
      type: "user" as const,
      content: userInput,
      timestamp: new Date(),
    }

    setChatMessages((prev) => [...prev, newUserMessage])
    setShowSuggestions(false)

    // AI响应逻辑
    setTimeout(() => {
      generateAIResponse(userInput).then((aiResponse) => {
        // 如果是字符串，转换为对象格式
        const response = typeof aiResponse === "string" ? { content: aiResponse, isAnimated: true } : aiResponse

        setChatMessages((prev) => [
          ...prev,
          {
            type: "ai",
            content: response.content,
            timestamp: new Date(),
            isAnimated: response.isAnimated || false,
          },
        ])

        if (voiceEnabled) {
          setTimeout(
            () => {
              speakText(response.content)
            },
            response.content.length * 30 + 1000,
          ) // 根据文本长度调整语音播放时机
        }
      })
    }, 1000)

    setUserInput("")
  }

  // 处理智能提示点击
  const handleSuggestionClick = (suggestion: SmartSuggestion) => {
    setUserInput(suggestion.action)
    setShowSuggestions(false)
    inputRef.current?.focus()
  }

  // 文件上传处理
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setUploadedFiles((prev) => [...prev, ...files])
  }

  // 文件下载处理
  const handleDownload = () => {
    if (!isMounted) return
    
    const chatContent = chatMessages
      .map((msg) => `[${msg.timestamp.toLocaleString()}] ${msg.type.toUpperCase()}: ${msg.content}`)
      .join("\n\n")

    const blob = new Blob([chatContent], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `Mr_Zhou_AI_Chat_${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // 增强的AI响应生成
  const generateAIResponse = async (input: string): Promise<string> => {
    if (selectedModelType === "local" && selectedLocalModel) {
      try {
        const messages = [
          {
            role: "system",
            content:
              "你是YYC3 AI智能教育中心的专业AI导师，专注于中国教育2023-2025年小学、初中多学科教学。请用中文回复。",
          },
          { role: "user", content: input },
        ]
        const response = await sendLocalMessage(selectedLocalModel, messages)
        return response
      } catch (error) {
        return `❌ 本地模型调用失败: ${error instanceof Error ? error.message : "未知错误"}\n\n请检查模型服务是否正常运行，或切换到云端模型。`
      }
    }

    const lowerInput = input.toLowerCase()

    // 教育AI智能体响应
    if (
      ["学习", "数学", "语文", "英语", "科学", "奥数", "竞赛", "作业", "考试", "提高", "辅导"].some((keyword) =>
        lowerInput.includes(keyword),
      )
    ) {
      // 奥数竞赛专项
      if (lowerInput.includes("奥数") || lowerInput.includes("竞赛")) {
        return {
          content: `🏆 **YYC³ AI - 奥数竞赛专项训练系统**

🎯 **专业奥数竞赛培训，助力数学天才成长**

📚 **核心训练模块：**
• **数论专题** - 质数、最大公约数、同余理论、不定方程
• **几何专题** - 平面几何、立体几何、几何证明、几何变换  
• **代数专题** - 方程不等式、函数图像、数列递推、多项式
• **组合数学** - 排列组合、概率统计、图论基础、递推关系

🎖️ **竞赛级别训练：**
• **基础巩固** - 夯实数学基础，培养数学思维
• **提高训练** - 掌握竞赛技巧，提升解题能力
• **竞赛冲刺** - 真题模拟，名师指导，冲击奖项

💡 **AI智能功能：**
• **个性化题库** - 根据能力水平智能推送练习题
• **解题思路启发** - AI导师逐步引导解题思路
• **竞赛模拟训练** - 真实竞赛环境模拟体验
• **名师视频讲解** - 顶级数学教师在线指导

📊 **学习效果保障：**
• 85%学生成绩显著提升
• 60%学习效率大幅提高  
• 95%用户满意度认可
• 30天见效承诺

🚀 **立即开始：**
请告诉我您的年级和当前数学水平，我将为您制定专属的奥数竞赛训练计划！

想要开始哪个专题的学习呢？`,
          isAnimated: true,
        }
      }

      // 通用教育响应
      return {
        content: `🎓 **YYC³ AI 智能教育中心**

欢迎来到专业的中国教育2023-2025年小学、初中多学科AI智能体系统！

📚 **全学科覆盖：**
• **语文** - 古诗词赏析、作文指导、阅读理解、汉字书写
• **数学** - 基础运算、几何图形、代数方程、数学建模
• **奥数竞赛** - 数论、几何、代数、组合数学专项训练 🏆
• **英语** - 词汇积累、语法学习、听说训练、文化理解
• **科学** - 物理化学生物、科学实验、创新思维
• **艺术** - 绘画技巧、音乐欣赏、创意设计、美育熏陶

🤖 **AI智能功能：**
• **个性化学习路径** - 根据学生特点定制专属计划
• **24小时智能答疑** - 全天候AI导师在线解答
• **实时学情分析** - 动态评估学习进度和效果
• **游戏化学习体验** - 寓教于乐，激发学习兴趣

📈 **效果保障：**
• 85%学生成绩显著提升
• 60%学习效率大幅提高
• 95%用户满意度认可  
• 30天见效承诺

🎯 **请告诉我：**
• 您的年级和学习需求
• 想要重点提升的学科
• 当前的学习困难或目标

我将为您提供最专业的个性化学习指导！`,
        isAnimated: true,
      }
    }

    // 默认响应
    return {
      content: `👋 **欢迎使用 YYC³ AI 智能教育中心**

我是您的专属AI教育导师，专注于为中国小学、初中学生提供全学科智能化学习支持。

🎯 **我可以帮助您：**
• 制定个性化学习计划
• 解答各学科疑难问题
• 提供奥数竞赛专项训练
• 分析学习进度和效果
• 推荐适合的学习资源

💡 **使用建议：**
• 直接提出您的学习问题或需求
• 告诉我您的年级和想学习的科目
• 上传作业或试题，我来帮您解答
• 使用语音功能，让学习更便捷

请告诉我您想要学习什么，或者有什么问题需要解答？`,
      isAnimated: true,
    }
  }

  // 启动页面渲染
  if (appState === "splash") {
    return (
      <div className="splash-container min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-950 text-white relative overflow-hidden flex items-center justify-center">
        <GeometricAnimation color="#06b6d4" speed={0.8} />

        <div className="relative z-10 text-center transform transition-all duration-1000">
          {/* LOGO区域 */}
          <div className="mb-12 transform hover:scale-105 transition-transform duration-300">
            <div className="relative inline-block">
              <img
                src="/yanyucloudcube-logo.webp"
                alt="YanYu Cloud Cube AI Logo"
                className="h-40 w-40 mx-auto mb-8 drop-shadow-2xl transition duration-700 slow-pulse"
                style={{ filter: 'drop-shadow(0 0 24px #60a5fa) brightness(1.08)' }}
              />
            </div>
          </div>

          {/* 品牌名称区域 */}
          <div className="mb-16 space-y-6">
            <h1 className="text-6xl font-bold mb-8 bg-gradient-to-r from-white via-blue-200 to-blue-400 bg-clip-text text-transparent animate-fade-in-up tracking-wider">
              YanYu Cloud Cube AI
            </h1>
            <h2 className="text-2xl font-light text-blue-200 tracking-widest animate-fade-in-up animation-delay-300">
              万象归元于云枢 丨深栈智启新纪元
            </h2>
            {/* 英文长标语及下方内容已删除 */}
          </div>

          {/* 交互提示区域 */}
          {showSplashHint && (
            <div className="animate-fade-in-up space-y-6">
              <div className="text-cyan-300 text-2xl mb-6 animate-bounce-gentle">
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-1 h-1 bg-cyan-400 rounded-full animate-ping"></div>
                  <span>点击任意位置或按任意键继续</span>
                  <div className="w-1 h-1 bg-cyan-400 rounded-full animate-ping animation-delay-300"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // 主界面渲染
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-slate-300">正在初始化...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-950 text-white relative overflow-hidden">
      <GeometricAnimation color="#06b6d4" speed={0.5} className="opacity-20" />

      {/* 主内容区域 */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* 顶部品牌标识 */}
        <div className="absolute top-4 left-4 flex items-center space-x-3">
          <Dialog>
            <DialogTrigger asChild>
              <button className="focus:outline-none">
                <img src="/yanyucloudcube-logo.webp" alt="设置" className="h-8 w-8 hover:scale-110 transition-transform" />
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2">
                  <Gauge className="h-5 w-5 text-blue-500" />
                  <span>系统设置</span>
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-2">
                <div>
                  <Label className="font-bold text-blue-600">大模型选择</Label>
                  <ModelSelector value={selectedModel} onValueChange={setSelectedModel} onModelSelect={(model) => {
                    setSelectedModelType(model.type)
                    if (model.type === "local") {
                      const localModel = localModels.find((m) => m.id === model.id)
                      setSelectedLocalModel(localModel || null)
                    }
                  }} />
                </div>
                <div>
                  <Label className="font-bold text-blue-600">系统提示词设定</Label>
                  <input type="text" className="w-full border rounded px-2 py-1 mt-1 text-black" placeholder="请输入系统提示词..." />
                </div>
                <div>
                  <Label className="font-bold text-blue-600">热度（Temperature）</Label>
                  <input type="range" min={0} max={1} step={0.01} className="w-full" />
                </div>
                <div>
                  <Label className="font-bold text-blue-600">API拉取与封装</Label>
                  <input type="text" className="w-full border rounded px-2 py-1 mt-1 text-black" placeholder="API地址或密钥..." />
                  <Button className="mt-2">绑定API</Button>
                </div>
                <div>
                  <Label className="font-bold text-blue-600">本地运维工具</Label>
                  <div className="text-xs text-gray-600">模型管理、API测试、日志查看、健康检查等</div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            YanYu Cloud Cube AI
          </span>
        </div>

        {/* 中央对话区域 */}
        <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full p-6 pt-16">
          {/* 聊天消息区域 */}
          <div className="flex-1 mb-6 space-y-4 overflow-y-auto max-h-[70vh] scroll-smooth">
            {/* 交互页面中心内容已删除 */}

            {chatMessages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.type === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
              >
                <div
                  className={`max-w-[80%] ${
                    message.type === "user"
                      ? "bg-cyan-600/20 border border-cyan-500/30 backdrop-blur-sm"
                      : message.type === "ai"
                        ? "bg-slate-800/30 border border-slate-700/30 backdrop-blur-sm"
                        : "bg-blue-600/20 border border-blue-500/30 backdrop-blur-sm"
                  } rounded-2xl p-4 relative group shadow-lg`}
                >
                  {message.type !== "user" && (
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarFallback className="bg-cyan-600 text-white text-xs">AI</AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-cyan-300">YYC³ AI</span>
                      </div>
                      {message.type === "ai" && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => speakText(message.content)}
                              >
                                <Volume2 className="h-3 w-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>播放语音</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  )}
                  <div className="text-slate-100 whitespace-pre-line">
                    {message.type === "ai" && message.isAnimated ? (
                      <AnimatedTextBlock
                        text={message.content}
                        speed={25}
                        onComplete={() => {
                          // 动画完成后的回调
                        }}
                      />
                    ) : (
                      message.content
                    )}
                  </div>
                  <div className="text-xs text-slate-400 mt-2">
                    {isMounted ? message.timestamp.toLocaleTimeString() : '--:--:--'}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* 输入区域 */}
          <div className="relative">
            {/* 智能功能提示 */}
            {showSuggestions && smartSuggestions.length > 0 && (
              <div className="absolute bottom-full left-0 right-0 mb-2 z-20">
                <div className="bg-slate-800/90 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-4 shadow-xl">
                  <div className="flex items-center mb-3">
                    <div className="text-lg mr-2">💡</div>
                    <span className="text-sm text-slate-300">智能学习建议</span>
                  </div>
                  <div className="space-y-2">
                    {smartSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-700/50 hover:bg-slate-600/50 transition-colors text-left group"
                      >
                        <div className="flex items-center">
                          <span className="text-xl mr-3">{suggestion.icon}</span>
                          <div>
                            <div className="text-sm text-slate-200 font-medium">{suggestion.title}</div>
                            <div className="text-xs text-slate-400">{suggestion.description}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/30 rounded-2xl p-4 shadow-lg">
              {/* 上传文件显示 */}
              {uploadedFiles.length > 0 && (
                <div className="mb-3">
                  <div className="text-sm text-slate-400 mb-2">已上传文件:</div>
                  <div className="flex flex-wrap gap-2">
                    {uploadedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-1 text-xs text-slate-300"
                      >
                        {file.name}
                        <button
                          onClick={() => setUploadedFiles((prev) => prev.filter((_, i) => i !== index))}
                          className="ml-2 text-slate-500 hover:text-red-400"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-3">
                {/* 文件操作按钮组 */}
                <div className="flex items-center space-x-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-slate-400 hover:text-cyan-400 rounded-full"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Upload className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>上传文件</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-slate-400 hover:text-green-400 rounded-full"
                          onClick={handleDownload}
                          disabled={chatMessages.length === 0}
                        >
                          <Download className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>下载聊天记录</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-slate-400 hover:text-blue-400 rounded-full"
                          onClick={() => window.open('/visual-programming', '_blank')}
                        >
                          <Palette className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>可视化编程平台</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-slate-400 hover:text-purple-400 rounded-full"
                            >
                              <Gauge className="h-5 w-5" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="flex items-center space-x-2">
                                <Shield className="h-5 w-5 text-purple-500" />
                                <span>全局智能审核</span>
                              </DialogTitle>
                            </DialogHeader>
                            <GlobalAuditDashboard />
                          </DialogContent>
                        </Dialog>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>全局智能审核</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileUpload} />

                {/* 文本输入 */}
                <div className="flex-1 relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="请输入您的学习问题或需求..."
                    className="w-full bg-slate-700/30 border border-slate-600/30 rounded-xl px-4 py-3 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 backdrop-blur-sm"
                  />
                </div>

                {/* 语音功能按钮组 */}
                <div className="flex items-center space-x-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={`rounded-full ${
                            isRecording
                              ? "text-red-500 hover:text-red-400 animate-pulse"
                              : "text-slate-400 hover:text-cyan-400"
                          }`}
                          onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
                        >
                          {isRecording ? <Square className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{isRecording ? "停止录音" : "语音输入"}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={`rounded-full ${
                            isPlaying
                              ? "text-green-500 hover:text-green-400"
                              : voiceEnabled
                                ? "text-slate-400 hover:text-cyan-400"
                                : "text-slate-600 hover:text-slate-500"
                          }`}
                          onClick={() => {
                            if (isPlaying) {
                              stopSpeaking()
                            } else {
                              setVoiceEnabled(!voiceEnabled)
                            }
                          }}
                        >
                          {isPlaying ? (
                            <VolumeX className="h-5 w-5" />
                          ) : voiceEnabled ? (
                            <Volume2 className="h-5 w-5" />
                          ) : (
                            <VolumeX className="h-5 w-5" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{isPlaying ? "停止播放" : voiceEnabled ? "关闭语音输出" : "开启语音输出"}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                {/* 发送按钮 */}
                <Button
                  onClick={handleSendMessage}
                  disabled={!userInput.trim()}
                  className="bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 rounded-xl px-6"
                >
                  <Send className="h-4 w-4 mr-2" />
                  发送
                </Button>
              </div>

              {/* 底部控制 */}
              <div className="flex items-center justify-between mt-3 text-xs text-slate-500">
                <div className="flex items-center space-x-2">
                  <Brain className="h-3 w-3 text-cyan-500" />
                  <Label htmlFor="chat-mode" className="text-xs text-slate-400">
                    模式
                  </Label>
                  <Switch
                    id="chat-mode"
                    checked={chatMode === "deep"}
                    onCheckedChange={(checked) => setChatMode(checked ? "deep" : "fast")}
                  />
                  <span className="text-xs text-slate-400">{chatMode === "deep" ? "深度分析" : "快速回答"}</span>
                  {chatMode === "deep" && <Wand2 className="h-3 w-3 text-purple-500 animate-pulse" />}
                </div>

                <div className="flex items-center space-x-2">
                  <ModelSelector
                    value={selectedModel}
                    onValueChange={setSelectedModel}
                    onModelSelect={(model) => {
                      setSelectedModelType(model.type)
                      if (model.type === "local") {
                        const localModel = localModels.find((m) => m.id === model.id)
                        setSelectedLocalModel(localModel || null)
                      }
                    }}
                  />
                  <span className="text-xs text-slate-500">{isRecording ? "录音中..." : "按 Enter 发送消息"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
