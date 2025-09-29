import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

export interface MediaFile {
  id: string;
  name: string;
  originalName: string;
  type: 'image' | 'document' | 'video' | 'audio';
  url: string;
  thumbnailUrl?: string;
  size: number;
  uploadedAt: string;
  folder: string;
  tags: string[];
  description: string;
  alt: string;
  copyright: string;
  dimensions?: { width: number; height: number };
  isFavorite: boolean;
  usageCount: number;
  lastUsed?: string;
  uploadedBy: string;
  mimeType: string;
}

export interface MediaFolder {
  id: string;
  name: string;
  parentId?: string;
  color: string;
  icon: string;
  description?: string;
  createdAt: string;
  fileCount: number;
}

export interface MediaGallery {
  id: string;
  slug: string;
  title: string;
  description: string;
  coverImageId?: string;
  imageIds: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface MediaContextType {
  mediaFiles: MediaFile[];
  folders: MediaFolder[];
  galleries: MediaGallery[];
  uploadFile: (file: File, folder?: string, metadata?: Partial<MediaFile>) => Promise<MediaFile>;
  deleteFile: (fileId: string) => Promise<boolean>;
  updateFile: (fileId: string, updates: Partial<MediaFile>) => Promise<boolean>;
  createFolder: (name: string, parentId?: string) => Promise<MediaFolder>;
  deleteFolder: (folderId: string) => Promise<boolean>;
  getFilesByFolder: (folderId: string) => MediaFile[];
  getFilesByType: (type: MediaFile['type']) => MediaFile[];
  searchFiles: (query: string) => MediaFile[];
  toggleFavorite: (fileId: string) => Promise<boolean>;
  getGalleryImages: () => MediaFile[];
  // Galleries API
  createGallery: (data: { title: string; description?: string; tags?: string[]; coverImageId?: string }) => Promise<MediaGallery>;
  updateGallery: (galleryId: string, updates: Partial<MediaGallery>) => Promise<boolean>;
  deleteGallery: (galleryId: string) => Promise<boolean>;
  addImagesToGallery: (galleryId: string, imageIds: string[]) => Promise<boolean>;
  removeImageFromGallery: (galleryId: string, imageId: string) => Promise<boolean>;
  listGalleries: () => MediaGallery[];
  getGalleryBySlug: (slug: string) => MediaGallery | undefined;
  isLoading: boolean;
  error: string | null;
}

const MediaContext = createContext<MediaContextType | undefined>(undefined);

export const useMedia = () => {
  const context = useContext(MediaContext);
  if (context === undefined) {
    throw new Error('useMedia must be used within a MediaProvider');
  }
  return context;
};

interface MediaProviderProps {
  children: ReactNode;
}

export const MediaProvider: React.FC<MediaProviderProps> = ({ children }) => {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [folders, setFolders] = useState<MediaFolder[]>([
    {
      id: 'gallery',
      name: 'گالری شرکت',
      color: '#10b981',
      icon: 'Image',
      description: 'تصاویر برای نمایش در گالری صفحه درباره ما',
      createdAt: new Date().toISOString(),
      fileCount: 0
    },
    {
      id: 'homepage',
      name: 'رسانه صفحه اصلی',
      color: '#00a7bb',
      icon: 'Home',
      description: 'ویدیو/تصویر هیرو و گالری صفحه اصلی',
      createdAt: new Date().toISOString(),
      fileCount: 0
    },
    {
      id: 'products',
      name: 'تصاویر محصولات',
      color: '#3b82f6',
      icon: 'Package',
      description: 'تصاویر محصولات و ژنراتورها',
      createdAt: new Date().toISOString(),
      fileCount: 0
    },
    {
      id: 'projects',
      name: 'تصاویر پروژه‌ها',
      color: '#8b5cf6',
      icon: 'Building',
      description: 'تصاویر پروژه‌های اجرا شده',
      createdAt: new Date().toISOString(),
      fileCount: 0
    },
    {
      id: 'documents',
      name: 'اسناد و مدارک',
      color: '#f59e0b',
      icon: 'FileText',
      description: 'کاتالوگ‌ها، گواهینامه‌ها و مدارک',
      createdAt: new Date().toISOString(),
      fileCount: 0
    }
  ]);
  const [galleries, setGalleries] = useState<MediaGallery[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load data from localStorage on mount
  useEffect(() => {
    const loadMediaData = () => {
      try {
        const savedFiles = localStorage.getItem('mediaFiles');
        if (savedFiles) {
          setMediaFiles(JSON.parse(savedFiles));
        }

        const savedFolders = localStorage.getItem('mediaFolders');
        if (savedFolders) {
          setFolders(JSON.parse(savedFolders));
        }

        const savedGalleries = localStorage.getItem('mediaGalleries');
        if (savedGalleries) {
          setGalleries(JSON.parse(savedGalleries));
        }
      } catch (error) {
        console.error('Error loading media data:', error);
        setError('خطا در بارگذاری رسانه‌ها');
      }
    };

    loadMediaData();
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('mediaFiles', JSON.stringify(mediaFiles));
  }, [mediaFiles]);

  useEffect(() => {
    localStorage.setItem('mediaFolders', JSON.stringify(folders));
  }, [folders]);

  useEffect(() => {
    localStorage.setItem('mediaGalleries', JSON.stringify(galleries));
  }, [galleries]);

  const uploadFile = async (file: File, folder = 'gallery', metadata: Partial<MediaFile> = {}): Promise<MediaFile> => {
    setIsLoading(true);
    setError(null);

    try {
      // Create file URL using FileReader
      const fileUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      });

      // Get image dimensions if it's an image
      let dimensions: { width: number; height: number } | undefined;
      if (file.type.startsWith('image/')) {
        dimensions = await new Promise<{ width: number; height: number }>((resolve) => {
          const img = new Image();
          img.onload = () => resolve({ width: img.width, height: img.height });
          img.src = fileUrl;
        });
      }

      const newFile: MediaFile = {
        id: `media-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name.replace(/\.[^/.]+$/, ''), // Remove extension
        originalName: file.name,
        type: getFileType(file.type),
        url: fileUrl,
        thumbnailUrl: file.type.startsWith('image/') ? fileUrl : undefined,
        size: file.size,
        uploadedAt: new Date().toISOString(),
        folder,
        tags: metadata.tags || [],
        description: metadata.description || '',
        alt: metadata.alt || file.name,
        copyright: metadata.copyright || '',
        dimensions,
        isFavorite: false,
        usageCount: 0,
        uploadedBy: 'Admin User',
        mimeType: file.type,
        ...metadata
      };

      setMediaFiles(prev => [...prev, newFile]);
      
      // Update folder file count
      setFolders(prev => prev.map(f => 
        f.id === folder 
          ? { ...f, fileCount: f.fileCount + 1 }
          : f
      ));

      toast.success('فایل با موفقیت آپلود شد', {
        description: `${file.name} در پوشه ${folders.find(f => f.id === folder)?.name} ذخیره شد`
      });

      return newFile;
    } catch (error) {
      console.error('Upload failed:', error);
      setError('خطا در آپلود فایل');
      toast.error('خطا در آپلود فایل', {
        description: 'لطفاً دوباره تلاش کنید'
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteFile = async (fileId: string): Promise<boolean> => {
    try {
      const file = mediaFiles.find(f => f.id === fileId);
      if (!file) return false;

      setMediaFiles(prev => prev.filter(f => f.id !== fileId));
      
      // Update folder file count
      setFolders(prev => prev.map(f => 
        f.id === file.folder 
          ? { ...f, fileCount: Math.max(0, f.fileCount - 1) }
          : f
      ));

      toast.success('فایل حذف شد');
      return true;
    } catch (error) {
      console.error('Delete failed:', error);
      toast.error('خطا در حذف فایل');
      return false;
    }
  };

  const updateFile = async (fileId: string, updates: Partial<MediaFile>): Promise<boolean> => {
    try {
      setMediaFiles(prev => prev.map(file => 
        file.id === fileId 
          ? { ...file, ...updates }
          : file
      ));

      toast.success('اطلاعات فایل به‌روزرسانی شد');
      return true;
    } catch (error) {
      console.error('Update failed:', error);
      toast.error('خطا در به‌روزرسانی فایل');
      return false;
    }
  };

  const createFolder = async (name: string, parentId?: string): Promise<MediaFolder> => {
    const newFolder: MediaFolder = {
      id: `folder-${Date.now()}`,
      name,
      parentId,
      color: '#6b7280',
      icon: 'Folder',
      createdAt: new Date().toISOString(),
      fileCount: 0
    };

    setFolders(prev => [...prev, newFolder]);
    toast.success('پوشه جدید ایجاد شد');
    return newFolder;
  };

  const deleteFolder = async (folderId: string): Promise<boolean> => {
    try {
      // Move files to 'gallery' folder before deleting
      setMediaFiles(prev => prev.map(file => 
        file.folder === folderId 
          ? { ...file, folder: 'gallery' }
          : file
      ));

      setFolders(prev => prev.filter(f => f.id !== folderId));
      toast.success('پوشه حذف شد');
      return true;
    } catch (error) {
      toast.error('خطا در حذف پوشه');
      return false;
    }
  };

  const getFilesByFolder = (folderId: string): MediaFile[] => {
    if (folderId === 'all') return mediaFiles;
    return mediaFiles.filter(file => file.folder === folderId);
  };

  const getFilesByType = (type: MediaFile['type']): MediaFile[] => {
    return mediaFiles.filter(file => file.type === type);
  };

  const searchFiles = (query: string): MediaFile[] => {
    if (!query.trim()) return mediaFiles;
    const lowerQuery = query.toLowerCase();
    return mediaFiles.filter(file =>
      file.name.toLowerCase().includes(lowerQuery) ||
      file.description.toLowerCase().includes(lowerQuery) ||
      file.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  };

  const toggleFavorite = async (fileId: string): Promise<boolean> => {
    try {
      setMediaFiles(prev => prev.map(file => 
        file.id === fileId 
          ? { ...file, isFavorite: !file.isFavorite }
          : file
      ));
      return true;
    } catch (error) {
      toast.error('خطا در به‌روزرسانی');
      return false;
    }
  };

  const getGalleryImages = (): MediaFile[] => {
    return mediaFiles.filter(file => 
      file.type === 'image' && 
      (file.folder === 'gallery' || file.tags.includes('gallery'))
    );
  };

  // Helper function to determine file type
  const getFileType = (mimeType: string): MediaFile['type'] => {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    return 'document';
  };

  const slugify = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  };

  // Galleries API implementations
  const createGallery = async (data: { title: string; description?: string; tags?: string[]; coverImageId?: string }): Promise<MediaGallery> => {
    const now = new Date().toISOString();
    const gallery: MediaGallery = {
      id: `gal-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      slug: slugify(data.title),
      title: data.title,
      description: data.description || '',
      coverImageId: data.coverImageId,
      imageIds: [],
      tags: data.tags || [],
      createdAt: now,
      updatedAt: now,
    };
    setGalleries(prev => [gallery, ...prev]);
    toast.success('گالری ایجاد شد');
    return gallery;
  };

  const updateGallery = async (galleryId: string, updates: Partial<MediaGallery>): Promise<boolean> => {
    setGalleries(prev => prev.map(g => g.id === galleryId ? { ...g, ...updates, slug: updates.title ? slugify(updates.title) : g.slug, updatedAt: new Date().toISOString() } : g));
    toast.success('گالری به‌روزرسانی شد');
    return true;
  };

  const deleteGallery = async (galleryId: string): Promise<boolean> => {
    setGalleries(prev => prev.filter(g => g.id !== galleryId));
    toast.success('گالری حذف شد');
    return true;
  };

  const addImagesToGallery = async (galleryId: string, imageIds: string[]): Promise<boolean> => {
    setGalleries(prev => prev.map(g => {
      if (g.id !== galleryId) return g;
      const unique = Array.from(new Set([...(g.imageIds || []), ...imageIds]));
      return { ...g, imageIds: unique, updatedAt: new Date().toISOString() };
    }));
    toast.success('تصاویر به گالری افزوده شد');
    return true;
  };

  const removeImageFromGallery = async (galleryId: string, imageId: string): Promise<boolean> => {
    setGalleries(prev => prev.map(g => g.id === galleryId ? { ...g, imageIds: g.imageIds.filter(id => id !== imageId), updatedAt: new Date().toISOString() } : g));
    return true;
  };

  const listGalleries = (): MediaGallery[] => galleries;
  const getGalleryBySlug = (slug: string): MediaGallery | undefined => galleries.find(g => g.slug === slug);

  const value: MediaContextType = {
    mediaFiles,
    folders,
    galleries,
    uploadFile,
    deleteFile,
    updateFile,
    createFolder,
    deleteFolder,
    getFilesByFolder,
    getFilesByType,
    searchFiles,
    toggleFavorite,
    getGalleryImages,
    createGallery,
    updateGallery,
    deleteGallery,
    addImagesToGallery,
    removeImageFromGallery,
    listGalleries,
    getGalleryBySlug,
    isLoading,
    error
  };

  return (
    <MediaContext.Provider value={value}>
      {children}
    </MediaContext.Provider>
  );
};