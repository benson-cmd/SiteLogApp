import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ProjectStatus = 
  | 'not_started'       // 未開工
  | 'started_offsite'   // 已開工未進場
  | 'ongoing'           // 施工中
  | 'completed_pending' // 完工待驗收
  | 'inspecting'        // 驗收中
  | 'closed';           // 結案

// 1. 定義詳細的展延紀錄結構
export interface Extension {
  id: string;
  date: string;         // 系統紀錄日期 (或核准日期)
  days: number;         // 展延天數
  reason: string;       // 展延理由
  letterDate: string;   // 函文日期
  letterNumber: string; // 函文文號
}

export interface Project {
  id: string;
  name: string;
  location: string;
  manager: string;

  // --- 契約與日期 ---
  awardDate?: string;       // 決標日期
  contractDuration: string; // 契約工期
  durationType: 'calendar' | 'working';
  startDate: string;        // 開工日期
  
  // --- 驗收相關 ---
  actualCompletionDate?: string; // 實際竣工日
  inspectionDate?: string;       // 驗收日期
  reinspectionDate?: string;     // 複驗日期
  inspectionPassedDate?: string; // 驗收合格日

  status: ProjectStatus;
  progress: number;
  
  // --- 展延紀錄 (陣列) ---
  extensions: Extension[]; 
}

interface ProjectContextType {
  projects: Project[];
  addProject: (project: Omit<Project, 'id'>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  updateProject: (id: string, data: Partial<Project>) => Promise<void>;
  searchProjects: (query: string) => Project[];
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

const MOCK_PROJECTS: Project[] = []; 

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const stored = await AsyncStorage.getItem('dw_projects');
        if (stored) {
          setProjects(JSON.parse(stored));
        } else {
          setProjects(MOCK_PROJECTS);
          await AsyncStorage.setItem('dw_projects', JSON.stringify(MOCK_PROJECTS));
        }
      } catch (e) {
        console.error('Failed to load projects', e);
      }
    };
    loadData();
  }, []);

  const saveToStorage = async (newData: Project[]) => {
    setProjects(newData);
    await AsyncStorage.setItem('dw_projects', JSON.stringify(newData));
  };

  const addProject = async (project: Omit<Project, 'id'>) => {
    const newProject: Project = { 
      ...project, 
      id: Date.now().toString(),
      extensions: [] 
    };
    const newData = [newProject, ...projects];
    await saveToStorage(newData);
  };

  const deleteProject = async (id: string) => {
    const newData = projects.filter(p => p.id !== id);
    await saveToStorage(newData);
  };

  const updateProject = async (id: string, data: Partial<Project>) => {
    const newData = projects.map(p => p.id === id ? { ...p, ...data } : p);
    await saveToStorage(newData);
  };

  const searchProjects = (query: string) => {
    if (!query) return projects;
    return projects.filter(p => 
      p.name.includes(query) || 
      p.location.includes(query) ||
      p.manager.includes(query)
    );
  };

  return (
    <ProjectContext.Provider value={{ projects, addProject, deleteProject, updateProject, searchProjects }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (!context) throw new Error('useProject must be used within a ProjectProvider');
  return context;
}