'use client'

import { useState } from 'react'
import { MessageSquare, LayoutDashboard, Bot, BrainCircuit, PencilRuler, BookOpen, Sparkles, X } from 'lucide-react'
import { useAppStore } from '@/src/store/app-store'
import { ModuleId } from '@/src/core/module-system'
import { cn } from '@/lib/utils'

const sidebarItems = [
  { id: ModuleId.AUDIT, icon: LayoutDashboard, label: '全局审核' },
  { id: ModuleId.EMOTION, icon: BrainCircuit, label: '情感平台' },
  { id: ModuleId.VISUAL_EDITOR, icon: PencilRuler, label: '可视化编辑' },
  { id: ModuleId.EDUCATION, icon: BookOpen, label: '教育中心' },
  { id: ModuleId.KNOWLEDGE, icon: Sparkles, label: '知识探索' },
]

export function AnimatedSidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const { setActiveModule, activeModule } = useAppStore()

  const handleToggle = () => {
    setIsOpen(!isOpen)
  }

  const handleItemClick = (moduleId: ModuleId) => {
    setActiveModule(moduleId)
    setIsOpen(false)
  }

  return (
    <>
      {/* 触发按钮 */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={handleToggle}
          className="w-16 h-16 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center transform transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          aria-label={isOpen ? '关闭侧边栏' : '打开侧边栏'}
        >
          {isOpen ? <X size={32} /> : <MessageSquare size={32} />}
        </button>
      </div>

      {/* 侧边栏容器 */}
      <div
        className={cn(
          'fixed top-0 left-0 h-full bg-background/80 backdrop-blur-sm z-40 transition-transform duration-500 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          'w-64 border-r'
        )}
      >
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center mb-8">
            <Bot size={32} className="mr-2 text-primary" />
            <h2 className="text-xl font-bold">功能模块</h2>
          </div>
          <nav className="flex flex-col space-y-2">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={cn(
                  'flex items-center p-3 rounded-lg text-lg transition-colors',
                  activeModule === item.id
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent hover:text-accent-foreground'
                )}
              >
                <item.icon className="mr-4" size={24} />
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </>
  )
}
