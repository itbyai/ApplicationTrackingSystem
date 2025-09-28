# 前端设计规范 (基于实际实现)

## 🎨 设计系统

### 实际使用的色彩规范 (TailwindCSS)

#### 主色调 (实际应用)
```css
/* 根据实际代码中使用的颜色 */
:root {
  /* 主品牌色 - Indigo系列 */
  --primary-50: #eef2ff;
  --primary-100: #e0e7ff;
  --primary-200: #c7d2fe;
  --primary-300: #a5b4fc;
  --primary-400: #818cf8;
  --primary-500: #6366f1;  /* 主色 - indigo-500 */
  --primary-600: #4f46e5;
  --primary-700: #4338ca;
  --primary-800: #3730a3;
  --primary-900: #312e81;
  
  /* 成功状态 - Green系列 */
  --success-50: #f0fdf4;
  --success-100: #dcfce7;
  --success-500: #22c55e;  /* green-500 */
  --success-600: #16a34a;
  --success-700: #15803d;
  
  /* 警告状态 - Yellow/Orange系列 */
  --warning-50: #fefce8;
  --warning-100: #fef3c7;
  --warning-500: #eab308;  /* yellow-500 */
  --warning-600: #ca8a04;
  --warning-700: #a16207;
  
  /* 错误状态 - Red系列 */
  --error-50: #fef2f2;
  --error-100: #fee2e2;
  --error-500: #ef4444;    /* red-500 */
  --error-600: #dc2626;
  --error-700: #b91c1c;
  
  /* 中性色 - Gray系列 */
  --gray-50: #f9fafb;
  --gray-100: #f3f4f6;
  --gray-200: #e5e7eb;
  --gray-300: #d1d5db;
  --gray-400: #9ca3af;
  --gray-500: #6b7280;
  --gray-600: #4b5563;
  --gray-700: #374151;
  --gray-800: #1f2937;
  --gray-900: #111827;
}
```

#### 看板状态色彩 (已实现)
```css
/* 根据实际JobApplicationKanban和KanbanBoard组件 */
:root {
  /* 职位申请状态色彩 */
  --status-interested: var(--gray-500);    /* 感兴趣 - 灰色 */
  --status-applied: var(--primary-500);    /* 已投递 - 蓝色 */
  --status-interview: var(--warning-500);  /* 面试中 - 黄色 */
  --status-finished: var(--gray-600);      /* 已结束 - 深灰色 */
  
  /* 结果状态色彩 */
  --result-offer: var(--success-500);      /* 获得Offer - 绿色 */
  --result-rejected: var(--error-500);     /* 被拒绝 - 红色 */
  
  /* 任务优先级色彩 */
  --priority-low: var(--gray-400);         /* 低优先级 */
  --priority-medium: var(--warning-500);   /* 中优先级 */
  --priority-high: var(--error-500);       /* 高优先级 */
  --priority-urgent: var(--error-600);     /* 紧急 */
}
```

### 布局系统 (已实现)

#### 响应式网格布局
基于TailwindCSS的现代响应式设计：

```css
/* 主要布局容器 - 在所有页面中使用 */
.container-layout {
  max-width: 1280px;    /* max-w-7xl */
  margin: 0 auto;       /* mx-auto */
  padding: 0 1rem;      /* px-4 */
}

@media (min-width: 640px) {
  .container-layout {
    padding: 0 1.5rem;  /* sm:px-6 */
  }
}

@media (min-width: 1024px) {
  .container-layout {
    padding: 0 2rem;    /* lg:px-8 */
  }
}
```

#### 看板网格系统
```css
/* 职位申请看板 - 4列等宽布局 */
.kanban-grid-4 {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;          /* gap-6 */
}

/* 任务管理看板 - 5列等宽布局 */
.kanban-grid-5 {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1.5rem;          /* gap-6 */
}

/* 移动端自适应 */
@media (max-width: 768px) {
  .kanban-grid-4,
  .kanban-grid-5 {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
```

## 🎯 已实现组件库

### 认证组件

#### AuthProvider (核心认证上下文)
```tsx
// 实际实现的认证上下文
interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

// 特性：
// - localStorage持久化
// - 自动状态恢复
// - 完整的错误处理
// - TypeScript类型安全
```

#### ProtectedRoute (路由保护)
```tsx
// 实际实现的路由保护组件
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) return <LoadingSpinner />;
  
  return user ? children : <Navigate to="/login" replace />;
};

// 特性：
// - 自动重定向未认证用户
// - 加载状态处理
// - 无缝用户体验
```

### 看板组件

#### JobApplicationKanban (职位申请看板)
```tsx
// 4阶段职位申请管理
interface JobApplication {
  id: string;
  company: string;
  position: string;
  status: 'interested' | 'applied' | 'interview' | 'finished';
  result?: 'offer' | 'rejected';
  appliedAt: string;
  notes?: string;
}

// 特性：
// - HTML5拖拽API
// - 结果状态标记
// - 响应式grid布局
// - 实时状态更新
```

#### KanbanBoard (任务管理看板)
```tsx
// 5阶段任务管理
interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'done' | 'archived';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee: string;
  tags: string[];
  dueDate: string;
}

// 特性：
// - 拖拽排序
// - 优先级颜色编码
// - 标签系统
// - 团队协作功能
```

### 文件上传组件

#### 多方式文件上传系统
```tsx
// ResumePage和DashboardPage中实现
const FileUploadFeatures = {
  // 1. 点击上传
  clickUpload: {
    implementation: "label + htmlFor方式",
    reliability: "高",
    browser_support: "全部现代浏览器"
  },
  
  // 2. 拖拽上传
  dragUpload: {
    implementation: "HTML5 Drag & Drop API",
    visual_feedback: "拖拽区域高亮",
    file_validation: "类型和大小验证"
  },
  
  // 3. 按钮上传
  buttonUpload: {
    implementation: "备用上传方式",
    fallback: "主要上传失败时的备选方案"
  }
};

// 支持格式：PDF, DOC, DOCX
// 实时进度反馈
// 错误处理和用户提示
```

### 导航组件

#### 顶部导航栏
```tsx
// App.tsx中实现的统一导航
const Navigation = {
  layout: "固定顶部导航",
  responsive: true,
  features: {
    logo: "职位管理平台",
    navigation: [
      "🏠 仪表板",
      "📄 简历管理", 
      "📋 看板管理",
      "📎 上传测试"
    ],
    user_menu: {
      welcome_message: "欢迎，{username}",
      logout_button: "退出登录"
    }
  }
};
```

## 🎨 设计特色 (已实现)

### 视觉设计
- **现代扁平化设计**：简洁的卡片式布局
- **一致的间距系统**：基于TailwindCSS的spacing scale
- **优雅的阴影效果**：shadow-md和shadow-lg的层次感
- **圆角设计语言**：统一的rounded-lg圆角

### 交互设计
- **拖拽反馈**：拖拽时的视觉高亮效果
- **状态指示**：清晰的hover和active状态
- **加载状态**：优雅的loading和过渡动画
- **错误提示**：友好的错误信息显示

### 响应式特性
- **移动优先**：适配手机和平板设备
- **断点系统**：sm/md/lg/xl响应式断点
- **网格自适应**：看板列数根据屏幕宽度调整
- **触控友好**：足够的点击区域和手势支持
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