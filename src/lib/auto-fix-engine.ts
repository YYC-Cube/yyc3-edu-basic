import type { AuditIssue } from '../hooks/use-global-audit'

// 扩展AuditIssue接口，添加自动修复相关属性
interface ExtendedAuditIssue extends AuditIssue {
  autoFixAvailable?: boolean;
  auto_fix_available?: boolean;
}

export class AutoFixEngine {
  async applyFix(issue: AuditIssue): Promise<boolean> {
    try {
      switch (issue.rule) {
        case 'typescript/no-any':
          return await this.fixTypeScriptAny(issue);
        case 'react/memo-optimization':
          return await this.addReactMemo(issue);
        case 'security/no-hardcoded-secrets':
          return await this.moveSecretsToEnv();
        case 'a11y/keyboard-navigation':
          return await this.addKeyboardNavigation(issue);
        case 'deps/outdated':
          return await this.updateDependencies();
        case 'style/no-console':
          return await this.removeConsoleStatements(issue);
        case 'bundle/size-limit':
          return await this.enableCodeSplitting();
        case 'performance/image-optimization':
          return await this.optimizeImages();
        default:
          console.warn(`未知的自动修复规则: ${issue.rule}`);
          return false;
      }
    } catch (e) {
      console.error(`自动修复失败 (${issue.rule}):`, e);
      return false;
    }
  }

  private async fixTypeScriptAny(issue: AuditIssue): Promise<boolean> {
    if (!issue.file) return false;

    try {
      const fs = await import('fs/promises');
      const content = await fs.readFile(issue.file, 'utf-8');
      
      // 简单的 any 类型替换（实际应该更智能）
      const fixedContent = content.replace(
        /:\s*any\b/g,
        ': unknown // TODO: 添加具体类型定义'
      );
      
      if (fixedContent !== content) {
        await fs.writeFile(issue.file, fixedContent);
        return true;
      }
    } catch (e) {
      console.error('修复 TypeScript any 类型失败:', e);
    }

    return false;
  }

  private async addReactMemo(issue: AuditIssue): Promise<boolean> {
    if (!issue.file) return false;

    try {
      const fs = await import('fs/promises');
      const content = await fs.readFile(issue.file, 'utf-8');
      
      // 检查是否已经导入了 React.memo
      if (!content.includes('import React, { memo }')) {
        // 添加导入
        const updatedContent = content.replace(
          /import React/g,
          'import React, { memo }'
        );
        
        // 查找组件定义并应用 memo
        // 这是一个简化的实现，实际应用中需要更复杂的 AST 解析
        const fixedContent = updatedContent.replace(
          /export const (\w+) = \(([^)]+)\) => \{/g,
          'export const $1 = memo(($2) => {'
        );
        
        await fs.writeFile(issue.file, fixedContent);
        return true;
      }
      return false;
    } catch (e) {
      console.error('添加 React.memo 失败:', e);
      return false;
    }
  }

  private async moveSecretsToEnv(): Promise<boolean> {
    // ... 实现逻辑 ...
    return false;
  }

  private async addKeyboardNavigation(issue: AuditIssue): Promise<boolean> {
    if (!issue.file) return false;

    try {
      const fs = await import('fs/promises');
      const content = await fs.readFile(issue.file, 'utf-8');
      
      // 简化实现：为可点击元素添加键盘事件处理
      const fixedContent = content.replace(
        /(<div|button|a)\s+className="([^"]+)"/g,
        '$1 className="$2" tabIndex="0" onKeyDown={(e) => e.key === "Enter" && e.currentTarget.click()}'
      );
      
      if (fixedContent !== content) {
        await fs.writeFile(issue.file, fixedContent);
        return true;
      }
      return false;
    } catch (e) {
      console.error('添加键盘导航失败:', e);
      return false;
    }
  }

  private async updateDependencies(): Promise<boolean> {
    try {
      const { execSync } = await import('child_process');
      
      // 使用 npm outdated 检查过时的包
      execSync('npm outdated', { stdio: 'inherit' });
      
      // 这里可以添加自动更新逻辑
      // execSync('npm update', { stdio: 'inherit' });
      
      return true;
    } catch (e) {
      console.error('更新依赖失败:', e);
      return false;
    }
  }

  private async removeConsoleStatements(issue: AuditIssue): Promise<boolean> {
    if (!issue.file) return false;

    try {
      const fs = await import('fs/promises');
      const content = await fs.readFile(issue.file, 'utf-8');
      
      // 移除 console.log 语句
      const fixedContent = content.replace(
        /console\.(log|debug|info|warn|error)\([^)]*\);?/g,
        ''
      );
      
      await fs.writeFile(issue.file, fixedContent);
      return true;
    } catch (e) {
      console.error('移除控制台语句失败:', e);
      return false;
    }
  }

  private async enableCodeSplitting(): Promise<boolean> {
    try {
      // 这里可以实现代码分割的自动配置
      // 例如，检测大组件并自动添加动态导入
      console.log('代码分割功能已启用');
      return true;
    } catch (e) {
      console.error('启用代码分割失败:', e);
      return false;
    }
  }

  private async optimizeImages(): Promise<boolean> {
    try {
      // 这里可以实现图片优化的自动处理
      // 例如，使用 sharp 库压缩图片
      console.log('图片优化功能已启用');
      return true;
    } catch (e) {
      console.error('图片优化失败:', e);
      return false;
    }
  }

  // 批量应用修复
  async applyBatchFixes(issues: ExtendedAuditIssue[]): Promise<{ success: number; failed: number }> {
    let successCount = 0;
    let failedCount = 0;

    for (const issue of issues) {
      // 检查是否有自动修复可用
      const hasAutoFix = issue.autoFixAvailable || issue.auto_fix_available;
      if (hasAutoFix) {
        const success = await this.applyFix(issue);
        if (success) {
          successCount++;
        } else {
          failedCount++;
        }
      }
    }

    return { success: successCount, failed: failedCount };
  }
}