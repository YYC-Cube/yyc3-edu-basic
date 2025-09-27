"use client"

// 智能提示词Hook

import { useState } from "react"
import { systemArchitecture, UserRole, type FunctionModule } from "../config/system-architecture"
import { PROMPT_TEMPLATES } from "../config/prompt-templates"
import { useAppStore } from '@/src/store/app-store';
import { ModuleId } from '@/src/core/module-system';
import { YYC_CORE_PERSONA, CONTEXTUAL_PROMPT_TEMPLATES } from './prompt-templates';

interface SmartSuggestion {
  title: string
  description: string
  icon: string
  action: string
}

// 模拟获取上下文信息的函数
const getContextualData = (activeModule: ModuleId) => {
  switch (activeModule) {
    case ModuleId.EDUCATION:
      return { module_name: '教育中心', topic: 'React Hooks', related_concept: '状态管理' };
    case ModuleId.VISUAL_EDITOR:
      return { module_name: '可视化编辑器' };
    default:
      return { module_name: '当前模块' };
  }
};

export function useSmartPrompt(userRole: UserRole = UserRole.GENERAL) {
  const [suggestions, setSuggestions] = useState<SmartSuggestion[]>([])
  const [matchedModule, setMatchedModule] = useState<FunctionModule | null>(null)
  const { activeModule } = useAppStore();

  // 智能分析用户输入
  const analyzeInput = (userInput: string) => {
    // 匹配最佳功能模块
    const module = systemArchitecture.matchModule(userInput, userRole)
    setMatchedModule(module)

    // 获取智能建议
    const smartSuggestions = systemArchitecture.getSuggestions(userInput, userRole)
    setSuggestions(smartSuggestions)

    return {
      module,
      suggestions: smartSuggestions,
      prompt: generateSmartPrompt(userInput, module),
    }
  }

  // 生成智能提示词
  const generateSmartPrompt = (userInput: string, module: FunctionModule | null): string => {
    if (!module) {
      return PROMPT_TEMPLATES.SYSTEM.WELCOME
    }

    // 根据模块类型返回对应提示词
    const modulePrompt = module.prompts.find((p) =>
      p.keywords?.some((keyword) => userInput.toLowerCase().includes(keyword.toLowerCase())),
    )

    return modulePrompt?.template || module.description
  }

  // 获取功能帮助
  const getFunctionHelp = (functionId: string): string => {
    const module = systemArchitecture.modules.find((m) => m.id === functionId)
    return module?.prompts.find((p) => p.id.includes("help"))?.template || PROMPT_TEMPLATES.SYSTEM.WELCOME
  }

  // 自定义回复生成
  const generateReply = (userInput: string) => {
    let templateConfig;
    const contextData = getContextualData(activeModule);

    // 1. 根据激活的模块选择模板
    switch (activeModule) {
      case ModuleId.EDUCATION:
      case ModuleId.KNOWLEDGE:
        templateConfig = CONTEXTUAL_PROMPT_TEMPLATES.learning_companion;
        break;
      case ModuleId.VISUAL_EDITOR:
      case ModuleId.EMOTION:
        templateConfig = CONTEXTUAL_PROMPT_TEMPLATES.creative_assistant;
        break;
      default:
        // 如果没有匹配的模块或初次进入，使用通用欢迎语
        templateConfig = CONTEXTUAL_PROMPT_TEMPLATES.greeting;
    }
    
    // 如果是无法回答的问题，使用 fallback 模板
    if (userInput.includes('不知道') || userInput.includes('无法回答')) {
        templateConfig = CONTEXTUAL_PROMPT_TEMPLATES.fallback;
    }

    // 2. 填充模板变量
    let populatedTemplate = templateConfig.template;
    for (const key in contextData) {
      populatedTemplate = populatedTemplate.replace(
        new RegExp(`{{${key}}}`, 'g'),
        contextData[key as keyof typeof contextData]
      );
    }
    
    // 填充问候语等其他变量
    populatedTemplate = populatedTemplate.replace('{{greeting_word}}', new Date().getHours() < 12 ? '上午好。' : '下午好。');

    // 3. 组合最终的系统提示
    const finalSystemPrompt = `${YYC_CORE_PERSONA}\n\n--- 当前任务 ---\n${populatedTemplate}`;
    
    return finalSystemPrompt;
  };

  return {
    analyzeInput,
    generateSmartPrompt,
    getFunctionHelp,
    generateReply,
    suggestions,
    matchedModule,
  }
}
