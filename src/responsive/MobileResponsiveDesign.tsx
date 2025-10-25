import * as React from 'react';
import { useState } from 'react';
import { Box, Drawer, IconButton, useMediaQuery, useTheme } from '@mui/material';
import { Menu, X, Code, Book, Groups, Settings, Dashboard } from '@mui/icons-material';

// 定义响应式布局组件
interface ResponsiveLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({ children, title = "YYC AI 学习平台" }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* 移动端抽屉导航 */}
      <MobileDrawer
        open={isMobile && mobileOpen}
        handleClose={handleDrawerToggle}
      />
      
      {/* 移动端顶部导航栏 */}
      {isMobile && (
        <MobileHeader
          title={title}
          onMenuClick={handleDrawerToggle}
        />
      )}
      
      {/* 桌面端侧边栏 */}
      {!isMobile && <DesktopSidebar />}
      
      {/* 主内容区域 */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: isMobile ? '100%' : 'calc(100% - 240px)',
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        {!isMobile && <div className="text-2xl font-bold mb-4">{title}</div>}
        <ResponsiveContentWrapper>
          {children}
        </ResponsiveContentWrapper>
      </Box>
    </Box>
  );
};

// 移动端抽屉导航组件
interface MobileDrawerProps {
  open: boolean;
  handleClose: () => void;
}

const MobileDrawer: React.FC<MobileDrawerProps> = ({ open, handleClose }) => {
  const drawerContent = (
    <Box sx={{ width: 240 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', p: 1 }}>
        <IconButton onClick={handleClose}>
        <X sx={{ fontSize: 20 }} />
      </IconButton>
      </Box>
      <NavigationItems />
    </Box>
  );

  return (
    <Drawer
      variant="temporary"
      open={open}
      onClose={handleClose}
      ModalProps={{
        keepMounted: true,
      }}
      sx={{
        display: { xs: 'block', md: 'none' },
        '& .MuiDrawer-paper': {
          boxSizing: 'border-box',
          width: 240,
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

// 移动端顶部导航栏
interface MobileHeaderProps {
  title: string;
  onMenuClick: () => void;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ title, onMenuClick }) => {
  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: 2,
        bgcolor: theme => theme.palette.primary.main,
        color: 'white',
        boxShadow: 1,
      }}
    >
      <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="start"
        onClick={onMenuClick}
        sx={{ mr: 2 }}
      >
        <Menu sx={{ fontSize: 24 }} />
      </IconButton>
      <div className="text-lg font-medium">{title}</div>
      <div style={{ width: 40 }} />
    </Box>
  );
};

// 桌面端侧边栏
const DesktopSidebar: React.FC = () => {
  return (
    <Box
      component="aside"
      sx={{
        width: 240,
        position: 'fixed',
        height: '100vh',
        bgcolor: theme => theme.palette.background.paper,
        boxShadow: 1,
        zIndex: 1,
        overflowY: 'auto',
      }}
    >
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <div className="text-xl font-bold text-purple-700">YYC AI 学习平台</div>
        <div className="text-xs text-gray-500 mt-1">赋能未来教育</div>
      </Box>
      <NavigationItems />
    </Box>
  );
};

// 导航菜单项
const NavigationItems: React.FC = () => {
  const navItems = [
    { id: 'dashboard', label: '仪表盘', icon: <Dashboard sx={{ fontSize: 20 }} /> },
    { id: 'editor', label: '可视化编辑器', icon: <Code sx={{ fontSize: 20 }} /> },
    { id: 'courses', label: '学习课程', icon: <Book sx={{ fontSize: 20 }} /> },
    { id: 'team', label: '团队协作', icon: <Groups sx={{ fontSize: 20 }} /> },
    { id: 'settings', label: '设置', icon: <Settings sx={{ fontSize: 20 }} /> },
  ];

  return (
    <Box sx={{ p: 2 }}>
      {navItems.map((item) => (
        <Box
          key={item.id}
          sx={{
            display: 'flex',
            alignItems: 'center',
            p: 1.5,
            borderRadius: 1,
            cursor: 'pointer',
            '&:hover': {
              bgcolor: theme => theme.palette.action.hover,
            },
          }}
        >
          <Box sx={{ mr: 2, color: 'primary.main' }}>{item.icon}</Box>
          <span>{item.label}</span>
        </Box>
      ))}
    </Box>
  );
};

// 响应式内容包装器
const ResponsiveContentWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isMobile = useMediaQuery('(max-width:600px)');
  
  return (
    <Box
      sx={{
        padding: isMobile ? 1 : 3,
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 1,
      }}
    >
      {children}
    </Box>
  );
};

// 响应式网格布局
interface ResponsiveGridProps {
  children: React.ReactNode;
  columns?: 'auto' | string | number;
  spacing?: number;
}

export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({ 
  children, 
  columns = 'auto', 
  spacing = 2 
}) => {
  const isMobile = useMediaQuery('(max-width:600px)');
  const isTablet = useMediaQuery('(max-width:960px)');
  
  let gridColumns: string | number = 'auto';
  if (columns !== 'auto') {
    if (isMobile) {
      gridColumns = 1;
    } else if (isTablet) {
      gridColumns = Math.ceil((columns as number) / 2);
    } else {
      gridColumns = columns;
    }
  }
  
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: columns === 'auto' ? 'repeat(auto-fill, minmax(280px, 1fr))' : `repeat(${String(gridColumns)}, 1fr)`,

        gap: spacing,
      }}
    >
      {children}
    </Box>
  );
};

// 触摸优化按钮
interface TouchOptimizedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'contained' | 'outlined' | 'text';
  size?: 'small' | 'medium' | 'large';
}

export const TouchOptimizedButton: React.FC<TouchOptimizedButtonProps> = ({
  children,
  onClick,
  variant = 'contained',
  size = 'medium'
}) => {
  const isMobile = useMediaQuery('(max-width:600px)');
  
  const buttonSx = {
    minHeight: isMobile ? 48 : undefined,
    minWidth: isMobile ? 48 : undefined,
    padding: isMobile ? '8px 16px' : undefined,
  };
  
  return (
    <button
      onClick={onClick}
      className={`
        ${variant === 'contained' ? 'bg-purple-600 text-white' : 
          variant === 'outlined' ? 'border border-gray-300 text-gray-700' : 'text-gray-700'}
        rounded-lg px-4 py-2 font-medium transition-all
        ${onClick ? 'hover:opacity-90 active:scale-95' : 'opacity-50 cursor-not-allowed'}
        ${size === 'small' ? 'text-sm' : size === 'large' ? 'text-lg py-3' : ''}
      `}
      style={buttonSx}
      disabled={!onClick}
    >
      {children}
    </button>
  );
};

// 响应式表单组件
interface ResponsiveFormGroupProps {
  label: string;
  children: React.ReactNode;
  fullWidth?: boolean;
}

export const ResponsiveFormGroup: React.FC<ResponsiveFormGroupProps> = ({
  label,
  children,
  fullWidth = false
}) => {
  return (
    <div className={`mb-4 ${fullWidth ? 'w-full' : ''}`}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div>
        {children}
      </div>
    </div>
  );
};

// 响应式输入框
interface ResponsiveInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}

export const ResponsiveInput: React.FC<ResponsiveInputProps> = ({
  placeholder,
  value,
  onChange,
  type = 'text'
}) => {
  const isMobile = useMediaQuery('(max-width:600px)');
  
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
      style={{
        fontSize: isMobile ? '16px' : undefined, // 防止iOS缩放
      }}
    />
  );
};

// 响应式文本区域
interface ResponsiveTextareaProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
}

export const ResponsiveTextarea: React.FC<ResponsiveTextareaProps> = ({
  placeholder,
  value,
  onChange,
  rows = 4
}) => {
  const isMobile = useMediaQuery('(max-width:600px)');
  
  return (
    <textarea
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      rows={rows}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none resize-none"
      style={{
        fontSize: isMobile ? '16px' : undefined, // 防止iOS缩放
      }}
    />
  );
};