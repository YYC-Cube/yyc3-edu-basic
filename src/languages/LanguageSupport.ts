// 多语言支持模块

// 定义支持的编程语言类型
export interface ProgrammingLanguage {
  id: string;
  name: string;
  displayName: string;
  extension: string;
  syntax: string;
  category: 'programming' | 'scripting' | 'markup' | 'database';
  description: string;
  features: string[];
  examples: string[];
  resources: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  popularity: number; // 1-100
  color: string;
}

// 编程语言数据
const PROGRAMMING_LANGUAGES: ProgrammingLanguage[] = [
  {
    id: 'python',
    name: 'Python',
    displayName: 'Python 3',
    extension: '.py',
    syntax: 'python',
    category: 'programming',
    description: 'Python是一种高级、解释型、通用编程语言，以其简洁的语法和强大的生态系统而闻名。',
    features: [
      '易学易用的语法',
      '丰富的第三方库',
      '适用于数据科学、AI和Web开发',
      '跨平台兼容性'
    ],
    examples: [
      '# 简单的Python示例\nprint("Hello, World!")\n\ndef factorial(n):\n    if n <= 1:\n        return 1\n    return n * factorial(n-1)'
    ],
    resources: [
      'https://docs.python.org/3/',
      'https://realpython.com/',
      'https://www.python.org/about/gettingstarted/'
    ],
    difficulty: 'beginner',
    popularity: 95,
    color: '#3776AB'
  },
  {
    id: 'java',
    name: 'Java',
    displayName: 'Java',
    extension: '.java',
    syntax: 'java',
    category: 'programming',
    description: 'Java是一种面向对象的编程语言，拥有"一次编写，到处运行"的跨平台特性。',
    features: [
      '面向对象设计',
      '强类型系统',
      '跨平台兼容性',
      '强大的生态系统'
    ],
    examples: [
      '// 简单的Java示例\npublic class HelloWorld {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}'
    ],
    resources: [
      'https://docs.oracle.com/en/java/',
      'https://www.oracle.com/java/',
      'https://dev.java/'
    ],
    difficulty: 'intermediate',
    popularity: 90,
    color: '#ED8B00'
  },
  {
    id: 'cpp',
    name: 'C++',
    displayName: 'C++',
    extension: '.cpp',
    syntax: 'cpp',
    category: 'programming',
    description: 'C++是一种通用编程语言，结合了高级特性和低级控制能力，广泛用于系统软件和游戏开发。',
    features: [
      '高性能',
      '面向对象和泛型编程',
      '直接内存访问',
      '丰富的标准库'
    ],
    examples: [
      '// 简单的C++示例\n#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}'
    ],
    resources: [
      'https://en.cppreference.com/w/',
      'https://cplusplus.com/',
      'https://isocpp.org/'
    ],
    difficulty: 'advanced',
    popularity: 85,
    color: '#00599C'
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    displayName: 'JavaScript',
    extension: '.js',
    syntax: 'javascript',
    category: 'scripting',
    description: 'JavaScript是一种轻量级的解释型编程语言，主要用于Web前端开发，现在也用于后端开发。',
    features: [
      'Web前端开发的核心语言',
      '动态类型',
      '事件驱动',
      '函数式编程支持'
    ],
    examples: [
      '// 简单的JavaScript示例\nconsole.log("Hello, World!");\n\nfunction factorial(n) {\n    if (n <= 1) return 1;\n    return n * factorial(n - 1);\n}'
    ],
    resources: [
      'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
      'https://javascript.info/',
      'https://www.w3schools.com/js/'
    ],
    difficulty: 'beginner',
    popularity: 98,
    color: '#F7DF1E'
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    displayName: 'TypeScript',
    extension: '.ts',
    syntax: 'typescript',
    category: 'programming',
    description: 'TypeScript是JavaScript的超集，添加了静态类型定义和其他高级特性，提高了代码的可维护性。',
    features: [
      '静态类型检查',
      '接口和泛型',
      '类型推断',
      '更好的IDE支持'
    ],
    examples: [
      '// 简单的TypeScript示例\nconsole.log("Hello, World!");\n\nfunction factorial(n: number): number {\n    if (n <= 1) return 1;\n    return n * factorial(n - 1);\n}'
    ],
    resources: [
      'https://www.typescriptlang.org/docs/',
      'https://github.com/microsoft/TypeScript/wiki',
      'https://typescript-book.jp/'
    ],
    difficulty: 'intermediate',
    popularity: 88,
    color: '#3178C6'
  },
  {
    id: 'html',
    name: 'HTML',
    displayName: 'HTML5',
    extension: '.html',
    syntax: 'html',
    category: 'markup',
    description: 'HTML是用于创建网页结构的标记语言，是Web开发的基础。',
    features: [
      '简单易学',
      '语义化标签',
      '多媒体支持',
      '表单元素'
    ],
    examples: [
      '<!DOCTYPE html>\n<html>\n<head>\n    <title>Hello World</title>\n</head>\n<body>\n    <h1>Hello, World!</h1>\n</body>\n</html>'
    ],
    resources: [
      'https://developer.mozilla.org/en-US/docs/Web/HTML',
      'https://www.w3schools.com/html/',
      'https://html.spec.whatwg.org/multipage/'
    ],
    difficulty: 'beginner',
    popularity: 100,
    color: '#E34F26'
  },
  {
    id: 'css',
    name: 'CSS',
    displayName: 'CSS3',
    extension: '.css',
    syntax: 'css',
    category: 'markup',
    description: 'CSS是用于描述网页样式和布局的样式表语言，使网页更加美观。',
    features: [
      '层叠样式',
      '选择器系统',
      '动画和过渡',
      '响应式设计'
    ],
    examples: [
      '/* 简单的CSS示例 */\nbody {\n    font-family: Arial, sans-serif;\n}\n\nh1 {\n    color: #333;\n    text-align: center;\n}'
    ],
    resources: [
      'https://developer.mozilla.org/en-US/docs/Web/CSS',
      'https://www.w3schools.com/css/',
      'https://css-tricks.com/'
    ],
    difficulty: 'beginner',
    popularity: 99,
    color: '#1572B6'
  },
  {
    id: 'sql',
    name: 'SQL',
    displayName: 'SQL',
    extension: '.sql',
    syntax: 'sql',
    category: 'database',
    description: 'SQL是用于管理关系型数据库的标准化语言，用于执行查询、更新和管理数据。',
    features: [
      '数据查询',
      '数据操作',
      '数据库定义',
      '数据库控制'
    ],
    examples: [
      '-- 简单的SQL示例\nSELECT * FROM users;\n\nINSERT INTO users (name, email) VALUES (\'John Doe\', \'john@example.com\');'
    ],
    resources: [
      'https://www.w3schools.com/sql/',
      'https://dev.mysql.com/doc/',
      'https://www.sqlservertutorial.net/'
    ],
    difficulty: 'beginner',
    popularity: 92,
    color: '#003B57'
  }
];

// 学科知识类型定义
export interface SubjectKnowledge {
  id: string;
  name: string;
  description: string;
  subtopics: Topic[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  recommendedLanguages: string[];
}

// 主题类型定义
export interface Topic {
  id: string;
  name: string;
  description: string;
  learningMaterials: LearningMaterial[];
}

// 学习资料类型定义
export interface LearningMaterial {
  id: string;
  title: string;
  type: 'article' | 'video' | 'exercise' | 'quiz';
  url: string;
  difficulty: 'easy' | 'medium' | 'hard';
  duration: string; // 估计学习时间
}

// 学科知识数据
const SUBJECT_KNOWLEDGE: SubjectKnowledge[] = [
  {
    id: 'data-structures',
    name: '数据结构',
    description: '数据结构是计算机中组织和存储数据的方式，是高效算法的基础。',
    difficulty: 'intermediate',
    recommendedLanguages: ['python', 'java', 'cpp'],
    subtopics: [
      {
        id: 'arrays-lists',
        name: '数组与列表',
        description: '最基础的数据结构，用于存储一系列元素。',
        learningMaterials: [
          {
            id: 'ds-array-1',
            title: '数组基础概念',
            type: 'article',
            url: 'https://example.com/arrays-basics',
            difficulty: 'easy',
            duration: '30分钟'
          },
          {
            id: 'ds-array-2',
            title: '数组操作练习',
            type: 'exercise',
            url: 'https://example.com/array-exercises',
            difficulty: 'medium',
            duration: '1小时'
          }
        ]
      },
      {
        id: 'linked-lists',
        name: '链表',
        description: '一种线性数据结构，元素通过指针连接。',
        learningMaterials: [
          {
            id: 'ds-list-1',
            title: '链表的实现与操作',
            type: 'video',
            url: 'https://example.com/linked-lists',
            difficulty: 'medium',
            duration: '45分钟'
          }
        ]
      },
      {
        id: 'stacks-queues',
        name: '栈与队列',
        description: '两种重要的线性数据结构，遵循特定的操作顺序。',
        learningMaterials: [
          {
            id: 'ds-stack-1',
            title: '栈的应用与实现',
            type: 'article',
            url: 'https://example.com/stacks',
            difficulty: 'medium',
            duration: '40分钟'
          }
        ]
      },
      {
        id: 'trees-graphs',
        name: '树与图',
        description: '非线性数据结构，用于表示层次关系和网络结构。',
        learningMaterials: [
          {
            id: 'ds-tree-1',
            title: '二叉树基础',
            type: 'video',
            url: 'https://example.com/binary-trees',
            difficulty: 'medium',
            duration: '50分钟'
          }
        ]
      }
    ]
  },
  {
    id: 'algorithms',
    name: '算法设计与分析',
    description: '算法是解决问题的步骤集合，算法设计与分析关注如何高效地解决问题。',
    difficulty: 'advanced',
    recommendedLanguages: ['python', 'java', 'cpp'],
    subtopics: [
      {
        id: 'sorting-searching',
        name: '排序与搜索算法',
        description: '最基础的算法类型，用于数据的排序和查找。',
        learningMaterials: [
          {
            id: 'algo-sort-1',
            title: '常用排序算法对比',
            type: 'article',
            url: 'https://example.com/sorting-algorithms',
            difficulty: 'medium',
            duration: '1小时'
          }
        ]
      },
      {
        id: 'dynamic-programming',
        name: '动态规划',
        description: '一种通过将问题分解为子问题并存储子问题结果来解决复杂问题的方法。',
        learningMaterials: [
          {
            id: 'algo-dp-1',
            title: '动态规划入门',
            type: 'video',
            url: 'https://example.com/dynamic-programming',
            difficulty: 'hard',
            duration: '1.5小时'
          }
        ]
      },
      {
        id: 'greedy-algorithms',
        name: '贪心算法',
        description: '通过在每一步选择局部最优解来达到全局最优解的算法。',
        learningMaterials: [
          {
            id: 'algo-greedy-1',
            title: '贪心算法应用案例',
            type: 'article',
            url: 'https://example.com/greedy-algorithms',
            difficulty: 'medium',
            duration: '50分钟'
          }
        ]
      }
    ]
  },
  {
    id: 'ai-fundamentals',
    name: '人工智能基础',
    description: '人工智能是计算机科学的一个分支，旨在创建能够模拟人类智能的系统。',
    difficulty: 'intermediate',
    recommendedLanguages: ['python', 'r'],
    subtopics: [
      {
        id: 'machine-learning',
        name: '机器学习',
        description: '让计算机从数据中学习而不需要明确编程的技术。',
        learningMaterials: [
          {
            id: 'ai-ml-1',
            title: '机器学习入门',
            type: 'video',
            url: 'https://example.com/machine-learning',
            difficulty: 'medium',
            duration: '2小时'
          }
        ]
      },
      {
        id: 'neural-networks',
        name: '神经网络',
        description: '受生物神经网络启发的计算模型，用于复杂模式识别。',
        learningMaterials: [
          {
            id: 'ai-nn-1',
            title: '神经网络基础',
            type: 'article',
            url: 'https://example.com/neural-networks',
            difficulty: 'hard',
            duration: '1.5小时'
          }
        ]
      },
      {
        id: 'nlp',
        name: '自然语言处理',
        description: '让计算机理解和处理人类语言的技术。',
        learningMaterials: [
          {
            id: 'ai-nlp-1',
            title: 'NLP基础概念',
            type: 'video',
            url: 'https://example.com/nlp-basics',
            difficulty: 'medium',
            duration: '1小时'
          }
        ]
      }
    ]
  }
];

// 语言支持服务类
export class LanguageSupportService {
  // 获取所有支持的编程语言
  getAllProgrammingLanguages(): ProgrammingLanguage[] {
    return [...PROGRAMMING_LANGUAGES];
  }

  // 根据ID获取编程语言
  getLanguageById(id: string): ProgrammingLanguage | undefined {
    return PROGRAMMING_LANGUAGES.find(lang => lang.id === id);
  }

  // 根据类别获取编程语言
  getLanguagesByCategory(category: string): ProgrammingLanguage[] {
    return PROGRAMMING_LANGUAGES.filter(lang => lang.category === category);
  }

  // 根据难度级别获取编程语言
  getLanguagesByDifficulty(difficulty: 'beginner' | 'intermediate' | 'advanced'):
    ProgrammingLanguage[] {
    return PROGRAMMING_LANGUAGES.filter(lang => lang.difficulty === difficulty);
  }

  // 获取所有学科知识
  getAllSubjectKnowledge(): SubjectKnowledge[] {
    return [...SUBJECT_KNOWLEDGE];
  }

  // 根据ID获取学科知识
  getSubjectKnowledgeById(id: string): SubjectKnowledge | undefined {
    return SUBJECT_KNOWLEDGE.find(subject => subject.id === id);
  }

  // 获取推荐的学习资料
  getRecommendedLearningMaterials(subjectId: string, difficulty: 'easy' | 'medium' | 'hard'):
    LearningMaterial[] {
    const subject = this.getSubjectKnowledgeById(subjectId);
    if (!subject) return [];

    const materials: LearningMaterial[] = [];
    subject.subtopics.forEach(subtopic => {
      materials.push(...subtopic.learningMaterials.filter(
        material => material.difficulty === difficulty
      ));
    });

    return materials;
  }

  // 搜索编程语言和学科知识
  search(query: string): {
    languages: ProgrammingLanguage[];
    subjects: SubjectKnowledge[];
  } {
    const lowerQuery = query.toLowerCase();
    
    return {
      languages: PROGRAMMING_LANGUAGES.filter(lang => 
        lang.name.toLowerCase().includes(lowerQuery) ||
        lang.description.toLowerCase().includes(lowerQuery) ||
        lang.features.some(feature => feature.toLowerCase().includes(lowerQuery))
      ),
      subjects: SUBJECT_KNOWLEDGE.filter(subject => 
        subject.name.toLowerCase().includes(lowerQuery) ||
        subject.description.toLowerCase().includes(lowerQuery) ||
        subject.subtopics.some(topic => topic.name.toLowerCase().includes(lowerQuery))
      )
    };
  }
}