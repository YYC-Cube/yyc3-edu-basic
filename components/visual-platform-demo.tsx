"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Play, 
  Download, 
  Save, 
  Code, 
  Palette, 
  Wand2, 
  Brain, 
  Users,
  CheckCircle,
  BookOpen
} from 'lucide-react'

export function YYCVisualPlatformDemo() {
  const [isReady, setIsReady] = useState(false)
  const [activeFeature, setActiveFeature] = useState('editor')

  useEffect(() => {
    // 模拟平台初始化
    const timer = setTimeout(() => setIsReady(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  const features = [
    {
      id: 'editor',
      name: '可视化编辑器',
      description: '拖拽式界面设计，无需编码',
      icon: <Palette className="h-5 w-5" />,
      status: '已完成',
      files: ['VisualEditor.tsx', 'AssetPanel.tsx', 'CanvasArea.tsx', 'PropertyPanel.tsx'],
      capabilities: ['拖拽组件', '属性编辑', '实时预览', '画布操作']
    },
    {
      id: 'engine',
      name: '编程引擎',
      description: '500+ 行核心引擎代码',
      icon: <Brain className="h-5 w-5" />,
      status: '已完成',
      files: ['engine.ts (500+ 行)', 'compiler.ts (600+ 行)'],
      capabilities: ['节点管理', '连接系统', '多框架代码生成', '性能优化']
    },
    {
      id: 'education',
      name: '教育集成',
      description: '完整的编程教学系统',
      icon: <BookOpen className="h-5 w-5" />,
      status: '已完成',
      files: ['EducationModes.tsx', 'StudentTeacherFeatures.tsx', '等 8 个文件'],
      capabilities: ['学生模式', '教师工具', '进度跟踪', '协作学习']
    },
    {
      id: 'ai',
      name: 'AI 增强',
      description: '智能编程助手和优化',
      icon: <Wand2 className="h-5 w-5" />,
      status: '已完成',
      files: ['use-education-ai.ts', 'model-api.ts'],
      capabilities: ['智能建议', '代码优化', '错误检测', '学习辅导']
    },
    {
      id: 'collaboration',
      name: '协作功能',
      description: '实时多人编辑支持',
      icon: <Users className="h-5 w-5" />,
      status: '已集成',
      files: ['RealTimeCollaboration.tsx'],
      capabilities: ['实时同步', '版本控制', '团队管理', '共享项目']
    }
  ]

  const codeGeneration = {
    react: `import React from 'react';
import { Button } from './components/ui/button';

export default function MyApp() {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">我的应用</h1>
      <Button onClick={() => alert('Hello!')}>
        点击我
      </Button>
    </div>
  );
}`,
    vue: `<template>
  <div class="p-4 space-y-4">
    <h1 class="text-2xl font-bold">我的应用</h1>
    <button @click="sayHello" class="btn-primary">
      点击我
    </button>
  </div>
</template>

<script setup>
const sayHello = () => {
  alert('Hello!');
};
</script>`,
    vanilla: `<!DOCTYPE html>
<html>
<head>
  <title>我的应用</title>
</head>
<body>
  <div id="app">
    <h1>我的应用</h1>
    <button onclick="sayHello()">点击我</button>
  </div>
  
  <script>
    function sayHello() {
      alert('Hello!');
    }
  </script>
</body>
</html>`
  }

  if (!isReady) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-slate-600">正在初始化 YYC³ 可视化编程平台...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* 头部导航 */}
      <header className="bg-white shadow-sm border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Palette className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                YYC³ 可视化编程平台
              </h1>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <CheckCircle className="h-3 w-3 mr-1" />
              完整版本
            </Badge>
          </div>
          
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Save className="h-4 w-4 mr-2" />
              保存项目
            </Button>
            <Button variant="outline" size="sm">
              <Code className="h-4 w-4 mr-2" />
              生成代码
            </Button>
            <Button size="sm">
              <Play className="h-4 w-4 mr-2" />
              开始创建
            </Button>
          </div>
        </div>
      </header>

      {/* 主内容区域 */}
      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        {/* 平台状态概览 */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {features.map((feature) => (
            <Card 
              key={feature.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                activeFeature === feature.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setActiveFeature(feature.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {feature.icon}
                    <CardTitle className="text-sm">{feature.name}</CardTitle>
                  </div>
                  <Badge 
                    variant="default" 
                    className="text-xs bg-green-100 text-green-800 hover:bg-green-100"
                  >
                    {feature.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-slate-600 mb-2">{feature.description}</p>
                <div className="space-y-1">
                  {feature.capabilities.slice(0, 2).map((cap) => (
                    <div key={cap} className="text-xs text-slate-500">• {cap}</div>
                  ))}
                  {feature.capabilities.length > 2 && (
                    <div className="text-xs text-blue-600">+{feature.capabilities.length - 2} 更多...</div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 详细信息面板 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 功能详情 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                {features.find(f => f.id === activeFeature)?.icon}
                <span>{features.find(f => f.id === activeFeature)?.name} - 详细信息</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">核心文件</h4>
                  <div className="space-y-1">
                    {features.find(f => f.id === activeFeature)?.files.map((file) => (
                      <Badge key={file} variant="outline" className="mr-2 mb-2 text-xs">
                        {file}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">功能特性</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {features.find(f => f.id === activeFeature)?.capabilities.map((cap) => (
                      <div key={cap} className="flex items-center space-x-2 text-sm text-slate-600">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span>{cap}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 代码生成演示 */}
          <Card>
            <CardHeader>
              <CardTitle>代码生成示例</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="react" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="react">React</TabsTrigger>
                  <TabsTrigger value="vue">Vue.js</TabsTrigger>
                  <TabsTrigger value="vanilla">Vanilla JS</TabsTrigger>
                </TabsList>
                
                {Object.entries(codeGeneration).map(([framework, code]) => (
                  <TabsContent key={framework} value={framework}>
                    <pre className="bg-slate-900 text-slate-100 p-4 rounded-md text-xs overflow-x-auto">
                      <code>{code}</code>
                    </pre>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* 快速操作 */}
        <Card>
          <CardHeader>
            <CardTitle>快速开始</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Button 
                variant="outline" 
                className="h-16 flex-col space-y-1"
                onClick={() => alert('功能完整！可以开始创建新项目')}
              >
                <Palette className="h-5 w-5" />
                <span className="text-xs">创建新项目</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-16 flex-col space-y-1"
                onClick={() => alert('教育模式已集成！支持学生和教师功能')}
              >
                <BookOpen className="h-5 w-5" />
                <span className="text-xs">教育模式</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-16 flex-col space-y-1"
                onClick={() => alert('AI 助手已就绪！可提供智能建议')}
              >
                <Brain className="h-5 w-5" />
                <span className="text-xs">AI 助手</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-16 flex-col space-y-1"
                onClick={() => alert('协作功能已完成！支持实时多人编辑')}
              >
                <Users className="h-5 w-5" />
                <span className="text-xs">团队协作</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 平台信息 */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-6">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold text-slate-800">
                🎉 您的可视化编程平台已经完全ready！
              </h3>
              <p className="text-slate-600 max-w-2xl mx-auto">
                包含完整的拖拽式编程界面、多框架代码生成、教育功能集成、AI 智能助手、实时协作等功能。
                所有核心组件都已实现并可以直接使用。
              </p>
              <div className="flex justify-center space-x-4 pt-4">
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  ✅ 核心引擎: 500+ 行代码
                </Badge>
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  ✅ 编译器: 600+ 行代码  
                </Badge>
                <Badge variant="outline" className="bg-purple-50 text-purple-700">
                  ✅ 教育系统: 完整集成
                </Badge>
                <Badge variant="outline" className="bg-orange-50 text-orange-700">
                  ✅ AI 功能: 智能增强
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default YYCVisualPlatformDemo