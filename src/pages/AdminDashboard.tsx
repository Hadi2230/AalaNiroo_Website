import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  Activity,
  DollarSign,
  Users,
  ShoppingCart,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Info,
  Bell,
  Sun,
  Moon,
  RefreshCw,
  Calendar,
  Target,
  BarChart3
} from 'lucide-react';

// Advanced Dashboard Data
const salesData = {
  daily: [
    { date: '01', sales: 125000000, orders: 8, customers: 6 },
    { date: '02', sales: 189000000, orders: 12, customers: 9 },
    { date: '03', sales: 234000000, orders: 15, customers: 11 },
    { date: '04', sales: 156000000, orders: 9, customers: 7 },
    { date: '05', sales: 298000000, orders: 18, customers: 14 },
    { date: '06', sales: 345000000, orders: 22, customers: 18 },
    { date: '07', sales: 412000000, orders: 26, customers: 21 },
    { date: '08', sales: 389000000, orders: 24, customers: 19 },
    { date: '09', sales: 467000000, orders: 29, customers: 25 },
    { date: '10', sales: 523000000, orders: 33, customers: 28 },
    { date: '11', sales: 478000000, orders: 30, customers: 26 },
    { date: '12', sales: 612000000, orders: 38, customers: 32 },
    { date: '13', sales: 589000000, orders: 36, customers: 31 },
    { date: '14', sales: 698000000, orders: 42, customers: 36 },
    { date: '15', sales: 756000000, orders: 45, customers: 39 }
  ],
  monthly: [
    { month: 'فروردین', sales: 8500000000, orders: 234, customers: 189, target: 8000000000 },
    { month: 'اردیبهشت', sales: 9200000000, orders: 267, customers: 215, target: 9000000000 },
    { month: 'خرداد', sales: 7800000000, orders: 223, customers: 178, target: 9500000000 },
    { month: 'تیر', sales: 10200000000, orders: 298, customers: 245, target: 10000000000 }
  ],
  productPerformance: [
    { name: 'FG Wilson دیزل', sales: 45, revenue: 38250000000, percentage: 65, color: '#3b82f6' },
    { name: 'Cummins گازسوز', sales: 23, revenue: 15640000000, percentage: 26, color: '#10b981' },
    { name: 'Honda قابل حمل', sales: 67, revenue: 1675000000, percentage: 9, color: '#f59e0b' }
  ],
  customerSegmentation: [
    { name: 'مشتریان VIP', value: 45, color: '#8b5cf6' },
    { name: 'مشتریان عادی', value: 78, color: '#06b6d4' },
    { name: 'مشتریان جدید', value: 32, color: '#84cc16' },
    { name: 'مشتریان غیرفعال', value: 12, color: '#f97316' }
  ],
  alerts: [
    {
      id: 1,
      type: 'warning',
      title: 'موجودی کم',
      message: 'دیزل ژنراتور FG Wilson فقط 2 عدد موجودی دارد',
      time: '2 دقیقه پیش',
      priority: 'high'
    },
    {
      id: 2,
      type: 'success',
      title: 'سفارش تکمیل شد',
      message: 'سفارش #ORD-156 با موفقیت تکمیل شد',
      time: '15 دقیقه پیش',
      priority: 'medium'
    },
    {
      id: 3,
      type: 'info',
      title: 'هدف فروش',
      message: 'هدف فروش روزانه امروز تکمیل شد! 🎉',
      time: '1 ساعت پیش',
      priority: 'low'
    }
  ],
  kpis: {
    totalRevenue: 12456000000,
    revenueChange: 18.2,
    totalOrders: 567,
    ordersChange: 12.5,
    totalCustomers: 892,
    customersChange: 8.7,
    conversionRate: 3.2,
    conversionChange: 0.8,
    avgOrderValue: 21968000,
    avgOrderChange: 5.1,
    customerRetention: 78.5,
    retentionChange: 2.3
  }
};

const AdminDashboard = () => {
  const { user } = useAuth();
  const { dir } = useLanguage();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('15d');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fa-IR').format(amount) + ' تومان';
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500 bg-red-50';
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'low':
        return 'border-l-blue-500 bg-blue-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const chartConfig = {
    sales: {
      label: 'فروش',
      color: 'hsl(var(--chart-1))',
    },
    orders: {
      label: 'سفارشات',
      color: 'hsl(var(--chart-2))',
    },
    customers: {
      label: 'مشتریان',
      color: 'hsl(var(--chart-3))',
    },
    target: {
      label: 'هدف',
      color: 'hsl(var(--chart-4))',
    },
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <AdminLayout>
      <div className="space-y-8 p-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-950 dark:to-indigo-950 min-h-screen">
        {/* Header with Theme Toggle */}
        <div className="flex justify-between items-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Activity className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                داشبورد مدیریتی پیشرفته
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                خوش آمدید، {user?.name}! نظارت لحظه‌ای بر عملکرد فروش
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="text-sm text-gray-500 dark:text-gray-400">زمان زنده</div>
              <div className="font-mono text-xl font-bold">
                {currentTime.toLocaleTimeString('fa-IR')}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {currentTime.toLocaleDateString('fa-IR')}
              </div>
            </div>

            <Button
              onClick={toggleTheme}
              variant="outline"
              size="icon"
              className="w-12 h-12 rounded-xl bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>

            <Button variant="outline" size="icon" className="w-12 h-12 rounded-xl bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm">
              <RefreshCw className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* KPI Cards - Advanced Design */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {[
            {
              title: 'درآمد کل',
              value: formatCurrency(salesData.kpis.totalRevenue),
              change: salesData.kpis.revenueChange,
              icon: DollarSign,
              color: 'from-emerald-500 to-teal-600',
              trend: 'up'
            },
            {
              title: 'سفارشات',
              value: salesData.kpis.totalOrders.toString(),
              change: salesData.kpis.ordersChange,
              icon: ShoppingCart,
              color: 'from-blue-500 to-cyan-600',
              trend: 'up'
            },
            {
              title: 'مشتریان',
              value: salesData.kpis.totalCustomers.toString(),
              change: salesData.kpis.customersChange,
              icon: Users,
              color: 'from-purple-500 to-pink-600',
              trend: 'up'
            },
            {
              title: 'نرخ تبدیل',
              value: `${salesData.kpis.conversionRate}%`,
              change: salesData.kpis.conversionChange,
              icon: Target,
              color: 'from-orange-500 to-red-600',
              trend: 'up'
            },
            {
              title: 'میانگین سفارش',
              value: formatCurrency(salesData.kpis.avgOrderValue),
              change: salesData.kpis.avgOrderChange,
              icon: TrendingUp,
              color: 'from-green-500 to-emerald-600',
              trend: 'up'
            },
            {
              title: 'حفظ مشتری',
              value: `${salesData.kpis.customerRetention}%`,
              change: salesData.kpis.retentionChange,
              icon: CheckCircle,
              color: 'from-indigo-500 to-purple-600',
              trend: 'up'
            }
          ].map((kpi, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${kpi.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                    <kpi.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className={`flex items-center gap-1 ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {kpi.trend === 'up' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                    <span className="text-sm font-medium">{kpi.change}%</span>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{kpi.title}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{kpi.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Real-time Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sales Trend Chart */}
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold flex items-center gap-3">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                  روند فروش روزانه
                </CardTitle>
                <div className="flex gap-2">
                  <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7d">7 روز</SelectItem>
                      <SelectItem value="15d">15 روز</SelectItem>
                      <SelectItem value="30d">30 روز</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <AreaChart data={salesData.daily}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="sales"
                    stroke="#3b82f6"
                    fill="url(#salesGradient)"
                    strokeWidth={3}
                  />
                  <defs>
                    <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}/>
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Product Performance */}
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center gap-3">
                <Package className="w-6 h-6 text-purple-600" />
                عملکرد محصولات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <PieChart>
                  <Pie
                    data={salesData.productPerformance}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="percentage"
                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                  >
                    {salesData.productPerformance.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Performance & Customer Segmentation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Monthly Performance */}
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center gap-3">
                <Calendar className="w-6 h-6 text-orange-600" />
                عملکرد ماهانه
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <BarChart data={salesData.monthly}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="sales" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="target" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Customer Segmentation */}
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center gap-3">
                <Users className="w-6 h-6 text-green-600" />
                بخش‌بندی مشتریان
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <PieChart>
                  <Pie
                    data={salesData.customerSegmentation}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {salesData.customerSegmentation.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Alert System */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center gap-3">
              <Bell className="w-6 h-6 text-red-600" />
              هشدارهای هوشمند
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {salesData.alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-xl border-l-4 ${getPriorityColor(alert.priority)} flex items-start gap-4 hover:shadow-md transition-shadow`}
                >
                  {getAlertIcon(alert.type)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-gray-900 dark:text-white">{alert.title}</h4>
                      <span className="text-sm text-gray-500">{alert.time}</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mt-1">{alert.message}</p>
                  </div>
                  <Button size="sm" variant="outline">
                    مشاهده
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center gap-3">
              <Zap className="w-6 h-6 text-yellow-600" />
              دسترسی سریع
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link to="/admin/products" className="group">
                <Button className="w-full h-20 flex flex-col gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all group-hover:-translate-y-1">
                  <Package className="w-6 h-6" />
                  <span className="text-sm">مدیریت محصولات</span>
                </Button>
              </Link>

              <Link to="/admin/orders" className="group">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-2 border-2 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950 transition-all group-hover:-translate-y-1">
                  <ShoppingCart className="w-6 h-6" />
                  <span className="text-sm">سفارشات جدید</span>
                </Button>
              </Link>

              <Link to="/admin/customers" className="group">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-2 border-2 hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-950 transition-all group-hover:-translate-y-1">
                  <Users className="w-6 h-6" />
                  <span className="text-sm">مشتریان</span>
                </Button>
              </Link>

              <Link to="/admin/reports" className="group">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-2 border-2 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-950 transition-all group-hover:-translate-y-1">
                  <BarChart3 className="w-6 h-6" />
                  <span className="text-sm">گزارش‌ها</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;