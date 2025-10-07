import HeroSection from '@/components/sections/HeroSection';
import ProductCard from '@/components/sections/ProductCard';
import ServiceCard from '@/components/sections/ServiceCard';
import ModernHeader from '@/components/layout/ModernHeader';
import Footer from '@/components/layout/Footer';
import ChatWidget from '@/components/layout/ChatWidget';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { products, services } from '@/data/mockData';
import { ArrowRight, CheckCircle, Users, Award, Clock, Star } from 'lucide-react';

export default function Index() {
  return (
    <div className="min-h-screen">
      <ModernHeader />
      <main className="page-bg">
      
      {/* Hero Section */}
      <HeroSection />

      {/* Company Introduction */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              چرا انرژی پاک را انتخاب کنیم؟
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              با بیش از 15 سال تجربه در صنعت انرژی، ما بهترین راهکارهای تولید و تامین انرژی را ارائه می‌دهیم
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">تیم متخصص</h3>
                <p className="text-gray-600">مهندسان مجرب و کارشناسان حرفه‌ای</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">کیفیت برتر</h3>
                <p className="text-gray-600">استفاده از بهترین برندهای جهانی</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">پشتیبانی 24/7</h3>
                <p className="text-gray-600">خدمات پس از فروش در تمام ساعات</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">رضایت مشتری</h3>
                <p className="text-gray-600">بیش از 500 پروژه موفق</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              محصولات پیشنهادی
            </h2>
            <p className="text-xl text-gray-600">
              جدیدترین و بهترین محصولات انرژی برای نیازهای شما
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              مشاهده همه محصولات
              <ArrowRight className="w-5 h-5 mr-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              خدمات ما
            </h2>
            <p className="text-xl text-gray-600">
              خدمات جامع از مشاوره تا نگهداری و پشتیبانی
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-blue-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">
                مزایای همکاری با انرژی پاک
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-blue-400 flex-shrink-0" />
                  <span>تضمین کیفیت محصولات و خدمات</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-blue-400 flex-shrink-0" />
                  <span>قیمت‌گذاری منصفانه و رقابتی</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-blue-400 flex-shrink-0" />
                  <span>تحویل به موقع پروژه‌ها</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-blue-400 flex-shrink-0" />
                  <span>پشتیبانی فنی تخصصی</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-blue-400 flex-shrink-0" />
                  <span>استفاده از جدیدترین تکنولوژی‌ها</span>
                </div>
              </div>
              <div className="mt-8">
                <Button size="lg" className="bg-white text-blue-900 hover:bg-gray-100">
                  درخواست مشاوره رایگان
                </Button>
              </div>
            </div>
            <div className="relative">
              <img 
                src="/api/placeholder/600/400" 
                alt="تیم انرژی پاک" 
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            آماده شروع پروژه هستید؟
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            همین امروز با کارشناسان ما تماس بگیرید و بهترین راهکار انرژی برای کسب‌وکار خود دریافت کنید
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              تماس با ما
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              درخواست کاتالوگ
            </Button>
          </div>
        </div>
      </section>

      </main>
      <Footer />
      <ChatWidget />
    </div>
  );
}