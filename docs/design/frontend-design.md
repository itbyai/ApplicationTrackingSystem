# 前端设计规范

## 🎨 设计系统

### 色彩规范

#### 主色调
```css
:root {
  /* 主品牌色 */
  --primary-50: #e3f2fd;
  --primary-100: #bbdefb;
  --primary-200: #90caf9;
  --primary-300: #64b5f6;
  --primary-400: #42a5f5;
  --primary-500: #2196f3;  /* 主色 */
  --primary-600: #1e88e5;
  --primary-700: #1976d2;
  --primary-800: #1565c0;
  --primary-900: #0d47a1;
  
  /* 辅助色 */
  --secondary-50: #f3e5f5;
  --secondary-100: #e1bee7;
  --secondary-200: #ce93d8;
  --secondary-300: #ba68c8;
  --secondary-400: #ab47bc;
  --secondary-500: #9c27b0;  /* 辅助色 */
  --secondary-600: #8e24aa;
  --secondary-700: #7b1fa2;
  --secondary-800: #6a1b9a;
  --secondary-900: #4a148c;
  
  /* 成功色 */
  --success-50: #e8f5e8;
  --success-100: #c8e6c9;
  --success-500: #4caf50;
  --success-600: #43a047;
  --success-700: #388e3c;
  
  /* 警告色 */
  --warning-50: #fff8e1;
  --warning-100: #ffecb3;
  --warning-500: #ff9800;
  --warning-600: #fb8c00;
  --warning-700: #f57c00;
  
  /* 错误色 */
  --error-50: #ffebee;
  --error-100: #ffcdd2;
  --error-500: #f44336;
  --error-600: #e53935;
  --error-700: #d32f2f;
  
  /* 中性色 */
  --gray-50: #fafafa;
  --gray-100: #f5f5f5;
  --gray-200: #eeeeee;
  --gray-300: #e0e0e0;
  --gray-400: #bdbdbd;
  --gray-500: #9e9e9e;
  --gray-600: #757575;
  --gray-700: #616161;
  --gray-800: #424242;
  --gray-900: #212121;
  
  /* 文本色 */
  --text-primary: #212121;
  --text-secondary: #757575;
  --text-disabled: #bdbdbd;
  --text-inverse: #ffffff;
}
```

#### 语义化颜色
```css
:root {
  /* 状态颜色 */
  --status-saved: var(--gray-500);
  --status-applied: var(--primary-500);
  --status-interview: var(--warning-500);
  --status-offer: var(--success-500);
  --status-rejected: var(--error-500);
  
  /* 优先级颜色 */
  --priority-low: var(--gray-400);
  --priority-medium: var(--warning-400);
  --priority-high: var(--error-400);
  
  /* 分数颜色 */
  --score-excellent: var(--success-500);  /* 90-100 */
  --score-good: var(--primary-500);       /* 70-89 */
  --score-average: var(--warning-500);    /* 50-69 */
  --score-poor: var(--error-500);         /* <50 */
}
```

### 字体规范

#### 字体族
```css
:root {
  /* 主字体 */
  --font-family-primary: "PingFang SC", "Helvetica Neue", Arial, "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
  
  /* 等宽字体（代码） */
  --font-family-mono: "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace;
  
  /* 标题字体 */
  --font-family-heading: "PingFang SC", "Helvetica Neue", Arial, sans-serif;
}
```

#### 字体大小
```css
:root {
  /* 字体尺寸 */
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.25rem;    /* 20px */
  --text-2xl: 1.5rem;    /* 24px */
  --text-3xl: 1.875rem;  /* 30px */
  --text-4xl: 2.25rem;   /* 36px */
  --text-5xl: 3rem;      /* 48px */
  
  /* 行高 */
  --leading-none: 1;
  --leading-tight: 1.25;
  --leading-snug: 1.375;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;
  --leading-loose: 2;
  
  /* 字重 */
  --font-thin: 100;
  --font-light: 300;
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
  --font-extrabold: 800;
  --font-black: 900;
}
```

### 间距规范
```css
:root {
  /* 间距尺度 */
  --spacing-0: 0;
  --spacing-1: 0.25rem;   /* 4px */
  --spacing-2: 0.5rem;    /* 8px */
  --spacing-3: 0.75rem;   /* 12px */
  --spacing-4: 1rem;      /* 16px */
  --spacing-5: 1.25rem;   /* 20px */
  --spacing-6: 1.5rem;    /* 24px */
  --spacing-8: 2rem;      /* 32px */
  --spacing-10: 2.5rem;   /* 40px */
  --spacing-12: 3rem;     /* 48px */
  --spacing-16: 4rem;     /* 64px */
  --spacing-20: 5rem;     /* 80px */
  --spacing-24: 6rem;     /* 96px */
  --spacing-32: 8rem;     /* 128px */
  
  /* 语义间距 */
  --spacing-component: var(--spacing-4);
  --spacing-section: var(--spacing-8);
  --spacing-page: var(--spacing-12);
}
```

### 圆角规范
```css
:root {
  --radius-none: 0;
  --radius-sm: 0.125rem;   /* 2px */
  --radius-base: 0.25rem;  /* 4px */
  --radius-md: 0.375rem;   /* 6px */
  --radius-lg: 0.5rem;     /* 8px */
  --radius-xl: 0.75rem;    /* 12px */
  --radius-2xl: 1rem;      /* 16px */
  --radius-3xl: 1.5rem;    /* 24px */
  --radius-full: 9999px;
}
```

### 阴影规范
```css
:root {
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-base: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  --shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  --shadow-inner: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
  --shadow-none: none;
}
```

## 🧩 组件库

### 按钮组件
```tsx
// Button.tsx
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost' | 'danger';
  size: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  children,
  onClick
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500',
    secondary: 'bg-secondary-500 text-white hover:bg-secondary-600 focus:ring-secondary-500',
    ghost: 'bg-transparent text-primary-500 hover:bg-primary-50 focus:ring-primary-500',
    danger: 'bg-error-500 text-white hover:bg-error-600 focus:ring-error-500'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading && <LoadingSpinner className="mr-2" />}
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};
```

### 输入框组件
```tsx
// Input.tsx
interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel';
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  helperText?: string;
  label?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
}

const Input: React.FC<InputProps> = ({
  type = 'text',
  placeholder,
  value,
  defaultValue,
  disabled = false,
  required = false,
  error,
  helperText,
  label,
  leftIcon,
  rightIcon,
  onChange,
  onBlur,
  onFocus
}) => {
  const inputClasses = `
    w-full px-3 py-2 border rounded-md text-sm transition-colors
    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
    ${error ? 'border-error-500' : 'border-gray-300 hover:border-gray-400'}
    ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}
    ${leftIcon ? 'pl-10' : ''}
    ${rightIcon ? 'pr-10' : ''}
  `;
  
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-error-500">*</span>}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {leftIcon}
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          defaultValue={defaultValue}
          disabled={disabled}
          required={required}
          className={inputClasses}
          onChange={(e) => onChange?.(e.target.value)}
          onBlur={onBlur}
          onFocus={onFocus}
        />
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {rightIcon}
          </div>
        )}
      </div>
      {(error || helperText) && (
        <p className={`mt-1 text-sm ${error ? 'text-error-500' : 'text-gray-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
};
```

### 卡片组件
```tsx
// Card.tsx
interface CardProps {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  padding?: 'sm' | 'md' | 'lg';
  shadow?: boolean;
  border?: boolean;
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  actions,
  padding = 'md',
  shadow = true,
  border = true,
  children
}) => {
  const cardClasses = `
    bg-white rounded-lg
    ${shadow ? 'shadow-md hover:shadow-lg transition-shadow' : ''}
    ${border ? 'border border-gray-200' : ''}
  `;
  
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };
  
  return (
    <div className={cardClasses}>
      {(title || subtitle || actions) && (
        <div className={`${paddingClasses[padding]} border-b border-gray-200`}>
          <div className="flex items-start justify-between">
            <div>
              {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
              {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
            </div>
            {actions && <div className="flex items-center space-x-2">{actions}</div>}
          </div>
        </div>
      )}
      <div className={paddingClasses[padding]}>{children}</div>
    </div>
  );
};
```

### 状态标签组件
```tsx
// StatusBadge.tsx
interface StatusBadgeProps {
  status: 'SAVED' | 'APPLIED' | 'INTERVIEW' | 'OFFER' | 'REJECTED' | 'WITHDRAWN';
  size?: 'sm' | 'md' | 'lg';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const statusConfig = {
    SAVED: { label: '已保存', color: 'gray' },
    APPLIED: { label: '已申请', color: 'blue' },
    INTERVIEW: { label: '面试中', color: 'orange' },
    OFFER: { label: '已获得Offer', color: 'green' },
    REJECTED: { label: '已拒绝', color: 'red' },
    WITHDRAWN: { label: '已撤回', color: 'gray' }
  };
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-2.5 py-1.5 text-sm',
    lg: 'px-3 py-2 text-base'
  };
  
  const config = statusConfig[status];
  const colorClasses = {
    gray: 'bg-gray-100 text-gray-800',
    blue: 'bg-blue-100 text-blue-800',
    orange: 'bg-orange-100 text-orange-800',
    green: 'bg-green-100 text-green-800',
    red: 'bg-red-100 text-red-800'
  };
  
  return (
    <span className={`inline-flex items-center font-medium rounded-full ${sizeClasses[size]} ${colorClasses[config.color]}`}>
      {config.label}
    </span>
  );
};
```

## 📱 响应式设计

### 断点系统
```css
:root {
  --breakpoint-sm: 640px;   /* 手机 */
  --breakpoint-md: 768px;   /* 平板 */
  --breakpoint-lg: 1024px;  /* 桌面 */
  --breakpoint-xl: 1280px;  /* 大桌面 */
  --breakpoint-2xl: 1536px; /* 超大桌面 */
}
```

### 响应式布局
```tsx
// Layout.tsx
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 移动端导航 */}
      <MobileNavigation className="lg:hidden" />
      
      <div className="lg:flex">
        {/* 侧边栏 - 桌面端 */}
        <Sidebar className="hidden lg:flex lg:w-64 lg:fixed lg:inset-y-0" />
        
        {/* 主内容区 */}
        <main className="flex-1 lg:ml-64">
          <div className="px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
```

### 响应式网格
```tsx
// 响应式网格示例
const JobGrid: React.FC<{ jobs: Job[] }> = ({ jobs }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {jobs.map(job => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
};
```

## 🎭 动画规范

### 过渡动画
```css
/* 标准过渡 */
.transition-standard {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 快速过渡 */
.transition-fast {
  transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 慢速过渡 */
.transition-slow {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### 加载动画
```css
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(-25%);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: translateY(0);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
}
```

## 📐 页面布局

### 仪表盘布局
```tsx
const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* 头部统计 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="总简历" value="3" />
        <StatCard title="已申请" value="12" />
        <StatCard title="面试中" value="3" />
        <StatCard title="已获得Offer" value="1" />
      </div>
      
      {/* 图表区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="申请趋势">
          <ApplicationTrendChart />
        </Card>
        <Card title="状态分布">
          <StatusDistributionChart />
        </Card>
      </div>
      
      {/* 最近活动 */}
      <Card title="最近活动">
        <RecentActivityList />
      </Card>
    </div>
  );
};
```

### 表单布局
```tsx
const ProfileForm: React.FC = () => {
  return (
    <form className="space-y-6">
      {/* 基本信息 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium mb-4">基本信息</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="姓" required />
          <Input label="名" required />
          <Input label="邮箱" type="email" required />
          <Input label="手机号" type="tel" required />
        </div>
      </div>
      
      {/* 职业偏好 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium mb-4">职业偏好</h3>
        <div className="space-y-4">
          <Input label="期望职位" />
          <Input label="期望地点" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="期望薪资（最低）" type="number" />
            <Input label="期望薪资（最高）" type="number" />
          </div>
        </div>
      </div>
      
      {/* 操作按钮 */}
      <div className="flex justify-end space-x-3">
        <Button variant="ghost">取消</Button>
        <Button variant="primary">保存</Button>
      </div>
    </form>
  );
};
```

## 🌙 深色模式支持

### CSS变量切换
```css
:root {
  --bg-primary: #ffffff;
  --bg-secondary: #f8f9fa;
  --text-primary: #212121;
  --text-secondary: #757575;
  --border-color: #e0e0e0;
}

[data-theme="dark"] {
  --bg-primary: #1a1a1a;
  --bg-secondary: #2d2d2d;
  --text-primary: #ffffff;
  --text-secondary: #b0b0b0;
  --border-color: #404040;
}
```

### 主题切换Hook
```tsx
// useTheme.ts
export const useTheme = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);
  
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };
  
  return { theme, toggleTheme };
};
```