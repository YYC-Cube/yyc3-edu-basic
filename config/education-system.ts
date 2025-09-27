export interface Subject {
  id: string
  name: string
  description: string
  icon: string
  color: string
  topics: Topic[]
}

export interface Topic {
  id: string
  name: string
  difficulty: "basic" | "intermediate" | "advanced" | "competition"
  description: string
  keywords: string[]
}

export interface LearningProgress {
  subjectId: string
  topicId: string
  score: number
  completedAt: Date
  timeSpent: number
}

export const EDUCATION_SUBJECTS: Subject[] = [
  {
    id: "chinese",
    name: "语文",
    description: "古诗词、作文、阅读理解、汉字书写",
    icon: "📚",
    color: "#ef4444",
    topics: [
      {
        id: "poetry",
        name: "古诗词赏析",
        difficulty: "intermediate",
        description: "唐诗宋词、诗词鉴赏、背诵默写",
        keywords: ["古诗", "诗词", "唐诗", "宋词", "鉴赏", "背诵"],
      },
      {
        id: "composition",
        name: "作文写作",
        difficulty: "intermediate",
        description: "记叙文、议论文、说明文写作技巧",
        keywords: ["作文", "写作", "记叙文", "议论文", "说明文"],
      },
      {
        id: "reading",
        name: "阅读理解",
        difficulty: "basic",
        description: "文章理解、主旨概括、细节分析",
        keywords: ["阅读", "理解", "概括", "分析", "文章"],
      },
    ],
  },
  {
    id: "math",
    name: "数学",
    description: "基础运算、几何图形、代数方程、数学建模",
    icon: "🔢",
    color: "#3b82f6",
    topics: [
      {
        id: "arithmetic",
        name: "基础运算",
        difficulty: "basic",
        description: "加减乘除、分数小数、百分比计算",
        keywords: ["运算", "加减", "乘除", "分数", "小数", "百分比"],
      },
      {
        id: "geometry",
        name: "几何图形",
        difficulty: "intermediate",
        description: "平面几何、立体几何、图形性质",
        keywords: ["几何", "图形", "平面", "立体", "性质", "面积", "体积"],
      },
      {
        id: "algebra",
        name: "代数方程",
        difficulty: "advanced",
        description: "一元方程、二元方程、不等式",
        keywords: ["代数", "方程", "不等式", "解方程", "未知数"],
      },
    ],
  },
  {
    id: "math-competition",
    name: "奥数竞赛",
    description: "数学竞赛专项训练，数论、几何、代数、组合",
    icon: "🏆",
    color: "#f59e0b",
    topics: [
      {
        id: "number-theory",
        name: "数论专题",
        difficulty: "competition",
        description: "质数、最大公约数、同余理论、不定方程",
        keywords: ["数论", "质数", "公约数", "同余", "不定方程", "整数"],
      },
      {
        id: "competition-geometry",
        name: "竞赛几何",
        difficulty: "competition",
        description: "几何证明、几何变换、三角形性质",
        keywords: ["几何证明", "变换", "三角形", "圆", "相似", "全等"],
      },
      {
        id: "combinatorics",
        name: "组合数学",
        difficulty: "competition",
        description: "排列组合、概率统计、图论基础",
        keywords: ["组合", "排列", "概率", "统计", "图论", "递推"],
      },
    ],
  },
  {
    id: "english",
    name: "英语",
    description: "词汇积累、语法学习、听说训练、文化理解",
    icon: "🌍",
    color: "#10b981",
    topics: [
      {
        id: "vocabulary",
        name: "词汇积累",
        difficulty: "basic",
        description: "单词记忆、词汇扩展、词根词缀",
        keywords: ["单词", "词汇", "记忆", "词根", "词缀", "扩展"],
      },
      {
        id: "grammar",
        name: "语法学习",
        difficulty: "intermediate",
        description: "时态语态、句型结构、语法规则",
        keywords: ["语法", "时态", "语态", "句型", "结构", "规则"],
      },
      {
        id: "listening-speaking",
        name: "听说训练",
        difficulty: "intermediate",
        description: "听力理解、口语表达、发音练习",
        keywords: ["听力", "口语", "发音", "表达", "对话", "交流"],
      },
    ],
  },
  {
    id: "science",
    name: "科学",
    description: "物理化学生物、科学实验、创新思维",
    icon: "🔬",
    color: "#8b5cf6",
    topics: [
      {
        id: "physics",
        name: "物理基础",
        difficulty: "intermediate",
        description: "力学、光学、电学基础知识",
        keywords: ["物理", "力学", "光学", "电学", "实验", "现象"],
      },
      {
        id: "chemistry",
        name: "化学入门",
        difficulty: "intermediate",
        description: "化学反应、元素周期表、实验安全",
        keywords: ["化学", "反应", "元素", "周期表", "实验", "安全"],
      },
      {
        id: "biology",
        name: "生物探索",
        difficulty: "basic",
        description: "生物分类、生命现象、生态环境",
        keywords: ["生物", "分类", "生命", "生态", "环境", "细胞"],
      },
    ],
  },
  {
    id: "arts",
    name: "艺术",
    description: "绘画技巧、音乐欣赏、创意设计、美育熏陶",
    icon: "🎨",
    color: "#ec4899",
    topics: [
      {
        id: "drawing",
        name: "绘画技巧",
        difficulty: "basic",
        description: "素描、色彩、构图、创意绘画",
        keywords: ["绘画", "素描", "色彩", "构图", "创意", "美术"],
      },
      {
        id: "music",
        name: "音乐欣赏",
        difficulty: "basic",
        description: "音乐理论、乐器认识、节奏训练",
        keywords: ["音乐", "乐器", "节奏", "旋律", "欣赏", "理论"],
      },
      {
        id: "design",
        name: "创意设计",
        difficulty: "intermediate",
        description: "设计思维、创意表达、手工制作",
        keywords: ["设计", "创意", "表达", "手工", "制作", "思维"],
      },
    ],
  },
]

export const LEARNING_LEVELS = {
  elementary: {
    name: "小学",
    grades: ["一年级", "二年级", "三年级", "四年级", "五年级", "六年级"],
    ageRange: "6-12岁",
  },
  middle: {
    name: "初中",
    grades: ["初一", "初二", "初三"],
    ageRange: "12-15岁",
  },
}

export const AI_TEACHING_MODES = {
  fast: {
    name: "快速回答",
    description: "快速响应，简洁明了",
    responseTime: "1-2秒",
    detailLevel: "basic",
  },
  deep: {
    name: "深度分析",
    description: "详细分析，深入讲解",
    responseTime: "3-5秒",
    detailLevel: "comprehensive",
  },
}
