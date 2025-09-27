"use client"

import { useState, useEffect, useCallback } from "react"
import {
  LOCAL_MODEL_PROVIDERS,
  checkModelAvailability,
  fetchAvailableModels,
  sendMessageToLocalModel,
  type LocalModel,
  type ModelProvider,
} from "@/lib/local-models"

export function useLocalModels() {
  const [localModels, setLocalModels] = useState<LocalModel[]>([])
  const [availableProviders, setAvailableProviders] = useState<ModelProvider[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [lastChecked, setLastChecked] = useState<Date | null>(null)

  // 检查可用的模型提供商
  const checkProviders = useCallback(async () => {
    setIsLoading(true)
    const available: ModelProvider[] = []
    const allModels: LocalModel[] = []

    for (const provider of LOCAL_MODEL_PROVIDERS) {
      try {
        const isAvailable = await checkModelAvailability(provider)
        if (isAvailable) {
          const models = await fetchAvailableModels(provider)
          available.push({ ...provider, models })
          allModels.push(...models)
        }
      } catch (error) {
        console.warn(`检查提供商 ${provider.name} 时出错:`, error)
      }
    }

    setAvailableProviders(available)
    setLocalModels(allModels)
    setLastChecked(new Date())
    setIsLoading(false)
  }, [])

  // 发送消息到本地模型
  const sendMessage = useCallback(
    async (model: LocalModel, messages: Array<{ role: string; content: string }>): Promise<string> => {
      if (!model.isAvailable) {
        throw new Error("模型不可用")
      }

      return await sendMessageToLocalModel(model, messages)
    },
    [],
  )

  // 获取模型状态信息
  const getModelStatus = useCallback(() => {
    return {
      totalModels: localModels.length,
      availableProviders: availableProviders.length,
      lastChecked,
      isLoading,
    }
  }, [localModels.length, availableProviders.length, lastChecked, isLoading])

  // 根据能力筛选模型
  const getModelsByCapability = useCallback(
    (capability: string) => {
      return localModels.filter((model) =>
        model.capabilities.some((cap) => cap.toLowerCase().includes(capability.toLowerCase())),
      )
    },
    [localModels],
  )

  // 获取推荐模型
  const getRecommendedModels = useCallback(() => {
    // 优先推荐中文优化的模型
    const chineseModels = localModels.filter(
      (model) =>
        model.name.toLowerCase().includes("qwen") ||
        model.name.toLowerCase().includes("chatglm") ||
        model.capabilities.includes("中文对话"),
    )

    if (chineseModels.length > 0) {
      return chineseModels.slice(0, 3)
    }

    // 如果没有中文模型，返回通用模型
    return localModels.slice(0, 3)
  }, [localModels])

  // 初始化时检查一次
  useEffect(() => {
    checkProviders()
  }, [checkProviders])

  // 每5分钟自动检查一次
  useEffect(() => {
    const interval = setInterval(
      () => {
        checkProviders()
      },
      5 * 60 * 1000,
    ) // 5分钟

    return () => clearInterval(interval)
  }, [checkProviders])

  return {
    localModels,
    availableProviders,
    isLoading,
    lastChecked,
    checkProviders,
    sendMessage,
    getModelStatus,
    getModelsByCapability,
    getRecommendedModels,
  }
}

// 模型选择Hook
export function useModelSelection() {
  const { localModels, getRecommendedModels } = useLocalModels()
  const [selectedModel, setSelectedModel] = useState<LocalModel | null>(null)

  // 自动选择推荐模型
  useEffect(() => {
    if (!selectedModel && localModels.length > 0) {
      const recommended = getRecommendedModels()
      if (recommended.length > 0) {
        setSelectedModel(recommended[0])
      }
    }
  }, [localModels, selectedModel, getRecommendedModels])

  const selectModel = useCallback((model: LocalModel) => {
    setSelectedModel(model)
  }, [])

  const clearSelection = useCallback(() => {
    setSelectedModel(null)
  }, [])

  return {
    selectedModel,
    selectModel,
    clearSelection,
    hasSelection: selectedModel !== null,
  }
}
