import React, { useState, useEffect } from 'react';
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
import { useAuth } from '@/contexts/AuthContext';
import { useCompany } from '@/contexts/CompanyContext';
import {
  Save,
  Edit,
  FileText,
  Image,
  Settings,
  Globe,
  Search,
  Eye,
  History,
  Download,
  Upload,
  Trash2,
  Plus,
  Copy,
  Palette,
  Code,
  Bold,
  Italic,
  List,
  Link,
  ImageIcon,
  Video,
  Table,
  Quote,
  Undo,
  Redo,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Maximize2,
  Minimize2,
  CheckCircle,
  AlertCircle,
  Clock,
  Users,
  Tag,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { companyInfo } from '@/data/companyData';

export default function AdminContent() {
  const { user } = useAuth();
  const { companyData, updateCompanyData, saveCompanyData, resetToDefault, lastModified, modifiedBy } = useCompany();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('fa');
  const [searchTerm, setSearchTerm] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showSEO, setShowSEO] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [selectedSection, setSelectedSection] = useState('company');
  const [editorMode, setEditorMode] = useState<'wysiwyg' | 'html' | 'text'>('wysiwyg');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Advanced content management
  const [seoData, setSeoData] = useState({
    metaTitle: '',
    metaDescription: '',
    keywords: '',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    schemaMarkup: '',
    canonicalUrl: '',
    robots: 'index,follow'
  });

  const [menuStructure, setMenuStructure] = useState({
    header: [
      { id: 'home', title: 'خانه', url: '/', children: [] },
      { id: 'about', title: 'درباره ما', url: '/about', children: [] },
      { id: 'services', title: 'خدمات', url: '/services', children: [] },
      { id: 'products', title: 'محصولات', url: '/products', children: [] },
      { id: 'projects', title: 'پروژه‌ها', url: '/projects', children: [] },
      { id: 'contact', title: 'تماس', url: '/contact', children: [] }
    ],
    footer: [
      { id: 'company', title: 'شرکت', url: '/about', children: [] },
      { id: 'services2', title: 'خدمات', url: '/services', children: [] },
      { id: 'support', title: 'پشتیبانی', url: '/support', children: [] },
      { id: 'privacy', title: 'حریم خصوصی', url: '/privacy', children: [] }
    ]
  });

  // Auto-save functionality
  useEffect(() => {
    if (autoSave && isEditing) {
      const timer = setTimeout(() => {
        handleSave();
      }, 30000); // Auto-save every 30 seconds
      return () => clearTimeout(timer);
    }
  }, [companyData, autoSave, isEditing]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const success = await saveCompanyData();
      if (success) {
        console.log('Content saved successfully');
        // Show success notification
      }
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleContentChange = (lang: 'fa' | 'en', field: string, value: string) => {
    updateCompanyData(lang, field, value);
  };

  const handleSEOSave = () => {
    localStorage.setItem('seoData', JSON.stringify(seoData));
    console.log('SEO data saved');
  };

  const handleMenuUpdate = (menuType: 'header' | 'footer', items: any[]) => {
    setMenuStructure(prev => ({
      ...prev,
      [menuType]: items
    }));
    localStorage.setItem('menuStructure', JSON.stringify(menuStructure));
  };

  const exportContent = () => {
    const data = {
      content: companyData,
      seoData,
      menuStructure,
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `content-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
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
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-950 dark:to-indigo-950 transition-all duration-300 ${isFullscreen ? 'p-0' : 'p-6'}`}>
      <div className={`mx-auto transition-all duration-300 ${isFullscreen ? 'max-w-none' : 'max-w-7xl'}`}>
        {/* Header */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                مدیریت محتوای پیشرفته
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2 text-lg">
                سیستم مدیریت محتوای حرفه‌ای با امکانات کامل
              </p>
              <div className="flex items-center gap-4 mt-3">
                <Badge variant="outline" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  ویرایشگر: {user.name}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  آخرین ذخیره: {lastModified ? new Date(lastModified).toLocaleTimeString('fa-IR') : 'هرگز'}
                </Badge>
                {autoSave && (
                  <Badge variant="default" className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    ذخیره خودکار فعال
                  </Badge>
                )}
                {isSaving && (
                  <Badge variant="outline" className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    در حال ذخیره...
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                onClick={() => setIsEditing(!isEditing)}
                variant={isEditing ? "outline" : "default"}
                size="lg"
                className="min-w-[140px]"
              >
                {isEditing ? (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    ذخیره تغییرات
                  </>
                ) : (
                  <>
                    <Edit className="w-5 h-5 mr-2" />
                    ویرایش محتوا
                  </>
                )}
              </Button>

              <Button
                onClick={() => setShowPreview(!showPreview)}
                variant="outline"
                size="lg"
              >
                <Eye className="w-5 h-5 mr-2" />
                پیش‌نمایش
              </Button>

              <Button
                onClick={() => setShowHistory(!showHistory)}
                variant="outline"
                size="lg"
              >
                <History className="w-5 h-5 mr-2" />
                تاریخچه
              </Button>

              <Button onClick={exportContent} variant="outline" size="lg">
                <Download className="w-5 h-5 mr-2" />
                پشتیبان‌گیری
              </Button>

              <Button onClick={resetToDefault} variant="outline" size="lg" className="text-red-600 hover:text-red-700">
                <RefreshCw className="w-5 h-5 mr-2" />
                بازنشانی
              </Button>

              <Button
                onClick={() => setIsFullscreen(!isFullscreen)}
                variant="outline"
                size="lg"
              >
                {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Advanced Controls */}
          <div className="flex flex-wrap items-center gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <Label htmlFor="auto-save" className="text-sm font-medium">ذخیره خودکار</Label>
              <Switch
                id="auto-save"
                checked={autoSave}
                onCheckedChange={setAutoSave}
              />
            </div>

            <Select value={editorMode} onValueChange={(value: any) => setEditorMode(value)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="wysiwyg">ویرایشگر دیداری</SelectItem>
                <SelectItem value="html">HTML</SelectItem>
                <SelectItem value="text">متن ساده</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="جستجو در محتوا..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="xl:col-span-1">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  بخش‌های محتوا
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { id: 'company', title: 'اطلاعات شرکت', icon: Settings },
                  { id: 'content', title: 'محتوای صفحات', icon: FileText },
                  { id: 'media', title: 'مدیریت رسانه', icon: Image },
                  { id: 'menus', title: 'ساختار منوها', icon: List },
                  { id: 'seo', title: 'SEO و متادیتا', icon: Tag },
                  { id: 'translations', title: 'مدیریت ترجمه', icon: Globe }
                ].map((section) => (
                  <Button
                    key={section.id}
                    variant={selectedSection === section.id ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setSelectedSection(section.id)}
                  >
                    <section.icon className="w-4 h-4 mr-2" />
                    {section.title}
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Editor */}
          <div className="xl:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="fa" className="flex items-center gap-2 text-lg">
                  <Globe className="w-5 h-5" />
                  فارسی
                </TabsTrigger>
                <TabsTrigger value="en" className="flex items-center gap-2 text-lg">
                  <Globe className="w-5 h-5" />
                  English
                </TabsTrigger>
              </TabsList>

              {(['fa', 'en'] as const).map((lang) => (
                <TabsContent key={lang} value={lang} className="space-y-6">
                  {/* Company Information */}
                  {selectedSection === 'company' && (
                    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                          <Settings className="w-6 h-6 text-blue-600" />
                          اطلاعات شرکت
                        </CardTitle>
                        <CardDescription>
                          ویرایش اطلاعات پایه و هویت شرکت
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">نام شرکت</Label>
                            {isEditing ? (
                              <Input
                                value={companyData[lang].name}
                                onChange={(e) => handleContentChange(lang, 'name', e.target.value)}
                                className="text-lg font-semibold"
                              />
                            ) : (
                              <p className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-lg font-semibold">
                                {companyData[lang].name}
                              </p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">شعار شرکت</Label>
                            {isEditing ? (
                              <Input
                                value={companyData[lang].tagline}
                                onChange={(e) => handleContentChange(lang, 'tagline', e.target.value)}
                              />
                            ) : (
                              <p className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                {companyData[lang].tagline}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm font-medium">توضیحات شرکت</Label>
                          {isEditing ? (
                            <Textarea
                              value={companyData[lang].description}
                              onChange={(e) => handleContentChange(lang, 'description', e.target.value)}
                              rows={4}
                              className="resize-none"
                            />
                          ) : (
                            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg min-h-[100px]">
                              {companyData[lang].description}
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">تلفن</Label>
                            {isEditing ? (
                              <Input
                                value={companyData[lang].phone}
                                onChange={(e) => handleContentChange(lang, 'phone', e.target.value)}
                              />
                            ) : (
                              <p className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                {companyData[lang].phone}
                              </p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">ایمیل</Label>
                            {isEditing ? (
                              <Input
                                value={companyData[lang].email}
                                onChange={(e) => handleContentChange(lang, 'email', e.target.value)}
                              />
                            ) : (
                              <p className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                {companyData[lang].email}
                              </p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">آدرس</Label>
                            {isEditing ? (
                              <Input
                                value={companyData[lang].address}
                                onChange={(e) => handleContentChange(lang, 'address', e.target.value)}
                              />
                            ) : (
                              <p className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                {companyData[lang].address}
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Page Content Editor */}
                  {selectedSection === 'content' && (
                    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                          <FileText className="w-6 h-6 text-green-600" />
                          ویرایشگر محتوای صفحات
                        </CardTitle>
                        <CardDescription>
                          ویرایش محتوای صفحات وبسایت با ویرایشگر پیشرفته
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center bg-gray-50 dark:bg-gray-700/50">
                          <Code className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                          <h3 className="text-xl font-semibold mb-2">ویرایشگر WYSIWYG پیشرفته</h3>
                          <p className="text-gray-600 dark:text-gray-400 mb-6">
                            ویرایشگر حرفه‌ای با امکانات کامل در حال بارگذاری...
                          </p>
                          <div className="flex justify-center gap-4">
                            <Button variant="outline">
                              <Bold className="w-4 h-4 mr-2" />
                              Bold
                            </Button>
                            <Button variant="outline">
                              <Italic className="w-4 h-4 mr-2" />
                              Italic
                            </Button>
                            <Button variant="outline">
                              <Link className="w-4 h-4 mr-2" />
                              Link
                            </Button>
                            <Button variant="outline">
                              <ImageIcon className="w-4 h-4 mr-2" />
                              Image
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* SEO Management */}
                  {selectedSection === 'seo' && (
                    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                          <Tag className="w-6 h-6 text-purple-600" />
                          مدیریت SEO
                        </CardTitle>
                        <CardDescription>
                          بهینه‌سازی موتورهای جستجو و متادیتا
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">Meta Title</Label>
                            <Input
                              value={seoData.metaTitle}
                              onChange={(e) => setSeoData(prev => ({ ...prev, metaTitle: e.target.value }))}
                              placeholder="عنوان صفحه برای موتورهای جستجو"
                            />
                            <p className="text-xs text-gray-500">{seoData.metaTitle.length}/60</p>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">Meta Description</Label>
                            <Textarea
                              value={seoData.metaDescription}
                              onChange={(e) => setSeoData(prev => ({ ...prev, metaDescription: e.target.value }))}
                              rows={3}
                              placeholder="توضیحات صفحه برای موتورهای جستجو"
                            />
                            <p className="text-xs text-gray-500">{seoData.metaDescription.length}/160</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Keywords</Label>
                          <Input
                            value={seoData.keywords}
                            onChange={(e) => setSeoData(prev => ({ ...prev, keywords: e.target.value }))}
                            placeholder="کلمات کلیدی جدا شده با کاما"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">Open Graph Title</Label>
                            <Input
                              value={seoData.ogTitle}
                              onChange={(e) => setSeoData(prev => ({ ...prev, ogTitle: e.target.value }))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">Open Graph Description</Label>
                            <Input
                              value={seoData.ogDescription}
                              onChange={(e) => setSeoData(prev => ({ ...prev, ogDescription: e.target.value }))}
                            />
                          </div>
                        </div>

                        <Button onClick={handleSEOSave} className="w-full">
                          <Save className="w-4 h-4 mr-2" />
                          ذخیره تنظیمات SEO
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>

        {/* Preview Modal */}
        <Dialog open={showPreview} onOpenChange={setShowPreview}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
            <DialogHeader>
              <DialogTitle>پیش‌نمایش محتوا</DialogTitle>
              <DialogDescription>
                نمایش محتوای ذخیره شده در وبسایت
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              <h2 className="text-2xl font-bold mb-4">{companyData[activeTab].name}</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">{companyData[activeTab].description}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <strong>تلفن:</strong> {companyData[activeTab].phone}
                </div>
                <div>
                  <strong>ایمیل:</strong> {companyData[activeTab].email}
                </div>
                <div>
                  <strong>آدرس:</strong> {companyData[activeTab].address}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* History Modal */}
        <Dialog open={showHistory} onOpenChange={setShowHistory}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-auto">
            <DialogHeader>
              <DialogTitle>تاریخچه تغییرات</DialogTitle>
              <DialogDescription>
                نسخه‌های قبلی محتوای ذخیره شده
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              {contentHistory.slice().reverse().map((item, index) => (
                <Card key={index} className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">نسخه {contentHistory.length - index}</p>
                      <p className="text-sm text-gray-600">توسط: {item.user}</p>
                      <p className="text-sm text-gray-600">
                        تاریخ: {new Date(item.timestamp).toLocaleString('fa-IR')}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      بازیابی
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        {/* Save Button */}
        {isEditing && (
          <div className="fixed bottom-6 left-6">
            <Button
              onClick={handleSave}
              size="lg"
              className="shadow-2xl bg-green-600 hover:bg-green-700"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  در حال ذخیره...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  ذخیره همه تغییرات
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
