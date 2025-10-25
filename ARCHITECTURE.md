# 项目目录标准化（YYC³ AI）

本文件定义工作区的规范化目录结构、命名与导入约定，便于长期维护与协作。

## 根目录结构
- `app/`：Next.js App Router 路由与页面、API Route、`layout.tsx`、全局样式导入。
- `src/`：除路由以外的所有应用源码（组件、业务模块、hooks、工具）。
  - `src/components/`：通用与业务组件。
    - `src/components/ui/`：UI 基础组件（如 Button、Dialog 等）。
  - `src/hooks/`：React Hooks（如 `use-local-models`、`use-toast`）。
  - `src/lib/`：工具库与业务逻辑（如模型调用、审计引擎封装）。
  - 其他子域目录（如 `src/education/`、`src/emotion-platform/` 等），按领域划分。
- `public/`：静态资源（图片、图标、字体等）。
- `styles/`：可选的全局样式文件夹（若使用 Tailwind，主入口由 `app/layout.tsx` 引入 `app/globals.css`）。
- `config/`：配置与常量（如 `audit-config.ts`）。
- `docs/`：说明文档与 Python 学习组件服务代码（参见下文 Python 约定）。
- `next.config.mjs`：唯一的 Next.js 配置文件。
- `tsconfig.json`：TypeScript 配置与路径别名。

## 导入与路径别名
统一使用 `@` 前缀的别名，已在 `tsconfig.json` 中声明：
- `@/components/*` → `src/components/*`（兼容 `components/*`）
- `@/hooks/*` → `src/hooks/*`（兼容 `hooks/*`）
- `@/lib/*` → `src/lib/*`（兼容 `lib/*`）
- `@/ui/*` → `src/components/ui/*`（兼容 `ui/*`）
- `@/config/*` → `src/config/*`（兼容 `config/*`）
- `@/*` → 项目根（用于向后兼容旧绝对路径导入）

约定：
- 新增代码一律放置于 `src/` 下，并使用上述别名导入。
- 逐步迁移根目录旧模块至 `src/`，删除重复与冗余目录。

## 命名与分层
- 组件：`PascalCase` 文件名，导出默认组件与类型。
- Hooks：`useXxx.ts`，放在 `src/hooks/`。
- 工具库：功能域划分，放在 `src/lib/` 或领域子目录。
- 领域模块：在 `src/<domain>/` 下分层（`components/`、`lib/`、`types.ts`、`index.ts`）。

## 样式
- 全局样式入口：`app/globals.css`（Tailwind 基础层 + 自定义动画）。
- 仅保留一个入口文件，避免与 `styles/globals.css` 重复；如需保留 `styles/`，仅作为额外片段被 `globals.css` 显式导入。

## Python 学习组件（docs/学习组件）
- 配置集中到 `pyproject.toml`（基于 Based Pyright 类型检查与工具集成）。
- 服务入口：`docs/学习组件/api/main.py`（示例）由 `uvicorn` 启动；API 代理参考 `app/api/learning-paths/route.ts`。
- 仅在 `docs/学习组件/**/*.py` 范围内启用严格检查，渐进提升质量。

## 进阶建议（后续逐步执行）
- 合并重复的 `ui/` 与 `components/ui/`，仅保留 `src/components/ui/`。
- 将根目录残留模块（如 `use-mobile.tsx`、`use-toast.ts`）迁移至 `src/hooks/` 或 `src/components/ui/`。
- 为 `src/lib/` 与领域模块补充单元测试与 Storybook 示例，提升可维护性。

## 变更记录
- 新增 `src/hooks/` 与 `src/lib/`，并迁移原根目录对应内容。
- 扩展 `tsconfig.json` 路径别名，兼容新旧位置。
- 移除重复的 `next.config.cjs.disabled`，仅保留 `next.config.mjs`。
