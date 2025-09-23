import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import {
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3
} from 'lucide-react';

// Mock data for demo
const dashboardData = {
  stats: {
    totalOrders: 127,
    totalCustomers: 89,
    totalProducts: 15,
    totalRevenue: 2450000000, // تومان
    ordersChange: 12,
    customersChange: 8,
    productsChange: 5,
    revenueChange: 15
  },
  recentOrders: [
    {
      id: '#ORD-001',
      customer: 'شرکت پتروشیمی تهران',
      product: 'دیزل ژنراتور FG Wilson 500kW',
      amount: 850000000,
      status: 'pending',
      date: '1403/01/15'
    },
    {
      id: '#ORD-002',
      customer: 'بیمارستان امام رضا',
      product: 'سیستم برق اضطراری',
      amount: 320000000,
      status: 'completed',
      date: '1403/01/14'
    },
    {
      id: '#ORD-003',
      customer: 'کارخانه سیمان اصفهان',
      product: 'مولد گازسوز Cummins',
      amount: 680000000,
      status: 'processing',
      date: '1403/01/13'
    }
  ],
  topProducts: [
    { name: 'دیزل ژنراتور FG Wilson', sold: 45, revenue: 1200000000 },
    { name: 'مولد گازسوز Cummins', sold: 23, revenue: 850000000 },
    { name: 'موتور برق Honda', sold: 67, revenue: 350000000 }
  ]
};

const AdminDashboard = () => {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fa-IR').format(amount) + ' تومان';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">تکمیل شده</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">در انتظار</Badge>;
      case 'processing':
        return <Badge className="bg-blue-100 text-blue-800">در حال پردازش</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">داشبورد فروش</h1>
            <p className="text-gray-600">
              خوش آمدید، {user?.name}! خلاصه وضعیت فروش امروز
            </p>
          </div>
          <div className="text-left">
            <div className="text-sm text-gray-500">زمان فعلی</div>
            <div className="font-mono text-lg">
              {currentTime.toLocaleTimeString('fa-IR')}
            </div>
            <div className="text-sm text-gray-500">
              {currentTime.toLocaleDateString('fa-IR')}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">کل سفارشات</CardTitle>
              <ShoppingCart className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.stats.totalOrders}</div>
              <div className="flex items-center text-xs text-green-600">
                <ArrowUp className="h-3 w-3 mr-1" />
                {dashboardData.stats.ordersChange}% افزایش
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">مشتریان</CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.stats.totalCustomers}</div>
              <div className="flex items-center text-xs text-green-600">
                <ArrowUp className="h-3 w-3 mr-1" />
                {dashboardData.stats.customersChange}% افزایش
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">محصولات</CardTitle>
              <Package className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.stats.totalProducts}</div>
              <div className="flex items-center text-xs text-green-600">
                <ArrowUp className="h-3 w-3 mr-1" />
                {dashboardData.stats.productsChange}% افزایش
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">درآمد کل</CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(dashboardData.stats.totalRevenue)}</div>
              <div className="flex items-center text-xs text-green-600">
                <ArrowUp className="h-3 w-3 mr-1" />
                {dashboardData.stats.revenueChange}% افزایش
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle>سفارشات اخیر</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{order.id}</span>
                        {getStatusBadge(order.status)}
                      </div>
                      <div className="text-sm text-gray-600">{order.customer}</div>
                      <div className="text-sm text-gray-500">{order.product}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{formatCurrency(order.amount)}</div>
                      <div className="text-sm text-gray-500">{order.date}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Link to="/admin/orders">
                  <Button variant="outline" className="w-full">
                    مشاهده همه سفارشات
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle>محصولات پرفروش</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-gray-600">{product.sold} عدد فروخته شده</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{formatCurrency(product.revenue)}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Link to="/admin/products">
                  <Button variant="outline" className="w-full">
                    مدیریت محصولات
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>دسترسی سریع</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Link to="/admin/products">
                <Button className="w-full h-20 flex flex-col gap-2">
                  <Package className="w-6 h-6" />
                  مدیریت محصولات
                </Button>
              </Link>

              <Link to="/admin/orders">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                  <ShoppingCart className="w-6 h-6" />
                  سفارشات جدید
                </Button>
              </Link>

              <Link to="/admin/customers">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                  <Users className="w-6 h-6" />
                  مشتریان
                </Button>
              </Link>

              <Link to="/admin/reports">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                  <BarChart3 className="w-6 h-6" />
                  گزارش‌ها
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