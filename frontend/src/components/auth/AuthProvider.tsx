import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string | null;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 将useAuth hook分离到另一个文件以避免热重载问题
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 检查本地存储的用户信息
    const checkAuthStatus = () => {
      try {
        const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
        const userData = localStorage.getItem('user');
        
        console.log('检查认证状态:', { isAuthenticated, userData });
        
        if (isAuthenticated && userData) {
          const parsedUser = JSON.parse(userData);
          console.log('设置用户:', parsedUser);
          setUser(parsedUser);
        } else {
          console.log('用户未认证');
          setUser(null);
        }
      } catch (error) {
        console.error('检查认证状态失败:', error);
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('user');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    console.log('开始登录:', { email });
    setIsLoading(true);
    try {
      // 模拟登录API调用，实际中会使用password参数
      console.log('登录请求:', { email, passwordLength: password.length });
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userData: User = {
        id: '1',
        name: '用户',
        email,
        role: 'user',
        avatar: null
      };
      
      console.log('登录成功，设置用户数据:', userData);
      setUser(userData);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('登录失败:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<void> => {
    console.log('开始注册:', { name, email });
    setIsLoading(true);
    try {
      // 模拟注册API调用，实际中会使用password参数
      console.log('注册请求:', { name, email, passwordLength: password.length });
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const userData: User = {
        id: Date.now().toString(),
        name,
        email,
        role: 'user',
        avatar: null
      };
      
      console.log('注册成功，设置用户数据:', userData);
      setUser(userData);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('注册失败:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    console.log('用户登出');
    setUser(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout
  };

  console.log('AuthProvider 当前状态:', { 
    user: value.user, 
    isAuthenticated: value.isAuthenticated, 
    isLoading: value.isLoading 
  });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;