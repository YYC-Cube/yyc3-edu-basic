# 全局智能审核系统

## 概述

这是一个多维度的全局智能审核系统，能够对前端项目进行全面的代码质量、性能、安全性、可访问性和依赖管理审核，并提供一键优化功能。

## 功能特性

### 🔍 多维度审核

- **代码质量**: TypeScript 类型检查、代码复杂度分析、代码风格检查
- **性能优化**: Bundle 大小分析、图片优化检查、渲染性能审核
- **安全检查**: 硬编码敏感信息检测、依赖安全漏洞扫描、CORS 配置检查
- **可访问性**: 键盘导航支持、ARIA 标签检查、颜色对比度验证
- **依赖管理**: 过时依赖检测、未使用依赖识别、重复依赖清理

### ⚡ 一键自动修复

- 自动修复 TypeScript any 类型
- 添加 React.memo 性能优化
- 移动敏感信息到环境变量
- 添加键盘导航支持
- 更新过时的依赖包
- 移除调试日志
- 启用代码分割
- 配置图片优化

### 📊 智能报告生成

- 详细的审核报告
- 多种导出格式（JSON、Markdown）
- 趋势分析和历史对比
- 优化建议和修复指导

## 使用方式

### 1. 启动审核

在应用界面中点击 "全局智能审核" 按钮（仪表盘图标），会打开审核面板。

### 2. 运行审核

点击 "开始审核" 按钮，系统将按以下顺序进行审核：

1. 代码质量分析 (约 2 秒)
2. 性能审核 (约 1.5 秒)
3. 安全检查 (约 1.8 秒)
4. 可访问性检查 (约 1.2 秒)
5. 依赖管理审核 (约 1 秒)

### 3. 查看结果

审核完成后，您可以：

- 查看总体评分和各维度得分
- 浏览发现的问题详情
- 查看优化建议
- 导出详细报告

### 4. 一键修复

对于支持自动修复的问题，点击 "一键修复" 按钮即可自动应用解决方案。

## 系统架构

### 核心模块

#### 1. 审核引擎 (`lib/real-audit-engine.ts`)

- `RealAuditEngine`: 主要审核引擎类
- 各种专项审核方法
- 文件系统操作和代码分析

#### 2. 自动修复引擎 (`lib/auto-fix-engine.ts`)

- `AutoFixEngine`: 自动修复执行器
- 支持多种修复策略
- 批量修复处理

#### 3. 报告生成器 (`lib/audit-report-generator.ts`)

- `AuditReportGenerator`: 报告生成和导出
- 支持多种格式输出
- 趋势分析计算

#### 4. 审核 Hook (`hooks/use-global-audit.ts`)

- 状态管理和流程控制
- 与 UI 组件的数据绑定
- 错误处理和降级

#### 5. UI 组件

- `GlobalAuditDashboard`: 主审核面板
- `AuditReportViewer`: 报告查看器
- 各种结果展示组件

### 配置文件

#### `config/audit-config.ts`

```typescript
export const AUDIT_CONFIG = {
  dimensionWeights: {
    code_quality: 0.25,
    performance: 0.2,
    security: 0.25,
    accessibility: 0.15,
    dependency: 0.15,
  },
  rules: {
    // 各种审核规则配置
  },
  autoFix: {
    // 自动修复配置
  },
};
```

## 审核规则详解

### 代码质量

- `typescript/no-any`: 检测 any 类型使用
- `complexity/max-complexity`: 循环复杂度检查
- `style/no-console`: console 语句检测

### 性能优化

- `bundle/size-limit`: Bundle 大小限制
- `react/memo-optimization`: React.memo 优化检查
- `performance/image-optimization`: 图片优化检查

### 安全检查

- `security/no-hardcoded-secrets`: 硬编码敏感信息检测
- `security/vulnerable-dependencies`: 依赖安全漏洞
- `security/cors-validation`: CORS 配置验证

### 可访问性

- `a11y/keyboard-navigation`: 键盘导航支持
- `a11y/aria-labels`: ARIA 标签检查
- `a11y/color-contrast`: 颜色对比度检查

### 依赖管理

- `deps/outdated`: 过时依赖检测
- `deps/unused`: 未使用依赖识别
- `deps/duplicate`: 重复依赖检查

## 评分算法

### 总体评分计算

总分 = Σ(维度分数 × 维度权重)

### 维度评分规则

- 基础分：100分
- 严重问题：-20分
- 高优先级问题：-15分
- 中等优先级问题：-10分
- 低优先级问题：-5分
- 信息提示：-2分

### 状态判定

- 优秀 (Excellent): ≥90分
- 良好 (Good): 75-89分
- 需改进 (Needs Improvement): 60-74分
- 严重 (Critical): <60分

## 扩展开发

### 添加新的审核规则

1. 在 `lib/real-audit-engine.ts` 中添加检查方法
2. 在 `config/audit-config.ts` 中配置规则
3. 如需自动修复，在 `lib/auto-fix-engine.ts` 中添加修复逻辑

### 自定义审核维度

1. 在 `hooks/use-global-audit.ts` 中添加新的 `AuditDimension`
2. 实现对应的审核方法
3. 更新 UI 组件以显示新维度

### API 集成

为了在生产环境中使用，建议创建以下 API 端点：

POST /api/audit/code-quality
POST /api/audit/performance
POST /api/audit/security
POST /api/audit/accessibility
POST /api/audit/dependencies
POST /api/audit/auto-fix

## 最佳实践

### 1. 定期审核

建议每次代码提交前或每日构建时运行审核。

### 2. 渐进式修复

优先修复严重和高优先级问题，逐步改善代码质量。

### 3. 团队协作

将审核结果分享给团队，建立代码质量标准。

### 4. 持续优化

根据项目需求调整审核规则和权重配置。

## 技术栈

- **前端框架**: Next.js 15 + React 19
- **UI 组件**: Radix UI + Tailwind CSS
- **状态管理**: React Hooks
- **类型检查**: TypeScript
- **图标**: Lucide React

## 部署说明

### 开发环境

```bash
pnpm install
pnpm dev
```

### 生产部署

```bash
pnpm build
pnpm start
```

### Docker 部署

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 故障排除

### 常见问题

1. **Node.js 模块在浏览器中报错**
   - 确保文件系统操作只在服务端执行
   - 使用动态导入和错误处理

2. **审核时间过长**
   - 调整文件扫描范围
   - 实现异步处理和进度反馈

3. **自动修复失败**
   - 检查文件权限
   - 验证语法正确性

## 许可证

MIT License

## 贡献指南

欢迎提交 Issue 和 Pull Request 来改进这个系统！

### 开发者须知

- 遵循 TypeScript 严格模式
- 保持组件的可测试性
- 添加适当的错误处理
- 更新相关文档
