import React, { useMemo, useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useUsers } from '@/contexts/UsersContext';

const AdminProfile: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { updateUser, changePassword } = useUsers();

  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [saving, setSaving] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changing, setChanging] = useState(false);

  const canSave = useMemo(() => {
    return (name.trim().length > 0) && (name !== user?.name || avatar !== (user?.avatar || ''));
  }, [name, avatar, user]);

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await updateUser(user.id, { name: name.trim(), avatar: avatar.trim() || undefined });
      updateProfile({ name: name.trim(), avatar: avatar.trim() || undefined });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!user) return;
    if (!currentPassword || !newPassword || newPassword !== confirmPassword) return;
    setChanging(true);
    try {
      const ok = await changePassword(user.id, currentPassword, newPassword);
      if (ok) {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } finally {
      setChanging(false);
    }
  };

  return (
    <AdminLayout>
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>پروفایل کاربری</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>نام</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>ایمیل</Label>
                <Input value={user?.email || ''} disabled />
              </div>
              <div className="space-y-2">
                <Label>آواتار (URL)</Label>
                <Input value={avatar} onChange={(e) => setAvatar(e.target.value)} placeholder="https://..." />
                {avatar && (
                  <img src={avatar} alt="avatar" className="w-16 h-16 rounded-full mt-2 object-cover" />
                )}
              </div>
              <div className="flex justify-end">
                <Button disabled={!canSave || saving} onClick={handleSaveProfile}>
                  {saving ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>تغییر رمز عبور</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>رمز عبور فعلی</Label>
                <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>رمز عبور جدید</Label>
                <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>تکرار رمز عبور جدید</Label>
                <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              </div>
              <div className="flex justify-end">
                <Button disabled={!currentPassword || !newPassword || newPassword !== confirmPassword || changing} onClick={handleChangePassword}>
                  {changing ? 'در حال تغییر...' : 'تغییر رمز عبور'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminProfile;
