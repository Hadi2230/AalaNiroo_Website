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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Search,
  Filter,
  Eye,
  Edit,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Plus,
  Star,
  TrendingUp,
  Users,
  Building2
} from 'lucide-react';

// Mock customers data
const initialCustomers = [
  {
    id: 'CUST-001',
    name: 'شرکت پتروشیمی تهران',
    contactPerson: 'مهندس احمد رضایی',
    phone: '021-88765432',
    email: 'info@petro-tehran.com',
    address: 'تهران، بزرگراه شهید همت، کیلومتر 15',
    type: 'company',
    status: 'active',
    totalOrders: 8,
    totalSpent: 6800000000,
    lastOrder: '1403/01/15',
    rating: 5,
    notes: 'مشتری VIP - پرداخت منظم',
    createdAt: '1402/06/15'
  },
  {
    id: 'CUST-002',
    name: 'بیمارستان امام رضا',
    contactPerson: 'دکتر مریم احمدی',
    phone: '021-66554433',
    email: 'admin@imamreza-hospital.com',
    address: 'مشهد، بلوار امام رضا، بیمارستان امام رضا',
    type: 'organization',
    status: 'active',
    totalOrders: 3,
    totalSpent: 950000000,
    lastOrder: '1403/01/14',
    rating: 4,
    notes: 'پروژه حساس - نیاز به پشتیبانی 24/7',
    createdAt: '1402/11/20'
  },
  {
    id: 'CUST-003',
    name: 'کارخانه سیمان اصفهان',
    contactPerson: 'مهندس علی محمدی',
    phone: '031-33445566',
    email: 'contact@isfahan-cement.com',
    address: 'اصفهان، شهرک صنعتی، شرکت سیمان اصفهان',
    type: 'company',
    status: 'inactive',
    totalOrders: 12,
    totalSpent: 8500000000,
    lastOrder: '1403/01/13',
    rating: 4,
    notes: 'مشتری قدیمی - تخفیف ویژه',
    createdAt: '1402/03/10'
  },
  {
    id: 'CUST-004',
    name: 'مجتمع مسکونی الماس',
    contactPerson: 'سارا کریمی',
    phone: '021-22334455',
    email: 'info@almas-complex.com',
    address: 'تهران، نیاوران، مجتمع مسکونی الماس',
    type: 'individual',
    status: 'active',
    totalOrders: 2,
    totalSpent: 180000000,
    lastOrder: '1403/01/12',
    rating: 5,
    notes: 'مشتری جدید - راضی از خدمات',
    createdAt: '1403/01/05'
  }
];

const AdminCustomers = () => {
  const [customers, setCustomers] = useState(initialCustomers);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    const matchesType = typeFilter === 'all' || customer.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fa-IR').format(amount) + ' تومان';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">فعال</Badge>;
      case 'inactive':
        return <Badge className="bg-red-100 text-red-800">غیرفعال</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">در انتظار تایید</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'company':
        return <Badge variant="outline">شرکت</Badge>;
      case 'organization':
        return <Badge variant="outline">سازمان</Badge>;
      case 'individual':
        return <Badge variant="outline">شخصی</Badge>;
      default:
        return <Badge variant="secondary">{type}</Badge>;
    }
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const getCustomersByStatus = (status: string) => {
    return customers.filter(customer => customer.status === status).length;
  };

  const getTotalRevenue = () => {
    return customers.reduce((sum, customer) => sum + customer.totalSpent, 0);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">مدیریت مشتریان</h1>
            <p className="text-gray-600">مدیریت اطلاعات و روابط با مشتریان</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                مشتری جدید
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>افزودن مشتری جدید</DialogTitle>
                <DialogDescription>
                  اطلاعات مشتری جدید را وارد کنید
                </DialogDescription>
              </DialogHeader>
              <CustomerForm onClose={() => setIsAddDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{customers.length}</div>
              <div className="text-sm text-gray-600">کل مشتریان</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{getCustomersByStatus('active')}</div>
              <div className="text-sm text-gray-600">مشتریان فعال</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{getCustomersByStatus('pending')}</div>
              <div className="text-sm text-gray-600">در انتظار تایید</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{formatCurrency(getTotalRevenue())}</div>
              <div className="text-sm text-gray-600">کل فروش</div>
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
                  placeholder="جستجو در مشتریان..."
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
                  <SelectItem value="active">فعال</SelectItem>
                  <SelectItem value="inactive">غیرفعال</SelectItem>
                  <SelectItem value="pending">در انتظار تایید</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="نوع مشتری" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه انواع</SelectItem>
                  <SelectItem value="company">شرکت</SelectItem>
                  <SelectItem value="organization">سازمان</SelectItem>
                  <SelectItem value="individual">شخصی</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Customers Table */}
        <Card>
          <CardHeader>
            <CardTitle>لیست مشتریان ({filteredCustomers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>مشتری</TableHead>
                  <TableHead>نوع</TableHead>
                  <TableHead>تماس</TableHead>
                  <TableHead>وضعیت</TableHead>
                  <TableHead>سفارشات</TableHead>
                  <TableHead>کل خرید</TableHead>
                  <TableHead>آخرین سفارش</TableHead>
                  <TableHead>امتیاز</TableHead>
                  <TableHead>عملیات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{customer.name}</div>
                        <div className="text-sm text-gray-500">{customer.contactPerson}</div>
                        <div className="text-xs text-gray-400">{customer.id}</div>
                      </div>
                    </TableCell>
                    <TableCell>{getTypeBadge(customer.type)}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-3 h-3" />
                          {customer.phone}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-3 h-3" />
                          {customer.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(customer.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <ShoppingCart className="w-4 h-4 text-blue-600" />
                        {customer.totalOrders}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(customer.totalSpent)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{customer.lastOrder}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {getRatingStars(customer.rating)}
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
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Customer Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>به تفکیک نوع مشتری</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { type: 'company', label: 'شرکت‌ها', count: customers.filter(c => c.type === 'company').length },
                  { type: 'organization', label: 'سازمان‌ها', count: customers.filter(c => c.type === 'organization').length },
                  { type: 'individual', label: 'اشخاص', count: customers.filter(c => c.type === 'individual').length }
                ].map((item) => (
                  <div key={item.type} className="flex justify-between items-center">
                    <span>{item.label}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(item.count / customers.length) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{item.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>مشتریان برتر</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {customers
                  .sort((a, b) => b.totalSpent - a.totalSpent)
                  .slice(0, 3)
                  .map((customer, index) => (
                    <div key={customer.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium">{customer.name}</div>
                          <div className="text-sm text-gray-500">{customer.totalOrders} سفارش</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{formatCurrency(customer.totalSpent)}</div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

// Customer Form Component
const CustomerForm = ({ onClose }: { onClose: () => void }) => {
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    type: 'company',
    status: 'active',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('New customer:', formData);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">نام مشتری</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contactPerson">نام تماس</Label>
          <Input
            id="contactPerson"
            value={formData.contactPerson}
            onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">شماره تماس</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">ایمیل</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">آدرس</Label>
        <Textarea
          id="address"
          value={formData.address}
          onChange={(e) => setFormData({...formData, address: e.target.value})}
          rows={2}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="type">نوع مشتری</Label>
          <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="company">شرکت</SelectItem>
              <SelectItem value="organization">سازمان</SelectItem>
              <SelectItem value="individual">شخصی</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">وضعیت</Label>
          <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">فعال</SelectItem>
              <SelectItem value="inactive">غیرفعال</SelectItem>
              <SelectItem value="pending">در انتظار تایید</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">یادداشت</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({...formData, notes: e.target.value})}
          rows={3}
          placeholder="یادداشت‌های مربوط به مشتری..."
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          لغو
        </Button>
        <Button type="submit">
          ذخیره مشتری
        </Button>
      </div>
    </form>
  );
};

export default AdminCustomers;