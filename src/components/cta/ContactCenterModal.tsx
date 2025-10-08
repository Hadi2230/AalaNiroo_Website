import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCompany } from '@/contexts/CompanyContext';
import { useCTAModal } from '@/contexts/CTAModalContext';

export default function ContactCenterModal() {
  const { isContactOpen, closeContactModal } = useCTAModal();
  const { language } = useLanguage();
  const { companyData } = useCompany();
  const company = companyData[language];

  const message = company.contactMessage || (
    language === 'fa'
      ? `برای تماس: ${company.phone}${company.whatsapp ? ` | واتس‌اپ: ${company.whatsapp}` : ''}`
      : `Call: ${company.phone}${company.whatsapp ? ` | WhatsApp: ${company.whatsapp}` : ''}`
  );

  return (
    <Dialog open={isContactOpen} onOpenChange={(o) => !o && closeContactModal()}>
      <DialogContent className="max-w-md text-center">
        <DialogHeader>
          <DialogTitle>{language === 'fa' ? 'تماس فوری' : 'Quick Contact'}</DialogTitle>
          <DialogDescription>
            {language === 'fa' ? 'برای تماس فوری از اطلاعات زیر استفاده کنید' : 'Use the info below to contact us quickly'}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 whitespace-pre-wrap text-lg">
          {message}
        </div>
        <div className="flex gap-2 justify-center">
          <Button
            onClick={async () => {
              try { await navigator.clipboard.writeText(`${company.phone}${company.whatsapp ? ` | ${company.whatsapp}` : ''}`); } catch {}
              closeContactModal();
            }}
          >
            {language === 'fa' ? 'کپی' : 'Copy'}
          </Button>
          <Button variant="outline" onClick={closeContactModal}>
            {language === 'fa' ? 'بستن' : 'Close'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
