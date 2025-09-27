# 插件开发SDK模板说明

## 目录结构

- plugin-sdk.js：插件生命周期接口实现
- permission.js：插件权限管理代码
- error-codes.md：错误码文档样例

## 快速开始

```js
const PluginBase = require('./plugin-sdk');
const PermissionManager = require('./permission');

class MyPlugin extends PluginBase {
  async init() {
    // 初始化逻辑
  }
  async run(params) {
    // 运行逻辑
  }
  async destroy() {
    // 销毁逻辑
  }
}

const pm = new PermissionManager();
pm.requestPermission('MyPlugin', 'camera');

## 错误处理建议
所有插件方法建议使用 try/catch 并返回标准错误码。
```

## 错误处理建议

所有插件方法建议使用 try/catch 并返回标准错误码。
