import React, { createContext, useState, useContext, useEffect } from 'react';
import { Platform } from 'react-native';

// 1. 定義使用者的形狀 (Type Definition)
type User = {
  email: string;
  role: 'admin' | 'user';
};

// 2. 定義 Context 裡有什麼功能
type UserContextType = {
  user: User | null;         // 加上這行，讓外面讀得到 user
  userId: string | null;     // 保留舊的相容性
  role: string | null;       // 保留舊的相容性
  login: (email: string, password?: string) => Promise<void>; // 支援兩個參數
  logout: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // 為了相容性，同時維護這兩個舊狀態，之後可以慢慢移除
  const userId = user?.email || null;
  const role = user?.role || null;

  const login = async (email: string, password?: string) => {
    // 這裡未來會接真正的 API
    console.log('Login with:', email, password);
    
    // 簡單判斷：如果是 admin 就給管理員權限
    const userRole = email.includes('admin') ? 'admin' : 'user';
    
    setUser({
      email,
      role: userRole
    });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, userId, role, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};