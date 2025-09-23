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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Filter,
  Package,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

// Mock products data
const initialProducts = [
  {
    id: 1,
    name: 'دیزل ژنراتور FG Wilson P500',
    category: 'diesel-generators',
    power: '500 کیلووات',
    price: 850000000,
    stock: 5,
    status: 'active',
    sold: 45,
    image: '/api/placeholder/100/100',
    description: 'ژنراتور دیزلی FG Wilson با قدرت 500 کیلووات'
  },
  {
    id: 2,
    name: 'مولد گازسوز Cummins C400',
    category: 'gas-generators',
    power: '400 کیلووات',
    price: 680000000,
    stock: 3,
    status: 'active',
    sold: 23,
    image: '/api/placeholder/100/100',
    description: 'مولد گازسوز Cummins با قدرت 400 کیلووات'
  },
  {
    id: 3,
    name: 'موتور برق Honda EU30i',
    category: 'portable-generators',
    power: '3 کیلووات',
    price: 25000000,
    stock: 15,
    status: 'active',
    sold: 67,
    image: '/api/placeholder/100/100',
    description: 'موتور برق قابل حمل Honda با قدرت 3 کیلووات'
  }
];

const AdminProducts = () => {
  const [products, setProducts] = useState(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
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
      case 'out-of-stock':
        return <Badge className="bg-yellow-100 text-yellow-800">ناموجود</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { icon: AlertTriangle, color: 'text-red-600', text: 'ناموجود' };
    if (stock <= 2) return { icon: AlertTriangle, color: 'text-yellow-600', text: 'کم موجودی' };
    return { icon: Package, color: 'text-green-600', text: 'موجود' };
  };

  const handleDeleteProduct = (productId: number) => {
    setProducts(products.filter(p => p.id !== productId));
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">مدیریت محصولات</h1>
            <p className="text-gray-600">مدیریت موجودی، قیمت و اطلاعات محصولات</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                افزودن محصول جدید
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>افزودن محصول جدید</DialogTitle>
                <DialogDescription>
                  اطلاعات محصول جدید را وارد کنید
                </DialogDescription>
              </DialogHeader>
              <ProductForm onClose={() => setIsAddDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="جستجو در محصولات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="دسته‌بندی" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه محصولات</SelectItem>
                  <SelectItem value="diesel-generators">دیزل ژنراتور</SelectItem>
                  <SelectItem value="gas-generators">مولد گازسوز</SelectItem>
                  <SelectItem value="portable-generators">موتور برق قابل حمل</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Products Table */}
        <Card>
          <CardHeader>
            <CardTitle>لیست محصولات ({filteredProducts.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>محصول</TableHead>
                  <TableHead>دسته‌بندی</TableHead>
                  <TableHead>قیمت</TableHead>
                  <TableHead>موجودی</TableHead>
                  <TableHead>وضعیت</TableHead>
                  <TableHead>فروش</TableHead>
                  <TableHead>عملیات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => {
                  const stockStatus = getStockStatus(product.stock);
                  const StockIcon = stockStatus.icon;

                  return (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-gray-500">{product.power}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {product.category === 'diesel-generators' ? 'دیزل ژنراتور' :
                           product.category === 'gas-generators' ? 'مولد گازسوز' :
                           'موتور برق قابل حمل'}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(product.price)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <StockIcon className={`w-4 h-4 ${stockStatus.color}`} />
                          <span className={stockStatus.color}>
                            {product.stock} عدد
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(product.status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4 text-green-600" />
                          {product.sold}
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
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">کل محصولات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products.length}</div>
              <div className="text-sm text-gray-500">محصول فعال</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">مجموع موجودی</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {products.reduce((sum, p) => sum + p.stock, 0)}
              </div>
              <div className="text-sm text-gray-500">عدد موجود در انبار</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">ارزش کل موجودی</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(products.reduce((sum, p) => sum + (p.price * p.stock), 0))}
              </div>
              <div className="text-sm text-gray-500">ارزش تقریبی انبار</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

// Product Form Component
const ProductForm = ({ onClose }: { onClose: () => void }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    power: '',
    price: '',
    stock: '',
    status: 'active',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('New product:', formData);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">نام محصول</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">دسته‌بندی</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
            <SelectTrigger>
              <SelectValue placeholder="انتخاب دسته‌بندی" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="diesel-generators">دیزل ژنراتور</SelectItem>
              <SelectItem value="gas-generators">مولد گازسوز</SelectItem>
              <SelectItem value="portable-generators">موتور برق قابل حمل</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="power">قدرت</Label>
          <Input
            id="power"
            value={formData.power}
            onChange={(e) => setFormData({...formData, power: e.target.value})}
            placeholder="مثال: 500 کیلووات"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="stock">موجودی</Label>
          <Input
            id="stock"
            type="number"
            value={formData.stock}
            onChange={(e) => setFormData({...formData, stock: e.target.value})}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">قیمت (تومان)</Label>
        <Input
          id="price"
          type="number"
          value={formData.price}
          onChange={(e) => setFormData({...formData, price: e.target.value})}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">توضیحات</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          لغو
        </Button>
        <Button type="submit">
          ذخیره محصول
        </Button>
      </div>
    </form>
  );
};

export default AdminProducts;