// ESLint v9配置文件
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import nextPlugin from '@next/eslint-plugin-next';

// 尝试导入Next.js的核心配置，如果可用
const nextConfig = async () => {
  try {
    const { configs } = await import('eslint-config-next');
    return configs;
  } catch (error) {
    return { coreWebVitals: {}, typescript: {} };
  }
};

export default [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    // 统一为所有文件声明常用全局变量，避免 no-undef
    languageOptions: {
      globals: {
        console: 'readonly',
        process: 'readonly',
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
      },
    },
  },
  {
    plugins: {
      '@next/next': nextPlugin,
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 2022,
        sourceType: 'module',
      },
      globals: {
        console: 'readonly',
        process: 'readonly',
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
      },
    },
  },
  {
    files: ['**/*.js', '**/*.jsx'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        console: 'readonly',
        process: 'readonly',
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
      },
    },
  },
  {
    ignores: [
      'node_modules/',
      '.next/',
      'dist/',
      'coverage/',
      '.storybook/',
      'out/',
      'swc/',
      'public/',
      '*.config.*',
      '*.setup.*',
      '*.sh',
    ],
  },
];