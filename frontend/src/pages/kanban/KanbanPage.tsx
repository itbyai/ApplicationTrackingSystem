import React, { useState } from 'react';
import JobApplicationKanban from '../../components/JobApplicationKanban';
import KanbanBoard from '../../components/KanbanBoard';

const KanbanPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'jobs' | 'tasks'>('jobs');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 选项卡导航 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab('jobs')}
                className={`pb-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'jobs'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📋 职位申请看板
              </button>
              <button
                onClick={() => setActiveTab('tasks')}
                className={`pb-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'tasks'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📝 任务管理看板
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 看板内容 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex-1">
          {activeTab === 'jobs' && <JobApplicationKanban />}
          {activeTab === 'tasks' && <KanbanBoard />}
        </div>
      </div>
    </div>
  );
};

export default KanbanPage;