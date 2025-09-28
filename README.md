# 求职申请管理系统 (Job Application Management System)

一个现代化的全栈求职申请跟踪和管理平台，具备完整的拖拽式看板管理功能。

## 🚀 功能特性

### 已实现功能 ✅
- **用户认证系统** - 完整的登录注册和会话管理
- **简历管理** - 多种方式文件上传（点击、拖拽、按钮）
- **职位申请看板** - 4阶段可视化申请流程管理
- **任务管理看板** - 5阶段拖拽式任务跟踪
- **响应式设计** - 适配所有设备尺寸
- **结果标记** - 智能的Offer/拒绝状态管理

### 规划功能 📋
- **AI简能分析** - OpenAI驱动的简历评分和建议
- **职位匹配** - 智能职位推荐算法
- **数据可视化** - 申请统计和趋势分析

## 🛠 技术栈

### 前端 (已实现)
- **React 18** - 现代化用户界面
- **TypeScript** - 类型安全的JavaScript
- **Vite** - 快速的构建工具
- **TailwindCSS** - 实用优先的CSS框架
- **React Router** - 单页面应用路由

### 后端 (规划中)
- **Node.js** - JavaScript运行时
- **Express** - Web应用框架
- **PostgreSQL** - 关系型数据库
- **Prisma** - 现代数据库ORM
- **OpenAI API** - AI功能集成

## � 项目结构

```
ApplicationTrackingSystem/
├── frontend/                 # 前端应用 (已完成)
│   ├── src/
│   │   ├── components/      # 可重用组件
│   │   │   ├── KanbanBoard.tsx     # 任务看板组件
│   │   │   ├── ProtectedRoute.tsx  # 路由保护
│   │   │   └── Sidebar.tsx         # 侧边栏导航
│   │   ├── contexts/        # React上下文
│   │   │   └── AuthContext.tsx     # 认证上下文
│   │   ├── pages/           # 页面组件
│   │   │   ├── Dashboard.tsx       # 仪表板
│   │   │   ├── JobApplicationKanban.tsx # 申请看板
│   │   │   ├── ResumePage.tsx      # 简历管理
│   │   │   └── LoginPage.tsx       # 登录页面
│   │   └── App.tsx          # 应用入口
│   ├── package.json
│   └── vite.config.ts
├── backend/                 # 后端API (规划中)
├── README.md
└── .gitignore
```
## 🚀 快速开始

### 环境要求
- Node.js 16+ 
- npm 或 yarn
- 现代浏览器支持

### 安装运行

1. **克隆项目**
   ```bash
   git clone https://github.com/your-username/ApplicationTrackingSystem.git
   cd ApplicationTrackingSystem
   ```

2. **安装前端依赖**
   ```bash
   cd frontend
   npm install
   ```

3. **启动开发服务器**
   ```bash
   npm run dev
   ```

4. **访问应用**
   ```
   http://localhost:5173
   ```

## 🎯 使用说明

### 1. 用户认证
- 注册新账户或使用现有账户登录
- 支持记住登录状态

### 2. 简历管理
- **上传简历**：支持PDF、DOC、DOCX格式
- **多种上传方式**：点击选择、拖拽文件、按钮上传
- **文件管理**：查看上传历史和文件状态

### 3. 申请看板管理
- **四阶段流程**：感兴趣 → 已投递 → 面试中 → 已结束
- **拖拽操作**：在不同阶段间移动申请卡片
- **结果标记**：为已结束申请选择Offer或被拒绝
- **统计概览**：实时查看申请数量分布

### 4. 任务看板管理
- **五阶段管理**：待办 → 进行中 → 审核中 → 完成 → 已归档
- **拖拽式操作**：直观的任务状态管理
- **任务详情**：支持任务描述和优先级

## 🔄 申请流程

1. **👀 感兴趣** - 发现心仪职位，记录关注
2. **📤 已投递** - 提交申请材料，等待回复  
3. **💬 面试中** - 进入各轮面试流程
4. **🏁 已结束** - 标记最终结果（Offer/被拒绝）

## 🎨 设计特色

- **居中布局** - 使用max-w-7xl mx-auto确保内容完美居中
- **网格系统** - grid-cols-4等宽列布局，响应式设计
- **交互反馈** - 丰富的hover效果和状态指示
- **色彩编码** - 直观的状态颜色系统
- **拖拽体验** - 流畅的HTML5 Drag & Drop实现

## � 开发状态

### 已完成 ✅
- [x] 完整的用户认证系统（登录/注册/登出）
- [x] 多方式文件上传功能
- [x] 职位申请4阶段拖拽看板
- [x] 任务管理5阶段看板
- [x] 响应式网格布局系统
- [x] 申请结果标记功能

### 进行中 🔄
- [ ] 后端API开发
- [ ] 数据库集成
- [ ] 数据持久化

### 规划中 📋
- [ ] AI简历分析（OpenAI集成）
- [ ] 职位搜索和匹配
- [ ] 邮件提醒系统
- [ ] 数据导出功能
- [ ] 移动端优化
   
   # 前端依赖
   cd ../frontend
   npm install
   ```

3. **环境配置**
   ```bash
   # 复制环境变量配置
   cd backend
   cp .env.example .env
   
   # 编辑环境变量
   # 设置数据库连接、Redis URL、JWT密钥等
   ```

4. **数据库设置**
   ```bash
   # 运行数据库迁移
   cd backend
   npx prisma migrate dev
   
   # 生成Prisma客户端
   npx prisma generate
   
   # (可选) 填充测试数据
   npx prisma db seed
   ```

5. **启动开发服务器**
   ```bash
   # 终端1: 启动后端服务器
   cd backend
   npm run dev
   
   # 终端2: 启动前端服务器
   cd frontend
   npm run dev
   ```

### 访问应用
- 前端: http://localhost:3000
- 后端API: http://localhost:3001
- API文档: http://localhost:3001/api/docs

## 📚 开发指南

### 代码规范
- 使用TypeScript进行类型安全开发
- 遵循ESLint和Prettier配置
- 使用Conventional Commits规范提交信息
## 🤝 贡献指南

欢迎提交Issue和Pull Request！

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 开发规范
- 遵循TypeScript最佳实践
- 使用ESLint保持代码质量
- 编写清晰的commit信息
- 添加适当的注释和文档

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 📧 联系方式

如有问题或建议，请通过以下方式联系：

- 项目Issues: [GitHub Issues](https://github.com/your-username/ApplicationTrackingSystem/issues)
- 邮箱: your-email@example.com

## � 致谢

- React团队提供优秀的前端框架
- TailwindCSS提供美观的UI组件系统
- TypeScript提供类型安全保障
- 开源社区的持续支持和贡献

---

**⭐ 如果这个项目对您有帮助，请给个Star支持一下！**

### Docker部署
```bash
# 构建并启动所有服务
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f
```

### 生产环境
请参考 `docs/design/deployment.md` 获取详细的部署指南。

## 📖 文档

- [系统架构设计](docs/design/system-architecture.md)
- [数据库设计](docs/design/database-design.md)
- [API规范](docs/design/api-specification.md)
- [前端设计规范](docs/design/frontend-design.md)
- [AI集成方案](docs/design/ai-integration.md)
- [UI设计系统](docs/design/ui-design.md)
- [部署指南](docs/design/deployment.md)

## 🤝 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

## 📞 联系信息

如有问题或建议，请通过以下方式联系：

- 项目地址: [GitHub Repository]
- 问题反馈: [GitHub Issues]
- 邮箱: [your-email@example.com]

---

⭐ 如果这个项目对您有帮助，请给我们一个星标！