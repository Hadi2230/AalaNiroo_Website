import { useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart3,
  TrendingUp,
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  Calendar,
  Download,
  Filter,
  Eye
} from 'lucide-react';

// Mock data for reports
const salesData = {
  daily: [
    { date: '1403/01/10', orders: 5, revenue: 125000000, customers: 4 },
    { date: '1403/01/11', orders: 8, revenue: 210000000, customers: 7 },
    { date: '1403/01/12', orders: 12, revenue: 380000000, customers: 10 },
    { date: '1403/01/13', orders: 6, revenue: 180000000, customers: 5 },
    { date: '1403/01/14', orders: 9, revenue: 270000000, customers: 8 },
    { date: '1403/01/15', orders: 15, revenue: 450000000, customers: 12 }
  ],
  monthly: [
    { month: 'دی 1402', orders: 45, revenue: 1350000000, customers: 38 },
    { month: 'بهمن 1402', orders: 52, revenue: 1560000000, customers: 44 },
    { month: 'اسفند 1402', orders: 48, revenue: 1440000000, customers: 41 },
    { month: 'فروردین 1403', orders: 67, revenue: 2010000000, customers: 58 }
  ],
  products: [
    { name: 'دیزل ژنراتور FG Wilson', sold: 45, revenue: 38250000000, percentage: 65 },
    { name: 'مولد گازسوز Cummins', sold: 23, revenue: 15640000000, percentage: 26 },
    { name: 'موتور برق Honda', sold: 67, revenue: 1675000000, percentage: 9 }
  ],
  customers: [
    { name: 'شرکت پتروشیمی تهران', orders: 8, spent: 6800000000, lastOrder: '1403/01/15' },
    { name: 'کارخانه سیمان اصفهان', orders: 12, spent: 8500000000, lastOrder: '1403/01/13' },
    { name: 'بیمارستان امام رضا', orders: 3, spent: 950000000, lastOrder: '1403/01/14' },
    { name: 'مجتمع مسکونی الماس', orders: 2, spent: 180000000, lastOrder: '1403/01/12' }
  ]
};

const AdminReports = () => {
  const [dateRange, setDateRange] = useState('7days');
  const [reportType, setReportType] = useState('sales');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fa-IR').format(amount) + ' تومان';
  };

  const calculateTotal = (data: any[], field: string) => {
    return data.reduce((sum, item) => sum + item[field], 0);
  };

  const getPercentageChange = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous * 100);
  };

  const exportReport = (type: string) => {
    // Mock export functionality
    console.log(`Exporting ${type} report...`);
    // In real implementation, this would generate and download the report
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">گزارش‌های فروش</h1>
            <p className="text-gray-600">تحلیل و بررسی عملکرد فروش</p>
          </div>
          <div className="flex gap-2">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">7 روز اخیر</SelectItem>
                <SelectItem value="30days">30 روز اخیر</SelectItem>
                <SelectItem value="90days">3 ماه اخیر</SelectItem>
                <SelectItem value="1year">1 سال اخیر</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => exportReport('pdf')}>
              <Download className="w-4 h-4 mr-2" />
              خروجی PDF
            </Button>
            <Button variant="outline" onClick={() => exportReport('excel')}>
              <Download className="w-4 h-4 mr-2" />
              خروجی Excel
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">فروش کل</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(calculateTotal(salesData.daily, 'revenue'))}
              </div>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                15% افزایش نسبت به دوره قبل
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">تعداد سفارشات</CardTitle>
              <ShoppingCart className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{calculateTotal(salesData.daily, 'orders')}</div>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                20% افزایش نسبت به دوره قبل
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">مشتریان جدید</CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{calculateTotal(salesData.daily, 'customers')}</div>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                8% افزایش نسبت به دوره قبل
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">میانگین سفارش</CardTitle>
              <BarChart3 className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(Math.round(calculateTotal(salesData.daily, 'revenue') / calculateTotal(salesData.daily, 'orders')))}
              </div>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                12% افزایش نسبت به دوره قبل
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reports Tabs */}
        <Tabs value={reportType} onValueChange={setReportType}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="sales">گزارش فروش</TabsTrigger>
            <TabsTrigger value="products">محصولات</TabsTrigger>
            <TabsTrigger value="customers">مشتریان</TabsTrigger>
            <TabsTrigger value="performance">عملکرد</TabsTrigger>
          </TabsList>

          <TabsContent value="sales" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>نمودار فروش روزانه</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {salesData.daily.map((day, index) => (
                    <div key={day.date} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Calendar className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium">{day.date}</div>
                          <div className="text-sm text-gray-500">{day.orders} سفارش</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{formatCurrency(day.revenue)}</div>
                        <div className="text-sm text-gray-500">{day.customers} مشتری</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>گزارش ماهانه</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {salesData.monthly.map((month, index) => (
                    <div key={month.month} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium">{month.month}</div>
                        <div className="text-sm text-gray-500">{month.orders} سفارش</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{formatCurrency(month.revenue)}</div>
                        <div className="text-sm text-gray-500">{month.customers} مشتری</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>عملکرد محصولات</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {salesData.products.map((product, index) => (
                    <div key={product.name} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{product.name}</span>
                        <span className="text-sm text-gray-500">{product.percentage}% از کل فروش</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-blue-600 h-3 rounded-full transition-all"
                          style={{ width: `${product.percentage}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>{product.sold} عدد فروخته شده</span>
                        <span>{formatCurrency(product.revenue)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>مشتریان برتر</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {salesData.customers.map((customer, index) => (
                    <div key={customer.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="font-bold text-green-600">{index + 1}</span>
                        </div>
                        <div>
                          <div className="font-medium">{customer.name}</div>
                          <div className="text-sm text-gray-500">
                            {customer.orders} سفارش - آخرین: {customer.lastOrder}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{formatCurrency(customer.spent)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>اهداف فروش</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>فروش ماهانه</span>
                        <span>85%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div className="bg-green-600 h-3 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">هدف: 2,000,000,000 تومان</div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <span>سفارشات جدید</span>
                        <span>92%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div className="bg-blue-600 h-3 rounded-full" style={{ width: '92%' }}></div>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">هدف: 60 سفارش</div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <span>مشتریان جدید</span>
                        <span>78%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div className="bg-purple-600 h-3 rounded-full" style={{ width: '78%' }}></div>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">هدف: 50 مشتری</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>آمار عملکرد</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>نرخ تبدیل سفارش</span>
                      <span className="font-semibold">23%</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span>میانگین زمان پاسخگویی</span>
                      <span className="font-semibold">2.5 ساعت</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span>رضایت مشتریان</span>
                      <span className="font-semibold">4.8/5</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span>نرخ بازگشت مشتری</span>
                      <span className="font-semibold">67%</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span>زمان تحویل متوسط</span>
                      <span className="font-semibold">12 روز</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminReports;