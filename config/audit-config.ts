// 全局智能审核配置文件
export const AUDIT_CONFIG = {
  // 审核维度权重
  dimensionWeights: {
    code_quality: 0.25,     // 代码质量权重 25%
    performance: 0.20,      // 性能权重 20%
    security: 0.25,         // 安全性权重 25%
    accessibility: 0.15,    // 可访问性权重 15%
    dependency: 0.15        // 依赖管理权重 15%
  },

  // 审核规则配置
  rules: {
    code_quality: {
      'typescript/no-any': {
        severity: 'high',
        autoFixable: true,
        description: '避免使用 any 类型，使用具体类型定义'
      },
      'complexity/max-complexity': {
        severity: 'medium',
        threshold: 10,
        autoFixable: false,
        description: '函数复杂度不应超过 10'
      },
      'react/memo-optimization': {
        severity: 'medium',
        autoFixable: true,
        description: '为纯函数组件添加 React.memo 优化'
      }
    },
    performance: {
      'bundle/size-limit': {
        severity: 'high',
        threshold: '500KB',
        autoFixable: true,
        description: '主 bundle 大小不应超过 500KB'
      },
      'image/optimization': {
        severity: 'medium',
        autoFixable: true,
        description: '使用优化的图片格式和 Next.js Image 组件'
      },
      'lazy-loading': {
        severity: 'medium',
        autoFixable: true,
        description: '为大型组件启用懒加载'
      }
    },
    security: {
      'security/no-hardcoded-secrets': {
        severity: 'critical',
        autoFixable: true,
        description: '不要在代码中硬编码敏感信息'
      },
      'security/no-eval': {
        severity: 'high',
        autoFixable: false,
        description: '禁止使用 eval() 函数'
      },
      'security/cors-validation': {
        severity: 'medium',
        autoFixable: true,
        description: '验证 CORS 配置'
      }
    },
    accessibility: {
      'a11y/keyboard-navigation': {
        severity: 'high',
        autoFixable: true,
        description: '确保所有交互元素支持键盘导航'
      },
      'a11y/alt-text': {
        severity: 'high',
        autoFixable: false,
        description: '为图片添加有意义的 alt 文本'
      },
      'a11y/color-contrast': {
        severity: 'medium',
        autoFixable: false,
        description: '确保足够的颜色对比度'
      }
    },
    dependency: {
      'deps/outdated': {
        severity: 'medium',
        autoFixable: true,
        description: '更新过时的依赖包'
      },
      'deps/security-vulnerabilities': {
        severity: 'critical',
        autoFixable: true,
        description: '修复依赖包中的安全漏洞'
      },
      'deps/unused': {
        severity: 'low',
        autoFixable: true,
        description: '移除未使用的依赖包'
      }
    }
  },

  // 自动修复配置
  autoFix: {
    'typescript/no-any': {
      enabled: true,
      action: 'generateTypeDefinitions',
      description: '自动生成类型定义'
    },
    'react/memo-optimization': {
      enabled: true,
      action: 'addReactMemo',
      description: '自动添加 React.memo 包装'
    },
    'bundle/size-limit': {
      enabled: true,
      action: 'enableCodeSplitting',
      description: '启用代码分割'
    },
    'security/no-hardcoded-secrets': {
      enabled: true,
      action: 'moveToEnvVariables',
      description: '迁移到环境变量'
    },
    'a11y/keyboard-navigation': {
      enabled: true,
      action: 'addKeyboardHandlers',
      description: '添加键盘事件处理'
    },
    'deps/outdated': {
      enabled: true,
      action: 'updateDependencies',
      description: '更新依赖包版本'
    }
  },

  // 性能阈值
  thresholds: {
    code_quality: {
      excellent: 90,
      good: 75,
      needs_improvement: 60
    },
    performance: {
      excellent: 95,
      good: 80,
      needs_improvement: 65
    },
    security: {
      excellent: 95,
      good: 85,
      needs_improvement: 70
    },
    accessibility: {
      excellent: 90,
      good: 75,
      needs_improvement: 60
    },
    dependency: {
      excellent: 85,
      good: 70,
      needs_improvement: 55
    }
  },

  // 优化建议模板
  suggestions: {
    performance: [
      {
        title: '启用代码分割',
        description: '通过 React.lazy 和动态导入减少初始 bundle 大小',
        impact: 'high',
        effort: 'medium',
        implementation: 'auto'
      },
      {
        title: '图片优化',
        description: '使用 Next.js Image 组件和 WebP 格式',
        impact: 'medium',
        effort: 'low',
        implementation: 'auto'
      },
      {
        title: 'PWA 配置',
        description: '添加 Service Worker 和离线支持',
        impact: 'high',
        effort: 'medium',
        implementation: 'auto'
      }
    ],
    security: [
      {
        title: '环境变量配置',
        description: '将敏感信息移至环境变量',
        impact: 'critical',
        effort: 'low',
        implementation: 'auto'
      },
      {
        title: 'CSP 策略',
        description: '配置内容安全策略',
        impact: 'high',
        effort: 'medium',
        implementation: 'manual'
      }
    ],
    accessibility: [
      {
        title: '键盘导航',
        description: '为所有交互元素添加键盘支持',
        impact: 'high',
        effort: 'medium',
        implementation: 'auto'
      },
      {
        title: 'ARIA 标签',
        description: '添加语义化的 ARIA 标签',
        impact: 'medium',
        effort: 'low',
        implementation: 'manual'
      }
    ]
  }
}

// 审核报告模板
export const AUDIT_REPORT_TEMPLATE = {
  header: {
    title: '全局智能审核报告',
    subtitle: '多维度项目分析与优化建议',
    timestamp: '{{timestamp}}',
    version: '1.0.0'
  },
  summary: {
    overallScore: '{{overallScore}}',
    status: '{{status}}',
    totalIssues: '{{totalIssues}}',
    criticalIssues: '{{criticalIssues}}',
    autoFixableIssues: '{{autoFixableIssues}}',
    estimatedFixTime: '{{estimatedFixTime}}'
  },
  recommendations: {
    immediate: [], // 需要立即处理的问题
    shortTerm: [], // 短期内处理的优化
    longTerm: []   // 长期优化建议
  }
}