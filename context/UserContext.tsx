import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext<any>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    // 模擬登入延遲
    await new Promise(resolve => setTimeout(resolve, 500));
    // 簡易測試邏輯：只要有輸入就登入
    if (email && pass) {
      setUser({ email, role: 'admin' });
      setIsLoading(false);
      return true;
    }
    setIsLoading(false);
    return false;
  };

  const logout = () => setUser(null);

  return (
    <UserContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);