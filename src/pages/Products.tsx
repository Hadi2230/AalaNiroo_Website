import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ChatWidget from '@/components/layout/ChatWidget';
import ProductCard from '@/components/sections/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { products, categories } from '@/data/mockData';
import { Search, Filter } from 'lucide-react';

export default function Products() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'power') return parseInt(a.power) - parseInt(b.power);
    return 0;
  });

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-900 to-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold mb-6">محصولات و راهکارها</h1>
            <p className="text-xl leading-relaxed">
              مجموعه کاملی از تجهیزات و راهکارهای انرژی برای تمام نیازهای شما
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-gray-50 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="جستجو در محصولات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-4 items-center">
              {/* Category Filter */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="دسته‌بندی" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="مرتب‌سازی" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">نام محصول</SelectItem>
                  <SelectItem value="power">قدرت</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map(category => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className={selectedCategory === category.id ? "bg-blue-600 hover:bg-blue-700" : ""}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          {sortedProducts.length > 0 ? (
            <>
              <div className="text-center mb-12">
                <p className="text-gray-600">
                  {sortedProducts.length} محصول یافت شد
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {sortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">محصولی یافت نشد</h3>
              <p className="text-gray-600 mb-6">لطفاً کلمات کلیدی دیگری را امتحان کنید</p>
              <Button onClick={() => {setSearchTerm(''); setSelectedCategory('all');}}>
                مشاهده همه محصولات
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Product Categories Info */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">دسته‌بندی محصولات</h2>
            <p className="text-xl text-gray-600">آشنایی با انواع تجهیزات و کاربردهای آن‌ها</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-gray-50 rounded-lg hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">ژنراتورهای دیزلی</h3>
              <p className="text-gray-600">مناسب برای کاربردهای صنعتی و تجاری با قدرت بالا</p>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-lg hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">🔥</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">ژنراتورهای گازی</h3>
              <p className="text-gray-600">سازگار با محیط زیست و مناسب برای استفاده مداوم</p>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-lg hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">☀️</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">سیستم‌های خورشیدی</h3>
              <p className="text-gray-600">انرژی تجدیدپذیر برای آینده‌ای پایدار</p>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-lg hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">💨</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">توربین‌های بادی</h3>
              <p className="text-gray-600">تولید انرژی از نیروی باد در مناطق مساعد</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">محصول مورد نظرتان را پیدا نکردید؟</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            با کارشناسان ما تماس بگیرید تا بهترین راهکار انرژی متناسب با نیاز شما را پیدا کنیم
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-900 hover:bg-gray-100">
              مشاوره رایگان
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-900">
              درخواست کاتالوگ
            </Button>
          </div>
        </div>
      </section>

      <Footer />
      <ChatWidget />
    </div>
  );
}