import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, Shield, Award } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-br from-blue-900 via-blue-800 to-gray-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gray-500 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                راهکارهای
                <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                  {" "}انرژی پایدار
                </span>
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed">
                ما در شرکت انرژی پاک، با بیش از 15 سال تجربه، ارائه‌دهنده بهترین راهکارهای تولید و تامین انرژی برای صنایع و سازمان‌ها هستیم.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold">انرژی پایدار</h3>
                  <p className="text-sm text-gray-400">راهکارهای سبز</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold">قابلیت اطمینان</h3>
                  <p className="text-sm text-gray-400">تضمین کیفیت</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold">تجربه کاری</h3>
                  <p className="text-sm text-gray-400">+15 سال</p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4">
                درخواست مشاوره رایگان
                <ArrowRight className="w-5 h-5 mr-2" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-gray-400 text-gray-300 hover:bg-gray-800">
                مشاهده محصولات
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-700">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">500+</div>
                <div className="text-sm text-gray-400">پروژه موفق</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">15+</div>
                <div className="text-sm text-gray-400">سال تجربه</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">24/7</div>
                <div className="text-sm text-gray-400">پشتیبانی</div>
              </div>
            </div>
          </div>

          {/* Image/Visual */}
          <div className="relative">
            <div className="relative z-10 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 shadow-2xl">
              <img 
                src="/api/placeholder/600/400" 
                alt="تجهیزات انرژی" 
                className="w-full h-auto rounded-lg"
              />
              <div className="absolute -top-4 -right-4 bg-blue-600 text-white p-4 rounded-lg shadow-lg">
                <div className="text-2xl font-bold">100%</div>
                <div className="text-sm">تضمین کیفیت</div>
              </div>
            </div>
            {/* Floating Elements */}
            <div className="absolute top-10 -left-10 w-20 h-20 bg-blue-500 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute bottom-10 -right-10 w-16 h-16 bg-gray-500 rounded-full opacity-20 animate-pulse delay-1000"></div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gray-400 rounded-full mt-2"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;