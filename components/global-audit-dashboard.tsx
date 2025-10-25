"use client"

import React, { useState } from 'react'
import { 
  Shield, 
  Zap, 
  Eye, 
  Code, 
  Package, 
  Gauge, 
  AlertTriangle, 
  RefreshCw,
  Play,
  Wrench,
  TrendingUp,
  FileText,
  Settings,
  Lightbulb
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
// import { Separator } from '@/components/ui/separator'
import { useGlobalAudit, AuditDimension, AuditSeverity, type AuditResult, type AuditIssue } from '@/hooks/use-global-audit'
import { AuditReportViewer } from '@/components/audit-report-viewer'

// 维度配置
const DIMENSION_CONFIG = {
  [AuditDimension.CODE_QUALITY]: {
    label: '代码质量',
    icon: Code,
    color: 'bg-blue-500',
    description: '代码规范、复杂度、可维护性分析'
  },
  [AuditDimension.PERFORMANCE]: {
    label: '性能',
    icon: Zap,
    color: 'bg-yellow-500',
    description: '加载速度、渲染性能、资源优化'
  },
  [AuditDimension.SECURITY]: {
    label: '安全性',
    icon: Shield,
    color: 'bg-red-500',
    description: '漏洞检测、敏感信息、权限控制'
  },
  [AuditDimension.ACCESSIBILITY]: {
    label: '可访问性',
    icon: Eye,
    color: 'bg-green-500',
    description: '无障碍支持、键盘导航、屏幕阅读器'
  },
  [AuditDimension.DEPENDENCY]: {
    label: '依赖管理',
    icon: Package,
    color: 'bg-purple-500',
    description: '依赖版本、安全更新、包大小'
  }
}

// 严重级别配置
const SEVERITY_CONFIG = {
  [AuditSeverity.CRITICAL]: { label: '严重', color: 'bg-red-500 text-white', icon: AlertTriangle },
  [AuditSeverity.HIGH]: { label: '高', color: 'bg-orange-500 text-white', icon: AlertTriangle },
  [AuditSeverity.MEDIUM]: { label: '中', color: 'bg-yellow-500 text-white', icon: AlertTriangle },
  [AuditSeverity.LOW]: { label: '低', color: 'bg-blue-500 text-white', icon: AlertTriangle },
  [AuditSeverity.INFO]: { label: '信息', color: 'bg-gray-500 text-white', icon: AlertTriangle }
}

interface AuditResultCardProps {
  result: AuditResult
  onViewDetails: (result: AuditResult) => void
}

function AuditResultCard({ result, onViewDetails }: AuditResultCardProps) {
  const config = DIMENSION_CONFIG[result.dimension]
  const Icon = config.icon
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-500'
      case 'good': return 'text-blue-500'
      case 'needs_improvement': return 'text-yellow-500'
      case 'critical': return 'text-red-500'
      default: return 'text-gray-500'
    }
  }

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onViewDetails(result)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`p-2 rounded-lg ${config.color} bg-opacity-10`}>
              <Icon className={`h-4 w-4 ${config.color.replace('bg-', 'text-')}`} />
            </div>
            <div>
              <CardTitle className="text-sm font-medium">{config.label}</CardTitle>
              <p className="text-xs text-muted-foreground">{config.description}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold">{result.score}</div>
            <div className="text-xs text-muted-foreground">/ {result.maxScore}</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          <Progress value={(result.score / result.maxScore) * 100} className="h-2" />
          <div className="flex items-center justify-between text-xs">
            <span className={getStatusColor(result.status)}>
              {result.status === 'excellent' && '优秀'}
              {result.status === 'good' && '良好'}
              {result.status === 'needs_improvement' && '需改进'}
              {result.status === 'critical' && '严重'}
            </span>
            <span className="text-muted-foreground">
              {result.issues.length} 个问题
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface IssueItemProps {
  issue: AuditIssue
  onFix?: (issue: AuditIssue) => void
}

function IssueItem({ issue, onFix }: IssueItemProps) {
  const severityConfig = SEVERITY_CONFIG[issue.severity]
  const SeverityIcon = severityConfig.icon

  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <Badge className={severityConfig.color}>
              <SeverityIcon className="h-3 w-3 mr-1" />
              {severityConfig.label}
            </Badge>
            {issue.autoFixAvailable && (
              <Badge variant="outline" className="text-green-600 border-green-200">
                <Wrench className="h-3 w-3 mr-1" />
                可自动修复
              </Badge>
            )}
          </div>
          <h4 className="font-medium mb-1">{issue.title}</h4>
          <p className="text-sm text-muted-foreground mb-2">{issue.description}</p>
          {issue.file && (
            <div className="text-xs text-muted-foreground mb-2">
              <FileText className="h-3 w-3 inline mr-1" />
              {issue.file}
              {issue.line && `:${issue.line}`}
            </div>
          )}
          <div className="text-xs space-y-1">
            <div><strong>影响:</strong> {issue.impact}</div>
            <div><strong>建议:</strong> {issue.suggestion}</div>
          </div>
        </div>
        {issue.autoFixAvailable && onFix && (
          <Button size="sm" onClick={() => onFix(issue)} className="ml-4">
            <Wrench className="h-3 w-3 mr-1" />
            修复
          </Button>
        )}
      </div>
    </div>
  )
}

export default function GlobalAuditDashboard() {
  const { auditState, startGlobalAudit, applyAutoFixes, getOptimizationSuggestions } = useGlobalAudit()
  const [, setSelectedResult] = useState<AuditResult | null>(null)
  const [activeTab, setActiveTab] = useState('overview')

  const optimizationSuggestions = getOptimizationSuggestions()

  const handleStartAudit = () => {
    startGlobalAudit()
    setActiveTab('overview')
  }

  const handleApplyAutoFixes = () => {
    applyAutoFixes()
  }

  const getOverallStatus = () => {
    if (auditState.overallScore >= 90) return { label: '优秀', color: 'text-green-500' }
    if (auditState.overallScore >= 75) return { label: '良好', color: 'text-blue-500' }
    if (auditState.overallScore >= 60) return { label: '一般', color: 'text-yellow-500' }
    return { label: '需改进', color: 'text-red-500' }
  }

  const overallStatus = getOverallStatus()

  return (
    <div className="space-y-6">
      {/* 头部控制区 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">全局智能审核</h1>
          <p className="text-muted-foreground">多维度分析项目现状，一键优化补全</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={handleStartAudit}
            disabled={auditState.isRunning}
            className="flex items-center space-x-2"
          >
            {auditState.isRunning ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Play className="h-4 w-4" />
            )}
            <span>{auditState.isRunning ? '审核中...' : '开始审核'}</span>
          </Button>
          {auditState.summary.autoFixableIssues > 0 && (
            <Button
              onClick={handleApplyAutoFixes}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <Wrench className="h-4 w-4" />
              <span>一键修复 ({auditState.summary.autoFixableIssues})</span>
            </Button>
          )}
          {auditState.results.length > 0 && (
            <AuditReportViewer 
              results={auditState.results} 
              overallScore={auditState.overallScore} 
            />
          )}
        </div>
      </div>

      {/* 进度显示 */}
      {auditState.isRunning && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">审核进度</span>
                <span className="text-sm text-muted-foreground">{Math.round(auditState.progress)}%</span>
              </div>
              <Progress value={auditState.progress} className="h-2" />
              {auditState.currentDimension && (
                <div className="flex items-center space-x-2 text-sm">
                  <Gauge className="h-4 w-4 animate-pulse" />
                  <span>正在分析: {DIMENSION_CONFIG[auditState.currentDimension].label}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 总览卡片 */}
      {auditState.results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-8 w-8 text-blue-500" />
                <div>
                  <div className="text-2xl font-bold">{auditState.overallScore}</div>
                  <div className={`text-sm ${overallStatus.color}`}>{overallStatus.label}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-8 w-8 text-red-500" />
                <div>
                  <div className="text-2xl font-bold">{auditState.summary.criticalIssues}</div>
                  <div className="text-sm text-muted-foreground">严重问题</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Wrench className="h-8 w-8 text-green-500" />
                <div>
                  <div className="text-2xl font-bold">{auditState.summary.autoFixableIssues}</div>
                  <div className="text-sm text-muted-foreground">可自动修复</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <FileText className="h-8 w-8 text-purple-500" />
                <div>
                  <div className="text-2xl font-bold">{auditState.summary.totalIssues}</div>
                  <div className="text-sm text-muted-foreground">总问题数</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 主要内容区 */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">概览</TabsTrigger>
          <TabsTrigger value="issues">问题详情</TabsTrigger>
          <TabsTrigger value="suggestions">优化建议</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {auditState.results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {auditState.results.map((result) => (
                <AuditResultCard
                  key={result.dimension}
                  result={result}
                  onViewDetails={setSelectedResult}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="space-y-4">
                  <Gauge className="h-12 w-12 mx-auto text-muted-foreground" />
                  <div>
                    <h3 className="font-medium">还未开始审核</h3>
                    <p className="text-sm text-muted-foreground">点击"开始审核"按钮开始多维度分析</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="issues" className="space-y-4">
          {auditState.results.length > 0 ? (
            <div className="space-y-4">
              {auditState.results.map((result) => (
                <Card key={result.dimension}>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      {React.createElement(DIMENSION_CONFIG[result.dimension].icon, { 
                        className: 'h-5 w-5' 
                      })}
                      <span>{DIMENSION_CONFIG[result.dimension].label}</span>
                      <Badge variant="outline">{result.issues.length} 个问题</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-64">
                      <div className="space-y-3">
                        {result.issues.map((issue) => (
                          <IssueItem key={issue.id} issue={issue} />
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="space-y-4">
                  <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground" />
                  <div>
                    <h3 className="font-medium">暂无问题数据</h3>
                    <p className="text-sm text-muted-foreground">运行审核后这里将显示发现的问题</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="suggestions" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {optimizationSuggestions.map((suggestion) => (
              <Card key={suggestion.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">{suggestion.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">{suggestion.description}</p>
                    </div>
                    <Lightbulb className="h-5 w-5 text-yellow-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Badge variant={suggestion.impact === 'high' ? 'default' : 'secondary'}>
                        影响: {suggestion.impact === 'high' ? '高' : suggestion.impact === 'medium' ? '中' : '低'}
                      </Badge>
                      <Badge variant="outline">
                        工作量: {suggestion.effort === 'low' ? '低' : suggestion.effort === 'medium' ? '中' : '高'}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      分类: {suggestion.category}
                    </div>
                    {suggestion.autoApplicable && (
                      <Button 
                        size="sm" 
                        className="w-full"
                        onClick={() => suggestion.action()}
                      >
                        <Settings className="h-3 w-3 mr-1" />
                        应用优化
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}