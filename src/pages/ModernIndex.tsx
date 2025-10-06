import React, { useState } from 'react';
import ModernHero from '@/components/sections/ModernHero';
import ModernProductCard from '@/components/sections/ModernProductCard';
import ModernHeader from '@/components/layout/ModernHeader';
import Footer from '@/components/layout/Footer';
import ChatWidget from '@/components/layout/ChatWidget';
import GallerySection from '@/components/sections/GallerySection';
import { useHomeContent } from '@/contexts/HomeContentContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCompany } from '@/contexts/CompanyContext';
import { useMedia } from '@/contexts/MediaContext';
import { products, services, projects } from '@/data/companyData';
import { useMediaUrl } from '@/hooks/useMediaUrl';
import { 
  ArrowRight, 
  CheckCircle, 
  Users, 
  Award, 
  Clock, 
  Star, 
  Zap, 
  Shield, 
  Wrench,
  MapPin,
  Calendar,
  Building,
  TrendingUp,
  Phone,
  Mail,
  Globe,
  Play
} from 'lucide-react';

export default function ModernIndex() {
  const { language, t, dir } = useLanguage();
  const { companyData, isLoading } = useCompany();
  const { listGalleries, mediaFiles } = useMedia();
  const { content: home } = useHomeContent();
  const introVideoUrl = useMediaUrl(home.introMedia?.type === 'video' ? home.introMedia?.videoUrl : undefined);
  const introImageUrl = useMediaUrl(home.introMedia?.type === 'image' ? home.introMedia?.imageUrl : undefined);
  const heroVideoUrl = useMediaUrl(home.hero.type === 'video' ? home.hero.videoUrl : undefined);
  const playableVideoUrl = introVideoUrl || heroVideoUrl;
  const posterUrl = home.introMedia?.posterUrl || home.hero.posterUrl || introImageUrl || '/api/placeholder/600/400';
  const [isPlaying, setIsPlaying] = useState(false);
  const currentProducts = products[language];
  const currentServices = services[language];
  const currentProjects = projects[language];
  const company = companyData[language];

  // Show loading state while company data is loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">بارگذاری اطلاعات شرکت...</p>
        </div>
      </div>
    );
  }

  const stats = [
    { icon: Building, value: '500+', label: language === 'fa' ? 'پروژه موفق' : 'Successful Projects' },
    { icon: Users, value: '33+', label: language === 'fa' ? 'سال تجربه' : 'Years Experience' },
    { icon: Zap, value: '2500+', label: language === 'fa' ? 'مگاوات نصب شده' : 'MW Installed' },
    { icon: Award, value: '24/7', label: language === 'fa' ? 'پشتیبانی' : 'Support' }
  ];

  const whyChooseUs = language === 'fa' ? [
    'نماینده رسمی FG Wilson و Cummins',
    'بیش از 33 سال تجربه در صنعت',
    'پشتیبانی 24 ساعته و 7 روز هفته',
    'تیم مهندسی مجرب و متخصص',
    'قطعات یدکی اصلی و باکیفیت',
    'گارانتی معتبر و خدمات پس از فروش'
  ] : [
    'Official FG Wilson & Cummins Representative',
    'Over 33 years of industry experience',
    '24/7 support and service',
    'Experienced engineering team',
    'Original spare parts and quality',
    'Valid warranty and after-sales service'
  ];

  return (
    <div className="min-h-screen">
      <ModernHeader />
      
      {/* Hero Section */}
      <ModernHero />

      {/* Stats Section */}
      <section className="py-20 main-content-section">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center p-8 hover:shadow-lg transition-all duration-300 group bg-white border border-gray-200">
                <CardContent className="p-0">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-50 transition-colors">
                    <stat.icon className="w-8 h-8 text-gray-700 group-hover:text-blue-600 transition-colors" />
                  </div>
                  <div className="text-4xl font-bold text-black mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Homepage Gallery (from Admin Content) */}
      {home.gallery.length > 0 && (
        <section className="py-12 main-content-section">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...home.gallery].sort((a,b) => a.order - b.order).slice(0, 8).map(item => (
                <div key={item.id} className="relative group overflow-hidden rounded-xl shadow hover:shadow-lg transition-shadow">
                  {item.type === 'image' ? (
                    <img src={item.url} alt={item.alt} className="w-full h-48 object-cover group-hover:scale-105 transition-transform" />
                  ) : (
                    <video src={item.url} className="w-full h-48 object-cover" muted />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Company Introduction */}
      <section className="py-20 tesla-section-alt">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className={dir === 'rtl' ? 'order-2' : 'order-1'}>
              <div className="space-y-6">
                <div>
                  <div className="text-sm font-medium text-blue-600 mb-4 uppercase tracking-wider">
                    {language === 'fa' ? 'درباره شرکت' : 'About Company'}
                  </div>
                  <h2 className="text-5xl font-bold text-black mb-6 leading-tight">
                    {language === 'fa' ? 'چرا اعلا نیرو را انتخاب کنیم؟' : 'Why Choose Aalaniroo?'}
                  </h2>
                  <p className="text-xl text-gray-600 leading-relaxed mb-8">
                    {company.description}
                  </p>
                </div>

                <div className="space-y-4">
                  {whyChooseUs.map((item, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="w-2 h-2 bg-black rounded-full mt-3 flex-shrink-0"></div>
                      <span className="text-lg text-gray-800 leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button size="lg" className="bg-black text-white hover:bg-gray-800 rounded-none px-8 py-4 font-medium">
                    {t('common.contactUs')}
                  </Button>
                  <Button size="lg" variant="outline" className="border-black text-black hover:bg-black hover:text-white rounded-none px-8 py-4 font-medium">
                    {t('common.learnMore')}
                  </Button>
                </div>
              </div>
            </div>

            <div className={`relative ${dir === 'rtl' ? 'order-1' : 'order-2'}`}>
              <div className="relative z-10 bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
                {playableVideoUrl ? (
                  isPlaying ? (
                    <video className="w-full h-auto rounded-lg" controls autoPlay playsInline preload="metadata" poster={posterUrl || undefined}>
                      <source src={playableVideoUrl} type={playableVideoUrl.startsWith('blob:') ? 'video/mp4' : (playableVideoUrl.startsWith('data:') ? playableVideoUrl.substring(5, playableVideoUrl.indexOf(';')) : (playableVideoUrl.endsWith('.webm') ? 'video/webm' : (playableVideoUrl.endsWith('.ogv') || playableVideoUrl.endsWith('.ogg') ? 'video/ogg' : 'video/mp4')))} />
                    </video>
                  ) : (
                    <div className="relative">
                      <img 
                        src={typeof posterUrl === 'string' ? posterUrl : '/api/placeholder/600/400'} 
                        alt="Aalaniroo Company" 
                        className="w-full h-auto rounded-lg"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <button onClick={() => setIsPlaying(true)} className="w-16 h-16 bg-black hover:bg-gray-800 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-105">
                          <Play className="w-6 h-6 text-white ml-1" />
                        </button>
                      </div>
                    </div>
                  )
                ) : (
                  <img 
                    src={introImageUrl || '/api/placeholder/600/400'} 
                    alt="Aalaniroo Company" 
                    className="w-full h-auto rounded-lg"
                  />
                )}
                
                {/* Experience Badge */}
                <div className="absolute -top-4 -right-4 bg-blue-600 text-white p-6 rounded-lg shadow-lg">
                  <div className="text-3xl font-bold">33+</div>
                  <div className="text-sm">
                    {language === 'fa' ? 'سال تجربه' : 'Years'}
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute top-10 -left-10 w-20 h-20 bg-blue-500 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute bottom-10 -right-10 w-16 h-16 bg-gray-500 rounded-full opacity-20 animate-pulse delay-1000"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 main-content-section">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-blue-100 text-blue-800 mb-4">
              {t('products.title')}
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {language === 'fa' ? 'محصولات پیشنهادی' : 'Featured Products'}
            </h2>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              {t('products.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentProducts.slice(0, 3).map((product) => (
              <ModernProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 group">
              {t('common.viewAll')}
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 main-content-section">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-blue-100 text-blue-800 mb-4">
              {t('services.title')}
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {language === 'fa' ? 'خدمات جامع ما' : 'Our Comprehensive Services'}
            </h2>
            <p className="text-xl text-gray-700">
              {t('services.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {currentServices.map((service) => (
              <Card key={service.id} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white/30 backdrop-blur-sm border-gray-300">
                <CardContent className="p-8 text-center">
                  <div className="text-6xl mb-6 group-hover:scale-110 transition-transform">
                    {service.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    {t('common.learnMore')}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Showcase */}
      <section className="py-20 main-content-section">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-blue-100 text-blue-800 mb-4">
              {t('projects.title')}
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {language === 'fa' ? 'پروژه‌های شاخص' : 'Featured Projects'}
            </h2>
            <p className="text-xl text-gray-700">
              {t('projects.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {currentProjects.slice(0, 2).map((project) => (
              <Card key={project.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden bg-white/30 backdrop-blur-sm border-gray-300">
                <div className="relative overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <Badge className="bg-blue-600 text-white mb-2">
                      <Zap className="w-3 h-3 mr-1" />
                      {project.capacity}
                    </Badge>
                    <h3 className="text-xl font-bold mb-1">
                      {project.title}
                    </h3>
                  </div>
                </div>

                <CardContent className="p-6">
                  <p className="text-gray-700 mb-4">
                    {project.description}
                  </p>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-700">{t('projects.location')}:</span>
                      <span className="font-medium text-gray-900">{project.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-700">{t('projects.year')}:</span>
                      <span className="font-medium text-gray-900">{project.year}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-700">{t('projects.client')}:</span>
                      <span className="font-medium text-gray-900">{project.client}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              {t('common.viewAll')}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Dedicated Galleries Sections (e.g., Exhibitions per year) */}
      {(() => {
        const galleries = listGalleries();
        const expoThisYear = galleries.find(g => g.tags.map(x => x.toLowerCase()).includes('نمایشگاه امسال') || g.title.includes('امسال'));
        const expoLastYear = galleries.find(g => g.tags.map(x => x.toLowerCase()).includes('نمایشگاه پارسال') || g.title.includes('پارسال'));
        return (
          <>
            {expoThisYear && (
              <GallerySection
                title={language === 'fa' ? 'نمایشگاه امسال' : 'This Year Exhibition'}
                gallery={expoThisYear}
                files={mediaFiles}
              />
            )}
            {expoLastYear && (
              <GallerySection
                title={language === 'fa' ? 'نمایشگاه پارسال' : 'Last Year Exhibition'}
                gallery={expoLastYear}
                files={mediaFiles}
              />
            )}
          </>
        );
      })()}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white preserve-bg">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            {language === 'fa' ? 'آماده شروع پروژه هستید؟' : 'Ready to Start Your Project?'}
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            {language === 'fa' 
              ? 'همین امروز با کارشناسان ما تماس بگیرید و بهترین ژنراتور برای نیاز خود دریافت کنید'
              : 'Contact our experts today and get the best generator for your needs'
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <Phone className="w-5 h-5 mr-2" />
              {t('hero.cta.call')}
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              <Mail className="w-5 h-5 mr-2" />
              {t('hero.cta.quote')}
            </Button>
          </div>
        </div>
      </section>

      <Footer />
      <ChatWidget />
    </div>
  );
}