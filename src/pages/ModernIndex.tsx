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
      <section className="py-24 tesla-section-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-5xl font-bold text-black mb-2 tracking-tight">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium text-sm uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Homepage Gallery (from Admin Content) */}
      {home.gallery.length > 0 && (
        <section className="py-16 tesla-section-gray">
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
      <section className="py-24 tesla-section-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className={dir === 'rtl' ? 'order-2' : 'order-1'}>
              <div className="space-y-6">
                <div>
                  <h2 className="text-6xl font-bold text-black mb-8 leading-none tracking-tight">
                    {language === 'fa' ? 'چرا اعلا نیرو؟' : 'Why Aalaniroo?'}
                  </h2>
                  <p className="text-xl text-gray-600 leading-relaxed mb-12 max-w-lg">
                    {company.description}
                  </p>
                </div>

                <div className="space-y-6 mb-12">
                  {whyChooseUs.slice(0, 4).map((item, index) => (
                    <div key={index} className="text-lg text-gray-800 leading-relaxed">
                      {item}
                    </div>
                  ))}
                </div>

                <div className="flex gap-4">
                  <button className="tesla-btn-primary">
                    {t('common.contactUs')}
                  </button>
                  <button className="tesla-btn-secondary">
                    {t('common.learnMore')}
                  </button>
                </div>
              </div>
            </div>

            <div className={`relative ${dir === 'rtl' ? 'order-1' : 'order-2'}`}>
              <div className="relative overflow-hidden rounded-lg">
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
                        <button onClick={() => setIsPlaying(true)} className="w-20 h-20 bg-white hover:bg-gray-50 rounded-full flex items-center justify-center shadow-xl transition-all hover:scale-105 border-4 border-white">
                          <Play className="w-8 h-8 text-black ml-1" />
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
                
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 tesla-section-gray">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-6xl font-bold text-black mb-6 leading-none tracking-tight">
              {language === 'fa' ? 'محصولات' : 'Products'}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('products.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentProducts.slice(0, 3).map((product) => (
              <ModernProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-16">
            <button className="tesla-btn-primary">
              {t('common.viewAll')}
            </button>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-24 tesla-section-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-6xl font-bold text-black mb-6 leading-none tracking-tight">
              {language === 'fa' ? 'خدمات' : 'Services'}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('services.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {currentServices.map((service) => (
              <div key={service.id} className="group text-center">
                <div className="text-5xl mb-8">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold text-black mb-6">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  {service.description}
                </p>
                <button className="tesla-btn-secondary">
                  {t('common.learnMore')}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Showcase */}
      <section className="py-24 tesla-section-gray">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-6xl font-bold text-black mb-6 leading-none tracking-tight">
              {language === 'fa' ? 'پروژه‌ها' : 'Projects'}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('projects.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {currentProjects.slice(0, 2).map((project) => (
              <div key={project.id} className="tesla-card group hover:shadow-lg transition-all duration-300 overflow-hidden">
                <div className="relative overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>

                <div className="p-8">
                  <h3 className="text-2xl font-bold text-black mb-4">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {project.description}
                  </p>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div>{project.location} • {project.year}</div>
                    <div>{project.capacity}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <button className="tesla-btn-primary">
              {t('common.viewAll')}
            </button>
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