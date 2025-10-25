"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Download, FileText, Share2 } from 'lucide-react'
import type { AuditResult } from '@/hooks/use-global-audit'
import { AuditReportGenerator, type AuditReport } from '@/lib/audit-report-generator'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'

interface AuditReportViewerProps {
  results: AuditResult[]
}

export function AuditReportViewer({ results }: AuditReportViewerProps) {
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

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">代码质量</span>
                          <Badge variant="outline">{report.dimensions.codeQuality.score}/{report.dimensions.codeQuality.maxScore}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">性能</span>
                          <Badge variant="outline">{report.dimensions.performance.score}/{report.dimensions.performance.maxScore}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">安全性</span>
                          <Badge variant="outline">{report.dimensions.security.score}/{report.dimensions.security.maxScore}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">可访问性</span>
                          <Badge variant="outline">{report.dimensions.accessibility.score}/{report.dimensions.accessibility.maxScore}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">依赖管理</span>
                          <Badge variant="outline">{report.dimensions.dependency.score}/{report.dimensions.dependency.maxScore}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Separator />

                  <Card>
                    <CardHeader>
                      <CardTitle>建议与下一步</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div>• 优先修复严重问题以提升总体评分</div>
                        <div>• 应用自动修复建议，快速改善代码质量</div>
                        <div>• 逐步优化性能和可访问性</div>
                        <div>• 定期运行全局审核，保持项目健康</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="dimensions" className="space-y-4">
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>维度详情</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {Object.entries(report.dimensions).map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">{value.label}</span>
                            <Badge variant="outline">{value.score}/{value.maxScore}</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="recommendations" className="space-y-4">
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>优化建议</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        {report.recommendations.map((rec, idx) => (
                          <div key={idx}>• {rec}</div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="trends" className="space-y-4">
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>趋势与历史</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-muted-foreground">
                        <div className="text-2xl font-bold">{report.overallScore}</div>
                        <div>总体评分趋势显示项目质量的变化情况。</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}