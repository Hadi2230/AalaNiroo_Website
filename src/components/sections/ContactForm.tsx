import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, Phone, Mail, MapPin } from 'lucide-react';
import { toast } from 'sonner';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    toast.success('پیام شما با موفقیت ارسال شد. به زودی با شما تماس خواهیم گرفت.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      service: '',
      message: ''
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="grid lg:grid-cols-2 gap-12">
      {/* Contact Form */}
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900">
            درخواست مشاوره رایگان
          </CardTitle>
          <p className="text-gray-600">
            فرم زیر را تکمیل کنید تا کارشناسان ما در اسرع وقت با شما تماس بگیرند.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">نام و نام خانوادگی *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="نام خود را وارد کنید"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">شماره تماس *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="09123456789"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">ایمیل</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="example@email.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">نام شرکت/سازمان</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => handleChange('company', e.target.value)}
                  placeholder="نام شرکت خود را وارد کنید"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="service">نوع خدمت مورد نیاز</Label>
              <Select onValueChange={(value) => handleChange('service', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="خدمت مورد نظر را انتخاب کنید" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="generator">ژنراتور دیزلی</SelectItem>
                  <SelectItem value="solar">سیستم خورشیدی</SelectItem>
                  <SelectItem value="wind">توربین بادی</SelectItem>
                  <SelectItem value="maintenance">نگهداری و تعمیرات</SelectItem>
                  <SelectItem value="consultation">مشاوره انرژی</SelectItem>
                  <SelectItem value="other">سایر</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">توضیحات پروژه</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => handleChange('message', e.target.value)}
                placeholder="لطفاً جزئیات پروژه و نیازهای خود را شرح دهید..."
                rows={4}
              />
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
              <Send className="w-4 h-4 mr-2" />
              ارسال درخواست
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <div className="space-y-8">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-6">اطلاعات تماس</h3>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Phone className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">تماس تلفنی</h4>
                <p className="text-gray-600">021-88776655</p>
                <p className="text-gray-600">021-88776656</p>
                <p className="text-sm text-blue-600 mt-1">پشتیبانی 24 ساعته</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">ایمیل</h4>
                <p className="text-gray-600">info@energyco.ir</p>
                <p className="text-gray-600">support@energyco.ir</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">آدرس دفتر مرکزی</h4>
                <p className="text-gray-600">تهران، خیابان ولیعصر، پلاک 123، طبقه 5</p>
              </div>
            </div>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <MapPin className="w-12 h-12 mx-auto mb-2" />
            <p>نقشه گوگل</p>
          </div>
        </div>

        {/* Working Hours */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">ساعات کاری</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>شنبه تا چهارشنبه:</span>
                <span>8:00 - 17:00</span>
              </div>
              <div className="flex justify-between">
                <span>پنج‌شنبه:</span>
                <span>8:00 - 13:00</span>
              </div>
              <div className="flex justify-between">
                <span>جمعه:</span>
                <span>تعطیل</span>
              </div>
              <div className="flex justify-between text-blue-600 font-medium">
                <span>پشتیبانی اضطراری:</span>
                <span>24/7</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContactForm;
