import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import { projects as mockProjects } from '@/data/mockData';

export interface ProjectItem {
  id: string;
  title: string;
  location: string;
  capacity: string;
  year: string;
  image: string; // supports idb: scheme
  description: string;
  client: string;
  status: 'published' | 'draft';
  category?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

interface ProjectsContextType {
  projects: ProjectItem[];
  allProjects: ProjectItem[];
  isLoading: boolean;
  error: string | null;
  createProject: (data: Partial<ProjectItem>) => Promise<ProjectItem>;
  updateProject: (id: string, updates: Partial<ProjectItem>) => Promise<boolean>;
  deleteProject: (id: string) => Promise<boolean>;
  importProjects: (items: ProjectItem[]) => Promise<void>;
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

export function useProjects(): ProjectsContextType {
  const ctx = useContext(ProjectsContext);
  if (!ctx) throw new Error('useProjects must be used within ProjectsProvider');
  return ctx;
}

function seedDefaults(): ProjectItem[] {
  try {
    if (Array.isArray(mockProjects) && mockProjects.length > 0) {
      const seeded = mockProjects.slice(0, 9).map((p) => ({
        id: `proj-${p.id}`,
        title: p.title,
        location: p.location,
        capacity: p.capacity,
        year: String(p.year),
        image: p.image,
        description: p.description,
        client: p.client,
        status: 'published',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'seed',
        updatedBy: 'seed',
      } as ProjectItem));
      return seeded;
    }
  } catch {}
  return [];
}

export const ProjectsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<ProjectItem[]>(() => {
    try {
      const raw = localStorage.getItem('projectsData');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed as ProjectItem[];
      }
    } catch {}
    const seeded = seedDefaults();
    try { localStorage.setItem('projectsData', JSON.stringify(seeded)); } catch {}
    return seeded;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bcRef = useRef<BroadcastChannel | null>(null);
  const tabIdRef = useRef<string>(`tab-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);
  const skipBroadcastNextRef = useRef<boolean>(false);

  useEffect(() => {
    const onStorage = (evt: StorageEvent) => {
      if (evt.key === 'projectsData' && evt.newValue) {
        try {
          const next = JSON.parse(evt.newValue) as ProjectItem[];
          setProjects(next);
        } catch {}
      }
    };
    window.addEventListener('storage', onStorage);
    try {
      // @ts-ignore
      bcRef.current = new BroadcastChannel('projects_channel');
      bcRef.current.onmessage = (event: MessageEvent) => {
        const data = event.data;
        if (data && data.type === 'PROJECTS_UPDATED' && data.source !== tabIdRef.current) {
          skipBroadcastNextRef.current = true;
          setProjects(data.projects as ProjectItem[]);
        }
      };
    } catch {}
    return () => {
      window.removeEventListener('storage', onStorage);
      try { bcRef.current?.close(); } catch {}
    };
  }, []);

  useEffect(() => {
    try { localStorage.setItem('projectsData', JSON.stringify(projects)); } catch {}
    if (skipBroadcastNextRef.current) {
      skipBroadcastNextRef.current = false;
      return;
    }
    try { bcRef.current?.postMessage({ type: 'PROJECTS_UPDATED', projects, source: tabIdRef.current }); } catch {}
  }, [projects]);

  const createProject = useCallback(async (data: Partial<ProjectItem>): Promise<ProjectItem> => {
    setIsLoading(true);
    setError(null);
    try {
      const now = new Date().toISOString();
      const newItem: ProjectItem = {
        id: `proj-${Date.now()}`,
        title: data.title || '',
        location: data.location || '',
        capacity: data.capacity || '',
        year: data.year || String(new Date().getFullYear()),
        image: data.image || '',
        description: data.description || '',
        client: data.client || '',
        status: data.status || 'draft',
        category: data.category,
        createdAt: now,
        updatedAt: now,
        createdBy: 'admin',
        updatedBy: 'admin',
      };
      setProjects((prev) => [newItem, ...prev]);
      toast.success('پروژه جدید ایجاد شد');
      return newItem;
    } catch (e) {
      setError('خطا در ایجاد پروژه');
      toast.error('خطا در ایجاد پروژه');
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProject = useCallback(async (id: string, updates: Partial<ProjectItem>): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString(), updatedBy: 'admin' } : p)));
      toast.success('پروژه به‌روزرسانی شد');
      return true;
    } catch (e) {
      setError('خطا در به‌روزرسانی پروژه');
      toast.error('خطا در به‌روزرسانی پروژه');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteProject = useCallback(async (id: string): Promise<boolean> => {
    try {
      setProjects((prev) => prev.filter((p) => p.id !== id));
      toast.success('پروژه حذف شد');
      return true;
    } catch (e) {
      toast.error('خطا در حذف پروژه');
      return false;
    }
  }, []);

  const importProjects = useCallback(async (items: ProjectItem[]) => {
    try {
      setProjects(items);
      toast.success('پروژه‌ها وارد شدند');
    } catch {
      toast.error('خطا در وارد کردن پروژه‌ها');
    }
  }, []);

  const value: ProjectsContextType = useMemo(
    () => ({
      projects: [...projects].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()),
      allProjects: projects,
      isLoading,
      error,
      createProject,
      updateProject,
      deleteProject,
      importProjects,
    }),
    [projects, isLoading, error, createProject, updateProject, deleteProject, importProjects]
  );

  return <ProjectsContext.Provider value={value}>{children}</ProjectsContext.Provider>;
};

