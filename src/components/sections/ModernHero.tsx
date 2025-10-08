import React, { useEffect, useRef, useState } from 'react';
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
  const [videoError, setVideoError] = useState(false);
  const heroVideoUrl = useMediaUrl(home.hero.type === 'video' ? home.hero.videoUrl : undefined);

  useEffect(() => {
    if (home.hero.type === 'video' && heroVideoUrl && (home.hero.autoplay ?? true)) {
      const el = bgVideoRef.current;
      if (el) {
        if (home.hero.muted !== false) {
          el.muted = true;
        }
        el.play().catch(() => {});
      }
    }
  }, [home.hero.type, heroVideoUrl, home.hero.autoplay, home.hero.muted]);

  return (
    <section className="relative min-h-[70vh] md:min-h-screen flex items-center bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 text-white overflow-hidden">
      {/* Dynamic Media Background (video/image) */}
      {home.hero.type === 'video' && heroVideoUrl && !videoError && (
        <video
          ref={bgVideoRef}
          className="absolute inset-0 w-full h-full object-cover opacity-50"
          autoPlay={home.hero.autoplay ?? true}
          muted={home.hero.muted ?? true}
          loop={home.hero.loop ?? true}
          playsInline
          preload="metadata"
          poster={home.hero.posterUrl || undefined}
          onCanPlay={() => {
            if (home.hero.autoplay ?? true) {
              bgVideoRef.current?.play?.().catch(() => {});
            }
          }}
          onLoadedMetadata={() => {
            if (home.hero.autoplay ?? true) {
              bgVideoRef.current?.play?.().catch(() => {});
            }
          }}
          onError={() => setVideoError(true)}
        >
          <source
            src={heroVideoUrl}
            type={heroVideoUrl.startsWith('blob:')
              ? 'video/mp4'
              : (heroVideoUrl.startsWith('data:')
                  ? heroVideoUrl.substring(5, heroVideoUrl.indexOf(';'))
                  : (heroVideoUrl.endsWith('.webm')
                      ? 'video/webm'
                      : (heroVideoUrl.endsWith('.ogv') || heroVideoUrl.endsWith('.ogg')
                          ? 'video/ogg'
                          : 'video/mp4')))}
          />
        </video>
      )}
      {home.hero.type === 'video' && !heroVideoUrl && (
        <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-black/40 text-white z-10">
          <div className="text-center text-sm opacity-80">ویدیو آماده پخش نیست</div>
        </div>
      )}
      {home.hero.type === 'video' && videoError && (home.hero.posterUrl || home.hero.imageUrl) && (
        <img src={home.hero.posterUrl || home.hero.imageUrl!} alt={home.hero.title || ''} className="absolute inset-0 w-full h-full object-cover opacity-60" />
      )}
      {home.hero.type === 'image' && home.hero.imageUrl && (
        <img src={home.hero.imageUrl} alt={home.hero.title || ''} className="absolute inset-0 w-full h-full object-cover opacity-60" />
      )}

      {/* Overlay for readability */}
      {(home.hero.overlay ?? true) && (
        <div className="absolute inset-0 bg-black/40 z-10" />
      )}
      <div className="container mx-auto px-4 relative z-20 flex items-center justify-center">
        {/* Content */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <h1 className="text-5xl lg:text-7xl font-bold leading-tight text-white">
                {home.hero.title ? (
                  home.hero.title
                ) : language === 'fa' ? (
                  <>
                    پیشرو در تولید {" "}ژنراتورهای صنعتی
                  </>
                ) : (
                  <>
                    Leading in {" "}Industrial Generators
                  </>
                )}
          </h1>

          <p className="text-xl lg:text-2xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
            {home.hero.subtitle || company.description}
          </p>

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
      
    </section>
  );
};

export default ModernHero;
