# 部署与发布指南

本文档汇总本项目的 CI/CD 工作流与云端部署策略，包括 Vercel、容器镜像推送（GHCR/DockerHub）、Kubernetes（滚动/金丝雀/蓝绿）以及 Argo Rollouts（分阶段金丝雀与自动化指标门控）。

## 前置条件
- Node.js 20（生产镜像）
- Next.js `output: 'standalone'` 已在 `next.config.mjs` 启用
- 代码仓库已配置 GitHub Actions Secrets（见下文）

## Vercel 部署
- 工作流：`/.github/workflows/vercel.yml`
- 触发：
  - `pull_request` → 预览环境（Preview）
  - `push` 到 `main` → 生产环境（Production）
- 步骤：
  1. `vercel pull --environment=preview|production`
  2. `vercel build`（生产加 `--prod`）
  3. `vercel deploy --prebuilt`（生产加 `--prod`）
- Secrets：`VERCEL_TOKEN`、`VERCEL_ORG_ID`、`VERCEL_PROJECT_ID`

## 容器镜像构建与推送（GHCR/DockerHub）
- 工作流：`/.github/workflows/docker.yml`
- 建议标签策略：
  - `ghcr.io/<owner>/<repo>:<git_sha>` 与 `ghcr.io/<owner>/<repo>:latest`
- Secrets：
  - GHCR：`REGISTRY=ghcr.io`、`REGISTRY_USERNAME`、`REGISTRY_PASSWORD`
  - DockerHub：`REGISTRY=docker.io`、`REGISTRY_USERNAME`、`REGISTRY_PASSWORD`
- 使用：工作流完成后在日志中查看构建的镜像标签，作为后续 K8s/Argo Rollouts 的输入。

## Kubernetes 部署（滚动 / 金丝雀 / 蓝绿）
- 工作流：`/.github/workflows/k8s-deploy.yml`（手动触发）
- 输入：
  - `image`：镜像地址（例：`ghcr.io/owner/repo:abcdef`）
  - `host`：Ingress 域名（例：`app.example.com`）
  - `strategy`：`rolling | canary | bluegreen`
  - `canaryWeight`：金丝雀权重（默认 `10`）
  - `blueTarget`：蓝绿当前激活版本（`blue | green`）
- 前置：
  - Secrets：`KUBE_CONFIG`（目标集群 kubeconfig）
  - 集群安装 NGINX Ingress Controller
  - TLS 证书 Secret：`education-platform-tls`
- 清单目录：
  - 基础：`deploy/k8s/base/`
  - 金丝雀：`deploy/k8s/canary/`
  - 蓝绿：`deploy/k8s/bluegreen/`
- 示例：
  ```bash
  # 滚动升级
  # 在工作流参数中设置 strategy=rolling
  
  # 金丝雀发布 10%
  # strategy=canary, canaryWeight=10
  
  # 蓝绿切换到 green
  # strategy=bluegreen, blueTarget=green
  ```

## Argo Rollouts（分阶段金丝雀 + 指标门控）
- 工作流：`/.github/workflows/argo-rollouts.yml`（手动触发）
- 资源：`deploy/k8s/argo-rollouts/{rollout.yaml, analysis-template.yaml}`
- 前置：
  - 安装 Argo Rollouts 控制器：
    ```bash
    kubectl apply -f https://github.com/argoproj/argo-rollouts/releases/latest/download/install.yaml
    ```
  - 安装 `kubectl-argo-rollouts` 插件（工作流会自动安装）
  - Prometheus 指标门控（示例地址：`http://prometheus-server.monitoring.svc.cluster.local`）
- Rollout 策略要点：
  - 渐进权重：`5% → 25% → 50% → 100%`
  - 每步暂停并执行 `AnalysisTemplate`，成功率阈值默认 `>=95%`
  - 使用 `stableService` 与 `canaryService` 结合 NGINX Ingress 进行流量分配
- 常用命令：
  ```bash
  kubectl-argo-rollouts get rollout education-platform -n education-platform
  kubectl-argo-rollouts status rollout/education-platform -n education-platform --watch
  kubectl-argo-rollouts promote rollout/education-platform -n education-platform
  kubectl-argo-rollouts abort rollout/education-platform -n education-platform
  kubectl-argo-rollouts rollback education-platform --to-revision=<N> -n education-platform
  ```

## Secrets 一览（GitHub Actions）
- `VERCEL_TOKEN`、`VERCEL_ORG_ID`、`VERCEL_PROJECT_ID`
- `KUBE_CONFIG`
- 镜像仓库登录：
  - GHCR：`REGISTRY=ghcr.io`、`REGISTRY_USERNAME`、`REGISTRY_PASSWORD`
  - DockerHub：`REGISTRY=docker.io`、`REGISTRY_USERNAME`、`REGISTRY_PASSWORD`

## 生产镜像与健康探针
- Dockerfile 已使用 Node 20 运行时并优化健康检查（`HEALTHCHECK`）
- `deploy/k8s/base/deployment.yaml` 中定义了 `readinessProbe` 与 `livenessProbe`

## 开发模式
- 使用 `next dev --turbo`（Turbopack）提升开发体验并绕过 Webpack 运行时异常

## 故障与回滚
- 滚动升级：
  ```bash
  kubectl rollout undo deployment/education-platform -n education-platform
  ```
- 蓝绿发布：将 Service `selector.version` 切回上一个版本（`blue|green`）
- 金丝雀发布：将 `canary-weight` 调为 `0` 或删除 `canary ingress`
- Argo Rollouts：`abort` 或 `rollback` 指定修订版本
