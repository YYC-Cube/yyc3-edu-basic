"use client"

import { useEffect, useRef } from "react"

interface GeometricAnimationProps {
  className?: string
  color?: string
  speed?: number
}

export function GeometricAnimation({ className = "", color = "#06b6d4", speed = 1 }: GeometricAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const lines: GeometricLine[] = []
    const lineCount = 15

    class GeometricLine {
      x1: number
      y1: number
      x2: number
      y2: number
      targetX1: number
      targetY1: number
      targetX2: number
      targetY2: number
      opacity: number
      targetOpacity: number
      speed: number

      constructor() {
        this.x1 = Math.random() * canvas.width
        this.y1 = Math.random() * canvas.height
        this.x2 = Math.random() * canvas.width
        this.y2 = Math.random() * canvas.height
        this.targetX1 = this.x1
        this.targetY1 = this.y1
        this.targetX2 = this.x2
        this.targetY2 = this.y2
        this.opacity = 0
        this.targetOpacity = Math.random() * 0.3 + 0.1
        this.speed = 0.02 * speed
        this.generateNewTarget()
      }

      generateNewTarget() {
        this.targetX1 = Math.random() * canvas.width
        this.targetY1 = Math.random() * canvas.height
        this.targetX2 = Math.random() * canvas.width
        this.targetY2 = Math.random() * canvas.height
        this.targetOpacity = Math.random() * 0.4 + 0.1
      }

      update() {
        // 平滑移动到目标位置
        this.x1 += (this.targetX1 - this.x1) * this.speed
        this.y1 += (this.targetY1 - this.y1) * this.speed
        this.x2 += (this.targetX2 - this.x2) * this.speed
        this.y2 += (this.targetY2 - this.y2) * this.speed
        this.opacity += (this.targetOpacity - this.opacity) * this.speed

        // 如果接近目标位置，生成新目标
        const distance = Math.sqrt(
          Math.pow(this.targetX1 - this.x1, 2) +
            Math.pow(this.targetY1 - this.y1, 2) +
            Math.pow(this.targetX2 - this.x2, 2) +
            Math.pow(this.targetY2 - this.y2, 2),
        )

        if (distance < 50) {
          this.generateNewTarget()
        }
      }

      draw() {
        if (!ctx) return

        ctx.strokeStyle = `${color}${Math.floor(this.opacity * 255)
          .toString(16)
          .padStart(2, "0")}`
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(this.x1, this.y1)
        ctx.lineTo(this.x2, this.y2)
        ctx.stroke()

        // 绘制端点
        ctx.fillStyle = `${color}${Math.floor(this.opacity * 255)
          .toString(16)
          .padStart(2, "0")}`
        ctx.beginPath()
        ctx.arc(this.x1, this.y1, 2, 0, Math.PI * 2)
        ctx.fill()
        ctx.beginPath()
        ctx.arc(this.x2, this.y2, 2, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // 初始化几何线条
    for (let i = 0; i < lineCount; i++) {
      lines.push(new GeometricLine())
    }

    function animate() {
      if (!ctx || !canvas) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const line of lines) {
        line.update()
        line.draw()
      }

      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      if (!canvas) return
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [color, speed])

  return <canvas ref={canvasRef} className={`absolute inset-0 pointer-events-none ${className}`} />
}
