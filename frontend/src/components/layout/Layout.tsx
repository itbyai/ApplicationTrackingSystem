import React from 'react';
import { Outlet } from 'react-router-dom';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                求职管理平台
              </h1>
            </div>
            <nav className="flex space-x-8">
              <a href="/dashboard" className="text-gray-700 hover:text-blue-600">
                仪表盘
              </a>
              <a href="/resume" className="text-gray-700 hover:text-blue-600">
                简历管理
              </a>
              <a href="/jobs" className="text-gray-700 hover:text-blue-600">
                职位管理
              </a>
              <a href="/applications" className="text-gray-700 hover:text-blue-600">
                申请跟踪
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* 主内容区域 */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;