import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'fa' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: 'rtl' | 'ltr';
}

const translations = {
  fa: {
    // Navigation
    'nav.home': 'خانه',
    'nav.products': 'محصولات',
    'nav.services': 'خدمات',
    'nav.projects': 'پروژه‌ها',
    'nav.blog': 'مقالات',
    'nav.about': 'درباره ما',
    'nav.contact': 'تماس با ما',
    
    // Hero Section
    'hero.title': 'پیشرو در تولید ژنراتورهای صنعتی',
    'hero.subtitle': 'با بیش از 33 سال تجربه، نماینده رسمی FG Wilson و Cummins در ایران',
    'hero.cta.quote': 'درخواست پیش‌فاکتور',
    'hero.cta.call': 'تماس فوری',
    'hero.cta.service': 'رزرو سرویس',
    
    // Common
    'common.readMore': 'ادامه مطلب',
    'common.viewAll': 'مشاهده همه',
    'common.contactUs': 'تماس با ما',
    'common.learnMore': 'اطلاعات بیشتر',
    'common.getQuote': 'دریافت قیمت',
    'common.download': 'دانلود',
    'common.search': 'جستجو',
    'common.filter': 'فیلتر',
    'common.sort': 'مرتب‌سازی',
    'common.loading': 'در حال بارگذاری...',
    'common.error': 'خطا در بارگذاری',
    
    // Products
    'products.title': 'محصولات ما',
    'products.subtitle': 'طیف کاملی از ژنراتورها و تجهیزات برق',
    'products.power': 'قدرت',
    'products.cylinders': 'تعداد سیلندر',
    'products.fuel': 'نوع سوخت',
    'products.brand': 'برند',
    'products.warranty': 'گارانتی',
    'products.applications': 'کاربردها',
    'products.features': 'ویژگی‌ها',
    'products.specifications': 'مشخصات فنی',
    'products.catalog': 'کاتالوگ',
    
    // Services
    'services.title': 'خدمات ما',
    'services.subtitle': 'خدمات جامع از مشاوره تا پشتیبانی',
    
    // Projects
    'projects.title': 'پروژه‌های اجرا شده',
    'projects.subtitle': 'نمونه‌ای از موفق‌ترین پروژه‌های ما',
    'projects.capacity': 'ظرفیت',
    'projects.location': 'موقعیت',
    'projects.client': 'کارفرما',
    'projects.year': 'سال اجرا',
    'projects.status': 'وضعیت',
    'projects.duration': 'مدت اجرا',
    
    // Contact
    'contact.title': 'تماس با ما',
    'contact.subtitle': 'آماده پاسخگویی به شما هستیم',
    'contact.form.name': 'نام و نام خانوادگی',
    'contact.form.email': 'ایمیل',
    'contact.form.phone': 'شماره تماس',
    'contact.form.company': 'نام شرکت',
    'contact.form.message': 'پیام شما',
    'contact.form.submit': 'ارسال پیام',
    'contact.info.phone': 'تلفن',
    'contact.info.email': 'ایمیل',
    'contact.info.address': 'آدرس',
    
    // Footer
    'footer.quickLinks': 'لینک‌های سریع',
    'footer.products': 'محصولات',
    'footer.services': 'خدمات',
    'footer.contact': 'اطلاعات تماس',
    'footer.followUs': 'ما را دنبال کنید',
    'footer.rights': 'تمامی حقوق محفوظ است'
  },
  
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.products': 'Products',
    'nav.services': 'Services', 
    'nav.projects': 'Projects',
    'nav.blog': 'Blog',
    'nav.about': 'About Us',
    'nav.contact': 'Contact',
    
    // Hero Section
    'hero.title': 'Leading Industrial Generator Manufacturer',
    'hero.subtitle': 'Over 33 years of experience, official representative of FG Wilson & Cummins in Iran',
    'hero.cta.quote': 'Request Quote',
    'hero.cta.call': 'Call Now',
    'hero.cta.service': 'Book Service',
    
    // Common
    'common.readMore': 'Read More',
    'common.viewAll': 'View All',
    'common.contactUs': 'Contact Us',
    'common.learnMore': 'Learn More',
    'common.getQuote': 'Get Quote',
    'common.download': 'Download',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.sort': 'Sort',
    'common.loading': 'Loading...',
    'common.error': 'Loading Error',
    
    // Products
    'products.title': 'Our Products',
    'products.subtitle': 'Complete range of generators and power equipment',
    'products.power': 'Power',
    'products.cylinders': 'Cylinders',
    'products.fuel': 'Fuel Type',
    'products.brand': 'Brand',
    'products.warranty': 'Warranty',
    'products.applications': 'Applications',
    'products.features': 'Features',
    'products.specifications': 'Technical Specifications',
    'products.catalog': 'Catalog',
    
    // Services
    'services.title': 'Our Services',
    'services.subtitle': 'Comprehensive services from consultation to support',
    
    // Projects
    'projects.title': 'Completed Projects',
    'projects.subtitle': 'Examples of our most successful projects',
    'projects.capacity': 'Capacity',
    'projects.location': 'Location',
    'projects.client': 'Client',
    'projects.year': 'Year',
    'projects.status': 'Status',
    'projects.duration': 'Duration',
    
    // Contact
    'contact.title': 'Contact Us',
    'contact.subtitle': 'We are ready to answer your questions',
    'contact.form.name': 'Full Name',
    'contact.form.email': 'Email',
    'contact.form.phone': 'Phone Number',
    'contact.form.company': 'Company Name',
    'contact.form.message': 'Your Message',
    'contact.form.submit': 'Send Message',
    'contact.info.phone': 'Phone',
    'contact.info.email': 'Email',
    'contact.info.address': 'Address',
    
    // Footer
    'footer.quickLinks': 'Quick Links',
    'footer.products': 'Products',
    'footer.services': 'Services',
    'footer.contact': 'Contact Info',
    'footer.followUs': 'Follow Us',
    'footer.rights': 'All rights reserved'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('fa');

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang && (savedLang === 'fa' || savedLang === 'en')) {
      setLanguage(savedLang);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'fa' ? 'rtl' : 'ltr';
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  const dir = language === 'fa' ? 'rtl' : 'ltr';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
