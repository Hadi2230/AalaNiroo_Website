import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';

export type MediaType = 'image' | 'video';

export interface HomeHero {
  type: 'none' | 'image' | 'video';
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaUrl?: string;
  callText?: string;
  overlay?: boolean;
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  posterUrl?: string;
  imageUrl?: string;
  videoUrl?: string;
}

export interface IntroMedia {
  type: 'none' | 'image' | 'video';
  imageUrl?: string;
  videoUrl?: string;
  posterUrl?: string;
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
}

export interface HomeGalleryItem {
  id: string;
  type: MediaType;
  url: string;
  alt: string;
  caption?: string;
  order: number;
}

export interface HomeContentState {
  hero: HomeHero;
  gallery: HomeGalleryItem[];
  introMedia: IntroMedia;
  servicesMedia: IntroMedia;
  emergencyMedia: IntroMedia;
  featuredProductIds: string[];
  updatedAt: string;
  updatedBy?: string;
}

interface HomeContentContextType {
  content: HomeContentState;
  setHero: (hero: Partial<HomeHero>) => void;
  clearHero: () => void;
  setIntroMedia: (media: Partial<IntroMedia>) => void;
  clearIntroMedia: () => void;
  setServicesMedia: (media: Partial<IntroMedia>) => void;
  clearServicesMedia: () => void;
  setEmergencyMedia: (media: Partial<IntroMedia>) => void;
  clearEmergencyMedia: () => void;
  addGalleryItem: (item: Omit<HomeGalleryItem, 'id' | 'order'>) => void;
  removeGalleryItem: (id: string) => void;
  updateGalleryItem: (id: string, updates: Partial<HomeGalleryItem>) => void;
  reorderGallery: (idsInOrder: string[]) => void;
  setGallery: (items: HomeGalleryItem[]) => void;
  setFeaturedProducts: (ids: string[]) => void;
  toggleFeaturedProduct: (id: string) => void;
}

const initialState: HomeContentState = {
  hero: {
    type: 'none',
    title: 'پیشرو در تولید ژنراتورهای صنعتی',
    subtitle: 'با بیش از 33 سال تجربه در صنعت ژنراتور، نماینده رسمی برندهای معتبر جهانی',
    ctaText: 'درخواست پیش‌فاکتور',
    callText: 'تماس فوری',
    overlay: true,
    autoplay: true,
    muted: true,
    loop: true,
  },
  gallery: [],
  introMedia: {
    type: 'none',
    autoplay: false,
    muted: true,
    loop: false,
  },
  servicesMedia: {
    type: 'none',
    autoplay: false,
    muted: true,
    loop: false,
  },
  emergencyMedia: {
    type: 'none',
    autoplay: false,
    muted: true,
    loop: false,
  },
  featuredProductIds: [],
  updatedAt: new Date().toISOString(),
};

const HomeContentContext = createContext<HomeContentContextType | undefined>(undefined);

export const useHomeContent = () => {
  const ctx = useContext(HomeContentContext);
  if (!ctx) throw new Error('useHomeContent must be used within HomeContentProvider');
  return ctx;
};

export const HomeContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<HomeContentState>(initialState);

  const bcRef = useRef<BroadcastChannel | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const skipBroadcastNextRef = useRef<boolean>(false);
  const tabIdRef = useRef<string>(`tab-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);

  // Load
  useEffect(() => {
    try {
      const saved = localStorage.getItem('homeContent');
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<HomeContentState>;
        // migrate to ensure introMedia exists with safe defaults
        if (!parsed.introMedia) {
          (parsed as HomeContentState).introMedia = { type: 'none', autoplay: false, muted: true, loop: false } as IntroMedia;
        }
        // migrate to ensure servicesMedia exists
        if (!(parsed as HomeContentState).servicesMedia) {
          (parsed as HomeContentState).servicesMedia = { type: 'none', autoplay: false, muted: true, loop: false } as IntroMedia;
        }
        // migrate to ensure emergencyMedia exists
        if (!(parsed as HomeContentState).emergencyMedia) {
          (parsed as HomeContentState).emergencyMedia = { type: 'none', autoplay: false, muted: true, loop: false } as IntroMedia;
        }
        setContent({
          hero: parsed.hero ?? initialState.hero,
          gallery: parsed.gallery ?? initialState.gallery,
          introMedia: (parsed as HomeContentState).introMedia,
          servicesMedia: (parsed as HomeContentState).servicesMedia,
          emergencyMedia: (parsed as HomeContentState).emergencyMedia,
          updatedAt: parsed.updatedAt ?? new Date().toISOString(),
          updatedBy: parsed.updatedBy,
        });
      }
    } catch {}

    // BC
    try {
      // @ts-ignore
      bcRef.current = new BroadcastChannel('home_content_channel');
      bcRef.current.onmessage = (evt: MessageEvent) => {
        const msg = evt.data;
        if (msg && msg.type === 'HOME_CONTENT_UPDATED' && msg.source !== tabIdRef.current) {
          skipBroadcastNextRef.current = true;
          try { localStorage.setItem('homeContent', JSON.stringify(msg.content)); } catch {}
          setContent(msg.content as HomeContentState);
        }
      };
    } catch {}

    // WS Relay in dev
    if (import.meta.env.DEV) {
      try {
        wsRef.current = new WebSocket('ws://localhost:3001');
        wsRef.current.onmessage = (evt) => {
          try {
            const msg = JSON.parse(evt.data);
            if (msg && msg.type === 'HOME_CONTENT_UPDATED' && msg.source !== tabIdRef.current) {
              skipBroadcastNextRef.current = true;
              try { localStorage.setItem('homeContent', JSON.stringify(msg.content)); } catch {}
              setContent(msg.content as HomeContentState);
            }
          } catch {}
        };
      } catch {}
    }

    return () => {
      try { bcRef.current?.close(); } catch {}
      try { wsRef.current?.close(); } catch {}
    };
  }, []);

  // Persist and broadcast
  useEffect(() => {
    try { localStorage.setItem('homeContent', JSON.stringify(content)); } catch {}
    if (skipBroadcastNextRef.current) { skipBroadcastNextRef.current = false; return; }
    try { bcRef.current?.postMessage({ type: 'HOME_CONTENT_UPDATED', content, source: tabIdRef.current }); } catch {}
    if (import.meta.env.DEV && wsRef.current && wsRef.current.readyState === 1) {
      try { wsRef.current.send(JSON.stringify({ type: 'HOME_CONTENT_UPDATED', content, source: tabIdRef.current })); } catch {}
    }
  }, [content]);

  const setHero = useCallback((hero: Partial<HomeHero>) => {
    setContent(prev => ({
      ...prev,
      hero: { ...prev.hero, ...hero },
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const clearHero = useCallback(() => {
    setContent(prev => ({ ...prev, hero: { type: 'none', overlay: true, autoplay: true, muted: true, loop: true }, updatedAt: new Date().toISOString() }));
  }, []);

  const setIntroMedia = useCallback((media: Partial<IntroMedia>) => {
    setContent(prev => ({
      ...prev,
      introMedia: { ...prev.introMedia, ...media },
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const clearIntroMedia = useCallback(() => {
    setContent(prev => ({ ...prev, introMedia: { type: 'none', autoplay: false, muted: true, loop: false }, updatedAt: new Date().toISOString() }));
  }, []);

  const setServicesMedia = useCallback((media: Partial<IntroMedia>) => {
    setContent(prev => ({
      ...prev,
      servicesMedia: { ...prev.servicesMedia, ...media },
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const clearServicesMedia = useCallback(() => {
    setContent(prev => ({ ...prev, servicesMedia: { type: 'none', autoplay: false, muted: true, loop: false }, updatedAt: new Date().toISOString() }));
  }, []);

  const setEmergencyMedia = useCallback((media: Partial<IntroMedia>) => {
    setContent(prev => ({
      ...prev,
      emergencyMedia: { ...prev.emergencyMedia, ...media },
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const clearEmergencyMedia = useCallback(() => {
    setContent(prev => ({ ...prev, emergencyMedia: { type: 'none', autoplay: false, muted: true, loop: false }, updatedAt: new Date().toISOString() }));
  }, []);

  const addGalleryItem = useCallback((item: Omit<HomeGalleryItem, 'id' | 'order'>) => {
    const id = `hg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setContent(prev => ({
      ...prev,
      gallery: [...prev.gallery, { ...item, id, order: Date.now() }],
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const removeGalleryItem = useCallback((id: string) => {
    setContent(prev => ({
      ...prev,
      gallery: prev.gallery.filter(g => g.id !== id),
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const updateGalleryItem = useCallback((id: string, updates: Partial<HomeGalleryItem>) => {
    setContent(prev => ({
      ...prev,
      gallery: prev.gallery.map(g => g.id === id ? { ...g, ...updates } : g),
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const reorderGallery = useCallback((idsInOrder: string[]) => {
    setContent(prev => {
      const map = new Map(prev.gallery.map(g => [g.id, g] as const));
      const next = idsInOrder.map((id, idx) => ({ ...(map.get(id)!), order: idx }));
      return { ...prev, gallery: next, updatedAt: new Date().toISOString() };
    });
  }, []);

  const setGallery = useCallback((items: HomeGalleryItem[]) => {
    setContent(prev => ({ ...prev, gallery: items, updatedAt: new Date().toISOString() }));
  }, []);

  const setFeaturedProducts = useCallback((ids: string[]) => {
    setContent(prev => ({ ...prev, featuredProductIds: ids, updatedAt: new Date().toISOString() }));
  }, []);

  const toggleFeaturedProduct = useCallback((id: string) => {
    setContent(prev => {
      const current = new Set(prev.featuredProductIds || []);
      if (current.has(id)) current.delete(id); else current.add(id);
      return { ...prev, featuredProductIds: Array.from(current), updatedAt: new Date().toISOString() };
    });
  }, []);

  const value: HomeContentContextType = {
    content,
    setHero,
    clearHero,
    setIntroMedia,
    clearIntroMedia,
    setServicesMedia,
    clearServicesMedia,
    setEmergencyMedia,
    clearEmergencyMedia,
    addGalleryItem,
    removeGalleryItem,
    updateGalleryItem,
    reorderGallery,
    setGallery,
    setFeaturedProducts,
    toggleFeaturedProduct,
  };

  return (
    <HomeContentContext.Provider value={value}>
      {children}
    </HomeContentContext.Provider>
  );
};

