export interface LocalModel {
  id: string
  name: string
  description: string
  provider: "ollama" | "lm-studio" | "text-generation-webui" | "koboldcpp"
  endpoint: string
  isAvailable: boolean
  modelSize?: string
  capabilities: string[]
}

export interface ModelProvider {
  name: string
  endpoint: string
  checkEndpoint: string
  models: LocalModel[]
}

export const LOCAL_MODEL_PROVIDERS: ModelProvider[] = [
  {
    name: "Ollama",
    endpoint: "http://localhost:11434",
    checkEndpoint: "http://localhost:11434/api/tags",
    models: [],
  },
  {
    name: "LM Studio",
    endpoint: "http://localhost:1234",
    checkEndpoint: "http://localhost:1234/v1/models",
    models: [],
  },
  {
    name: "Text Generation WebUI",
    endpoint: "http://localhost:5000",
    checkEndpoint: "http://localhost:5000/api/v1/models",
    models: [],
  },
  {
    name: "KoboldCpp",
    endpoint: "http://localhost:5001",
    checkEndpoint: "http://localhost:5001/api/v1/models",
    models: [],
  },
]

export const POPULAR_LOCAL_MODELS = [
  {
    id: "llama2-7b",
    name: "Llama 2 7B",
    description: "高质量的开源大语言模型",
    modelSize: "7B",
    capabilities: ["文本生成", "对话", "代码", "翻译"],
  },
  {
    id: "llama2-13b",
    name: "Llama 2 13B",
    description: "更强大的Llama 2模型",
    modelSize: "13B",
    capabilities: ["文本生成", "对话", "代码", "翻译", "推理"],
  },
  {
    id: "codellama-7b",
    name: "Code Llama 7B",
    description: "专门用于代码生成的模型",
    modelSize: "7B",
    capabilities: ["代码生成", "代码解释", "调试", "重构"],
  },
  {
    id: "mistral-7b",
    name: "Mistral 7B",
    description: "高效的开源模型",
    modelSize: "7B",
    capabilities: ["文本生成", "对话", "推理", "多语言"],
  },
  {
    id: "qwen-7b",
    name: "Qwen 7B",
    description: "阿里云开源的中文优化模型",
    modelSize: "7B",
    capabilities: ["中文对话", "文本生成", "代码", "数学"],
  },
  {
    id: "chatglm3-6b",
    name: "ChatGLM3 6B",
    description: "清华开源的中文对话模型",
    modelSize: "6B",
    capabilities: ["中文对话", "文本生成", "代码", "工具调用"],
  },
]

export async function checkModelAvailability(provider: ModelProvider): Promise<boolean> {
  try {
    const response = await fetch(provider.checkEndpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(5000), // 5秒超时
    })
    return response.ok
  } catch (error) {
    console.warn(`无法连接到 ${provider.name}:`, error)
    return false
  }
}

export async function fetchAvailableModels(provider: ModelProvider): Promise<LocalModel[]> {
  try {
    const response = await fetch(provider.checkEndpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(10000),
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const data = await response.json()

    // 根据不同提供商解析模型列表
    let models: LocalModel[] = []

    if (provider.name === "Ollama") {
      models =
        data.models?.map((model: any) => ({
          id: model.name,
          name: model.name,
          description: `Ollama模型 - ${model.name}`,
          provider: "ollama" as const,
          endpoint: provider.endpoint,
          isAvailable: true,
          modelSize: model.size || "Unknown",
          capabilities: ["文本生成", "对话"],
        })) || []
    } else if (provider.name === "LM Studio") {
      models =
        data.data?.map((model: any) => ({
          id: model.id,
          name: model.id,
          description: `LM Studio模型 - ${model.id}`,
          provider: "lm-studio" as const,
          endpoint: provider.endpoint,
          isAvailable: true,
          capabilities: ["文本生成", "对话"],
        })) || []
    }

    return models
  } catch (error) {
    console.error(`获取 ${provider.name} 模型列表失败:`, error)
    return []
  }
}

export async function sendMessageToLocalModel(
  model: LocalModel,
  messages: Array<{ role: string; content: string }>,
): Promise<string> {
  try {
    let endpoint = ""
    let requestBody: any = {}

    if (model.provider === "ollama") {
      endpoint = `${model.endpoint}/api/chat`
      requestBody = {
        model: model.id,
        messages: messages,
        stream: false,
      }
    } else if (model.provider === "lm-studio") {
      endpoint = `${model.endpoint}/v1/chat/completions`
      requestBody = {
        model: model.id,
        messages: messages,
        temperature: 0.7,
        max_tokens: 2000,
      }
    } else {
      throw new Error(`不支持的模型提供商: ${model.provider}`)
    }

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
      signal: AbortSignal.timeout(30000), // 30秒超时
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()

    // 根据不同提供商解析响应
    if (model.provider === "ollama") {
      return data.message?.content || "模型响应为空"
    } else if (model.provider === "lm-studio") {
      return data.choices?.[0]?.message?.content || "模型响应为空"
    }

    return "未知的响应格式"
  } catch (error) {
    console.error("本地模型调用失败:", error)
    throw new Error(`模型调用失败: ${error instanceof Error ? error.message : "未知错误"}`)
  }
}
