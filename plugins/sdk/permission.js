// 插件权限管理代码示例
class PermissionManager {
  constructor() {
    this.permissions = {};
  }
  requestPermission(pluginName, permission) {
    // 申请权限，实际应接入主系统审核
    if (!this.permissions[pluginName]) {
      this.permissions[pluginName] = [];
    }
    if (!this.permissions[pluginName].includes(permission)) {
      this.permissions[pluginName].push(permission);
    }
    // 返回权限申请结果
    return { granted: true, permission };
  }
  checkPermission(pluginName, permission) {
    return this.permissions[pluginName]?.includes(permission) || false;
  }
}

module.exports = PermissionManager;
