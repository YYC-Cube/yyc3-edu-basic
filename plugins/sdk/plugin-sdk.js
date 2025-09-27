// 插件开发SDK模板
class PluginBase {
  constructor(context) {
    this.context = context;
  }
  async init() {
    // 插件初始化逻辑
    throw new Error('init() 未实现');
  }
  async run(params) {
    // 插件运行逻辑
    throw new Error('run() 未实现');
  }
  async destroy() {
    // 插件销毁逻辑
    throw new Error('destroy() 未实现');
  }
}

module.exports = PluginBase;
