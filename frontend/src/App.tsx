import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';

// Components
import { AuthProvider, useAuth } from './components/auth/AuthProvider';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import ResumePage from './pages/resume/ResumePage';
import KanbanPage from './pages/kanban/KanbanPage';
import FileUploadTest from './components/FileUploadTest';

const Navigation: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  
  const navItems = [
    { path: '/dashboard', name: '仪表板', icon: '🏠' },
    { path: '/resume', name: '简历管理', icon: '📄' },
    { path: '/kanban', name: '看板管理', icon: '📋' },
    { path: '/test-upload', name: '上传测试', icon: '📎' },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="bg-white shadow mb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-gray-900">职位管理平台</span>
            </div>
            <div className="ml-6 flex space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    location.pathname === item.path
                      ? 'border-indigo-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          
          {/* 用户菜单 */}
          <div className="flex items-center space-x-4">
            {user && (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  欢迎，{user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm px-3 py-2 rounded-md transition-colors"
                >
                  退出登录
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <AppContent />
        </div>
      </Router>
    </AuthProvider>
  );
};

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      {isAuthenticated && <Navigation />}
      <Routes>
        {/* 公共路由 */}
        <Route 
          path="/login" 
          element={
            <ProtectedRoute requireAuth={false}>
              <LoginPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/register" 
          element={
            <ProtectedRoute requireAuth={false}>
              <RegisterPage />
            </ProtectedRoute>
          } 
        />
        
        {/* 受保护的路由 */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/resume" 
          element={
            <ProtectedRoute>
              <ResumePage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/kanban" 
          element={
            <ProtectedRoute>
              <KanbanPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/test-upload" 
          element={
            <ProtectedRoute>
              <FileUploadTest />
            </ProtectedRoute>
          } 
        />
        
        {/* 默认重定向 */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
};

export default App;