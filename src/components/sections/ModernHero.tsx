import React, { useEffect, useRef } from 'react';
import { useMediaUrl } from '@/hooks/useMediaUrl';
import { Button } from '@/components/ui/button';
import { ArrowRight, Phone, FileText, Calendar, Award, Users, Clock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCompany } from '@/contexts/CompanyContext';
import { useHomeContent } from '@/contexts/HomeContentContext';

const ModernHero = () => {
  const { language, t, dir } = useLanguage();
  const { companyData } = useCompany();
  const { content: home } = useHomeContent();
  const company = companyData[language];
  const bgVideoRef = useRef<HTMLVideoElement | null>(null);
  const heroVideoUrl = useMediaUrl(home.hero.type === 'video' ? home.hero.videoUrl : undefined);

  useEffect(() => {
    if (home.hero.type === 'video' && home.hero.videoUrl && (home.hero.autoplay ?? true)) {
      try {
        bgVideoRef.current?.play?.();
      } catch {}
    }
  }, [home.hero.type, home.hero.videoUrl, home.hero.autoplay]);

  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 text-white overflow-hidden">
      {/* Dynamic Media Background */}
      {home.hero.type === 'video' && heroVideoUrl && (
        <video ref={bgVideoRef} className="absolute inset-0 w-full h-full object-cover opacity-50" autoPlay={home.hero.autoplay} muted={home.hero.muted} loop={home.hero.loop} playsInline preload="metadata" poster={home.hero.posterUrl || undefined}>
          <source src={heroVideoUrl} type={heroVideoUrl.startsWith('blob:') ? 'video/mp4' : (heroVideoUrl.startsWith('data:') ? heroVideoUrl.substring(5, heroVideoUrl.indexOf(';')) : (heroVideoUrl.endsWith('.webm') ? 'video/webm' : (heroVideoUrl.endsWith('.ogv') || heroVideoUrl.endsWith('.ogg') ? 'video/ogg' : 'video/mp4')))} />
        </video>
      )}
      {home.hero.type === 'image' && home.hero.imageUrl && (
        <img src={home.hero.imageUrl} alt={home.hero.title || ''} className="absolute inset-0 w-full h-full object-cover opacity-60" />
      )}
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/40 z-10"></div>
      
      {/* Industrial Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gray-400 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full">
          <svg className="w-full h-full opacity-5" viewBox="0 0 100 100">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-20">
        <div className="grid grid-cols-1 gap-12 items-center justify-items-center">
          {/* Content */}
          <div className="space-y-8 text-center max-w-4xl mx-auto">
            {/* Company Badge */}
            <div className="inline-flex items-center gap-2 bg-blue-600/20 backdrop-blur-sm border border-blue-400/30 rounded-full px-4 py-2">
              <Award className="w-5 h-5 text-blue-400" />
              <span className="text-blue-200 text-sm font-medium">
                {language === 'fa' ? '33+ سال تجربه' : '33+ Years Experience'}
              </span>
            </div>

            <div className="space-y-6">
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                {home.hero.title ? (
                  home.hero.title
                ) : language === 'fa' ? (
                  <>
                    پیشرو در تولید
                    <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                      {" "}ژنراتورهای صنعتی
                    </span>
                  </>
                ) : (
                  <>
                    Leading in
                    <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                      {" "}Industrial Generators
                    </span>
                  </>
                )}
              </h1>
              
              <p className="text-xl lg:text-2xl text-gray-300 leading-relaxed max-w-2xl">
                {home.hero.subtitle || company.description}
              </p>
            </div>

            {/* Key Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center">
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold">FG Wilson</h3>
                  <p className="text-sm text-gray-400">
                    {language === 'fa' ? 'نماینده رسمی' : 'Official Partner'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Cummins</h3>
                  <p className="text-sm text-gray-400">
                    {language === 'fa' ? 'نماینده رسمی' : 'Official Partner'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold">24/7</h3>
                  <p className="text-sm text-gray-400">
                    {language === 'fa' ? 'پشتیبانی' : 'Support'}
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4 group" onClick={() => { if (home.hero.ctaUrl) window.location.href = home.hero.ctaUrl; }}>
                <FileText className={`w-5 h-5 ${dir === 'rtl' ? 'ml-2' : 'mr-2'}`} />
                {home.hero.ctaText || t('hero.cta.quote')}
                <ArrowRight className={`w-5 h-5 ${dir === 'rtl' ? 'mr-2' : 'ml-2'} group-hover:translate-x-1 transition-transform`} />
              </Button>
              
              <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-gray-400 text-white hover:bg-white hover:text-gray-900">
                <Phone className={`w-5 h-5 ${dir === 'rtl' ? 'ml-2' : 'mr-2'}`} />
                {t('hero.cta.call')}
              </Button>
              
              <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-gray-400 text-white hover:bg-white hover:text-gray-900">
                <Calendar className={`w-5 h-5 ${dir === 'rtl' ? 'ml-2' : 'mr-2'}`} />
                {t('hero.cta.service')}
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-700">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-400">500+</div>
                <div className="text-sm text-gray-400">
                  {language === 'fa' ? 'پروژه موفق' : 'Successful Projects'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-400">33+</div>
                <div className="text-sm text-gray-400">
                  {language === 'fa' ? 'سال تجربه' : 'Years Experience'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-400">24/7</div>
                <div className="text-sm text-gray-400">
                  {language === 'fa' ? 'پشتیبانی' : 'Support'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-20">
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default ModernHero;