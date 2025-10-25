"use client"

import { useState, useCallback } from "react"
import { EDUCATION_SUBJECTS, type Subject, type LearningProgress } from "@/config/education-system"

interface QuestionRequest {
  subject: string
  topic: string
  question: string
  difficulty: "basic" | "intermediate" | "advanced" | "competition"
  studentLevel: string
}

interface AIResponse {
  answer: string
  explanation: string
  relatedTopics: string[]
  nextSteps: string[]
  confidence: number
}

interface LearningPathRequest {
  subject: string
  level: string
  goals?: string[]
  preferences?: Record<string, string | number | boolean>
}

interface LearningPathResponse {
  path: Array<{ title: string; description: string; resources?: string[] }>
  recommendations?: string[]
}

export function useEducationAI() {
  const [subjects] = useState<Subject[]>(EDUCATION_SUBJECTS)
  const [learningProgress, setLearningProgress] = useState<LearningProgress[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const askQuestion = useCallback(
    async (request: QuestionRequest): Promise<AIResponse> => {
      setIsLoading(true)

      try {
        // 模拟AI响应延迟
        await new Promise((resolve) => setTimeout(resolve, 1500))

        const subject = subjects.find((s) => s.id === request.subject)
        const topic = subject?.topics.find((t) => t.id === request.topic)

        // 根据学科和主题生成智能回答
        let answer = ""
        let explanation = ""
        let relatedTopics: string[] = []
        let nextSteps: string[] = []

        if (request.subject === "math-competition") {
          answer = generateMathCompetitionResponse(request)
          explanation = "这是一道典型的奥数竞赛题目，需要运用数学思维和解题技巧。"
          relatedTopics = ["数学思维", "解题策略", "竞赛技巧"]
          nextSteps = ["练习类似题型", "掌握解题方法", "参加模拟竞赛", "总结解题经验"]
        } else if (request.subject === "chinese") {
          answer = generateChineseResponse(request)
          explanation = "语文学习需要注重积累和理解，培养语言文字运用能力。"
          relatedTopics = ["语言文字", "文学素养", "表达能力"]
          nextSteps = ["多读优秀作品", "练习写作表达", "积累词汇语句", "培养语感"]
        } else {
          answer = generateGeneralResponse(request)
          explanation = `这是${subject?.name}学科的重要知识点，需要理解和掌握。`
          relatedTopics = topic?.keywords.slice(0, 3) || []
          nextSteps = ["理解基本概念", "练习相关题目", "总结知识要点", "应用到实际问题"]
        }

        return {
          answer,
          explanation,
          relatedTopics,
          nextSteps,
          confidence: 0.85 + Math.random() * 0.1,
        }
      } finally {
        setIsLoading(false)
      }
    },
    [subjects],
  )

  const analyzeLearningProgress = useCallback(
    (subjectId: string) => {
      const subjectProgress = learningProgress.filter((p) => p.subjectId === subjectId)

      if (subjectProgress.length === 0) {
        return {
          averageScore: 0,
          totalTime: 0,
          completedTopics: 0,
          strengths: [],
          weaknesses: [],
          recommendations: ["开始学习基础知识", "制定学习计划", "设定学习目标"],
        }
      }

      const averageScore = subjectProgress.reduce((sum, p) => sum + p.score, 0) / subjectProgress.length
      const totalTime = subjectProgress.reduce((sum, p) => sum + p.timeSpent, 0)
      const completedTopics = subjectProgress.length

      const strengths = subjectProgress
        .filter((p) => p.score >= 80)
        .map((p) => p.topicId)
        .slice(0, 3)

      const weaknesses = subjectProgress
        .filter((p) => p.score < 60)
        .map((p) => p.topicId)
        .slice(0, 3)

      const recommendations = generateRecommendations(averageScore, weaknesses)

      return {
        averageScore,
        totalTime,
        completedTopics,
        strengths,
        weaknesses,
        recommendations,
      }
    },
    [learningProgress],
  )

  const recordProgress = useCallback((progress: Omit<LearningProgress, "completedAt">) => {
    const newProgress: LearningProgress = {
      ...progress,
      completedAt: new Date(),
    }

    setLearningProgress((prev) => [...prev, newProgress])
  }, [])

  const generateLearningPath = useCallback(
    async (request: LearningPathRequest): Promise<LearningPathResponse> => {
      setIsLoading(true)
      try {
        const res = await fetch('/api/learning-paths', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(request),
        })
        const data = await res.json()
        return data as LearningPathResponse
      } finally {
        setIsLoading(false)
      }
    },
    [],
  )

  return {
    subjects,
    learningProgress,
    isLoading,
    askQuestion,
    analyzeLearningProgress,
    recordProgress,
    generateLearningPath,
  }
}

function generateMathCompetitionResponse(request: QuestionRequest): string {
  const responses = [
    `🏆 **奥数竞赛解题指导**

这道题目考查的是${request.topic}的核心概念。让我们一步步分析：

**解题思路：**
1. 首先理解题目条件和要求
2. 寻找关键信息和隐含条件
3. 选择合适的解题方法
4. 逐步推理，注意逻辑严密性
5. 验证答案的合理性

**解题技巧：**
• 画图辅助理解（几何题）
• 设未知数建立方程（代数题）
• 寻找规律和特殊情况
• 运用数学归纳法
• 反证法和构造法

**练习建议：**
建议多做类似题型，掌握解题套路，培养数学直觉。`,

    `🎯 **竞赛数学专项训练**

针对您的问题，这属于${request.topic}的经典题型。

**核心知识点：**
• 理论基础要扎实
• 解题方法要灵活
• 计算过程要准确
• 答案表述要规范

**提升策略：**
1. 系统学习理论知识
2. 大量练习典型题目
3. 总结解题规律
4. 参加模拟竞赛
5. 与同学交流讨论

记住：奥数竞赛不仅考查知识，更考查思维能力！`,
  ]

  return responses[Math.floor(Math.random() * responses.length)]
}

function generateChineseResponse(request: QuestionRequest): string {
  const responses = [
    `📚 **语文学习指导**

关于${request.topic}的学习，我来为您详细解答：

**学习要点：**
• 注重基础知识的积累
• 培养良好的阅读习惯
• 提高语言表达能力
• 增强文学鉴赏水平

**学习方法：**
1. 多读经典文学作品
2. 勤写读书笔记
3. 练习各种文体写作
4. 背诵优美诗文
5. 参与讨论交流

**提升建议：**
语文学习是一个长期积累的过程，需要持之以恒的努力。`,

    `✍️ **语文素养提升**

${request.topic}是语文学习的重要组成部分：

**核心能力：**
• 理解能力 - 准确把握文意
• 表达能力 - 清晰表达思想
• 鉴赏能力 - 感受文学之美
• 运用能力 - 灵活运用语言

**实践方法：**
通过大量阅读、思考、写作来提高语文素养，培养语感和文学品味。`,
  ]

  return responses[Math.floor(Math.random() * responses.length)]
}

function generateGeneralResponse(request: QuestionRequest): string {
  return `📖 **学习指导**

关于${request.topic}的问题，让我来帮您解答：

**知识要点：**
这个知识点在${request.subject}学科中具有重要地位，需要重点掌握。

**学习建议：**
1. 理解基本概念和原理
2. 通过练习加深理解
3. 联系实际应用场景
4. 总结规律和方法
5. 定期复习巩固

**注意事项：**
学习要循序渐进，打好基础，逐步提高。遇到困难不要气馁，多思考多练习。

有什么具体问题，随时可以问我！`
}

function generateRecommendations(averageScore: number, weaknesses: string[]): string[] {
  const recommendations = []

  if (averageScore < 60) {
    recommendations.push("加强基础知识学习")
    recommendations.push("增加练习时间")
    recommendations.push("寻求老师或同学帮助")
  } else if (averageScore < 80) {
    recommendations.push("巩固已学知识")
    recommendations.push("挑战更难的题目")
    recommendations.push("总结学习方法")
  } else {
    recommendations.push("保持学习状态")
    recommendations.push("拓展相关知识")
    recommendations.push("帮助其他同学")
  }

  if (weaknesses.length > 0) {
    recommendations.push(`重点关注：${weaknesses.join("、")}`)
  }

  return recommendations
}
