import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Save, Edit, FileText, Eye, Plus, Trash2 } from 'lucide-react';

interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: 'published' | 'draft';
  lastModified: string;
}

export default function AdminPages() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedPage, setSelectedPage] = useState<string | null>(null);

  // Mock data for demonstration
  const [pages] = useState<Page[]>([
    {
      id: '1',
      title: 'درباره ما',
      slug: 'about',
      content: 'شرکت اعلا نیرو با بیش از 33 سال تجربه در صنعت ژنراتور...',
      status: 'published',
      lastModified: '2024-01-20'
    },
    {
      id: '2',
      title: 'خدمات',
      slug: 'services',
      content: 'ارائه خدمات متنوع در زمینه ژنراتورهای صنعتی...',
      status: 'published',
      lastModified: '2024-01-18'
    },
    {
      id: '3',
      title: 'محصولات',
      slug: 'products',
      content: 'انواع ژنراتورهای دیزلی و گازی...',
      status: 'published',
      lastModified: '2024-01-19'
    },
    {
      id: '4',
      title: 'پروژه‌ها',
      slug: 'projects',
      content: 'نمونه پروژه‌های اجرا شده...',
      status: 'draft',
      lastModified: '2024-01-17'
    }
  ]);

  const [newPage, setNewPage] = useState({
    title: '',
    slug: '',
    content: ''
  });

  const handleSave = (pageId: string) => {
    console.log('Saving page:', pageId);
    setIsEditing(false);
    // Here you would save to backend
  };

  const handleCreatePage = () => {
    console.log('Creating new page:', newPage);
    // Here you would create new page in backend
    setNewPage({ title: '', slug: '', content: '' });
  };

  const handlePreview = (slug: string) => {
    window.open(`/${slug}`, '_blank');
  };

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">دسترسی محدود</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">مدیریت صفحات</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              ایجاد، ویرایش و مدیریت صفحات وبسایت
            </p>
          </div>
          <div className="flex gap-4">
            <Button 
              onClick={() => setIsEditing(!isEditing)}
              variant={isEditing ? "outline" : "default"}
            >
              {isEditing ? (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  ذخیره تغییرات
                </>
              ) : (
                <>
                  <Edit className="w-4 h-4 mr-2" />
                  ویرایش صفحات
                </>
              )}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="existing" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="existing" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              صفحات موجود
            </TabsTrigger>
            <TabsTrigger value="create" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              ایجاد صفحه جدید
            </TabsTrigger>
          </TabsList>

          <TabsContent value="existing" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pages.map((page) => (
                <Card key={page.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{page.title}</CardTitle>
                      <Badge variant={page.status === 'published' ? 'default' : 'secondary'}>
                        {page.status === 'published' ? 'منتشر شده' : 'پیش‌نویس'}
                      </Badge>
                    </div>
                    <CardDescription>
                      آدرس: /{page.slug}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                      {page.content.substring(0, 100)}...
                    </p>
                    <p className="text-xs text-gray-500 mb-4">
                      آخرین ویرایش: {page.lastModified}
                    </p>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handlePreview(page.slug)}
                        className="flex-1"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        نمایش
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        onClick={() => console.log('Delete page:', page.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="create" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>ایجاد صفحه جدید</CardTitle>
                <CardDescription>
                  یک صفحه جدید به وبسایت اضافه کنید
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">عنوان صفحه</label>
                    <Input
                      value={newPage.title}
                      onChange={(e) => setNewPage(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="عنوان صفحه را وارد کنید"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">آدرس صفحه (Slug)</label>
                    <Input
                      value={newPage.slug}
                      onChange={(e) => setNewPage(prev => ({ ...prev, slug: e.target.value }))}
                      placeholder="about-us"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">محتوای صفحه</label>
                  <Textarea
                    value={newPage.content}
                    onChange={(e) => setNewPage(prev => ({ ...prev, content: e.target.value }))}
                    rows={10}
                    placeholder="محتوای صفحه را وارد کنید..."
                  />
                </div>
                <Button onClick={handleCreatePage} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  ایجاد صفحه
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>آمار صفحات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{pages.filter(p => p.status === 'published').length}</p>
                <p className="text-sm text-gray-600">منتشر شده</p>
              </div>
              <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <p className="text-2xl font-bold text-yellow-600">{pages.filter(p => p.status === 'draft').length}</p>
                <p className="text-sm text-gray-600">پیش‌نویس</p>
              </div>
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{pages.length}</p>
                <p className="text-sm text-gray-600">کل صفحات</p>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">
                  {Math.round(pages.reduce((acc, p) => acc + p.content.length, 0) / pages.length)}
                </p>
                <p className="text-sm text-gray-600">متوسط کاراکتر</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {isEditing && (
          <div className="fixed bottom-6 right-6">
            <Button onClick={() => setIsEditing(false)} size="lg" className="shadow-lg">
              <Save className="w-4 h-4 mr-2" />
              ذخیره همه تغییرات
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
