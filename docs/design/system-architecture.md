# 系统架构设计

## 🏗️ 整体架构

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   前端 (React)   │    │  后端 (Node.js)  │    │   数据库 (PG)    │
│                │    │                │    │                │
│  ┌──────────┐   │    │  ┌──────────┐   │    │  ┌──────────┐   │
│  │   UI     │   │    │  │   API    │   │    │  │  Tables  │   │
│  │ 组件库    │   │────┤  │  Routes  │   │────┤  │   数据   │   │
│  │          │   │    │  │          │   │    │  │   存储   │   │
│  └──────────┘   │    │  └──────────┘   │    │  └──────────┘   │
│                │    │                │    │                │
│  ┌──────────┐   │    │  ┌──────────┐   │    │  ┌──────────┐   │
│  │ 状态管理  │   │    │  │ 业务逻辑  │   │    │  │  索引    │   │
│  │(Redux)   │   │    │  │ Services │   │    │  │ Indexes  │   │
│  └──────────┘   │    │  └──────────┘   │    │  └──────────┘   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   AI 服务层      │    │   文件存储       │    │   缓存层 (Redis) │
│                │    │  (AWS S3/本地)   │    │                │
│  ┌──────────┐   │    │  ┌──────────┐   │    │  ┌──────────┐   │
│  │ OpenAI   │   │    │  │  简历    │   │    │  │  会话    │   │
│  │   API    │   │    │  │  文件    │   │    │  │  数据    │   │
│  └──────────┘   │    │  └──────────┘   │    │  └──────────┘   │
│                │    │                │    │                │
│  ┌──────────┐   │    │  ┌──────────┐   │    │  ┌──────────┐   │
│  │ 分析引擎  │   │    │  │  用户    │   │    │  │ API      │   │
│  │  模块    │   │    │  │  头像    │   │    │  │ 缓存     │   │
│  └──────────┘   │    │  └──────────┘   │    │  └──────────┘   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🎯 前端架构 (React + TypeScript)

### 组件结构
```
frontend/src/
├── components/           # 可复用组件
│   ├── common/          # 通用组件
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Modal/
│   │   └── Loading/
│   ├── layout/          # 布局组件
│   │   ├── Header/
│   │   ├── Sidebar/
│   │   ├── Footer/
│   │   └── Navigation/
│   └── domain/          # 业务组件
│       ├── Resume/
│       ├── Job/
│       ├── Application/
│       └── Analysis/
│
├── pages/               # 页面组件
│   ├── Login/
│   ├── Dashboard/
│   ├── Resume/
│   ├── Jobs/
│   ├── Applications/
│   └── Profile/
│
├── hooks/               # 自定义 Hooks
│   ├── useAuth.ts
│   ├── useApi.ts
│   ├── useLocalStorage.ts
│   └── useDebounce.ts
│
├── services/            # API 服务
│   ├── authService.ts
│   ├── resumeService.ts
│   ├── jobService.ts
│   └── aiService.ts
│
├── store/               # 状态管理 (Redux Toolkit)
│   ├── slices/
│   │   ├── authSlice.ts
│   │   ├── resumeSlice.ts
│   │   └── jobSlice.ts
│   └── store.ts
│
├── utils/               # 工具函数
│   ├── validation.ts
│   ├── formatters.ts
│   ├── constants.ts
│   └── helpers.ts
│
└── types/               # TypeScript 类型
    ├── auth.ts
    ├── resume.ts
    ├── job.ts
    └── api.ts
```

### 状态管理策略
- **全局状态**: Redux Toolkit 管理用户认证、简历数据、职位信息
- **组件状态**: React useState 管理局部UI状态
- **服务器状态**: React Query 管理API数据缓存和同步
- **表单状态**: React Hook Form 管理复杂表单

### 路由设计
```typescript
// 路由结构
/                    # 首页/登录
/dashboard           # 仪表盘
/resume              # 简历管理
  /upload            # 上传简历
  /edit/:id          # 编辑简历
  /analysis/:id      # 简历分析
/jobs                # 职位管理
  /search            # 搜索职位
  /saved             # 收藏职位
  /applications      # 申请记录
/profile             # 个人设置
/settings            # 系统设置
```

## ⚙️ 后端架构 (Node.js + Express)

### 服务层结构
```
backend/src/
├── controllers/         # 控制器层
│   ├── authController.ts
│   ├── resumeController.ts
│   ├── jobController.ts
│   └── aiController.ts
│
├── routes/             # 路由层
│   ├── auth.ts
│   ├── resume.ts
│   ├── jobs.ts
│   └── ai.ts
│
├── services/           # 业务逻辑层
│   ├── authService.ts
│   ├── resumeService.ts
│   ├── jobService.ts
│   ├── aiService.ts
│   └── fileService.ts
│
├── models/             # 数据模型层 (Prisma)
│   ├── User.ts
│   ├── Resume.ts
│   ├── Job.ts
│   └── Application.ts
│
├── middleware/         # 中间件
│   ├── auth.ts         # 身份验证
│   ├── validation.ts   # 数据验证
│   ├── errorHandler.ts # 错误处理
│   └── rateLimit.ts    # 速率限制
│
├── utils/              # 工具函数
│   ├── jwt.ts          # JWT 处理
│   ├── encryption.ts   # 加密解密
│   ├── fileParser.ts   # 文件解析
│   └── logger.ts       # 日志记录
│
└── config/             # 配置文件
    ├── database.ts     # 数据库配置
    ├── redis.ts        # Redis 配置
    └── ai.ts          # AI 服务配置
```

### API 设计模式
```typescript
// RESTful API 设计
GET    /api/v1/auth/me              # 获取当前用户
POST   /api/v1/auth/login           # 用户登录
POST   /api/v1/auth/register        # 用户注册

GET    /api/v1/resumes              # 获取简历列表
POST   /api/v1/resumes              # 上传简历
GET    /api/v1/resumes/:id          # 获取特定简历
PUT    /api/v1/resumes/:id          # 更新简历
DELETE /api/v1/resumes/:id          # 删除简历

POST   /api/v1/ai/analyze-resume    # AI简历分析
POST   /api/v1/ai/match-jobs        # AI职位匹配
POST   /api/v1/ai/score-resume      # AI简历评分

GET    /api/v1/jobs                 # 获取职位列表
POST   /api/v1/jobs                 # 创建职位记录
GET    /api/v1/jobs/:id             # 获取特定职位
PUT    /api/v1/jobs/:id             # 更新职位状态
```

## 🗄️ 数据库设计 (PostgreSQL + Prisma)

### 核心数据模型
```prisma
// 用户模型
model User {
  id          String   @id @default(cuid())
  email       String   @unique
  password    String
  firstName   String
  lastName    String
  avatar      String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  resumes     Resume[]
  jobs        Job[]
  applications Application[]
  
  @@map("users")
}

// 简历模型
model Resume {
  id          String   @id @default(cuid())
  userId      String
  title       String
  content     Json     # 结构化简历内容
  filePath    String?  # 原始文件路径
  fileType    String?  # 文件类型
  analysis    Json?    # AI分析结果
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  user        User     @relation(fields: [userId], references: [id])
  applications Application[]
  
  @@map("resumes")
}

// 职位模型
model Job {
  id           String   @id @default(cuid())
  userId       String
  title        String
  company      String
  description  String
  requirements String
  salary       String?
  location     String
  source       String   # 来源网站
  sourceUrl    String?  # 原始链接
  status       JobStatus @default(SAVED)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  
  user         User     @relation(fields: [userId], references: [id])
  applications Application[]
  
  @@map("jobs")
}

// 申请记录模型
model Application {
  id          String   @id @default(cuid())
  userId      String
  resumeId    String
  jobId       String
  status      ApplicationStatus @default(APPLIED)
  appliedAt   DateTime @default(now())
  notes       String?
  timeline    Json?    # 申请时间线
  matchScore  Float?   # AI匹配分数
  
  user        User     @relation(fields: [userId], references: [id])
  resume      Resume   @relation(fields: [resumeId], references: [id])
  job         Job      @relation(fields: [jobId], references: [id])
  
  @@map("applications")
}

enum JobStatus {
  SAVED
  APPLIED
  INTERVIEW
  OFFER
  REJECTED
  WITHDRAWN
}

enum ApplicationStatus {
  APPLIED
  SCREENING
  INTERVIEW_SCHEDULED
  INTERVIEW_COMPLETED
  OFFER_RECEIVED
  OFFER_ACCEPTED
  OFFER_DECLINED
  REJECTED
  WITHDRAWN
}
```

### 数据库索引策略
```sql
-- 用户查询优化
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);

-- 简历查询优化
CREATE INDEX idx_resumes_user_id ON resumes(user_id);
CREATE INDEX idx_resumes_created_at ON resumes(created_at);

-- 职位查询优化
CREATE INDEX idx_jobs_user_id ON jobs(user_id);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_company ON jobs(company);
CREATE INDEX idx_jobs_location ON jobs(location);

-- 申请记录优化
CREATE INDEX idx_applications_user_id ON applications(user_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_applied_at ON applications(applied_at);
```

## 🤖 AI 服务架构

### AI 服务模块
```typescript
// AI 服务抽象层
interface AIService {
  analyzeResume(content: string): Promise<ResumeAnalysis>
  matchJobs(resume: Resume, jobs: Job[]): Promise<JobMatch[]>
  scoreResume(resume: Resume, job: Job): Promise<MatchScore>
  generateSuggestions(analysis: ResumeAnalysis): Promise<Suggestion[])
}

// OpenAI 服务实现
class OpenAIService implements AIService {
  private client: OpenAI
  
  async analyzeResume(content: string): Promise<ResumeAnalysis> {
    const prompt = `分析以下简历内容，提取关键信息...`
    const response = await this.client.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3
    })
    return this.parseAnalysisResponse(response)
  }
}
```

### AI 功能模块
1. **简历解析器**: 提取技能、经验、教育背景
2. **职位匹配器**: 语义匹配算法
3. **评分引擎**: 多维度评分系统
4. **建议生成器**: 个性化改进建议

## 🔒 安全架构

### 认证与授权
```typescript
// JWT 认证策略
interface JWTPayload {
  userId: string
  email: string
  role: string
  iat: number
  exp: number
}

// 权限控制中间件
const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'Token required' })
  
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload
    req.user = payload
    next()
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' })
  }
}
```

### 数据安全
- **传输加密**: HTTPS/TLS 1.3
- **存储加密**: AES-256 加密敏感数据
- **密码安全**: bcrypt 哈希 + 盐值
- **API安全**: 速率限制、输入验证、CORS配置

## 📈 性能优化策略

### 前端优化
- **代码分割**: 路由级别的懒加载
- **缓存策略**: Service Worker + HTTP缓存
- **图片优化**: WebP格式 + CDN加速
- **打包优化**: Tree Shaking + 压缩

### 后端优化
- **数据库优化**: 查询优化 + 连接池
- **缓存层**: Redis 缓存热点数据
- **异步处理**: Bull队列处理耗时任务
- **负载均衡**: PM2 集群模式

### 监控与调试
- **性能监控**: New Relic / DataDog
- **错误跟踪**: Sentry
- **日志系统**: Winston + ELK Stack
- **健康检查**: /health 端点监控