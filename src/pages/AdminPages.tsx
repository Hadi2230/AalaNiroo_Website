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
import {
  Save,
  Edit,
  FileText,
  Eye,
  Plus,
  Trash2,
  Search,
  History,
  Copy,
  Template,
  Workflow,
  BarChart3,
  Users,
  Tag,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  Settings,
  Code,
  Bold,
  Italic,
  Link,
  Image,
  List,
  Quote,
  Table,
  Maximize2,
  Minimize2,
  Preview,
  Download,
  Upload,
  GitBranch,
  GitCommit,
  GitPullRequest,
  MessageSquare,
  Star,
  EyeOff,
  Filter,
  SortAsc,
  SortDesc,
  Grid,
  List as ListIcon,
  ChevronRight,
  ChevronLeft,
  MoreVertical
} from 'lucide-react';

interface PageVersion {
  id: string;
  content: string;
  timestamp: string;
  user: string;
  comment: string;
}

interface PageComment {
  id: string;
  user: string;
  comment: string;
  timestamp: string;
  type: 'comment' | 'suggestion' | 'issue';
}

interface PageTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  content: string;
  category: string;
}

interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: 'published' | 'draft' | 'review' | 'archived';
  lastModified: string;
  createdAt: string;
  author: string;
  template?: string;
  seoTitle?: string;
  seoDescription?: string;
  featuredImage?: string;
  tags: string[];
  category: string;
  views: number;
  versions: PageVersion[];
  comments: PageComment[];
  collaborators: string[];
  workflow: {
    currentStep: string;
    steps: string[];
    approvers: string[];
  };
  settings: {
    allowComments: boolean;
    showInMenu: boolean;
    requireLogin: boolean;
    cacheEnabled: boolean;
  };
}

export default function AdminPages() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showWorkflow, setShowWorkflow] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft' | 'review'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'title' | 'modified' | 'created' | 'views'>('modified');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');

  // Advanced mock data
  const [templates] = useState<PageTemplate[]>([
    {
      id: '1',
      name: 'صفحه درباره ما',
      description: 'صفحه استاندارد برای معرفی شرکت',
      thumbnail: '/templates/about-thumb.jpg',
      content: '<h1>درباره ما</h1><p>شرکت ما...</p>',
      category: 'شرکت'
    },
    {
      id: '2',
      name: 'صفحه خدمات',
      description: 'نمایش خدمات و سرویس‌ها',
      thumbnail: '/templates/services-thumb.jpg',
      content: '<h1>خدمات ما</h1><p>ارائه خدمات...</p>',
      category: 'خدمات'
    },
    {
      id: '3',
      name: 'صفحه محصولات',
      description: 'نمایش کاتالوگ محصولات',
      thumbnail: '/templates/products-thumb.jpg',
      content: '<h1>محصولات</h1><p>محصولات ما...</p>',
      category: 'محصولات'
    },
    {
      id: '4',
      name: 'صفحه تماس',
      description: 'فرم تماس و اطلاعات ارتباطی',
      thumbnail: '/templates/contact-thumb.jpg',
      content: '<h1>تماس با ما</h1><p>راه‌های ارتباطی...</p>',
      category: 'ارتباطی'
    },
    {
      id: '5',
      name: 'صفحه پروژه‌ها',
      description: 'نمونه کارها و پروژه‌ها',
      thumbnail: '/templates/portfolio-thumb.jpg',
      content: '<h1>پروژه‌های ما</h1><p>نمونه کارها...</p>',
      category: 'نمونه کار'
    }
  ]);

  const [pages, setPages] = useState<Page[]>([
    {
      id: '1',
      title: 'درباره ما',
      slug: 'about',
      content: `<h1>درباره شرکت اعلا نیرو</h1>
      <p>شرکت اعلا نیرو با بیش از 33 سال تجربه در صنعت ژنراتورهای برق، یکی از پیشروترین شرکت‌های ارائه‌دهنده راه‌حل‌های انرژی پایدار در ایران است.</p>
      <h2>تاریخچه</h2>
      <p>از سال 1369 فعالیت خود را در زمینه فروش و خدمات پس از فروش ژنراتورهای صنعتی آغاز کردیم...</p>
      <h2>ماموریت ما</h2>
      <p>ارائه بهترین کیفیت خدمات و محصولات در زمینه انرژی پایدار...</p>`,
      status: 'published',
      lastModified: '2024-01-20',
      createdAt: '2024-01-01',
      author: 'مدیر سیستم',
      template: '1',
      seoTitle: 'درباره شرکت اعلا نیرو - بیش از 30 سال تجربه',
      seoDescription: 'شرکت اعلا نیرو ارائه‌دهنده ژنراتورهای صنعتی FG Wilson و Cummins',
      featuredImage: '/images/about-hero.jpg',
      tags: ['درباره ما', 'تاریخچه', 'شرکت'],
      category: 'شرکت',
      views: 1250,
      versions: [
        {
          id: 'v1',
          content: 'نسخه اولیه',
          timestamp: '2024-01-20T10:00:00Z',
          user: 'مدیر سیستم',
          comment: 'ایجاد صفحه اولیه'
        }
      ],
      comments: [
        {
          id: 'c1',
          user: 'طراح وب',
          comment: 'عکس‌های بیشتری اضافه شود',
          timestamp: '2024-01-21T14:30:00Z',
          type: 'suggestion'
        }
      ],
      collaborators: ['مدیر محتوا', 'طراح وب'],
      workflow: {
        currentStep: 'published',
        steps: ['draft', 'review', 'published'],
        approvers: ['مدیر ارشد']
      },
      settings: {
        allowComments: true,
        showInMenu: true,
        requireLogin: false,
        cacheEnabled: true
      }
    },
    {
      id: '2',
      title: 'خدمات',
      slug: 'services',
      content: `<h1>خدمات ما</h1>
      <p>ارائه خدمات متنوع در زمینه ژنراتورهای صنعتی...</p>
      <h2>خدمات نصب و راه‌اندازی</h2>
      <p>نصب حرفه‌ای ژنراتورها با استانداردهای بین‌المللی...</p>
      <h2>خدمات تعمیر و نگهداری</h2>
      <p>برنامه‌های منظم تعمیر و نگهداری...</p>`,
      status: 'published',
      lastModified: '2024-01-18',
      createdAt: '2024-01-02',
      author: 'مدیر محتوا',
      template: '2',
      seoTitle: 'خدمات ژنراتور - نصب، تعمیر و نگهداری',
      seoDescription: 'خدمات تخصصی ژنراتورهای صنعتی',
      featuredImage: '/images/services-hero.jpg',
      tags: ['خدمات', 'نصب', 'تعمیر'],
      category: 'خدمات',
      views: 890,
      versions: [],
      comments: [],
      collaborators: ['مدیر فنی'],
      workflow: {
        currentStep: 'published',
        steps: ['draft', 'review', 'published'],
        approvers: ['مدیر فنی']
      },
      settings: {
        allowComments: true,
        showInMenu: true,
        requireLogin: false,
        cacheEnabled: true
      }
    },
    {
      id: '3',
      title: 'محصولات',
      slug: 'products',
      content: `<h1>محصولات ما</h1>
      <p>انواع ژنراتورهای دیزلی و گازی...</p>
      <h2>ژنراتورهای دیزلی FG Wilson</h2>
      <p>محصولات با کیفیت بالا از شرکت FG Wilson...</p>
      <h2>ژنراتورهای گازی Cummins</h2>
      <p>راه‌حل‌های گازسوز از کامینز...</p>`,
      status: 'published',
      lastModified: '2024-01-19',
      createdAt: '2024-01-03',
      author: 'مدیر فروش',
      template: '3',
      seoTitle: 'محصولات ژنراتور - FG Wilson و Cummins',
      seoDescription: 'کاتالوگ کامل ژنراتورهای صنعتی',
      featuredImage: '/images/products-hero.jpg',
      tags: ['محصولات', 'ژنراتور', 'FG Wilson'],
      category: 'محصولات',
      views: 2100,
      versions: [],
      comments: [],
      collaborators: ['مدیر فروش', 'مدیر فنی'],
      workflow: {
        currentStep: 'published',
        steps: ['draft', 'review', 'published'],
        approvers: ['مدیر فروش']
      },
      settings: {
        allowComments: false,
        showInMenu: true,
        requireLogin: false,
        cacheEnabled: true
      }
    },
    {
      id: '4',
      title: 'پروژه‌ها',
      slug: 'projects',
      content: `<h1>پروژه‌های اجرا شده</h1>
      <p>نمونه پروژه‌های اجرا شده...</p>
      <h2>پروژه بیمارستان</h2>
      <p>تامین برق اضطراری بیمارستان...</p>`,
      status: 'draft',
      lastModified: '2024-01-17',
      createdAt: '2024-01-10',
      author: 'مدیر پروژه',
      template: '5',
      seoTitle: 'پروژه‌های ژنراتور - نمونه کارها',
      seoDescription: 'نمونه پروژه‌های اجرا شده',
      tags: ['پروژه', 'نمونه کار', 'بیمارستان'],
      category: 'نمونه کار',
      views: 0,
      versions: [],
      comments: [],
      collaborators: ['مدیر پروژه'],
      workflow: {
        currentStep: 'draft',
        steps: ['draft', 'review', 'published'],
        approvers: ['مدیر ارشد']
      },
      settings: {
        allowComments: true,
        showInMenu: false,
        requireLogin: false,
        cacheEnabled: false
      }
    }
  ]);

  const [newPage, setNewPage] = useState({
    title: '',
    slug: '',
    content: '',
    template: '',
    category: '',
    tags: ''
  });

  // Advanced page management functions
  const handleSave = (pageId: string) => {
    const updatedPage = {
      ...pages.find(p => p.id === pageId),
      lastModified: new Date().toISOString(),
      versions: [
        ...(pages.find(p => p.id === pageId)?.versions || []),
        {
          id: `v${Date.now()}`,
          content: pages.find(p => p.id === pageId)?.content || '',
          timestamp: new Date().toISOString(),
          user: user?.name || 'Unknown',
          comment: 'ذخیره خودکار'
        }
      ]
    };

    setPages(prev => prev.map(p => p.id === pageId ? updatedPage : p));
    setIsEditing(false);
    console.log('Page saved:', pageId);
  };

  const handleCreatePage = () => {
    if (!newPage.title || !newPage.slug) return;

    const template = templates.find(t => t.id === newPage.template);
    const newPageData: Page = {
      id: `page-${Date.now()}`,
      title: newPage.title,
      slug: newPage.slug,
      content: template?.content || newPage.content,
      status: 'draft',
      lastModified: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      author: user?.name || 'Unknown',
      template: newPage.template,
      seoTitle: newPage.title,
      seoDescription: '',
      tags: newPage.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      category: newPage.category,
      views: 0,
      versions: [],
      comments: [],
      collaborators: [user?.name || 'Unknown'],
      workflow: {
        currentStep: 'draft',
        steps: ['draft', 'review', 'published'],
        approvers: ['مدیر ارشد']
      },
      settings: {
        allowComments: true,
        showInMenu: false,
        requireLogin: false,
        cacheEnabled: false
      }
    };

    setPages(prev => [...prev, newPageData]);
    setNewPage({ title: '', slug: '', content: '', template: '', category: '', tags: '' });
    setShowTemplates(false);
  };

  const handlePreview = (slug: string) => {
    window.open(`/${slug}`, '_blank');
  };

  const handleDeletePage = (pageId: string) => {
    setPages(prev => prev.filter(p => p.id !== pageId));
  };

  const handleStatusChange = (pageId: string, newStatus: Page['status']) => {
    setPages(prev => prev.map(p =>
      p.id === pageId ? { ...p, status: newStatus, lastModified: new Date().toISOString() } : p
    ));
  };

  const handleDuplicatePage = (pageId: string) => {
    const originalPage = pages.find(p => p.id === pageId);
    if (!originalPage) return;

    const duplicatedPage: Page = {
      ...originalPage,
      id: `dup-${Date.now()}`,
      title: `کپی-${originalPage.title}`,
      slug: `${originalPage.slug}-copy`,
      status: 'draft',
      views: 0,
      versions: [],
      comments: []
    };

    setPages(prev => [...prev, duplicatedPage]);
  };

  const handleAddComment = (pageId: string, comment: string, type: PageComment['type'] = 'comment') => {
    const newComment: PageComment = {
      id: `comment-${Date.now()}`,
      user: user?.name || 'Unknown',
      comment,
      timestamp: new Date().toISOString(),
      type
    };

    setPages(prev => prev.map(p =>
      p.id === pageId
        ? { ...p, comments: [...p.comments, newComment] }
        : p
    ));
  };

  const handleWorkflowAction = (pageId: string, action: 'approve' | 'reject' | 'request_review') => {
    setPages(prev => prev.map(p => {
      if (p.id !== pageId) return p;

      const currentStepIndex = p.workflow.steps.indexOf(p.workflow.currentStep);
      let newStatus = p.status;
      let newStep = p.workflow.currentStep;

      switch (action) {
        case 'request_review':
          newStatus = 'review';
          newStep = 'review';
          break;
        case 'approve':
          if (currentStepIndex < p.workflow.steps.length - 1) {
            newStep = p.workflow.steps[currentStepIndex + 1];
            if (newStep === 'published') newStatus = 'published';
          }
          break;
        case 'reject':
          newStatus = 'draft';
          newStep = 'draft';
          break;
      }

      return {
        ...p,
        status: newStatus,
        workflow: { ...p.workflow, currentStep: newStep },
        lastModified: new Date().toISOString()
      };
    }));
  };

  // Filter and sort pages
  const filteredAndSortedPages = pages
    .filter(page => {
      const matchesSearch = page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           page.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           page.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus = statusFilter === 'all' || page.status === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'modified':
          return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime();
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'views':
          return b.views - a.views;
        default:
          return 0;
      }
    });

  // Statistics
  const stats = {
    total: pages.length,
    published: pages.filter(p => p.status === 'published').length,
    draft: pages.filter(p => p.status === 'draft').length,
    review: pages.filter(p => p.status === 'review').length,
    totalViews: pages.reduce((acc, p) => acc + p.views, 0),
    totalComments: pages.reduce((acc, p) => acc + p.comments.length, 0)
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
                مدیریت صفحات پیشرفته
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2 text-lg">
                سیستم مدیریت صفحات حرفه‌ای با workflow و collaboration
              </p>
              <div className="flex items-center gap-4 mt-3">
                <Badge variant="outline" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  کاربر: {user.name}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {new Date().toLocaleTimeString('fa-IR')}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  {stats.total} صفحه
                </Badge>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                onClick={() => setShowTemplates(true)}
                variant="default"
                size="lg"
                className="min-w-[140px]"
              >
                <Template className="w-5 h-5 mr-2" />
                تمپلیت جدید
              </Button>

              <Button
                onClick={() => setShowAnalytics(true)}
                variant="outline"
                size="lg"
              >
                <BarChart3 className="w-5 h-5 mr-2" />
                آمار
              </Button>

              <Button
                onClick={() => setShowWorkflow(true)}
                variant="outline"
                size="lg"
              >
                <Workflow className="w-5 h-5 mr-2" />
                Workflow
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
              <Label htmlFor="view-mode" className="text-sm font-medium">نمایش:</Label>
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
                  <ListIcon className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">همه صفحات</SelectItem>
                <SelectItem value="published">منتشر شده</SelectItem>
                <SelectItem value="draft">پیش‌نویس</SelectItem>
                <SelectItem value="review">در حال بررسی</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="modified">آخرین ویرایش</SelectItem>
                <SelectItem value="created">تاریخ ایجاد</SelectItem>
                <SelectItem value="title">عنوان</SelectItem>
                <SelectItem value="views">بازدید</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="جستجو در صفحات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{stats.published}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">منتشر شده</div>
              </CardContent>
            </Card>
            <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600">{stats.draft}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">پیش‌نویس</div>
              </CardContent>
            </Card>
            <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.review}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">در حال بررسی</div>
              </CardContent>
            </Card>
            <Card className="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.totalViews.toLocaleString()}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">کل بازدیدها</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Pages Grid/List */}
        <div className="space-y-6">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAndSortedPages.map((page) => (
                <Card key={page.id} className="hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:-translate-y-1">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg line-clamp-2">{page.title}</CardTitle>
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleToggleFavorite(page.id)}
                        >
                          <Star className={`w-4 h-4 ${page.tags.includes('featured') ? 'text-yellow-500 fill-yellow-500' : 'text-gray-400'}`} />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge
                        variant={
                          page.status === 'published' ? 'default' :
                          page.status === 'review' ? 'secondary' :
                          'outline'
                        }
                        className="text-xs"
                      >
                        {page.status === 'published' ? 'منتشر شده' :
                         page.status === 'review' ? 'در حال بررسی' :
                         'پیش‌نویس'}
                      </Badge>
                      <span className="text-xs text-gray-500">/{page.slug}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                        <span>نویسنده: {page.author}</span>
                        <span>{new Date(page.lastModified).toLocaleDateString('fa-IR')}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {page.views.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-4 h-4" />
                          {page.comments.length}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {page.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2 pt-2">
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
                          onClick={() => handleDuplicatePage(page.id)}
                          variant="outline"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeletePage(page.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700/50">
                    <tr>
                      <th className="px-6 py-4 text-right text-sm font-medium">عنوان</th>
                      <th className="px-6 py-4 text-right text-sm font-medium">وضعیت</th>
                      <th className="px-6 py-4 text-right text-sm font-medium">نویسنده</th>
                      <th className="px-6 py-4 text-right text-sm font-medium">تاریخ</th>
                      <th className="px-6 py-4 text-right text-sm font-medium">بازدید</th>
                      <th className="px-6 py-4 text-right text-sm font-medium">عملیات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredAndSortedPages.map((page) => (
                      <tr key={page.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium">{page.title}</div>
                            <div className="text-sm text-gray-500">/{page.slug}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant={
                            page.status === 'published' ? 'default' :
                            page.status === 'review' ? 'secondary' :
                            'outline'
                          }>
                            {page.status === 'published' ? 'منتشر شده' :
                             page.status === 'review' ? 'در حال بررسی' :
                             'پیش‌نویس'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{page.author}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(page.lastModified).toLocaleDateString('fa-IR')}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{page.views}</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => handlePreview(page.slug)}>
                              <Eye className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleDuplicatePage(page.id)}>
                              <Copy className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDeletePage(page.id)}>
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Templates Modal */}
        <Dialog open={showTemplates} onOpenChange={setShowTemplates}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
            <DialogHeader>
              <DialogTitle>انتخاب تمپلیت</DialogTitle>
              <DialogDescription>
                یک تمپلیت برای صفحه جدید انتخاب کنید
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {templates.map((template) => (
                <Card
                  key={template.id}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedTemplate === template.id ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950' : ''
                  }`}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-t-lg flex items-center justify-center">
                    <Template className="w-12 h-12 text-gray-400" />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">{template.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {template.description}
                    </p>
                    <Badge variant="outline">{template.category}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="flex justify-between items-center mt-6 pt-6 border-t">
              <Button variant="outline" onClick={() => setShowTemplates(false)}>
                انصراف
              </Button>
              <Button
                onClick={() => {
                  setShowTemplates(false);
                  setIsEditing(true);
                }}
                disabled={!selectedTemplate}
              >
                استفاده از تمپلیت
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Analytics Modal */}
        <Dialog open={showAnalytics} onOpenChange={setShowAnalytics}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
            <DialogHeader>
              <DialogTitle>آمار صفحات</DialogTitle>
              <DialogDescription>
                آمار و تحلیل صفحات وبسایت
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                    <div className="text-sm text-gray-600">کل صفحات</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{stats.published}</div>
                    <div className="text-sm text-gray-600">منتشر شده</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-600">{stats.draft}</div>
                    <div className="text-sm text-gray-600">پیش‌نویس</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">{stats.totalViews}</div>
                    <div className="text-sm text-gray-600">کل بازدیدها</div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>صفحات محبوب</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {pages
                      .sort((a, b) => b.views - a.views)
                      .slice(0, 5)
                      .map((page, index) => (
                        <div key={page.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-sm font-medium">
                              {index + 1}
                            </div>
                            <div>
                              <div className="font-medium">{page.title}</div>
                              <div className="text-sm text-gray-500">/{page.slug}</div>
                            </div>
                          </div>
                          <div className="text-sm text-gray-600">{page.views} بازدید</div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </DialogContent>
        </Dialog>

        {/* Create Page Modal */}
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
            <DialogHeader>
              <DialogTitle>ایجاد صفحه جدید</DialogTitle>
              <DialogDescription>
                یک صفحه جدید با استفاده از تمپلیت یا از ابتدا ایجاد کنید
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>عنوان صفحه</Label>
                  <Input
                    value={newPage.title}
                    onChange={(e) => setNewPage(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="عنوان صفحه را وارد کنید"
                  />
                </div>
                <div className="space-y-2">
                  <Label>آدرس صفحه (Slug)</Label>
                  <Input
                    value={newPage.slug}
                    onChange={(e) => setNewPage(prev => ({ ...prev, slug: e.target.value }))}
                    placeholder="about-us"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>دسته‌بندی</Label>
                <Select value={newPage.category} onValueChange={(value) => setNewPage(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="دسته‌بندی را انتخاب کنید" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="شرکت">شرکت</SelectItem>
                    <SelectItem value="خدمات">خدمات</SelectItem>
                    <SelectItem value="محصولات">محصولات</SelectItem>
                    <SelectItem value="نمونه کار">نمونه کار</SelectItem>
                    <SelectItem value="ارتباطی">ارتباطی</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>تگ‌ها (جدا شده با کاما)</Label>
                <Input
                  value={newPage.tags}
                  onChange={(e) => setNewPage(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="تگ1, تگ2, تگ3"
                />
              </div>

              <div className="space-y-2">
                <Label>محتوای صفحه</Label>
                <Textarea
                  value={newPage.content}
                  onChange={(e) => setNewPage(prev => ({ ...prev, content: e.target.value }))}
                  rows={15}
                  placeholder="محتوای صفحه را وارد کنید..."
                  className="font-mono text-sm"
                />
              </div>

              <div className="flex justify-between items-center pt-6 border-t">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  انصراف
                </Button>
                <Button onClick={handleCreatePage} disabled={!newPage.title || !newPage.slug}>
                  <Plus className="w-4 h-4 mr-2" />
                  ایجاد صفحه
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Workflow Modal */}
        <Dialog open={showWorkflow} onOpenChange={setShowWorkflow}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
            <DialogHeader>
              <DialogTitle>مدیریت Workflow</DialogTitle>
              <DialogDescription>
                مدیریت مراحل تایید و انتشار صفحات
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {['draft', 'review', 'published'].map((step, index) => (
                  <Card key={step} className="text-center">
                    <CardContent className="p-6">
                      <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
                        step === 'draft' ? 'bg-yellow-100 text-yellow-600' :
                        step === 'review' ? 'bg-blue-100 text-blue-600' :
                        'bg-green-100 text-green-600'
                      }`}>
                        {step === 'draft' && <Edit className="w-8 h-8" />}
                        {step === 'review' && <Eye className="w-8 h-8" />}
                        {step === 'published' && <CheckCircle className="w-8 h-8" />}
                      </div>
                      <h3 className="font-semibold mb-2">
                        {step === 'draft' ? 'پیش‌نویس' :
                         step === 'review' ? 'در حال بررسی' :
                         'منتشر شده'}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        {pages.filter(p => p.workflow.currentStep === step).length} صفحه
                      </p>
                      <div className="space-y-2">
                        {pages
                          .filter(p => p.workflow.currentStep === step)
                          .slice(0, 3)
                          .map(page => (
                            <div key={page.id} className="text-xs bg-gray-100 dark:bg-gray-700 p-2 rounded">
                              {page.title}
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Statistics Card */}
        <Card className="mt-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              آمار کلی صفحات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl">
                <div className="text-3xl font-bold text-green-600 mb-1">{stats.published}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">منتشر شده</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-xl">
                <div className="text-3xl font-bold text-yellow-600 mb-1">{stats.draft}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">پیش‌نویس</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl">
                <div className="text-3xl font-bold text-blue-600 mb-1">{stats.review}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">در حال بررسی</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl">
                <div className="text-3xl font-bold text-purple-600 mb-1">{stats.totalViews.toLocaleString()}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">کل بازدیدها</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
