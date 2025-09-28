import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';

export type MediaType = 'image' | 'video';

export interface HomeHero {
  type: 'none' | 'image' | 'video';
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaUrl?: string;
  overlay?: boolean;
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  posterUrl?: string;
  imageUrl?: string;
  videoUrl?: string;
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
  updatedAt: string;
  updatedBy?: string;
}

interface HomeContentContextType {
  content: HomeContentState;
  setHero: (hero: Partial<HomeHero>) => void;
  clearHero: () => void;
  addGalleryItem: (item: Omit<HomeGalleryItem, 'id' | 'order'>) => void;
  removeGalleryItem: (id: string) => void;
  updateGalleryItem: (id: string, updates: Partial<HomeGalleryItem>) => void;
  reorderGallery: (idsInOrder: string[]) => void;
  setGallery: (items: HomeGalleryItem[]) => void;
}

const initialState: HomeContentState = {
  hero: {
    type: 'none',
    overlay: true,
    autoplay: true,
    muted: true,
    loop: true,
  },
  gallery: [],
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
      if (saved) setContent(JSON.parse(saved));
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

  const value: HomeContentContextType = {
    content,
    setHero,
    clearHero,
    addGalleryItem,
    removeGalleryItem,
    updateGalleryItem,
    reorderGallery,
    setGallery,
  };

  return (
    <HomeContentContext.Provider value={value}>
      {children}
    </HomeContentContext.Provider>
  );
};

