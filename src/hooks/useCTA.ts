import { useLanguage } from '@/contexts/LanguageContext';
import { useCompany } from '@/contexts/CompanyContext';
import { toast } from 'sonner';
import { useCTAModal } from '@/contexts/CTAModalContext';

export function useCTA() {
  const { language } = useLanguage();
  const { companyData } = useCompany();
  const company = companyData[language];
  const { openContactModal } = useCTAModal();

  const showQuoteMessage = () => {
    const message = company.quoteMessage || (language === 'fa' ? 'درخواست پیش‌فاکتور ثبت شد.' : 'Quote request submitted.');
    toast.success(message);
  };

  const showContactMessage = () => {
    // Open centered modal with editable admin message
    openContactModal();
  };

  const showAddressMessage = () => {
    const address = company.address;
    const message = company.addressMessage || (
      language === 'fa' ? `آدرس: ${address}` : `Address: ${address}`
    );
    toast(message, {
      description: language === 'fa' ? 'برای باز کردن نقشه روی دکمه بزنید' : 'Open in map',
      action: {
        label: language === 'fa' ? 'نقشه' : 'Map',
        onClick: () => {
          const q = encodeURIComponent(address);
          window.open(`https://maps.google.com/?q=${q}`, '_blank');
        }
      }
    });
  };

  return { showQuoteMessage, showContactMessage, showAddressMessage };
}
