import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ConstructionLog {
  id: string;
  date: string;
  weather: string;
  projectId: string;
  workItems: string;
  workers: number;
  notes?: string;
}

interface LogContextType {
  logs: ConstructionLog[];
  addLog: (log: Omit<ConstructionLog, 'id'>) => Promise<void>;
  deleteLog: (id: string) => Promise<void>;
  searchLogs: (query: string) => ConstructionLog[];
}

const LogContext = createContext<LogContextType | undefined>(undefined);

const MOCK_LOGS: ConstructionLog[] = [
  { id: '1', date: '2023-12-20', weather: '晴', projectId: '東后豐', workItems: '路基整平', workers: 5 },
  { id: '2', date: '2023-12-21', weather: '陰', projectId: '東后豐', workItems: 'AC鋪設', workers: 8 }
];

export function LogProvider({ children }: { children: React.ReactNode }) {
  const [logs, setLogs] = useState<ConstructionLog[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const stored = await AsyncStorage.getItem('dw_logs');
        if (stored) setLogs(JSON.parse(stored));
        else {
          setLogs(MOCK_LOGS);
          await AsyncStorage.setItem('dw_logs', JSON.stringify(MOCK_LOGS));
        }
      } catch (e) { console.error(e); }
    };
    loadData();
  }, []);

  const saveLogs = async (newData: ConstructionLog[]) => {
    setLogs(newData);
    await AsyncStorage.setItem('dw_logs', JSON.stringify(newData));
  };

  const addLog = async (log: Omit<ConstructionLog, 'id'>) => {
    await saveLogs([{ ...log, id: Date.now().toString() }, ...logs]);
  };
  const deleteLog = async (id: string) => {
    await saveLogs(logs.filter(l => l.id !== id));
  };
  const searchLogs = (query: string) => {
    if (!query) return logs;
    return logs.filter(l => l.workItems.includes(query) || l.projectId.includes(query));
  };

  return (
    <LogContext.Provider value={{ logs, addLog, deleteLog, searchLogs }}>
      {children}
    </LogContext.Provider>
  );
}

export function useLog() {
  const context = useContext(LogContext);
  if (!context) throw new Error('useLog Error');
  return context;
}