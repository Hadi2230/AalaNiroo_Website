import ModernHeader from '@/components/layout/ModernHeader';
import Footer from '@/components/layout/Footer';
import ChatWidget from '@/components/layout/ChatWidget';
import ContactForm from '@/components/sections/ContactForm';

export default function Contact() {
  return (
    <div className="min-h-screen">
      <ModernHeader />
      <main className="page-bg">
      
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
          <ContactForm />
        </div>
      </section>

      </main>
      <Footer />
      <ChatWidget />
    </div>
  );
}