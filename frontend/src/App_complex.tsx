import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

// Store
import { store } from '@/store';

// Pages
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import DashboardPage from '@/pages/dashboard/DashboardPage';
import ResumePage from '@/pages/resume/ResumePage';
import JobsPage from '@/pages/jobs/JobsPage';
import ApplicationsPage from '@/pages/applications/ApplicationsPage';
import AiAnalysisPage from '@/pages/ai/AiAnalysisPage';
import ProfilePage from '@/pages/profile/ProfilePage';

// Components
import Layout from '@/components/layout/Layout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { AuthProvider } from '@/components/auth/AuthProvider';

// Styles
import './App.css';

// React Query客户端配置
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5分钟
      cacheTime: 10 * 60 * 1000, // 10分钟
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Router>
            <div className="app">
              <Routes>
                {/* 公共路由 */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                
                {/* 受保护的路由 */}
                <Route path="/" element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }>
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route path="dashboard" element={<DashboardPage />} />
                  <Route path="resume" element={<ResumePage />} />
                  <Route path="jobs" element={<JobsPage />} />
                  <Route path="applications" element={<ApplicationsPage />} />
                  <Route path="ai-analysis" element={<AiAnalysisPage />} />
                  <Route path="profile" element={<ProfilePage />} />
                </Route>
                
                {/* 404重定向 */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
              
              {/* 全局Toast通知 */}
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },
                  success: {
                    duration: 3000,
                    iconTheme: {
                      primary: '#4ade80',
                      secondary: '#fff',
                    },
                  },
                  error: {
                    duration: 5000,
                    iconTheme: {
                      primary: '#ef4444',
                      secondary: '#fff',
                    },
                  },
                }}
              />
            </div>
          </Router>
        </AuthProvider>
      </QueryClientProvider>
    </Provider>
  );
};

export default App;