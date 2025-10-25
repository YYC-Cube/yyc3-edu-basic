import { promises as fs } from 'fs';
import path from 'path';


// 优化 Next.js 配置
/** @type {Function} */
const optimizeNextConfig = async () => {
  const nextConfigPath = path.join(process.cwd(), 'next.config.cjs');
  try {
    let content = '';
    try {
      content = await fs.readFile(nextConfigPath, 'utf-8');
    } catch {
      // 文件不存在，创建默认配置
      content = 'module.exports = {}';
    }

    const imageConfig = `\n  images: {\n    formats: ['image/webp', 'image/avif'],\n    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],\n    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384]\n  },`;

    const swcConfig = `\n  experimental: {\n    optimizeCss: true,\n    scrollRestoration: true\n  },\n  swcMinify: true`;

    // 添加图片配置
    if (!content.includes('images:')) {
      content = content.replace(/module\.exports\s*=\s*{([\s\S]*?)}/, `module.exports = {$1,${imageConfig}}`);
    }

    // 添加代码优化配置
    if (!content.includes('swcMinify:')) {
      content = content.replace(/module\.exports\s*=\s*{([\s\S]*?)}/, `module.exports = {$1,${swcConfig}}`);
    }

    // 修复配置文件中的语法问题
    content = content.replace(/,\s*}/g, '}');

    await fs.writeFile(nextConfigPath, content);
    return true;
  } catch (error) {
    console.error('优化 Next.js 配置失败:', error.message);
    return false;
  }
};

// 主函数
/** @type {Function} */
const main = async () => {
  const fixes = [
    { file: path.join(process.cwd(), 'next.config.cjs'), fix: optimizeNextConfig },
  ];

  let success = 0;
  let failed = 0;

  for (const { file, fix } of fixes) {
    try {
      const result = await fix(file);
      if (result) success++;
      else failed++;
    } catch {
      failed++;
    }
  }

  console.log(`修复完成: 成功 ${success} 项, 失败 ${failed} 项`);
};

main().catch((error) => {
  console.error('自动修复执行失败:', error);
});