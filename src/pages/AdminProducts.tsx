import React, { useState, useRef, useCallback } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useProducts, Product, ProductImage, ProductSpecification, ProductFeature } from '@/contexts/ProductsContext';
import MediaPicker from '@/components/media/MediaPicker';
import { useMedia } from '@/contexts/MediaContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Filter,
  Package,
  TrendingUp,
  AlertTriangle,
  Image,
  Upload,
  Download,
  Copy,
  Star,
  Settings,
  BarChart3,
  Tag,
  Calendar,
  DollarSign,
  Package2,
  Boxes,
  ShoppingCart,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Clock,
  Users,
  FileText,
  ExternalLink,
  Maximize2,
  Minimize2,
  MoreVertical,
  Grid,
  List,
  SortAsc,
  SortDesc,
  RefreshCw,
  X,
  ImageIcon,
  Zap,
  Shield,
  Award,
  Target,
  Truck,
  Wrench,
  Info
} from 'lucide-react';

const AdminProducts = () => {
  const {
    products,
    categories,
    isLoading,
    error,
    searchTerm,
    filters,
    sortBy,
    sortOrder,
    selectedProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    duplicateProduct,
    addProductImage,
    removeProductImage,
    addSpecification,
    removeSpecification,
    addFeature,
    bulkUpdateStatus,
    bulkDelete,
    setSearchTerm,
    setFilter,
    setSorting,
    clearFilters,
    selectProduct,
    selectAllProducts,
    clearSelection,
    getProductStats,
    exportProducts,
    generateSKU,
    validateProduct
  } = useProducts();

  const { uploadFile, getFilesByFolder } = useMedia();
  const { user } = useAuth();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [showSpecDialog, setShowSpecDialog] = useState(false);
  const [showBulkDialog, setShowBulkDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState('basic');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    nameEn: '',
    category: '',
    brand: '',
    model: '',
    description: '',
    shortDescription: '',
    price: 0,
    stock: 0,
    minStock: 5,
    weight: 0,
    dimensions: { length: 0, width: 0, height: 0 },
    warranty: '',
    warrantyPeriod: 12,
    status: 'active',
    visibility: 'public',
    isFeatured: false,
    isNew: true,
    tags: [],
    applications: [],
    specifications: [],
    features: [],
    images: []
  });

  // helper to add selected media image to form
  const addFormImage = useCallback((fileUrl: string) => {
    setNewProduct(prev => ({
      ...prev,
      images: [
        ...(prev.images || []),
        { id: `img-${Date.now()}`, url: fileUrl, alt: prev.name || 'product image', isPrimary: (prev.images || []).length === 0, order: Date.now() }
      ]
    }));
  }, []);

  const [newSpec, setNewSpec] = useState<Omit<ProductSpecification, 'id'>>({
    name: '',
    value: '',
    unit: '',
    category: 'engine'
  });

  const [newFeature, setNewFeature] = useState<Omit<ProductFeature, 'id'>>({
    title: '',
    description: '',
    icon: 'CheckCircle'
  });

  const stats = getProductStats();

  // Handle product creation
  const handleCreateProduct = useCallback(async () => {
    const validation = validateProduct(newProduct);
    if (!validation.isValid) {
      toast.error('خطا در اعتبارسنجی', {
        description: validation.errors.join(', ')
      });
      return;
    }

    try {
      const product = await createProduct({
        ...newProduct,
        sku: generateSKU(newProduct),
        slug: newProduct.name?.toLowerCase().replace(/\s+/g, '-') || ''
      });
      
      setNewProduct({
        name: '',
        nameEn: '',
        category: '',
        brand: '',
        model: '',
        description: '',
        shortDescription: '',
        price: 0,
        stock: 0,
        minStock: 5,
        weight: 0,
        dimensions: { length: 0, width: 0, height: 0 },
        warranty: '',
        warrantyPeriod: 12,
        status: 'draft',
        visibility: 'public',
        isFeatured: false,
        isNew: true,
        tags: [],
        applications: [],
        specifications: [],
        features: [],
        images: []
      });
      
      setShowAddDialog(false);
      setActiveTab('basic');
    } catch (error) {
      console.error('Error creating product:', error);
    }
  }, [newProduct, createProduct, generateSKU, validateProduct]);

  // Handle image upload
  const handleImageUpload = useCallback(async (productId: string, file: File) => {
    try {
      const uploadedFile = await uploadFile(file, 'products', {
        description: `تصویر محصول ${products.find(p => p.id === productId)?.name}`,
        alt: file.name
      });

      await addProductImage(productId, uploadedFile.url, uploadedFile.alt || file.name, false);
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('خطا در آپلود تصویر');
    }
  }, [uploadFile, addProductImage, products]);

  // Handle bulk operations
  const handleBulkAction = useCallback(async (action: string) => {
    if (selectedProducts.length === 0) {
      toast.error('هیچ محصولی انتخاب نشده');
      return;
    }

    switch (action) {
      case 'activate':
        await bulkUpdateStatus(selectedProducts, 'active');
        break;
      case 'deactivate':
        await bulkUpdateStatus(selectedProducts, 'inactive');
        break;
      case 'delete':
        if (window.confirm(`آیا مطمئن هستید که می‌خواهید ${selectedProducts.length} محصول را حذف کنید؟`)) {
          await bulkDelete(selectedProducts);
        }
        break;
    }
    
    clearSelection();
    setShowBulkDialog(false);
  }, [selectedProducts, bulkUpdateStatus, bulkDelete, clearSelection]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fa-IR').format(amount) + ' تومان';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">فعال</Badge>;
      case 'inactive':
        return <Badge className="bg-red-100 text-red-800">غیرفعال</Badge>;
      case 'draft':
        return <Badge className="bg-yellow-100 text-yellow-800">پیش‌نویس</Badge>;
      case 'out-of-stock':
        return <Badge className="bg-gray-100 text-gray-800">ناموجود</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getStockStatus = (stock: number, minStock: number) => {
    if (stock === 0) return { icon: AlertTriangle, color: 'text-red-600', text: 'ناموجود', bgColor: 'bg-red-50' };
    if (stock <= minStock) return { icon: AlertCircle, color: 'text-yellow-600', text: 'کم موجودی', bgColor: 'bg-yellow-50' };
    return { icon: CheckCircle, color: 'text-green-600', text: 'موجود', bgColor: 'bg-green-50' };
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">مدیریت محصولات پیشرفته</h1>
                <p className="text-blue-100">مدیریت کامل محصولات، تصاویر و مشخصات فنی</p>
              </div>
              
              <div className="grid grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <div className="text-sm text-blue-100">کل محصولات</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.active}</div>
                  <div className="text-sm text-blue-100">فعال</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.lowStock}</div>
                  <div className="text-sm text-blue-100">کم موجودی</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{formatCurrency(stats.totalValue)}</div>
                  <div className="text-sm text-blue-100">ارزش کل</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Controls */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="جستجو در محصولات..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10"
                  />
                </div>

                <Select value={filters.category} onValueChange={(value) => setFilter('category', value)}>
                  <SelectTrigger className="w-48">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="دسته‌بندی" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">همه دسته‌ها</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filters.status} onValueChange={(value) => setFilter('status', value)}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="وضعیت" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">همه وضعیت‌ها</SelectItem>
                    <SelectItem value="active">فعال</SelectItem>
                    <SelectItem value="inactive">غیرفعال</SelectItem>
                    <SelectItem value="draft">پیش‌نویس</SelectItem>
                    <SelectItem value="out-of-stock">ناموجود</SelectItem>
                  </SelectContent>
                </Select>

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
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {selectedProducts.length > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => setShowBulkDialog(true)}
                    className="text-blue-600"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    عملیات انبوه ({selectedProducts.length})
                  </Button>
                )}

                <Button
                  onClick={() => exportProducts('json')}
                  variant="outline"
                >
                  <Download className="w-4 h-4 mr-2" />
                  خروجی
                </Button>

                <Button
                  onClick={() => setShowAddDialog(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  محصول جدید
                </Button>

                <Button
                  onClick={() => window.open('/products', '_blank')}
                  variant="outline"
                  className="text-green-600 hover:text-green-700"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  مشاهده سایت
                </Button>

                <Button
                  onClick={async () => {
                    try {
                      const testProduct = await createProduct({
                        name: `محصول تست ${Date.now()}`,
                        brand: 'تست',
                        category: 'diesel-generators',
                        price: 100000000,
                        stock: 5,
                        description: 'این یک محصول تست است',
                        status: 'active',
                        visibility: 'public'
                      });
                      toast.success('محصول تست ایجاد شد! صفحه محصولات را چک کنید');
                    } catch (error) {
                      toast.error('خطا در ایجاد محصول تست');
                    }
                  }}
                  variant="outline"
                  className="text-purple-600 hover:text-purple-700"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  تست سریع
                </Button>
              </div>
            </div>

            {/* Advanced Filters */}
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="in-stock"
                  checked={filters.inStock}
                  onCheckedChange={(checked) => setFilter('inStock', checked)}
                />
                <Label htmlFor="in-stock" className="text-sm">فقط موجود</Label>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="featured"
                  checked={filters.featured}
                  onCheckedChange={(checked) => setFilter('featured', checked)}
                />
                <Label htmlFor="featured" className="text-sm">ویژه</Label>
              </div>

              <Select value={sortBy} onValueChange={(value: any) => setSorting(value, sortOrder)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">نام</SelectItem>
                  <SelectItem value="price">قیمت</SelectItem>
                  <SelectItem value="stock">موجودی</SelectItem>
                  <SelectItem value="created">تاریخ ایجاد</SelectItem>
                  <SelectItem value="updated">آخرین ویرایش</SelectItem>
                  <SelectItem value="views">بازدید</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setSorting(sortBy, sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
              </Button>

              <Button
                variant="outline"
                onClick={clearFilters}
                className="text-red-600"
              >
                <X className="w-4 h-4 mr-2" />
                پاک کردن فیلترها
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Products Display */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-3">
                <Package className="w-6 h-6 text-blue-600" />
                محصولات ({products.length})
              </CardTitle>
              
              {selectedProducts.length > 0 && (
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-blue-50 text-blue-600">
                    {selectedProducts.length} انتخاب شده
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearSelection}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          
          <CardContent>
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <span className="text-red-800 dark:text-red-300">{error}</span>
                </div>
              </div>
            )}

            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => {
                  const stockStatus = getStockStatus(product.stock, product.minStock);
                  const StockIcon = stockStatus.icon;
                  const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];

                  return (
                    <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                      <div className="relative">
                        {/* Product Image */}
                        <div className="aspect-square bg-gray-100 dark:bg-gray-700 relative overflow-hidden">
                          {primaryImage ? (
                            <img
                              src={primaryImage.url}
                              alt={primaryImage.alt}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageIcon className="w-16 h-16 text-gray-400" />
                            </div>
                          )}
                          
                          {/* Overlay Actions */}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => {
                                  setEditingProduct(product);
                                  setShowEditDialog(true);
                                }}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => duplicateProduct(product.id)}
                              >
                                <Copy className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => deleteProduct(product.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>

                          {/* Badges */}
                          <div className="absolute top-2 right-2 flex flex-col gap-1">
                            {product.isFeatured && (
                              <Badge className="bg-yellow-500 text-white text-xs">
                                <Star className="w-3 h-3 mr-1" />
                                ویژه
                              </Badge>
                            )}
                            {product.isNew && (
                              <Badge className="bg-green-500 text-white text-xs">جدید</Badge>
                            )}
                            {product.isOnSale && (
                              <Badge className="bg-red-500 text-white text-xs">تخفیف</Badge>
                            )}
                          </div>

                          {/* Selection Checkbox */}
                          <div className="absolute top-2 left-2">
                            <Checkbox
                              checked={selectedProducts.includes(product.id)}
                              onCheckedChange={() => selectProduct(product.id)}
                              className="bg-white/80"
                            />
                          </div>

                          {/* Stock Status */}
                          <div className={`absolute bottom-2 right-2 ${stockStatus.bgColor} px-2 py-1 rounded-lg`}>
                            <div className="flex items-center gap-1">
                              <StockIcon className={`w-3 h-3 ${stockStatus.color}`} />
                              <span className={`text-xs ${stockStatus.color}`}>
                                {product.stock}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Product Info */}
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div>
                              <h3 className="font-bold text-lg line-clamp-2" title={product.name}>
                                {product.name}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {product.brand} {product.model}
                              </p>
                            </div>

                            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                              {product.shortDescription || product.description}
                            </p>

                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-xl font-bold text-blue-600">
                                  {formatCurrency(product.price)}
                                </div>
                                {product.originalPrice && product.originalPrice > product.price && (
                                  <div className="text-sm text-gray-500 line-through">
                                    {formatCurrency(product.originalPrice)}
                                  </div>
                                )}
                              </div>
                              {getStatusBadge(product.status)}
                            </div>

                            <div className="flex items-center justify-between text-sm text-gray-500">
                              <span>SKU: {product.sku}</span>
                              <span>{product.analytics.views} بازدید</span>
                            </div>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-1">
                              {product.tags.slice(0, 3).map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {product.tags.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{product.tags.length - 3}
                                </Badge>
                              )}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 pt-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setEditingProduct(product);
                                  setShowEditDialog(true);
                                }}
                                className="flex-1"
                              >
                                <Edit className="w-3 h-3 mr-1" />
                                ویرایش
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setEditingProduct(product);
                                  setShowImageDialog(true);
                                }}
                              >
                                <ImageIcon className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => window.open(`/products/${product.slug}`, '_blank')}
                              >
                                <ExternalLink className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectedProducts.length === products.length && products.length > 0}
                          onCheckedChange={selectedProducts.length === products.length ? clearSelection : selectAllProducts}
                        />
                      </TableHead>
                      <TableHead>محصول</TableHead>
                      <TableHead>دسته‌بندی</TableHead>
                      <TableHead>قیمت</TableHead>
                      <TableHead>موجودی</TableHead>
                      <TableHead>وضعیت</TableHead>
                      <TableHead>بازدید</TableHead>
                      <TableHead>عملیات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => {
                      const stockStatus = getStockStatus(product.stock, product.minStock);
                      const StockIcon = stockStatus.icon;
                      const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];

                      return (
                        <TableRow key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                          <TableCell>
                            <Checkbox
                              checked={selectedProducts.includes(product.id)}
                              onCheckedChange={() => selectProduct(product.id)}
                            />
                          </TableCell>
                          
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="w-12 h-12">
                                <AvatarImage src={primaryImage?.url} alt={product.name} />
                                <AvatarFallback>
                                  <Package className="w-6 h-6" />
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium line-clamp-1">{product.name}</div>
                                <div className="text-sm text-gray-500">{product.brand} {product.model}</div>
                                <div className="text-xs text-gray-400">SKU: {product.sku}</div>
                              </div>
                            </div>
                          </TableCell>
                          
                          <TableCell>
                            <Badge variant="outline">
                              {categories.find(c => c.id === product.category)?.name || product.category}
                            </Badge>
                          </TableCell>
                          
                          <TableCell>
                            <div>
                              <div className="font-medium">{formatCurrency(product.price)}</div>
                              {product.originalPrice && product.originalPrice > product.price && (
                                <div className="text-sm text-gray-500 line-through">
                                  {formatCurrency(product.originalPrice)}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <StockIcon className={`w-4 h-4 ${stockStatus.color}`} />
                              <span className={`font-medium ${stockStatus.color}`}>
                                {product.stock}
                              </span>
                              {product.stock <= product.minStock && product.stock > 0 && (
                                <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-600">
                                  کم موجودی
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          
                          <TableCell>
                            {getStatusBadge(product.status)}
                          </TableCell>
                          
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Eye className="w-4 h-4 text-blue-600" />
                              {product.analytics.views}
                            </div>
                          </TableCell>
                          
                          <TableCell>
                            <div className="flex gap-1">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => {
                                  setEditingProduct(product);
                                  setShowEditDialog(true);
                                }}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => {
                                  setEditingProduct(product);
                                  setShowImageDialog(true);
                                }}
                              >
                                <ImageIcon className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => duplicateProduct(product.id)}
                              >
                                <Copy className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => deleteProduct(product.id)}
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
              </div>
            )}

            {products.length === 0 && (
              <div className="text-center py-12">
                <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                  محصولی یافت نشد
                </h3>
                <p className="text-gray-500 dark:text-gray-500 mb-6">
                  {searchTerm || Object.values(filters).some(f => f !== 'all' && f !== false && f !== 0)
                    ? 'نتیجه‌ای برای فیلترهای انتخاب شده یافت نشد'
                    : 'هنوز محصولی اضافه نشده است'
                  }
                </p>
                <Button
                  onClick={() => setShowAddDialog(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  اولین محصول را اضافه کنید
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add Product Dialog */}
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                افزودن محصول جدید
              </DialogTitle>
              <DialogDescription>
                اطلاعات کامل محصول جدید را وارد کنید
              </DialogDescription>
            </DialogHeader>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="basic">اطلاعات پایه</TabsTrigger>
                <TabsTrigger value="details">جزئیات</TabsTrigger>
                <TabsTrigger value="specs">مشخصات</TabsTrigger>
                <TabsTrigger value="seo">SEO</TabsTrigger>
                <TabsTrigger value="images">تصاویر</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-6 mt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>نام محصول *</Label>
                    <Input
                      value={newProduct.name || ''}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="دیزل ژنراتور FG Wilson P500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>نام انگلیسی</Label>
                    <Input
                      value={newProduct.nameEn || ''}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, nameEn: e.target.value }))}
                      placeholder="FG Wilson P500 Diesel Generator"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>دسته‌بندی *</Label>
                    <Select value={newProduct.category || ''} onValueChange={(value) => setNewProduct(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="انتخاب دسته‌بندی" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>برند *</Label>
                    <Input
                      value={newProduct.brand || ''}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, brand: e.target.value }))}
                      placeholder="FG Wilson"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>مدل</Label>
                    <Input
                      value={newProduct.model || ''}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, model: e.target.value }))}
                      placeholder="P500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>توضیحات کوتاه</Label>
                  <Input
                    value={newProduct.shortDescription || ''}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, shortDescription: e.target.value }))}
                    placeholder="توضیح کوتاه محصول..."
                  />
                </div>

                <div className="space-y-2">
                  <Label>توضیحات کامل</Label>
                  <Textarea
                    value={newProduct.description || ''}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    placeholder="توضیحات کامل محصول..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>قیمت (تومان) *</Label>
                    <Input
                      type="number"
                      value={newProduct.price || ''}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, price: parseInt(e.target.value) || 0 }))}
                      placeholder="850000000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>موجودی *</Label>
                    <Input
                      type="number"
                      value={newProduct.stock || ''}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
                      placeholder="5"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="details" className="space-y-6 mt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>وزن (کیلوگرم)</Label>
                    <Input
                      type="number"
                      value={newProduct.weight || ''}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, weight: parseInt(e.target.value) || 0 }))}
                      placeholder="3500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>حداقل موجودی</Label>
                    <Input
                      type="number"
                      value={newProduct.minStock || ''}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, minStock: parseInt(e.target.value) || 5 }))}
                      placeholder="5"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>ابعاد (سانتی‌متر)</Label>
                  <div className="grid grid-cols-3 gap-4">
                    <Input
                      type="number"
                      value={newProduct.dimensions?.length || ''}
                      onChange={(e) => setNewProduct(prev => ({ 
                        ...prev, 
                        dimensions: { 
                          ...prev.dimensions!, 
                          length: parseInt(e.target.value) || 0 
                        } 
                      }))}
                      placeholder="طول"
                    />
                    <Input
                      type="number"
                      value={newProduct.dimensions?.width || ''}
                      onChange={(e) => setNewProduct(prev => ({ 
                        ...prev, 
                        dimensions: { 
                          ...prev.dimensions!, 
                          width: parseInt(e.target.value) || 0 
                        } 
                      }))}
                      placeholder="عرض"
                    />
                    <Input
                      type="number"
                      value={newProduct.dimensions?.height || ''}
                      onChange={(e) => setNewProduct(prev => ({ 
                        ...prev, 
                        dimensions: { 
                          ...prev.dimensions!, 
                          height: parseInt(e.target.value) || 0 
                        } 
                      }))}
                      placeholder="ارتفاع"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>گارانتی</Label>
                  <Input
                    value={newProduct.warranty || ''}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, warranty: e.target.value }))}
                    placeholder="2 سال یا 2000 ساعت کار"
                  />
                </div>

                <div className="space-y-2">
                  <Label>کاربردها (جدا شده با کاما)</Label>
                  <Input
                    value={(newProduct.applications || []).join(', ')}
                    onChange={(e) => setNewProduct(prev => ({ 
                      ...prev, 
                      applications: e.target.value.split(',').map(app => app.trim()).filter(Boolean)
                    }))}
                    placeholder="صنعتی, بیمارستانی, مخابراتی"
                  />
                </div>

                <div className="space-y-2">
                  <Label>تگ‌ها (جدا شده با کاما)</Label>
                  <Input
                    value={(newProduct.tags || []).join(', ')}
                    onChange={(e) => setNewProduct(prev => ({ 
                      ...prev, 
                      tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                    }))}
                    placeholder="FG Wilson, دیزل, صنعتی"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="featured"
                      checked={newProduct.isFeatured || false}
                      onCheckedChange={(checked) => setNewProduct(prev => ({ ...prev, isFeatured: checked }))}
                    />
                    <Label htmlFor="featured">محصول ویژه</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="new"
                      checked={newProduct.isNew || false}
                      onCheckedChange={(checked) => setNewProduct(prev => ({ ...prev, isNew: checked }))}
                    />
                    <Label htmlFor="new">محصول جدید</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="sale"
                      checked={newProduct.isOnSale || false}
                      onCheckedChange={(checked) => setNewProduct(prev => ({ ...prev, isOnSale: checked }))}
                    />
                    <Label htmlFor="sale">تخفیف دار</Label>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="images" className="space-y-6 mt-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">تصاویر محصول</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setShowMediaPicker(true)}>انتخاب از رسانه‌ها</Button>
                    <Button variant="outline" onClick={() => fileInputRef.current?.click()}>آپلود از سیستم</Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {(newProduct.images || []).map((img) => (
                    <div key={img.id} className="relative group">
                      <img src={img.url} alt={img.alt} className="w-full h-40 object-cover rounded" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button size="sm" variant="secondary" onClick={() => setNewProduct(prev => ({ ...prev, images: (prev.images || []).map(i => ({ ...i, isPrimary: i.id === img.id })) }))}>
                          کاور
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => setNewProduct(prev => ({ ...prev, images: (prev.images || []).filter(i => i.id !== img.id) }))}>
                          حذف
                        </Button>
                      </div>
                      {img.isPrimary && (
                        <Badge className="absolute top-2 right-2 bg-green-600">کاور</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="specs" className="space-y-6 mt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">مشخصات فنی</h3>
                    <Button
                      onClick={() => setShowSpecDialog(true)}
                      size="sm"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      اضافه کردن مشخصه
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {(newProduct.specifications || []).map((spec, index) => (
                      <div key={spec.id} className="flex items-center gap-4 p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="flex-1">
                          <span className="font-medium">{spec.name}:</span>
                          <span className="ml-2">{spec.value} {spec.unit}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {spec.category}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setNewProduct(prev => ({
                              ...prev,
                              specifications: prev.specifications?.filter(s => s.id !== spec.id) || []
                            }));
                          }}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">ویژگی‌ها</h3>
                    <Button
                      onClick={() => {
                        const newFeatureData: ProductFeature = {
                          id: `feat-${Date.now()}`,
                          title: 'ویژگی جدید',
                          description: 'توضیحات ویژگی',
                          icon: 'CheckCircle'
                        };
                        setNewProduct(prev => ({
                          ...prev,
                          features: [...(prev.features || []), newFeatureData]
                        }));
                      }}
                      size="sm"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      اضافه کردن ویژگی
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {(newProduct.features || []).map((feature, index) => (
                      <div key={feature.id} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium">{feature.title}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{feature.description}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setNewProduct(prev => ({
                                ...prev,
                                features: prev.features?.filter(f => f.id !== feature.id) || []
                              }));
                            }}
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="seo" className="space-y-6 mt-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>عنوان SEO</Label>
                    <Input
                      value={newProduct.metaTitle || ''}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, metaTitle: e.target.value }))}
                      placeholder="دیزل ژنراتور FG Wilson P500 - 500 کیلووات"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>توضیحات SEO</Label>
                    <Textarea
                      value={newProduct.metaDescription || ''}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, metaDescription: e.target.value }))}
                      rows={3}
                      placeholder="توضیحات محصول برای موتورهای جستجو..."
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-between items-center pt-6 border-t">
              <div className="text-sm text-gray-500">
                SKU خودکار: {generateSKU(newProduct)}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                  انصراف
                </Button>
                <Button 
                  onClick={handleCreateProduct}
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      در حال ایجاد...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      ایجاد محصول
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Media Picker for Images */}
        <MediaPicker
          open={showMediaPicker}
          onOpenChange={setShowMediaPicker}
          onSelect={(file) => addFormImage(file.url)}
          accept={[ 'image' ]}
        />

        {/* Bulk Operations Dialog */}
        <Dialog open={showBulkDialog} onOpenChange={setShowBulkDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>عملیات انبوه</DialogTitle>
              <DialogDescription>
                عملیات مورد نظر برای {selectedProducts.length} محصول انتخاب شده را انتخاب کنید
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Button
                onClick={() => handleBulkAction('activate')}
                variant="outline"
                className="w-full justify-start"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                فعال کردن همه
              </Button>
              <Button
                onClick={() => handleBulkAction('deactivate')}
                variant="outline"
                className="w-full justify-start"
              >
                <X className="w-4 h-4 mr-2" />
                غیرفعال کردن همه
              </Button>
              <Button
                onClick={() => handleBulkAction('delete')}
                variant="outline"
                className="w-full justify-start text-red-600"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                حذف همه
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => {
            if (e.target.files && editingProduct) {
              Array.from(e.target.files).forEach(file => {
                handleImageUpload(editingProduct.id, file);
              });
            }
            if (e.target.files && showAddDialog) {
              Array.from(e.target.files).forEach(async (file) => {
                try {
                  const uploaded = await uploadFile(file, 'products', { alt: file.name });
                  addFormImage(uploaded.url);
                } catch {}
              });
            }
          }}
          className="hidden"
        />
      </div>
    </AdminLayout>
  );
};

export default AdminProducts;