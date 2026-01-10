import React, { createContext, useContext, useState, ReactNode } from 'react';

// 公告型別定義
export interface Announcement {
  id: string; // 公告 ID
  date: string; // 公告日期
  title: string; // 公告標題
  content: string; // 公告內容
  author: string; // 公告作者
}

// Context 型別定義
interface AnnouncementContextType {
  announcements: Announcement[];
  addAnnouncement: (title: string, content: string, author: string) => void;
  deleteAnnouncement: (id: string) => void;
  updateAnnouncement: (id: string, title: string, content: string, author: string) => void;
}

// 建立 Context
export const AnnouncementContext = createContext<AnnouncementContextType | undefined>(undefined);

// Provider 元件
export function AnnouncementProvider({ children }: { children: ReactNode }) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      id: '1',
      date: '2025-11-23',
      title: '工程日誌系統公告測試',
      content: '這是一個測試公告內容，用於測試公告系統的功能。',
      author: '系統管理員',
    },
  ]);

  // 取得今日日期（YYYY-MM-DD 格式）
  const getTodayDate = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 新增公告函式
  const addAnnouncement = (title: string, content: string, author: string) => {
    const newAnnouncement: Announcement = {
      id: Date.now().toString(),
      date: getTodayDate(),
      title,
      content,
      author,
    };
    // 將新公告加入陣列最上方
    setAnnouncements(prevAnnouncements => [newAnnouncement, ...prevAnnouncements]);
  };

  // 刪除公告函式
  const deleteAnnouncement = (id: string) => {
    setAnnouncements(prevAnnouncements =>
      prevAnnouncements.filter(announcement => announcement.id !== id)
    );
  };

  // 編輯公告函式
  const updateAnnouncement = (id: string, title: string, content: string, author: string) => {
    setAnnouncements(prevAnnouncements =>
      prevAnnouncements.map(item =>
        item.id === id
          ? { ...item, title, content, author, date: getTodayDate() }
          : item
      )
    );
  };

  return (
    <AnnouncementContext.Provider value={{ announcements, addAnnouncement, deleteAnnouncement, updateAnnouncement }}>
      {children}
    </AnnouncementContext.Provider>
  );
}

// 自訂 Hook：使用公告 Context
export function useAnnouncement() {
  const context = useContext(AnnouncementContext);
  if (context === undefined) {
    throw new Error('useAnnouncement must be used within an AnnouncementProvider');
  }
  return context;
}

