import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { useCTA } from '@/hooks/useCTA';
import { useMeetings } from '@/contexts/MeetingsContext';
import { Menu, X, Phone, Mail, Globe, ChevronDown } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCompany } from '@/contexts/CompanyContext';

const ModernHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { language, setLanguage, t, dir } = useLanguage();
  const { companyData } = useCompany();
  const { showContactMessage } = useCTA();
  const { openModal } = useMeetings();

  const NAV_ITEMS = useMemo(() => (
    [
      { key: 'home', href: '/' },
      { key: 'products', href: '/products' },
      { key: 'services', href: '/services' },
      { key: 'projects', href: '/projects' },
      { key: 'blog', href: '/blog' },
      { key: 'about', href: '/about' },
      { key: 'contact', href: '/contact' },
    ] as const
  ), []);

  const navigation = useMemo(() => NAV_ITEMS.map(i => ({
    key: i.key,
    href: i.href,
    name: t(`nav.${i.key}` as any),
  })), [NAV_ITEMS, t]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;
  const company = companyData[language];

  return (
    <>
      {/* Top Bar removed for a clean text-only header */}

      {/* Main Header */}
      <header className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black/40 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-4">
              {company.logoUrl ? (
                <img src={company.logoUrl} alt={company.name} className="w-16 h-16 md:w-20 md:h-20 object-contain" />
              ) : (
                <div className="w-16 h-16 md:w-20 md:h-20 bg-white/10 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">A</span>
                </div>
              )}
              <div className={dir === 'rtl' ? 'text-right' : 'text-left'}>
                <h1 className={`text-xl font-bold ${isScrolled ? 'text-white' : 'text-white'}`}>{company.name}</h1>
                <p className={`text-sm hidden lg:block ${isScrolled ? 'text-gray-200' : 'text-gray-200'}`}>{company.tagline}</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navigation.map((item) => (
                <Link
                  key={item.key}
                  to={item.href}
                  className={`font-medium transition-colors relative ${
                    isActive(item.href) ? 'text-cyan-300' : (isScrolled ? 'text-white/90 hover:text-cyan-200' : 'text-white/90 hover:text-cyan-200')
                  }`}
                >
                  {item.name}
                  {isActive(item.href) && (
                    <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-cyan-300"></div>
                  )}
                </Link>
              ))}
            </nav>

            {/* CTA Buttons */}
            <div className="hidden lg:flex items-center gap-4">
              <Link to="/admin/login">
                <Button variant="outline" className="border-white/40 text-white hover:bg-white/10">
                  پنل فروش
                </Button>
              </Link>
              <Button variant="outline" className="border-white/40 text-white hover:bg-white/10" onClick={() => openModal()}>
                {t('hero.cta.quote')}
              </Button>
              <Button className="bg-cyan-500 hover:bg-cyan-600 text-white" onClick={showContactMessage}>
                <Phone className="w-4 h-4 mr-2" />
                {t('hero.cta.call')}
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-black/80 backdrop-blur-md border-t border-white/10 shadow-lg">
            <div className="container mx-auto px-4 py-4">
              <nav className="flex flex-col gap-4">
                {navigation.map((item) => (
                  <Link
                    key={item.key}
                    to={item.href}
                    className={`font-medium py-2 ${
                      isActive(item.href) ? 'text-cyan-300' : 'text-white/90 hover:text-cyan-200'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="flex flex-col gap-2 mt-4">
                  <Link to="/admin/login">
                    <Button variant="outline" className="border-white/40 text-white w-full hover:bg-white/10">
                      پنل فروش
                    </Button>
                  </Link>
                  <Button variant="outline" className="border-white/40 text-white w-full hover:bg-white/10" onClick={() => openModal()}>
                    {t('hero.cta.quote')}
                  </Button>
                  <Button className="bg-cyan-500 hover:bg-cyan-600 text-white w-full" onClick={showContactMessage}>
                    <Phone className="w-4 h-4 mr-2" />
                    {t('hero.cta.call')}
                  </Button>
                </div>
              </nav>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default ModernHeader;