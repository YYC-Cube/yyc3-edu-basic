"use client"

import { useState, useCallback } from 'react';
import { useToast } from './use-toast';

// 审核维度枚举
export enum AuditDimension {
  CODE_QUALITY = 'code_quality',
  PERFORMANCE = 'performance',
  SECURITY = 'security',
  ACCESSIBILITY = 'accessibility',
  DEPENDENCIES = 'dependencies'
}

// 审核严重程度
export enum AuditSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

// 审核问题接口
export interface AuditIssue {
  id: string;
  dimension: AuditDimension;
  rule: string;
  message: string;
  severity: AuditSeverity;
  file?: string;
  line?: number;
  column?: number;
  fixable?: boolean;
  suggestion?: string;
}

// 审核结果接口
export interface AuditResult {
  dimension: AuditDimension;
  score: number;
  maxScore: number;
  status: 'good' | 'needs_improvement' | 'critical';
  issues: AuditIssue[];
  passedChecks: number;
  totalChecks: number;
  executionTime?: number;
  recommendations?: string[];
}

// 全局审核状态接口
export interface GlobalAuditState {
  isRunning: boolean;
  currentDimension: AuditDimension | null;
  progress: number;
  results: AuditResult[];
  completedDimensions: AuditDimension[];
  totalIssues: number;
  criticalIssues: number;
  startTime: Date | null;
  endTime: Date | null;
  error: string | null;
}

// 审核统计信息
export interface AuditStats {
  totalScore: number;
  maxScore: number;
  overallStatus: 'good' | 'needs_improvement' | 'critical';
  totalIssues: number;
  criticalIssues: number;
  highIssues: number;
  mediumIssues: number;
  lowIssues: number;
  fixableIssues: number;
  executionTime: number;
}

// 全局审核Hook
export const useGlobalAudit = () => {
  const { toast } = useToast();
  const [auditState, setAuditState] = useState<GlobalAuditState>({
    isRunning: false,
    currentDimension: null,
    progress: 0,
    results: [],
    completedDimensions: [],
    totalIssues: 0,
    criticalIssues: 0,
    startTime: null,
    endTime: null,
    error: null
  });

  // 模拟审核结果生成
  const generateMockResult = (dimension: AuditDimension): AuditResult => {
    const mockData = {
      [AuditDimension.CODE_QUALITY]: {
        score: 75,
        maxScore: 100,
        passedChecks: 18,
        totalChecks: 25,
        status: 'good' as const,
        issues: [
          {
            id: 'cq-001',
            dimension: AuditDimension.CODE_QUALITY,
            rule: 'typescript/no-any',
            message: '避免使用 any 类型，建议使用具体类型',
            severity: AuditSeverity.MEDIUM,
            file: 'components/model-selector.tsx',
            line: 45,
            column: 12,
            fixable: true,
            suggestion: '使用 string | number 替代 any'
          }
        ]
      },
      [AuditDimension.PERFORMANCE]: {
        score: 68,
        maxScore: 100,
        passedChecks: 12,
        totalChecks: 20,
        status: 'needs_improvement' as const,
        issues: [
          {
            id: 'perf-001',
            dimension: AuditDimension.PERFORMANCE,
            rule: 'react/memo-optimization',
            message: '组件可以使用 React.memo 进行优化',
            severity: AuditSeverity.MEDIUM,
            file: 'components/global-audit-dashboard.tsx',
            line: 12,
            column: 1,
            fixable: true,
            suggestion: '使用 React.memo 包装组件以避免不必要的重渲染'
          }
        ]
      },
      [AuditDimension.SECURITY]: {
        score: 85,
        maxScore: 100,
        passedChecks: 15,
        totalChecks: 18,
        status: 'good' as const,
        issues: [
          {
            id: 'sec-001',
            dimension: AuditDimension.SECURITY,
            rule: 'security/no-eval',
            message: '避免使用 eval() 函数',
            severity: AuditSeverity.CRITICAL,
            file: 'lib/model-api.ts',
            line: 156,
            column: 23,
            fixable: true,
            suggestion: '使用 JSON.parse() 或其他安全的解析方法'
          }
        ]
      },
      [AuditDimension.ACCESSIBILITY]: {
        score: 88,
        maxScore: 100,
        passedChecks: 14,
        totalChecks: 16,
        status: 'good' as const,
        issues: [
          {
            id: 'a11y-001',
            dimension: AuditDimension.ACCESSIBILITY,
            rule: 'jsx-a11y/alt-text',
            message: '图片缺少 alt 属性',
            severity: AuditSeverity.MEDIUM,
            file: 'components/ui/avatar.tsx',
            line: 24,
            column: 6,
            fixable: true,
            suggestion: '为图片添加描述性的 alt 文本'
          }
        ]
      },
      [AuditDimension.DEPENDENCIES]: {
        score: 92,
        maxScore: 100,
        passedChecks: 9,
        totalChecks: 12,
        status: 'good' as const,
        issues: [
          {
            id: 'dep-001',
            dimension: AuditDimension.DEPENDENCIES,
            rule: 'outdated-dependencies',
            message: '发现过期的依赖包',
            severity: AuditSeverity.MEDIUM,
            file: 'package.json',
            line: 15,
            column: 1,
            fixable: true,
            suggestion: '更新 react 到最新版本 19.1.1'
          }
        ]
      }
    };

    return {
      dimension,
      ...mockData[dimension]
    };
  };

  // 启动全局审核
  const runGlobalAudit = useCallback(async () => {
    setAuditState(prev => ({
      ...prev,
      isRunning: true,
      progress: 0,
      results: [],
      completedDimensions: [],
      totalIssues: 0,
      criticalIssues: 0,
      startTime: new Date(),
      endTime: null,
      error: null,
      currentDimension: null
    }));

    const dimensions = [
      AuditDimension.CODE_QUALITY,
      AuditDimension.PERFORMANCE,
      AuditDimension.SECURITY,
      AuditDimension.ACCESSIBILITY,
      AuditDimension.DEPENDENCIES
    ];

    try {
      const results: AuditResult[] = [];
      let totalIssues = 0;
      let criticalIssues = 0;

      for (let i = 0; i < dimensions.length; i++) {
        const dimension = dimensions[i];
        
        setAuditState(prev => ({
          ...prev,
          currentDimension: dimension,
          progress: (i / dimensions.length) * 100
        }));

        // 模拟审核时间
        await new Promise(resolve => setTimeout(resolve, 1500));

        const result = generateMockResult(dimension);
        results.push(result);
        
        totalIssues += result.issues.length;
        criticalIssues += result.issues.filter(issue => 
          issue.severity === AuditSeverity.CRITICAL
        ).length;

        setAuditState(prev => ({
          ...prev,
          results: [...results],
          completedDimensions: [...prev.completedDimensions, dimension],
          totalIssues,
          criticalIssues,
          progress: ((i + 1) / dimensions.length) * 100
        }));
      }

      setAuditState(prev => ({
        ...prev,
        isRunning: false,
        currentDimension: null,
        endTime: new Date(),
        progress: 100
      }));

      toast({
        title: "全局审核完成",
        description: `发现 ${totalIssues} 个问题，其中 ${criticalIssues} 个严重问题`,
        duration: 5000,
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      
      setAuditState(prev => ({
        ...prev,
        isRunning: false,
        currentDimension: null,
        error: errorMessage,
        endTime: new Date()
      }));

      toast({
        title: "审核失败",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      });
    }
  }, [toast]);

  // 停止审核
  const stopAudit = useCallback(() => {
    setAuditState(prev => ({
      ...prev,
      isRunning: false,
      currentDimension: null,
      endTime: new Date()
    }));
    
    toast({
      title: "审核已停止",
      description: "用户手动停止了审核过程",
      duration: 3000,
    });
  }, [toast]);

  // 重置审核状态
  const resetAudit = useCallback(() => {
    setAuditState({
      isRunning: false,
      currentDimension: null,
      progress: 0,
      results: [],
      completedDimensions: [],
      totalIssues: 0,
      criticalIssues: 0,
      startTime: null,
      endTime: null,
      error: null
    });
  }, []);

  // 计算审核统计信息
  const getAuditStats = useCallback((): AuditStats | null => {
    if (auditState.results.length === 0) return null;

    const totalScore = auditState.results.reduce((sum, result) => sum + result.score, 0);
    const maxScore = auditState.results.reduce((sum, result) => sum + result.maxScore, 0);
    const allIssues = auditState.results.flatMap(result => result.issues);
    
    const criticalIssues = allIssues.filter(issue => issue.severity === AuditSeverity.CRITICAL).length;
    const highIssues = allIssues.filter(issue => issue.severity === AuditSeverity.HIGH).length;
    const mediumIssues = allIssues.filter(issue => issue.severity === AuditSeverity.MEDIUM).length;
    const lowIssues = allIssues.filter(issue => issue.severity === AuditSeverity.LOW).length;
    const fixableIssues = allIssues.filter(issue => issue.fixable).length;

    const overallPercentage = (totalScore / maxScore) * 100;
    let overallStatus: 'good' | 'needs_improvement' | 'critical';
    
    if (criticalIssues > 0 || overallPercentage < 60) {
      overallStatus = 'critical';
    } else if (overallPercentage < 80) {
      overallStatus = 'needs_improvement';
    } else {
      overallStatus = 'good';
    }

    const executionTime = auditState.startTime && auditState.endTime
      ? auditState.endTime.getTime() - auditState.startTime.getTime()
      : 0;

    return {
      totalScore,
      maxScore,
      overallStatus,
      totalIssues: allIssues.length,
      criticalIssues,
      highIssues,
      mediumIssues,
      lowIssues,
      fixableIssues,
      executionTime
    };
  }, [auditState]);

  // 获取指定维度的结果
  const getResultByDimension = useCallback((dimension: AuditDimension): AuditResult | null => {
    return auditState.results.find(result => result.dimension === dimension) || null;
  }, [auditState.results]);

  // 一键修复问题
  const autoFixIssues = useCallback(async (issueIds?: string[]) => {
    const issuesToFix = issueIds 
      ? auditState.results.flatMap(r => r.issues).filter(issue => issueIds.includes(issue.id))
      : auditState.results.flatMap(r => r.issues).filter(issue => issue.fixable);

    if (issuesToFix.length === 0) {
      toast({
        title: "没有可修复的问题",
        description: "当前没有发现可以自动修复的问题",
        duration: 3000,
      });
      return;
    }

    toast({
      title: "正在自动修复问题",
      description: `正在修复 ${issuesToFix.length} 个问题...`,
      duration: 3000,
    });

    // 模拟修复过程
    await new Promise(resolve => setTimeout(resolve, 2000));

    toast({
      title: "修复完成",
      description: `成功修复了 ${issuesToFix.length} 个问题`,
      duration: 5000,
    });

    // 建议重新运行审核
    setTimeout(() => {
      toast({
        title: "建议重新审核",
        description: "修复完成后建议重新运行审核以验证结果",
        duration: 5000,
      });
    }, 1000);
  }, [auditState.results, toast]);

  return {
    // 状态
    auditState,
    
    // 操作
    runGlobalAudit,
    stopAudit,
    resetAudit,
    autoFixIssues,
    
    // 工具函数
    getAuditStats,
    getResultByDimension,
    
    // 计算属性
    isRunning: auditState.isRunning,
    progress: auditState.progress,
    results: auditState.results,
    totalIssues: auditState.totalIssues,
    criticalIssues: auditState.criticalIssues,
    hasResults: auditState.results.length > 0,
    isCompleted: auditState.completedDimensions.length === 5 && !auditState.isRunning
  };
};

export default useGlobalAudit;