import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { AIService } from './AIService';
// 使用React内置的代码格式化替代react-code-blocks
import { Alert, TextField, Paper, IconButton, Tooltip, Snackbar } from '@mui/material';
import { Send, Download, CopyAll, Clear, Help, Settings, Mic } from '@mui/icons-material';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

interface FrameworkOption {
  value: string;
  label: string;
  icon?: React.ReactElement;
}

const frameworkOptions: FrameworkOption[] = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'angular', label: 'Angular' },
  { value: 'vanilla', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
];

const complexityOptions = [
  { value: 'simple', label: '简单' },
  { value: 'medium', label: '中等' },
  { value: 'complex', label: '复杂' },
];

// 定义代码块结果接口
interface CodeBlockResult {
  explanation?: string;
  code?: string;
  language?: string;
  dependencies?: string[];
  warnings?: string[];
}

// 格式化代码块输出
// 使用更安全的类型处理方式，避免接口冲突
const formatCodeBlock = (result: CodeBlockResult, framework: string): string => {
  let content = '';
  
  // 添加代码说明
  if (typeof result.explanation === 'string') {
    content += `💡 ${result.explanation}\n\n`;
  }
  
  // 添加代码
  if (typeof result.code === 'string') {
    const language = typeof result.language === 'string' 
      ? (result.language === 'javascript' && framework === 'react' ? 'tsx' : result.language) 
      : 'typescript';
    content += `\`\`\`${language}\n`;
    content += result.code + '\n';
    content += '```\n\n';
  }
  
  // 添加依赖信息，使用运行时类型检查
  if (result.dependencies && Array.isArray(result.dependencies) && result.dependencies.length > 0) {
    content += `📦 **依赖项**: ${(result.dependencies as string[]).join(', ')}\n`;
  }
  
  // 添加警告信息，使用运行时类型检查
  if (result.warnings && Array.isArray(result.warnings) && result.warnings.length > 0) {
    content += `⚠️ **警告**: \n`;
    (result.warnings as string[]).forEach((warning: string) => {
      content += `- ${warning}\n`;
    });
  }
  
  return content;
}

const NaturalLanguageProgrammingPanel: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [selectedFramework, setSelectedFramework] = useState<string>('react');
  const [selectedComplexity, setSelectedComplexity] = useState<string>('simple');
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ open: boolean; message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const aiServiceRef = useRef<AIService | null>(null);
  // ... existing code ...

  useEffect(() => {
    const userId = typeof window !== 'undefined' ? (localStorage.getItem('userId') || 'anonymous-user') : 'anonymous-user';
    const projectId = typeof window !== 'undefined' ? (localStorage.getItem('currentProjectId') || 'default-project') : 'default-project';
    aiServiceRef.current = new AIService(userId, projectId);
    setMessages([
       {
         role: 'system',
         content: '👋 欢迎使用自然语言编程助手！请描述您想要实现的功能，我将为您生成对应的代码。例如："创建一个带有表单验证的用户登录页面"',
         timestamp: Date.now()
       }
     ]);
   }, []);

  // 显示提示消息
  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotification({ open: true, message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // 处理发送消息
  const handleSendMessage = async () => {
    if (!input.trim() || isThinking) return;

    const newUserMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInput('');
    setIsThinking(true);

    try {
      if (!aiServiceRef.current) {
        throw new Error('AI服务未初始化');
      }

      // 记录用户交互
      aiServiceRef.current.recordLearningAction('send-message', { content: newUserMessage.content });

      // 调用AI服务生成代码
      const prompt = newUserMessage.content;
      const result = await aiServiceRef.current.generateCodeFromNaturalLanguage(prompt, {
        framework: selectedFramework as 'react' | 'vue' | 'angular' | 'vanilla' | 'python' | 'java' | 'cpp',
        complexity: selectedComplexity as 'simple' | 'medium' | 'complex',
        includeComments: true,
        useTypeScript: selectedFramework === 'react' || selectedFramework === 'vue' || selectedFramework === 'angular'
      });

      if (result) {
        const codeBlock = formatCodeBlock(result, selectedFramework);
        const assistantMessage: Message = {
          role: 'assistant',
          content: codeBlock,
          timestamp: Date.now()
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        
        // 记录生成的代码
        aiServiceRef.current?.recordLearningAction('code-generated', {
          prompt: newUserMessage.content,
          language: result.language,
          codeLength: result.code.length
        });
      } else {
        throw new Error('未能生成代码，请重试');
      }
    } catch (error) {
      console.error('生成代码时出错:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: `❌ 生成代码时出错: ${error instanceof Error ? error.message : '未知错误'}`,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMessage]);
      showNotification('生成代码失败，请稍后重试', 'error');
    } finally {
      setIsThinking(false);
    }
  };

  // 处理键盘事件
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 清空对话
  const handleClearChat = () => {
    setMessages([
      {
        role: 'system',
        content: '👋 欢迎使用自然语言编程助手！请描述您想要实现的功能，我将为您生成对应的代码。例如："创建一个带有表单验证的用户登录页面"',
        timestamp: Date.now()
      }
    ]);
  };

  return (
    <div className="natural-language-programming-panel">
      {/* 顶部工具栏 */}
      <div className="toolbar">
        <div className="toolbar-left">
          <h2>自然语言编程助手</h2>
          <Tooltip title="使用提示">
            <IconButton size="small" color="inherit">
              <Help fontSize="small" />
            </IconButton>
          </Tooltip>
        </div>
        
        <div className="toolbar-right">
          <Tooltip title="清空对话">
            <IconButton size="small" color="inherit" onClick={handleClearChat}>
-              <Clear fontSize="小" />
+              <Clear fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="设置">
            <IconButton size="small" color="inherit" onClick={() => setShowSettings(!showSettings)}>
              <Settings fontSize="small" />
            </IconButton>
          </Tooltip>
        </div>
      </div>

      {/* 设置面板 */}
      {showSettings && (
        <div className="settings-panel">
          <div className="setting-row">
            <label>选择框架/语言</label>
            <select 
              value={selectedFramework} 
              onChange={(e) => setSelectedFramework(e.target.value)}
              className="form-select"
            >
              {frameworkOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="setting-row">
            <label>复杂度</label>
            <select 
              value={selectedComplexity} 
              onChange={(e) => setSelectedComplexity(e.target.value)}
              className="form-select"
            >
              {complexityOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* 聊天区域 */}
      <Paper elevation={0} className="chat-container">
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`chat-message ${msg.role}`}>
              <div className="message-meta">
                <span className="message-role">{msg.role === 'user' ? '用户' : msg.role === 'assistant' ? '助手' : '系统'}</span>
                <span className="message-time">{new Date(msg.timestamp).toLocaleTimeString()}</span>
              </div>
              <div className="message-content">
                {msg.content}
              </div>
            </div>
          ))}
        </div>

        {/* 输入区域 */}
        <div className="chat-input">
          <TextField
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="描述你想要实现的功能..."
            fullWidth
            multiline
            maxRows={4}
          />
          <div className="input-actions">
            <Tooltip title="发送">
              <IconButton color="primary" onClick={handleSendMessage} disabled={isThinking}>
                <Send />
              </IconButton>
            </Tooltip>
            <Tooltip title="复制">
              <IconButton color="inherit">
                <CopyAll />
              </IconButton>
            </Tooltip>
            <Tooltip title="下载">
              <IconButton color="inherit">
                <Download />
              </IconButton>
            </Tooltip>
            <Tooltip title="语音输入">
              <IconButton color="inherit">
                <Mic />
              </IconButton>
            </Tooltip>
          </div>
        </div>
      </Paper>

      {/* 通知 */}
      <Snackbar open={!!notification?.open} autoHideDuration={3000}>
        {notification && (
          <Alert severity={notification.type} sx={{ width: '100%' }}>
            {notification.message}
          </Alert>
        )}
      </Snackbar>

      {/* 样式 */}
      <style jsx>{`
        .natural-language-programming-panel {
          padding: 16px;
        }
        .toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        .toolbar-left h2 {
          margin: 0;
          font-size: 18px;
        }
        .settings-panel {
          background: #fafafa;
          border: 1px solid #eee;
          border-radius: 8px;
          padding: 12px;
          margin-bottom: 12px;
        }
        .setting-row {
          display: flex;
          gap: 12px;
          align-items: center;
          margin-bottom: 8px;
        }
        .chat-container {
          border: 1px solid #eee;
          border-radius: 8px;
          padding: 12px;
        }
        .chat-messages {
          max-height: 360px;
          overflow-y: auto;
          margin-bottom: 12px;
        }
        .chat-message {
          margin-bottom: 12px;
        }
        .message-meta {
          display: flex;
          gap: 8px;
          font-size: 12px;
          color: #666;
        }
        .message-content {
          white-space: pre-wrap;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          background: #f8f9fa;
          border-radius: 6px;
          padding: 8px;
          margin-top: 4px;
        }
        .chat-input {
          display: flex;
          gap: 8px;
          align-items: center;
        }
        .input-actions {
          display: flex;
          gap: 4px;
        }
      `}</style>
    </div>
  );
};

export default NaturalLanguageProgrammingPanel;