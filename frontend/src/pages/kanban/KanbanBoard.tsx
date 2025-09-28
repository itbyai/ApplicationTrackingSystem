import React, { useState, useRef, useCallback } from 'react';

// 任务状态定义
export type TaskStatus = 'backlog' | 'todo' | 'in-progress' | 'review' | 'done';

// 任务优先级定义
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

// 任务接口
export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee?: string;
  tags: string[];
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

// 列配置
export interface Column {
  id: TaskStatus;
  title: string;
  color: string;
  bgColor: string;
  maxItems?: number;
}

// 默认列配置
const DEFAULT_COLUMNS: Column[] = [
  {
    id: 'backlog',
    title: '待办事项',
    color: 'text-gray-700',
    bgColor: 'bg-gray-50',
  },
  {
    id: 'todo',
    title: '待处理',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
  },
  {
    id: 'in-progress',
    title: '进行中',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-50',
    maxItems: 3, // 限制进行中任务数量
  },
  {
    id: 'review',
    title: '待审查',
    color: 'text-purple-700',
    bgColor: 'bg-purple-50',
  },
  {
    id: 'done',
    title: '已完成',
    color: 'text-green-700',
    bgColor: 'bg-green-50',
  },
];

// 优先级配置
const PRIORITY_CONFIG = {
  urgent: { color: 'bg-red-500', text: '紧急' },
  high: { color: 'bg-orange-500', text: '高' },
  medium: { color: 'bg-yellow-500', text: '中' },
  low: { color: 'bg-green-500', text: '低' },
};

const KanbanBoard: React.FC = () => {
  // 示例任务数据
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: '设计用户界面',
      description: '为新功能设计用户界面原型',
      status: 'todo',
      priority: 'high',
      assignee: '张三',
      tags: ['设计', 'UI/UX'],
      dueDate: '2024-01-20',
      createdAt: '2024-01-10',
      updatedAt: '2024-01-10',
    },
    {
      id: '2',
      title: '实现API接口',
      description: '开发后端API接口，支持用户数据操作',
      status: 'in-progress',
      priority: 'urgent',
      assignee: '李四',
      tags: ['后端', 'API'],
      dueDate: '2024-01-18',
      createdAt: '2024-01-08',
      updatedAt: '2024-01-12',
    },
    {
      id: '3',
      title: '数据库优化',
      description: '优化查询性能，添加索引',
      status: 'review',
      priority: 'medium',
      assignee: '王五',
      tags: ['数据库', '优化'],
      dueDate: '2024-01-25',
      createdAt: '2024-01-05',
      updatedAt: '2024-01-13',
    },
    {
      id: '4',
      title: '用户手册编写',
      description: '编写详细的用户操作手册',
      status: 'done',
      priority: 'low',
      assignee: '赵六',
      tags: ['文档', '用户'],
      createdAt: '2024-01-03',
      updatedAt: '2024-01-14',
    },
    {
      id: '5',
      title: '单元测试',
      description: '为核心功能编写单元测试',
      status: 'backlog',
      priority: 'medium',
      tags: ['测试', '质量'],
      dueDate: '2024-01-30',
      createdAt: '2024-01-11',
      updatedAt: '2024-01-11',
    },
  ]);

  // 拖拽状态
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [draggedOverColumn, setDraggedOverColumn] = useState<TaskStatus | null>(null);
  const dragCounter = useRef(0);

  // 根据状态获取任务
  const getTasksByStatus = useCallback((status: TaskStatus) => {
    return tasks.filter(task => task.status === status);
  }, [tasks]);

  // 处理拖拽开始
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.currentTarget.outerHTML);
    e.currentTarget.style.opacity = '0.5';
  };

  // 处理拖拽结束
  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.style.opacity = '1';
    setDraggedTask(null);
    setDraggedOverColumn(null);
    dragCounter.current = 0;
  };

  // 处理拖拽进入
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, status: TaskStatus) => {
    e.preventDefault();
    dragCounter.current++;
    setDraggedOverColumn(status);
  };

  // 处理拖拽离开
  const handleDragLeave = () => {
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setDraggedOverColumn(null);
    }
  };

  // 处理拖拽悬停
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  // 处理拖拽放置
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, newStatus: TaskStatus) => {
    e.preventDefault();
    setDraggedOverColumn(null);
    dragCounter.current = 0;

    if (draggedTask && draggedTask.status !== newStatus) {
      // 检查列的限制
      const column = DEFAULT_COLUMNS.find(col => col.id === newStatus);
      const currentTasks = getTasksByStatus(newStatus);
      
      if (column?.maxItems && currentTasks.length >= column.maxItems) {
        alert(`${column.title} 列最多只能有 ${column.maxItems} 个任务`);
        return;
      }

      // 更新任务状态
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === draggedTask.id 
            ? { ...task, status: newStatus, updatedAt: new Date().toISOString() }
            : task
        )
      );

      console.log(`任务 "${draggedTask.title}" 从 ${draggedTask.status} 移动到 ${newStatus}`);
    }

    setDraggedTask(null);
  };

  // 任务卡片组件
  const TaskCard: React.FC<{ task: Task }> = ({ task }) => (
    <div
      draggable
      onDragStart={(e) => handleDragStart(e, task)}
      onDragEnd={handleDragEnd}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-move hover:shadow-md transition-shadow"
    >
      {/* 任务标题 */}
      <div className="flex items-start justify-between mb-2">
        <h4 className="text-sm font-medium text-gray-900 flex-1">{task.title}</h4>
        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white ${PRIORITY_CONFIG[task.priority].color}`}>
          {PRIORITY_CONFIG[task.priority].text}
        </div>
      </div>

      {/* 任务描述 */}
      {task.description && (
        <p className="text-xs text-gray-600 mb-3 line-clamp-2">{task.description}</p>
      )}

      {/* 标签 */}
      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* 底部信息 */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center space-x-2">
          {task.assignee && (
            <div className="flex items-center">
              <div className="w-5 h-5 bg-indigo-100 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-indigo-600">
                  {task.assignee.charAt(0)}
                </span>
              </div>
              <span className="ml-1">{task.assignee}</span>
            </div>
          )}
        </div>
        {task.dueDate && (
          <div className={`flex items-center ${
            new Date(task.dueDate) < new Date() 
              ? 'text-red-600' 
              : new Date(task.dueDate) <= new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
              ? 'text-yellow-600'
              : 'text-gray-500'
          }`}>
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            {new Date(task.dueDate).toLocaleDateString()}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* 页面标题 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">项目看板</h1>
        <p className="mt-1 text-sm text-gray-600">
          拖拽任务卡片到不同列中更改状态
        </p>
      </div>

      {/* 看板列 */}
      <div className="flex gap-6 overflow-x-auto pb-6">
        {DEFAULT_COLUMNS.map(column => {
          const columnTasks = getTasksByStatus(column.id);
          const isDropZone = draggedOverColumn === column.id;

          return (
            <div
              key={column.id}
              className={`flex-shrink-0 w-80 ${column.bgColor} rounded-lg transition-colors ${
                isDropZone ? 'ring-2 ring-indigo-500 ring-opacity-50' : ''
              }`}
              onDragEnter={(e) => handleDragEnter(e, column.id)}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              {/* 列标题 */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className={`font-medium ${column.color}`}>
                    {column.title}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-800">
                      {columnTasks.length}
                      {column.maxItems && `/${column.maxItems}`}
                    </span>
                  </div>
                </div>
              </div>

              {/* 任务列表 */}
              <div className="p-4 space-y-3 min-h-[200px]">
                {columnTasks.map(task => (
                  <TaskCard key={task.id} task={task} />
                ))}
                
                {/* 空状态 */}
                {columnTasks.length === 0 && (
                  <div className="flex items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-lg">
                    <p className="text-sm text-gray-500">
                      {draggedTask ? '拖拽任务到这里' : '暂无任务'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 统计信息 */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        {DEFAULT_COLUMNS.map(column => {
          const columnTasks = getTasksByStatus(column.id);
          return (
            <div key={column.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center">
                <div className={`flex-shrink-0 p-2 rounded-md ${column.bgColor}`}>
                  <div className={`w-4 h-4 rounded-full ${column.color.replace('text-', 'bg-')}`}></div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{column.title}</p>
                  <p className="text-sm text-gray-600">{columnTasks.length} 个任务</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default KanbanBoard;