import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export interface AboutTeamMember {
  id: string;
  name: string;
  role: string;
  experience?: string;
  photoId?: string; // MediaContext id
  bio?: string;
}

export interface AboutContentLocale {
  heroTitle: string;
  heroSubtitle: string;
  companyText: string;
  teamTitle: string;
  teamSubtitle: string;
  galleryTitle: string;
  gallerySubtitle: string;
  valuesIntro?: string;
}

export interface AboutContentState {
  fa: AboutContentLocale;
  en: AboutContentLocale;
  team: AboutTeamMember[];
  galleryImageIds: string[]; // ordered
  heroImageId?: string | null;
}

interface AboutContentContextType {
  content: AboutContentState;
  updateLocale: (locale: 'fa' | 'en', updates: Partial<AboutContentLocale>) => void;
  addTeamMember: (member: Omit<AboutTeamMember, 'id'>) => void;
  updateTeamMember: (id: string, updates: Partial<AboutTeamMember>) => void;
  removeTeamMember: (id: string) => void;
  setGalleryImages: (imageIds: string[]) => void;
  setHeroImage: (imageId: string | null) => void;
}

const DEFAULT_CONTENT: AboutContentState = {
  fa: {
    heroTitle: 'درباره شرکت اعلا نیرو',
    heroSubtitle: 'تولیدکننده و تامین‌کننده راهکارهای انرژی باکیفیت',
    companyText: 'شرکت اعلا نیرو با سال‌ها تجربه، ارائه‌دهنده خدمات و محصولات حوزه انرژی است.',
    teamTitle: 'تیم ما',
    teamSubtitle: 'متخصصان مجرب و متعهد شرکت اعلا نیرو',
    galleryTitle: 'گالری شرکت',
    gallerySubtitle: 'نگاهی به شرکت ما — مجموعه‌ای از تصاویر شرکت، تیم ما، تجهیزات و فضای کاری'
  },
  en: {
    heroTitle: 'About Aalaniroo Company',
    heroSubtitle: 'Provider of high-quality energy solutions',
    companyText: 'Aalaniroo delivers products and services in the energy sector with years of experience.',
    teamTitle: 'Our Team',
    teamSubtitle: 'Experienced and dedicated specialists of Aalaniroo',
    galleryTitle: 'Company Gallery',
    gallerySubtitle: 'A look at our company — images of our team, equipment, and workspace'
  },
  team: [
    {
      id: 'abtmem-1',
      name: 'مهندس احمد محمدی',
      role: 'مدیرعامل',
      experience: '25 سال تجربه',
      bio: 'متخصص ژنراتورهای صنعتی و مدیریت پروژه‌های بزرگ'
    },
    {
      id: 'abtmem-2',
      name: 'مهندس فاطمه کریمی',
      role: 'مدیر فنی',
      experience: '18 سال تجربه',
      bio: 'کارشناس سیستم‌های برق و انرژی پایدار'
    },
    {
      id: 'abtmem-3',
      name: 'مهندس علی رضایی',
      role: 'مدیر فروش',
      experience: '15 سال تجربه',
      bio: 'متخصص مشاوره فنی و فروش تجهیزات صنعتی'
    },
    {
      id: 'abtmem-4',
      name: 'مهندس مریم احمدی',
      role: 'مدیر پروژه',
      experience: '12 سال تجربه',
      bio: 'کارشناس مدیریت پروژه و کنترل کیفیت'
    }
  ],
  galleryImageIds: [],
  heroImageId: null
};

const AboutContentContext = createContext<AboutContentContextType | undefined>(undefined);

export function AboutContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<AboutContentState>(() => {
    try {
      const saved = localStorage.getItem('aboutContent');
      if (!saved) return DEFAULT_CONTENT;
      const parsed = JSON.parse(saved) as Partial<AboutContentState>;
      // Merge with defaults to migrate older saves
      return {
        fa: { ...DEFAULT_CONTENT.fa, ...(parsed.fa || {}) },
        en: { ...DEFAULT_CONTENT.en, ...(parsed.en || {}) },
        team: parsed.team || DEFAULT_CONTENT.team,
        galleryImageIds: parsed.galleryImageIds || DEFAULT_CONTENT.galleryImageIds,
        heroImageId: (parsed as any).heroImageId ?? DEFAULT_CONTENT.heroImageId,
      };
    } catch {
      return DEFAULT_CONTENT;
    }
  });

  useEffect(() => {
    try { localStorage.setItem('aboutContent', JSON.stringify(content)); } catch {}
  }, [content]);

  const updateLocale = (locale: 'fa' | 'en', updates: Partial<AboutContentLocale>) => {
    setContent(prev => ({ ...prev, [locale]: { ...prev[locale], ...updates } }));
  };

  const addTeamMember = (member: Omit<AboutTeamMember, 'id'>) => {
    const id = `abtmem-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setContent(prev => ({ ...prev, team: [...prev.team, { id, ...member }] }));
  };

  const updateTeamMember = (id: string, updates: Partial<AboutTeamMember>) => {
    setContent(prev => ({ ...prev, team: prev.team.map(m => m.id === id ? { ...m, ...updates } : m) }));
  };

  const removeTeamMember = (id: string) => {
    setContent(prev => ({ ...prev, team: prev.team.filter(m => m.id !== id) }));
  };

  const setGalleryImages = (imageIds: string[]) => {
    setContent(prev => ({ ...prev, galleryImageIds: [...imageIds] }));
  };

  const setHeroImage = (imageId: string | null) => {
    setContent(prev => ({ ...prev, heroImageId: imageId }));
  };

  const value = useMemo<AboutContentContextType>(() => ({
    content,
    updateLocale,
    addTeamMember,
    updateTeamMember,
    removeTeamMember,
    setGalleryImages,
    setHeroImage,
  }), [content]);

  return (
    <AboutContentContext.Provider value={value}>
      {children}
    </AboutContentContext.Provider>
  );
}

export function useAboutContent() {
  const ctx = useContext(AboutContentContext);
  if (!ctx) throw new Error('useAboutContent must be used within AboutContentProvider');
  return ctx;
}

