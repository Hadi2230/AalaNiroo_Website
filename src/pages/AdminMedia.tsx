import React, { useState, useRef, useCallback } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { useMedia, MediaFile } from '@/contexts/MediaContext';
import { toast } from 'sonner';
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
  Grid,
  List,
  Star,
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
  User,
  Edit3,
  Copy,
  ExternalLink,
  Maximize2,
  ImageIcon,
  FolderPlus
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function AdminMedia() {
  const { user } = useAuth();
  const {
    mediaFiles,
    folders,
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
    isLoading,
    error
  } = useMedia();

  const [dragActive, setDragActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'image' | 'document' | 'video' | 'audio'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFolder, setSelectedFolder] = useState<string>('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [uploadMetadata, setUploadMetadata] = useState({
    description: '',
    alt: '',
    tags: '',
    copyright: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  // Filter files based on current filters
  const filteredFiles = (() => {
    let files = mediaFiles;

    // Search filter
    if (searchTerm) {
      files = searchFiles(searchTerm);
    }

    // Folder filter
    if (selectedFolder !== 'all') {
      files = getFilesByFolder(selectedFolder);
    }

    // Type filter
    if (selectedType !== 'all') {
      files = files.filter(file => file.type === selectedType);
    }

    return files;
  })();

  // Drag and drop handlers
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files);
      await handleFilesUpload(files);
    }
  }, [selectedFolder]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFilesUpload(files);
    }
  };

  const handleFilesUpload = async (files: File[]) => {
    for (const file of files) {
      try {
        await uploadFile(file, selectedFolder === 'all' ? 'gallery' : selectedFolder, {
          description: uploadMetadata.description,
          alt: uploadMetadata.alt,
          tags: uploadMetadata.tags.split(',').map(tag => tag.trim()).filter(Boolean),
          copyright: uploadMetadata.copyright
        });
      } catch (error) {
        console.error('Upload failed for file:', file.name, error);
      }
    }
    
    // Reset upload metadata
    setUploadMetadata({
      description: '',
      alt: '',
      tags: '',
      copyright: ''
    });
  };

  const handleCreateFolder = async () => {
    if (newFolderName.trim()) {
      await createFolder(newFolderName.trim());
      setNewFolderName('');
      setShowCreateFolder(false);
    }
  };

  const getFileIcon = (file: MediaFile) => {
    switch (file.type) {
      case 'image':
        return <Image className="w-5 h-5 text-green-600" />;
      case 'video':
        return <Video className="w-5 h-5 text-purple-600" />;
      case 'audio':
        return <Music className="w-5 h-5 text-blue-600" />;
      default:
        return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fa-IR');
  };

  // Statistics
  const stats = {
    total: mediaFiles.length,
    images: getFilesByType('image').length,
    documents: getFilesByType('document').length,
    videos: getFilesByType('video').length,
    totalSize: mediaFiles.reduce((acc, file) => acc + file.size, 0),
    galleryImages: getGalleryImages().length
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                مدیریت رسانه پیشرفته
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2 text-lg">
                آپلود، مدیریت و سازماندهی تصاویر و فایل‌های شرکت
              </p>
              <div className="flex items-center gap-4 mt-3">
                <Badge variant="outline" className="flex items-center gap-2">
                  <HardDrive className="w-4 h-4" />
                  {stats.total} فایل
                </Badge>
                <Badge variant="outline" className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  {stats.galleryImages} عکس گالری
                </Badge>
                <Badge variant="outline" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  کاربر: {user?.name}
                </Badge>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                onClick={() => fileInputRef.current?.click()}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Upload className="w-5 h-5 mr-2" />
                آپلود فایل
              </Button>

              <Button
                onClick={() => setShowCreateFolder(true)}
                variant="outline"
                size="lg"
              >
                <FolderPlus className="w-5 h-5 mr-2" />
                پوشه جدید
              </Button>

              <Button
                onClick={() => window.open('/about', '_blank')}
                variant="outline"
                size="lg"
                className="text-green-600 hover:text-green-700"
              >
                <ExternalLink className="w-5 h-5 mr-2" />
                مشاهده گالری
              </Button>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
            <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">کل فایل‌ها</div>
              </CardContent>
            </Card>
            <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{stats.images}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">تصاویر</div>
              </CardContent>
            </Card>
            <Card className="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.galleryImages}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">گالری</div>
              </CardContent>
            </Card>
            <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600">{stats.documents}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">اسناد</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800">
              <CardContent className="p-4 text-center">
                <div className="text-xl font-bold text-gray-600">{formatFileSize(stats.totalSize)}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">حجم کل</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Filters and Search */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="جستجو در فایل‌ها..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>

              <Select value={selectedFolder} onValueChange={setSelectedFolder}>
                <SelectTrigger className="w-48">
                  <Folder className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="انتخاب پوشه" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه پوشه‌ها</SelectItem>
                  {folders.map((folder) => (
                    <SelectItem key={folder.id} value={folder.id}>
                      {folder.name} ({folder.fileCount})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedType} onValueChange={(value: any) => setSelectedType(value)}>
                <SelectTrigger className="w-40">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه انواع</SelectItem>
                  <SelectItem value="image">تصاویر</SelectItem>
                  <SelectItem value="document">اسناد</SelectItem>
                  <SelectItem value="video">ویدیو</SelectItem>
                  <SelectItem value="audio">صوت</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <Button
                  size="sm"
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Drag and Drop Upload Area */}
        <Card 
          ref={dropRef}
          className={`relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-dashed transition-all duration-300 ${
            dragActive 
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20' 
              : 'border-gray-300 dark:border-gray-600'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <CardContent className="p-8 text-center">
            <div className="space-y-4">
              <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center transition-colors ${
                dragActive ? 'bg-blue-100 dark:bg-blue-900' : 'bg-gray-100 dark:bg-gray-700'
              }`}>
                <Upload className={`w-10 h-10 ${dragActive ? 'text-blue-600' : 'text-gray-400'}`} />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  {dragActive ? 'فایل‌ها را اینجا رها کنید' : 'آپلود فایل‌های جدید'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  فایل‌ها را بکشید و رها کنید یا کلیک کنید تا انتخاب کنید
                </p>
                <div className="flex justify-center gap-4">
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    انتخاب فایل
                  </Button>
                  <Button
                    onClick={() => setShowUploadModal(true)}
                    variant="outline"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    آپلود پیشرفته
                  </Button>
                </div>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                فرمت‌های پشتیبانی شده: JPG, PNG, GIF, PDF, DOC, MP4, MP3
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Files Grid/List */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-3">
                <HardDrive className="w-6 h-6 text-blue-600" />
                فایل‌های رسانه ({filteredFiles.length})
              </CardTitle>
              <div className="flex items-center gap-2">
                {selectedFolder !== 'all' && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Folder className="w-3 h-3" />
                    {folders.find(f => f.id === selectedFolder)?.name}
                  </Badge>
                )}
                {isLoading && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="w-3 h-3 animate-spin" />
                    در حال پردازش...
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <span className="text-red-800 dark:text-red-300">{error}</span>
                </div>
              </div>
            )}

            {viewMode === 'grid' ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                {filteredFiles.map((file) => (
                  <Card key={file.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                    <div className="relative aspect-square bg-gray-100 dark:bg-gray-700">
                      {file.type === 'image' ? (
                        <img
                          src={file.url}
                          alt={file.alt}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          {getFileIcon(file)}
                        </div>
                      )}
                      
                      {/* Overlay Actions */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => {
                              setSelectedFile(file);
                              setShowEditModal(true);
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => toggleFavorite(file.id)}
                          >
                            <Star className={`w-4 h-4 ${file.isFavorite ? 'text-yellow-500 fill-yellow-500' : ''}`} />
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => deleteFile(file.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* File Type Badge */}
                      <div className="absolute top-2 right-2">
                        <Badge variant="secondary" className="text-xs">
                          {file.type === 'image' ? 'عکس' : 
                           file.type === 'video' ? 'ویدیو' :
                           file.type === 'audio' ? 'صوت' : 'سند'}
                        </Badge>
                      </div>

                      {/* Favorite Star */}
                      {file.isFavorite && (
                        <div className="absolute top-2 left-2">
                          <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                        </div>
                      )}
                    </div>

                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <h3 className="font-medium text-sm truncate" title={file.name}>
                          {file.name}
                        </h3>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{formatFileSize(file.size)}</span>
                          <span>{formatDate(file.uploadedAt)}</span>
                        </div>
                        {file.folder && (
                          <Badge variant="outline" className="text-xs">
                            {folders.find(f => f.id === file.folder)?.name}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredFiles.map((file) => (
                  <div key={file.id} className="flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <div className="w-12 h-12 flex-shrink-0">
                      {file.type === 'image' ? (
                        <img
                          src={file.url}
                          alt={file.alt}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                          {getFileIcon(file)}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium truncate">{file.name}</h3>
                        {file.isFavorite && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {formatFileSize(file.size)} • {formatDate(file.uploadedAt)}
                      </div>
                      {file.description && (
                        <div className="text-sm text-gray-600 dark:text-gray-300 truncate">
                          {file.description}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedFile(file);
                          setShowEditModal(true);
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleFavorite(file.id)}
                      >
                        <Star className={`w-4 h-4 ${file.isFavorite ? 'text-yellow-500 fill-yellow-500' : ''}`} />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="outline">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuLabel>عملیات</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => navigator.clipboard.writeText(file.url)}>
                            <Copy className="w-4 h-4 mr-2" />
                            کپی لینک
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="w-4 h-4 mr-2" />
                            دانلود
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => deleteFile(file.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            حذف
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {filteredFiles.length === 0 && (
              <div className="text-center py-12">
                <Image className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                  فایلی یافت نشد
                </h3>
                <p className="text-gray-500 dark:text-gray-500">
                  {searchTerm ? 'نتیجه‌ای برای جستجوی شما یافت نشد' : 'هنوز فایلی آپلود نشده است'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upload Modal */}
        <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>آپلود پیشرفته</DialogTitle>
              <DialogDescription>
                اطلاعات اضافی برای فایل‌های آپلودی وارد کنید
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>پوشه مقصد</Label>
                <Select value={selectedFolder === 'all' ? 'gallery' : selectedFolder} onValueChange={setSelectedFolder}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {folders.filter(f => f.id !== 'all').map((folder) => (
                      <SelectItem key={folder.id} value={folder.id}>
                        {folder.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>توضیحات</Label>
                <Textarea
                  value={uploadMetadata.description}
                  onChange={(e) => setUploadMetadata(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="توضیحات فایل..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>متن جایگزین (Alt Text)</Label>
                  <Input
                    value={uploadMetadata.alt}
                    onChange={(e) => setUploadMetadata(prev => ({ ...prev, alt: e.target.value }))}
                    placeholder="توضیح تصویر برای accessibility"
                  />
                </div>
                <div className="space-y-2">
                  <Label>کپی‌رایت</Label>
                  <Input
                    value={uploadMetadata.copyright}
                    onChange={(e) => setUploadMetadata(prev => ({ ...prev, copyright: e.target.value }))}
                    placeholder="© 2024 اعلا نیرو"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>تگ‌ها (جدا شده با کاما)</Label>
                <Input
                  value={uploadMetadata.tags}
                  onChange={(e) => setUploadMetadata(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="ژنراتور, صنعتی, اعلا نیرو"
                />
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setShowUploadModal(false)}>
                  انصراف
                </Button>
                <Button onClick={() => fileInputRef.current?.click()}>
                  <Upload className="w-4 h-4 mr-2" />
                  انتخاب و آپلود فایل‌ها
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Create Folder Modal */}
        <Dialog open={showCreateFolder} onOpenChange={setShowCreateFolder}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>ایجاد پوشه جدید</DialogTitle>
              <DialogDescription>
                نام پوشه جدید را وارد کنید
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>نام پوشه</Label>
                <Input
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="نام پوشه..."
                />
              </div>
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setShowCreateFolder(false)}>
                  انصراف
                </Button>
                <Button onClick={handleCreateFolder} disabled={!newFolderName.trim()}>
                  <Plus className="w-4 h-4 mr-2" />
                  ایجاد پوشه
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* File Edit Modal */}
        <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
            {selectedFile && (
              <>
                <DialogHeader>
                  <DialogTitle>ویرایش فایل: {selectedFile.name}</DialogTitle>
                  <DialogDescription>
                    مشاهده و ویرایش اطلاعات فایل
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Preview */}
                  <div className="space-y-4">
                    <div className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                      {selectedFile.type === 'image' ? (
                        <img
                          src={selectedFile.url}
                          alt={selectedFile.alt}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          {getFileIcon(selectedFile)}
                          <div className="ml-3">
                            <div className="font-medium">{selectedFile.name}</div>
                            <div className="text-sm text-gray-500">{selectedFile.originalName}</div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">حجم:</span> {formatFileSize(selectedFile.size)}
                      </div>
                      <div>
                        <span className="font-medium">نوع:</span> {selectedFile.mimeType}
                      </div>
                      {selectedFile.dimensions && (
                        <>
                          <div>
                            <span className="font-medium">عرض:</span> {selectedFile.dimensions.width}px
                          </div>
                          <div>
                            <span className="font-medium">ارتفاع:</span> {selectedFile.dimensions.height}px
                          </div>
                        </>
                      )}
                      <div>
                        <span className="font-medium">آپلود:</span> {formatDate(selectedFile.uploadedAt)}
                      </div>
                      <div>
                        <span className="font-medium">توسط:</span> {selectedFile.uploadedBy}
                      </div>
                    </div>
                  </div>

                  {/* Edit Form */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>نام فایل</Label>
                      <Input
                        value={selectedFile.name}
                        onChange={(e) => setSelectedFile(prev => prev ? { ...prev, name: e.target.value } : null)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>توضیحات</Label>
                      <Textarea
                        value={selectedFile.description}
                        onChange={(e) => setSelectedFile(prev => prev ? { ...prev, description: e.target.value } : null)}
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>متن جایگزین (Alt Text)</Label>
                      <Input
                        value={selectedFile.alt}
                        onChange={(e) => setSelectedFile(prev => prev ? { ...prev, alt: e.target.value } : null)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>تگ‌ها</Label>
                      <Input
                        value={selectedFile.tags.join(', ')}
                        onChange={(e) => setSelectedFile(prev => prev ? { 
                          ...prev, 
                          tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                        } : null)}
                        placeholder="تگ1, تگ2, تگ3"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>پوشه</Label>
                      <Select 
                        value={selectedFile.folder} 
                        onValueChange={(value) => setSelectedFile(prev => prev ? { ...prev, folder: value } : null)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {folders.filter(f => f.id !== 'all').map((folder) => (
                            <SelectItem key={folder.id} value={folder.id}>
                              {folder.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center gap-4 pt-4">
                      <Button
                        onClick={async () => {
                          if (selectedFile) {
                            await updateFile(selectedFile.id, selectedFile);
                            setShowEditModal(false);
                          }
                        }}
                        className="flex-1"
                      >
                        <Check className="w-4 h-4 mr-2" />
                        ذخیره تغییرات
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          if (selectedFile?.url) {
                            navigator.clipboard.writeText(selectedFile.url);
                            toast.success('لینک کپی شد');
                          }
                        }}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => selectedFile && deleteFile(selectedFile.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}