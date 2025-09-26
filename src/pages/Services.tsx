import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ChatWidget from '@/components/layout/ChatWidget';
import ServiceCard from '@/components/sections/ServiceCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { services } from '@/data/mockData';
import { Phone, Clock, Shield, Award, CheckCircle, Wrench } from 'lucide-react';

export default function Services() {
  const supportFeatures = [
    'پشتیبانی 24 ساعته در 7 روز هفته',
    'تیم فنی مجرب و متخصص',
    'قطعات یدکی اصلی و باکیفیت',
    'گارانتی معتبر بر روی تمام خدمات',
    'سرویس در محل و از راه دور',
    'قراردادهای نگهداری بلندمدت'
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-900 to-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold mb-6">خدمات پس از فروش</h1>
            <p className="text-xl leading-relaxed">
              پشتیبانی جامع و حرفه‌ای برای تضمین عملکرد بهینه تجهیزات شما
            </p>
          </div>
        </div>
      </section>

      {/* Main Services */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">خدمات ما</h2>
            <p className="text-xl text-gray-600">طیف کاملی از خدمات پس از فروش</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* Support Features */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                چرا خدمات پس از فروش ما؟
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                ما معتقدیم که فروش محصول، تنها آغاز همکاری است. خدمات پس از فروش ما 
                طوری طراحی شده که تجهیزات شما همیشه با بالاترین کارایی کار کند.
              </p>
              
              <div className="space-y-4">
                {supportFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <Phone className="w-5 h-5 mr-2" />
                  تماس با پشتیبانی
                </Button>
              </div>
            </div>

            <div className="relative">
              <img 
                src="/api/placeholder/600/400" 
                alt="تیم پشتیبانی" 
                className="rounded-lg shadow-xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-blue-600 text-white p-6 rounded-lg shadow-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5" />
                  <span className="font-semibold">پشتیبانی</span>
                </div>
                <div className="text-2xl font-bold">24/7</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Plans */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">بسته‌های خدماتی</h2>
            <p className="text-xl text-gray-600">انتخاب بسته مناسب برای نیازهای شما</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Basic Plan */}
            <Card className="relative hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-gray-900">بسته پایه</CardTitle>
                <div className="text-3xl font-bold text-blue-600 mt-4">رایگان</div>
                <p className="text-gray-600">برای خریداران محصولات</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>گارانتی 2 ساله</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>پشتیبانی تلفنی</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>راهنمایی فنی</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>آموزش اولیه</span>
                  </li>
                </ul>
                <Button className="w-full mt-6 bg-gray-600 hover:bg-gray-700">
                  شامل خرید
                </Button>
              </CardContent>
            </Card>

            {/* Premium Plan */}
            <Card className="relative hover:shadow-xl transition-shadow border-blue-500 border-2">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                  محبوب‌ترین
                </div>
              </div>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-gray-900">بسته حرفه‌ای</CardTitle>
                <div className="text-3xl font-bold text-blue-600 mt-4">درخواست قیمت</div>
                <p className="text-gray-600">برای کسب‌وکارها</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>تمام مزایای بسته پایه</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>گارانتی 5 ساله</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>سرویس دوره‌ای</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>تعمیرات در محل</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>قطعات یدکی رایگان</span>
                  </li>
                </ul>
                <Button className="w-full mt-6 bg-blue-600 hover:bg-blue-700">
                  انتخاب بسته
                </Button>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="relative hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-gray-900">بسته سازمانی</CardTitle>
                <div className="text-3xl font-bold text-blue-600 mt-4">سفارشی</div>
                <p className="text-gray-600">برای سازمان‌های بزرگ</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>تمام مزایای بسته حرفه‌ای</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>مدیر پروژه اختصاصی</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>پشتیبانی اولویت‌دار</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>آموزش تخصصی تیم</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>گزارش‌دهی دوره‌ای</span>
                  </li>
                </ul>
                <Button className="w-full mt-6 bg-gray-600 hover:bg-gray-700">
                  تماس با فروش
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Emergency Support */}
      <section className="py-20 bg-red-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Phone className="w-10 h-10 text-red-600" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">پشتیبانی اضطراری</h2>
            <p className="text-xl text-gray-600 mb-8">
              در شرایط اضطراری، تیم فنی ما آماده ارائه خدمات فوری است
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600 mb-2">24/7</div>
                <div className="text-gray-600">دسترسی همیشگی</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600 mb-2">&lt; 2h</div>
                <div className="text-gray-600">زمان پاسخ</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600 mb-2">100%</div>
                <div className="text-gray-600">در دسترس بودن</div>
              </div>
            </div>

            <div className="mt-8">
              <Button size="lg" className="bg-red-600 hover:bg-red-700 text-lg px-8">
                <Phone className="w-5 h-5 mr-2" />
                تماس اضطراری: 021-88776655
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Maintenance Schedule */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">برنامه نگهداری</h2>
            <p className="text-xl text-gray-600">نگهداری دوره‌ای برای عملکرد بهینه</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Wrench className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">سرویس ماهانه</h3>
                <p className="text-gray-600">بازرسی و تنظیمات اولیه</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">سرویس فصلی</h3>
                <p className="text-gray-600">بازرسی کامل و تعویض قطعات</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">سرویس سالانه</h3>
                <p className="text-gray-600">بازسازی کامل و به‌روزرسانی</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">سرویس اضطراری</h3>
                <p className="text-gray-600">مداخله فوری در صورت نیاز</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-blue-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">نیاز به پشتیبانی دارید؟</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            تیم پشتیبانی ما آماده کمک به شما در هر زمان از شبانه‌روز است
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-900 hover:bg-gray-100">
              <Phone className="w-5 h-5 mr-2" />
              تماس با پشتیبانی
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-900">
              درخواست سرویس
            </Button>
          </div>
        </div>
      </section>

      <Footer />
      <ChatWidget />
    </div>
  );
}