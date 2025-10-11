import React, { useMemo, useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useUsers } from '@/contexts/UsersContext';
import { useAccess } from '@/hooks/useAccess';
import { Plus, Edit, Trash2, RefreshCw, ShieldCheck, ShieldMinus } from 'lucide-react';
import { computeEffectivePermissions, ALL_PERMISSIONS } from '@/hooks/useAccess';

export default function AdminUsers() {
  const { users, createUser, updateUser, resetPassword, deleteUser } = useUsers();
  const { can } = useAccess();
  if (!can('admin.users.manage')) {
    return (
      <AdminLayout>
        <div className="min-h-[60vh] flex items-center justify-center text-gray-600">دسترسی غیرمجاز</div>
      </AdminLayout>
    );
  }
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({ name: '', email: '', role: 'manager', password: '' });

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return users.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.role.toLowerCase().includes(q));
  }, [users, search]);

  const [permDialog, setPermDialog] = useState<{ open: boolean; userId?: string; grants: string[]; denies: string[] }>({ open: false, grants: [], denies: [] });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">مدیریت کاربران</h1>
          <div className="flex items-center gap-2">
            <Input placeholder="جستجو کاربر..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-64" />
            <Button onClick={() => setShowAdd(true)}>
              <Plus className="w-4 h-4 ml-2" /> کاربر جدید
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>کاربران ({users.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(u => (
                <Card key={u.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold">{u.name}</div>
                      <div className="text-sm text-gray-600">{u.email}</div>
                      <div className="flex gap-2 mt-2 text-xs">
                        <Badge variant="outline">{u.role}</Badge>
                        <Badge variant={u.status === 'active' ? 'default' : 'outline'}>{u.status}</Badge>
                        {u.lastLoginAt && (
                          <Badge variant="outline">آخرین ورود: {new Date(u.lastLoginAt).toLocaleString('fa-IR')}</Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => resetPassword(u.id, 'ChangeMe!234')}>
                        <RefreshCw className="w-4 h-4 ml-2" /> ریست پسورد
                      </Button>
                      <Button size="sm" variant="secondary" onClick={() => {
                        setPermDialog({ open: true, userId: u.id, grants: (u as any).grants || [], denies: (u as any).denies || [] });
                      }}>
                        <ShieldCheck className="w-4 h-4 ml-2" /> دسترسی‌ها
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => deleteUser(u.id)}>
                        <Trash2 className="w-4 h-4 ml-2" /> حذف
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <Dialog open={showAdd} onOpenChange={setShowAdd}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>افزودن کاربر</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-2">
                <Label>نام</Label>
                <Input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
              </div>
              <div className="col-span-2 space-y-2">
                <Label>ایمیل</Label>
                <Input type="email" value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>نقش</Label>
                <Select value={draft.role} onValueChange={(v) => setDraft({ ...draft, role: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="انتخاب نقش" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="superadmin">سوپرادمین</SelectItem>
                    <SelectItem value="admin">ادمین</SelectItem>
                    <SelectItem value="manager">مدیر</SelectItem>
                    <SelectItem value="sales">فروش</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>رمز عبور اولیه</Label>
                <Input type="password" value={draft.password} onChange={(e) => setDraft({ ...draft, password: e.target.value })} />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setShowAdd(false)}>انصراف</Button>
              <Button disabled={!draft.name.trim() || !draft.email.trim() || !draft.password.trim()} onClick={async () => {
                setAdding(true);
                try {
                  await createUser({ name: draft.name, email: draft.email, role: draft.role as any, password: draft.password });
                  setShowAdd(false);
                  setDraft({ name: '', email: '', role: 'manager', password: '' });
                } finally {
                  setAdding(false);
                }
              }}>{adding ? 'در حال افزودن...' : 'افزودن'}</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Permissions Dialog */}
        <Dialog open={permDialog.open} onOpenChange={(v) => setPermDialog(p => ({ ...p, open: v }))}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>مدیریت دسترسی‌ها</DialogTitle>
            </DialogHeader>
            <div className="grid md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">
              <div>
                <div className="font-semibold mb-2">اجازه‌ها (Grants)</div>
                <div className="space-y-2">
                  {ALL_PERMISSIONS.map(p => (
                    <label key={`g-${p}`} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={permDialog.grants.includes(p)}
                        onChange={(e) => setPermDialog(prev => ({
                          ...prev,
                          grants: e.target.checked ? [...prev.grants, p] : prev.grants.filter(x => x !== p)
                        }))}
                      />
                      <span className="text-sm">{p}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <div className="font-semibold mb-2">محرومیت‌ها (Denies)</div>
                <div className="space-y-2">
                  {ALL_PERMISSIONS.map(p => (
                    <label key={`d-${p}`} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={permDialog.denies.includes(p)}
                        onChange={(e) => setPermDialog(prev => ({
                          ...prev,
                          denies: e.target.checked ? [...prev.denies, p] : prev.denies.filter(x => x !== p)
                        }))}
                      />
                      <span className="text-sm">{p}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center mt-4">
              <div className="text-xs text-gray-500">
                مؤثر: {(() => {
                  const eff = computeEffectivePermissions('admin', permDialog.grants as any, permDialog.denies as any);
                  return Array.from(eff).length;
                })()} مورد
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setPermDialog({ open: false, grants: [], denies: [] })}>انصراف</Button>
                <Button onClick={async () => {
                  if (!permDialog.userId) return;
                  await updateUser(permDialog.userId, { grants: permDialog.grants as any, denies: permDialog.denies as any });
                  setPermDialog({ open: false, grants: [], denies: [] });
                }}>ذخیره</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
