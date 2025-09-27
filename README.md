# YanYuCloud AI - 智能教育平台

## 📋 项目简介

YanYuCloud AI 是一款基于先进人工智能技术打造的智能教育平台，旨在为用户提供个性化、高效、智能的学习体验。平台集成了多种AI模型，支持交互式学习、智能问答、知识图谱构建等功能，为教育领域带来创新解决方案。

## ✨ 核心特性

- **多模型支持**：集成多种AI模型，满足不同场景需求
- **交互式学习**：提供实时反馈和互动式学习体验
- **智能问答系统**：基于大语言模型的智能问答能力
- **响应式设计**：适配多种设备类型，提供一致的用户体验
- **可观测性架构**：完善的日志和监控系统，确保系统稳定性
- **主题定制**：支持明暗主题切换，提升用户体验

## 🛠️ 技术栈

- **前端框架**：Next.js 14 (React)
- **编程语言**：TypeScript
- **样式框架**：Tailwind CSS
- **组件库**：自定义UI组件 + Radix UI
- **状态管理**：React Hooks + Context API
- **构建工具**：Webpack, PostCSS
- **代码规范**：ESLint, Prettier
- **CI/CD**：GitHub Actions

## 📁 项目结构

```
├── app/                 # Next.js 应用目录
│   ├── globals.css      # 全局样式
│   ├── layout.tsx       # 应用布局
│   └── page.tsx         # 首页组件
├── components/          # 自定义组件
│   ├── ui/              # UI基础组件
│   └── model-selector.tsx # 模型选择器组件
├── config/              # 配置文件
├── hooks/               # 自定义Hooks
├── lib/                 # 核心功能库
├── public/              # 静态资源
├── styles/              # 样式文件
└── utils/               # 工具函数
```

## 🚀 快速开始

### 环境要求

- Node.js 18+
- npm/yarn/pnpm

### 安装依赖

```bash
# 使用npm
npm install

# 或使用yarn
# yarn install

# 或使用pnpm
# pnpm install
```

### 开发模式

```bash
# 使用npm
npm run dev

# 或使用yarn
# yarn dev

# 或使用pnpm
# pnpm dev
```

应用将在 `http://localhost:3000` 启动开发服务器。

### 构建生产版本

```bash
# 使用npm
npm run build

# 或使用yarn
# yarn build

# 或使用pnpm
# pnpm build
```

### 运行生产版本

```bash
# 使用npm
npm run start

# 或使用yarn
# yarn start

# 或使用pnpm
# pnpm start
```

## 🧩 功能模块

### AI模型集成

- 支持本地和远程AI模型接入
- 模型选择和切换功能
- 模型参数配置

### 智能交互系统

- 语音设置和交互
- 打字机效果展示
- 几何动画背景

### 教育功能模块

- 教育系统配置
- 智能提示模板
- 学习进度跟踪

## ⚙️ 配置说明

### 环境变量

项目支持通过环境变量进行配置，主要配置项包括：

- `API_KEY`：AI模型API密钥
- `NEXT_PUBLIC_APP_ENV`：应用环境（development/production）

### 主题配置

在 `theme-provider.tsx` 中配置应用主题，支持明暗主题切换。

## 🔍 系统分析报告

项目包含完整的全局分析报告，详细记录了系统的功能完整性、启动稳定性、环境兼容性、性能表现等多维度评估结果。报告显示系统已达到"Release Ready"级别，所有关键指标均已达标。

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📜 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

## 📧 联系方式

如有任何问题或建议，请随时联系项目维护团队。

---

**版本信息**: v2.2.0
**发布日期**: 2023-11-15
**维护团队**: YanYuCloud AI Team
