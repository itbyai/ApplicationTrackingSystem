# 用户界面设计 (基于实际实现)

## 🎨 整体设计理念

基于现代Material Design和简洁主义的设计原则，创造出既专业又用户友好的求职管理界面。

### 设计原则
- **简洁明了**：去除冗余元素，突出核心功能
- **一致性**：统一的视觉语言和交互模式
- **可访问性**：符合WCAG标准的无障碍设计
- **响应式**：适配所有设备和屏幕尺寸

## 🏠 页面结构设计 (已实现)

### 1. 认证页面 (LoginPage & RegisterPage)

#### 实际实现特性
- **简洁表单设计**：居中布局，清晰的输入字段
- **品牌标识**：顶部品牌名称展示
- **表单验证**：前端实时验证和错误提示
- **响应式布局**：移动端友好的表单布局
- **路由导航**：登录和注册页面间的无缝切换

```tsx
// 实际布局结构
<div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
  <div className="sm:mx-auto sm:w-full sm:max-w-md">
    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
      登录到您的账户
    </h2>
  </div>
  <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
      {/* 表单内容 */}
    </div>
  </div>
</div>
```

### 2. 仪表盘页面 (DashboardPage)

#### 实际实现的功能模块
```tsx
// 统计卡片布局 (已实现)
<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
  {/* 简历数量统计 */}
  <StatCard title="简历版本" count="3" icon="📄" color="blue" />
  
  {/* 职位申请统计 */}
  <StatCard title="职位申请" count="12" icon="💼" color="green" />
  
  {/* 面试邀请统计 */}
  <StatCard title="面试邀请" count="5" icon="📞" color="yellow" />
  
  {/* AI分析统计 */}
  <StatCard title="AI分析" count="8" icon="🤖" color="purple" />
</div>
```

#### 文件上传功能 (已实现)
- **多方式上传**：点击、拖拽、按钮三种上传方式
- **实时反馈**：上传进度和状态显示
- **格式验证**：支持PDF、DOC、DOCX格式
- **拖拽区域**：视觉化的拖拽上传区域

### 3. 简历管理页面 (ResumePage)

#### 实际实现特性
```tsx
// 文件上传区域布局
<div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
  <div className="text-center">
    <div className="mx-auto h-12 w-12 text-gray-400">
      <svg>📄</svg>
    </div>
    <div className="mt-4">
      <label htmlFor="file-upload" className="cursor-pointer">
        <span className="mt-2 block text-sm font-medium text-gray-900">
          点击上传简历或拖拽文件到此处
        </span>
      </label>
      <input id="file-upload" name="file-upload" type="file" className="sr-only" />
    </div>
    <p className="mt-1 text-sm text-gray-500">
      PNG, JPG, PDF 格式，最大 10MB
    </p>
  </div>
</div>
```

### 4. 看板管理页面 (KanbanPage)

#### 双看板系统 (已实现)
- **选项卡切换**：职位申请看板 vs 任务管理看板
- **统一布局**：相同的视觉设计语言

```tsx
// 选项卡导航 (已实现)
<div className="border-b border-gray-200">
  <nav className="-mb-px flex space-x-8">
    <button className={`${activeTab === 'jobs' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500'} whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm`}>
      职位申请看板
    </button>
    <button className={`${activeTab === 'tasks' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500'} whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm`}>
      任务管理看板
    </button>
  </nav>
</div>
```

#### 职位申请看板 (4列布局)
```tsx
// 实际的4阶段布局
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  <Column title="👀 感兴趣" color="gray" />
  <Column title="📤 已投递" color="blue" />
  <Column title="💬 面试中" color="yellow" />
  <Column title="🏁 已结束" color="gray" />
</div>
```

#### 任务管理看板 (5列布局)  
```tsx
// 实际的5阶段布局
<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
  <Column title="📋 待办" color="gray" />
  <Column title="⚡ 进行中" color="blue" />
  <Column title="🔍 审核中" color="yellow" />
  <Column title="✅ 完成" color="green" />
  <Column title="📦 已归档" color="gray" />
</div>
```

### 5. 拖拽交互设计 (已实现)

#### HTML5 Drag & Drop实现
```tsx
// 拖拽处理逻辑
const handleDragStart = (e: DragEvent, item: any) => {
  e.dataTransfer?.setData('text/plain', JSON.stringify(item));
  setDraggedItem(item);
};

const handleDrop = (e: DragEvent, targetStatus: string) => {
  e.preventDefault();
  const item = JSON.parse(e.dataTransfer?.getData('text/plain') || '{}');
  updateItemStatus(item.id, targetStatus);
  setDraggedItem(null);
};
```

#### 视觉反馈
- **拖拽高亮**：拖拽时卡片半透明效果
- **放置区域指示**：目标列高亮边框
- **平滑过渡**：CSS transition动画效果

## 📱 移动端适配 (已实现)

### 响应式断点
```css
/* 移动端 (< 768px) */
.kanban-mobile {
  grid-template-columns: 1fr;
  gap: 1rem;
}

/* 平板端 (768px - 1024px) */
.kanban-tablet {
  grid-template-columns: repeat(2, 1fr);
}

/* 桌面端 (> 1024px) */
.kanban-desktop {
  grid-template-columns: repeat(4, 1fr); /* 或 repeat(5, 1fr) */
}
```

### 触控优化
- **点击区域**：最小44px触控目标
- **滑动手势**：移动端的左右滑动导航
- **触控反馈**：触摸时的视觉反馈效果

## 🎨 UI组件规范 (已实现)

### 卡片组件
```tsx
// 统一的卡片设计
<div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-4 border border-gray-200">
  {/* 卡片内容 */}
</div>
```

### 按钮系统
```tsx
// 主要按钮样式
<button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200">
  主要操作
</button>

// 次要按钮样式  
<button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md transition-colors duration-200">
  次要操作
</button>
```

### 状态指示器
```tsx
// 结果状态徽章
<span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
  result === 'offer' 
    ? 'bg-green-100 text-green-800' 
    : 'bg-red-100 text-red-800'
}`}>
  {result === 'offer' ? '🎉 获得Offer' : '❌ 被拒绝'}
</span>
```

## 🔄 交互动效 (已实现)

### CSS过渡效果
- **悬停效果**：`hover:shadow-lg transition-shadow`
- **颜色变化**：`hover:bg-blue-700 transition-colors`
- **拖拽动画**：拖拽时的平滑移动效果

### 加载状态
- **上传进度**：文件上传时的实时进度条
- **状态更新**：看板卡片移动时的动画效果

## ♿ 可访问性设计 (已考虑)

### 键盘导航
- **Tab索引**：逻辑的键盘导航顺序
- **焦点指示**：清晰的焦点可见性
- **快捷键**：主要功能的键盘快捷键

### 语义化HTML
- **标题层级**：正确的h1-h6标题结构
- **表单标签**：所有输入字段的关联标签
- **ARIA标签**：屏幕阅读器友好的标记

### 颜色对比
- **文本对比度**：符合WCAG AA标准
- **状态区分**：不仅依赖颜色区分状态
- **高对比模式**：支持系统高对比度设置

### 2. 仪表盘页面

#### 页面布局
```
┌───────────────────────────────────────────────────────────┐
│ 顶部导航栏                                                 │
├─────────────┬─────────────────────────────────────────────┤
│             │  欢迎回来，张三！                             │
│             │  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐           │
│             │  │ 3   │ │ 25  │ │ 12  │ │ 2   │           │
│   侧边栏    │  │简历  │ │职位  │ │申请  │ │面试  │           │
│             │  └─────┘ └─────┘ └─────┘ └─────┘           │
│             │                                           │
│             │  ┌───────────────┬───────────────────────┐ │
│             │  │   申请趋势     │     状态分布           │ │
│             │  │   📊图表      │     🥧饼图            │ │
│             │  │               │                       │ │
│             │  └───────────────┴───────────────────────┘ │
│             │                                           │
│             │  ┌─────────────────────────────────────┐   │
│             │  │         最近活动                     │   │
│             │  │  🔵 更新了简历 "前端开发工程师"      │   │
│             │  │  🟢 申请了阿里巴巴前端职位           │   │
│             │  │  🟡 收到腾讯面试邀请                │   │
│             │  └─────────────────────────────────────┘   │
└─────────────┴─────────────────────────────────────────────┘
```

#### 功能模块
1. **统计卡片**: 关键数据一目了然
2. **趋势图表**: 申请活动和成功率趋势
3. **状态分布**: 各阶段申请数量分布
4. **活动时间线**: 最近操作记录
5. **快捷操作**: 常用功能快速入口

### 3. 简历管理页面

#### 页面布局
```
┌───────────────────────────────────────────────────────────┐
│  简历管理                    [ + 上传简历 ] [ 批量操作 ]    │
├───────────────────────────────────────────────────────────┤
│                                                           │
│  ┌─ 简历列表 ─────────────────────────────────────────┐    │
│  │                                                   │    │
│  │  ┌───────────────────────────────────────────┐   │    │
│  │  │ 📄 前端开发工程师简历                 ⭐ │   │    │
│  │  │ PDF • 2.1MB • 2024-01-15            │    │   │    │
│  │  │ ✅ 已分析 • 评分: 85/100             │    │   │    │
│  │  │ [ 查看 ] [ 编辑 ] [ 下载 ] [ 分析 ]   │    │   │    │
│  │  └───────────────────────────────────────────┘   │    │
│  │                                                   │    │
│  │  ┌───────────────────────────────────────────┐   │    │
│  │  │ 📄 全栈开发工程师简历                     │   │    │
│  │  │ DOCX • 1.8MB • 2024-01-10                │   │    │
│  │  │ ⏳ 等待分析                              │   │    │
│  │  │ [ 查看 ] [ 编辑 ] [ 下载 ] [ 分析 ]       │   │    │
│  │  └───────────────────────────────────────────┘   │    │
│  │                                                   │    │
│  └───────────────────────────────────────────────────┘    │
│                                                           │
│  ┌─ AI分析结果 ─────────────────────────────────────┐     │
│  │  ✨ 技能分析                                     │     │
│  │  🎯 匹配建议                                     │     │
│  │  📊 评分详情                                     │     │
│  └─────────────────────────────────────────────────┘     │
└───────────────────────────────────────────────────────────┘
```

#### 关键功能
1. **简历上传**: 拖拽上传，支持PDF/DOC/DOCX
2. **版本管理**: 多版本简历对比和管理
3. **AI分析**: 自动解析和评分
4. **实时预览**: 简历内容预览和编辑
5. **导出功能**: 多格式导出和分享

### 4. 职位管理页面

#### 页面布局
```
┌───────────────────────────────────────────────────────────┐
│ 职位管理                                                   │
├───────────────────────────────────────────────────────────┤
│ ┌─ 筛选条件 ─┐                                            │
│ │ 状态: 全部▼ │  搜索: [________________] [🔍]            │
│ │ 公司: 全部▼ │  [ + 添加职位 ]                          │
│ │ 地点: 全部▼ │                                          │
│ └────────────┘                                            │
│                                                           │
│ ┌─ 职位列表 ─────────────────────────────────────────────┐│
│ │                                                       ││
│ │ ┌─────────────────────────────────────────────────┐   ││
│ │ │ 前端开发工程师                            [❤️收藏] │   ││
│ │ │ 阿里巴巴集团 • 杭州 • 20K-35K                   │   ││
│ │ │ 🔵 已申请 • 2024-01-15                         │   ││
│ │ │ AI匹配度: ██████████ 87%                       │   ││
│ │ │ [ 查看详情 ] [ 更新状态 ] [ AI分析 ]            │   ││
│ │ └─────────────────────────────────────────────────┘   ││
│ │                                                       ││
│ │ ┌─────────────────────────────────────────────────┐   ││
│ │ │ React开发工程师                           [♡收藏] │   ││
│ │ │ 字节跳动 • 北京 • 25K-40K                       │   ││
│ │ │ ⚪ 已保存 • 2024-01-14                         │   ││
│ │ │ AI匹配度: ████████░░ 76%                       │   ││
│ │ │ [ 查看详情 ] [ 申请职位 ] [ AI分析 ]            │   ││
│ │ └─────────────────────────────────────────────────┘   ││
│ └───────────────────────────────────────────────────────┘│
└───────────────────────────────────────────────────────────┘
```

#### 状态管理
- **已保存** (灰色圆圈): 感兴趣的职位
- **已申请** (蓝色圆圈): 已提交申请
- **面试中** (橙色圆圈): 面试安排中
- **已获得Offer** (绿色圆圈): 收到录用通知  
- **已拒绝** (红色圆圈): 被拒绝申请
- **已撤回** (灰色划线): 主动撤回申请

### 5. 申请跟踪页面

#### 页面布局
```
┌───────────────────────────────────────────────────────────┐
│ 申请跟踪                                                   │
├───────────────────────────────────────────────────────────┤
│                                                           │
│ ┌─ 申请漏斗 ─────────────────────────────────────────────┐ │
│ │ 已申请(12) → 筛选(8) → 面试(3) → Offer(1) → 入职(0)   │ │
│ │ ████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░                │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                           │
│ ┌─ 申请列表 ─────────────────────────────────────────────┐ │
│ │                                                       │ │
│ │ ┌───────────────────────────────────────────────────┐ │ │
│ │ │ 阿里巴巴 - 前端开发工程师              🔵 面试中   │ │ │
│ │ │ 申请时间: 2024-01-15                             │ │ │
│ │ │ 使用简历: 前端开发工程师简历.pdf                  │ │ │
│ │ │ AI匹配度: 87% • 下次跟进: 2024-01-20             │ │ │
│ │ │                                                 │ │ │
│ │ │ 时间线:                                          │ │ │
│ │ │ ✅ 2024-01-15 提交申请                          │ │ │
│ │ │ ✅ 2024-01-17 通过简历筛选                      │ │ │
│ │ │ 🔄 2024-01-18 安排技术面试                      │ │ │
│ │ │ ⏳ 等待最终结果...                              │ │ │
│ │ │                                                 │ │ │
│ │ │ [ 更新状态 ] [ 添加备注 ] [ 查看详情 ]           │ │ │
│ │ └───────────────────────────────────────────────────┘ │ │
│ └───────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────┘
```

#### 时间线功能
- **状态节点**: 可视化申请进展
- **时间戳**: 记录每个阶段的时间
- **备注功能**: 添加面试反馈和心得
- **提醒设置**: 跟进提醒和截止日期

### 6. AI分析页面

#### 页面布局
```
┌───────────────────────────────────────────────────────────┐
│ AI智能分析                                                 │
├───────────────────────────────────────────────────────────┤
│                                                           │
│ ┌─ 简历分析 ─────────────────────────────────────────────┐ │
│ │  选择简历: [前端开发工程师简历 ▼]  [ 开始分析 ]        │ │
│ │                                                       │ │
│ │  ┌─ 分析结果 ─────────────────────────────────────────┐│ │
│ │  │  🎯 综合评分: 85/100                              ││ │
│ │  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ ││ │
│ │  │                                                   ││ │
│ │  │  📊 详细评分:                                      ││ │
│ │  │  • 技能匹配   ████████░░ 80%                      ││ │
│ │  │  • 工作经验   █████████░ 85%                      ││ │
│ │  │  • 项目经验   ████████░░ 82%                      ││ │
│ │  │  • 教育背景   ████████░░ 90%                      ││ │
│ │  │  • 简历质量   █████████░ 92%                      ││ │
│ │  │                                                   ││ │
│ │  │  ✅ 优势:                                          ││ │
│ │  │  • 前端技术栈完整，熟练掌握React生态                ││ │
│ │  │  • 有大型项目经验，解决过性能优化问题              ││ │
│ │  │  • 学习能力强，技术更新及时                        ││ │
│ │  │                                                   ││ │
│ │  │  ⚠️ 改进建议:                                       ││ │
│ │  │  • 建议补充团队协作和项目管理经验描述              ││ │
│ │  │  • 可以学习一些后端技术，成为全栈开发者            ││ │
│ │  │  • 增加开源项目贡献，提升个人影响力                ││ │
│ │  └───────────────────────────────────────────────────┘│ │
│ └───────────────────────────────────────────────────────┘ │
│                                                           │
│ ┌─ 职位匹配 ─────────────────────────────────────────────┐ │
│ │  选择简历: [前端开发工程师简历 ▼]                      │ │
│ │  匹配范围: [收藏的职位 ▼]  [ 开始匹配 ]                │ │
│ │                                                       │ │
│ │  ┌─ 匹配结果 ─────────────────────────────────────────┐│ │
│ │  │  📋 共找到 8 个匹配职位，按匹配度排序:              ││ │
│ │  │                                                   ││ │
│ │  │  🥇 阿里巴巴 - 前端开发工程师                      ││ │
│ │  │     匹配度: ██████████ 87%                        ││ │
│ │  │     💪 优势: React经验丰富，技术栈匹配               ││ │
│ │  │     📚 差距: 缺少微信小程序开发经验                  ││ │
│ │  │                                                   ││ │
│ │  │  🥈 字节跳动 - React开发工程师                     ││ │
│ │  │     匹配度: ████████░░ 76%                        ││ │
│ │  │     💪 优势: React和TypeScript经验符合要求           ││ │
│ │  │     📚 差距: 需要更多移动端开发经验                  ││ │
│ │  └───────────────────────────────────────────────────┘│ │
│ └───────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────┘
```

#### AI功能特性
1. **实时分析**: 即时生成分析结果
2. **可视化评分**: 直观的进度条和图表
3. **个性化建议**: 针对性的改进建议
4. **批量匹配**: 一次性匹配多个职位
5. **对比分析**: 不同简历版本对比

### 7. 个人设置页面

#### 页面布局
```
┌───────────────────────────────────────────────────────────┐
│ 个人设置                                                   │
├───────────────────────────────────────────────────────────┤
│                                                           │
│ ┌─ 基本信息 ─────────────────────────────────────────────┐ │
│ │  头像:  👤               姓名: [张三_________]        │ │
│ │        [ 上传头像 ]       邮箱: [user@example.com]    │ │
│ │                          手机: [138-0013-8000____]    │ │
│ │                          生日: [1995-01-01_______]    │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                           │
│ ┌─ 职业偏好 ─────────────────────────────────────────────┐ │
│ │  期望职位: [前端开发工程师________________]             │ │
│ │  期望地点: [北京, 上海, 深圳______________]             │ │
│ │  期望薪资: [20000] - [35000] CNY/月                   │ │
│ │  工作类型: [全职 ▼]  远程: [混合办公 ▼]                │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                           │
│ ┌─ 通知设置 ─────────────────────────────────────────────┐ │
│ │  ☑️ 新职位匹配通知                                      │ │
│ │  ☑️ 申请状态更新通知                                    │ │
│ │  ☑️ 面试提醒                                           │ │
│ │  ☑️ 简历分析完成通知                                    │ │
│ │  □  营销邮件                                           │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                           │
│ ┌─ 隐私设置 ─────────────────────────────────────────────┐ │
│ │  简历可见性: [仅自己可见 ▼]                            │ │
│ │  数据导出:   [ 导出我的数据 ]                          │ │
│ │  账户删除:   [ 删除账户 ]                              │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                           │
│              [ 取消 ]           [ 保存设置 ]              │
└───────────────────────────────────────────────────────────┘
```

## 📱 移动端适配

### 响应式断点
- **手机**: < 768px
- **平板**: 768px - 1024px  
- **桌面**: > 1024px

### 移动端导航
```
┌─────────────────┐
│ ☰   JobTracker  │  <- 汉堡菜单 + Logo
├─────────────────┤
│                 │
│   主要内容区     │
│                 │
│                 │
├─────────────────┤
│ 🏠 📄 💼 📊 👤  │  <- 底部标签栏
└─────────────────┘
```

### 移动端交互优化
- **滑动操作**: 卡片滑动显示更多操作
- **长按菜单**: 长按显示上下文菜单
- **手势导航**: 支持返回和前进手势
- **触摸反馈**: 合适的触摸目标大小(44px+)

## 🎨 UI组件规范

### 按钮系统
```css
/* 主要按钮 */
.btn-primary {
  background: linear-gradient(135deg, #2196F3, #1976D2);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(33, 150, 243, 0.3);
}

/* 次要按钮 */
.btn-secondary {
  background: transparent;
  color: #2196F3;
  border: 2px solid #2196F3;
  padding: 10px 22px;
  border-radius: 8px;
}

/* 危险按钮 */
.btn-danger {
  background: linear-gradient(135deg, #F44336, #D32F2F);
  color: white;
}
```

### 状态指示器
```css
/* 状态徽章 */
.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.status-saved { background: #E0E0E0; color: #616161; }
.status-applied { background: #E3F2FD; color: #1976D2; }
.status-interview { background: #FFF3E0; color: #F57C00; }
.status-offer { background: #E8F5E8; color: #388E3C; }
.status-rejected { background: #FFEBEE; color: #D32F2F; }
```

### 进度指示器
```css
/* 进度条 */
.progress-bar {
  width: 100%;
  height: 8px;
  background: #E0E0E0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4CAF50, #8BC34A);
  transition: width 0.3s ease;
}

/* AI匹配度条 */
.match-score-90 { background: linear-gradient(90deg, #4CAF50, #66BB6A); }
.match-score-70 { background: linear-gradient(90deg, #2196F3, #42A5F5); }
.match-score-50 { background: linear-gradient(90deg, #FF9800, #FFB74D); }
.match-score-30 { background: linear-gradient(90deg, #F44336, #EF5350); }
```

## 🔄 交互动效

### 页面切换动画
```css
/* 路由切换动画 */
.page-enter {
  opacity: 0;
  transform: translateY(20px);
}

.page-enter-active {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.page-exit {
  opacity: 1;
  transform: translateY(0);
}

.page-exit-active {
  opacity: 0;
  transform: translateY(-20px);
  transition: opacity 0.3s ease, transform 0.3s ease;
}
```

### 加载状态
```css
/* 骨架屏 */
@keyframes shimmer {
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
}

.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200px 100%;
  animation: shimmer 1.5s infinite;
}

/* 加载指示器 */
.loading-spinner {
  border: 3px solid #f3f3f3;
  border-top: 3px solid #2196F3;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
```

### 反馈动效
```css
/* 成功提示 */
.success-animation {
  animation: successPulse 0.6s ease-out;
}

@keyframes successPulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

/* 错误震动 */
.error-animation {
  animation: errorShake 0.5s ease-out;
}

@keyframes errorShake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  75% { transform: translateX(10px); }
}
```

## ♿ 可访问性设计

### 键盘导航
- **Tab序列**: 逻辑清晰的焦点顺序
- **快捷键**: 常用功能的键盘快捷键
- **焦点指示**: 清晰的焦点指示器
- **跳过链接**: 允许跳过导航到主内容

### 屏幕阅读器支持
```html
<!-- 语义化标记 -->
<main aria-label="仪表盘">
  <section aria-labelledby="stats-heading">
    <h2 id="stats-heading">申请统计</h2>
    <!-- 统计内容 -->
  </section>
</main>

<!-- ARIA标签 -->
<button aria-describedby="delete-help">
  删除简历
</button>
<div id="delete-help" class="sr-only">
  此操作不可撤销，请谨慎操作
</div>

<!-- 状态公告 */
<div aria-live="polite" aria-atomic="true">
  简历上传成功
</div>
```

### 颜色对比
- **正文**: 对比度 ≥ 4.5:1
- **大文本**: 对比度 ≥ 3:1  
- **非文本**: 对比度 ≥ 3:1

### 文本缩放
- 支持放大至200%不影响功能
- 使用相对单位(rem, em)
- 避免固定像素尺寸