// TypeScript 类型声明（可选）
export interface PluginBase {
  context: any;
  init(): Promise<void>;
  run(params: any): Promise<any>;
  destroy(): Promise<void>;
}

export interface PermissionManager {
  permissions: Record<string, string[]>;
  requestPermission(pluginName: string, permission: string): { granted: boolean, permission: string };
  checkPermission(pluginName: string, permission: string): boolean;
}
