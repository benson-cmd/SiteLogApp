import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 1. 定義檔案結構
export interface SOPFile {
  name: string;
  uri: string;
  mimeType?: string;
}

export interface SOP {
  id: string;
  title: string;
  category: string;
  version: string;
  date: string;
  content?: string;
  file?: SOPFile | null; // 新增：檔案欄位
}

export const SOP_CATEGORIES = [
  '全部',
  '安全衛生與緊急應變',
  '結構體工程規範',
  '景觀與植栽綠化工程',
  '機電與設備工程',
  '假設工程與其他',
  '品質管理與查驗表'
];

interface SOPContextType {
  sops: SOP[];
  categories: string[];
  addSOP: (sop: Omit<SOP, 'id'>) => Promise<void>;
  updateSOP: (id: string, data: Partial<SOP>) => Promise<void>;
  deleteSOP: (id: string) => Promise<void>;
  searchSOP: (query: string, category: string) => SOP[];
}

const SOPContext = createContext<SOPContextType | undefined>(undefined);

const MOCK_SOPS: SOP[] = [
  { id: '1', title: '高空作業墜落災害防止計畫', category: '安全衛生與緊急應變', version: 'V2.1', date: '2024-01-15', content: '適用於所有高度2公尺以上作業', file: null },
  { id: '2', title: 'RC牆體鋼筋綁紮查驗規範', category: '結構體工程規範', version: 'V1.0', date: '2023-11-20', content: '包含搭接長度與箍筋間距標準', file: null }
];

export function SOPProvider({ children }: { children: React.ReactNode }) {
  const [sops, setSops] = useState<SOP[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const stored = await AsyncStorage.getItem('dw_sops');
        if (stored) {
          setSops(JSON.parse(stored));
        } else {
          setSops(MOCK_SOPS);
          await AsyncStorage.setItem('dw_sops', JSON.stringify(MOCK_SOPS));
        }
      } catch (e) {
        console.error(e);
      }
    };
    loadData();
  }, []);

  const saveSops = async (newData: SOP[]) => {
    setSops(newData);
    await AsyncStorage.setItem('dw_sops', JSON.stringify(newData));
  };

  const addSOP = async (data: Omit<SOP, 'id'>) => {
    const newSOP = { ...data, id: Date.now().toString() };
    await saveSops([newSOP, ...sops]);
  };

  const updateSOP = async (id: string, data: Partial<SOP>) => {
    const newData = sops.map(s => s.id === id ? { ...s, ...data } : s);
    await saveSops(newData);
  };

  const deleteSOP = async (id: string) => {
    const newData = sops.filter(s => s.id !== id);
    await saveSops(newData);
  };

  const searchSOP = (query: string, category: string) => {
    let result = sops;
    if (category !== '全部') {
      result = result.filter(s => s.category === category);
    }
    if (query) {
      result = result.filter(s => s.title.includes(query) || s.version.includes(query));
    }
    return result;
  };

  return (
    <SOPContext.Provider value={{ 
      sops, 
      categories: SOP_CATEGORIES, 
      addSOP, updateSOP, deleteSOP, searchSOP 
    }}>
      {children}
    </SOPContext.Provider>
  );
}

export function useSOP() {
  const context = useContext(SOPContext);
  if (!context) throw new Error('useSOP error');
  return context;
}