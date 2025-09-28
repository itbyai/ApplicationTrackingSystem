import React, { useState, useCallback, useRef } from 'react';

// 任务状态枚举
export type TaskStatus = 'backlog' | 'todo' | 'in-progress' | 'review' | 'done';

// 任务优先级枚举
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

// 任务接口
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee?: string;
  dueDate?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

// 列配置
const COLUMNS: { status: TaskStatus; title: string; color: string }[] = [
  { status: 'backlog', title: '待办事项', color: 'bg-gray-100 border-gray-300' },
  { status: 'todo', title: '准备开始', color: 'bg-blue-50 border-blue-300' },
  { status: 'in-progress', title: '进行中', color: 'bg-yellow-50 border-yellow-300' },
  { status: 'review', title: '待审核', color: 'bg-purple-50 border-purple-300' },
  { status: 'done', title: '已完成', color: 'bg-green-50 border-green-300' },
];

// 优先级颜色映射
const PRIORITY_COLORS: Record<TaskPriority, string> = {
  low: 'bg-gray-100 text-gray-600 border-gray-300',
  medium: 'bg-blue-100 text-blue-600 border-blue-300',
  high: 'bg-orange-100 text-orange-600 border-orange-300',
  urgent: 'bg-red-100 text-red-600 border-red-300',
};

// 优先级标签
const PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: '低',
  medium: '中',
  high: '高',
  urgent: '紧急',
};

// 示例任务数据
const SAMPLE_TASKS: Task[] = [
  {
    id: '1',
    title: '设计用户认证系统',
    description: '创建登录、注册和密码重置功能',
    status: 'done',
    priority: 'high',
    assignee: '张三',
    dueDate: '2024-01-15',
    tags: ['认证', '安全'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    title: '实现简历上传功能',
    description: '支持PDF、DOC格式的简历上传',
    status: 'done',
    priority: 'medium',
    assignee: '李四',
    dueDate: '2024-01-20',
    tags: ['文件上传', '简历'],
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
  },
  {
    id: '3',
    title: '开发看板管理界面',
    description: '创建拖拽式任务管理看板',
    status: 'in-progress',
    priority: 'high',
    assignee: '王五',
    dueDate: '2024-01-25',
    tags: ['看板', 'UI'],
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z',
  },
  {
    id: '4',
    title: '集成AI简历分析',
    description: '使用OpenAI API分析简历内容',
    status: 'review',
    priority: 'urgent',
    assignee: '赵六',
    dueDate: '2024-01-30',
    tags: ['AI', '分析'],
    createdAt: '2024-01-04T00:00:00Z',
    updatedAt: '2024-01-04T00:00:00Z',
  },
  {
    id: '5',
    title: '优化数据库性能',
    description: '添加索引和查询优化',
    status: 'todo',
    priority: 'medium',
    assignee: '孙七',
    dueDate: '2024-02-05',
    tags: ['数据库', '性能'],
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-05T00:00:00Z',
  },
  {
    id: '6',
    title: '编写API文档',
    description: '为所有API端点编写详细文档',
    status: 'backlog',
    priority: 'low',
    assignee: '周八',
    dueDate: '2024-02-10',
    tags: ['文档', 'API'],
    createdAt: '2024-01-06T00:00:00Z',
    updatedAt: '2024-01-06T00:00:00Z',
  },
];

// 任务卡片组件
const TaskCard: React.FC<{
  task: Task;
  onDragStart: (e: React.DragEvent, task: Task) => void;
}> = ({ task, onDragStart }) => {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();
  
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task)}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-3 cursor-move hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium text-gray-900 text-sm leading-5">{task.title}</h4>
        <span
          className={`px-2 py-1 rounded text-xs font-medium border ${
            PRIORITY_COLORS[task.priority]
          }`}
        >
          {PRIORITY_LABELS[task.priority]}
        </span>
      </div>
      
      {task.description && (
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{task.description}</p>
      )}
      
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      
      <div className="flex justify-between items-center text-xs text-gray-500">
        <span>{task.assignee}</span>
        {task.dueDate && (
          <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
            {new Date(task.dueDate).toLocaleDateString('zh-CN')}
          </span>
        )}
      </div>
    </div>
  );
};

// 看板列组件
const KanbanColumn: React.FC<{
  column: { status: TaskStatus; title: string; color: string };
  tasks: Task[];
  onDragStart: (e: React.DragEvent, task: Task) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, status: TaskStatus) => void;
  isDragOver: boolean;
}> = ({ column, tasks, onDragStart, onDragOver, onDrop, isDragOver }) => {
  return (
    <div className={`w-full ${column.color} rounded-lg border-2 border-dashed p-4`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-800">{column.title}</h3>
        <span className="bg-white px-2 py-1 rounded-full text-sm font-medium text-gray-600">
          {tasks.length}
        </span>
      </div>
      
      <div
        className={`min-h-64 transition-colors duration-200 ${
          isDragOver ? 'bg-white bg-opacity-50 rounded-lg' : ''
        }`}
        onDragOver={onDragOver}
        onDrop={(e) => onDrop(e, column.status)}
      >
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onDragStart={onDragStart} />
        ))}
        
        {tasks.length === 0 && (
          <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
            暂无任务
          </div>
        )}
      </div>
    </div>
  );
};

// 主看板组件
const KanbanBoard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(SAMPLE_TASKS);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null);
  const dragCounter = useRef(0);

  // 拖拽开始
  const handleDragStart = useCallback((e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.currentTarget.outerHTML);
    e.dataTransfer.setData('text/plain', task.id);
  }, []);

  // 拖拽经过
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  // 拖拽进入
  const handleDragEnter = useCallback((e: React.DragEvent, status: TaskStatus) => {
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
  const handleDrop = useCallback((e: React.DragEvent, newStatus: TaskStatus) => {
    e.preventDefault();
    dragCounter.current = 0;
    setDragOverColumn(null);

    if (draggedTask && draggedTask.status !== newStatus) {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === draggedTask.id
            ? { ...task, status: newStatus, updatedAt: new Date().toISOString() }
            : task
        )
      );
    }

    setDraggedTask(null);
  }, [draggedTask]);

  // 按状态分组任务
  const tasksByStatus = tasks.reduce((acc, task) => {
    if (!acc[task.status]) {
      acc[task.status] = [];
    }
    acc[task.status].push(task);
    return acc;
  }, {} as Record<TaskStatus, Task[]>);

  // 统计信息
  const stats = {
    total: tasks.length,
    completed: tasks.filter(task => task.status === 'done').length,
    inProgress: tasks.filter(task => task.status === 'in-progress').length,
    overdue: tasks.filter(task => {
      if (!task.dueDate) return false;
      return new Date(task.dueDate) < new Date() && task.status !== 'done';
    }).length,
  };

  return (
    <div className="space-y-6">
      {/* 头部 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">任务看板</h1>
        <div className="flex gap-6 text-sm text-gray-600">
          <span>总任务: <span className="font-medium">{stats.total}</span></span>
          <span>进行中: <span className="font-medium text-yellow-600">{stats.inProgress}</span></span>
          <span>已完成: <span className="font-medium text-green-600">{stats.completed}</span></span>
          {stats.overdue > 0 && (
            <span>逾期: <span className="font-medium text-red-600">{stats.overdue}</span></span>
          )}
        </div>
      </div>

      {/* 看板列 */}
      <div className="grid grid-cols-5 gap-3 w-full">
        {COLUMNS.map((column) => (
          <div
            key={column.status}
            onDragEnter={(e) => handleDragEnter(e, column.status)}
            onDragLeave={handleDragLeave}
          >
            <KanbanColumn
              column={column}
              tasks={tasksByStatus[column.status] || []}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              isDragOver={dragOverColumn === column.status}
            />
          </div>
        ))}
      </div>

      {/* 拖拽提示 */}
      {draggedTask && (
        <div className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg">
          正在移动: {draggedTask.title}
        </div>
      )}
    </div>
  );
};

export default KanbanBoard;