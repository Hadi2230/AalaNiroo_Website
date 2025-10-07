import React, { useEffect, useRef, useState } from 'react';
import { useMediaUrl } from '@/hooks/useMediaUrl';
// Buttons removed per design change
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
    <section className="relative min-h-[70vh] md:min-h-screen flex items-center bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 text-white overflow-hidden">
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
        </div>
      </div>
      
    </section>
  );
};

export default ModernHero;