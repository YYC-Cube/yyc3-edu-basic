# Argo Rollouts 集成说明

本目录提供基于 Argo Rollouts 的金丝雀发布方案，支持分阶段权重、自动指标门控与一键 Promote/Abort。

## 前置依赖
- 已安装 NGINX Ingress Controller，并创建基础 Ingress：`deploy/k8s/base/ingress.yaml`
- 集群具有 Prometheus（示例使用 `prometheus-server.monitoring.svc.cluster.local`，请按需修改地址与标签）
- 命名空间：`education-platform`
- 稳定与金丝雀服务：
  - 稳定：`education-platform-svc`（来自 `deploy/k8s/base/service.yaml`）
  - 金丝雀：`education-platform-canary-svc`（来自 `deploy/k8s/canary/service.yaml`）

## 资源说明
- `rollout.yaml`：将 Deployment 替换为 Rollout，使用 `canary` 策略，权重序列 `5%→25%→50%→100%`，每一步暂停并执行分析。
- `analysis-template.yaml`：基于 Prometheus 的 `http-success-rate` 指标门控，默认成功阈值 `>= 95%`，失败阈值 `< 90%`。

## 控制器安装
工作流会自动安装控制器：
```bash
kubectl apply -f https://github.com/argoproj/argo-rollouts/releases/latest/download/install.yaml
```

## 发布工作流
- GitHub Actions：`.github/workflows/argo-rollouts.yml`
- 手动触发（`workflow_dispatch`）并输入：
  - `image`：镜像地址（例如 `ghcr.io/owner/repo:tag`）
  - `host`：Ingress 域名（例如 `app.example.com`）
  - `promote`：是否在分析通过后自动全量切流（默认 `false`）

## 常用命令
```bash
# 查看状态
kubectl-argo-rollouts get rollout education-platform -n education-platform
kubectl-argo-rollouts status rollout/education-platform -n education-platform --watch

# 手动推进到下一步
kubectl-argo-rollouts promote rollout/education-platform -n education-platform

# 中止回滚到稳定版本
kubectl-argo-rollouts abort rollout/education-platform -n education-platform

# 查看历史并回滚指定版本
kubectl-argo-rollouts rollout history education-platform -n education-platform
kubectl-argo-rollouts rollback education-platform --to-revision=<N> -n education-platform
```

## 注意事项与建议
- Prometheus 指标标签需与实际采集对齐（`job="education-platform"` 为示例），可改为基于 Ingress、Service、Pods 的更细标签。
- 若暂时没有 Prometheus，可切换到基于 `Web` Provider 的健康检查，或在分析阶段仅做暂停+人工观察。
- `stableIngress` 由 Argo Rollouts自动创建/管理金丝雀 Ingress，不需要手动维护 `ingress-canary.yaml`。
- 在生产中建议配合告警系统与灰度权重自动化（例如通过外部 Gate 控制器或自研指标门控脚本）。
