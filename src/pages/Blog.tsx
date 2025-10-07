import ModernHeader from '@/components/layout/ModernHeader';
import Footer from '@/components/layout/Footer';
import ChatWidget from '@/components/layout/ChatWidget';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { blogPosts } from '@/data/mockData';
import { Calendar, User, ArrowRight, TrendingUp, Lightbulb, Zap } from 'lucide-react';

export default function Blog() {
  const categories = [
    { name: 'همه مقالات', count: 12, active: true },
    { name: 'انرژی تجدیدپذیر', count: 5 },
    { name: 'ژنراتور', count: 4 },
    { name: 'بهینه‌سازی انرژی', count: 3 }
  ];

  const featuredTopics = [
    { icon: TrendingUp, title: 'روندهای صنعت انرژی', count: '8 مقاله' },
    { icon: Lightbulb, title: 'نوآوری‌های تکنولوژی', count: '6 مقاله' },
    { icon: Zap, title: 'راهکارهای عملی', count: '10 مقاله' }
  ];

  return (
    <div className="min-h-screen">
      <ModernHeader />
      <main className="page-bg">
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-900 to-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold mb-6">وبلاگ و اخبار</h1>
            <p className="text-xl leading-relaxed">
              آخرین اخبار، مقالات تخصصی و راهنمایی‌های عملی در حوزه انرژی
            </p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map((category, index) => (
              <Button
                key={index}
                variant={category.active ? "default" : "outline"}
                className={`${category.active ? "bg-blue-600 hover:bg-blue-700" : ""}`}
              >
                {category.name} ({category.count})
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Topics */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            {featuredTopics.map((topic, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <CardContent className="p-0 flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <topic.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{topic.title}</h3>
                    <p className="text-sm text-gray-600">{topic.count}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="space-y-8">
                {blogPosts.map((post) => (
                  <Card key={post.id} className="overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="md:flex">
                      <div className="md:w-1/3">
                        <img 
                          src={post.image} 
                          alt={post.title}
                          className="w-full h-48 md:h-full object-cover"
                        />
                      </div>
                      <div className="md:w-2/3 p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge className="bg-blue-100 text-blue-800">
                            {post.category}
                          </Badge>
                        </div>
                        
                        <h2 className="text-2xl font-bold text-gray-900 mb-3 hover:text-blue-600 cursor-pointer transition-colors">
                          {post.title}
                        </h2>
                        
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              <span>{post.author}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{post.date}</span>
                            </div>
                          </div>
                          
                          <Button variant="outline" size="sm">
                            ادامه مطلب
                            <ArrowRight className="w-4 h-4 mr-1" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Load More */}
              <div className="text-center mt-12">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  مشاهده مقالات بیشتر
                </Button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Newsletter */}
              <Card className="p-6">
                <CardContent className="p-0">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">عضویت در خبرنامه</h3>
                  <p className="text-gray-600 mb-4">
                    آخرین اخبار و مقالات را مستقیماً در ایمیل خود دریافت کنید
                  </p>
                  <div className="space-y-3">
                    <input 
                      type="email" 
                      placeholder="ایمیل شما"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      عضویت
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Popular Posts */}
              <Card className="p-6">
                <CardContent className="p-0">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">محبوب‌ترین مقالات</h3>
                  <div className="space-y-4">
                    {blogPosts.slice(0, 3).map((post, index) => (
                      <div key={post.id} className="flex gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm flex-shrink-0">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 hover:text-blue-600 cursor-pointer transition-colors line-clamp-2">
                            {post.title}
                          </h4>
                          <p className="text-sm text-gray-500">{post.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Tags */}
              <Card className="p-6">
                <CardContent className="p-0">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">برچسب‌ها</h3>
                  <div className="flex flex-wrap gap-2">
                    {['انرژی خورشیدی', 'ژنراتور', 'انرژی بادی', 'بهینه‌سازی', 'نگهداری', 'تکنولوژی'].map((tag, index) => (
                      <Badge key={index} variant="outline" className="cursor-pointer hover:bg-blue-50">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      </main>
      <Footer />
      <ChatWidget />
    </div>
  );
}