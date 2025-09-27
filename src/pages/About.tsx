import ModernHeader from '@/components/layout/ModernHeader';
import Footer from '@/components/layout/Footer';
import ChatWidget from '@/components/layout/ChatWidget';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Target, Eye, Award, Users, Calendar, MapPin, Building, Zap, Shield, CheckCircle, Image, X, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCompany } from '@/contexts/CompanyContext';
import { useMedia } from '@/contexts/MediaContext';
import { useState } from 'react';

export default function About() {
  const { language, t } = useLanguage();
  const { companyData } = useCompany();
  const { getGalleryImages } = useMedia();
  const company = companyData[language];
  const galleryImages = getGalleryImages();
  
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [showGalleryModal, setShowGalleryModal] = useState(false);

  // Helper function for file size formatting
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Helper function for date formatting
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fa-IR');
  };

  const milestones = language === 'fa' ? [
    { year: '1369', event: 'تأسیس شرکت اعلا نیرو' },
    { year: '1375', event: 'نمایندگی رسمی FG Wilson' },
    { year: '1380', event: 'نمایندگی رسمی Cummins' },
    { year: '1390', event: 'گسترش به سراسر کشور' },
    { year: '1400', event: 'بیش از 500 پروژه موفق' },
    { year: '1403', event: 'راه‌اندازی سیستم مدیریت دیجیتال' }
  ] : [
    { year: '1990', event: 'Establishment of Aalaniroo Company' },
    { year: '1996', event: 'Official FG Wilson Representative' },
    { year: '2001', event: 'Official Cummins Representative' },
    { year: '2011', event: 'Nationwide Expansion' },
    { year: '2021', event: 'Over 500 Successful Projects' },
    { year: '2024', event: 'Digital Management System Launch' }
  ];

  const team = language === 'fa' ? [
    {
      name: 'مهندس احمد محمدی',
      position: 'مدیرعامل',
      experience: '25 سال تجربه',
      image: '/api/placeholder/200/200',
      description: 'متخصص ژنراتورهای صنعتی و مدیریت پروژه‌های بزرگ'
    },
    {
      name: 'مهندس فاطمه کریمی',
      position: 'مدیر فنی',
      experience: '18 سال تجربه',
      image: '/api/placeholder/200/200',
      description: 'کارشناس سیستم‌های برق و انرژی پایدار'
    },
    {
      name: 'مهندس علی رضایی',
      position: 'مدیر فروش',
      experience: '15 سال تجربه',
      image: '/api/placeholder/200/200',
      description: 'متخصص مشاوره فنی و فروش تجهیزات صنعتی'
    },
    {
      name: 'مهندس مریم احمدی',
      position: 'مدیر پروژه',
      experience: '12 سال تجربه',
      image: '/api/placeholder/200/200',
      description: 'کارشناس مدیریت پروژه و کنترل کیفیت'
    }
  ] : [
    {
      name: 'Eng. Ahmad Mohammadi',
      position: 'CEO',
      experience: '25 Years Experience',
      image: '/api/placeholder/200/200',
      description: 'Industrial generator specialist and large project management expert'
    },
    {
      name: 'Eng. Fatemeh Karimi',
      position: 'Technical Manager',
      experience: '18 Years Experience',
      image: '/api/placeholder/200/200',
      description: 'Power systems and sustainable energy specialist'
    },
    {
      name: 'Eng. Ali Rezaei',
      position: 'Sales Manager',
      experience: '15 Years Experience',
      image: '/api/placeholder/200/200',
      description: 'Technical consulting and industrial equipment sales specialist'
    },
    {
      name: 'Eng. Maryam Ahmadi',
      position: 'Project Manager',
      experience: '12 Years Experience',
      image: '/api/placeholder/200/200',
      description: 'Project management and quality control specialist'
    }
  ];

  const values = language === 'fa' ? [
    {
      icon: Target,
      title: 'تعهد به کیفیت',
      description: 'ارائه بالاترین کیفیت محصولات و خدمات'
    },
    {
      icon: Users,
      title: 'مشتری‌مداری',
      description: 'رضایت مشتری در اولویت اول'
    },
    {
      icon: Award,
      title: 'تخصص و تجربه',
      description: 'بیش از 33 سال تجربه در صنعت'
    },
    {
      icon: Shield,
      title: 'قابلیت اطمینان',
      description: 'پشتیبانی 24/7 و گارانتی معتبر'
    }
  ] : [
    {
      icon: Target,
      title: 'Quality Commitment',
      description: 'Delivering highest quality products and services'
    },
    {
      icon: Users,
      title: 'Customer Focus',
      description: 'Customer satisfaction as top priority'
    },
    {
      icon: Award,
      title: 'Expertise & Experience',
      description: 'Over 33 years of industry experience'
    },
    {
      icon: Shield,
      title: 'Reliability',
      description: '24/7 support and valid warranty'
    }
  ];

  const openGalleryModal = (index: number) => {
    setSelectedImageIndex(index);
    setShowGalleryModal(true);
  };

  const nextImage = () => {
    if (selectedImageIndex !== null && selectedImageIndex < galleryImages.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1);
    }
  };

  const prevImage = () => {
    if (selectedImageIndex !== null && selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  const currentImage = selectedImageIndex !== null ? galleryImages[selectedImageIndex] : null;

  return (
    <div className="min-h-screen">
      <ModernHeader />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-900 to-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-blue-100 text-blue-800 mb-6">
                {language === 'fa' ? 'درباره ما' : 'About Us'}
              </Badge>
              <h1 className="text-5xl font-bold mb-6">
                {language === 'fa' ? 'درباره شرکت اعلا نیرو' : 'About Aalaniroo Company'}
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed mb-8">
                {company.description}
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-400 mb-2">33+</div>
                  <div className="text-gray-300">{language === 'fa' ? 'سال تجربه' : 'Years Experience'}</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-400 mb-2">500+</div>
                  <div className="text-gray-300">{language === 'fa' ? 'پروژه موفق' : 'Successful Projects'}</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img 
                src="/api/placeholder/600/400" 
                alt={language === 'fa' ? 'شرکت اعلا نیرو' : 'Aalaniroo Company'} 
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Company Values */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {language === 'fa' ? 'ارزش‌های ما' : 'Our Values'}
            </h2>
            <p className="text-xl text-gray-600">
              {language === 'fa' ? 'اصول و ارزش‌هایی که ما را هدایت می‌کنند' : 'Principles and values that guide us'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center group hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <CardContent className="p-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <value.icon className="w-10 h-10 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Company Gallery */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-blue-100 text-blue-800 mb-4">
              <Image className="w-4 h-4 mr-2" />
              {language === 'fa' ? 'گالری شرکت' : 'Company Gallery'}
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {language === 'fa' ? 'نگاهی به شرکت ما' : 'A Look at Our Company'}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {language === 'fa' 
                ? 'مجموعه‌ای از تصاویر شرکت، تیم ما، تجهیزات و فضای کاری' 
                : 'A collection of company images, our team, equipment and workspace'
              }
            </p>
          </div>

          {galleryImages.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {galleryImages.slice(0, 12).map((image, index) => (
                <Card 
                  key={image.id} 
                  className="group cursor-pointer overflow-hidden hover:shadow-xl transition-all duration-300"
                  onClick={() => openGalleryModal(index)}
                >
                  <div className="aspect-square relative overflow-hidden">
                    <img
                      src={image.url}
                      alt={image.alt}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <ZoomIn className="w-8 h-8 text-white" />
                    </div>
                    {image.isFavorite && (
                      <div className="absolute top-2 right-2">
                        <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                          <Award className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                  {image.description && (
                    <CardContent className="p-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {image.description}
                      </p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-white/80 backdrop-blur-sm border-2 border-dashed border-gray-300">
              <CardContent className="p-12 text-center">
                <Image className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  {language === 'fa' ? 'گالری خالی است' : 'Gallery is Empty'}
                </h3>
                <p className="text-gray-500 mb-6">
                  {language === 'fa' 
                    ? 'هنوز تصویری در گالری شرکت آپلود نشده است'
                    : 'No images have been uploaded to the company gallery yet'
                  }
                </p>
                <Button
                  onClick={() => window.open('/admin/media', '_blank')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {language === 'fa' ? 'آپلود تصاویر' : 'Upload Images'}
                </Button>
              </CardContent>
            </Card>
          )}

          {galleryImages.length > 12 && (
            <div className="text-center mt-12">
              <Button
                onClick={() => setShowGalleryModal(true)}
                size="lg"
                variant="outline"
              >
                <Eye className="w-5 h-5 mr-2" />
                {language === 'fa' ? 'مشاهده همه تصاویر' : 'View All Images'} ({galleryImages.length})
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {language === 'fa' ? 'تاریخچه شرکت' : 'Company History'}
            </h2>
            <p className="text-xl text-gray-600">
              {language === 'fa' ? 'سیر تکامل و رشد شرکت اعلا نیرو' : 'Evolution and growth of Aalaniroo Company'}
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-600 to-purple-600"></div>
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                  <Card className={`w-full max-w-md ${index % 2 === 0 ? 'mr-auto lg:mr-8' : 'ml-auto lg:ml-8'} group hover:shadow-xl transition-all duration-300`}>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                          {milestone.year}
                        </div>
                        <div className="flex-1">
                          <div className="text-lg font-semibold text-gray-900 mb-2">
                            {milestone.event}
                          </div>
                          <div className="text-sm text-gray-500">
                            {language === 'fa' ? 'سال ' : 'Year '}{milestone.year}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {language === 'fa' ? 'تیم ما' : 'Our Team'}
            </h2>
            <p className="text-xl text-gray-600">
              {language === 'fa' ? 'متخصصان مجرب و متعهد شرکت اعلا نیرو' : 'Experienced and dedicated specialists of Aalaniroo'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center group hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <CardContent className="p-6">
                  <div className="relative mb-6">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-32 h-32 rounded-full mx-auto object-cover shadow-lg group-hover:shadow-xl transition-shadow"
                    />
                    <div className="absolute inset-0 rounded-full border-4 border-blue-600/20 group-hover:border-blue-600/40 transition-colors"></div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                  <div className="text-blue-600 font-medium mb-2">{member.position}</div>
                  <div className="text-sm text-gray-500 mb-4">{member.experience}</div>
                  <p className="text-sm text-gray-600 leading-relaxed">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            {language === 'fa' ? 'آماده همکاری با شما هستیم' : 'Ready to Work with You'}
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            {language === 'fa' 
              ? 'برای مشاوره رایگان و دریافت بهترین راه‌حل انرژی، همین امروز با ما تماس بگیرید'
              : 'Contact us today for free consultation and the best energy solutions'
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <MapPin className="w-5 h-5 mr-2" />
              {t('contact.info.address')}
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              <Calendar className="w-5 h-5 mr-2" />
              {language === 'fa' ? 'رزرو جلسه' : 'Book Meeting'}
            </Button>
          </div>
        </div>
      </section>

      {/* Gallery Modal */}
      <Dialog open={showGalleryModal} onOpenChange={setShowGalleryModal}>
        <DialogContent className="max-w-6xl max-h-[90vh] p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Image className="w-5 h-5" />
                {language === 'fa' ? 'گالری شرکت' : 'Company Gallery'}
              </span>
              <div className="flex items-center gap-2">
                {currentImage && (
                  <Badge variant="outline">
                    {(selectedImageIndex || 0) + 1} از {galleryImages.length}
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowGalleryModal(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="relative">
            {currentImage ? (
              <div className="relative">
                <img
                  src={currentImage.url}
                  alt={currentImage.alt}
                  className="w-full h-[60vh] object-contain bg-gray-100 dark:bg-gray-800"
                />
                
                {/* Navigation Arrows */}
                {galleryImages.length > 1 && (
                  <>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute left-4 top-1/2 transform -translate-y-1/2"
                      onClick={prevImage}
                      disabled={selectedImageIndex === 0}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute right-4 top-1/2 transform -translate-y-1/2"
                      onClick={nextImage}
                      disabled={selectedImageIndex === galleryImages.length - 1}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </>
                )}

                {/* Image Info */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                  <div className="text-white">
                    <h3 className="text-lg font-semibold mb-1">{currentImage.name}</h3>
                    {currentImage.description && (
                      <p className="text-sm opacity-90">{currentImage.description}</p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-xs opacity-75">
                      <span>{formatFileSize(currentImage.size)}</span>
                      {currentImage.dimensions && (
                        <span>{currentImage.dimensions.width} × {currentImage.dimensions.height}</span>
                      )}
                      <span>{formatDate(currentImage.uploadedAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-[60vh] flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <Image className="w-16 h-16 mx-auto mb-4" />
                  <p>{language === 'fa' ? 'تصویری یافت نشد' : 'No image found'}</p>
                </div>
              </div>
            )}

            {/* Thumbnail Strip */}
            {galleryImages.length > 1 && (
              <div className="p-4 bg-gray-100 dark:bg-gray-800 border-t">
                <div className="flex gap-2 overflow-x-auto">
                  {galleryImages.map((image, index) => (
                    <button
                      key={image.id}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        index === selectedImageIndex 
                          ? 'border-blue-500 scale-110' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <img
                        src={image.url}
                        alt={image.alt}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
      <ChatWidget />
    </div>
  );
}