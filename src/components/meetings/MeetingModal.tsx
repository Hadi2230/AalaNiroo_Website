import React, { useMemo, useState } from 'react';
import { useMeetings } from '@/contexts/MeetingsContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

export default function MeetingModal() {
  const { language } = useLanguage();
  const { isModalOpen, closeModal, addBooking, settings, modalDefaults } = useMeetings();

  const [form, setForm] = useState({
    name: '', email: '', phone: '', date: '', time: '', notes: ''
  });

  React.useEffect(() => {
    if (isModalOpen) {
      setForm(prev => ({ ...prev, date: modalDefaults?.date || prev.date, time: modalDefaults?.time || prev.time }));
    }
  }, [isModalOpen, modalDefaults]);

  const timeOptions = useMemo(() => {
    const [sh, sm] = settings.startTime.split(':').map(Number);
    const [eh, em] = settings.endTime.split(':').map(Number);
    const step = settings.defaultDurationMinutes;
    const result: string[] = [];
    let totalStart = sh * 60 + sm;
    const totalEnd = eh * 60 + em;
    while (totalStart + step <= totalEnd) {
      const h = Math.floor(totalStart / 60).toString().padStart(2, '0');
      const m = (totalStart % 60).toString().padStart(2, '0');
      result.push(`${h}:${m}`);
      totalStart += step;
    }
    return result;
  }, [settings.startTime, settings.endTime, settings.defaultDurationMinutes]);

  const submit = () => {
    if (!form.name || !form.phone || !form.date || !form.time) return;
    addBooking({ name: form.name, email: form.email, phone: form.phone, date: form.date, time: form.time, notes: form.notes });
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={(o) => (!o ? closeModal() : undefined)}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{language === 'fa' ? 'رزرو جلسه' : 'Book a Meeting'}</DialogTitle>
          <DialogDescription>{language === 'fa' ? 'لطفاً اطلاعات زیر را تکمیل کنید' : 'Please fill in the details below'}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>{language === 'fa' ? 'نام و نام خانوادگی' : 'Full Name'}</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <Label>{language === 'fa' ? 'شماره تماس' : 'Phone'}</Label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Email</Label>
              <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <Label>{language === 'fa' ? 'تاریخ' : 'Date'}</Label>
              <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </div>
          </div>
          <div>
            <Label>{language === 'fa' ? 'ساعت' : 'Time'}</Label>
            <select className="w-full border rounded h-10 px-3" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })}>
              <option value="" disabled>{language === 'fa' ? 'انتخاب ساعت' : 'Select time'}</option>
              {timeOptions.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <Label>{language === 'fa' ? 'توضیحات' : 'Notes'}</Label>
            <Textarea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={closeModal}>{language === 'fa' ? 'انصراف' : 'Cancel'}</Button>
            <Button onClick={submit}>{language === 'fa' ? 'ثبت رزرو' : 'Book'}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
