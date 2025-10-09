import React, { useMemo, useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ImageIcon, Video, Plus, Pencil, Trash2, Upload } from 'lucide-react';
import { useProjects, Project } from '@/contexts/ProjectsContext';
import { useMedia } from '@/contexts/MediaContext';

export default function AdminProjects() {
  const { projects, addProject, updateProject, removeProject, clearAll, importMockIfEmpty } = useProjects();
  const { uploadFile } = useMedia();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Project>>({ mediaType: 'image' as any });
  const [fileIntent, setFileIntent] = useState<'image' | 'video' | 'poster' | null>(null);

  const isEditing = !!editingId;
  const sorted = useMemo(() => [...projects].sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || '')), [projects]);

  function openNew() {
    setEditingId(null);
    setForm({ mediaType: 'image' as any });
    setOpen(true);
  }
  function openEdit(project: Project) {
    setEditingId(project.id);
    setForm(project);
    setOpen(true);
  }
  function close() {
    setOpen(false);
    setTimeout(() => {
      setForm({ mediaType: 'image' as any });
      setEditingId(null);
      setFileIntent(null);
    }, 200);
  }

  async function onSave() {
    if (!form.title || !form.location || !form.capacity || !form.year || !form.description || !form.client) return;
    if (isEditing && editingId) {
      updateProject(editingId, form as Partial<Project>);
    } else {
      addProject({
        title: form.title!,
        location: form.location!,
        capacity: form.capacity!,
        year: form.year!,
        description: form.description!,
        client: form.client!,
        mediaType: (form.mediaType as any) || 'image',
        imageUrl: form.imageUrl,
        videoUrl: form.videoUrl,
        posterUrl: form.posterUrl,
        featured: !!form.featured,
        tags: form.tags || [],
        image: form.imageUrl,
      } as any);
    }
    close();
  }

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !fileIntent) return;
    try {
      const uploaded = await uploadFile(file, 'projects');
      if (fileIntent === 'image') setForm((f) => ({ ...f, mediaType: 'image' as any, imageUrl: uploaded.url }));
      if (fileIntent === 'poster') setForm((f) => ({ ...f, posterUrl: uploaded.url }));
      if (fileIntent === 'video') setForm((f) => ({ ...f, mediaType: 'video' as any, videoUrl: uploaded.url }));
    } finally {
      setFileIntent(null);
      e.currentTarget.value = '';
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">مدیریت پروژه‌ها</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => importMockIfEmpty()}>بارگذاری نمونه‌ها</Button>
            <Button onClick={openNew}><Plus className="w-4 h-4 ml-2"/>پروژه جدید</Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sorted.map((p) => (
            <Card key={p.id} className="overflow-hidden group">
              <div className="relative h-44 bg-gray-100">
                {p.mediaType === 'video' && p.videoUrl ? (
                  <video className="w-full h-full object-cover" poster={p.posterUrl || undefined} />
                ) : (
                  <img src={p.imageUrl || p.image} alt={p.title} className="w-full h-full object-cover" />
                )}
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="sm" variant="secondary" onClick={() => openEdit(p)}><Pencil className="w-4 h-4"/></Button>
                  <Button size="sm" variant="destructive" onClick={() => removeProject(p.id)}><Trash2 className="w-4 h-4"/></Button>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-lg">{p.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {p.featured && <Badge className="bg-yellow-500">ویژه</Badge>}
                  <Badge variant="outline">{p.location}</Badge>
                  <Badge variant="outline">{p.capacity}</Badge>
                  <Badge variant="outline">{p.year}</Badge>
                </div>
                <p className="text-sm text-gray-600 mt-3 line-clamp-2">{p.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={open} onOpenChange={(o) => !o && close()}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'ویرایش پروژه' : 'پروژه جدید'}</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>عنوان</Label>
              <Input value={form.title || ''} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>موقعیت</Label>
              <Input value={form.location || ''} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>ظرفیت</Label>
              <Input value={form.capacity || ''} onChange={(e) => setForm((f) => ({ ...f, capacity: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>سال اجرا</Label>
              <Input value={form.year || ''} onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>توضیحات</Label>
              <Textarea rows={3} value={form.description || ''} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>کارفرما</Label>
              <Input value={form.client || ''} onChange={(e) => setForm((f) => ({ ...f, client: e.target.value }))} />
            </div>

            <div className="md:col-span-2">
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => { setFileIntent('image'); (document.getElementById('project-hidden-file') as HTMLInputElement)?.click(); }}>
                  <ImageIcon className="w-4 h-4 ml-2"/> آپلود تصویر
                </Button>
                <Button variant="outline" onClick={() => { setFileIntent('video'); (document.getElementById('project-hidden-file') as HTMLInputElement)?.click(); }}>
                  <Video className="w-4 h-4 ml-2"/> آپلود ویدیو
                </Button>
                <Button variant="outline" onClick={() => { setFileIntent('poster'); (document.getElementById('project-hidden-file') as HTMLInputElement)?.click(); }}>
                  <Upload className="w-4 h-4 ml-2"/> آپلود پوستر
                </Button>
              </div>
              <div className="mt-3 border rounded-lg overflow-hidden">
                {form.mediaType === 'video' && form.videoUrl ? (
                  <video className="w-full" controls poster={form.posterUrl || undefined} />
                ) : form.imageUrl ? (
                  <img src={form.imageUrl} alt="cover" className="w-full" />
                ) : (
                  <div className="p-6 text-center text-gray-500">مدیایی انتخاب نشده است</div>
                )}
              </div>
            </div>

            <div className="md:col-span-2 flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={close}>انصراف</Button>
              <Button onClick={onSave}>{isEditing ? 'ذخیره' : 'افزودن'}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <input id="project-hidden-file" type="file" accept="image/*,video/*" className="hidden" onChange={onFileChange} />
    </AdminLayout>
  );
}
