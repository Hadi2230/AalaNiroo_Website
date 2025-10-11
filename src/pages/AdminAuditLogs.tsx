import React, { useMemo, useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuditLog } from '@/contexts/AuditLogContext';

const AdminAuditLogs: React.FC = () => {
  const { logs, clearLogs } = useAuditLog();
  const [q, setQ] = useState('');

  const filtered = useMemo(() => {
    const s = q.toLowerCase();
    return logs.filter(l =>
      (l.actorEmail || '').toLowerCase().includes(s) ||
      (l.actorName || '').toLowerCase().includes(s) ||
      (l.action || '').toLowerCase().includes(s) ||
      (l.target || '').toLowerCase().includes(s)
    );
  }, [logs, q]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">گزارش فعالیت‌ها (Audit Logs)</h1>
          <div className="flex items-center gap-2">
            <Input placeholder="جستجو..." value={q} onChange={(e) => setQ(e.target.value)} className="w-64" />
            <Button variant="destructive" onClick={clearLogs}>پاک‌سازی</Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>تعداد: {filtered.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-right text-gray-600">
                    <th className="p-2">زمان</th>
                    <th className="p-2">کاربر</th>
                    <th className="p-2">عملیات</th>
                    <th className="p-2">هدف</th>
                    <th className="p-2">جزئیات</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(l => (
                    <tr key={l.id} className="border-t">
                      <td className="p-2 whitespace-nowrap">{new Date(l.createdAt).toLocaleString('fa-IR')}</td>
                      <td className="p-2 whitespace-nowrap">{l.actorName || l.actorEmail || '-'}</td>
                      <td className="p-2 whitespace-nowrap">{l.action}</td>
                      <td className="p-2 whitespace-nowrap">{l.target || '-'}</td>
                      <td className="p-2">
                        <pre className="text-xs bg-gray-50 p-2 rounded overflow-x-auto max-w-[50vw]">{JSON.stringify(l.metadata || {}, null, 2)}</pre>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminAuditLogs;
