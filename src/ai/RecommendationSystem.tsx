import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { AIService } from './AIService';
import { Card, CardContent, Chip, Tooltip, Button, Badge, LinearProgress } from '@mui/material';
import { Code, ArrowRight } from '@mui/icons-material';

interface Recommendation {
  id: string;
  type: 'code' | 'resource' | 'learning-path' | 'feature' | 'optimization';
  title: string;
  description: string;
  relevanceScore: number;
  content?: string;
  url?: string;
  tags: string[];
  createdAt?: number;
  category?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

interface LearningProgressData {
  skills: SkillProgress[];
  nextSteps: string[];
}

interface AILearningAction {
  type: string;
  details: {
    id: string;
    type: string;
    title: string;
  };
}

interface SkillProgress {
  name: string;
  level: number;
  progress: number;
}

const RecommendationSystem: React.FC = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [skillProgress, setSkillProgress] = useState<SkillProgress[]>([]);
  const [nextSteps, setNextSteps] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [showProgress, setShowProgress] = useState<boolean>(true);
  
  // 暂时注释掉navigate功能，因为react-router-dom模块不存在
  // const navigate = useNavigate();
  const aiServiceRef = React.useRef<AIService | null>(null);

  // 初始化AI服务
  useEffect(() => {
    const userId = localStorage.getItem('userId') || 'anonymous-user';
    const projectId = localStorage.getItem('currentProjectId') || 'default-project';
    
    aiServiceRef.current = new AIService(userId, projectId);
    
    // 加载推荐和学习进度
    loadRecommendations();
    loadLearningProgress();
  }, []);

  // 加载推荐内容
  const loadRecommendations = useCallback(async () => {
    try {
      setLoading(true);
      
      if (!aiServiceRef.current) {
        throw new Error('AI服务未初始化');
      }
      
      // 获取推荐内容
      const userId = localStorage.getItem('userId') || 'anonymous-user';
      const aiRecommendations = await aiServiceRef.current.generateRecommendations(userId);
      
      // 处理推荐数据，添加ID和额外信息
      const processedRecommendations: Recommendation[] = aiRecommendations.map((rec, index) => ({
        id: `rec-${Date.now()}-${index}`,
        type: rec.type as 'code' | 'resource' | 'learning-path' | 'feature' | 'optimization',
        title: rec.title,
        description: rec.description,
        relevanceScore: rec.relevanceScore,
        content: rec.content,
        url: rec.url,
        tags: rec.tags || [],
        createdAt: Date.now() - index * 60000,
        category: determineCategory(rec.type),
        difficulty: determineDifficulty(rec.type, rec.tags || [])
      }));
      
      setRecommendations(processedRecommendations);
    } catch (error) {
      console.error('加载推荐内容失败:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // 加载学习进度
  const determineCategory = (type: string): string => {
    switch (type) {
      case 'code': return '代码示例';
      case 'resource': return '学习资源';
      case 'learning-path': return '学习路径';
      case 'feature': return '功能建议';
      case 'optimization': return '优化方案';
      default: return '其他';
    }
  };
  
  const determineDifficulty = (type: string, tags: string[]): 'beginner' | 'intermediate' | 'advanced' => {
    if (tags.includes('beginner') || tags.includes('初级')) return 'beginner';
    if (tags.includes('advanced') || tags.includes('高级')) return 'advanced';
    return 'intermediate';
  };
  const loadLearningProgress = useCallback(async () => {
    try {
      if (!aiServiceRef.current) {
        throw new Error('AI服务未初始化');
      }
      
      const userId = localStorage.getItem('userId') || 'anonymous-user';
      const progressData = await aiServiceRef.current.analyzeLearningProgress(userId);
      // 适配LearningProgressData接口
      const formattedData: LearningProgressData = {
        skills: progressData.skills || [],
        nextSteps: progressData.nextSteps || []
      };
      setSkillProgress(formattedData.skills);
        setNextSteps(formattedData.nextSteps);
    } catch (error) {
      console.error('加载学习进度失败:', error);
    }
  }, []);

  // 已在上面定义了determineCategory和determineDifficulty函数，此处不再重复

  // 获取推荐类型对应的图标（只使用已导入的Code图标）
  const getRecommendationIcon = (type: string) => {
    // 只使用已导入的Code图标
    return <Code className={`recommendation-icon ${type}`} />;
  };

  // 获取难度级别对应的颜色和文本
  const getDifficultyInfo = (difficulty: 'beginner' | 'intermediate' | 'advanced') => {
    switch (difficulty) {
      case 'beginner':
        return { color: '#4caf50', text: '初级' };
      case 'intermediate':
        return { color: '#ff9800', text: '中级' };
      case 'advanced':
        return { color: '#f44336', text: '高级' };
    }
  };

  // 处理推荐项点击
  const handleRecommendationClick = (recommendation: Recommendation) => {
    console.log('推荐项被点击:', recommendation);
    
    // 记录用户行为
    if (aiServiceRef.current) {
      const learningAction: AILearningAction = {
        type: 'recommendation-clicked',
        details: {
          id: recommendation.id,
          type: recommendation.type,
          title: recommendation.title
        }
      };
      // 适配recordLearningAction方法签名，需要两个参数
        aiServiceRef.current.recordLearningAction('recommendation-clicked', learningAction.details);
    }
    
    // 根据推荐类型处理跳转或其他操作
    if (recommendation.url) {
      // 使用window.open替代navigate，因为react-router-dom模块不可用
      window.open(recommendation.url, '_blank');
    } else if (recommendation.content) {
      // 显示代码或内容详情
      const newWindow = window.open('', '_blank');
      if (newWindow) {
        newWindow.document.write(`
          <html><head><title>${recommendation.title}</title></head>
          <body><pre>${recommendation.content}</pre></body>
          </html>
        `);
        newWindow.document.close();
      }
    }
  };

  // 过滤推荐内容
  const filteredRecommendations = recommendations.filter(rec => 
    selectedType === 'all' || rec.type === selectedType
  );

  // 渲染技能进度项
  const renderSkillProgress = (skill: SkillProgress) => {
    const levelText = skill.level >= 4.5 ? '精通' : 
                     skill.level >= 3.5 ? '熟练' :
                     skill.level >= 2.5 ? '掌握' :
                     skill.level >= 1.5 ? '了解' : '入门';
    
    return (
      <div key={skill.name} className="skill-progress-item">
        <div className="skill-header">
          <span className="skill-name">{skill.name}</span>
          <span className="skill-level">{levelText} ({skill.level}/5.0)</span>
        </div>
        <LinearProgress 
          variant="determinate" 
          value={skill.progress} 
          className="skill-progress-bar"
        />
        <div className="skill-percentage">{skill.progress}%</div>
      </div>
    );
  }


  // 渲染下一个学习步骤
  const renderNextSteps = () => {
    if (!nextSteps || nextSteps.length === 0) return null;
    
    return (
      <div className="next-steps-section">
        <h3>📚 推荐学习步骤</h3>
        <div className="next-steps-list">
          {nextSteps.map((step, index) => (
            <div key={index} className="next-step-item">
              <div className="step-number">{index + 1}</div>
              <div className="step-content">{step}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="recommendation-system">
      {/* 标题和控制栏 */}
      <div className="header-section">
        <h2>📊 智能学习推荐</h2>
        <div className="controls">
          <button 
            className={`filter-btn ${selectedType === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedType('all')}
          >
            全部推荐
          </button>
          <button 
            className={`filter-btn ${selectedType === 'code' ? 'active' : ''}`}
            onClick={() => setSelectedType('code')}
          >
            代码示例
          </button>
          <button 
            className={`filter-btn ${selectedType === 'resource' ? 'active' : ''}`}
            onClick={() => setSelectedType('resource')}
          >
            学习资源
          </button>
          <button 
            className={`filter-btn ${selectedType === 'learning-path' ? 'active' : ''}`}
            onClick={() => setSelectedType('learning-path')}
          >
            学习路径
          </button>
          <button 
            className="toggle-btn"
            onClick={() => setShowProgress(!showProgress)}
          >
            {showProgress ? '隐藏进度' : '显示进度'}
          </button>
        </div>
      </div>

      {/* 学习进度 */}
      {showProgress && (
        <div className="progress-section">
          <h3>📈 学习进度概览</h3>
          <div className="skills-progress">
            {skillProgress.length > 0 ? (
              skillProgress.map(skill => renderSkillProgress(skill))
            ) : (
              <div className="no-data">暂无技能进度数据</div>
            )}
          </div>
          
          {renderNextSteps()}
        </div>
      )}

      {/* 推荐内容列表 */}
      <div className="recommendations-section">
        <h3>✨ 为您推荐</h3>
        
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>正在加载推荐内容...</p>
          </div>
        ) : filteredRecommendations.length > 0 ? (
          <div className="recommendations-grid">
            {filteredRecommendations.map(recommendation => {
              const difficultyInfo = getDifficultyInfo(recommendation.difficulty || 'intermediate');
              
              return (
                <Card 
                  key={recommendation.id} 
                  className="recommendation-card"
                  elevation={2}
                  onClick={() => handleRecommendationClick(recommendation)}
                  sx={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                  }}
                >
                  <CardContent className="recommendation-content">
                    <div className="recommendation-header">
                      <div className="recommendation-type">
                        {getRecommendationIcon(recommendation.type)}
                        <span className="type-label">{recommendation.category}</span>
                      </div>
                      <Badge 
                        badgeContent={Math.round(recommendation.relevanceScore * 100)} 
                        color="primary"
                        className="relevance-badge"
                      >
                        <span className="relevance-text">相关度</span>
                      </Badge>
                    </div>
                    
                    <h4 className="recommendation-title">{recommendation.title}</h4>
                    <p className="recommendation-description">{recommendation.description}</p>
                    
                    <div className="recommendation-meta">
                      <Chip 
                        label={difficultyInfo.text} 
                        size="small" 
                        sx={{
                          backgroundColor: difficultyInfo.color,
                          color: 'white',
                          '& .MuiChip-label': {
                            fontWeight: 500,
                            fontSize: '0.7rem'
                          }
                        }}
                      />
                      
                      <div className="recommendation-tags">
                        {recommendation.tags.slice(0, 3).map((tag, index) => (
                          <Tooltip key={index} title={tag}>
                            <Chip 
                              label={tag.length > 10 ? tag.substring(0, 10) + '...' : tag} 
                              size="small"
                              variant="outlined"
                              sx={{ 
                                marginLeft: '4px',
                                '& .MuiChip-label': {
                                  fontSize: '0.7rem'
                                }
                              }}
                            />
                          </Tooltip>
                        ))}
                        {recommendation.tags.length > 3 && (
                          <Chip 
                            label={`+${recommendation.tags.length - 3}`} 
                            size="small"
                            variant="outlined"
                            sx={{ 
                              marginLeft: '4px',
                              '& .MuiChip-label': {
                                fontSize: '0.7rem'
                              }
                            }}
                          />
                        )}
                      </div>
                    </div>
                    
                    <div className="recommendation-actions">
                      <span className="view-more">查看详情</span>
                      <ArrowRight />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="no-recommendations">
            <Code className="no-recommendations-icon" />
            <h4>暂无推荐内容</h4>
            <p>继续学习和使用，我们将为您提供更多个性化推荐</p>
            <Button 
              variant="contained" 
              onClick={loadRecommendations}
              sx={{ marginTop: 2 }}
            >
              刷新推荐
            </Button>
          </div>
        )}
      </div>

      {/* 所有样式已移至外部CSS文件 */}
    </div>
  );
};

export default RecommendationSystem;