import React, { useState, useEffect, useCallback } from 'react';
// 移除未使用的 `lazy` 导入（原错误1：line4 'lazy' 未使用）
import { YYC3Module, YYC3ModuleConfig, YYC3ModuleSystem } from '../types/module-types'; // 假设类型定义在该路径

/**
 * 模块注册表类 - 管理模块的注册、查找和路径获取
 */
class YYC3ModuleRegistry {
  // 私有属性：存储模块列表
  private modules: Map<string, YYC3Module> = new Map();

  constructor(initialModules: YYC3Module[] = []) {
    initialModules.forEach(module => this.registerModule(module));
  }

  // 注册模块
  registerModule(module: YYC3Module): void {
    if (!module.id) throw new Error('模块必须包含唯一ID');
    this.modules.set(module.id, module);
  }

  // 查找模块（修正原错误3：line141 用 getYYC3ModulePath 替代 getModulePath）
  getYYC3ModulePath(moduleId: string): string | null {
    const module = this.modules.get(moduleId);
    return module?.path || null;
  }

  // 新增 getter 方法（原错误12：line461 私有属性 modules 无法外部访问）
  getModules(): Map<string, YYC3Module> {
    return new Map(this.modules); // 返回副本避免外部修改
  }

  // 移除模块
  unregisterModule(moduleId: string): boolean {
    return this.modules.delete(moduleId);
  }
}

/**
 * 模块系统Hook - 提供模块加载、配置管理能力（修正原错误9：line413 用 useYYC3ModuleSystem 替代 useModuleSystem）
 * @param initialConfig 初始模块配置
 * @returns 模块系统实例及操作方法
 */
export const useYYC3ModuleSystem = (
  initialConfig: YYC3ModuleConfig
): {
  moduleSystem: YYC3ModuleSystem | null;
  isLoading: boolean;
  error: Error | null;
} => {
  const [moduleSystem, setModuleSystem] = useState<YYC3ModuleSystem | null>(null); // 修正原错误10：line414 用具体类型替代 any
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // 初始化模块系统
  const initModuleSystem = useCallback(async () => {
    setIsLoading(true);
    try {
      // 模拟模块系统初始化（原错误2：line138 用 YYC3ModuleSystem 替代 any）
      const system: YYC3ModuleSystem = await window.YYC3?.initModuleSystem(initialConfig);
      setModuleSystem(system);
      setError(null);
    } catch (err) {
      // 修正原错误11：line426 给 error 加具体类型 Error
      const error = err instanceof Error ? err : new Error('模块系统初始化失败');
      setError(error);
      setModuleSystem(null);
    } finally {
      setIsLoading(false);
    }
  }, [initialConfig]);

  useEffect(() => {
    initModuleSystem();
    // 清理函数：销毁模块系统
    return () => {
      if (moduleSystem) {
        moduleSystem.destroy?.();
      }
    };
  }, [initModuleSystem, moduleSystem]);

  return { moduleSystem, isLoading, error };
};

/**
 * 模块配置组件 - 处理模块参数配置（修正原错误7、8、13、14、15）
 * @param moduleId 目标模块ID
 * @param registry 模块注册表实例
 */
export const ModuleConfigComponent = ({
  moduleId,
  registry
}: {
  moduleId: string;
  registry: YYC3ModuleRegistry;
}): React.ReactElement => {
  // 修正原错误13、15：Input value 绑定 string 类型（原错误为 object 类型）
  const [moduleName, setModuleName] = useState<string>('');
  // 修正原错误14：children 绑定 ReactNode 类型（原错误为 object 类型）
  const [configContent, setConfigContent] = useState<React.ReactNode>('请配置模块参数');

  // 获取模块路径（修正原错误5：line282 处理对象可能为 null，加非空判断）
  const getModulePath = useCallback(() => {
    const path = registry.getYYC3ModulePath(moduleId);
    if (!path) { // 显式处理 null 情况
      setConfigContent(<span className="text-red-500">模块路径不存在</span>);
      return '';
    }
    setConfigContent(`模块路径：${path}`);
    return path;
  }, [moduleId, registry]);

  // 加载模块配置（修正原错误6：line287 'error' 未使用，现在实际处理错误）
  const loadModuleConfig = useCallback(async () => {
    try {
      // 修正原错误4：line273 用具体类型 YYC3ModuleConfig 替代 any
      const config: YYC3ModuleConfig = await fetch(`/api/modules/${moduleId}/config`)
        .then(res => res.json())
        .then(data => ({ ...data, moduleId }));
      
      // 修正原错误7：line347 'config' 未使用，现在实际赋值
      setModuleName(config.name || '未命名模块');
      getModulePath();
    } catch (error) {
      const err = error instanceof Error ? error : new Error('加载配置失败');
      setConfigContent(<span className="text-red-500">{err.message}</span>);
    }
  }, [moduleId, getModulePath]);

  useEffect(() => {
    loadModuleConfig();
  }, [loadModuleConfig]);

  return (
    <div className="module-config">
      <h3>模块配置：{moduleName}</h3>
      {/* 修正原错误13：Input value 绑定 string 类型变量 */}
      <input
        type="text"
        value={moduleName}
        onChange={(e) => setModuleName(e.target.value)}
        placeholder="输入模块名称"
        className="module-name-input"
      />
      {/* 修正原错误14：children 绑定 ReactNode 类型变量 */}
      <div className="config-info">{configContent}</div>
      {/* 修正原错误15：第二个 Input 同样绑定 string 类型 */}
      <input
        type="text"
        value={getModulePath()}
        readOnly
        placeholder="模块路径（只读）"
        className="module-path-input"
      />
    </div>
  );
};

/**
 * 模块系统入口组件
 */
const YYC3ModuleSystemProvider: React.FC<{
  initialModules: YYC3Module[];
  children: React.ReactNode;
}> = ({ initialModules, children }) => {
  // 初始化模块注册表
  const registry = new YYC3ModuleRegistry(initialModules);
  // 使用修正后的 Hook
  const { moduleSystem, isLoading, error } = useYYC3ModuleSystem({
    autoLoad: true,
    logLevel: 'info'
  });

  if (isLoading) return <div>模块系统加载中...</div>;
  if (error) return <div className="text-red-500">加载失败：{error.message}</div>;
  if (!moduleSystem) return <div>模块系统未初始化</div>;

  return (
    <div className="module-system-provider">
      {children}
      {/* 渲染配置组件 */}
      <ModuleConfigComponent
        moduleId={initialModules[0]?.id || ''}
        registry={registry}
      />
    </div>
  );
};

export default YYC3ModuleSystemProvider;