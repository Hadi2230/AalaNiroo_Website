import React, { useState, useEffect } from 'react';
import ModernHeader from '@/components/layout/ModernHeader';
import Footer from '@/components/layout/Footer';
import ChatWidget from '@/components/layout/ChatWidget';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useProducts } from '@/contexts/ProductsContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Star, 
  Eye, 
  Download, 
  Share2, 
  Heart,
  ShoppingCart,
  Package,
  Zap,
  Award,
  Shield,
  CheckCircle,
  ArrowRight,
  Phone,
  Mail,
  FileText,
  Image,
  TrendingUp,
  Target,
  Users,
  Calendar,
  MapPin,
  ExternalLink,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  Info,
  Settings,
  RefreshCw
} from 'lucide-react';

export default function Products() {
  const {
    products,
    categories,
    searchTerm,
    filters,
    setSearchTerm,
    setFilter,
    getProductStats
  } = useProducts();

  const { language, t } = useLanguage();
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Debug: Log products to see what we have
  useEffect(() => {
    console.log('🔍 Products in /products page:', products);
    console.log('📊 Total products:', products.length);
    console.log('🔍 Public products:', products.filter(p => p.status === 'active' && p.visibility === 'public'));
    console.log('💾 localStorage products:', localStorage.getItem('products'));
  }, [products]);

  // Force refresh products from localStorage
  const forceRefresh = React.useCallback(() => {
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
      try {
        const parsedProducts = JSON.parse(savedProducts);
        console.log('🔄 Force refreshing products:', parsedProducts.length);
        window.dispatchEvent(new CustomEvent('productsUpdated', {
          detail: parsedProducts
        }));
        toast.success('محصولات به‌روزرسانی شدند');
      } catch (error) {
        console.error('Error force refreshing:', error);
        toast.error('خطا در به‌روزرسانی');
      }
    }
  }, []);

  // Filter only active and public products for frontend
  const publicProducts = products.filter(product => 
    product.status === 'active' && 
    product.visibility === 'public'
  );

  const stats = getProductStats();

  const handleProductClick = (product: any) => {
    setSelectedProduct(product);
    setSelectedImageIndex(0);
    setShowProductModal(true);
  };

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fa-IR').format(amount) + ' تومان';
  };

  const nextImage = () => {
    if (selectedProduct && selectedImageIndex < selectedProduct.images.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1);
    }
  };

  const prevImage = () => {
    if (selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  return (
    <div className="min-h-screen">
      <ModernHeader />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="bg-blue-100 text-blue-800 mb-6">
              <Package className="w-4 h-4 mr-2" />
              {language === 'fa' ? 'محصولات ما' : 'Our Products'}
            </Badge>
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              {language === 'fa' ? 'محصولات و راهکارهای انرژی' : 'Energy Products & Solutions'}
            </h1>
            <p className="text-xl lg:text-2xl text-gray-300 leading-relaxed mb-8">
              {language === 'fa' 
                ? 'مجموعه کاملی از ژنراتورها و تجهیزات برق با بالاترین کیفیت'
                : 'Complete range of generators and power equipment with highest quality'
              }
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">{stats.total}</div>
                <div className="text-gray-300">{language === 'fa' ? 'محصول' : 'Products'}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">{stats.active}</div>
                <div className="text-gray-300">{language === 'fa' ? 'فعال' : 'Active'}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-2">{stats.featured}</div>
                <div className="text-gray-300">{language === 'fa' ? 'ویژه' : 'Featured'}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">4</div>
                <div className="text-gray-300">{language === 'fa' ? 'دسته‌بندی' : 'Categories'}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-8 bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder={language === 'fa' ? 'جستجو در محصولات...' : 'Search products...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-12 h-12 text-lg"
              />
            </div>

            {/* Category Filter */}
            <Select value={filters.category} onValueChange={(value) => setFilter('category', value)}>
              <SelectTrigger className="w-64 h-12">
                <Filter className="w-5 h-5 mr-2" />
                <SelectValue placeholder={language === 'fa' ? 'انتخاب دسته‌بندی' : 'Select Category'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{language === 'fa' ? 'همه محصولات' : 'All Products'}</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {language === 'fa' ? category.name : category.nameEn}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* View Mode */}
            <div className="flex items-center gap-2">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <Button
                  size="sm"
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  onClick={() => setViewMode('grid')}
                  className="px-4"
                >
                  <Grid className="w-4 h-4 mr-2" />
                  {language === 'fa' ? 'شبکه' : 'Grid'}
                </Button>
                <Button
                  size="sm"
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  onClick={() => setViewMode('list')}
                  className="px-4"
                >
                  <List className="w-4 h-4 mr-2" />
                  {language === 'fa' ? 'لیست' : 'List'}
                </Button>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={forceRefresh}
                className="text-blue-600 hover:text-blue-700"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                به‌روزرسانی
              </Button>
            </div>
          </div>

          {/* Active Filters */}
          {(searchTerm || filters.category !== 'all') && (
            <div className="flex items-center gap-2 mt-4">
              <span className="text-sm text-gray-600">{language === 'fa' ? 'فیلترهای فعال:' : 'Active filters:'}</span>
              {searchTerm && (
                <Badge variant="outline" className="flex items-center gap-1">
                  {language === 'fa' ? 'جستجو:' : 'Search:'} {searchTerm}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-4 h-4 p-0 hover:bg-red-100"
                    onClick={() => setSearchTerm('')}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </Badge>
              )}
              {filters.category !== 'all' && (
                <Badge variant="outline" className="flex items-center gap-1">
                  {language === 'fa' ? 'دسته:' : 'Category:'} {categories.find(c => c.id === filters.category)?.name}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-4 h-4 p-0 hover:bg-red-100"
                    onClick={() => setFilter('category', 'all')}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </Badge>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          {publicProducts.length > 0 ? (
            <>
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {publicProducts.map((product) => {
                    const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];
                    const isFavorite = favorites.includes(product.id);

                    return (
                      <Card key={product.id} className="group hover:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-2 bg-white">
                        <div className="relative">
                          {/* Product Image */}
                          <div className="aspect-square bg-gray-100 relative overflow-hidden">
                            {primaryImage ? (
                              <img
                                src={primaryImage.url}
                                alt={primaryImage.alt}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-16 h-16 text-gray-400" />
                              </div>
                            )}
                            
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                              <div className="flex gap-3">
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={() => handleProductClick(product)}
                                  className="backdrop-blur-sm"
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  مشاهده
                                </Button>
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={() => toggleFavorite(product.id)}
                                  className="backdrop-blur-sm"
                                >
                                  <Heart className={`w-4 h-4 ${isFavorite ? 'text-red-500 fill-red-500' : ''}`} />
                                </Button>
                              </div>
                            </div>

                            {/* Badges */}
                            <div className="absolute top-3 right-3 flex flex-col gap-1">
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

                            {/* Favorite Heart */}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="absolute top-3 left-3 w-8 h-8 bg-white/80 hover:bg-white"
                              onClick={() => toggleFavorite(product.id)}
                            >
                              <Heart className={`w-4 h-4 ${isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-600'}`} />
                            </Button>
                          </div>

                          {/* Product Info */}
                          <CardContent className="p-6">
                            <div className="space-y-4">
                              {/* Brand & Category */}
                              <div className="flex items-center justify-between">
                                <Badge variant="outline" className="text-xs">
                                  {categories.find(c => c.id === product.category)?.name || product.category}
                                </Badge>
                                <span className="text-sm text-gray-500">{product.brand}</span>
                              </div>

                              {/* Product Name */}
                              <div>
                                <h3 className="font-bold text-xl line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
                                  {product.name}
                                </h3>
                                <p className="text-sm text-gray-600 line-clamp-2">
                                  {product.shortDescription || product.description}
                                </p>
                              </div>

                              {/* Key Specs */}
                              {product.specifications.length > 0 && (
                                <div className="space-y-2">
                                  {product.specifications.slice(0, 3).map((spec) => (
                                    <div key={spec.id} className="flex justify-between text-sm">
                                      <span className="text-gray-600">{spec.name}:</span>
                                      <span className="font-medium">{spec.value} {spec.unit}</span>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Price */}
                              <div className="pt-4 border-t border-gray-100">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <div className="text-2xl font-bold text-blue-600">
                                      {formatCurrency(product.price)}
                                    </div>
                                    {product.originalPrice && product.originalPrice > product.price && (
                                      <div className="text-sm text-gray-500 line-through">
                                        {formatCurrency(product.originalPrice)}
                                      </div>
                                    )}
                                  </div>
                                  <div className="text-right">
                                    <div className="text-sm text-gray-500">موجودی</div>
                                    <div className={`font-medium ${
                                      product.stock > product.minStock ? 'text-green-600' : 
                                      product.stock > 0 ? 'text-yellow-600' : 'text-red-600'
                                    }`}>
                                      {product.stock > 0 ? `${product.stock} عدد` : 'ناموجود'}
                                    </div>
                                  </div>
                                </div>
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
                              <div className="flex gap-2 pt-4">
                                <Button
                                  onClick={() => handleProductClick(product)}
                                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  مشاهده جزئیات
                                </Button>
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    // Contact for quote
                                    window.open(`tel:021-58635`, '_self');
                                  }}
                                >
                                  <Phone className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    navigator.clipboard.writeText(window.location.origin + `/products/${product.slug}`);
                                    toast.success('لینک محصول کپی شد');
                                  }}
                                >
                                  <Share2 className="w-4 h-4" />
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
                <div className="space-y-4">
                  {publicProducts.map((product) => {
                    const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];
                    const isFavorite = favorites.includes(product.id);

                    return (
                      <Card key={product.id} className="hover:shadow-xl transition-all duration-300 bg-white">
                        <CardContent className="p-6">
                          <div className="flex gap-6">
                            {/* Image */}
                            <div className="w-48 h-48 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                              {primaryImage ? (
                                <img
                                  src={primaryImage.url}
                                  alt={primaryImage.alt}
                                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Package className="w-12 h-12 text-gray-400" />
                                </div>
                              )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 space-y-4">
                              <div className="flex items-start justify-between">
                                <div>
                                  <div className="flex items-center gap-2 mb-2">
                                    <Badge variant="outline">
                                      {categories.find(c => c.id === product.category)?.name}
                                    </Badge>
                                    <span className="text-sm text-gray-500">{product.brand}</span>
                                  </div>
                                  <h3 className="text-2xl font-bold mb-2 hover:text-blue-600 transition-colors">
                                    {product.name}
                                  </h3>
                                  <p className="text-gray-600 line-clamp-2">
                                    {product.description}
                                  </p>
                                </div>
                                
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => toggleFavorite(product.id)}
                                >
                                  <Heart className={`w-5 h-5 ${isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} />
                                </Button>
                              </div>

                              {/* Specifications */}
                              {product.specifications.length > 0 && (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                  {product.specifications.slice(0, 6).map((spec) => (
                                    <div key={spec.id} className="text-sm">
                                      <span className="text-gray-500">{spec.name}:</span>
                                      <span className="font-medium ml-2">{spec.value} {spec.unit}</span>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Features */}
                              {product.features.length > 0 && (
                                <div className="space-y-2">
                                  <h4 className="font-semibold text-sm">ویژگی‌های کلیدی:</h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {product.features.slice(0, 4).map((feature) => (
                                      <div key={feature.id} className="flex items-center gap-2 text-sm">
                                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                                        <span>{feature.title}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Price and Actions */}
                              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                <div>
                                  <div className="text-3xl font-bold text-blue-600">
                                    {formatCurrency(product.price)}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    موجودی: {product.stock > 0 ? `${product.stock} عدد` : 'ناموجود'}
                                  </div>
                                </div>
                                
                                <div className="flex gap-2">
                                  <Button
                                    onClick={() => handleProductClick(product)}
                                    className="bg-blue-600 hover:bg-blue-700"
                                  >
                                    <Eye className="w-4 h-4 mr-2" />
                                    مشاهده کامل
                                  </Button>
                                  <Button variant="outline">
                                    <Phone className="w-4 h-4 mr-2" />
                                    درخواست قیمت
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <Package className="w-20 h-20 mx-auto mb-6 text-gray-400" />
              <h3 className="text-2xl font-bold text-gray-600 mb-4">
                {language === 'fa' ? 'محصولی یافت نشد' : 'No products found'}
              </h3>
              <p className="text-gray-500 mb-8">
                {searchTerm || filters.category !== 'all'
                  ? (language === 'fa' ? 'نتیجه‌ای برای فیلترهای انتخاب شده یافت نشد' : 'No results found for selected filters')
                  : (language === 'fa' ? 'هنوز محصولی در این دسته‌بندی موجود نیست' : 'No products available in this category yet')
                }
              </p>
              <Button
                onClick={() => {
                  setSearchTerm('');
                  setFilter('category', 'all');
                }}
                variant="outline"
              >
                <Filter className="w-4 h-4 mr-2" />
                {language === 'fa' ? 'پاک کردن فیلترها' : 'Clear Filters'}
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            {language === 'fa' ? 'محصول مورد نظرتان را پیدا نکردید؟' : "Didn't find what you're looking for?"}
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            {language === 'fa' 
              ? 'با کارشناسان ما تماس بگیرید تا بهترین راه‌حل انرژی را برای شما پیدا کنیم'
              : 'Contact our experts to find the best energy solution for your needs'
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <Phone className="w-5 h-5 mr-2" />
              021-58635
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              <Mail className="w-5 h-5 mr-2" />
              info@aalaniroo.com
            </Button>
          </div>
        </div>
      </section>

      {/* Product Detail Modal */}
      <Dialog open={showProductModal} onOpenChange={setShowProductModal}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-auto">
          {selectedProduct && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                  <Package className="w-6 h-6" />
                  {selectedProduct.name}
                </DialogTitle>
                <DialogDescription>
                  {selectedProduct.brand} {selectedProduct.model}
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Images */}
                <div className="space-y-4">
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative">
                    {selectedProduct.images.length > 0 ? (
                      <>
                        <img
                          src={selectedProduct.images[selectedImageIndex]?.url}
                          alt={selectedProduct.images[selectedImageIndex]?.alt}
                          className="w-full h-full object-cover"
                        />
                        
                        {selectedProduct.images.length > 1 && (
                          <>
                            <Button
                              variant="secondary"
                              size="icon"
                              className="absolute left-2 top-1/2 transform -translate-y-1/2"
                              onClick={prevImage}
                              disabled={selectedImageIndex === 0}
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="secondary"
                              size="icon"
                              className="absolute right-2 top-1/2 transform -translate-y-1/2"
                              onClick={nextImage}
                              disabled={selectedImageIndex === selectedProduct.images.length - 1}
                            >
                              <ChevronRight className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-20 h-20 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Thumbnail Strip */}
                  {selectedProduct.images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto">
                      {selectedProduct.images.map((image, index) => (
                        <button
                          key={image.id}
                          onClick={() => setSelectedImageIndex(index)}
                          className={`w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 ${
                            index === selectedImageIndex ? 'border-blue-500' : 'border-gray-300'
                          }`}
                        >
                          <img
                            src={image.url}
                            alt={image.alt}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="space-y-6">
                  {/* Basic Info */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="outline">
                        {categories.find(c => c.id === selectedProduct.category)?.name}
                      </Badge>
                      <Badge className="bg-blue-100 text-blue-800">
                        {selectedProduct.brand}
                      </Badge>
                    </div>
                    
                    <p className="text-gray-600 leading-relaxed mb-6">
                      {selectedProduct.description}
                    </p>

                    {/* Price */}
                    <div className="bg-blue-50 p-6 rounded-lg">
                      <div className="text-3xl font-bold text-blue-600 mb-2">
                        {formatCurrency(selectedProduct.price)}
                      </div>
                      {selectedProduct.originalPrice && selectedProduct.originalPrice > selectedProduct.price && (
                        <div className="text-lg text-gray-500 line-through mb-2">
                          {formatCurrency(selectedProduct.originalPrice)}
                        </div>
                      )}
                      <div className="text-sm text-gray-600">
                        موجودی: {selectedProduct.stock > 0 ? `${selectedProduct.stock} عدد` : 'ناموجود'}
                      </div>
                    </div>
                  </div>

                  {/* Specifications */}
                  {selectedProduct.specifications.length > 0 && (
                    <div>
                      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <Settings className="w-5 h-5" />
                        مشخصات فنی
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {selectedProduct.specifications.map((spec) => (
                          <div key={spec.id} className="flex justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-600">{spec.name}:</span>
                            <span className="font-medium">{spec.value} {spec.unit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Features */}
                  {selectedProduct.features.length > 0 && (
                    <div>
                      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <Star className="w-5 h-5" />
                        ویژگی‌های کلیدی
                      </h3>
                      <div className="space-y-3">
                        {selectedProduct.features.map((feature) => (
                          <div key={feature.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <h4 className="font-medium">{feature.title}</h4>
                              <p className="text-sm text-gray-600">{feature.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Applications */}
                  {selectedProduct.applications.length > 0 && (
                    <div>
                      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <Target className="w-5 h-5" />
                        کاربردها
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedProduct.applications.map((app, index) => (
                          <Badge key={index} variant="outline" className="bg-green-50 text-green-700">
                            {app}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Warranty */}
                  {selectedProduct.warranty && (
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-5 h-5 text-green-600" />
                        <span className="font-semibold text-green-800">گارانتی</span>
                      </div>
                      <p className="text-green-700">{selectedProduct.warranty}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3 pt-6 border-t">
                    <Button className="flex-1 bg-blue-600 hover:bg-blue-700" size="lg">
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      درخواست قیمت
                    </Button>
                    <Button variant="outline" size="lg">
                      <Phone className="w-5 h-5 mr-2" />
                      تماس فوری
                    </Button>
                    {selectedProduct.downloadableFiles.length > 0 && (
                      <Button variant="outline" size="lg">
                        <Download className="w-5 h-5 mr-2" />
                        کاتالوگ
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
      <ChatWidget />
    </div>
  );
}