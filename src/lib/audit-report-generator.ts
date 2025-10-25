import type { AuditResult, AuditIssue } from '../hooks/use-global-audit'
import { AuditSeverity } from '../hooks/use-global-audit'
import { AUDIT_CONFIG } from '../config/audit-config'

export interface AuditReport {
  id: string
  timestamp: Date
  overallScore: number
  status: 'excellent' | 'good' | 'needs_improvement' | 'critical'
  summary: {
    totalIssues: number
    criticalIssues: number
    highIssues: number
    mediumIssues: number
    lowIssues: number
    autoFixableIssues: number
    estimatedFixTime: string
  }
  dimensions: {
    [key: string]: {
      score: number
      status: string
      issues: AuditIssue[]
      improvements: string[]
    }
  }
  recommendations: {
    immediate: RecommendationItem[]
    shortTerm: RecommendationItem[]
    longTerm: RecommendationItem[]
  }
  trends: {
    previousScore?: number
    improvement: number
    trend: 'improving' | 'declining' | 'stable'
  }
}

export interface RecommendationItem {
  id: string
  title: string
  description: string
  priority: 'critical' | 'high' | 'medium' | 'low'
  impact: 'high' | 'medium' | 'low'
  effort: 'low' | 'medium' | 'high'
  category: string
  autoApplicable: boolean
  estimatedTime: string
}

// 扩展 AuditIssue 接口以包含缺失的属性
interface ExtendedAuditIssue extends AuditIssue {
  autoFixAvailable?: boolean
  title?: string
  // suggestion属性已在基类中定义，不需要重新声明
  // rule属性已在基类中定义为必需，不需要重新声明
}

export class AuditReportGenerator {
  generateReport(results: AuditResult[], previousScore?: number): AuditReport {
    const reportId = `audit-${Date.now()}`
    const timestamp = new Date()
    
    // 计算总体评分
    const overallScore = this.calculateOverallScore(results)
    
    // 生成摘要
    const summary = this.generateSummary(results)
    
    // 处理各维度数据
    const dimensions = this.processDimensions(results)
    
    // 生成建议
    const recommendations = this.generateRecommendations(results)
    
    // 计算趋势
    const trends = this.calculateTrends(overallScore, previousScore)
    
    // 确定状态
    const status = this.determineStatus(overallScore)

    return {
      id: reportId,
      timestamp,
      overallScore,
      status,
      summary,
      dimensions,
      recommendations,
      trends
    }
  }

  private calculateOverallScore(results: AuditResult[]): number {
    if (results.length === 0) return 0

    const weights = AUDIT_CONFIG.dimensionWeights
    let weightedSum = 0
    let totalWeight = 0

    results.forEach(result => {
      const weight = weights[result.dimension as keyof typeof weights] || 0.2
      weightedSum += result.score * weight
      totalWeight += weight
    })

    return Math.round(weightedSum / totalWeight)
  }

  private generateSummary(results: AuditResult[]): AuditReport['summary'] {
    const allIssues = results.flatMap(r => r.issues) as ExtendedAuditIssue[]
    
    const criticalIssues = allIssues.filter(i => i.severity === AuditSeverity.CRITICAL).length
    const highIssues = allIssues.filter(i => i.severity === AuditSeverity.HIGH).length
    const mediumIssues = allIssues.filter(i => i.severity === AuditSeverity.MEDIUM).length
    const lowIssues = allIssues.filter(i => i.severity === AuditSeverity.LOW).length
    const autoFixableIssues = allIssues.filter(i => i.autoFixAvailable).length

    // 估算修复时间
    const estimatedMinutes = criticalIssues * 30 + highIssues * 20 + mediumIssues * 10 + lowIssues * 5
    const estimatedFixTime = this.formatEstimatedTime(estimatedMinutes)

    return {
      totalIssues: allIssues.length,
      criticalIssues,
      highIssues,
      mediumIssues,
      lowIssues,
      autoFixableIssues,
      estimatedFixTime
    }
  }

  private processDimensions(results: AuditResult[]): AuditReport['dimensions'] {
    const dimensions: AuditReport['dimensions'] = {}

    results.forEach(result => {
      const improvements = this.generateImprovements(result)
      
      dimensions[result.dimension] = {
        score: result.score,
        status: result.status,
        issues: result.issues,
        improvements
      }
    })

    return dimensions
  }

  private generateImprovements(result: AuditResult): string[] {
    const improvements: string[] = []
    const issues = result.issues as ExtendedAuditIssue[]

    // 基于问题类型生成改进建议
    const issueTypes = Array.from(new Set(issues.map(i => i.rule)))
    
    issueTypes.forEach(ruleType => {
      const ruleIssues = issues.filter(i => i.rule === ruleType)
      if (ruleIssues.length > 0) {
        improvements.push(`解决 ${ruleIssues.length} 个 ${ruleType} 问题`)
      }
    })

    // 基于评分建议改进方向
    if (result.score < 60) {
      improvements.push('需要全面重构和优化')
    } else if (result.score < 75) {
      improvements.push('重点关注高优先级问题')
    } else if (result.score < 90) {
      improvements.push('继续优化细节问题')
    }

    return improvements
  }

  private generateRecommendations(results: AuditResult[]): {
    immediate: RecommendationItem[]
    shortTerm: RecommendationItem[]
    longTerm: RecommendationItem[]
  } {
    const allIssues = results.flatMap(r => r.issues) as ExtendedAuditIssue[]
    
    const immediate: RecommendationItem[] = []
    const shortTerm: RecommendationItem[] = []
    const longTerm: RecommendationItem[] = []

    // 处理严重和高优先级问题
    allIssues
      .filter(i => i.severity === AuditSeverity.CRITICAL || i.severity === AuditSeverity.HIGH)
      .forEach((issue, index) => {
        immediate.push({
          id: `immediate-${index}`,
          title: issue.title || `修复 ${issue.severity} 级别问题`,
          description: issue.suggestion || '请检查并修复此问题',
          priority: issue.severity === AuditSeverity.CRITICAL ? 'critical' : 'high',
          impact: this.mapSeverityToImpact(issue.severity),
          effort: issue.autoFixAvailable ? 'low' : 'medium',
          category: this.mapDimensionToCategory(issue.dimension || 'unknown'),
          autoApplicable: issue.autoFixAvailable || false,
          estimatedTime: issue.autoFixAvailable ? '5分钟' : '30分钟'
        })
      })

    // 处理中等优先级问题
    allIssues
      .filter(i => i.severity === AuditSeverity.MEDIUM)
      .slice(0, 5) // 限制数量
      .forEach((issue, index) => {
        shortTerm.push({
          id: `short-term-${index}`,
          title: issue.title || `优化 ${issue.severity} 级别问题`,
          description: issue.suggestion || '建议优化此问题',
          priority: 'medium',
          impact: 'medium',
          effort: issue.autoFixAvailable ? 'low' : 'medium',
          category: this.mapDimensionToCategory(issue.dimension || 'unknown'),
          autoApplicable: issue.autoFixAvailable || false,
          estimatedTime: issue.autoFixAvailable ? '10分钟' : '1小时'
        })
      })

    // 生成长期优化建议
    const performanceResult = results.find(r => r.dimension === 'performance')
    if (performanceResult && performanceResult.score < 80) {
      longTerm.push({
        id: 'long-term-perf',
        title: '性能优化计划',
        description: '实施全面的性能优化策略，包括代码分割、缓存策略和资源优化',
        priority: 'medium',
        impact: 'high',
        effort: 'high',
        category: '性能优化',
        autoApplicable: false,
        estimatedTime: '1-2周'
      })
    }

    return { immediate, shortTerm, longTerm }
  }

  private calculateTrends(currentScore: number, previousScore?: number) {
    if (!previousScore) {
      return {
        improvement: 0,
        trend: 'stable' as const
      }
    }

    const improvement = currentScore - previousScore
    let trend: 'improving' | 'declining' | 'stable'

    if (improvement > 5) trend = 'improving'
    else if (improvement < -5) trend = 'declining'
    else trend = 'stable'

    return {
      previousScore,
      improvement,
      trend
    }
  }

  private determineStatus(score: number): 'excellent' | 'good' | 'needs_improvement' | 'critical' {
    if (score >= 90) return 'excellent'
    if (score >= 75) return 'good'
    if (score >= 60) return 'needs_improvement'
    return 'critical'
  }

  private formatEstimatedTime(minutes: number): string {
    if (minutes < 60) return `${minutes}分钟`
    const hours = Math.round(minutes / 60)
    if (hours < 8) return `${hours}小时`
    const days = Math.round(hours / 8)
    return `${days}天`
  }

  private mapSeverityToImpact(severity: AuditSeverity): 'high' | 'medium' | 'low' {
    switch (severity) {
      case AuditSeverity.CRITICAL:
      case AuditSeverity.HIGH:
        return 'high'
      case AuditSeverity.MEDIUM:
        return 'medium'
      default:
        return 'low'
    }
  }

  private mapDimensionToCategory(dimension: string): string {
    const categoryMap: { [key: string]: string } = {
      code_quality: '代码质量',
      performance: '性能优化',
      security: '安全性',
      accessibility: '可访问性',
      dependency: '依赖管理',
      unknown: '其他'
    }
    return categoryMap[dimension] || '其他'
  }

  // 导出报告为 JSON
  public exportToJSON(report: AuditReport): string {
    return JSON.stringify(report, null, 2)
  }

  // 导出报告为 Markdown
  public exportToMarkdown(report: AuditReport): string {
    const md = `# 全局智能审核报告

## 概览
- **总体评分**: ${report.overallScore}/100 (${report.status})
- **生成时间**: ${report.timestamp.toLocaleString()}
- **问题总数**: ${report.summary.totalIssues}
- **严重问题**: ${report.summary.criticalIssues}
- **可自动修复**: ${report.summary.autoFixableIssues}
- **预估修复时间**: ${report.summary.estimatedFixTime}

## 各维度详情

${Object.entries(report.dimensions).map(([dimension, data]) => `
### ${this.mapDimensionToCategory(dimension)}
- **评分**: ${data.score}/100
- **状态**: ${data.status}
- **问题数量**: ${data.issues.length}
- **改进建议**: 
${data.improvements.map(imp => `  - ${imp}`).join('\n')}
`).join('\n')}

## 修复建议

### 立即处理
${report.recommendations.immediate.map(rec => `
- **${rec.title}** (${rec.priority})
  - ${rec.description}
  - 预估时间: ${rec.estimatedTime}
  - 可自动修复: ${rec.autoApplicable ? '是' : '否'}
`).join('\n')}

### 短期优化
${report.recommendations.shortTerm.map(rec => `
- **${rec.title}**
  - ${rec.description}
  - 预估时间: ${rec.estimatedTime}
`).join('\n')}

### 长期规划
${report.recommendations.longTerm.map(rec => `
- **${rec.title}**
  - ${rec.description}
  - 预估时间: ${rec.estimatedTime}
`).join('\n')}

---
*报告生成时间: ${new Date().toLocaleString()}*
`
    return md
  }
}