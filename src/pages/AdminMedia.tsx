import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import {
  Upload,
  Image,
  FileText,
  Download,
  Trash2,
  Eye,
  Search,
  Filter,
  Folder,
  FolderOpen,
  Grid,
  List,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Crop,
  Edit3,
  Copy,
  Share,
  Star,
  Archive,
  MoreVertical,
  Plus,
  X,
  Check,
  AlertCircle,
  Clock,
  HardDrive,
  Camera,
  Video,
  Music,
  File,
  Settings,
  BarChart3,
  Tag,
  Calendar,
  User
} from 'lucide-react';

interface MediaFile {
  id: string;
  name: string;
  type: 'image' | 'document' | 'video' | 'audio';
  url: string;
  size: string;
  uploadedAt: string;
  folder?: string;
  tags?: string[];
  description?: string;
  alt?: string;
  copyright?: string;
  dimensions?: { width: number; height: number };
  thumbnail?: string;
  isFavorite?: boolean;
  usageCount?: number;
  lastUsed?: string;
  versions?: MediaFile[];
}

interface Folder {
  id: string;
  name: string;
  parentId?: string;
  color: string;
  icon?: string;
}

export default function AdminMedia() {
  const { user } = useAuth();
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'image' | 'document' | 'video' | 'audio'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFolder, setSelectedFolder] = useState<string>('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Advanced mock data
  const [folders] = useState<Folder[]>([
    { id: 'all', name: 'همه فایل‌ها', color: '#3b82f6' },
    { id: 'images', name: 'تصاویر', color: '#10b981', icon: '🖼️' },
    { id: 'documents', name: 'اسناد', color: '#f59e0b', icon: '📄' },
    { id: 'hero', name: 'هیرو', color: '#8b5cf6', icon: '🎯' },
    { id: 'products', name: 'محصولات', color: '#ef4444', icon: '📦' },
    { id: 'logos', name: 'لوگوها', color: '#06b6d4', icon: '🏷️' }
  ]);

  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([
    {
      id: '1',
      name: 'hero-background.jpg',
      type: 'image',
      url: '/images/hero-bg.jpg',
      size: '2.5 MB',
      uploadedAt: '2024-01-15',
      folder: 'hero',
      tags: ['hero', 'background', 'main'],
      description: 'تصویر پس‌زمینه اصلی صفحه اول',
      alt: 'ژنراتورهای صنعتی اعلا نیرو',
      dimensions: { width: 1920, height: 1080 },
      thumbnail: '/images/hero-bg-thumb.jpg',
      isFavorite: true,
      usageCount: 45,
      lastUsed: '2024-01-20'
    },
    {
      id: '2',
      name: 'company-logo.png',
      type: 'image',
      url: '/images/logo.png',
      size: '156 KB',
      uploadedAt: '2024-01-10',
      folder: 'logos',
      tags: ['logo', 'brand', 'company'],
      description: 'لوگوی اصلی شرکت اعلا نیرو',
      alt: 'لوگوی اعلا نیرو',
      dimensions: { width: 500, height: 300 },
      thumbnail: '/images/logo-thumb.png',
      isFavorite: true,
      usageCount: 120,
      lastUsed: '2024-01-21'
    },
    {
      id: '3',
      name: 'product-catalog.pdf',
      type: 'document',
      url: '/documents/catalog.pdf',
      size: '5.2 MB',
      uploadedAt: '2024-01-12',
      folder: 'documents',
      tags: ['catalog', 'products', 'document'],
      description: 'کاتالوگ محصولات 2024',
      usageCount: 23,
      lastUsed: '2024-01-18'
    },
    {
      id: '4',
      name: 'generator-demo.mp4',
      type: 'video',
      url: '/videos/generator-demo.mp4',
      size: '45.8 MB',
      uploadedAt: '2024-01-14',
      folder: 'products',
      tags: ['video', 'demo', 'generator'],
      description: 'ویدیوی دمو ژنراتورهای دیزلی',
      dimensions: { width: 1920, height: 1080 },
      thumbnail: '/videos/generator-demo-thumb.jpg',
      usageCount: 8,
      lastUsed: '2024-01-19'
    },
    {
      id: '5',
      name: 'diesel-generator.jpg',
      type: 'image',
      url: '/images/diesel-generator.jpg',
      size: '3.2 MB',
      uploadedAt: '2024-01-13',
      folder: 'products',
      tags: ['product', 'diesel', 'generator'],
      description: 'تصویر ژنراتور دیزلی صنعتی',
      alt: 'ژنراتور دیزلی FG Wilson',
      dimensions: { width: 1200, height: 800 },
      thumbnail: '/images/diesel-generator-thumb.jpg',
      usageCount: 15,
      lastUsed: '2024-01-20'
    }
  ]);

  // Drag & Drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      handleFiles(Array.from(files));
    }
  };

  const handleFiles = async (files: File[]) => {
    setShowUploadModal(true);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileId = `temp-${Date.now()}-${i}`;

      setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));

      // Simulate upload progress
      for (let progress = 0; progress <= 100; progress += 10) {
        setUploadProgress(prev => ({ ...prev, [fileId]: progress }));
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Add file to media library
      const newFile: MediaFile = {
        id: fileId.replace('temp-', ''),
        name: file.name,
        type: getFileType(file.type),
        url: URL.createObjectURL(file),
        size: formatFileSize(file.size),
        uploadedAt: new Date().toISOString().split('T')[0],
        folder: selectedFolder !== 'all' ? selectedFolder : undefined,
        tags: [],
        description: '',
        dimensions: file.type.startsWith('image/') ? await getImageDimensions(file) : undefined,
        thumbnail: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
        usageCount: 0
      };

      setMediaFiles(prev => [...prev, newFile]);
    }

    setShowUploadModal(false);
    setUploadProgress({});
  };

  const getFileType = (mimeType: string): MediaFile['type'] => {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    return 'document';
  };

  const getImageDimensions = (file: File): Promise<{width: number, height: number}> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.naturalWidth, height: img.naturalHeight });
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDelete = (id: string) => {
    setMediaFiles(prev => prev.filter(file => file.id !== id));
  };

  const handlePreview = (file: MediaFile) => {
    setSelectedFile(file);
    setPreviewMode(true);
  };

  const handleEdit = (file: MediaFile) => {
    setSelectedFile(file);
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (selectedFile) {
      setMediaFiles(prev => prev.map(file =>
        file.id === selectedFile.id ? selectedFile : file
      ));
    }
    setShowEditModal(false);
    setSelectedFile(null);
  };

  const handleToggleFavorite = (id: string) => {
    setMediaFiles(prev => prev.map(file =>
      file.id === id ? { ...file, isFavorite: !file.isFavorite } : file
    ));
  };

  const handleDuplicate = (file: MediaFile) => {
    const duplicatedFile: MediaFile = {
      ...file,
      id: `dup-${Date.now()}`,
      name: `کپی-${file.name}`,
      usageCount: 0,
      lastUsed: undefined
    };
    setMediaFiles(prev => [...prev, duplicatedFile]);
  };

  // Filter and search files
  const filteredFiles = mediaFiles.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = selectedType === 'all' || file.type === selectedType;
    const matchesFolder = selectedFolder === 'all' || file.folder === selectedFolder;

    return matchesSearch && matchesType && matchesFolder;
  });

  // Statistics
  const stats = {
    total: mediaFiles.length,
    images: mediaFiles.filter(f => f.type === 'image').length,
    documents: mediaFiles.filter(f => f.type === 'document').length,
    videos: mediaFiles.filter(f => f.type === 'video').length,
    audio: mediaFiles.filter(f => f.type === 'audio').length,
    totalSize: mediaFiles.reduce((acc, file) => {
      const sizeInMB = parseFloat(file.size.replace(' MB', '')) || 0;
      return acc + sizeInMB;
    }, 0),
    favorites: mediaFiles.filter(f => f.isFavorite).length
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-950 dark:to-indigo-950">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">دسترسی محدود</h2>
          <p className="text-gray-600 dark:text-gray-400">لطفاً وارد حساب کاربری خود شوید</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">مدیریت رسانه</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              آپلود، مدیریت و سازماندهی تصاویر و فایل‌ها
            </p>
          </div>
          <div className="flex gap-4">
            <div>
              <input
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx,.txt"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <Button asChild>
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="w-4 h-4 mr-2" />
                  آپلود فایل
                </label>
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="images" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="images" className="flex items-center gap-2">
              <Image className="w-4 h-4" />
              تصاویر
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              اسناد
            </TabsTrigger>
            <TabsTrigger value="all" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              همه فایل‌ها
            </TabsTrigger>
          </TabsList>

          <TabsContent value="images" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mediaFiles.filter(file => file.type === 'image').map((file) => (
                <Card key={file.id} className="overflow-hidden">
                  <div className="aspect-video bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <Image className="w-12 h-12 text-gray-400" />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">{file.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      اندازه: {file.size}
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handlePreview(file.url)}>
                        <Eye className="w-3 h-3 mr-1" />
                        نمایش
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(file.id)}>
                        <Trash2 className="w-3 h-3 mr-1" />
                        حذف
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mediaFiles.filter(file => file.type === 'document').map((file) => (
                <Card key={file.id} className="overflow-hidden">
                  <div className="aspect-video bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <FileText className="w-12 h-12 text-gray-400" />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">{file.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      اندازه: {file.size}
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handlePreview(file.url)}>
                        <Eye className="w-3 h-3 mr-1" />
                        نمایش
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => window.open(file.url, '_blank')}>
                        <Download className="w-3 h-3 mr-1" />
                        دانلود
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(file.id)}>
                        <Trash2 className="w-3 h-3 mr-1" />
                        حذف
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="all" className="space-y-6">
            <div className="overflow-x-auto">
              <table className="w-full bg-white dark:bg-gray-800 rounded-lg">
                <thead>
                  <tr className="border-b">
                    <th className="text-right p-4">نام فایل</th>
                    <th className="text-right p-4">نوع</th>
                    <th className="text-right p-4">اندازه</th>
                    <th className="text-right p-4">تاریخ آپلود</th>
                    <th className="text-right p-4">عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {mediaFiles.map((file) => (
                    <tr key={file.id} className="border-b">
                      <td className="p-4 font-medium">{file.name}</td>
                      <td className="p-4">
                        <Badge variant={file.type === 'image' ? 'default' : 'secondary'}>
                          {file.type === 'image' ? 'تصویر' : 'سند'}
                        </Badge>
                      </td>
                      <td className="p-4">{file.size}</td>
                      <td className="p-4">{file.uploadedAt}</td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handlePreview(file.url)}>
                            <Eye className="w-3 h-3" />
                          </Button>
                          {file.type === 'document' && (
                            <Button size="sm" variant="outline" onClick={() => window.open(file.url, '_blank')}>
                              <Download className="w-3 h-3" />
                            </Button>
                          )}
                          <Button size="sm" variant="destructive" onClick={() => handleDelete(file.id)}>
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>آمار رسانه</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{mediaFiles.filter(f => f.type === 'image').length}</p>
                <p className="text-sm text-gray-600">تصویر</p>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{mediaFiles.filter(f => f.type === 'document').length}</p>
                <p className="text-sm text-gray-600">سند</p>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">{mediaFiles.length}</p>
                <p className="text-sm text-gray-600">کل فایل‌ها</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
