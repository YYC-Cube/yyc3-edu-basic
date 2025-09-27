# API接口总览

## 学科辅导

- POST /api/edu-qa 智能学科问答
- POST /api/mentor 导师建议

## 多模态交互

- POST /api/voice/dialog 语音识别与对话
- POST /api/gesture/action 手势识别与操作
- POST /api/gaze/nav 眼神交互导航

## 数据与分析

- POST /api/data/collect 多源数据采集
- POST /api/data/analyze 数据分析任务
- GET /api/data/visualize 可视化数据获取

## 健康与社交

- POST /api/health-data 健康数据采集与分析
- POST /api/social-graph 社交关系网络

## 插件与扩展

- GET /api/plugins 插件列表
- POST /api/plugins/install 插件安装

## 安全与隐私

- GET /api/permission/check 权限校验
- POST /api/audit/log 审计日志记录
- GET /api/privacy 隐私政策获取
