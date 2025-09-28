import React, { useState, useCallback, useRef } from 'react';

// 职位申请状态枚举
export type ApplicationStatus = 
  | 'interested'      // 感兴趣/准备中
  | 'applied'         // 已投递
  | 'interviewing'    // 面试中
  | 'closed';         // 已结束(成功/失败)

// 申请结果类型
export type ApplicationResult = 'offer' | 'rejected' | 'withdrawn';

// 申请优先级枚举
export type ApplicationPriority = 'low' | 'medium' | 'high' | 'dream';

// 职位申请接口
export interface JobApplication {
  id: string;
  company: string;
  position: string;
  description?: string;
  status: ApplicationStatus;
  priority: ApplicationPriority;
  result?: ApplicationResult; // 仅在closed状态时使用
  salary?: string;
  location?: string;
  applicationDate?: string;
  dueDate?: string;
  contacts?: string[];
  notes?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

// 列配置
const APPLICATION_COLUMNS: { status: ApplicationStatus; title: string; color: string; icon: string }[] = [
  { status: 'interested', title: '感兴趣', color: 'bg-gray-50 border-gray-300', icon: '👀' },
  { status: 'applied', title: '已投递', color: 'bg-blue-50 border-blue-300', icon: '📤' },
  { status: 'interviewing', title: '面试中', color: 'bg-yellow-50 border-yellow-300', icon: '💬' },
  { status: 'closed', title: '已结束', color: 'bg-purple-50 border-purple-300', icon: '🏁' },
];

// 优先级颜色映射
const APPLICATION_PRIORITY_COLORS: Record<ApplicationPriority, string> = {
  low: 'bg-gray-100 text-gray-600 border-gray-300',
  medium: 'bg-blue-100 text-blue-600 border-blue-300',
  high: 'bg-orange-100 text-orange-600 border-orange-300',
  dream: 'bg-pink-100 text-pink-600 border-pink-300',
};

// 优先级标签
const APPLICATION_PRIORITY_LABELS: Record<ApplicationPriority, string> = {
  low: '普通',
  medium: '中等',
  high: '重要',
  dream: '梦想',
};

// 结果颜色映射
const RESULT_COLORS: Record<ApplicationResult, string> = {
  offer: 'bg-green-100 text-green-700 border-green-300',
  rejected: 'bg-red-100 text-red-700 border-red-300',
  withdrawn: 'bg-gray-100 text-gray-700 border-gray-300',
};

// 结果标签
const RESULT_LABELS: Record<ApplicationResult, string> = {
  offer: '获得Offer',
  rejected: '被拒绝',
  withdrawn: '主动放弃',
};

// 示例职位申请数据
const SAMPLE_APPLICATIONS: JobApplication[] = [
  {
    id: '1',
    company: '阿里巴巴',
    position: '高级前端工程师',
    description: 'React/Vue开发，负责电商平台前端架构设计',
    status: 'closed',
    priority: 'dream',
    result: 'offer',
    salary: '30K-45K',
    location: '杭州',
    applicationDate: '2024-01-15',
    dueDate: '2024-02-01',
    contacts: ['张经理', 'HR小李'],
    notes: '面试全部通过，Offer已接受',
    tags: ['前端', 'React', '电商'],
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-28T00:00:00Z',
  },
  {
    id: '2',
    company: '腾讯',
    position: '全栈工程师',
    description: '微信生态产品开发',
    status: 'closed',
    priority: 'dream',
    result: 'offer',
    salary: '35K-50K',
    location: '深圳',
    applicationDate: '2024-01-20',
    contacts: ['王总监'],
    notes: 'Offer已接受，准备入职',
    tags: ['全栈', '微信', '小程序'],
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-30T00:00:00Z',
  },
  {
    id: '3',
    company: '字节跳动',
    position: '前端开发工程师',
    description: '抖音相关产品前端开发',
    status: 'interviewing',
    priority: 'high',
    salary: '28K-40K',
    location: '北京',
    applicationDate: '2024-01-18',
    dueDate: '2024-02-05',
    contacts: ['李技术总监', 'HR小王'],
    notes: '二面已通过，等待终面安排',
    tags: ['前端', '短视频', 'Vue'],
    createdAt: '2024-01-12T00:00:00Z',
    updatedAt: '2024-01-25T00:00:00Z',
  },
  {
    id: '4',
    company: '美团',
    position: 'Node.js后端工程师',
    description: '外卖平台后端服务开发',
    status: 'interviewing',
    priority: 'high',
    salary: '25K-35K',
    location: '北京',
    applicationDate: '2024-01-22',
    dueDate: '2024-02-10',
    contacts: ['陈架构师'],
    notes: '一面已通过，准备二面技术测试',
    tags: ['后端', 'Node.js', '微服务'],
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: '2024-01-26T00:00:00Z',
  },
  {
    id: '5',
    company: '百度',
    position: '前端工程师',
    description: 'AI产品前端界面开发',
    status: 'applied',
    priority: 'medium',
    salary: '22K-32K',
    location: '北京',
    applicationDate: '2024-01-25',
    contacts: ['HR小张'],
    notes: '简历已投递，等待面试通知',
    tags: ['前端', 'AI', 'React'],
    createdAt: '2024-01-22T00:00:00Z',
    updatedAt: '2024-01-27T00:00:00Z',
  },
  {
    id: '6',
    company: 'OPPO',
    position: '移动端开发工程师',
    description: '手机系统UI开发',
    status: 'applied',
    priority: 'medium',
    salary: '20K-28K',
    location: '深圳',
    applicationDate: '2024-01-28',
    contacts: [],
    notes: '简历已投递，等待回复',
    tags: ['移动端', 'Android', 'UI'],
    createdAt: '2024-01-28T00:00:00Z',
    updatedAt: '2024-01-28T00:00:00Z',
  },
  {
    id: '7',
    company: '小米',
    position: '前端开发实习生',
    description: 'MIUI界面开发实习',
    status: 'interested',
    priority: 'low',
    salary: '8K-12K',
    location: '北京',
    contacts: [],
    notes: '准备简历和作品集',
    tags: ['实习', 'UI', '前端'],
    createdAt: '2024-01-29T00:00:00Z',
    updatedAt: '2024-01-29T00:00:00Z',
  },
  {
    id: '8',
    company: '网易',
    position: '游戏前端工程师',
    description: '游戏管理后台开发',
    status: 'closed',
    priority: 'medium',
    result: 'rejected',
    salary: '24K-35K',
    location: '广州',
    applicationDate: '2024-01-10',
    contacts: ['HR小刘'],
    notes: '面试未通过，缺乏游戏开发经验',
    tags: ['游戏', '前端', '管理后台'],
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z',
  },
  {
    id: '9',
    company: 'PDD',
    position: '全栈工程师',
    description: '电商平台全栈开发',
    status: 'interested',
    priority: 'high',
    salary: '30K-45K',
    location: '上海',
    contacts: [],
    notes: '朋友内推，准备投递',
    tags: ['全栈', '电商', '内推'],
    createdAt: '2024-01-30T00:00:00Z',
    updatedAt: '2024-01-30T00:00:00Z',
  },
];

// 职位申请卡片组件
const ApplicationCard: React.FC<{
  application: JobApplication;
  onDragStart: (e: React.DragEvent, application: JobApplication) => void;
  onUpdateResult: (id: string, result: ApplicationResult) => void;
}> = ({ application, onDragStart, onUpdateResult }) => {
  const isOverdue = application.dueDate && new Date(application.dueDate) < new Date();
  
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, application)}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-3 cursor-move hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="font-semibold text-gray-900 text-sm">{application.company}</h4>
          <p className="text-gray-600 text-xs">{application.position}</p>
        </div>
        <span
          className={`px-2 py-1 rounded text-xs font-medium border ${
            APPLICATION_PRIORITY_COLORS[application.priority]
          }`}
        >
          {APPLICATION_PRIORITY_LABELS[application.priority]}
        </span>
      </div>
      
      {application.description && (
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{application.description}</p>
      )}
      
      {/* 薪资和地点 */}
      <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
        {application.salary && <span>💰 {application.salary}</span>}
        {application.location && <span>📍 {application.location}</span>}
      </div>
      
      {application.tags && application.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {application.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      
      {/* 联系人信息 */}
      {application.contacts && application.contacts.length > 0 && (
        <div className="text-xs text-blue-600 mb-2">
          👥 {application.contacts.join(', ')}
        </div>
      )}
      
      {/* 备注 */}
      {application.notes && (
        <div className="text-xs text-gray-500 mb-2 italic">
          📝 {application.notes}
        </div>
      )}

      {/* 已结束状态的结果选择 */}
      {application.status === 'closed' && (
        <div className="mb-3">
          <div className="text-xs text-gray-500 mb-2">结果:</div>
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onUpdateResult(application.id, 'offer');
              }}
              className={`px-2 py-1 rounded text-xs font-medium border transition-colors ${
                application.result === 'offer'
                  ? RESULT_COLORS.offer
                  : 'bg-gray-50 text-gray-600 border-gray-300 hover:bg-green-50 hover:text-green-600'
              }`}
            >
              ✅ Offer
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onUpdateResult(application.id, 'rejected');
              }}
              className={`px-2 py-1 rounded text-xs font-medium border transition-colors ${
                application.result === 'rejected'
                  ? RESULT_COLORS.rejected
                  : 'bg-gray-50 text-gray-600 border-gray-300 hover:bg-red-50 hover:text-red-600'
              }`}
            >
              ❌ 被拒
            </button>
          </div>
        </div>
      )}

      {/* 当前结果显示 */}
      {application.status === 'closed' && application.result && (
        <div className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border mb-2 ${
          RESULT_COLORS[application.result]
        }`}>
          {RESULT_LABELS[application.result]}
        </div>
      )}
      
      <div className="flex justify-between items-center text-xs text-gray-500">
        <span>
          {application.applicationDate && `投递: ${new Date(application.applicationDate).toLocaleDateString('zh-CN')}`}
        </span>
        {application.dueDate && (
          <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
            ⏰ {new Date(application.dueDate).toLocaleDateString('zh-CN')}
          </span>
        )}
      </div>
    </div>
  );
};

// 看板列组件
const ApplicationColumn: React.FC<{
  column: { status: ApplicationStatus; title: string; color: string; icon: string };
  applications: JobApplication[];
  onDragStart: (e: React.DragEvent, application: JobApplication) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, status: ApplicationStatus) => void;
  onUpdateResult: (id: string, result: ApplicationResult) => void;
  isDragOver: boolean;
}> = ({ column, applications, onDragStart, onDragOver, onDrop, onUpdateResult, isDragOver }) => {
  return (
    <div className={`w-full ${column.color} rounded-lg border-2 border-dashed p-4`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <span>{column.icon}</span>
          {column.title}
        </h3>
        <span className="bg-white px-2 py-1 rounded-full text-sm font-medium text-gray-600">
          {applications.length}
        </span>
      </div>
      
      <div
        className={`min-h-64 transition-colors duration-200 ${
          isDragOver ? 'bg-white bg-opacity-50 rounded-lg' : ''
        }`}
        onDragOver={onDragOver}
        onDrop={(e) => onDrop(e, column.status)}
      >
        {applications.map((application) => (
          <ApplicationCard 
            key={application.id} 
            application={application} 
            onDragStart={onDragStart}
            onUpdateResult={onUpdateResult}
          />
        ))}
        
        {applications.length === 0 && (
          <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
            暂无申请
          </div>
        )}
      </div>
    </div>
  );
};

// 主看板组件
const JobApplicationKanban: React.FC = () => {
  const [applications, setApplications] = useState<JobApplication[]>(SAMPLE_APPLICATIONS);
  const [draggedApplication, setDraggedApplication] = useState<JobApplication | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<ApplicationStatus | null>(null);
  const dragCounter = useRef(0);

  // 更新申请结果
  const handleUpdateResult = useCallback((id: string, result: ApplicationResult) => {
    setApplications((prevApplications) =>
      prevApplications.map((application) =>
        application.id === id
          ? { ...application, result, updatedAt: new Date().toISOString() }
          : application
      )
    );
  }, []);

  // 拖拽开始
  const handleDragStart = useCallback((e: React.DragEvent, application: JobApplication) => {
    setDraggedApplication(application);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.currentTarget.outerHTML);
    e.dataTransfer.setData('text/plain', application.id);
  }, []);

  // 拖拽经过
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  // 拖拽进入
  const handleDragEnter = useCallback((e: React.DragEvent, status: ApplicationStatus) => {
    e.preventDefault();
    dragCounter.current++;
    setDragOverColumn(status);
  }, []);

  // 拖拽离开
  const handleDragLeave = useCallback((_e: React.DragEvent) => {
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setDragOverColumn(null);
    }
  }, []);

  // 拖拽放置
  const handleDrop = useCallback((e: React.DragEvent, newStatus: ApplicationStatus) => {
    e.preventDefault();
    dragCounter.current = 0;
    setDragOverColumn(null);

    if (draggedApplication && draggedApplication.status !== newStatus) {
      setApplications((prevApplications) =>
        prevApplications.map((application) =>
          application.id === draggedApplication.id
            ? { ...application, status: newStatus, updatedAt: new Date().toISOString() }
            : application
        )
      );
    }

    setDraggedApplication(null);
  }, [draggedApplication]);

  // 按状态分组申请
  const applicationsByStatus = applications.reduce((acc, application) => {
    if (!acc[application.status]) {
      acc[application.status] = [];
    }
    acc[application.status].push(application);
    return acc;
  }, {} as Record<ApplicationStatus, JobApplication[]>);

  // 统计信息
  const stats = {
    total: applications.length,
    applied: applications.filter(app => ['applied', 'interviewing'].includes(app.status)).length,
    closed: applications.filter(app => app.status === 'closed').length,
    offers: applications.filter(app => app.status === 'closed' && app.result === 'offer').length,
    rejected: applications.filter(app => app.status === 'closed' && app.result === 'rejected').length,
    overdue: applications.filter(app => {
      if (!app.dueDate) return false;
      return new Date(app.dueDate) < new Date() && !['closed'].includes(app.status);
    }).length,
  };

  return (
    <div className="space-y-6">
      {/* 头部 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">职位申请看板</h1>
        <div className="flex gap-6 text-sm text-gray-600">
          <span>总申请: <span className="font-medium">{stats.total}</span></span>
          <span>进行中: <span className="font-medium text-blue-600">{stats.applied}</span></span>
          <span>已结束: <span className="font-medium text-purple-600">{stats.closed}</span></span>
          <span>获得Offer: <span className="font-medium text-green-600">{stats.offers}</span></span>
          <span>被拒绝: <span className="font-medium text-red-600">{stats.rejected}</span></span>
          {stats.overdue > 0 && (
            <span>逾期: <span className="font-medium text-red-600">{stats.overdue}</span></span>
          )}
        </div>
      </div>

      {/* 看板列 */}
      <div className="grid grid-cols-4 gap-4 w-full">
        {APPLICATION_COLUMNS.map((column) => (
          <div
            key={column.status}
            onDragEnter={(e) => handleDragEnter(e, column.status)}
            onDragLeave={handleDragLeave}
          >
            <ApplicationColumn
              column={column}
              applications={applicationsByStatus[column.status] || []}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onUpdateResult={handleUpdateResult}
              isDragOver={dragOverColumn === column.status}
            />
          </div>
        ))}
      </div>

      {/* 拖拽提示 */}
      {draggedApplication && (
        <div className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg">
          正在移动: {draggedApplication.company} - {draggedApplication.position}
        </div>
      )}
    </div>
  );
};

export default JobApplicationKanban;