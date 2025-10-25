import React, { useState, useEffect } from 'react'
import { Tabs, Tab, Box, Typography, Card, CardContent, Chip, Tooltip, Button } from '@mui/material';
import { Code, Book, Terminal, Star, Layers, Dataset } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

interface LanguageInfo {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  popularity: number;
  complexity: 'beginner' | 'intermediate' | 'advanced';
  supportedFeatures: string[];
  examples: string[];
  learningResources: string[];
  color: string;
}

const ProgrammingLanguageSelector: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [isMobileView, setIsMobileView] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  // 监听窗口大小变化
  useEffect(() => {
    setIsMobileView(isMobile);
    
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile]);

  // 编程语言数据
  const languages: LanguageInfo[] = [
    {
      id: 'javascript',
      name: 'JavaScript',
      icon: <Code fontSize="medium" />,
      description: 'Web前端开发的核心语言，用于创建交互式网页和Web应用。',
      popularity: 95,
      complexity: 'intermediate',
      supportedFeatures: ['DOM操作', '事件处理', '异步编程', 'ES6+特性'],
      examples: ['React组件', 'Vue指令', 'Node.js服务'],
      learningResources: ['MDN文档', 'JavaScript高级程序设计', 'ES6入门教程'],
      color: '#f7df1e'
    },
    {
      id: 'python',
      name: 'Python',
      icon: <Book fontSize="medium" />,
      description: '易学易用的高级编程语言，广泛应用于数据分析、人工智能和Web开发。',
      popularity: 90,
      complexity: 'beginner',
      supportedFeatures: ['数据分析', '机器学习', 'Web开发', '自动化脚本'],
      examples: ['数据可视化', '爬虫程序', 'Django应用'],
      learningResources: ['Python官方文档', '流畅的Python', '深度学习入门'],
      color: '#3776ab'
    },
    {
      id: 'java',
      name: 'Java',
      icon: <Layers fontSize="medium" />,
      description: '面向对象的编程语言，适用于企业级应用开发和Android应用开发。',
      popularity: 85,
      complexity: 'intermediate',
      supportedFeatures: ['面向对象', '多线程', 'JVM', '企业级框架'],
      examples: ['Spring应用', 'Android应用', '微服务'],
      learningResources: ['Java核心技术', 'Effective Java', 'Spring实战'],
      color: '#007396'
    },
    {
      id: 'cpp',
      name: 'C++',
      icon: <Terminal fontSize="medium" />, // 使用Terminal替代Cpu
      description: '高性能编程语言，用于系统软件、游戏开发和嵌入式系统。',
      popularity: 75,
      complexity: 'advanced',
      supportedFeatures: ['内存管理', '模板元编程', 'STL', '性能优化'],
      examples: ['游戏引擎', '操作系统组件', '高性能计算'],
      learningResources: ['C++ Primer', 'Effective C++', 'STL源码剖析'],
      color: '#00599c'
    },
    {
      id: 'csharp',
      name: 'C#',
      icon: <Layers fontSize="medium" />, // 使用Layers替代PackageIcon
      description: '微软开发的面向对象编程语言，用于.NET应用和游戏开发。',
      popularity: 70,
      complexity: 'intermediate',
      supportedFeatures: ['.NET框架', 'WPF', 'Unity游戏', 'ASP.NET'],
      examples: ['Windows应用', 'Unity游戏', 'Web API'],
      learningResources: ['.NET文档', 'C# 7.0本质论', 'ASP.NET Core实战'],
      color: '#239120'
    },
    {
      id: 'golang',
      name: 'Go',
      icon: <Code fontSize="medium" />, // 使用Code替代GitBranch
      description: '谷歌开发的系统编程语言，专注于简洁性、并发和性能。',
      popularity: 65,
      complexity: 'intermediate',
      supportedFeatures: ['协程', '通道', '快速编译', '并发编程'],
      examples: ['微服务', '容器工具', '网络应用'],
      learningResources: ['Go程序设计语言', 'Go Web编程', 'Go并发编程实战'],
      color: '#00add8'
    },
    {
      id: 'rust',
      name: 'Rust',
      icon: <Terminal fontSize="medium" />,
      description: '系统编程语言，注重安全、速度和并发性，无垃圾回收。',
      popularity: 60,
      complexity: 'advanced',
      supportedFeatures: ['所有权模型', '借用检查器', '零成本抽象', '并发安全'],
      examples: ['系统软件', '浏览器组件', '高性能服务'],
      learningResources: ['Rust程序设计语言', 'Rust实战', 'Rust异步编程'],
      color: '#dea584'
    },
    {
      id: 'sql',
      name: 'SQL',
      icon: <Dataset fontSize="medium" />,
      description: '结构化查询语言，用于管理关系型数据库和执行数据操作。',
      popularity: 88,
      complexity: 'beginner',
      supportedFeatures: ['数据查询', '数据定义', '数据操纵', '事务处理'],
      examples: ['数据库查询', '报表生成', '数据清洗'],
      learningResources: ['SQL必知必会', '高性能MySQL', 'SQL进阶教程'],
      color: '#003366'
    }
  ];

  // 获取选中的语言信息
  const getSelectedLanguage = (): LanguageInfo => {
    return languages.find(lang => lang.id === selectedLanguage) || languages[0];
  };

  // 获取难度级别对应的样式
  const getDifficultyStyles = (complexity: 'beginner' | 'intermediate' | 'advanced') => {
    switch (complexity) {
      case 'beginner':
        return {
          color: '#4caf50',
          label: '入门级',
          icon: <Star fontSize="small" color="success" />
        };
      case 'intermediate':
        return {
          color: '#ff9800',
          label: '中级',
          icon: <Star fontSize="small" color="warning" />
        };
      case 'advanced':
        return {
          color: '#f44336',
          label: '高级',
          icon: <Star fontSize="small" color="error" />
        };
    }
  };

  // 处理语言选择
  const handleLanguageChange = (languageId: string) => {
    setSelectedLanguage(languageId);
    setActiveTab(0);
    
    // 在移动端自动显示详情
    if (isMobileView) {
      setShowDetails(true);
    }
  };

  // 处理标签页切换
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // 渲染语言选择器（桌面版）
  const renderDesktopLanguageSelector = () => (
    <div className="language-selector-desktop">
      {languages.map(language => (
        <div
          key={language.id}
          className={`language-item ${selectedLanguage === language.id ? 'selected' : ''}`}
          onClick={() => handleLanguageChange(language.id)}
          style={selectedLanguage === language.id ? { borderLeft: `4px solid ${language.color}` } : {}}
        >
          <div className="language-icon" style={{ color: language.color }}>
            {language.icon}
          </div>
          <div className="language-info">
            <div className="language-name">{language.name}</div>
            <div className="language-difficulty">
              {getDifficultyStyles(language.complexity).label}
            </div>
          </div>
          {selectedLanguage === language.id && (
            <div className="language-popularity">
              <Tooltip title="流行度">
                <div className="popularity-indicator">
                  <div className="popularity-bar">
                    <div 
                      className="popularity-fill"
                      style={{
                        width: `${language.popularity}%`,
                        backgroundColor: language.color
                      }}
                    />
                  </div>
                  <span className="popularity-text">{language.popularity}%</span>
                </div>
              </Tooltip>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  // 渲染语言选择器（移动端）
  const renderMobileLanguageSelector = () => {
    const visibleLanguages = showDetails ? languages : languages.slice(0, 4);
    
    return (
      <div className="language-selector-mobile">
        {visibleLanguages.map(language => (
          <div
            key={language.id}
            className={`language-item-mobile ${selectedLanguage === language.id ? 'selected' : ''}`}
            onClick={() => handleLanguageChange(language.id)}
          >
            <div className="language-icon" style={{ color: language.color }}>
              {language.icon}
            </div>
            <div className="language-name">{language.name}</div>
            <div className="language-difficulty-mobile">
              {getDifficultyStyles(language.complexity).icon}
              <span>{getDifficultyStyles(language.complexity).label}</span>
            </div>
          </div>
        ))}
        
        {languages.length > 4 && !showDetails && (
          <Button 
            variant="outlined" 
            fullWidth
            onClick={() => setShowDetails(true)}
            className="show-more-btn"
          >
            显示更多语言
          </Button>
        )}
        
        {showDetails && (
          <Button 
            variant="outlined" 
            fullWidth
            onClick={() => setShowDetails(false)}
            className="show-less-btn"
          >
            收起
          </Button>
        )}
      </div>
    );
  };

  // 渲染语言详情
  const renderLanguageDetails = () => {
    const language = getSelectedLanguage();
    const difficultyStyles = getDifficultyStyles(language.complexity);
    
    return (
      <div className="language-details">
        <Card className="language-card" elevation={2}>
          <CardContent>
            <div className="language-header">
              <div className="language-main-info">
                <div 
                  className="language-icon-large"
                  style={{ color: language.color }}
                >
                  {language.icon}
                </div>
                <div>
                  <Typography variant="h5" component="h2" className="language-name-large">
                    {language.name}
                  </Typography>
                  <Typography variant="body1" className="language-description">
                    {language.description}
                  </Typography>
                </div>
              </div>
              
              <div className="language-meta">
                <div className="difficulty-badge" style={{ color: difficultyStyles.color }}>
                  {difficultyStyles.icon}
                  <span>{difficultyStyles.label}</span>
                </div>
                
                <div className="popularity-badge">
                  <Star fontSize="small" />
                  <span>流行度 {language.popularity}%</span>
                </div>
              </div>
            </div>
            
            <Box sx={{ borderBottom: 1, borderColor: 'divider', marginTop: 2 }} />
            
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange}
              variant={isTablet ? "scrollable" : "fullWidth"}
              className="language-tabs"
              sx={{
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 500,
                  fontSize: '0.95rem'
                },
                '& .Mui-selected': {
                  color: language.color + ' !important'
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: language.color
                }
              }}
            >
              <Tab label="特性" />
              <Tab label="示例" />
              <Tab label="学习资源" />
              <Tab label="应用场景" />
            </Tabs>
            
            <div className="tab-content">
              {activeTab === 0 && (
                <div className="features-tab">
                  <Typography variant="subtitle1" className="tab-title">支持的特性</Typography>
                  <div className="features-list">
                    {language.supportedFeatures.map((feature, index) => (
                      <Chip 
                        key={index} 
                        label={feature} 
                        className="feature-chip"
                        sx={{ 
                          margin: '4px',
                          backgroundColor: language.color + '20',
                          color: language.color,
                          '&:hover': {
                            backgroundColor: language.color + '30'
                          }
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {activeTab === 1 && (
                <div className="examples-tab">
                  <Typography variant="subtitle1" className="tab-title">代码示例</Typography>
                  <div className="examples-list">
                    {language.examples.map((example, index) => (
                      <div key={index} className="example-item">
                        <div className="example-title">{example}</div>
                        <Button 
                          variant="text" 
                          size="small"
                          className="view-example-btn"
                          sx={{ 
                            color: language.color,
                            textTransform: 'none',
                            minWidth: 'auto',
                            padding: '2px 8px'
                          }}
                        >
                          查看示例
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {activeTab === 2 && (
                <div className="resources-tab">
                  <Typography variant="subtitle1" className="tab-title">学习资源</Typography>
                  <div className="resources-list">
                    {language.learningResources.map((resource, index) => (
                      <div key={index} className="resource-item">
                        <Book fontSize="small" className="resource-icon" />
                        <span className="resource-name">{resource}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {activeTab === 3 && (
                <div className="scenarios-tab">
                  <Typography variant="subtitle1" className="tab-title">应用场景</Typography>
                  <div className="scenarios-content">
                    {getApplicationScenarios(language.id).map((scenario, index) => (
                      <div key={index} className="scenario-item">
                        <Typography variant="body2" className="scenario-title">{scenario.title}</Typography>
                        <Typography variant="caption" className="scenario-description">{scenario.description}</Typography>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // 获取应用场景
  const getApplicationScenarios = (languageId: string): { title: string; description: string }[] => {
    const scenariosMap: Record<string, { title: string; description: string }[]> = {
      'javascript': [
        { title: 'Web前端开发', description: '创建交互式网页和用户界面' },
        { title: '后端开发', description: '使用Node.js构建服务器端应用' },
        { title: '移动应用', description: '使用React Native或Ionic构建跨平台应用' },
        { title: '桌面应用', description: '使用Electron构建跨平台桌面应用' }
      ],
      'python': [
        { title: '数据分析与可视化', description: '处理和分析大规模数据集' },
        { title: '人工智能与机器学习', description: '开发智能系统和预测模型' },
        { title: 'Web开发', description: '使用Django或Flask构建Web应用' },
        { title: '自动化脚本', description: '创建工具和自动化工作流' }
      ],
      'java': [
        { title: '企业级应用', description: '构建大型业务系统和服务' },
        { title: 'Android应用开发', description: '创建移动应用程序' },
        { title: '微服务架构', description: '构建可扩展的分布式系统' },
        { title: '大数据处理', description: '使用Hadoop和Spark进行大数据分析' }
      ],
      'cpp': [
        { title: '系统软件', description: '开发操作系统和底层组件' },
        { title: '游戏开发', description: '创建高性能游戏引擎和应用' },
        { title: '嵌入式系统', description: '开发硬件控制软件' },
        { title: '高性能计算', description: '科学计算和模拟' }
      ],
      'csharp': [
        { title: '.NET应用', description: '构建Windows桌面和企业应用' },
        { title: '游戏开发', description: '使用Unity引擎创建游戏' },
        { title: 'Web开发', description: '使用ASP.NET构建Web应用' },
        { title: '云服务', description: '开发和部署Azure云应用' }
      ],
      'golang': [
        { title: '微服务', description: '构建高性能、可扩展的服务' },
        { title: 'DevOps工具', description: '开发容器和系统工具' },
        { title: '网络应用', description: '构建高性能网络服务' },
        { title: '分布式系统', description: '开发大规模分布式应用' }
      ],
      'rust': [
        { title: '系统编程', description: '开发高性能、安全的系统组件' },
        { title: 'WebAssembly', description: '构建高性能Web应用' },
        { title: '嵌入式系统', description: '开发安全、高效的嵌入式软件' },
        { title: '网络服务', description: '构建高性能网络服务' }
      ],
      'sql': [
        { title: '数据库管理', description: '管理和维护数据库系统' },
        { title: '数据分析', description: '查询和分析业务数据' },
        { title: '报表生成', description: '创建业务报表和数据可视化' },
        { title: '后端开发', description: '为应用程序提供数据支持' }
      ]
    };
    
    return scenariosMap[languageId] || [];
  };

  return (
    <div className="programming-language-selector">
      <div className="container">
        <Typography variant="h4" component="h1" className="page-title">
          编程语言选择器
        </Typography>
        <Typography variant="subtitle1" className="page-subtitle">
          探索和选择适合您学习路径的编程语言
        </Typography>
        
        <div className={`main-content ${isMobileView ? 'mobile-layout' : 'desktop-layout'}`}>
          {/* 语言选择器 */}
          <div className="selector-section">
            {isMobileView ? renderMobileLanguageSelector() : renderDesktopLanguageSelector()}
          </div>
          
          {/* 语言详情 */}
          <div className="details-section">
            {renderLanguageDetails()}
          </div>
        </div>
      </div>

      {/* 样式 */}
      <style>{`
        .programming-language-selector {
          padding: 20px;
          background-color: #f5f5f5;
          min-height: 100vh;
        }
        
        .container {
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .page-title {
          margin-bottom: 8px;
          color: #333;
          font-weight: 600;
        }
        
        .page-subtitle {
          margin-bottom: 24px;
          color: #666;
        }
        
        .main-content {
          display: flex;
          gap: 20px;
        }
        
        .desktop-layout {
          flex-direction: row;
        }
        
        .mobile-layout {
          flex-direction: column;
        }
        
        .selector-section {
          ${isMobileView ? 'width: 100%;' : 'width: 320px; flex-shrink: 0;'}
        }
        
        .details-section {
          flex: 1;
        }
        
        /* 桌面版语言选择器 */
        .language-selector-desktop {
          background-color: white;
          border-radius: 8px;
          padding: 16px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          max-height: 600px;
          overflow-y: auto;
        }
        
        .language-item {
          display: flex;
          align-items: center;
          padding: 12px;
          margin-bottom: 8px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          background-color: #f8f9fa;
          border-left: 4px solid transparent;
        }
        
        .language-item:hover {
          background-color: #e9ecef;
        }
        
        .language-item.selected {
          background-color: #e3f2fd;
        }
        
        .language-icon {
          margin-right: 12px;
        }
        
        .language-info {
          flex: 1;
        }
        
        .language-name {
          font-weight: 500;
          color: #333;
          margin-bottom: 4px;
        }
        
        .language-difficulty {
          font-size: 12px;
          color: #666;
        }
        
        .language-popularity {
          margin-left: 8px;
        }
        
        .popularity-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .popularity-bar {
          width: 40px;
          height: 4px;
          background-color: #e0e0e0;
          border-radius: 2px;
          overflow: hidden;
        }
        
        .popularity-fill {
          height: 100%;
          border-radius: 2px;
        }
        
        .popularity-text {
          font-size: 11px;
          color: #666;
          font-weight: 500;
        }
        
        /* 移动端语言选择器 */
        .language-selector-mobile {
          background-color: white;
          border-radius: 8px;
          padding: 16px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          margin-bottom: 16px;
        }
        
        .language-item-mobile {
          display: flex;
          align-items: center;
          padding: 12px;
          margin-bottom: 8px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          background-color: #f8f9fa;
          border: 2px solid transparent;
        }
        
        .language-item-mobile:hover {
          background-color: #e9ecef;
        }
        
        .language-item-mobile.selected {
          background-color: #e3f2fd;
          border-color: #1976d2;
        }
        
        .language-difficulty-mobile {
          display: flex;
          align-items: center;
          margin-left: auto;
          font-size: 12px;
          color: #666;
        }
        
        .language-difficulty-mobile span {
          margin-left: 4px;
        }
        
        .show-more-btn,
        .show-less-btn {
          margin-top: 8px;
          text-transform: none;
        }
        
        /* 语言详情 */
        .language-card {
          height: 100%;
        }
        
        .language-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }
        
        .language-main-info {
          display: flex;
          align-items: center;
          gap: 16px;
          flex: 1;
        }
        
        .language-icon-large {
          font-size: 48px;
        }
        
        .language-name-large {
          font-weight: 600;
        }
        
        .language-description {
          color: #666;
          margin-top: 4px;
        }
        
        .language-meta {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .difficulty-badge,
        .popularity-badge {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
        }
        
        .difficulty-badge {
          background-color: rgba(0,0,0,0.05);
        }
        
        .popularity-badge {
          background-color: rgba(76, 175, 80, 0.1);
          color: #4caf50;
        }
        
        .language-tabs {
          margin-top: 16px;
        }
        
        .tab-content {
          padding: 16px 0;
        }
        
        .tab-title {
          margin-bottom: 16px;
          font-weight: 500;
          color: #333;
        }
        
        /* 特性标签页 */
        .features-list {
          display: flex;
          flex-wrap: wrap;
        }
        
        .feature-chip {
          margin: 4px;
        }
        
        /* 示例标签页 */
        .examples-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .example-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px;
          background-color: #f8f9fa;
          border-radius: 6px;
        }
        
        .example-title {
          font-weight: 500;
          color: #333;
        }
        
        .view-example-btn {
          min-width: auto;
        }
        
        /* 学习资源标签页 */
        .resources-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .resource-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px;
          background-color: #f8f9fa;
          border-radius: 4px;
        }
        
        .resource-icon {
          color: #1976d2;
        }
        
        .resource-name {
          font-size: 14px;
          color: #333;
        }
        
        /* 应用场景标签页 */
        .scenarios-content {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        .scenario-item {
          padding: 12px;
          background-color: #f8f9fa;
          border-radius: 6px;
        }
        
        .scenario-title {
          font-weight: 500;
          color: #333;
          margin-bottom: 4px;
        }
        
        .scenario-description {
          color: #666;
        }
        
        /* 响应式设计 */
        @media (max-width: 768px) {
          .programming-language-selector {
            padding: 12px;
          }
          
          .page-title {
            font-size: 24px;
          }
          
          .language-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
          
          .language-main-info {
            align-items: flex-start;
          }
          
          .language-icon-large {
            font-size: 36px;
          }
          
          .language-name-large {
            font-size: 20px;
          }
        }
        
        @media (max-width: 480px) {
          .language-item {
            padding: 8px;
          }
          
          .language-icon {
            margin-right: 8px;
          }
          
          .language-name {
            font-size: 14px;
          }
          
          .language-popularity {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default ProgrammingLanguageSelector;