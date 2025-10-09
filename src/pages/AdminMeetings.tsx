import React from 'react';
import { toPersianDate } from '@/utils/date';
import AdminLayout from '@/components/layout/AdminLayout';
import { useMeetings } from '@/contexts/MeetingsContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export default function AdminMeetings() {
  const { bookings, settings, saveSettings, removeBooking, openModal } = useMeetings();

  return (
    <AdminLayout>
      <div className="space-y-6" style={{ direction: 'rtl' }}>
        <Card>
          <CardHeader>
            <CardTitle>تنظیمات جلسات</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <Label>مدت جلسه (دقیقه)</Label>
                <Input type="number" defaultValue={settings.defaultDurationMinutes} onBlur={(e) => saveSettings({ defaultDurationMinutes: Number(e.target.value) || 30 })} />
              </div>
              <div className="space-y-1">
                <Label>شروع کاری (HH:mm)</Label>
                <Input defaultValue={settings.startTime} onBlur={(e) => saveSettings({ startTime: e.target.value || '09:00' })} />
              </div>
              <div className="space-y-1">
                <Label>پایان کاری (HH:mm)</Label>
                <Input defaultValue={settings.endTime} onBlur={(e) => saveSettings({ endTime: e.target.value || '17:00' })} />
              </div>
              <div className="space-y-1 md:col-span-1">
                <Label>یادداشت مکان</Label>
                <Input defaultValue={settings.locationNote} onBlur={(e) => saveSettings({ locationNote: e.target.value })} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>رزروهای ثبت‌شده</CardTitle>
          </CardHeader>
          <CardContent>
            {bookings.length === 0 ? (
              <div className="text-gray-500">رزروی ثبت نشده است.</div>
            ) : (
              <div className="space-y-3">
                {bookings.map((b) => (
                  <div key={b.id} className="p-3 border rounded-lg flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="font-medium">{b.name}</div>
                      <div className="text-sm text-gray-600">{b.phone} {b.email ? `| ${b.email}` : ''}</div>
                      <div className="text-sm">{toPersianDate(b.date)} - {b.time}</div>
                      {b.notes && <div className="text-xs text-gray-500 mt-1">{b.notes}</div>}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" onClick={() => openModal({ date: b.date, time: b.time })}>جلسه مشابه</Button>
                      <Button variant="destructive" onClick={() => removeBooking(b.id)}>حذف</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
