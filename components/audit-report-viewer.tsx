"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Download, FileText, Share2 } from 'lucide-react'
import { useGlobalAudit, type AuditResult } from '@/hooks/use-global-audit'
import { AuditReportGenerator, type AuditReport } from '@/lib/audit-report-generator'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'

interface AuditReportViewerProps {
  results: AuditResult[]
  overallScore: number
}

export function AuditReportViewer({ results, overallScore }: AuditReportViewerProps) {
  const [report, setReport] = React.useState<AuditReport | null>(null)
  const [isGenerating, setIsGenerating] = React.useState(false)

  const generateReport = React.useCallback(async () => {
    setIsGenerating(true)
    try {
      const generator = new AuditReportGenerator()
      const generatedReport = generator.generateReport(results)
      setReport(generatedReport)
    } catch (error) {
      console.error('生成报告失败:', error)
    } finally {
      setIsGenerating(false)
    }
  }, [results])

  const downloadReport = React.useCallback((format: 'json' | 'md') => {
    if (!report) return

    const generator = new AuditReportGenerator()
    let content: string
    let filename: string
    let mimeType: string

    if (format === 'json') {
      content = generator.exportToJSON(report)
      filename = `audit-report-${Date.now()}.json`
      mimeType = 'application/json'
    } else {
      content = generator.exportToMarkdown(report)
      filename = `audit-report-${Date.now()}.md`
      mimeType = 'text/markdown'
    }

    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }, [report])

  const shareReport = React.useCallback(() => {
    if (!report) return

    const generator = new AuditReportGenerator()
    const markdown = generator.exportToMarkdown(report)
    
    if (navigator.share) {
      navigator.share({
        title: '全局智能审核报告',
        text: markdown,
      })
    } else {
      // 降级到复制到剪贴板
      navigator.clipboard.writeText(markdown).then(() => {
      })
    }
  }, [report])

  React.useEffect(() => {
    if (results.length > 0) {
      generateReport()
    }
  }, [results, generateReport])

  if (!report && !isGenerating) {
    return null
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center space-x-2">
          <FileText className="h-4 w-4" />
          <span>查看报告</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>审核报告</span>
            <div className="flex items-center space-x-2">
              {report && (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => downloadReport('json')}
                    className="flex items-center space-x-1"
                  >
                    <Download className="h-3 w-3" />
                    <span>JSON</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => downloadReport('md')}
                    className="flex items-center space-x-1"
                  >
                    <Download className="h-3 w-3" />
                    <span>Markdown</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={shareReport}
                    className="flex items-center space-x-1"
                  >
                    <Share2 className="h-3 w-3" />
                    <span>分享</span>
                  </Button>
                </>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        {isGenerating ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>正在生成报告...</p>
            </div>
          </div>
        ) : report ? (
          <Tabs defaultValue="summary" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="summary">概览</TabsTrigger>
              <TabsTrigger value="dimensions">维度分析</TabsTrigger>
              <TabsTrigger value="recommendations">建议</TabsTrigger>
              <TabsTrigger value="trends">趋势</TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="space-y-4">
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>报告概览</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">
                            {report.overallScore}
                          </div>
                          <div className="text-sm text-muted-foreground">总体评分</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-red-500">
                            {report.summary.criticalIssues}
                          </div>
                          <div className="text-sm text-muted-foreground">严重问题</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-yellow-500">
                            {report.summary.totalIssues}
                          </div>
                          <div className="text-sm text-muted-foreground">总问题数</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-500">
                            {report.summary.autoFixableIssues}
                          </div>
                          <div className="text-sm text-muted-foreground">可自动修复</div>
                        </div>
                      </div>
                      <Separator />
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <strong>报告生成时间:</strong> {report.timestamp.toLocaleString()}
                        </div>
                        <div>
                          <strong>预估修复时间:</strong> {report.summary.estimatedFixTime}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>状态分布</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span>状态</span>
                          <Badge variant={
                            report.status === 'excellent' ? 'default' :
                            report.status === 'good' ? 'secondary' :
                            report.status === 'needs_improvement' ? 'outline' : 'destructive'
                          }>
                            {report.status === 'excellent' && '优秀'}
                            {report.status === 'good' && '良好'}
                            {report.status === 'needs_improvement' && '需改进'}
                            {report.status === 'critical' && '严重'}
                          </Badge>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>严重 ({report.summary.criticalIssues})</span>
                            <span>高 ({report.summary.highIssues})</span>
                            <span>中 ({report.summary.mediumIssues})</span>
                            <span>低 ({report.summary.lowIssues})</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="dimensions" className="space-y-4">
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {Object.entries(report.dimensions).map(([dimension, data]) => (
                    <Card key={dimension}>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span>{dimension}</span>
                          <Badge variant="outline">{data.score}/100</Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="text-sm">
                            <strong>状态:</strong> {data.status}
                          </div>
                          <div className="text-sm">
                            <strong>问题数量:</strong> {data.issues.length}
                          </div>
                          <Separator />
                          <div>
                            <strong>改进建议:</strong>
                            <ul className="list-disc list-inside text-sm mt-1 space-y-1">
                              {data.improvements.map((improvement: string, index: number) => (
                                <li key={index}>{improvement}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="recommendations" className="space-y-4">
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {/* 立即处理 */}
                  {report.recommendations.immediate.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-red-600">需立即处理</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {report.recommendations.immediate.map((rec) => (
                            <div key={rec.id} className="border-l-4 border-red-500 pl-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="font-medium">{rec.title}</h4>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {rec.description}
                                  </p>
                                  <div className="flex items-center space-x-2 mt-2">
                                    <Badge variant="destructive" size="sm">
                                      {rec.priority}
                                    </Badge>
                                    <Badge variant="outline" size="sm">
                                      预估: {rec.estimatedTime}
                                    </Badge>
                                    {rec.autoApplicable && (
                                      <Badge variant="secondary" size="sm">
                                        可自动修复
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* 短期优化 */}
                  {report.recommendations.shortTerm.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-yellow-600">短期优化</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {report.recommendations.shortTerm.map((rec) => (
                            <div key={rec.id} className="border-l-4 border-yellow-500 pl-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="font-medium">{rec.title}</h4>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {rec.description}
                                  </p>
                                  <div className="flex items-center space-x-2 mt-2">
                                    <Badge variant="outline" size="sm">
                                      预估: {rec.estimatedTime}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* 长期规划 */}
                  {report.recommendations.longTerm.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-blue-600">长期规划</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {report.recommendations.longTerm.map((rec) => (
                            <div key={rec.id} className="border-l-4 border-blue-500 pl-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="font-medium">{rec.title}</h4>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {rec.description}
                                  </p>
                                  <div className="flex items-center space-x-2 mt-2">
                                    <Badge variant="outline" size="sm">
                                      预估: {rec.estimatedTime}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="trends" className="space-y-4">
              <ScrollArea className="h-[400px]">
                <Card>
                  <CardHeader>
                    <CardTitle>趋势分析</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">当前评分</div>
                        <div className="text-2xl font-bold">{report.overallScore}</div>
                      </div>
                      {report.trends.previousScore && (
                        <div>
                          <div className="text-sm text-muted-foreground">上次评分</div>
                          <div className="text-2xl font-bold">{report.trends.previousScore}</div>
                        </div>
                      )}
                    </div>
                    
                    {report.trends.previousScore && (
                      <div>
                        <div className="text-sm text-muted-foreground">变化</div>
                        <div className={`text-lg font-medium ${
                          report.trends.improvement > 0 ? 'text-green-500' :
                          report.trends.improvement < 0 ? 'text-red-500' : 'text-gray-500'
                        }`}>
                          {report.trends.improvement > 0 ? '+' : ''}
                          {report.trends.improvement} 分
                        </div>
                        <div className="text-sm">
                          趋势: {
                            report.trends.trend === 'improving' ? '📈 改善中' :
                            report.trends.trend === 'declining' ? '📉 下降中' : '➡️ 稳定'
                          }
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}