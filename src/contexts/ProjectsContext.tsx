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

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { projects as mockProjects } from '@/data/mockData';

export type ProjectMediaType = 'none' | 'image' | 'video';

export interface Project {
  id: string;
  title: string;
  location: string;
  capacity: string;
  year: string; // keep as string for Jalali display compatibility if needed
  description: string;
  client: string;
  mediaType: ProjectMediaType;
  imageUrl?: string; // thumbnail or cover image
  videoUrl?: string; // optional cover video
  posterUrl?: string;
  featured?: boolean;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  // Back-compat for components expecting `image`
  image?: string;
}

interface ProjectsContextType {
  projects: Project[];
  addProject: (draft: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => Project;
  updateProject: (id: string, updates: Partial<Project>) => void;
  removeProject: (id: string) => void;
  clearAll: () => void;
  importMockIfEmpty: () => void;
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

const STORAGE_KEY = 'projects';

function generateId(prefix = 'prj'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeMock(): Project[] {
  // Map mock projects to our structure
  return mockProjects.map((p) => ({
    id: generateId('seed'),
    title: (p as any).title,
    location: (p as any).location,
    capacity: (p as any).capacity,
    year: String((p as any).year),
    description: (p as any).description,
    client: (p as any).client,
    mediaType: 'image',
    imageUrl: (p as any).image,
    image: (p as any).image,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
}

export const ProjectsProvider = ({ children }: { children: React.ReactNode }) => {
  const [projects, setProjects] = useState<Project[]>([]);

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Project[];
        // Basic migration/normalization
        const normalized = parsed.map((p) => ({
          ...p,
          mediaType: p.mediaType || (p.videoUrl ? 'video' : (p.imageUrl || p.image ? 'image' : 'none')),
          imageUrl: p.imageUrl || p.image || undefined,
          image: p.image || p.imageUrl || undefined,
          createdAt: p.createdAt || new Date().toISOString(),
          updatedAt: p.updatedAt || new Date().toISOString(),
        }));
        setProjects(normalized);
        return;
      }
      // Seed with mock by default so public page looks good
      setProjects(normalizeMock());
    } catch {
      setProjects(normalizeMock());
    }
  }, []);

  // Persist
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    } catch {}
  }, [projects]);

  const addProject = useCallback((draft: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Project => {
    const id = generateId();
    const now = new Date().toISOString();
    const project: Project = {
      ...draft,
      id,
      createdAt: now,
      updatedAt: now,
      image: draft.imageUrl || draft.image,
      mediaType: draft.mediaType || (draft.videoUrl ? 'video' : (draft.imageUrl ? 'image' : 'none')),
    } as Project;
    setProjects((prev) => [project, ...prev]);
    return project;
  }, []);

  const updateProject = useCallback((id: string, updates: Partial<Project>) => {
    setProjects((prev) => prev.map((p) => (
      p.id === id
        ? {
            ...p,
            ...updates,
            image: (updates.image ?? updates.imageUrl) || p.image || p.imageUrl,
            mediaType: updates.mediaType || p.mediaType,
            updatedAt: new Date().toISOString(),
          }
        : p
    )));
  }, []);

  const removeProject = useCallback((id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setProjects([]);
  }, []);

  const importMockIfEmpty = useCallback(() => {
    setProjects((prev) => (prev.length === 0 ? normalizeMock() : prev));
  }, []);

  const value = useMemo<ProjectsContextType>(() => ({
    projects,
    addProject,
    updateProject,
    removeProject,
    clearAll,
    importMockIfEmpty,
  }), [projects, addProject, updateProject, removeProject, clearAll, importMockIfEmpty]);

  return (
    <ProjectsContext.Provider value={value}>{children}</ProjectsContext.Provider>
  );
};

export function useProjects(): ProjectsContextType {
  const ctx = useContext(ProjectsContext);
  if (!ctx) throw new Error('useProjects must be used within ProjectsProvider');
  return ctx;
}
