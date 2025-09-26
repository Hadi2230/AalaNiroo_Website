import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Phone, Mail } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'خانه', href: '/' },
    { name: 'درباره ما', href: '/about' },
    { name: 'محصولات', href: '/products' },
    { name: 'پروژه‌ها', href: '/projects' },
    { name: 'خدمات', href: '/services' },
    { name: 'وبلاگ', href: '/blog' },
    { name: 'تماس با ما', href: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Top Bar */}
      <div className="bg-gray-900 text-white py-2 px-4">
        <div className="container mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>021-88776655</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span>info@energyco.ir</span>
            </div>
          </div>
          <div className="hidden md:block">
            <span>پشتیبانی 24/7 در خدمت شما</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">E</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">انرژی پاک</h1>
                <p className="text-sm text-gray-600">راهکارهای انرژی پایدار</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`text-gray-700 hover:text-blue-600 font-medium transition-colors ${
                    isActive(item.href) ? 'text-blue-600 border-b-2 border-blue-600 pb-1' : ''
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* CTA Button */}
            <div className="hidden lg:flex items-center gap-4">
              <Button className="bg-blue-600 hover:bg-blue-700">
                درخواست مشاوره
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
          <div className="lg:hidden bg-white border-t">
            <div className="container mx-auto px-4 py-4">
              <nav className="flex flex-col gap-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`text-gray-700 hover:text-blue-600 font-medium py-2 ${
                      isActive(item.href) ? 'text-blue-600' : ''
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <Button className="bg-blue-600 hover:bg-blue-700 mt-4">
                  درخواست مشاوره
                </Button>
              </nav>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;