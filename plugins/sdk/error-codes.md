# 插件错误码文档样例

| 错误码              | 说明           |
| ------------------- | -------------- |
| PLUGIN_INIT_FAIL    | 插件初始化失败 |
| PLUGIN_RUN_FAIL     | 插件运行失败   |
| PLUGIN_DESTROY_FAIL | 插件销毁失败   |
| PERMISSION_DENIED   | 权限申请被拒绝 |
| DATA_EXCHANGE_ERR   | 数据交换异常   |
| UNKNOWN_ERROR       | 未知错误       |

> 所有错误码建议配合 message 字段与 details 字段返回，便于前后端协同处理。
