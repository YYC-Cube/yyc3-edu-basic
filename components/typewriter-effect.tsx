"use client"

import { useState, useEffect, useRef } from "react"

interface TypewriterEffectProps {
  text: string
  speed?: number
  onComplete?: () => void
  className?: string
  showCursor?: boolean
  cursorChar?: string
}

export function TypewriterEffect({
  text,
  speed = 50,
  onComplete,
  className = "",
  showCursor = true,
  cursorChar = "|",
}: TypewriterEffectProps) {
  const [displayText, setDisplayText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (currentIndex < text.length) {
      intervalRef.current = setTimeout(() => {
        setDisplayText((prev) => prev + text[currentIndex])
        setCurrentIndex((prev) => prev + 1)
      }, speed)
    } else if (!isComplete) {
      setIsComplete(true)
      onComplete?.()
    }

    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current)
      }
    }
  }, [currentIndex, text, speed, onComplete, isComplete])

  // 重置效果当文本改变时
  useEffect(() => {
    setDisplayText("")
    setCurrentIndex(0)
    setIsComplete(false)
  }, [text])

  return (
    <span className={className}>
      {displayText}
      {showCursor && (
        <span className={`inline-block ${isComplete ? "animate-pulse" : "animate-pulse"} text-cyan-400`}>
          {cursorChar}
        </span>
      )}
    </span>
  )
}

interface TypewriterLineProps {
  isActive: boolean
  className?: string
}

export function TypewriterLine({ isActive, className = "" }: TypewriterLineProps) {
  return (
    <div className={`relative ${className}`}>
      {/* 主线条 */}
      <div
        className={`h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300 ${
          isActive ? "w-full opacity-100" : "w-0 opacity-0"
        }`}
      />

      {/* 发光效果 */}
      <div
        className={`absolute top-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 blur-sm transition-all duration-300 ${
          isActive ? "w-full opacity-60" : "w-0 opacity-0"
        }`}
      />

      {/* 末端光点 */}
      {isActive && (
        <div className="absolute -right-1 -top-1 w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-lg shadow-cyan-400/50" />
      )}
    </div>
  )
}

interface AnimatedTextBlockProps {
  text: string
  speed?: number
  className?: string
  onComplete?: () => void
}

export function AnimatedTextBlock({ text, speed = 30, className = "", onComplete }: AnimatedTextBlockProps) {
  const [isLineActive, setIsLineActive] = useState(false)
  const [showText, setShowText] = useState(false)

  useEffect(() => {
    // 先显示线条动画
    const lineTimer = setTimeout(() => {
      setIsLineActive(true)
    }, 100)

    // 然后显示文字
    const textTimer = setTimeout(() => {
      setShowText(true)
    }, 500)

    return () => {
      clearTimeout(lineTimer)
      clearTimeout(textTimer)
    }
  }, [])

  const handleTextComplete = () => {
    onComplete?.()
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <TypewriterLine isActive={isLineActive} />
      <div className="min-h-[1.5rem]">
        {showText && (
          <TypewriterEffect
            text={text}
            speed={speed}
            onComplete={handleTextComplete}
            className="text-slate-200 whitespace-pre-line"
          />
        )}
      </div>
    </div>
  )
}
