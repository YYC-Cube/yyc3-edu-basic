// 自动修复入口脚本
import fs from 'fs/promises';
import path from 'path';

// 定义类型
interface FixFunction {
  (content: string): Promise<string>;
}

// 简单的修复函数
async function fixFile(filePath: string, fixFunction: FixFunction): Promise<boolean> {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const fixedContent = await fixFunction(content);
    if (fixedContent !== content) {
      await fs.writeFile(filePath, fixedContent);
      return true;
    }
    return false;
  } catch (error: unknown) {
    console.error(`修复文件 ${filePath} 失败:`, (error as Error).message);
    return false;
  }
}

// 修复类型注解
async function fixTypeScriptAny(content: string): Promise<string> {
  return content.replace(/:\s*any\b/g, ': unknown');
}

// 添加 React.memo 优化
async function addReactMemo(content: string): Promise<string> {
  if (!content.includes('export default function') && !content.includes('export default class')) {
    return content;
  }
  
  if (!content.includes('React.memo')) {
    // 添加 import React from 'react' 如果不存在
    if (!content.includes('import React')) {
      content = 'import React from \'react\';\n' + content;
    }
    // 包装导出的组件
    content = content.replace(
      /export default (function|class)\s+([A-Z][\w]+)/,
      '$1 $2;\nexport default React.memo($2);'
    );
  }
  return content;
}

// 修复可访问性问题
async function fixA11y(content: string): Promise<string> {
  // 添加 aria-label 和 tabIndex
  content = content.replace(/<button\s+/g, '<button aria-label="按钮" tabIndex="0" ');
  content = content.replace(/<a\s+(?!aria-label)/g, '<a aria-label="链接" ');
  return content;
}

// 移除 console 语句
async function removeConsoleLogs(content: string): Promise<string> {
  return content.replace(/console\.(log|debug|info|warn|error)\([^)]*\);?/g, '');
}

// 优化 Next.js 配置
async function optimizeNextConfig(): Promise<boolean> {
  const nextConfigPath = path.join(process.cwd(), 'next.config.js');
  try {
    let content = '';
    try {
      content = await fs.readFile(nextConfigPath, 'utf-8');
    } catch {
      // 文件不存在，创建默认配置
      content = 'module.exports = {};';
    }
    
    const imageConfig = `\n  images: {\n    formats: ['image/webp', 'image/avif'],\n    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],\n    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],\n  },`;
    
    const swcConfig = `\n  experimental: {\n    optimizeCss: true,\n    scrollRestoration: true,\n  },\n  swcMinify: true,`;
    
    // 添加图片配置
    if (!content.includes('images:')) {
      content = content.replace(/module\.exports\s*=\s*{([^}]*)}/, `module.exports = {$1,${imageConfig}}`);
    }
    
    // 添加代码优化配置
    if (!content.includes('swcMinify:')) {
      content = content.replace(/module\.exports\s*=\s*{([^}]*)}/, `module.exports = {$1,${swcConfig}}`);
    }
    
    await fs.writeFile(nextConfigPath, content);
    return true;
  } catch (error: unknown) {
    console.error('优化 Next.js 配置失败:', (error as Error).message);
    return false;
  }
}

// 定义修复项接口
interface FixItem {
  file: string;
  fix: FixFunction;
  description: string;
}

async function main(): Promise<void> {
  console.log('开始自动修复...');
  
  const fixes: FixItem[] = [
    {
      file: 'src/components/chat/ChatPanel.tsx',
      fix: async (content) => {
        let fixed = await fixTypeScriptAny(content);
        fixed = await addReactMemo(fixed);
        return fixed;
      },
      description: '添加类型注解和 React.memo 优化'
    },
    {
      file: 'src/components/ui/Button.tsx',
      fix: fixA11y,
      description: '添加可访问性支持'
    },
    {
      file: 'src/app/api/chat/route.ts',
      fix: removeConsoleLogs,
      description: '移除 console 语句'
    }
  ];
  
  let success: number = 0;
  let failed: number = 0;
  
  for (const item of fixes) {
    const filePath = path.join(process.cwd(), item.file);
    console.log(`\n修复 ${item.file} - ${item.description}...`);
    const result = await fixFile(filePath, item.fix);
    if (result) {
      success++;
      console.log('✓ 修复成功');
    } else {
      failed++;
      console.log('✗ 修复失败或无需修复');
    }
  }
  
  // 优化 Next.js 配置
  console.log('\n优化 Next.js 配置...');
  const configResult = await optimizeNextConfig();
  if (configResult) {
    success++;
    console.log('✓ 配置优化成功');
  } else {
    failed++;
    console.log('✗ 配置优化失败');
  }
  
  console.log(`\n自动修复完成！`);
  console.log(`成功修复: ${success}`);
  console.log(`修复失败: ${failed}`);
}

main().catch((error: Error) => {
  console.error('修复过程发生错误:', error.message);
  process.exit(1);
});