import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Save, Edit, FileText, Image, Settings, Globe } from 'lucide-react';
import { companyInfo } from '@/data/companyData';

export default function AdminContent() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(companyInfo);

  const handleSave = () => {
    // Here you would save to a backend or local storage
    console.log('Saving content:', content);
    setIsEditing(false);
    // In a real app, you would save to backend:
    // await saveContentToBackend(content);
  };

  const handleContentChange = (lang: 'fa' | 'en', field: string, value: string) => {
    setContent(prev => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        [field]: value
      }
    }));
  };

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">دسترسی محدود</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">مدیریت محتوا</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              ویرایش متن‌ها، تصاویر و محتوای وبسایت
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
                  ویرایش محتوا
                </>
              )}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="fa" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="fa" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              فارسی
            </TabsTrigger>
            <TabsTrigger value="en" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              English
            </TabsTrigger>
          </TabsList>

          {(['fa', 'en'] as const).map((lang) => (
            <TabsContent key={lang} value={lang} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    اطلاعات شرکت
                  </CardTitle>
                  <CardDescription>
                    ویرایش اطلاعات پایه شرکت
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">نام شرکت</label>
                      {isEditing ? (
                        <Input
                          value={content[lang].name}
                          onChange={(e) => handleContentChange(lang, 'name', e.target.value)}
                        />
                      ) : (
                        <p className="p-2 bg-gray-100 dark:bg-gray-800 rounded">{content[lang].name}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">شعار شرکت</label>
                      {isEditing ? (
                        <Input
                          value={content[lang].tagline}
                          onChange={(e) => handleContentChange(lang, 'tagline', e.target.value)}
                        />
                      ) : (
                        <p className="p-2 bg-gray-100 dark:bg-gray-800 rounded">{content[lang].tagline}</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">توضیحات شرکت</label>
                    {isEditing ? (
                      <Textarea
                        value={content[lang].description}
                        onChange={(e) => handleContentChange(lang, 'description', e.target.value)}
                        rows={3}
                      />
                    ) : (
                      <p className="p-3 bg-gray-100 dark:bg-gray-800 rounded">{content[lang].description}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">تلفن</label>
                      {isEditing ? (
                        <Input
                          value={content[lang].phone}
                          onChange={(e) => handleContentChange(lang, 'phone', e.target.value)}
                        />
                      ) : (
                        <p className="p-2 bg-gray-100 dark:bg-gray-800 rounded">{content[lang].phone}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">ایمیل</label>
                      {isEditing ? (
                        <Input
                          value={content[lang].email}
                          onChange={(e) => handleContentChange(lang, 'email', e.target.value)}
                        />
                      ) : (
                        <p className="p-2 bg-gray-100 dark:bg-gray-800 rounded">{content[lang].email}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">آدرس</label>
                      {isEditing ? (
                        <Input
                          value={content[lang].address}
                          onChange={(e) => handleContentChange(lang, 'address', e.target.value)}
                        />
                      ) : (
                        <p className="p-2 bg-gray-100 dark:bg-gray-800 rounded">{content[lang].address}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    محتوای صفحات
                  </CardTitle>
                  <CardDescription>
                    ویرایش محتوای صفحات وبسایت
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Badge variant="secondary" className="p-3 justify-center">
                      درباره ما - قابل ویرایش
                    </Badge>
                    <Badge variant="secondary" className="p-3 justify-center">
                      خدمات - قابل ویرایش
                    </Badge>
                    <Badge variant="secondary" className="p-3 justify-center">
                      محصولات - قابل ویرایش
                    </Badge>
                    <Badge variant="secondary" className="p-3 justify-center">
                      پروژه‌ها - قابل ویرایش
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Image className="w-5 h-5" />
                    مدیریت تصاویر
                  </CardTitle>
                  <CardDescription>
                    آپلود و مدیریت تصاویر وبسایت
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                    <Image className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      تصاویر وبسایت را اینجا آپلود کنید
                    </p>
                    <Button variant="outline" disabled={!isEditing}>
                      انتخاب فایل
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        {isEditing && (
          <div className="fixed bottom-6 right-6">
            <Button onClick={handleSave} size="lg" className="shadow-lg">
              <Save className="w-4 h-4 mr-2" />
              ذخیره همه تغییرات
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
