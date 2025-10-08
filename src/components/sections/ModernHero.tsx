import React, { useEffect, useRef } from 'react';
import { useMediaUrl } from '@/hooks/useMediaUrl';
import { Button } from '@/components/ui/button';
import { ArrowRight, Phone, FileText } from 'lucide-react';
import { useCTA } from '@/hooks/useCTA';
import { useMeetings } from '@/contexts/MeetingsContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCompany } from '@/contexts/CompanyContext';
import { useHomeContent } from '@/contexts/HomeContentContext';

const ModernHero = () => {
  const { language, t, dir } = useLanguage();
  const { companyData } = useCompany();
  const { content: home } = useHomeContent();
  const { showQuoteMessage, showContactMessage } = useCTA();
  const { openModal } = useMeetings();
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
      {(home.hero.overlay ?? true) && (
        <div className="absolute inset-0 bg-black/40 z-10"></div>
      )}
      
      

      <div className="container mx-auto px-4 relative z-20">
        <div className="grid grid-cols-1 gap-12 items-center justify-items-center">
          {/* Content */}
          <div className="space-y-8 text-center max-w-4xl mx-auto">
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

            

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4 group" onClick={showQuoteMessage}>
                <FileText className={`w-5 h-5 ${dir === 'rtl' ? 'ml-2' : 'mr-2'}`} />
                {home.hero.ctaText || t('hero.cta.quote')}
                <ArrowRight className={`w-5 h-5 ${dir === 'rtl' ? 'mr-2' : 'ml-2'} group-hover:translate-x-1 transition-transform`} />
              </Button>
              
              <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-gray-400 text-white hover:bg-white hover:text-gray-900" onClick={showContactMessage}>
                <Phone className={`w-5 h-5 ${dir === 'rtl' ? 'ml-2' : 'mr-2'}`} />
                {t('hero.cta.call')}
              </Button>
              <Button size="lg" variant="ghost" className="text-lg px-8 py-4" onClick={() => openModal()}>
                {language === 'fa' ? 'رزرو جلسه' : 'Book Meeting'}
              </Button>
            </div>

            
          </div>
        </div>
      </div>
      
    </section>
  );
};

export default ModernHero;