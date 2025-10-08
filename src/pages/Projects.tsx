import ModernHeader from '@/components/layout/ModernHeader';
import Footer from '@/components/layout/Footer';
import ChatWidget from '@/components/layout/ChatWidget';
import ProjectCard from '@/components/sections/ProjectCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { projects } from '@/data/mockData';
import { MapPin, Calendar, Zap, Building, Users, Award, TrendingUp } from 'lucide-react';
import { useMeetings } from '@/contexts/MeetingsContext';

export default function Projects() {
  const { openModal } = useMeetings();
  const stats = [
    { icon: Building, label: 'پروژه تکمیل شده', value: '500+' },
    { icon: Users, label: 'مشتری راضی', value: '300+' },
    { icon: Zap, label: 'مگاوات نصب شده', value: '1000+' },
    { icon: Award, label: 'سال تجربه', value: '15+' }
  ];

  return (
    <div className="min-h-screen">
      <ModernHeader />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-900 to-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold mb-6">پروژه‌های اجرا شده</h1>
            <p className="text-xl leading-relaxed">
              نگاهی به برخی از موفق‌ترین پروژه‌هایی که با افتخار اجرا کرده‌ایم
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center p-8 hover:shadow-xl transition-shadow">
                <CardContent className="p-0">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">پروژه‌های شاخص</h2>
            <p className="text-xl text-gray-600">نمونه‌هایی از بزرگ‌ترین پروژه‌های اجرا شده</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>

      {/* Project Categories */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">انواع پروژه‌ها</h2>
            <p className="text-xl text-gray-600">تخصص ما در حوزه‌های مختلف انرژی</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-8 hover:shadow-xl transition-shadow group">
              <CardContent className="p-0 text-center">
                <div className="text-6xl mb-6 group-hover:scale-110 transition-transform">🏭</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">پروژه‌های صنعتی</h3>
                <p className="text-gray-600 mb-4">
                  تامین برق صنایع بزرگ، پتروشیمی، فولاد و سیمان
                </p>
                <Badge className="bg-blue-600 text-white">50+ پروژه</Badge>
              </CardContent>
            </Card>

            <Card className="p-8 hover:shadow-xl transition-shadow group">
              <CardContent className="p-0 text-center">
                <div className="text-6xl mb-6 group-hover:scale-110 transition-transform">🏥</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">مراکز درمانی</h3>
                <p className="text-gray-600 mb-4">
                  سیستم‌های تامین برق اضطراری بیمارستان‌ها و کلینیک‌ها
                </p>
                <Badge className="bg-blue-600 text-white">30+ پروژه</Badge>
              </CardContent>
            </Card>

            <Card className="p-8 hover:shadow-xl transition-shadow group">
              <CardContent className="p-0 text-center">
                <div className="text-6xl mb-6 group-hover:scale-110 transition-transform">🏢</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">مراکز تجاری</h3>
                <p className="text-gray-600 mb-4">
                  مجتمع‌های تجاری، هتل‌ها و مراکز خرید
                </p>
                <Badge className="bg-blue-600 text-white">80+ پروژه</Badge>
              </CardContent>
            </Card>

            <Card className="p-8 hover:shadow-xl transition-shadow group">
              <CardContent className="p-0 text-center">
                <div className="text-6xl mb-6 group-hover:scale-110 transition-transform">🌱</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">انرژی‌های تجدیدپذیر</h3>
                <p className="text-gray-600 mb-4">
                  نیروگاه‌های خورشیدی و بادی
                </p>
                <Badge className="bg-green-600 text-white">25+ پروژه</Badge>
              </CardContent>
            </Card>

            <Card className="p-8 hover:shadow-xl transition-shadow group">
              <CardContent className="p-0 text-center">
                <div className="text-6xl mb-6 group-hover:scale-110 transition-transform">🏘️</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">مجتمع‌های مسکونی</h3>
                <p className="text-gray-600 mb-4">
                  برق اضطراری برج‌ها و مجتمع‌های مسکونی
                </p>
                <Badge className="bg-blue-600 text-white">100+ پروژه</Badge>
              </CardContent>
            </Card>

            <Card className="p-8 hover:shadow-xl transition-shadow group">
              <CardContent className="p-0 text-center">
                <div className="text-6xl mb-6 group-hover:scale-110 transition-transform">🏛️</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">بخش دولتی</h3>
                <p className="text-gray-600 mb-4">
                  ادارات، دانشگاه‌ها و مراکز دولتی
                </p>
                <Badge className="bg-blue-600 text-white">40+ پروژه</Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-blue-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">فرآیند اجرای پروژه</h2>
            <p className="text-xl">مراحل حرفه‌ای اجرای پروژه از ابتدا تا پایان</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-bold mb-2">مشاوره و بررسی</h3>
              <p className="text-gray-300">تحلیل نیازها و ارائه راهکار بهینه</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-bold mb-2">طراحی و برنامه‌ریزی</h3>
              <p className="text-gray-300">طراحی دقیق سیستم و برنامه‌ریزی اجرا</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-bold mb-2">نصب و راه‌اندازی</h3>
              <p className="text-gray-300">اجرای حرفه‌ای و راه‌اندازی سیستم</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                4
              </div>
              <h3 className="text-xl font-bold mb-2">پشتیبانی و نگهداری</h3>
              <p className="text-gray-300">خدمات پس از فروش و نگهداری مداوم</p>
            </div>
          </div>
        </div>
      </section>

      {/* Success Metrics */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">شاخص‌های موفقیت</h2>
            <p className="text-xl text-gray-600">آمارهایی که نشان‌دهنده کیفیت کار ماست</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-blue-600 mb-2">98%</div>
              <div className="text-gray-600">رضایت مشتریان</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-blue-600 mb-2">100%</div>
              <div className="text-gray-600">تحویل به موقع</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-blue-600 mb-2">24/7</div>
              <div className="text-gray-600">پشتیبانی</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-blue-600 mb-2">5</div>
              <div className="text-gray-600">سال گارانتی</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">پروژه بعدی ما، پروژه شماست</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            آماده‌ایم تا بهترین راهکار انرژی را برای پروژه شما طراحی و اجرا کنیم
          </p>
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700" onClick={() => openModal()}>
            شروع پروژه جدید
          </Button>
        </div>
      </section>

      <Footer />
      <ChatWidget />
    </div>
  );
}