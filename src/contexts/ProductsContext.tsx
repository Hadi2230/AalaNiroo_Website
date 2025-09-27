import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { useMedia } from './MediaContext';

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
  order: number;
}

export interface ProductSpecification {
  id: string;
  name: string;
  value: string;
  unit?: string;
  category: 'engine' | 'alternator' | 'control' | 'fuel' | 'dimensions' | 'other';
}

export interface ProductFeature {
  id: string;
  title: string;
  description: string;
  icon?: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  icon: string;
  color: string;
  parentId?: string;
}

export interface Product {
  id: string;
  name: string;
  nameEn: string;
  slug: string;
  category: string;
  subcategory?: string;
  brand: string;
  model: string;
  description: string;
  descriptionEn: string;
  shortDescription: string;
  images: ProductImage[];
  specifications: ProductSpecification[];
  features: ProductFeature[];
  price: number;
  originalPrice?: number;
  currency: 'IRR' | 'USD' | 'EUR';
  stock: number;
  minStock: number;
  sku: string;
  barcode?: string;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  status: 'active' | 'inactive' | 'draft' | 'out-of-stock';
  visibility: 'public' | 'private' | 'hidden';
  isFeatured: boolean;
  isNew: boolean;
  isOnSale: boolean;
  saleEndDate?: string;
  tags: string[];
  metaTitle?: string;
  metaDescription?: string;
  warranty: string;
  warrantyPeriod: number;
  applications: string[];
  relatedProducts: string[];
  downloadableFiles: {
    id: string;
    name: string;
    type: 'catalog' | 'manual' | 'datasheet' | 'certificate';
    url: string;
    size: number;
  }[];
  reviews: {
    id: string;
    rating: number;
    comment: string;
    author: string;
    date: string;
    verified: boolean;
  }[];
  analytics: {
    views: number;
    clicks: number;
    conversions: number;
    revenue: number;
    lastViewed?: string;
  };
  seo: {
    title: string;
    description: string;
    keywords: string[];
    canonicalUrl?: string;
    robots: string;
  };
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

interface ProductsState {
  products: Product[];
  categories: ProductCategory[];
  isLoading: boolean;
  error: string | null;
  searchTerm: string;
  filters: {
    category: string;
    brand: string;
    status: string;
    priceRange: {
      min: number;
      max: number;
    };
    inStock: boolean;
    featured: boolean;
  };
  sortBy: 'name' | 'price' | 'stock' | 'created' | 'updated' | 'views';
  sortOrder: 'asc' | 'desc';
  selectedProducts: string[];
}

interface ProductsContextType {
  // State
  products: Product[];
  categories: ProductCategory[];
  isLoading: boolean;
  error: string | null;
  searchTerm: string;
  filters: ProductsState['filters'];
  sortBy: ProductsState['sortBy'];
  sortOrder: ProductsState['sortOrder'];
  selectedProducts: string[];
  
  // Product CRUD
  createProduct: (product: Partial<Product>) => Promise<Product>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<boolean>;
  duplicateProduct: (id: string) => Promise<Product>;
  
  // Image Management
  addProductImage: (productId: string, imageUrl: string, alt: string, isPrimary?: boolean) => Promise<boolean>;
  removeProductImage: (productId: string, imageId: string) => Promise<boolean>;
  updateProductImage: (productId: string, imageId: string, updates: Partial<ProductImage>) => Promise<boolean>;
  reorderProductImages: (productId: string, imageIds: string[]) => Promise<boolean>;
  
  // Specifications
  addSpecification: (productId: string, spec: Omit<ProductSpecification, 'id'>) => Promise<boolean>;
  updateSpecification: (productId: string, specId: string, updates: Partial<ProductSpecification>) => Promise<boolean>;
  removeSpecification: (productId: string, specId: string) => Promise<boolean>;
  
  // Features
  addFeature: (productId: string, feature: Omit<ProductFeature, 'id'>) => Promise<boolean>;
  updateFeature: (productId: string, featureId: string, updates: Partial<ProductFeature>) => Promise<boolean>;
  removeFeature: (productId: string, featureId: string) => Promise<boolean>;
  
  // Categories
  createCategory: (category: Omit<ProductCategory, 'id'>) => Promise<ProductCategory>;
  updateCategory: (id: string, updates: Partial<ProductCategory>) => Promise<boolean>;
  deleteCategory: (id: string) => Promise<boolean>;
  
  // Bulk Operations
  bulkUpdateStatus: (productIds: string[], status: Product['status']) => Promise<boolean>;
  bulkUpdateCategory: (productIds: string[], categoryId: string) => Promise<boolean>;
  bulkDelete: (productIds: string[]) => Promise<boolean>;
  
  // Search & Filter
  setSearchTerm: (term: string) => void;
  setFilter: (key: keyof ProductsState['filters'], value: any) => void;
  setSorting: (sortBy: ProductsState['sortBy'], sortOrder: ProductsState['sortOrder']) => void;
  clearFilters: () => void;
  
  // Selection
  selectProduct: (id: string) => void;
  selectAllProducts: () => void;
  clearSelection: () => void;
  
  // Analytics
  getProductStats: () => {
    total: number;
    active: number;
    outOfStock: number;
    featured: number;
    totalValue: number;
    lowStock: number;
  };
  
  // Import/Export
  exportProducts: (format: 'json' | 'csv' | 'excel') => Promise<string>;
  importProducts: (data: any[], format: 'json' | 'csv') => Promise<boolean>;
  
  // Utilities
  generateSKU: (product: Partial<Product>) => string;
  validateProduct: (product: Partial<Product>) => { isValid: boolean; errors: string[] };
  searchProducts: (query: string) => Product[];
  getFilteredProducts: () => Product[];
  getSortedProducts: (products: Product[]) => Product[];
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
};

// Default categories
const defaultCategories: ProductCategory[] = [
  {
    id: 'diesel-generators',
    name: 'دیزل ژنراتور',
    nameEn: 'Diesel Generators',
    description: 'ژنراتورهای دیزلی صنعتی با قدرت بالا',
    icon: 'Zap',
    color: '#3b82f6'
  },
  {
    id: 'gas-generators',
    name: 'مولد گازسوز',
    nameEn: 'Gas Generators',
    description: 'مولدهای گازسوز اقتصادی و پایدار',
    icon: 'Flame',
    color: '#10b981'
  },
  {
    id: 'portable-generators',
    name: 'موتور برق قابل حمل',
    nameEn: 'Portable Generators',
    description: 'موتورهای برق کوچک و قابل حمل',
    icon: 'Battery',
    color: '#f59e0b'
  },
  {
    id: 'accessories',
    name: 'لوازم جانبی',
    nameEn: 'Accessories',
    description: 'قطعات یدکی و لوازم جانبی',
    icon: 'Settings',
    color: '#8b5cf6'
  }
];

// Default products
const defaultProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'دیزل ژنراتور FG Wilson P500',
    nameEn: 'FG Wilson P500 Diesel Generator',
    slug: 'fg-wilson-p500',
    category: 'diesel-generators',
    brand: 'FG Wilson',
    model: 'P500',
    description: 'ژنراتور دیزلی FG Wilson با قدرت 500 کیلووات، مناسب برای مصارف صنعتی سنگین',
    descriptionEn: 'FG Wilson diesel generator with 500kW power, suitable for heavy industrial applications',
    shortDescription: 'ژنراتور دیزلی 500 کیلووات FG Wilson',
    images: [
      {
        id: 'img-1',
        url: '/api/placeholder/600/400',
        alt: 'دیزل ژنراتور FG Wilson P500',
        isPrimary: true,
        order: 1
      }
    ],
    specifications: [
      { id: 'spec-1', name: 'قدرت', value: '500', unit: 'کیلووات', category: 'engine' },
      { id: 'spec-2', name: 'موتور', value: 'Perkins 2506C-E15TAG2', unit: '', category: 'engine' },
      { id: 'spec-3', name: 'آلترناتور', value: 'Stamford HCI544D', unit: '', category: 'alternator' },
      { id: 'spec-4', name: 'ولتاژ', value: '400/230', unit: 'ولت', category: 'alternator' },
      { id: 'spec-5', name: 'فرکانس', value: '50', unit: 'هرتز', category: 'alternator' }
    ],
    features: [
      { id: 'feat-1', title: 'موتور Perkins اصلی', description: 'موتور دیزلی Perkins اصلی انگلستان', icon: 'Engine' },
      { id: 'feat-2', title: 'آلترناتور Stamford', description: 'آلترناتور با کیفیت Stamford', icon: 'Zap' },
      { id: 'feat-3', title: 'سیستم کنترل دیجیتال', description: 'کنترل هوشمند و نمایشگر LCD', icon: 'Monitor' },
      { id: 'feat-4', title: 'تانک سوخت داخلی', description: 'تانک سوخت یکپارچه با ظرفیت مناسب', icon: 'Fuel' }
    ],
    price: 850000000,
    currency: 'IRR',
    stock: 5,
    minStock: 2,
    sku: 'FGW-P500-001',
    weight: 3500,
    dimensions: { length: 4200, width: 1600, height: 2300 },
    status: 'active',
    visibility: 'public',
    isFeatured: true,
    isNew: false,
    isOnSale: false,
    tags: ['FG Wilson', 'دیزل', 'صنعتی', '500kW'],
    warranty: '2 سال یا 2000 ساعت کار',
    warrantyPeriod: 24,
    applications: ['صنعتی', 'بیمارستانی', 'مخابراتی', 'ساختمانی'],
    relatedProducts: [],
    downloadableFiles: [
      {
        id: 'file-1',
        name: 'کاتالوگ FG Wilson P500',
        type: 'catalog',
        url: '/catalogs/fg-wilson-p500.pdf',
        size: 2500000
      }
    ],
    reviews: [],
    analytics: {
      views: 1250,
      clicks: 89,
      conversions: 12,
      revenue: 10200000000
    },
    seo: {
      title: 'دیزل ژنراتور FG Wilson P500 - 500 کیلووات',
      description: 'ژنراتور دیزلی FG Wilson P500 با قدرت 500 کیلووات، موتور Perkins و آلترناتور Stamford',
      keywords: ['دیزل ژنراتور', 'FG Wilson', '500 کیلووات', 'Perkins', 'Stamford'],
      robots: 'index,follow'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'admin',
    updatedBy: 'admin'
  }
];

export const ProductsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>(defaultCategories);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTermState] = useState('');
  const [filters, setFilters] = useState<ProductsState['filters']>({
    category: 'all',
    brand: 'all',
    status: 'all',
    priceRange: { min: 0, max: 0 },
    inStock: false,
    featured: false
  });
  const [sortBy, setSortByState] = useState<ProductsState['sortBy']>('updated');
  const [sortOrder, setSortOrderState] = useState<ProductsState['sortOrder']>('desc');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const { getFilesByFolder } = useMedia();

  // Load data from localStorage
  useEffect(() => {
    const savedProducts = localStorage.getItem('products');
    const savedCategories = localStorage.getItem('productCategories');
    
    if (savedProducts) {
      try {
        const loadedProducts = JSON.parse(savedProducts);
        console.log('📂 Loading products from localStorage:', loadedProducts.length);
        setProducts(loadedProducts);
      } catch (error) {
        console.error('Error loading products:', error);
        // Fallback to default products
        setProducts(defaultProducts);
      }
    } else {
      console.log('📦 No saved products, using defaults');
      setProducts(defaultProducts);
    }
    
    if (savedCategories) {
      try {
        setCategories(JSON.parse(savedCategories));
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    }

    // Listen for products updates from other components/tabs
    const handleProductsUpdate = (event: CustomEvent) => {
      if (event.detail && Array.isArray(event.detail)) {
        console.log('🔄 Products updated via event:', event.detail.length);
        setProducts(event.detail);
      }
    };

    // Listen for storage changes from other tabs
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'products' && event.newValue) {
        try {
          const newProducts = JSON.parse(event.newValue);
          console.log('💾 Products updated via storage:', newProducts.length);
          setProducts(newProducts);
        } catch (error) {
          console.error('Error parsing storage products:', error);
        }
      }
    };

    window.addEventListener('productsUpdated', handleProductsUpdate as EventListener);
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('productsUpdated', handleProductsUpdate as EventListener);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Save to localStorage and trigger sync event
  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
    
    // Trigger custom event for real-time sync
    window.dispatchEvent(new CustomEvent('productsUpdated', {
      detail: products
    }));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('productCategories', JSON.stringify(categories));
  }, [categories]);

  // Product CRUD Operations
  const createProduct = useCallback(async (productData: Partial<Product>): Promise<Product> => {
    setIsLoading(true);
    setError(null);

    try {
      const newProduct: Product = {
        id: `prod-${Date.now()}`,
        name: productData.name || '',
        nameEn: productData.nameEn || '',
        slug: generateSlug(productData.name || ''),
        category: productData.category || '',
        subcategory: productData.subcategory,
        brand: productData.brand || '',
        model: productData.model || '',
        description: productData.description || '',
        descriptionEn: productData.descriptionEn || '',
        shortDescription: productData.shortDescription || '',
        images: productData.images || [],
        specifications: productData.specifications || [],
        features: productData.features || [],
        price: productData.price || 0,
        originalPrice: productData.originalPrice,
        currency: productData.currency || 'IRR',
        stock: productData.stock || 0,
        minStock: productData.minStock || 5,
        sku: productData.sku || generateSKU(productData),
        barcode: productData.barcode,
        weight: productData.weight || 0,
        dimensions: productData.dimensions || { length: 0, width: 0, height: 0 },
        status: productData.status || 'active',
        visibility: productData.visibility || 'public',
        isFeatured: productData.isFeatured || false,
        isNew: productData.isNew || true,
        isOnSale: productData.isOnSale || false,
        saleEndDate: productData.saleEndDate,
        tags: productData.tags || [],
        metaTitle: productData.metaTitle,
        metaDescription: productData.metaDescription,
        warranty: productData.warranty || '',
        warrantyPeriod: productData.warrantyPeriod || 12,
        applications: productData.applications || [],
        relatedProducts: productData.relatedProducts || [],
        downloadableFiles: productData.downloadableFiles || [],
        reviews: [],
        analytics: {
          views: 0,
          clicks: 0,
          conversions: 0,
          revenue: 0
        },
        seo: {
          title: productData.name || '',
          description: productData.shortDescription || '',
          keywords: productData.tags || [],
          robots: 'index,follow'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'admin',
        updatedBy: 'admin'
      };

      setProducts(prev => {
        const updatedProducts = [newProduct, ...prev];
        
        // Force immediate sync
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('productsUpdated', {
            detail: updatedProducts
          }));
        }, 100);
        
        return updatedProducts;
      });
      
      toast.success('محصول جدید با موفقیت ایجاد شد', {
        description: 'محصول در صفحه عمومی نمایش داده خواهد شد'
      });
      
      return newProduct;
    } catch (error) {
      console.error('Error creating product:', error);
      setError('خطا در ایجاد محصول');
      toast.error('خطا در ایجاد محصول');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProduct = useCallback(async (id: string, updates: Partial<Product>): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      setProducts(prev => prev.map(product => 
        product.id === id 
          ? { 
              ...product, 
              ...updates, 
              updatedAt: new Date().toISOString(),
              updatedBy: 'admin'
            }
          : product
      ));

      toast.success('محصول با موفقیت به‌روزرسانی شد');
      return true;
    } catch (error) {
      console.error('Error updating product:', error);
      setError('خطا در به‌روزرسانی محصول');
      toast.error('خطا در به‌روزرسانی محصول');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteProduct = useCallback(async (id: string): Promise<boolean> => {
    try {
      const product = products.find(p => p.id === id);
      if (!product) return false;

      setProducts(prev => prev.filter(p => p.id !== id));
      toast.success(`محصول "${product.name}" حذف شد`);
      
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('خطا در حذف محصول');
      return false;
    }
  }, [products]);

  const duplicateProduct = useCallback(async (id: string): Promise<Product> => {
    const originalProduct = products.find(p => p.id === id);
    if (!originalProduct) {
      throw new Error('Product not found');
    }

    const duplicatedProduct: Product = {
      ...originalProduct,
      id: `prod-${Date.now()}`,
      name: `کپی ${originalProduct.name}`,
      nameEn: `Copy ${originalProduct.nameEn}`,
      slug: generateSlug(`کپی ${originalProduct.name}`),
      sku: generateSKU({ ...originalProduct, name: `کپی ${originalProduct.name}` }),
      status: 'draft',
      isNew: true,
      analytics: {
        views: 0,
        clicks: 0,
        conversions: 0,
        revenue: 0
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setProducts(prev => [duplicatedProduct, ...prev]);
    toast.success('محصول کپی شد');
    
    return duplicatedProduct;
  }, [products]);

  // Image Management
  const addProductImage = useCallback(async (productId: string, imageUrl: string, alt: string, isPrimary = false): Promise<boolean> => {
    try {
      const imageId = `img-${Date.now()}`;
      const newImage: ProductImage = {
        id: imageId,
        url: imageUrl,
        alt,
        isPrimary,
        order: Date.now()
      };

      setProducts(prev => prev.map(product => {
        if (product.id === productId) {
          const updatedImages = isPrimary 
            ? [newImage, ...product.images.map(img => ({ ...img, isPrimary: false }))]
            : [...product.images, newImage];
          
          return {
            ...product,
            images: updatedImages,
            updatedAt: new Date().toISOString()
          };
        }
        return product;
      }));

      toast.success('تصویر اضافه شد');
      return true;
    } catch (error) {
      toast.error('خطا در اضافه کردن تصویر');
      return false;
    }
  }, []);

  const removeProductImage = useCallback(async (productId: string, imageId: string): Promise<boolean> => {
    try {
      setProducts(prev => prev.map(product => {
        if (product.id === productId) {
          return {
            ...product,
            images: product.images.filter(img => img.id !== imageId),
            updatedAt: new Date().toISOString()
          };
        }
        return product;
      }));

      toast.success('تصویر حذف شد');
      return true;
    } catch (error) {
      toast.error('خطا در حذف تصویر');
      return false;
    }
  }, []);

  // Specifications Management
  const addSpecification = useCallback(async (productId: string, spec: Omit<ProductSpecification, 'id'>): Promise<boolean> => {
    try {
      const newSpec: ProductSpecification = {
        ...spec,
        id: `spec-${Date.now()}`
      };

      setProducts(prev => prev.map(product => {
        if (product.id === productId) {
          return {
            ...product,
            specifications: [...product.specifications, newSpec],
            updatedAt: new Date().toISOString()
          };
        }
        return product;
      }));

      toast.success('مشخصه اضافه شد');
      return true;
    } catch (error) {
      toast.error('خطا در اضافه کردن مشخصه');
      return false;
    }
  }, []);

  const removeSpecification = useCallback(async (productId: string, specId: string): Promise<boolean> => {
    try {
      setProducts(prev => prev.map(product => {
        if (product.id === productId) {
          return {
            ...product,
            specifications: product.specifications.filter(spec => spec.id !== specId),
            updatedAt: new Date().toISOString()
          };
        }
        return product;
      }));

      toast.success('مشخصه حذف شد');
      return true;
    } catch (error) {
      toast.error('خطا در حذف مشخصه');
      return false;
    }
  }, []);

  // Features Management
  const addFeature = useCallback(async (productId: string, feature: Omit<ProductFeature, 'id'>): Promise<boolean> => {
    try {
      const newFeature: ProductFeature = {
        ...feature,
        id: `feat-${Date.now()}`
      };

      setProducts(prev => prev.map(product => {
        if (product.id === productId) {
          return {
            ...product,
            features: [...product.features, newFeature],
            updatedAt: new Date().toISOString()
          };
        }
        return product;
      }));

      toast.success('ویژگی اضافه شد');
      return true;
    } catch (error) {
      toast.error('خطا در اضافه کردن ویژگی');
      return false;
    }
  }, []);

  // Utility Functions
  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  };

  const generateSKU = useCallback((product: Partial<Product>): string => {
    const brand = product.brand?.substring(0, 3).toUpperCase() || 'GEN';
    const category = product.category?.substring(0, 3).toUpperCase() || 'CAT';
    const timestamp = Date.now().toString().slice(-6);
    return `${brand}-${category}-${timestamp}`;
  }, []);

  const validateProduct = useCallback((product: Partial<Product>) => {
    const errors: string[] = [];
    
    if (!product.name?.trim()) errors.push('نام محصول الزامی است');
    if (!product.category) errors.push('دسته‌بندی الزامی است');
    if (!product.brand?.trim()) errors.push('برند الزامی است');
    if (!product.price || product.price <= 0) errors.push('قیمت باید بیشتر از صفر باشد');
    if (product.stock !== undefined && product.stock < 0) errors.push('موجودی نمی‌تواند منفی باشد');
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }, []);

  const searchProducts = useCallback((query: string): Product[] => {
    if (!query.trim()) return products;
    
    const lowerQuery = query.toLowerCase();
    return products.filter(product =>
      product.name.toLowerCase().includes(lowerQuery) ||
      product.nameEn.toLowerCase().includes(lowerQuery) ||
      product.description.toLowerCase().includes(lowerQuery) ||
      product.brand.toLowerCase().includes(lowerQuery) ||
      product.model.toLowerCase().includes(lowerQuery) ||
      product.sku.toLowerCase().includes(lowerQuery) ||
      product.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }, [products]);

  const getFilteredProducts = useCallback((): Product[] => {
    let filtered = products;

    // Search filter
    if (searchTerm) {
      filtered = searchProducts(searchTerm);
    }

    // Category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(p => p.category === filters.category);
    }

    // Brand filter
    if (filters.brand !== 'all') {
      filtered = filtered.filter(p => p.brand === filters.brand);
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(p => p.status === filters.status);
    }

    // Price range filter
    if (filters.priceRange.min > 0 || filters.priceRange.max > 0) {
      filtered = filtered.filter(p => {
        if (filters.priceRange.min > 0 && p.price < filters.priceRange.min) return false;
        if (filters.priceRange.max > 0 && p.price > filters.priceRange.max) return false;
        return true;
      });
    }

    // In stock filter
    if (filters.inStock) {
      filtered = filtered.filter(p => p.stock > 0);
    }

    // Featured filter
    if (filters.featured) {
      filtered = filtered.filter(p => p.isFeatured);
    }

    return filtered;
  }, [products, searchTerm, filters, searchProducts]);

  const getSortedProducts = useCallback((productsToSort: Product[]): Product[] => {
    return [...productsToSort].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'stock':
          aValue = a.stock;
          bValue = b.stock;
          break;
        case 'created':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case 'updated':
          aValue = new Date(a.updatedAt).getTime();
          bValue = new Date(b.updatedAt).getTime();
          break;
        case 'views':
          aValue = a.analytics.views;
          bValue = b.analytics.views;
          break;
        default:
          return 0;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });
  }, [sortBy, sortOrder]);

  // Analytics
  const getProductStats = useCallback(() => {
    const stats = {
      total: products.length,
      active: products.filter(p => p.status === 'active').length,
      outOfStock: products.filter(p => p.stock === 0).length,
      featured: products.filter(p => p.isFeatured).length,
      totalValue: products.reduce((sum, p) => sum + (p.price * p.stock), 0),
      lowStock: products.filter(p => p.stock > 0 && p.stock <= p.minStock).length
    };

    return stats;
  }, [products]);

  // Bulk Operations
  const bulkUpdateStatus = useCallback(async (productIds: string[], status: Product['status']): Promise<boolean> => {
    try {
      setProducts(prev => prev.map(product => 
        productIds.includes(product.id)
          ? { ...product, status, updatedAt: new Date().toISOString() }
          : product
      ));

      toast.success(`${productIds.length} محصول به‌روزرسانی شدند`);
      return true;
    } catch (error) {
      toast.error('خطا در به‌روزرسانی انبوه');
      return false;
    }
  }, []);

  const bulkDelete = useCallback(async (productIds: string[]): Promise<boolean> => {
    try {
      setProducts(prev => prev.filter(p => !productIds.includes(p.id)));
      toast.success(`${productIds.length} محصول حذف شدند`);
      setSelectedProducts([]);
      return true;
    } catch (error) {
      toast.error('خطا در حذف انبوه');
      return false;
    }
  }, []);

  // Selection Management
  const selectProduct = useCallback((id: string) => {
    setSelectedProducts(prev => 
      prev.includes(id) 
        ? prev.filter(pid => pid !== id)
        : [...prev, id]
    );
  }, []);

  const selectAllProducts = useCallback(() => {
    const filteredProducts = getFilteredProducts();
    setSelectedProducts(filteredProducts.map(p => p.id));
  }, [getFilteredProducts]);

  const clearSelection = useCallback(() => {
    setSelectedProducts([]);
  }, []);

  // Filter Management
  const setSearchTerm = useCallback((term: string) => {
    setSearchTermState(term);
  }, []);

  const setFilter = useCallback((key: keyof ProductsState['filters'], value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const setSorting = useCallback((newSortBy: ProductsState['sortBy'], newSortOrder: ProductsState['sortOrder']) => {
    setSortByState(newSortBy);
    setSortOrderState(newSortOrder);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      category: 'all',
      brand: 'all',
      status: 'all',
      priceRange: { min: 0, max: 0 },
      inStock: false,
      featured: false
    });
    setSearchTermState('');
  }, []);

  // Categories Management
  const createCategory = useCallback(async (categoryData: Omit<ProductCategory, 'id'>): Promise<ProductCategory> => {
    const newCategory: ProductCategory = {
      ...categoryData,
      id: `cat-${Date.now()}`
    };

    setCategories(prev => [...prev, newCategory]);
    toast.success('دسته‌بندی جدید ایجاد شد');
    
    return newCategory;
  }, []);

  // Export/Import
  const exportProducts = useCallback(async (format: 'json' | 'csv' | 'excel'): Promise<string> => {
    const data = {
      products: getFilteredProducts(),
      categories,
      exportDate: new Date().toISOString(),
      totalProducts: products.length
    };

    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `products-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    toast.success('محصولات دانلود شدند');
    
    return dataStr;
  }, [products, categories, getFilteredProducts]);

  const value: ProductsContextType = {
    // State
    products: getSortedProducts(getFilteredProducts()),
    categories,
    isLoading,
    error,
    searchTerm,
    filters,
    sortBy,
    sortOrder,
    selectedProducts,
    
    // CRUD
    createProduct,
    updateProduct,
    deleteProduct,
    duplicateProduct,
    
    // Images
    addProductImage,
    removeProductImage,
    updateProductImage: async () => true, // Placeholder
    reorderProductImages: async () => true, // Placeholder
    
    // Specifications
    addSpecification,
    updateSpecification: async () => true, // Placeholder
    removeSpecification,
    
    // Features
    addFeature,
    updateFeature: async () => true, // Placeholder
    removeFeature: async () => true, // Placeholder
    
    // Categories
    createCategory,
    updateCategory: async () => true, // Placeholder
    deleteCategory: async () => true, // Placeholder
    
    // Bulk Operations
    bulkUpdateStatus,
    bulkUpdateCategory: async () => true, // Placeholder
    bulkDelete,
    
    // Search & Filter
    setSearchTerm,
    setFilter,
    setSorting,
    clearFilters,
    
    // Selection
    selectProduct,
    selectAllProducts,
    clearSelection,
    
    // Analytics
    getProductStats,
    
    // Import/Export
    exportProducts,
    importProducts: async () => true, // Placeholder
    
    // Utilities
    generateSKU,
    validateProduct,
    searchProducts,
    getFilteredProducts,
    getSortedProducts
  };

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
};