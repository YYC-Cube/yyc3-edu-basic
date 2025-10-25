"use client"

import React, { useState } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

// 导入UI组件
import { AssetPanel } from './AssetPanel'
import { CanvasArea } from './CanvasArea'
import { PropertyPanel } from './PropertyPanel'

// 导入教育模块
import { EducationModes } from '../education/EducationModes'

// 定义类型
export interface CanvasItem {
  id: string;
  name: string;
  type: 'button' | 'input' | 'text' | string;
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string;
  onClick?: string;
}

export interface EducationConfig {
  mode: string;
  userType: string;
  level: string;
  features: string[];
}

const themes = {
  light: {
    bg: "bg-gradient-to-br from-blue-100 via-white to-blue-300",
    panel: "bg-white",
    text: "text-blue-700"
  },
  dark: {
    bg: "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700",
    panel: "bg-gray-900",
    text: "text-blue-200"
  }
}

function generateCode(canvasData: CanvasItem[], format: string) {
  switch (format) {
    case 'react':
      return `import React from 'react';

export default function Generated() {
  return (
    <div className="relative w-full h-full">
${canvasData.map(item => {
        const style = `position: 'absolute', left: ${item.x}px, top: ${item.y}px, width: ${item.width}px, height: ${item.height}px, backgroundColor: '${item.color || '#3b82f6'}'`;
        const event = item.onClick ? `onClick={() => {${item.onClick}}}` : '';
        if (item.type === 'button') {
          return `      <button style={{${style}}} ${event}>${item.name}</button>`;
        } else if (item.type === 'input') {
          return `      <input style={{${style}}} placeholder="${item.name}" />`;
        } else {
          return `      <div style={{${style}}}>${item.name}</div>`;
        }
      }).join('\n')}
    </div>
  );
}`;
    
    case 'vue':
      return `<template>
  <div class="relative w-full h-full">
${canvasData.map(item => {
        const style = `position: absolute; left: ${item.x}px; top: ${item.y}px; width: ${item.width}px; height: ${item.height}px; background-color: ${item.color || '#3b82f6'};`;
        if (item.type === 'button') {
          return `    <button style="${style}" @click="${item.onClick || ''}">${item.name}</button>`;
        } else if (item.type === 'input') {
          return `    <input style="${style}" placeholder="${item.name}" />`;
        } else {
          return `    <div style="${style}">${item.name}</div>`;
        }
      }).join('\n')}
  </div>
</template>

<script setup>
// Vue 3 Composition API
</script>`;
    
    case 'json':
      return JSON.stringify({
        version: '1.0',
        components: canvasData.map(item => ({
          id: item.id,
          name: item.name,
          type: item.type,
          position: { x: item.x, y: item.y },
          size: { width: item.width, height: item.height },
          style: { color: item.color || '#3b82f6' },
          events: { onClick: item.onClick || null }
        }))
      }, null, 2);
    
    case 'dsl':
      return canvasData.map(item => 
        `Component(${item.type}) {
  name: "${item.name}"
  position: (${item.x}, ${item.y})
  size: (${item.width}, ${item.height})
  color: "${item.color || '#3b82f6'}"
  onClick: "${item.onClick || ''}"
}`
      ).join('\n\n');
    
    default:
      return 'Unsupported format';
  }
}

// 教育配置定义
const yiJiaoConfig = {
  '小学': {
    components: [{ name: "按钮", type: "button" }, { name: "输入框", type: "input" }, { name: "文本", type: "text" }],
    features: ['拖拽建构', '色彩学习', '基础逻辑', '创意表达']
  },
  '初中': {
    components: [{ name: "按钮", type: "button" }, { name: "输入框", type: "input" }, { name: "文本", type: "text" }],
    features: ['拖拽建构', '色彩学习', '基础逻辑', '创意表达']
  }
}

const gaoJiaoConfig = {
  '高中': {
    components: [{ name: "按钮", type: "button" }, { name: "输入框", type: "input" }, { name: "文本", type: "text" }],
    features: ['拖拽建构', '色彩学习', '基础逻辑', '创意表达']
  },
  '大学': {
    components: [{ name: "按钮", type: "button" }, { name: "输入框", type: "input" }, { name: "文本", type: "text" }],
    features: ['拖拽建构', '色彩学习', '基础逻辑', '创意表达']
  }
}

export const VisualEditor: React.FC = () => {
  const [canvasData, setCanvasData] = useState<CanvasItem[]>([])
  const [selectedAsset, setSelectedAsset] = useState<CanvasItem | null>(null)
  const [showCode, setShowCode] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [showTeam, setShowTeam] = useState(false)
  const [exportFormat, setExportFormat] = useState('react')
  const [educationConfig, setEducationConfig] = useState<EducationConfig>({
    mode: '義教',
    userType: '学生',
    level: '小学',
    features: ['拖拽建构', '色彩学习', '基础逻辑', '创意表达']
  })
  // 教育功能状态
  const [showEducationMode, setShowEducationMode] = useState(false)
  
  // 获取教育级别对应的组件
  const getEducationAssets = () => {
    if (!educationConfig) return [{ name: "按钮", type: "button" }, { name: "输入框", type: "input" }, { name: "文本", type: "text" }]
    
    const config = educationConfig.mode === '義教' 
      ? yiJiaoConfig[educationConfig.level as keyof typeof yiJiaoConfig]
      : gaoJiaoConfig[educationConfig.level as keyof typeof gaoJiaoConfig]
    
    return config?.components || []
  }
  
  const handleEducationModeSelect = (config: EducationConfig) => {
    setEducationConfig(config)
    setShowEducationMode(false)
  }
  
  const handleDownload = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
  
  const getFileExtension = (format: string) => {
    switch (format) {
      case 'react': return '.jsx'
      case 'vue': return '.vue'
      case 'json': return '.json'
      case 'dsl': return '.dsl'
      default: return '.txt'
    }
  }

  const handleSelect = (asset: CanvasItem) => {
    setSelectedAsset(asset);
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={"flex flex-col h-full w-full relative " + themes[theme].bg}>
        {/* 教育模式选择 */}
        {showEducationMode && (
          <EducationModes onModeSelect={handleEducationModeSelect} />
        )}
        
        {/* 教育信息栏 */}
        {educationConfig && (
          <div className="bg-white shadow-sm border-b p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="font-bold text-blue-700">
                🎯 {educationConfig.mode} - {educationConfig.level} - {educationConfig.userType}模式
              </span>
              <div className="flex gap-2">
                {educationConfig.features.map((feature, idx) => (
                  <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                    {feature}
                  </span>
                ))}
              </div>
            </div>
            <button 
              className="px-3 py-1 text-gray-500 hover:text-blue-600 text-sm"
              onClick={() => setShowEducationMode(true)}
            >
              切换模式
            </button>
          </div>
        )}
        
        {/* 主编辑区域 */}
        <div className="flex flex-1 overflow-hidden">
          <AssetPanel assets={getEducationAssets()} />
          <CanvasArea canvasData={canvasData} setCanvasData={setCanvasData} onSelect={handleSelect} />
          <PropertyPanel selectedAsset={selectedAsset} canvasData={canvasData} setCanvasData={setCanvasData} />
        </div>
        
        {/* 工具栏 */}
        <div className="absolute top-4 right-4 flex gap-2 z-50">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
            onClick={() => setShowCode(true)}
          >一键导出代码</button>
          <button
            className="px-4 py-2 bg-gray-800 text-white rounded shadow hover:bg-gray-700"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          >{theme === 'light' ? '暗黑模式' : '浅色模式'}</button>
          <button
            className="px-4 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700"
            onClick={() => setShowTeam(true)}
          >团队入口</button>
        </div>
        {showCode && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className={"rounded-xl shadow-2xl p-6 max-w-4xl w-full relative " + themes[theme].panel}>
              <button className="absolute top-2 right-2 text-gray-500 hover:text-red-500" onClick={() => setShowCode(false)}>×</button>
              <h3 className={"font-bold text-lg mb-4 " + themes[theme].text}>代码导出</h3>
              
              <div className="mb-4 flex gap-4 items-center">
                <label className="text-sm font-medium">导出格式：</label>
                <select 
                  value={exportFormat} 
                  onChange={(e) => setExportFormat(e.target.value)}
                  className="border rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="react">React (.jsx)</option>
                  <option value="vue">Vue (.vue)</option>
                  <option value="json">JSON Schema (.json)</option>
                  <option value="dsl">DSL (.dsl)</option>
                </select>
                
                <div className="flex gap-2 ml-auto">
                  <button 
                    className="px-3 py-1 bg-gray-600 text-white rounded shadow hover:bg-gray-700 text-sm"
                    onClick={() => {
                      const content = generateCode(canvasData, exportFormat)
                      navigator.clipboard.writeText(content)
                      alert('代码已复制到剪贴板！')
                    }}
                  >
                    📋 复制
                  </button>
                  <button 
                    className="px-3 py-1 bg-green-600 text-white rounded shadow hover:bg-green-700 text-sm"
                    onClick={() => {
                      const content = generateCode(canvasData, exportFormat)
                      const filename = 'generated' + getFileExtension(exportFormat)
                      handleDownload(content, filename)
                    }}
                  >
                    📥 下载
                  </button>
                </div>
              </div>
              
              <pre className="bg-gray-100 rounded p-4 text-xs overflow-auto max-h-[60vh] border">
                {generateCode(canvasData, exportFormat)}
              </pre>
            </div>
          </div>
        )}
        {showTeam && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className={"rounded-xl shadow-2xl p-6 max-w-xl w-full relative " + themes[theme].panel}>
              <button className="absolute top-2 right-2 text-gray-500 hover:text-red-500" onClick={() => setShowTeam(false)}>×</button>
              <h3 className={"font-bold text-lg mb-2 " + themes[theme].text}>团队协作入口</h3>
              <div className="text-gray-500 mb-2">（预留：多人协作、项目管理、成员列表等）</div>
              <div className="flex flex-col gap-2 mb-4">
                <input className="border rounded px-2 py-1" placeholder="团队名称" />
                <input className="border rounded px-2 py-1" placeholder="成员邮箱（逗号分隔）" />
                <button className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700">创建/加入团队</button>
              </div>
              <div className="border-t pt-4 mt-4">
                <h4 className={"font-bold mb-2 " + themes[theme].text}>项目管理</h4>
                <ul className="mb-2">
                  <li className="mb-1 text-blue-700 font-semibold">项目A（示例）</li>
                  <li className="mb-1 text-blue-700 font-semibold">项目B（示例）</li>
                </ul>
                <button className="px-3 py-1 bg-green-600 text-white rounded shadow hover:bg-green-700 text-sm">新建项目</button>
              </div>
              <div className="border-t pt-4 mt-4">
                <h4 className={"font-bold mb-2 " + themes[theme].text}>成员列表</h4>
                <ul>
                  <li className="mb-1 text-gray-700">张三（owner）</li>
                  <li className="mb-1 text-gray-700">李四</li>
                  <li className="mb-1 text-gray-700">王五</li>
                </ul>
              </div>
            </div>
          </div>
        )}
        
        
      </div>
    </DndProvider>
  )
}
