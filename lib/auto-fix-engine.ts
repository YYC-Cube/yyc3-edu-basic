import { AuditIssue } from '@/hooks/use-global-audit'

export class AutoFixEngine {
  async applyFix(issue: AuditIssue): Promise<boolean> {
    try {
      switch (issue.rule) {
        case 'typescript/no-any':
          return await this.fixTypeScriptAny(issue
        case 'react/memo-optimization':
          return await this.addReactMemo(issue
        case 'security/no-hardcoded-secrets':
          return await this.moveSecretsToEnv(issue
        case 'a11y/keyboard-navigation':
          return await this.addKeyboardNavigation(issue
        case 'deps/outdated':
          return await this.updateDependencies(issue
        case 'style/no-console':
          return await this.removeConsoleStatements(issue
        case 'bundle/size-limit':
          return await this.enableCodeSplitting(issue
        case 'performance/image-optimization':
          return await this.optimizeImages(issue
        default:
          console.warn(`未知的自动修复规则: ${issue.rule}`
          return false
      }
    } catch (error) {
      console.error(`自动修复失败 (${issue.rule}):`, error
      return false
    }
  }

  private async fixTypeScriptAny(issue: AuditIssue): Promise<boolean> {
    if (!issue.file) return false

    try {
      const fs = await import('fs/promises'
      const content = await fs.readFile(issue.file, 'utf-8'
      
      // 简单的 any 类型替换（实际应该更智能）
      const fixedContent = content.replace(
        /:\s*any\b/g,
        ': unknown // TODO: 添加具体类型定义'
      
      
      if (fixedContent !== content) {
        await fs.writeFile(issue.file, fixedContent
        return true
      }
    } catch (error) {
      console.error('修复 TypeScript any 类型失败:', error
    }

    return false
  }

  private async addReactMemo(issue: AuditIssue): Promise<boolean> {
    if (!issue.file) return false

    try {
      const fs = await import('fs/promises'
      const content = await fs.readFile(issue.file, 'utf-8'
      
      // 检查是否已经有 React.memo
      if (content.includes('React.memo') || content.includes('memo(')) {
        return true // 已经优化过了
      }

      // 查找导出的函数组件
      const exportPattern = /export\s+(?:default\s+)?function\s+(\w+)/
      const match = content.match(exportPattern
      
      if (match) {
        const componentName = match[1]
        
        // 添加 React import（如果没有的话）
        let fixedContent = content
        if (!content.includes('import React') && !content.includes('from "react"')) {
          fixedContent = 'import React from "react"\n' + fixedContent
        } else if (content.includes('import') && !content.includes('memo')) {
          // 添加 memo 到现有的 React import
          fixedContent = fixedContent.replace(
            /import\s+(?:{[^}]*}|\w+)\s+from\s+["']react["']/,
            match => {
              if (match.includes('{')) {
                return match.replace('}', ', memo }'
              } else {
                return match.replace('from "react"', ', { memo } from "react"'
              }
            }
          
        }

        // 用 memo 包装组件导出
        fixedContent = fixedContent.replace(
          new RegExp(`export\\s+default\\s+${componentName}`),
          `export default ${componentName})`
        

        await fs.writeFile(issue.file, fixedContent
        return true
      }
    } catch (error) {
      console.error('添加 React.memo 失败:', error
    }

    return false
  }

  private async moveSecretsToEnv(issue: AuditIssue): Promise<boolean> {
    if (!issue.file) return false

    try {
      const fs = await import('fs/promises'
      const path = await import('path'
      
      const content = await fs.readFile(issue.file, 'utf-8'
      
      // 查找硬编码的密钥
      const secretPatterns = [
        { pattern: /api[_-]?key\s*[=:]\s*['""]([^'"]+)['"]/gi, envName: 'API_KEY' },
        { pattern: /secret[_-]?key\s*[=:]\s*['""]([^'"]+)['"]/gi, envName: 'SECRET_KEY' },
        { pattern: /password\s*[=:]\s*['""]([^'"]+)['"]/gi, envName: 'PASSWORD' },
        { pattern: /token\s*[=:]\s*['""]([^'"]+)['"]/gi, envName: 'TOKEN' }
      ]

      let fixedContent = content
      const envVars: { [key: string]: string } = {}

      for (const { pattern, envName } of secretPatterns) {
        let match
        while ((match = pattern.exec(content)) !== null) {
          const [fullMatch, secretValue] = match
          const envVarName = `${envName}_${Math.random().toString(36).substr(2, 4).toUpperCase()}`
          
          // 替换硬编码值为环境变量
          fixedContent = fixedContent.replace(
            fullMatch,
            fullMatch.replace(secretValue, `process.env.${envVarName}`
          
          
          envVars[envVarName] = secretValue
        }
      }

      if (Object.keys(envVars).length > 0) {
        // 写入修复后的文件
        await fs.writeFile(issue.file, fixedContent

        // 创建或更新 .env.example 文件
        const projectRoot = process.cwd(
        const envExamplePath = path.join(projectRoot, '.env.example'
        
        let envExample = ''
        try {
          envExample = await fs.readFile(envExamplePath, 'utf-8'
        } catch (error) {
          // 文件不存在，将创建新文件
        }

        // 添加环境变量到 .env.example
        for (const [envVar, value] of Object.entries(envVars)) {
          if (!envExample.includes(envVar)) {
            envExample += `${envVar}=your_${envVar.toLowerCase()}_here\n`
          }
        }

        await fs.writeFile(envExamplePath, envExample

        return true
      }
    } catch (error) {
      console.error('移动敏感信息到环境变量失败:', error
    }

    return false
  }

  private async addKeyboardNavigation(issue: AuditIssue): Promise<boolean> {
    if (!issue.file) return false

    try {
      const fs = await import('fs/promises'
      const content = await fs.readFile(issue.file, 'utf-8'
      
      // 为有 onClick 但缺少键盘事件的元素添加键盘支持
      let fixedContent = content.replace(
        /onClick={([^}]+)}/g,
        (match, handler) => {
          // 检查是否已经有键盘事件
          const hasKeyboard = content.includes('onKeyDown') || content.includes('onKeyPress'
          if (hasKeyboard) return match

          return `${match} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { ${handler.replace('()', '(e)')} } }}`
        }
      

      // 为交互元素添加 tabIndex
      fixedContent = fixedContent.replace(
        /<(button|div|span)([^>]*onClick[^>]*)>/g,
        (match, tag, attrs) => {
          if (attrs.includes('tabIndex')) return match
          return `<${tag}${attrs} tabIndex={0}>`
        }
      

      if (fixedContent !== content) {
        await fs.writeFile(issue.file, fixedContent
        return true
      }
    } catch (error) {
      console.error('添加键盘导航失败:', error
    }

    return false
  }

  private async updateDependencies(issue: AuditIssue): Promise<boolean> {
    try {
      const { execSync } = await import('child_process'
      
      // 使用 npm outdated 检查过时的包
      
      try {
        // 更新所有依赖到最新版本（谨慎操作）
        execSync('npm update', { stdio: 'inherit' }
        return true
      } catch (error) {
        console.error('更新依赖包失败:', error
        return false
      }
    } catch (error) {
      console.error('依赖更新失败:', error
    }

    return false
  }

  private async removeConsoleStatements(issue: AuditIssue): Promise<boolean> {
    if (!issue.file) return false

    try {
      const fs = await import('fs/promises'
      const content = await fs.readFile(issue.file, 'utf-8'
      
      const fixedContent = content.replace(
        /console\.(log|error|warn|info)\s*\([^)]*\)\s*;?\s*\n?/g,
        ''
      

      if (fixedContent !== content) {
        await fs.writeFile(issue.file, fixedContent
        return true
      }
    } catch (error) {
      console.error('移除 console 语句失败:', error
    }

    return false
  }

  private async enableCodeSplitting(issue: AuditIssue): Promise<boolean> {
    try {
      const fs = await import('fs/promises'
      const path = await import('path'
      
      // 检查 next.config.js 并启用代码分割
      const projectRoot = process.cwd(
      const nextConfigPath = path.join(projectRoot, 'next.config.js'
      
      try {
        const configContent = await fs.readFile(nextConfigPath, 'utf-8'
        
        // 添加 webpack 配置进行代码分割
        const optimizedConfig = configContent.replace(
          /module\.exports\s*=\s*{([^}]*)}/,
          `module.exports = {
  $1,
  webpack: (config) => {
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      },
    }
    return config
  },
}`
        

        if (optimizedConfig !== configContent) {
          await fs.writeFile(nextConfigPath, optimizedConfig
          return true
        }
      } catch (error) {
        // next.config.js 不存在，创建一个新的
        const newConfig = `/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      },
    }
    return config
  },
}

module.exports = nextConfig
`
        await fs.writeFile(nextConfigPath, newConfig
        return true
      }
    } catch (error) {
      console.error('启用代码分割失败:', error
    }

    return false
  }

  private async optimizeImages(issue: AuditIssue): Promise<boolean> {
    try {
      const fs = await import('fs/promises'
      const path = await import('path'
      
      // 更新 next.config.js 以启用图片优化
      const projectRoot = process.cwd(
      const nextConfigPath = path.join(projectRoot, 'next.config.js'
      
      let configContent = ''
      try {
        configContent = await fs.readFile(nextConfigPath, 'utf-8'
      } catch (error) {
        // 文件不存在
      }

      const imageConfig = `
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },`

      if (configContent) {
        // 添加图片配置到现有配置
        const optimizedConfig = configContent.replace(
          /module\.exports\s*=\s*{([^}]*)}/,
          `module.exports = {$1,${imageConfig}}`
        
        await fs.writeFile(nextConfigPath, optimizedConfig
      } else {
        // 创建新的配置文件
        const newConfig = `/** @type {import('next').NextConfig} */
const nextConfig = {${imageConfig}
}

module.exports = nextConfig
`
        await fs.writeFile(nextConfigPath, newConfig
      }

      return true
    } catch (error) {
      console.error('优化图片配置失败:', error
    }

    return false
  }

  // 批量应用修复
  async applyBatchFixes(issues: AuditIssue[]): Promise<{ success: number; failed: number }> {
    let success = 0
    let failed = 0

    for (const issue of issues) {
      if (issue.autoFixAvailable) {
        const result = await this.applyFix(issue
        if (result) {
          success++
        } else {
          failed++
        }
        
        // 添加延迟避免文件系统压力
        await new Promise(resolve => setTimeout(resolve, 100)
      }
    }

    return { success, failed }
  }
}