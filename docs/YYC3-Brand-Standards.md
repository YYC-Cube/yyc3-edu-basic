# YYC³全维度品牌生态系统 - 标准化定义文档

## 一、品牌基础定义

### 1. 品牌核心标识

- **英文全称**：YanYuCloudCube
- **英文缩写**：YYC³（"³" 为品牌专属符号，代表 "Cube / 立方"）
- **中文全称**：言语云立方
- **中文简称**：言语云³

### 2. 核心元素释义（中英文对应）

| 品牌元素      | 英文对应               | 核心释义                                                                                                    | 品牌属性 |
| ------------- | ---------------------- | ----------------------------------------------------------------------------------------------------------- | -------- |
| 言语（YanYu） | YanYu(Speech/Language) | 品牌交互/核心载体，指"以言语驱动服务、以语言连接需求"，覆盖口头表达（Speech）与语言逻辑（Language）双重维度 | 品牌本源 |
| 云（Cloud）   | Cloud                  | 技术基座，指"云端算力支撑、数据安全流转"，适配微软Azure等云端生态，保障服务稳定性                           | 技术载体 |
| 立方（Cube）  | Cube（对应"³"符号）    | 架构特征，指"模块化、全维度、可扩展的技术架构"，支持跨行业场景快速适配                                      | 技术符号 |
| YYC³          | YYC³                   | 品牌专有缩写，无直译意义，作为全球统一识别标识，贯穿所有产品/场景                                           | 品牌符号 |

## 二、核心命名原则

所有产品/社区名称均遵循以下原则，确保品牌认知一致性：

1. **品牌元素不缺失**：中英文名称均以"YYC³ (YanYuCloudCube)"（英文）、"言语云³AI-"（中文）开头，强化品牌辨识度
2. **功能场景精准化**：通过行业专属功能词（如"Medical""Smart City""Retail"）明确产品定位，避免"泛AI"模糊表述
3. **行业版本可区分**：多场景产品通过"Edition（版）""for XX（XX领域）"标注细分场景，适配不同用户需求
4. **中英文调性统一**：英文采用"AI-Powered/AI-Enabled"体现智能属性，中文用"智能"呼应；社区名称英文以"Community/Hub"为后缀，中文以"社/圈/汇/联盟"贴合行业用户习惯

### 命名体系：与品牌元素强绑定

所有命名需体现"言(Y)-语(Y)-云(C)-立方(³)"的核心逻辑，让代码自解释品牌属性。

#### 1. 核心命名规则

| 元素类型  | 命名规范                                 | 示例（以YYC³-Med为例）                                      | 品牌映射意义                   |
| --------- | ---------------------------------------- | ----------------------------------------------------------- | ------------------------------ |
| 类/接口   | 前缀YYC3[子产品缩写]+ PascalCase         | YYC3MedSymptomAnalyzer                                      | 绑定子产品（Med）与功能模块    |
| 方法      | 动词开头 + camelCase，体现"言→语→云"流程 | parseUserInput() → analyzeMedicalEntities() → syncToCloud() | 对应交互层→处理层→云端层的链路 |
| 常量      | 前缀YYC3*[子产品缩写]*+ UPPER_SNAKE_CASE | YYC3_MED_MAX_RETRY=3                                        | 明确子产品域与配置边界         |
| 变量      | 名词/名词短语 + camelCase，避免缩写      | patientSymptomText（而非patSymTxt）                         | 提升医疗等敏感场景的可读性     |
| 文件/目录 | 前缀yyc3-[子产品缩写]-+ kebab-case       | yyc3-med-nlp-processor.ts                                   | 从文件系统层面区分产品域       |

#### 2. 命名禁忌

- 禁止使用与品牌元素冲突的缩写（如"yc""yy"等易混淆组合）
- 禁止在医疗、法律等行业子产品中使用模糊命名（如"data""info"需具体为"patientData""contractInfo"）
- 跨行业通用模块需添加common后缀（如yyc3-common-validator.ts），避免与子产品模块重名

## 三、架构设计

### 3.1 核心层架构

核心层作为品牌"技术基座"，目录划分需体现"通用能力分层"，严格对应"言-语-云-立方"四维架构，且仅包含跨行业复用的基础逻辑：

#### 核心层目录结构与职责

```plaintext
yyc3-core/
├── src/
│   ├── yan/                  # 言(Y)层：通用输入处理基础
│   │   ├── interfaces/       # 输入处理标准接口（如YanInput、YanOutput）
│   │   ├── abstracts/        # 抽象类（如YYC3YanBase，定义输入处理骨架）
│   │   ├── validators/       # 通用输入验证（非空、格式合规等基础校验）
│   │   └── index.ts          # 导出言层公共API
│   │
│   ├── yu/                   # 语(Y)层：通用智能解析基础
│   │   ├── interfaces/       # 解析处理标准接口（如YuInput、YuEntity）
│   │   ├── abstracts/        # 抽象类（如YYC3YuBase，定义实体提取骨架）
│   │   ├── nlp-base/         # 通用NLP工具（基础分词、词性标注等）
│   │   └── index.ts          # 导出语层公共API
│   │
│   ├── cloud/                # 云(C)层：通用云端交互基础
│   │   ├── interfaces/       # 云端交互标准接口（如CloudClient、CloudResponse）
│   │   ├── abstracts/        # 抽象类（如YYC3CloudBase，定义云端连接骨架）
│   │   ├── security/         # 通用安全工具（加密、签名、认证等）
│   │   └── index.ts          # 导出云层公共API
│   │
│   ├── cube/                 # 立方(³)层：模块管理核心
│   │   ├── interfaces/       # 模块管理标准接口（如Module、CubeManager）
│   │   ├── manager/          # 立方管理器（模块注册、加载、组合的核心逻辑）
│   │   ├── lifecycle/        # 模块生命周期管理（初始化、销毁、依赖注入）
│   │   └── index.ts          # 导出立方层公共API
│   │
│   └── common/               # 跨层通用工具（所有核心层和子产品共享）
│       ├── types/            # 通用类型定义（如Result、ErrorType）
│       ├── utils/            # 通用工具函数（日期、字符串、日志等）
│       └── constants/        # 通用常量（如默认超时时间、错误码）
│
├── package.json              # 核心层依赖管理（仅包含通用依赖）
└── tsconfig.json             # 核心层TypeScript配置（统一编译标准）
```

### 3.2 子产品层架构规范

每个子产品严格按照"言-语-云-立方"四层架构组织，确保与核心层对应：

```plaintext
yyc3-[product]/               # 子产品根目录
├── src/
│   ├── yan/                  # 产品专属输入处理层
│   │   ├── [product]-input-processor.ts    # 产品输入处理器
│   │   ├── [product]-validator.ts          # 产品输入验证器
│   │   └── index.ts
│   │
│   ├── yu/                   # 产品专属智能解析层
│   │   ├── [product]-nlp-analyzer.ts       # 产品NLP分析器
│   │   ├── [product]-entity-extractor.ts   # 产品实体提取器
│   │   └── index.ts
│   │
│   ├── cloud/                # 产品专属云端服务层
│   │   ├── [product]-api-client.ts         # 产品API客户端
│   │   ├── [product]-data-sync.ts          # 产品数据同步
│   │   └── index.ts
│   │
│   ├── cube/                 # 产品模块组装层
│   │   ├── [product]-module-manager.ts     # 产品模块管理器
│   │   ├── [product]-workflow.ts           # 产品工作流
│   │   └── index.ts
│   │
│   └── config/               # 产品配置
│       ├── [product]-config.ts             # 产品配置定义
│       └── constants.ts                    # 产品常量
│
└── package.json
```

## 四、API标准化规范

### 4.1 RESTful API命名规范

所有API遵循YYC³品牌命名原则：

```typescript
// API路径格式：/api/yyc3-[product]/[version]/[resource]
// 示例：
GET / api / yyc3 - edu / v1 / students; // 获取学生列表
POST / api / yyc3 - edu / v1 / students; // 创建学生
GET / api / yyc3 - edu / v1 / students / { id }; // 获取指定学生
PUT / api / yyc3 - edu / v1 / students / { id }; // 更新学生信息
DELETE / api / yyc3 - edu / v1 / students / { id }; // 删除学生

// 多模态交互API
POST / api / yyc3 - common / v1 / yan / voice - input; // 语音输入处理
POST / api / yyc3 - common / v1 / yu / text - analysis; // 文本分析
POST / api / yyc3 - common / v1 / cloud / sync - data; // 云端数据同步
POST / api / yyc3 - common / v1 / cube / module - compose; // 模块组合
```

### 4.2 响应格式标准

```typescript
// 标准响应接口
interface YYC3ApiResponse<T = any> {
  success: boolean;
  code: string; // YYC3_[PRODUCT]_[ACTION]_[STATUS]
  message: string;
  data?: T;
  timestamp: string;
  requestId: string;
  version: string; // API版本
}

// 错误响应扩展
interface YYC3ApiErrorResponse extends YYC3ApiResponse {
  error: {
    type: YYC3ErrorType;
    details?: Record<string, any>;
    stack?: string; // 仅开发环境
  };
}

// 错误类型枚举
enum YYC3ErrorType {
  YAN_INPUT_INVALID = "YYC3_YAN_INPUT_INVALID",
  YU_ANALYSIS_FAILED = "YYC3_YU_ANALYSIS_FAILED",
  CLOUD_CONNECTION_ERROR = "YYC3_CLOUD_CONNECTION_ERROR",
  CUBE_MODULE_NOT_FOUND = "YYC3_CUBE_MODULE_NOT_FOUND",
}
```

## 五、配置文件标准

### 5.1 项目配置文件格式

```json
{
  "name": "yyc3-[product]-[edition]",
  "version": "1.0.0",
  "brandId": "YYC3",
  "product": {
    "id": "[product]",
    "name": "YYC³ AI-Powered [Product Name]",
    "edition": "[edition]",
    "domain": "[industry]"
  },
  "architecture": {
    "layers": {
      "yan": {
        "enabled": true,
        "modules": ["input-processor", "validator"]
      },
      "yu": {
        "enabled": true,
        "modules": ["nlp-analyzer", "entity-extractor"]
      },
      "cloud": {
        "enabled": true,
        "modules": ["api-client", "data-sync"]
      },
      "cube": {
        "enabled": true,
        "modules": ["module-manager", "workflow"]
      }
    }
  },
  "features": {
    "multimodal": {
      "voice": true,
      "video": false,
      "gesture": false,
      "emotion": true
    },
    "ai": {
      "level": "intermediate",
      "providers": ["openai", "azure"]
    }
  },
  "branding": {
    "logo": "./assets/yyc3-logo.png",
    "colors": {
      "primary": "#0066CC",
      "secondary": "#FF6B35"
    },
    "fonts": {
      "primary": "Inter",
      "secondary": "Noto Sans SC"
    }
  }
}
```

## 六、开发规范

### 6.1 TypeScript接口定义规范

```typescript
// 基础接口命名：YYC3[Layer][Purpose]
interface YYC3YanInput {
  content: string;
  type: YYC3InputType;
  timestamp: Date;
  metadata?: Record<string, any>;
}

interface YYC3YuAnalysisResult {
  entities: YYC3Entity[];
  sentiment: YYC3Sentiment;
  intent: YYC3Intent;
  confidence: number;
}

interface YYC3CloudResponse<T = any> {
  data: T;
  status: YYC3CloudStatus;
  headers: Record<string, string>;
}

interface YYC3CubeModule {
  id: string;
  name: string;
  version: string;
  dependencies: string[];
  lifecycle: YYC3ModuleLifecycle;
}

// 枚举类型命名：YYC3[Context][Type]
enum YYC3InputType {
  VOICE = "voice",
  TEXT = "text",
  IMAGE = "image",
  VIDEO = "video",
}

enum YYC3CloudStatus {
  SUCCESS = "success",
  ERROR = "error",
  PENDING = "pending",
}
```

### 6.2 类和组件命名规范

```typescript
// React组件：YYC3[Product][Component]
export const YYC3EduSmartTutor: React.FC<YYC3EduSmartTutorProps> = () => {
  // 组件实现
};

// 服务类：YYC3[Product][Service]
export class YYC3EduLearningService {
  private yyc3EduApiClient: YYC3EduApiClient;

  async analyzeStudentProgress(
    studentId: string,
  ): Promise<YYC3EduProgressResult> {
    // 服务实现
  }
}

// 工具类：YYC3[Layer][Utility]
export class YYC3YanInputValidator {
  static validateVoiceInput(input: YYC3YanVoiceInput): YYC3ValidationResult {
    // 验证实现
  }
}
```

## 七、文档规范

### 7.1 README模板

每个子产品的README.md需包含以下标准化内容：

```markdown
# YYC³ AI-Powered [Product Name] [Edition]

> 基于YYC³（言语云立方）架构的[行业]智能[功能]平台

## 🎯 产品定位

[产品简介，体现YYC³品牌特色]

## 🏗️ 架构设计

### 四层架构

- **言(Yan)层**：[产品专属输入处理]
- **语(Yu)层**：[产品专属智能解析]
- **云(Cloud)层**：[产品专属云端服务]
- **立方(Cube)层**：[产品专属模块组装]

## 🚀 快速开始

\`\`\`bash
npx create-yyc3-app my-[product]-app --template=[product]-[edition]
\`\`\`

## 📦 模块说明

[按四层架构组织的模块说明]

## 🔗 相关资源

- [YYC³官网](https://yyc3.com)
- [YYC³开发者社区](https://community.yyc3.com)
- [产品文档](https://docs.yyc3.com/[product])
```

## 八、部署与发布规范

### 8.1 版本号规范

采用语义化版本控制，格式：`[major].[minor].[patch]-[product].[edition]`

```bash
# 示例
1.0.0-edu.k12        # 教育K12版本
1.2.3-med.hospital    # 医疗医院版本
2.0.0-retail.ecommerce # 零售电商版本
```

### 8.2 Docker镜像命名

```bash
# 格式：registry/yyc3-[product]-[edition]:[version]
docker.io/yyc3/yyc3-edu-k12:1.0.0-edu.k12
docker.io/yyc3/yyc3-med-hospital:1.2.3-med.hospital
```

这份标准化定义文档将作为YYC³多维度可复用平台模板的核心指导原则，确保所有产品和组件都遵循统一的品牌标准和技术规范。
