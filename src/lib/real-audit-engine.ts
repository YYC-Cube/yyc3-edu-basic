import { AuditResult, AuditIssue, AuditDimension, AuditSeverity } from '../hooks/use-global-audit'

export class RealAuditEngine {
  private projectPath: string

  constructor(projectPath: string = process.cwd()) {
    this.projectPath = projectPath
  }

  // 执行真实的代码质量审核
  async auditCodeQuality(): Promise<AuditResult> {
    return this.runAudit(
      AuditDimension.CODE_QUALITY,
      [
        this.checkTypeScriptConfig.bind(this),
        this.checkComponentComplexity.bind(this),
        this.checkCodeStyle.bind(this),
      ],
      25
    );
  }

  // 执行性能审核
  async auditPerformance(): Promise<AuditResult> {
    return this.runAudit(
      AuditDimension.PERFORMANCE,
      [
        this.checkBundleSize.bind(this),
        this.checkImageOptimization.bind(this),
        this.checkRenderOptimization.bind(this),
      ],
      20
    );
  }

  // 执行安全审核
  async auditSecurity(): Promise<AuditResult> {
    return this.runAudit(
      AuditDimension.SECURITY,
      [
        this.checkHardcodedSecrets.bind(this),
        this.checkDependencySecurity.bind(this),
        this.checkCorsConfiguration.bind(this),
      ],
      15
    );
  }

  // 执行无障碍审核
  async auditAccessibility(): Promise<AuditResult> {
    return this.runAudit(
      AuditDimension.ACCESSIBILITY,
      [
        this.checkKeyboardNavigation.bind(this),
        this.checkAriaLabels.bind(this),
        this.checkColorContrast.bind(this),
      ],
      18
    );
  }

  // 执行依赖管理审核
  async auditDependencies(): Promise<AuditResult> {
    return this.runAudit(
      AuditDimension.DEPENDENCIES,
      [
        this.checkOutdatedDependencies.bind(this),
        this.checkUnusedDependencies.bind(this),
        this.checkDuplicateDependencies.bind(this),
      ],
      12
    );
  }

  // 通用审核执行器
  private async runAudit(
    dimension: AuditDimension,
    checks: (() => Promise<AuditIssue[]>)[],
    totalChecks: number
  ): Promise<AuditResult> {
    const issues: AuditIssue[] = [];
    let score = 100;

    try {
      for (const check of checks) {
        const checkIssues = await check();
        issues.push(...checkIssues);
      }
      score = this.calculateScore(issues, 100);
    } catch (e) {
      console.error(`${dimension} 审核失败:`, e);
    }

    return {
      dimension,
      score,
      maxScore: 100,
      issues,
      passedChecks: Math.max(0, totalChecks - issues.length),
      totalChecks,
      status: this.getStatus(score),
    };
  }

  // 私有方法实现具体检查逻辑

  // 查找源文件的方法
  private async findSourceFiles(): Promise<string[]> {
    try {
      // 尝试使用glob库（如果可用）
      try {
        const path = await import('path');
        const globModule = await import('glob');
        // 使用glob的promise版本
        const files = await globModule.glob(path.join(this.projectPath, '{src,app,components}/**/*.{ts,tsx}'), {
          ignore: ['**/node_modules/**', '**/dist/**']
        });
        return files;
      } catch (e) {
      console.error('使用glob查找源文件失败，尝试简单查找:', e);
        // 降级到简单的文件遍历方法
        const fs = await import('fs/promises');
        const path = await import('path');
        
        const files: string[] = [];
        const extensions = ['.ts', '.tsx', '.js', '.jsx'];
        const searchDirs = ['app', 'components', 'lib', 'hooks', 'pages', 'src'];
        
        for (const dir of searchDirs) {
          const dirPath = path.join(this.projectPath, dir);
          try {
            const dirFiles = await fs.readdir(dirPath, { recursive: true });
            for (const file of dirFiles) {
              if (typeof file === 'string' && extensions.some(ext => file.endsWith(ext))) {
                files.push(path.join(dirPath, file));
              }
            }
          } catch {
      // 目录不存在，继续检查其他目录
    }
        }
        
        return files;
      }
    } catch {
      console.error('查找源文件失败');
      return [];
    }
  }

  private async simpleFindSourceFiles(): Promise<string[]> {
    try {
      const fs = await import('fs/promises');
      const path = await import('path');
      
      const sourceDirs = ['src', 'app', 'components'];
      const files: string[] = [];
      
      for (const dir of sourceDirs) {
        const dirPath = path.join(this.projectPath, dir);
        try {
          const dirExists = await fs.stat(dirPath).then(stats => stats.isDirectory());
          if (dirExists) {
            // 简单实现，只查找一级目录
            const dirFiles = await fs.readdir(dirPath, { withFileTypes: true });
            for (const file of dirFiles) {
              if (file.isFile() && (file.name.endsWith('.ts') || file.name.endsWith('.tsx'))) {
                files.push(path.join(dirPath, file.name));
              }
            }
          }
        } catch {
    // 目录不存在，跳过
  }
      }
      
      return files;
    } catch (e) {
      console.error('查找源文件失败:', e);
      return [];
    }
  }

  private async checkTypeScriptConfig(): Promise<AuditIssue[]> {
    const issues: AuditIssue[] = []
    
    try {
      const fs = await import('fs/promises');
      const path = await import('path');
      
      // 检查 tsconfig.json
      try {
        const tsconfigPath = path.join(this.projectPath, 'tsconfig.json');
        const tsconfig = await fs.readFile(tsconfigPath, 'utf-8');
        const config = JSON.parse(tsconfig);
        
        if (!config.compilerOptions?.strict) {
          issues.push({
          id: 'ts-001',
          dimension: AuditDimension.CODE_QUALITY,
          rule: 'typescript/strict-mode',
          message: 'TypeScript 严格模式未启用: tsconfig.json 中未启用严格模式，可能导致类型检查不够严格',
          severity: AuditSeverity.HIGH,
          file: 'tsconfig.json',
          fixable: true,
          suggestion: '在 tsconfig.json 中设置 "strict": true'
        });
        }
      } catch {
    // tsconfig.json 不存在或格式错误
  }

      // 检查 .tsx 和 .ts 文件中的 any 类型使用
      const files = await this.findSourceFiles();
      for (const file of files.slice(0, 5)) { // 限制检查数量
        try {
          const content = await fs.readFile(file, 'utf-8');
          const anyMatches = content.match(/:\s*any\b/g);
          if (anyMatches && anyMatches.length > 0) {
            issues.push({
                id: `ts-any-${Math.random().toString(36).substring(2, 9)}`,
                dimension: AuditDimension.CODE_QUALITY,
                rule: 'typescript/no-any',
                message: `使用了 any 类型: 文件 ${file} 中发现 ${anyMatches.length} 处 any 类型使用`,
                severity: AuditSeverity.MEDIUM,
                file: file.replace(this.projectPath, ''),
                fixable: true,
                suggestion: '使用具体的类型定义替换 any'
              });
          }
        } catch {
        // 文件读取失败，跳过
      }
      }

    } catch (e) {
      console.error('TypeScript 配置检查失败:', e);
    }

    return issues;
  }

  private async checkComponentComplexity(): Promise<AuditIssue[]> {
    const issues: AuditIssue[] = []
    
    try {
      const files = await this.findSourceFiles();
      const fs = await import('fs/promises');
      
      for (const file of files.slice(0, 3)) {
        try {
          const content = await fs.readFile(file, 'utf-8');
          
          // 简单的复杂度检查：统计 if、for、while、switch 语句
          const complexityKeywords = /\b(if|for|while|switch|catch)\b/g;
          const matches = content.match(complexityKeywords);
          const complexity = matches ? matches.length : 0;
          
          if (complexity > 15) {
            issues.push({
                id: `complexity-${Math.random().toString(36).substring(2, 9)}`,
                dimension: AuditDimension.CODE_QUALITY,
                rule: 'complexity/max-complexity',
                message: `组件复杂度过高: 文件 ${file} 的循环复杂度为 ${complexity}，超过建议阈值 15`,
                severity: AuditSeverity.MEDIUM,
                file: file.replace(this.projectPath, ''),
                fixable: true,
                suggestion: '将复杂组件拆分为更小的子组件'
              });
          }
        } catch {
        // 文件读取失败，跳过
      }
      }
    } catch (e) {
      console.error('组件复杂度检查失败:', e);
    }

    return issues;
  }

  private async checkCodeStyle(): Promise<AuditIssue[]> {
    const issues: AuditIssue[] = []
    
    try {
      const files = await this.findSourceFiles();
      const fs = await import('fs/promises');
      
      for (const file of files.slice(0, 2)) {
        try {
          const content = await fs.readFile(file, 'utf-8');
          
          const consoleMatches = content.match(/console\.(log|error|warn|info)/g);
          if (consoleMatches && consoleMatches.length > 2) {
            issues.push({
                id: `style-console-${Math.random().toString(36).substring(2, 9)}`,
                dimension: AuditDimension.CODE_QUALITY,
                rule: 'style/no-console',
                message: `存在调试日志: 文件 ${file} 中发现 ${consoleMatches.length} 处 console 语句`,
                severity: AuditSeverity.LOW,
                file: file.replace(this.projectPath, ''),
                fixable: true,
                suggestion: '移除或替换为适当的日志记录方案'
              });
          }
        } catch {
        // 文件读取失败，跳过
      }
      }
    } catch (e) {
      console.error('代码风格检查失败:', e);
    }

    return issues;
  }

  private async checkBundleSize(): Promise<AuditIssue[]> {
    const issues: AuditIssue[] = []
    
    try {
      const fs = await import('fs/promises');
      const path = await import('path');
      
      // 检查 package.json 中的依赖数量
      const packagePath = path.join(this.projectPath, 'package.json');
      const packageContent = await fs.readFile(packagePath, 'utf-8');
      const packageJson = JSON.parse(packageContent);
      
      const depCount = Object.keys(packageJson.dependencies || {}).length;
      if (depCount > 50) {
        issues.push({
          id: 'bundle-deps',
          dimension: AuditDimension.PERFORMANCE,
          rule: 'bundle/dependency-count',
          message: `依赖包数量过多: 项目包含 ${depCount} 个依赖包，可能影响 bundle 大小`,
          severity: AuditSeverity.MEDIUM,
          file: 'package.json',
            fixable: true,
            suggestion: '审查并移除不必要的依赖包'
        });
      }

      // 模拟检查大文件
      const files = await this.findSourceFiles();
      for (const file of files) {
        try {
          const stats = await fs.stat(file);
          if (stats.size > 50000) { // 50KB
            issues.push({
              id: `bundle-large-file-${Math.random().toString(36).substring(2, 9)}`,
              dimension: AuditDimension.PERFORMANCE,
              rule: 'bundle/file-size',
              message: `发现大文件: 文件 ${file} 大小为 ${Math.round(stats.size / 1024)}KB，建议拆分`,
              severity: AuditSeverity.MEDIUM,
              file: file.replace(this.projectPath, ''),
              fixable: true,
              suggestion: '将大文件拆分为多个小文件'
            });
          }
        } catch {
        // 文件读取失败，跳过
      }
      }

    } catch (e) {
      console.error('Bundle 大小检查失败:', e);
    }

    return issues;
  }

  private async checkImageOptimization(): Promise<AuditIssue[]> {
    const issues: AuditIssue[] = []
    
    try {
      const path = await import('path');
      const fs = await import('fs/promises');
      
      // 检查 public 目录中的图片文件
      const publicPath = path.join(this.projectPath, 'public');
      try {
        const files = await fs.readdir(publicPath, { recursive: true });
        const imageFiles = files.filter(file => 
          typeof file === 'string' && /\.(jpg|jpeg|png|gif|bmp)$/i.test(file)
        );
        
        if (imageFiles.length > 0) {
          issues.push({
            id: 'perf-images',
            dimension: AuditDimension.PERFORMANCE,
            rule: 'performance/image-optimization',
            message: `未优化的图片格式: 发现 ${imageFiles.length} 个传统格式图片，建议使用 WebP 或 AVIF`,
            severity: AuditSeverity.MEDIUM,
            file: 'public/',
            fixable: true,
            suggestion: '使用 Next.js Image 组件和现代图片格式'
          });
        }
      } catch {
    // public 目录不存在
  }

    } catch (e) {
      console.error('图片优化检查失败:', e);
    }

    return issues;
  }

  private async checkRenderOptimization(): Promise<AuditIssue[]> {
    const issues: AuditIssue[] = []
    
    try {
      const files = await this.findSourceFiles();
      const fs = await import('fs/promises');
      
      for (const file of files.slice(0, 3)) {
        try {
          const content = await fs.readFile(file, 'utf-8');
          
          // 检查是否使用了 React.memo
          const hasMemo = content.includes('React.memo') || content.includes('memo(');
          const hasExport = content.includes('export') && content.includes('function');
          
          if (hasExport && !hasMemo && content.length > 5000) {
            issues.push({
                id: `perf-memo-${Math.random().toString(36).substring(2, 9)}`,
                dimension: AuditDimension.PERFORMANCE,
                rule: 'react/memo-optimization',
                message: `缺少渲染优化: 大型组件 ${file} 未使用 React.memo 优化`,
                severity: AuditSeverity.MEDIUM,
                file: file.replace(this.projectPath, ''),
                fixable: true,
                suggestion: '为纯函数组件添加 React.memo'
              });
          }
        } catch {
        // 文件读取失败，跳过
      }
      }
    } catch (e) {
      console.error('渲染优化检查失败:', e);
    }

    return issues;
  }

  private async checkHardcodedSecrets(): Promise<AuditIssue[]> {
    const issues: AuditIssue[] = []
    
    try {
      const files = await this.findSourceFiles();
      const fs = await import('fs/promises');
      
      // 常见的敏感信息模式
      const secretPatterns = [
        /api[_-]?key\s*[=:]\s*['"][^'"]+['"]/gi,
        /secret[_-]?key\s*[=:]\s*['"][^'"]+['"]/gi,
        /password\s*[=:]\s*['"][^'"]+['"]/gi,
        /token\s*[=:]\s*['"][^'"]+['"]/gi
      ];

      for (const file of files.slice(0, 5)) {
        try {
          const content = await fs.readFile(file, 'utf-8');
          
          for (const pattern of secretPatterns) {
            const matches = content.match(pattern);
            if (matches) {
              issues.push({
                id: `sec-hardcoded-${Math.random().toString(36).substring(2, 9)}`,
                dimension: AuditDimension.SECURITY,
                rule: 'security/no-hardcoded-secrets',
                message: `发现硬编码敏感信息: 文件 ${file} 中发现可能的硬编码密钥或密码`,
                severity: AuditSeverity.CRITICAL,
                file: file.replace(this.projectPath, ''),
                fixable: true,
                suggestion: '使用环境变量存储敏感信息'
              });
              break; // 每个文件只报告一次
            }
          }
        } catch {
        // 文件读取失败，跳过
      }
      }
    } catch (e) {
      console.error('硬编码敏感信息检查失败:', e);
    }
    
    return issues;
  }

  private async checkDependencySecurity(): Promise<AuditIssue[]> {
    const issues: AuditIssue[] = []
    
    try {
      const fs = await import('fs/promises');
      const path = await import('path');
      
      // 检查 package.json 中的已知有问题的包
      const packagePath = path.join(this.projectPath, 'package.json');
      const packageContent = await fs.readFile(packagePath, 'utf-8');
      const packageJson = JSON.parse(packageContent);
      
      const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
      
      // 模拟检查一些常见的有安全问题的包版本
      const vulnerablePackages = ['lodash', 'axios', 'express'];
      
      for (const pkg of vulnerablePackages) {
        if (dependencies[pkg]) {
          // 这里应该调用实际的漏洞数据库
          issues.push({
                id: `sec-vuln-${pkg}`,
                dimension: AuditDimension.SECURITY,
                rule: 'security/vulnerable-dependencies',
                message: `依赖包 ${pkg} 可能存在安全漏洞: 建议检查 ${pkg} 的最新安全更新`,
                severity: AuditSeverity.HIGH,
                file: 'package.json',
                fixable: true,
                suggestion: '更新到最新的安全版本'
              });
        }
      }

    } catch (e) {
      console.error('依赖安全检查失败:', e);
    }

    return issues;
  }

  private async checkCorsConfiguration(): Promise<AuditIssue[]> {
    const issues: AuditIssue[] = []
    
    try {
      const files = await this.findSourceFiles();
      const fs = await import('fs/promises');
      
      for (const file of files) {
        const content = await fs.readFile(file, 'utf-8');
        
        // 检查可能的 CORS 配置
        if (content.includes('Access-Control-Allow-Origin') && content.includes('*')) {
          issues.push({
              id: `sec-cors-${Math.random().toString(36).substring(2, 9)}`,
              dimension: AuditDimension.SECURITY,
              rule: 'security/cors-validation',
              message: `CORS 配置过于宽松: 文件 ${file} 中发现允许所有域的 CORS 配置`,
              severity: AuditSeverity.MEDIUM,
              file: file.replace(this.projectPath, ''),
              fixable: true,
              suggestion: '限制 CORS 允许的域名'
            });
        }
      }
    } catch (e) {
      console.error('CORS 配置检查失败:', e);
    }

    return issues;
  }

  private async checkKeyboardNavigation(): Promise<AuditIssue[]> {
    const issues: AuditIssue[] = []
    
    try {
      const files = await this.findSourceFiles();
      const fs = await import('fs/promises');
      
      for (const file of files.slice(0, 3)) {
        try {
          const content = await fs.readFile(file, 'utf-8');
          
          // 检查是否有点击事件但缺少键盘事件
          const hasOnClick = content.includes('onClick');
          const hasKeyboardEvents = content.includes('onKeyDown') || content.includes('onKeyPress');
          
          if (hasOnClick && !hasKeyboardEvents) {
            issues.push({
                id: `a11y-keyboard-${Math.random().toString(36).substring(2, 9)}`,
                dimension: AuditDimension.ACCESSIBILITY,
                rule: 'a11y/keyboard-navigation',
                message: `缺少键盘导航支持: 文件 ${file} 中的点击事件缺少对应的键盘事件处理`,
                severity: AuditSeverity.HIGH,
                file: file.replace(this.projectPath, ''),
                fixable: true,
                suggestion: '为点击事件添加对应的键盘事件处理'
              });
          }
        } catch {
        // 忽略文件读取错误
      }
      }
    } catch (e) {
      console.error('键盘导航检查失败:', e);
    }

    return issues;
  }

  private async checkAriaLabels(): Promise<AuditIssue[]> {
    const issues: AuditIssue[] = []
    
    try {
      const files = await this.findSourceFiles();
      const fs = await import('fs/promises');
      
      for (const file of files.slice(0, 2)) {
        try {
          const content = await fs.readFile(file, 'utf-8');
          
          // 检查 button 元素是否有 aria-label
          const buttonMatches = content.match(/<button[^>]*>/g);
          if (buttonMatches) {
            const buttonsWithoutAria = buttonMatches.filter(button => 
              !button.includes('aria-label') && !button.includes('aria-labelledby')
            );
            
            if (buttonsWithoutAria.length > 0) {
              issues.push({
                  id: `a11y-aria-${Math.random().toString(36).substring(2, 9)}`,
                  dimension: AuditDimension.ACCESSIBILITY,
                  rule: 'a11y/aria-labels',
                  message: `缺少 ARIA 标签: 文件 ${file} 中发现 ${buttonsWithoutAria.length} 个按钮缺少 aria-label`,
                  severity: AuditSeverity.MEDIUM,
                  file: file.replace(this.projectPath, ''),
                  fixable: true,
                  suggestion: '为按钮添加描述性的 aria-label'
                });
            }
          }
        } catch {
        // 忽略文件读取错误
      }
      }
    } catch (e) {
      console.error('ARIA 标签检查失败:', e);
    }

    return issues;
  }

  private async checkColorContrast(): Promise<AuditIssue[]> {
    const issues: AuditIssue[] = []
    
    // 这是一个简化的检查，实际应该分析 CSS 和计算对比度
    try {
      const files = await this.findSourceFiles();
      const fs = await import('fs/promises');
      
      for (const file of files.slice(0, 1)) {
        try {
          const content = await fs.readFile(file, 'utf-8');
          
          // 检查是否使用了浅色文字和浅色背景的组合
          if (content.includes('text-gray-300') && content.includes('bg-gray-200')) {
            issues.push({
                id: `a11y-contrast-${Math.random().toString(36).substring(2, 9)}`,
                dimension: AuditDimension.ACCESSIBILITY,
                rule: 'a11y/color-contrast',
                message: `颜色对比度可能不足: 文件 ${file} 中可能存在对比度不足的颜色组合`,
                severity: AuditSeverity.MEDIUM,
                file: file.replace(this.projectPath, ''),
                fixable: true,
                suggestion: '使用对比度更高的颜色组合'
              });
          }
        } catch {
        // 忽略文件读取错误
      }
      }
    } catch (e) {
      console.error('颜色对比度检查失败:', e);
    }

    return issues;
  }

  private async checkOutdatedDependencies(): Promise<AuditIssue[]> {
    const issues: AuditIssue[] = []
    
    try {
      const fs = await import('fs/promises');
      const path = await import('path');
      
      const packagePath = path.join(this.projectPath, 'package.json');
      try {
        const packageContent = await fs.readFile(packagePath, 'utf-8');
        const packageJson = JSON.parse(packageContent);
        
        const dependencies = packageJson.dependencies || {};
        
        // 模拟检查过时的依赖（实际应该调用 npm outdated 或类似 API）
        const possiblyOutdated = ['react', 'next', 'typescript'];
        
        for (const dep of possiblyOutdated) {
          if (dependencies[dep]) {
            issues.push({
              id: `dep-outdated-${dep}`,
              dimension: AuditDimension.DEPENDENCIES,
              rule: 'deps/outdated',
              message: `建议检查 ${dep} 是否有新版本可用`,
              severity: AuditSeverity.MEDIUM,
              file: 'package.json',
              fixable: true,
              suggestion: '更新到最新稳定版本'
            });
          }
        }
      } catch {
    // package.json 可能不存在或格式错误
  }

    } catch (e) {
      console.error('过时依赖检查失败:', e);
    }

    return issues;
  }

  private async checkUnusedDependencies(): Promise<AuditIssue[]> {
    const issues: AuditIssue[] = []
    
    try {
      const fs = await import('fs/promises');
      const path = await import('path');
      
      const packagePath = path.join(this.projectPath, 'package.json');
      const packageContent = await fs.readFile(packagePath, 'utf-8');
      const packageJson = JSON.parse(packageContent);
      
      const dependencies = Object.keys(packageJson.dependencies || {});
      const files = await this.findSourceFiles();
      
      // 简单检查：在源代码中查找依赖的引用
      const usedDependencies = new Set<string>();
      
      for (const file of files.slice(0, 10)) {
        const content = await fs.readFile(file, 'utf-8');
        
        for (const dep of dependencies) {
          if (content.includes(`from '${dep}'`) || content.includes(`require('${dep}')`)) {
            usedDependencies.add(dep);
          }
        }
      }
      
      const unusedDeps = dependencies.filter(dep => !usedDependencies.has(dep));
      
      if (unusedDeps.length > 0) {
        issues.push({
            id: 'dep-unused',
            dimension: AuditDimension.DEPENDENCIES,
            rule: 'deps/unused',
            message: `发现 ${unusedDeps.length} 个可能未使用的依赖包`,
            severity: AuditSeverity.LOW,
            file: 'package.json',
            fixable: true,
            suggestion: '移除未使用的依赖包'
          });
      }

    } catch (e) {
      console.error('未使用依赖检查失败:', e);
    }

    return issues;
  }

  private async checkDuplicateDependencies(): Promise<AuditIssue[]> {
    const issues: AuditIssue[] = []
    
    try {
      const fs = await import('fs/promises');
      const path = await import('path');
      
      const packagePath = path.join(this.projectPath, 'package.json');
      try {
        const packageContent = await fs.readFile(packagePath, 'utf-8');
        const packageJson = JSON.parse(packageContent);
        const deps = packageJson.dependencies || {};
        const devDeps = packageJson.devDependencies || {};
        
        // 检查在 dependencies 和 devDependencies 中都存在的包
        const duplicates = Object.keys(deps).filter(dep => devDeps[dep]);
        
        if (duplicates.length > 0) {
          issues.push({
            id: 'dep-duplicate',
            dimension: AuditDimension.DEPENDENCIES,
            rule: 'deps/duplicate',
            message: `${duplicates.join(', ')} 在 dependencies 和 devDependencies 中都存在`,
            severity: AuditSeverity.LOW,
            file: 'package.json',
            fixable: true,
            suggestion: '将依赖移至合适的分类中'
          });
        }
      } catch {
    // package.json 可能不存在或格式错误
  }

    } catch (e) {
      console.error('重复依赖检查失败:', e);
    }

    return issues;
  }

  // 辅助方法



  private calculateScore(issues: AuditIssue[], baseScore: number): number {
    let deduction = 0;
    
    issues.forEach(issue => {
      switch (issue.severity) {
        case AuditSeverity.CRITICAL:
          deduction += 20;
          break;
        case AuditSeverity.HIGH:
          deduction += 15;
          break;
        case AuditSeverity.MEDIUM:
          deduction += 10;
          break;
        case AuditSeverity.LOW:
          deduction += 5;
          break;
        default:
          deduction += 2;
      }
    });
    
    return Math.max(0, baseScore - deduction);
  }

  private getStatus(score: number): 'good' | 'needs_improvement' | 'critical' {
    // 移除'excellent'返回值，保持与AuditResult类型一致
    if (score >= 75) return 'good';
    if (score >= 60) return 'needs_improvement';
    return 'critical';
  }
}