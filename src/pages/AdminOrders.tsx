import { useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  Filter,
  Eye,
  Edit,
  CheckCircle,
  Clock,
  AlertTriangle,
  Package
} from 'lucide-react';

// Mock orders data
const initialOrders = [
  {
    id: 'ORD-001',
    customer: 'شرکت پتروشیمی تهران',
    customerId: 'CUST-001',
    product: 'دیزل ژنراتور FG Wilson P500',
    quantity: 2,
    unitPrice: 850000000,
    totalAmount: 1700000000,
    status: 'pending',
    priority: 'high',
    createdAt: '1403/01/15',
    dueDate: '1403/02/15',
    notes: 'تحویل فوری مورد نیاز است'
  },
  {
    id: 'ORD-002',
    customer: 'بیمارستان امام رضا',
    customerId: 'CUST-002',
    product: 'سیستم برق اضطراری',
    quantity: 1,
    unitPrice: 320000000,
    totalAmount: 320000000,
    status: 'processing',
    priority: 'medium',
    createdAt: '1403/01/14',
    dueDate: '1403/02/10',
    notes: 'نصب توسط تیم فنی شرکت'
  },
  {
    id: 'ORD-003',
    customer: 'کارخانه سیمان اصفهان',
    customerId: 'CUST-003',
    product: 'مولد گازسوز Cummins C400',
    quantity: 3,
    unitPrice: 680000000,
    totalAmount: 2040000000,
    status: 'completed',
    priority: 'low',
    createdAt: '1403/01/13',
    dueDate: '1403/02/05',
    notes: 'تحویل شده و فاکتور صادر شده'
  },
  {
    id: 'ORD-004',
    customer: 'مجتمع مسکونی الماس',
    customerId: 'CUST-004',
    product: 'موتور برق Honda EU30i',
    quantity: 5,
    unitPrice: 25000000,
    totalAmount: 125000000,
    status: 'cancelled',
    priority: 'low',
    createdAt: '1403/01/12',
    dueDate: '1403/01/25',
    notes: 'سفارش توسط مشتری لغو شد'
  }
];

const AdminOrders = () => {
  const [orders, setOrders] = useState(initialOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.product.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || order.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fa-IR').format(amount) + ' تومان';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">تکمیل شده</Badge>;
      case 'processing':
        return <Badge className="bg-blue-100 text-blue-800">در حال پردازش</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">در انتظار</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">لغو شده</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-100 text-red-800">بالا</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800">متوسط</Badge>;
      case 'low':
        return <Badge className="bg-green-100 text-green-800">پایین</Badge>;
      default:
        return <Badge variant="secondary">{priority}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'processing':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'pending':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'cancelled':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <Package className="w-4 h-4 text-gray-600" />;
    }
  };

  const handleStatusChange = (orderId: string, newStatus: string) => {
    setOrders(orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const getOrdersByStatus = (status: string) => {
    return orders.filter(order => order.status === status).length;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">مدیریت سفارشات</h1>
            <p className="text-gray-600">پیگیری و مدیریت سفارشات مشتریان</p>
          </div>
          <Button>
            <Package className="w-4 h-4 mr-2" />
            سفارش جدید
          </Button>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{getOrdersByStatus('pending')}</div>
              <div className="text-sm text-gray-600">در انتظار</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{getOrdersByStatus('processing')}</div>
              <div className="text-sm text-gray-600">در حال پردازش</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{getOrdersByStatus('completed')}</div>
              <div className="text-sm text-gray-600">تکمیل شده</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{getOrdersByStatus('cancelled')}</div>
              <div className="text-sm text-gray-600">لغو شده</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="جستجو در سفارشات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="وضعیت" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه وضعیت‌ها</SelectItem>
                  <SelectItem value="pending">در انتظار</SelectItem>
                  <SelectItem value="processing">در حال پردازش</SelectItem>
                  <SelectItem value="completed">تکمیل شده</SelectItem>
                  <SelectItem value="cancelled">لغو شده</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="اولویت" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه اولویت‌ها</SelectItem>
                  <SelectItem value="high">بالا</SelectItem>
                  <SelectItem value="medium">متوسط</SelectItem>
                  <SelectItem value="low">پایین</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>لیست سفارشات ({filteredOrders.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>شماره سفارش</TableHead>
                  <TableHead>مشتری</TableHead>
                  <TableHead>محصول</TableHead>
                  <TableHead>مقدار</TableHead>
                  <TableHead>قیمت واحد</TableHead>
                  <TableHead>مبلغ کل</TableHead>
                  <TableHead>وضعیت</TableHead>
                  <TableHead>اولویت</TableHead>
                  <TableHead>تاریخ ایجاد</TableHead>
                  <TableHead>عملیات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.customer}</div>
                        <div className="text-sm text-gray-500">{order.customerId}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate" title={order.product}>
                        {order.product}
                      </div>
                    </TableCell>
                    <TableCell>{order.quantity}</TableCell>
                    <TableCell>{formatCurrency(order.unitPrice)}</TableCell>
                    <TableCell className="font-medium">{formatCurrency(order.totalAmount)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(order.status)}
                        {getStatusBadge(order.status)}
                      </div>
                    </TableCell>
                    <TableCell>{getPriorityBadge(order.priority)}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{order.createdAt}</div>
                        <div className="text-gray-500">تا {order.dueDate}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Select onValueChange={(value) => handleStatusChange(order.id, value)}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">در انتظار</SelectItem>
                            <SelectItem value="processing">در حال پردازش</SelectItem>
                            <SelectItem value="completed">تکمیل شده</SelectItem>
                            <SelectItem value="cancelled">لغو شده</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Order Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">کل سفارشات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orders.length}</div>
              <div className="text-sm text-gray-500">سفارش ثبت شده</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">درآمد کل</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(orders.reduce((sum, order) => sum + order.totalAmount, 0))}
              </div>
              <div className="text-sm text-gray-500">از کل سفارشات</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">میانگین سفارش</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(Math.round(orders.reduce((sum, order) => sum + order.totalAmount, 0) / orders.length))}
              </div>
              <div className="text-sm text-gray-500">میانگین مبلغ سفارش</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;