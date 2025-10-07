import React, { useEffect, useRef, useState } from 'react';
import { useMediaUrl } from '@/hooks/useMediaUrl';
import { Button } from '@/components/ui/button';
import { ArrowRight, Phone, FileText } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCompany } from '@/contexts/CompanyContext';
import { useHomeContent } from '@/contexts/HomeContentContext';

const ModernHero = () => {
  const { language, t, dir } = useLanguage();
  const { companyData } = useCompany();
  const { content: home } = useHomeContent();
  const company = companyData[language];
  const bgVideoRef = useRef<HTMLVideoElement | null>(null);
  const [videoError, setVideoError] = useState(false);
  const heroVideoUrl = useMediaUrl(home.hero.type === 'video' ? home.hero.videoUrl : undefined);

  useEffect(() => {
    // Ensure autoplay tries to start when allowed (muted inline)
    if (home.hero.type === 'video' && heroVideoUrl && (home.hero.autoplay ?? true)) {
      const el = bgVideoRef.current;
      if (el) {
        // Force muted for autoplay compliance if not explicitly false
        if (home.hero.muted !== false) {
          el.muted = true;
        }
        el.play().catch(() => {
          // Autoplay might be blocked; we'll try again on canplay
        });
      }
    }
  }, [home.hero.type, heroVideoUrl, home.hero.autoplay, home.hero.muted]);

  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 text-white overflow-hidden">
      {/* Dynamic Media Background */}
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
      {home.hero.type === 'video' && videoError && (home.hero.posterUrl || home.hero.imageUrl) && (
        <img src={home.hero.posterUrl || home.hero.imageUrl!} alt={home.hero.title || ''} className="absolute inset-0 w-full h-full object-cover opacity-60" />
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
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4 group" onClick={() => {
                const msg = company.quoteMessage || (language === 'fa' ? 'درخواست پیش‌فاکتور ثبت شد.' : 'Quote request submitted.');
                // inline toast fallback if toast not globally available
                try {
                  // @ts-ignore
                  if (window?.sonner?.toast) {
                    // @ts-ignore
                    window.sonner.toast.success(msg);
                  } else {
                    alert(msg);
                  }
                } catch {
                  alert(msg);
                }
              }}>
                <FileText className={`w-5 h-5 ${dir === 'rtl' ? 'ml-2' : 'mr-2'}`} />
                {home.hero.ctaText || (language === 'fa' ? 'درخواست پیش‌فاکتور' : t('hero.cta.quote'))}
                <ArrowRight className={`w-5 h-5 ${dir === 'rtl' ? 'mr-2' : 'ml-2'} group-hover:translate-x-1 transition-transform`} />
              </Button>
              
              <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-gray-400 text-white hover:bg-white hover:text-gray-900" onClick={() => { if (company.phone) window.open(`tel:${company.phone}`, '_self'); }}>
                <Phone className={`w-5 h-5 ${dir === 'rtl' ? 'ml-2' : 'mr-2'}`} />
                {home.hero.callText || t('hero.cta.call')}
              </Button>
            </div>

            
          </div>
        </div>
      </div>
      
    </section>
  );
};

export default ModernHero;