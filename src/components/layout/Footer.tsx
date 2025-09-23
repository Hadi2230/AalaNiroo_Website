import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">E</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">انرژی پاک</h3>
                <p className="text-sm text-gray-400">راهکارهای انرژی پایدار</p>
              </div>
            </div>
            <p className="text-gray-300 mb-4">
              ما در شرکت انرژی پاک، ارائه‌دهنده راهکارهای نوین و پایدار در زمینه تولید و تامین انرژی هستیم.
            </p>
            <div className="flex gap-4">
              <Facebook className="w-5 h-5 text-gray-400 hover:text-blue-500 cursor-pointer" />
              <Twitter className="w-5 h-5 text-gray-400 hover:text-blue-400 cursor-pointer" />
              <Instagram className="w-5 h-5 text-gray-400 hover:text-pink-500 cursor-pointer" />
              <Linkedin className="w-5 h-5 text-gray-400 hover:text-blue-600 cursor-pointer" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">لینک‌های سریع</h4>
            <ul className="space-y-3">
              <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">خانه</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-white transition-colors">درباره ما</Link></li>
              <li><Link to="/products" className="text-gray-300 hover:text-white transition-colors">محصولات</Link></li>
              <li><Link to="/projects" className="text-gray-300 hover:text-white transition-colors">پروژه‌ها</Link></li>
              <li><Link to="/services" className="text-gray-300 hover:text-white transition-colors">خدمات</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-6">خدمات ما</h4>
            <ul className="space-y-3">
              <li><span className="text-gray-300">ژنراتورهای دیزلی</span></li>
              <li><span className="text-gray-300">سیستم‌های خورشیدی</span></li>
              <li><span className="text-gray-300">توربین‌های بادی</span></li>
              <li><span className="text-gray-300">نگهداری و تعمیرات</span></li>
              <li><span className="text-gray-300">مشاوره انرژی</span></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6">اطلاعات تماس</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                <span className="text-gray-300">تهران، خیابان ولیعصر، پلاک 123، طبقه 5</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <span className="text-gray-300">021-88776655</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <span className="text-gray-300">info@energyco.ir</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 شرکت انرژی پاک. تمامی حقوق محفوظ است.
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-gray-400 hover:text-white text-sm">حریم خصوصی</Link>
              <Link to="/terms" className="text-gray-400 hover:text-white text-sm">شرایط استفاده</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;