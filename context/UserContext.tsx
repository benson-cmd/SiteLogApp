import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

// 1. 更新資料結構：支援多筆陣列 & 頭像
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  password?: string;
  status?: 'pending' | 'approved';
  phone?: string;
  title?: string;
  startDate?: string;
  avatar?: string;      // 新增：頭像圖片路徑
  education?: string[]; // 修改：改成陣列 (多筆)
  experience?: string[];// 修改：改成陣列 (多筆)
  licenses?: string[];  // 修改：改成陣列 (多筆)
}

interface UserContextType {
  currentUser: User | null;
  allUsers: User[];
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, pass: string) => Promise<boolean>;
  changePassword: (newPassword: string) => Promise<boolean>;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
  approveUser: (id: string) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  isAdmin: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// 更新模擬資料 (配合新的陣列結構)
const MOCK_USERS: User[] = [
  { 
    id: '1', name: '吳資彬', email: 'wu@dwcc.com.tw', role: 'admin', password: '123', status: 'approved', 
    title: '系統管理員', phone: '0912-345-678', startDate: '2020-01-01', 
    education: ['國立交通大學 土木工程碩士', '逢甲大學 土木工程學士'], 
    experience: ['德旺營造 專案經理 (5年)', '某某建設 工地主任 (3年)'], 
    licenses: ['工地主任', '勞安乙級技術士', '公共工程品管工程師'] 
  },
  { 
    id: '2', name: '現場工程師', email: 'site@dwcc.com.tw', role: 'user', password: '123', status: 'approved', 
    title: '工地主任', phone: '0987-654-321', startDate: '2023-05-20', 
    education: ['逢甲大學 土木系'], 
    experience: ['現場監工 (2年)'], 
    licenses: ['公共工程品管'] 
  }
];

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>(MOCK_USERS);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedUsers = await AsyncStorage.getItem('dw_users_db');
        if (storedUsers) {
          setAllUsers(JSON.parse(storedUsers));
        } else {
          await AsyncStorage.setItem('dw_users_db', JSON.stringify(MOCK_USERS));
          setAllUsers(MOCK_USERS);
        }

        const savedUser = await AsyncStorage.getItem('dw_user');
        if (savedUser) {
          setCurrentUser(JSON.parse(savedUser));
        }
      } catch (e) {
        console.error('Auth init failed', e);
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  const saveUsers = async (users: User[]) => {
    setAllUsers(users);
    await AsyncStorage.setItem('dw_users_db', JSON.stringify(users));
  };

  const login = async (email: string, pass: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const stored = await AsyncStorage.getItem('dw_users_db');
      const users: User[] = stored ? JSON.parse(stored) : allUsers;
      
      const user = users.find(u => u.email === email && u.password === pass);
      if (user) {
        if (user.status === 'pending') return false;
        const safeUser = { ...user };
        delete safeUser.password;
        setCurrentUser(safeUser);
        await AsyncStorage.setItem('dw_user', JSON.stringify(safeUser));
        return true;
      }
      return false;
    } catch (e) {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setCurrentUser(null);
    await AsyncStorage.removeItem('dw_user');
    router.replace('/login');
  };

  const register = async (name: string, email: string, pass: string): Promise<boolean> => {
    const newUser: User = {
      id: Date.now().toString(),
      name, email, password: pass, role: 'user', status: 'pending', title: '新進人員',
      education: [], experience: [], licenses: []
    };
    const newUsers = [...allUsers, newUser];
    await saveUsers(newUsers);
    return true;
  };

  const changePassword = async (newPassword: string): Promise<boolean> => {
    if (!currentUser) return false;
    const newUsers = allUsers.map(u => u.id === currentUser.id ? { ...u, password: newPassword } : u);
    await saveUsers(newUsers);
    return true;
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!currentUser) return false;
    const newUsers = allUsers.map(u => {
      if (u.id === currentUser.id) {
        const updated = { ...u, ...data };
        const safeUser = { ...updated };
        delete safeUser.password;
        setCurrentUser(safeUser);
        AsyncStorage.setItem('dw_user', JSON.stringify(safeUser));
        return updated;
      }
      return u;
    });
    await saveUsers(newUsers);
    return true;
  };

  const approveUser = async (id: string) => {
    const newUsers = allUsers.map(u => u.id === id ? { ...u, status: 'approved' as const } : u);
    await saveUsers(newUsers);
  };

  const deleteUser = async (id: string) => {
    const newUsers = allUsers.filter(u => u.id !== id);
    await saveUsers(newUsers);
  };

  return (
    <UserContext.Provider value={{ 
      currentUser, allUsers, isLoading, 
      login, logout, register, changePassword, updateProfile, approveUser, deleteUser,
      isAdmin: currentUser?.role === 'admin' 
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
}