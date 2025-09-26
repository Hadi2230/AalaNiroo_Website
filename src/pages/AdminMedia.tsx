import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Upload, Image, FileText, Download, Trash2, Eye } from 'lucide-react';

interface MediaFile {
  id: string;
  name: string;
  type: 'image' | 'document';
  url: string;
  size: string;
  uploadedAt: string;
}

export default function AdminMedia() {
  const { user } = useAuth();
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  // Mock data for demonstration
  const [mediaFiles] = useState<MediaFile[]>([
    {
      id: '1',
      name: 'hero-background.jpg',
      type: 'image',
      url: '/images/hero-bg.jpg',
      size: '2.5 MB',
      uploadedAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'company-logo.png',
      type: 'image',
      url: '/images/logo.png',
      size: '156 KB',
      uploadedAt: '2024-01-10'
    },
    {
      id: '3',
      name: 'product-catalog.pdf',
      type: 'document',
      url: '/documents/catalog.pdf',
      size: '5.2 MB',
      uploadedAt: '2024-01-12'
    }
  ]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setSelectedFiles(files);
      // Here you would upload files to server
      console.log('Uploading files:', Array.from(files));
    }
  };

  const handleDelete = (id: string) => {
    console.log('Deleting file:', id);
    // Here you would delete from server
  };

  const handlePreview = (url: string) => {
    window.open(url, '_blank');
  };

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">دسترسی محدود</div>;
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
