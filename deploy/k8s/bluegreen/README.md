# Blue-Green 部署使用指南

本目录提供 Blue-Green 策略的两套 Deployment（blue/green）与一个 Service。Service 通过 selector（version: blue|green）决定将流量路由到哪一套版本。

## 组件
- deployment-blue.yaml：标签 `version: blue`
- deployment-green.yaml：标签 `version: green`
- service.yaml：默认选择 `version: blue`

## 切换流量
将流量从 blue 切换到 green：

```bash
kubectl patch service education-platform-svc -n education-platform \
  --type='merge' -p '{"spec":{"selector":{"app":"education-platform","version":"green"}}}'
```

回滚到 blue：

```bash
kubectl patch service education-platform-svc -n education-platform \
  --type='merge' -p '{"spec":{"selector":{"app":"education-platform","version":"blue"}}}'
```

## 备注
- 两套 Deployment 均可预热，确保 ReadinessProbe 就绪后再切换。
- 可在 CI 中将 `BLUE_TARGET` 输入设为 `blue|green`，自动执行上述 patch。
- 若使用 Ingress 控制器并需要分阶段流量，建议改用 `deploy/k8s/canary` 目录配合 NGINX Ingress canary 注解实现权重分流。
