import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Building2,
  Mail,
  MessageSquare,
  Phone,
  Zap,
  Settings,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Info,
  RefreshCw,
  Play,
  Pause,
  Copy,
  Download,
  Upload,
  Database,
  Shield,
  Key,
  Webhook,
  Activity,
  BarChart3,
  FileText,
  Server,
  Globe,
  Users,
  Package,
  CreditCard,
  Bell,
  Target,
  TrendingUp,
  Calendar,
  TestTube
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock integration data
const integrationServices = [
  {
    id: 'erp',
    name: 'سیستم‌های حسابداری (ERP)',
    icon: Building2,
    description: 'اتصال به نرم‌افزارهای حسابداری و مالی',
    status: 'connected',
    lastSync: '1403/01/15 14:30',
    syncStatus: 'success',
    color: 'from-blue-600 to-indigo-700',
    bgColor: 'bg-blue-50 dark:bg-blue-950',
    features: [
      'همگام‌سازی خودکار فاکتورها',
      'مدیریت موجودی انبار',
      'گزارش‌های مالی یکپارچه',
      'مدیریت هزینه‌ها و درآمدها',
      'اتصال به چندین شعبه'
    ],
    providers: [
      { name: 'هلو', connected: true, lastSync: '5 دقیقه پیش' },
      { name: 'سپیدار', connected: false, lastSync: null },
      { name: 'همکاران سیستم', connected: true, lastSync: '1 ساعت پیش' },
      { name: 'قابلیت اتصال سفارشی', connected: false, lastSync: null }
    ]
  },
  {
    id: 'crm',
    name: 'مدیریت روابط مشتری (CRM)',
    icon: Users,
    description: 'مدیریت مشتریان و فرصت‌های فروش',
    status: 'connected',
    lastSync: '1403/01/15 14:25',
    syncStatus: 'success',
    color: 'from-green-600 to-emerald-700',
    bgColor: 'bg-green-50 dark:bg-green-950',
    features: [
      'مدیریت لیدها و فرصت‌ها',
      'پیگیری تعاملات مشتری',
      'اتوماسیون فروش',
      'گزارش عملکرد فروشندگان',
      'مدیریت کمپین‌های بازاریابی'
    ],
    providers: [
      { name: 'Salesforce', connected: false, lastSync: null },
      { name: 'HubSpot', connected: true, lastSync: '30 دقیقه پیش' },
      { name: 'Pipedrive', connected: false, lastSync: null },
      { name: 'CRM اختصاصی', connected: true, lastSync: '10 دقیقه پیش' }
    ]
  },
  {
    id: 'email',
    name: 'ایمیل مارکتینگ',
    icon: Mail,
    description: 'ارسال خبرنامه و کمپین‌های ایمیلی',
    status: 'connected',
    lastSync: '1403/01/15 14:20',
    syncStatus: 'warning',
    color: 'from-purple-600 to-pink-700',
    bgColor: 'bg-purple-50 dark:bg-purple-950',
    features: [
      'ارسال خبرنامه خودکار',
      'ردیابی باز شدن ایمیل‌ها',
      'تقسیم‌بندی مشتریان',
      'A/B Testing کمپین‌ها',
      'گزارش عملکرد ایمیلی'
    ],
    providers: [
      { name: 'Mailchimp', connected: true, lastSync: '2 ساعت پیش' },
      { name: 'Sendinblue', connected: false, lastSync: null },
      { name: 'ConvertKit', connected: false, lastSync: null },
      { name: 'سیستم ایمیل سفارشی', connected: true, lastSync: '15 دقیقه پیش' }
    ]
  },
  {
    id: 'sms',
    name: 'پیامک (SMS)',
    icon: MessageSquare,
    description: 'ارسال پیامک و نوتیفیکیشن',
    status: 'disconnected',
    lastSync: null,
    syncStatus: 'error',
    color: 'from-orange-600 to-red-700',
    bgColor: 'bg-orange-50 dark:bg-orange-950',
    features: [
      'ارسال پیامک تائیدی',
      'نوتیفیکیشن سفارشات',
      'پیامک‌های تبلیغاتی',
      'پیگیری پرداخت‌ها',
      'گزارش تحویل پیامک'
    ],
    providers: [
      { name: 'کاوه نگار', connected: false, lastSync: null },
      { name: 'ملی پیامک', connected: false, lastSync: null },
      { name: 'فراز اس‌ام‌اس', connected: false, lastSync: null },
      { name: 'SMS اختصاصی', connected: false, lastSync: null }
    ]
  },
  {
    id: 'callcenter',
    name: 'کال سنتر یکپارچه',
    icon: Phone,
    description: 'سیستم تلفنی و مدیریت تماس‌ها',
    status: 'connected',
    lastSync: '1403/01/15 14:35',
    syncStatus: 'success',
    color: 'from-teal-600 to-cyan-700',
    bgColor: 'bg-teal-50 dark:bg-teal-950',
    features: [
      'مدیریت تماس‌های ورودی',
      'سیستم IVR پیشرفته',
      'گزارش تماس‌ها',
      'ضبط مکالمات',
      'مدیریت تیم فروش تلفنی'
    ],
    providers: [
      { name: 'Avaya', connected: false, lastSync: null },
      { name: 'Cisco', connected: true, lastSync: '45 دقیقه پیش' },
      { name: 'Asterisk', connected: false, lastSync: null },
      { name: 'VoIP اختصاصی', connected: true, lastSync: '20 دقیقه پیش' }
    ]
  }
];

const AdminIntegrations = () => {
  const [selectedService, setSelectedService] = useState('erp');
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionLogs, setConnectionLogs] = useState([]);
  const [syncProgress, setSyncProgress] = useState(0);
  const { toast } = useToast();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge className="bg-green-100 text-green-800 border-green-200">متصل</Badge>;
      case 'disconnected':
        return <Badge className="bg-red-100 text-red-800 border-red-200">قطع شده</Badge>;
      case 'connecting':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">در حال اتصال</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800 border-red-200">خطا</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getSyncStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const handleConnect = async (serviceId: string) => {
    setIsConnecting(true);
    setSyncProgress(0);

    // Simulate connection process
    const progressInterval = setInterval(() => {
      setSyncProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsConnecting(false);
          toast({
            title: 'اتصال موفق',
            description: `${integrationServices.find(s => s.id === serviceId)?.name} با موفقیت متصل شد.`,
          });
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    // Add log entry
    const newLog = {
      id: Date.now(),
      service: serviceId,
      action: 'connect',
      timestamp: new Date().toLocaleString('fa-IR'),
      status: 'success'
    };
    setConnectionLogs(prev => [newLog, ...prev.slice(0, 9)]);
  };

  const handleDisconnect = async (serviceId: string) => {
    const newLog = {
      id: Date.now(),
      service: serviceId,
      action: 'disconnect',
      timestamp: new Date().toLocaleString('fa-IR'),
      status: 'info'
    };
    setConnectionLogs(prev => [newLog, ...prev.slice(0, 9)]);
    toast({
      title: 'اتصال قطع شد',
      description: `${integrationServices.find(s => s.id === serviceId)?.name} قطع شد.`,
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'کپی شد',
      description: 'متن در کلیپ‌بورد کپی شد.',
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-8 p-6">
        {/* Header */}
        <div className="flex justify-between items-center bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">ادغام با سیستم‌های خارجی</h1>
              <p className="text-indigo-100 mt-2">
                اتصال به ERP، CRM، ایمیل مارکتینگ، SMS و کال سنتر
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
              <Download className="w-4 h-4 mr-2" />
              خروجی تنظیمات
            </Button>
            <Button variant="secondary" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
              <Upload className="w-4 h-4 mr-2" />
              وارد کردن تنظیمات
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { title: 'سیستم‌های متصل', value: '3/5', icon: CheckCircle, color: 'text-green-600' },
            { title: 'آخرین همگام‌سازی', value: '2 دقیقه پیش', icon: RefreshCw, color: 'text-blue-600' },
            { title: 'API Calls امروز', value: '1,247', icon: Activity, color: 'text-purple-600' },
            { title: 'وضعیت کلی', value: 'عالی', icon: TrendingUp, color: 'text-emerald-600' }
          ].map((stat, index) => (
            <Card key={index} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
                  </div>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs value={selectedService} onValueChange={setSelectedService} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
            {integrationServices.map((service) => (
              <TabsTrigger key={service.id} value={service.id} className="flex items-center gap-2">
                <service.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{service.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {integrationServices.map((service) => (
            <TabsContent key={service.id} value={service.id} className="space-y-6">
              {/* Service Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${service.color} flex items-center justify-center shadow-lg`}>
                          <service.icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-xl">{service.name}</CardTitle>
                          <CardDescription>{service.description}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {getStatusBadge(service.status)}
                        {getSyncStatusIcon(service.syncStatus)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3">آخرین فعالیت</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>آخرین همگام‌سازی:</span>
                            <span className="font-medium">{service.lastSync || 'هرگز'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>وضعیت اتصال:</span>
                            <span className="font-medium">{service.status === 'connected' ? 'فعال' : 'غیرفعال'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>دفعات اتصال:</span>
                            <span className="font-medium">1,247 بار</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3">تنظیمات سریع</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label htmlFor={`auto-sync-${service.id}`}>همگام‌سازی خودکار</Label>
                            <Switch id={`auto-sync-${service.id}`} defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor={`real-time-${service.id}`}>به‌روزرسانی لحظه‌ای</Label>
                            <Switch id={`real-time-${service.id}`} defaultChecked={service.id !== 'sms'} />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor={`notifications-${service.id}`}>نوتیفیکیشن</Label>
                            <Switch id={`notifications-${service.id}`} defaultChecked />
                          </div>
                        </div>
                      </div>
                    </div>

                    {isConnecting && service.id === selectedService && (
                      <div className="mt-6">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">در حال اتصال...</span>
                          <span className="text-sm text-gray-500">{syncProgress}%</span>
                        </div>
                        <Progress value={syncProgress} className="h-2" />
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Connection Status */}
                <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-lg">وضعیت اتصال</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">وضعیت فعلی:</span>
                      {getStatusBadge(service.status)}
                    </div>

                    <div className="space-y-3">
                      {service.status === 'connected' ? (
                        <Button
                          onClick={() => handleDisconnect(service.id)}
                          variant="destructive"
                          className="w-full"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          قطع اتصال
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handleConnect(service.id)}
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                          disabled={isConnecting}
                        >
                          <Zap className="w-4 h-4 mr-2" />
                          {isConnecting ? 'در حال اتصال...' : 'اتصال'}
                        </Button>
                      )}
                    </div>

                    <div className="pt-4 border-t">
                      <h4 className="font-semibold mb-2">ارائه‌دهندگان متصل</h4>
                      <div className="space-y-2">
                        {service.providers.map((provider, index) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              {provider.connected ? (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              ) : (
                                <XCircle className="w-4 h-4 text-red-600" />
                              )}
                              <span>{provider.name}</span>
                            </div>
                            <span className="text-gray-500">
                              {provider.lastSync || 'هرگز'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Service Features */}
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Target className="w-6 h-6 text-blue-600" />
                    امکانات و قابلیت‌ها
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {service.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Configuration Panels */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* API Configuration */}
                <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <Key className="w-6 h-6 text-purple-600" />
                      تنظیمات API
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>API Key</Label>
                      <div className="flex gap-2">
                        <Input
                          type="password"
                          placeholder="Enter API Key"
                          className="font-mono text-sm"
                        />
                        <Button variant="outline" size="icon" onClick={() => copyToClipboard('your-api-key')}>
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>API Secret</Label>
                      <div className="flex gap-2">
                        <Input
                          type="password"
                          placeholder="Enter API Secret"
                          className="font-mono text-sm"
                        />
                        <Button variant="outline" size="icon" onClick={() => copyToClipboard('your-api-secret')}>
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Endpoint URL</Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="https://api.example.com/v1"
                          className="font-mono text-sm"
                        />
                        <Button variant="outline" size="icon">
                          <TestTube className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button className="flex-1">ذخیره تنظیمات</Button>
                      <Button variant="outline">تست اتصال</Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Webhook Configuration */}
                <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <Webhook className="w-6 h-6 text-orange-600" />
                      Webhook Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Webhook URL</Label>
                      <div className="flex gap-2">
                        <Input
                          value={`https://yourapp.com/webhooks/${service.id}`}
                          readOnly
                          className="font-mono text-sm"
                        />
                        <Button variant="outline" size="icon" onClick={() => copyToClipboard(`https://yourapp.com/webhooks/${service.id}`)}>
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label>Events to Subscribe</Label>
                      {[
                        'order.created',
                        'order.updated',
                        'customer.created',
                        'payment.received',
                        'product.stock_low'
                      ].map((event) => (
                        <div key={event} className="flex items-center justify-between">
                          <Label className="text-sm">{event}</Label>
                          <Switch defaultChecked />
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <Label>Retry Policy</Label>
                      <Select defaultValue="3">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 بار</SelectItem>
                          <SelectItem value="3">3 بار</SelectItem>
                          <SelectItem value="5">5 بار</SelectItem>
                          <SelectItem value="10">10 بار</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button className="w-full">به‌روزرسانی Webhook</Button>
                  </CardContent>
                </Card>
              </div>

              {/* Data Mapping */}
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Database className="w-6 h-6 text-blue-600" />
                    نگاشت داده‌ها (Data Mapping)
                  </CardTitle>
                  <CardDescription>
                    نگاشت فیلدهای سیستم شما با فیلدهای سرویس خارجی
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">فیلدهای سیستم شما</h4>
                      <div className="space-y-2">
                        {[
                          'نام مشتری',
                          'ایمیل',
                          'شماره تماس',
                          'آدرس',
                          'کد ملی',
                          'تاریخ تولد'
                        ].map((field, index) => (
                          <div key={index} className="p-2 bg-gray-50 dark:bg-gray-700 rounded">
                            {field}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">فیلدهای {service.name}</h4>
                      <div className="space-y-2">
                        {[
                          'full_name',
                          'email_address',
                          'phone_number',
                          'address',
                          'national_id',
                          'birth_date'
                        ].map((field, index) => (
                          <div key={index} className="p-2 bg-blue-50 dark:bg-blue-950 rounded border border-blue-200 dark:border-blue-800">
                            {field}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-center">
                    <Button variant="outline" className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                      <Settings className="w-4 h-4 mr-2" />
                      تنظیم نگاشت فیلدها
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Security & Monitoring */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Security Settings */}
                <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <Shield className="w-6 h-6 text-red-600" />
                      تنظیمات امنیتی
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label>رمزگذاری داده‌ها</Label>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>تائید دو مرحله‌ای</Label>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>محدودیت IP</Label>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Rate Limiting</Label>
                        <Switch defaultChecked />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>API Rate Limit</Label>
                      <Select defaultValue="1000">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="100">100 درخواست/دقیقه</SelectItem>
                          <SelectItem value="500">500 درخواست/دقیقه</SelectItem>
                          <SelectItem value="1000">1000 درخواست/دقیقه</SelectItem>
                          <SelectItem value="unlimited">نامحدود</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button variant="outline" className="w-full">
                      <Shield className="w-4 h-4 mr-2" />
                      بررسی امنیتی
                    </Button>
                  </CardContent>
                </Card>

                {/* Monitoring Dashboard */}
                <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <Activity className="w-6 h-6 text-green-600" />
                      نظارت و گزارش‌گیری
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">98.5%</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">آپ‌تایم</div>
                      </div>
                      <div className="text-center p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">1,247</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">API Calls</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>درخواست‌های موفق:</span>
                        <span className="font-medium">1,189 (95%)</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>درخواست‌های ناموفق:</span>
                        <span className="font-medium">58 (5%)</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>میانگین زمان پاسخ:</span>
                        <span className="font-medium">245ms</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        گزارش کامل
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <Download className="w-4 h-4 mr-2" />
                        خروجی لاگ
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Integration Logs */}
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <FileText className="w-6 h-6 text-gray-600" />
                    لاگ‌های اتصال
                  </CardTitle>
                  <CardDescription>
                    تاریخچه فعالیت‌های اتصال به {service.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {connectionLogs.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>هنوز لاگی ثبت نشده است</p>
                      </div>
                    ) : (
                      connectionLogs.map((log) => (
                        <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${
                              log.status === 'success' ? 'bg-green-500' :
                              log.status === 'error' ? 'bg-red-500' :
                              'bg-blue-500'
                            }`} />
                            <div>
                              <div className="font-medium text-sm">{log.action}</div>
                              <div className="text-xs text-gray-500">{log.timestamp}</div>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {log.status}
                          </Badge>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" className="flex-1">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      تازه‌سازی لاگ‌ها
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Download className="w-4 h-4 mr-2" />
                      خروجی لاگ‌ها
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminIntegrations;