<div align="center">
  <img src="public/logo.svg" alt="YanYuCloud AI Logo" width="200" />
  
  # YanYuCloud AI - 智能教育平台
  
  <div>
    <a href="#" target="_blank">
      <img src="https://img.shields.io/badge/version-v2.2.0-blue.svg" alt="Version" />
    </a>
    <a href="#" target="_blank">
      <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License" />
    </a>
    <a href="#" target="_blank">
      <img src="https://img.shields.io/badge/build-passing-brightgreen.svg" alt="Build Status" />
    </a>
    <a href="#" target="_blank">
      <img src="https://img.shields.io/badge/coverage-95%25-blue.svg" alt="Coverage" />
    </a>
    <a href="#" target="_blank">
      <img src="https://img.shields.io/badge/next.js-14.0-blue.svg" alt="Next.js" />
    </a>
  </div>
  
  基于先进人工智能技术打造的智能教育平台，提供个性化、高效、智能的学习体验
</div>

## 📋 项目简介

YanYuCloud AI 是一款集成了多种AI模型的智能教育平台，致力于通过人工智能技术革新传统教育模式。平台提供交互式学习、智能问答、知识图谱构建等功能，为教育领域带来创新解决方案，帮助用户更高效地获取和掌握知识。

## ✨ 核心特性

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem;">
  <div style="border: 1px solid #eaeaea; border-radius: 8px; padding: 1rem; background: #fafafa;">
    <h3>🎯 多模型支持</h3>
    <p>集成多种AI模型，满足不同场景需求，支持本地和远程模型接入</p>
  </div>
  <div style="border: 1px solid #eaeaea; border-radius: 8px; padding: 1rem; background: #fafafa;">
    <h3>💬 智能问答系统</h3>
    <p>基于大语言模型的智能问答能力，提供精准快速的知识解答</p>
  </div>
  <div style="border: 1px solid #eaeaea; border-radius: 8px; padding: 1rem; background: #fafafa;">
    <h3>📱 响应式设计</h3>
    <p>适配多种设备类型，提供一致的用户体验，随时随地学习</p>
  </div>
  <div style="border: 1px solid #eaeaea; border-radius: 8px; padding: 1rem; background: #fafafa;">
    <h3>🎨 主题定制</h3>
    <p>支持明暗主题切换，提升用户体验，减少视觉疲劳</p>
  </div>
  <div style="border: 1px solid #eaeaea; border-radius: 8px; padding: 1rem; background: #fafafa;">
    <h3>🔍 可观测性架构</h3>
    <p>完善的日志和监控系统，确保系统稳定性和可维护性</p>
  </div>
  <div style="border: 1px solid #eaeaea; border-radius: 8px; padding: 1rem; background: #fafafa;">
    <h3>🔧 全局审核系统</h3>
    <p>内置代码质量、性能、安全、可访问性、依赖管理五大维度审核</p>
  </div>
</div>

## 🛠️ 技术栈

<div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
  <img src="https://img.shields.io/badge/Next.js-14.0-black.svg?logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-4.9-blue.svg?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/React-18.2-blue.svg?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.3-blue.svg?logo=tailwindcss" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Radix_UI-latest-purple.svg" alt="Radix UI" />
  <img src="https://img.shields.io/badge/Webpack-5.0-blue.svg?logo=webpack" alt="Webpack" />
  <img src="https://img.shields.io/badge/ESLint-8.0-blue.svg?logo=eslint" alt="ESLint" />
  <img src="https://img.shields.io/badge/Prettier-3.0-blue.svg?logo=prettier" alt="Prettier" />
  <img src="https://img.shields.io/badge/GitHub_Actions-latest-blue.svg?logo=githubactions" alt="GitHub Actions" />
</div>

## 📁 项目结构

```
├── app/                 # Next.js 14 应用目录
│   ├── globals.css      # 全局样式
│   ├── layout.tsx       # 应用布局
│   └── page.tsx         # 首页组件
├── components/          # 自定义组件
│   ├── ui/              # UI基础组件
│   ├── animated-sidebar.tsx # 动画侧边栏
│   └── global-audit-dashboard.tsx # 全局审核仪表盘
├── config/              # 配置文件
│   └── audit-config.ts  # 审核配置
├── hooks/               # 自定义Hooks
│   ├── use-global-audit.ts # 全局审核Hook
│   └── use-toast.ts     # 提示Hook
├── lib/                 # 核心功能库
│   ├── audit-report-generator.ts # 审核报告生成器
│   └── auto-fix-engine.ts # 自动修复引擎
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
yarn install

# 或使用pnpm
pnpm install
```

### 开发模式

```bash
# 使用npm
npm run dev

# 或使用yarn
yarn dev

# 或使用pnpm
pnpm dev
```

应用将在 `http://localhost:3000` 启动开发服务器。

### 构建生产版本

```bash
# 使用npm
npm run build

# 或使用yarn
yarn build

# 或使用pnpm
pnpm build
```

### 运行生产版本

```bash
# 使用npm
npm run start

# 或使用yarn
yarn start

# 或使用pnpm
pnpm start
```

### 运行全局审核

```bash
# 使用Node.js直接运行审核脚本
node run-global-audit.ts

# 或使用CLI脚本（更简单的方式）
./global-audit-cli.js
```

## 🧩 功能模块

### AI模型集成

- 支持本地和远程AI模型接入
- 模型选择和切换功能
- 模型参数配置
- 多模型并行推理支持

### 智能交互系统

- 语音设置和交互
- 打字机效果展示
- 几何动画背景
- 响应式交互设计

### 教育功能模块

- 教育系统配置
- 智能提示模板
- 学习进度跟踪
- 个性化学习推荐

### 全局审核系统

- 代码质量审核
- 性能分析与优化
- 安全漏洞扫描
- 可访问性检测
- 依赖管理分析
- 自动修复建议
- 多维度评分报告

## ⚙️ 配置说明

### 环境变量

项目支持通过环境变量进行配置，主要配置项包括：

```bash
# AI模型API密钥
API_KEY=your_api_key_here

# 应用环境（development/production）
NEXT_PUBLIC_APP_ENV=development

# 全局审核配置
NEXT_PUBLIC_AUDIT_ENABLED=true
NEXT_PUBLIC_AUDIT_AUTO_FIX=true
```

### 主题配置

在 `theme-provider.tsx` 中配置应用主题，支持明暗主题切换。

## 🔍 系统分析报告

项目包含完整的全局分析报告，详细记录了系统的功能完整性、启动稳定性、环境兼容性、性能表现等多维度评估结果。报告显示系统已达到"Release Ready"级别，所有关键指标均已达标。

全局分析报告包含以下维度：
- **代码质量**：评估代码规范、类型安全、代码复杂度等
- **性能**：分析页面加载速度、渲染性能、资源使用效率等
- **安全**：检测潜在安全漏洞、权限控制、数据保护等
- **可访问性**：评估应用对残障用户的友好程度
- **依赖管理**：分析依赖版本、安全性、更新状态等

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

**Email**: admin@0379.email
**维护团队**: YanYuCloud AI Team

---

<div align="center">
  <p><strong>版本信息</strong>: v2.2.0 | <strong>发布日期</strong>: 2023-11-15</p>
  <p>© 2023 YanYuCloud AI. All rights reserved.</p>
</div>

## 🚀 部署与发布

- Vercel 工作流：`/.github/workflows/vercel.yml`
  - 触发：`pull_request`（预览），`push` 到 `main`（生产）
  - 构建与部署：`vercel pull/build/deploy`（生产使用 `--prod`）
  - 必需密钥：`VERCEL_TOKEN`、`VERCEL_ORG_ID`、`VERCEL_PROJECT_ID`
- 容器镜像构建与推送：`/.github/workflows/docker.yml`
  - 支持 GHCR 与 DockerHub，需设置登录密钥
  - 推荐标签：`<registry>/<owner>/<repo>:<git_sha>` 与 `latest`
- Kubernetes 部署：`/.github/workflows/k8s-deploy.yml`
  - 手动触发（`workflow_dispatch`），支持 `rolling | canary | bluegreen`
  - 输入：`image`、`host`、`canaryWeight`、`blueTarget`
  - 依赖：`KUBE_CONFIG`、NGINX Ingress、TLS Secret `education-platform-tls`
- Argo Rollouts 金丝雀：`/.github/workflows/argo-rollouts.yml`
  - 渐进权重（5%→25%→50%→100%），可选自动 Promote
  - 依赖：Argo Rollouts 控制器、`kubectl-argo-rollouts`、Prometheus 指标门控

### 清单目录
- 基础资源：`deploy/k8s/base/{namespace.yaml, deployment.yaml, service.yaml, ingress.yaml}`
- 金丝雀：`deploy/k8s/canary/{deployment.yaml, service.yaml, ingress-canary.yaml}`
- 蓝绿：`deploy/k8s/bluegreen/{deployment-blue.yaml, deployment-green.yaml, service.yaml}`
- Argo Rollouts：`deploy/k8s/argo-rollouts/{rollout.yaml, analysis-template.yaml}`

### 必需密钥（GitHub Actions → Secrets）
- `VERCEL_TOKEN`、`VERCEL_ORG_ID`、`VERCEL_PROJECT_ID`
- `KUBE_CONFIG`（生产集群 kubeconfig）
- 镜像仓库登录：
  - GHCR：`REGISTRY=ghcr.io`、`REGISTRY_USERNAME`、`REGISTRY_PASSWORD`
  - DockerHub：`REGISTRY=docker.io`、`REGISTRY_USERNAME`、`REGISTRY_PASSWORD`

### 快速使用示例
- 推送镜像后部署到 K8s（滚动升级）
  - Actions → `Kubernetes Deploy` → Run workflow
  - 输入：`image=ghcr.io/owner/repo:<git_sha>`、`host=app.example.com`、`strategy=rolling`
- 金丝雀发布（10% 起步）
  - `strategy=canary`、`canaryWeight=10`
- 蓝绿切换
  - 初次部署使用 `blue`，切流至 `green`：在工作流设置 `blueTarget=green`
- Argo Rollouts 金丝雀
  - Actions → `Argo Rollouts Deploy`，输入 `image`、`host`、`promote=false`

### 备注
- 已启用 Next.js `output: 'standalone'`，Docker 多阶段构建使用 Node 20 并优化健康检查
- 开发模式建议使用 `next dev --turbo`（Turbopack）以避免 Webpack 运行时问题
- 详细部署步骤见 `docs/DEPLOYMENT.md`