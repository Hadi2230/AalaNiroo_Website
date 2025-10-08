import ModernHeader from '@/components/layout/ModernHeader';
import Footer from '@/components/layout/Footer';
import ChatWidget from '@/components/layout/ChatWidget';
import { useCTA } from '@/hooks/useCTA';
import { useMeetings } from '@/contexts/MeetingsContext';
import ContactForm from '@/components/sections/ContactForm';

export default function Contact() {
  const { showContactMessage, showAddressMessage } = useCTA();
  const { openModal } = useMeetings();
  return (
    <div className="min-h-screen">
      <ModernHeader />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-900 to-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold mb-6">تماس با ما</h1>
            <p className="text-xl leading-relaxed">
              ما همیشه آماده پاسخگویی به سوالات و درخواست‌های شما هستیم
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1"><ContactForm /></div>
            <div className="w-full md:w-80 space-y-3">
              <button className="w-full h-12 rounded-lg bg-blue-600 text-white hover:bg-blue-700" onClick={showContactMessage}>پیام تماس فوری</button>
              <button className="w-full h-12 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-50" onClick={showAddressMessage}>مشاهده آدرس</button>
              <button className="w-full h-12 rounded-lg border border-gray-300 hover:bg-gray-100" onClick={() => openModal()}>رزرو جلسه</button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <ChatWidget />
    </div>
  );
}