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
      <div className="container mx-auto px-4 relative z-20 flex items-center justify-center">
        {/* Content */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
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

          <p className="text-xl lg:text-2xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
            {home.hero.subtitle || company.description}
          </p>
        </div>
      </div>
      
    </section>
  );
};

export default ModernHero;