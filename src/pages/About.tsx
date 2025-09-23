import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ChatWidget from '@/components/layout/ChatWidget';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target, Eye, Award, Users, Calendar, MapPin } from 'lucide-react';

export default function About() {
  const milestones = [
    { year: '2008', event: 'تأسیس شرکت انرژی پاک' },
    { year: '2012', event: 'اولین پروژه بزرگ صنعتی' },
    { year: '2016', event: 'گسترش به حوزه انرژی‌های تجدیدپذیر' },
    { year: '2020', event: 'دریافت گواهینامه ISO 9001' },
    { year: '2024', event: 'بیش از 500 پروژه موفق' }
  ];

  const team = [
    {
      name: 'مهندس احمد محمدی',
      position: 'مدیرعامل',
      experience: '20 سال تجربه',
      image: '/api/placeholder/200/200'
    },
    {
      name: 'مهندس فاطمه کریمی',
      position: 'مدیر فنی',
      experience: '15 سال تجربه',
      image: '/api/placeholder/200/200'
    },
    {
      name: 'مهندس علی رضایی',
      position: 'مدیر فروش',
      experience: '12 سال تجربه',
      image: '/api/placeholder/200/200'
    },
    {
      name: 'مهندس مریم احمدی',
      position: 'مدیر پروژه',
      experience: '10 سال تجربه',
      image: '/api/placeholder/200/200'
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-900 to-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold mb-6">درباره انرژی پاک</h1>
            <p className="text-xl leading-relaxed">
              ما در شرکت انرژی پاک، با بیش از 15 سال تجربه در صنعت انرژی، 
              متعهد به ارائه بهترین راهکارهای تولید و تامین انرژی پایدار هستیم.
            </p>
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">داستان ما</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  شرکت انرژی پاک در سال 2008 با هدف ارائه راهکارهای نوین و پایدار در حوزه انرژی تأسیس شد. 
                  از همان ابتدا، تمرکز ما بر کیفیت، نوآوری و رضایت مشتری بوده است.
                </p>
                <p>
                  طی این سال‌ها، ما توانسته‌ایم با ارائه محصولات و خدمات باکیفیت، 
                  اعتماد بیش از 500 مشتری در سراسر کشور را جلب کنیم و پروژه‌های موفق متعددی را اجرا نماییم.
                </p>
                <p>
                  امروزه، انرژی پاک به عنوان یکی از پیشروان صنعت انرژی در ایران شناخته می‌شود 
                  و همچنان در مسیر رشد و توسعه قرار دارد.
                </p>
              </div>
            </div>
            <div className="relative">
              <img 
                src="/api/placeholder/600/400" 
                alt="تاریخچه شرکت" 
                className="rounded-lg shadow-xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-blue-600 text-white p-6 rounded-lg shadow-lg">
                <div className="text-3xl font-bold">15+</div>
                <div className="text-sm">سال تجربه</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8 hover:shadow-xl transition-shadow">
              <CardContent className="p-0">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <Target className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">ماموریت ما</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  ارائه راهکارهای نوآورانه و پایدار در حوزه انرژی با هدف کمک به توسعه صنعتی کشور 
                  و حفظ محیط زیست. ما متعهد به ارائه محصولات و خدمات باکیفیت هستیم که نیازهای 
                  مشتریان را به بهترین شکل پاسخ دهد.
                </p>
              </CardContent>
            </Card>

            <Card className="p-8 hover:shadow-xl transition-shadow">
              <CardContent className="p-0">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <Eye className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">چشم‌انداز ما</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  تبدیل شدن به پیشرو و مرجع اصلی در صنعت انرژی ایران و منطقه، 
                  با تمرکز بر فناوری‌های پیشرفته و انرژی‌های تجدیدپذیر. 
                  ما در تلاش هستیم تا آینده‌ای پایدار و سبز برای نسل‌های آینده ایجاد کنیم.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">مسیر رشد ما</h2>
            <p className="text-xl text-gray-600">نگاهی به مهم‌ترین دستاوردهای ما</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-blue-200"></div>
              
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex items-center mb-8 ${index % 2 === 0 ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pl-8 text-right' : 'pr-8'}`}>
                    <Card className="p-6 hover:shadow-lg transition-shadow">
                      <CardContent className="p-0">
                        <Badge className="bg-blue-600 text-white mb-2">{milestone.year}</Badge>
                        <p className="text-gray-700 font-medium">{milestone.event}</p>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">تیم مدیریت</h2>
            <p className="text-xl text-gray-600">آشنایی با مدیران و کارشناسان مجرب ما</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-xl transition-shadow">
                <CardContent className="p-0">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-blue-600 font-medium mb-1">{member.position}</p>
                  <p className="text-gray-500 text-sm">{member.experience}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-blue-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">ارزش‌های ما</h2>
            <p className="text-xl">اصولی که ما را در مسیر موفقیت هدایت می‌کند</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">کیفیت</h3>
              <p className="text-gray-300">تعهد به ارائه بالاترین کیفیت در تمام محصولات و خدمات</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">مشتری‌محوری</h3>
              <p className="text-gray-300">قرار دادن رضایت و نیازهای مشتری در اولویت</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">تعهد</h3>
              <p className="text-gray-300">وفاداری به قول‌ها و تحویل به موقع پروژه‌ها</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">پایداری</h3>
              <p className="text-gray-300">تمرکز بر راهکارهای سازگار با محیط زیست</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <ChatWidget />
    </div>
  );
}
