import React, { useMemo, useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useProjects } from '@/contexts/ProjectsContext';
import { useMedia } from '@/contexts/MediaContext';
import MediaPicker from '@/components/media/MediaPicker';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Upload, Image as ImageIcon, Filter, Search, RefreshCw } from 'lucide-react';

export default function AdminProjects() {
  const { projects, createProject, updateProject, deleteProject } = useProjects();
  const { uploadFile } = useMedia();
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [search, setSearch] = useState('');
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState({ title: '', location: '', capacity: '', year: '', image: '', description: '', client: '', status: 'published' as const });

  const filtered = useMemo(() => {
    if (!search.trim()) return projects;
    const q = search.toLowerCase();
    return projects.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.location.toLowerCase().includes(q) ||
      p.client.toLowerCase().includes(q) ||
      p.capacity.toLowerCase().includes(q) ||
      p.year.toLowerCase().includes(q)
    );
  }, [projects, search]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>مدیریت پروژه‌ها ({projects.length})</span>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="جستجو..." className="pr-9 w-64" />
                </div>
                <Button onClick={() => setShowAdd(true)} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" /> پروژه جدید
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filtered.length === 0 ? (
              <div className="text-center py-12 text-gray-500">پروژه‌ای پیدا نشد</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((p) => (
                  <Card key={p.id} className="overflow-hidden group">
                    <div className="relative">
                      <img src={p.image || '/api/placeholder/600/400'} alt={p.title} className="w-full h-48 object-cover" />
                      <Badge className="absolute top-2 right-2 bg-blue-600">{p.capacity}</Badge>
                    </div>
                    <CardContent className="p-4 space-y-2">
                      <div className="font-bold line-clamp-1">{p.title}</div>
                      <div className="text-sm text-gray-600 line-clamp-2">{p.description}</div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{p.location}</span>
                        <span>{p.year}</span>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button size="sm" variant="outline" onClick={() => { setEditingId(p.id); setDraft({ title: p.title, location: p.location, capacity: p.capacity, year: p.year, image: p.image, description: p.description, client: p.client, status: p.status }); setShowEdit(true); }}>
                          <Edit className="w-4 h-4 mr-1" /> ویرایش
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600" onClick={() => deleteProject(p.id)}>
                          <Trash2 className="w-4 h-4 mr-1" /> حذف
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add */}
        <Dialog open={showAdd} onOpenChange={setShowAdd}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>پروژه جدید</DialogTitle>
              <DialogDescription>اطلاعات پروژه را وارد کنید</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-2">
                <Label>عنوان</Label>
                <Input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>موقعیت</Label>
                <Input value={draft.location} onChange={(e) => setDraft({ ...draft, location: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>ظرفیت</Label>
                <Input value={draft.capacity} onChange={(e) => setDraft({ ...draft, capacity: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>سال اجرا</Label>
                <Input value={draft.year} onChange={(e) => setDraft({ ...draft, year: e.target.value })} />
              </div>
              <div className="col-span-2 space-y-2">
                <Label>توضیحات</Label>
                <Textarea rows={3} value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>کارفرما</Label>
                <Input value={draft.client} onChange={(e) => setDraft({ ...draft, client: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>تصویر کاور</Label>
                <div className="flex gap-2">
                  <Input value={draft.image} onChange={(e) => setDraft({ ...draft, image: e.target.value })} placeholder="URL" />
                  <Button variant="outline" onClick={() => setShowPicker(true)}>
                    <ImageIcon className="w-4 h-4 mr-1" /> انتخاب
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowAdd(false)}>انصراف</Button>
              <Button disabled={adding || !draft.title.trim()} onClick={async () => {
                setAdding(true);
                try {
                  await createProject(draft);
                  setShowAdd(false);
                  setDraft({ title: '', location: '', capacity: '', year: '', image: '', description: '', client: '', status: 'published' });
                } catch {}
                finally { setAdding(false); }
              }}>
                {adding ? (<><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> در حال افزودن...</>) : (<><Plus className="w-4 h-4 mr-2" /> افزودن</>)}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit */}
        <Dialog open={showEdit} onOpenChange={setShowEdit}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>ویرایش پروژه</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-2">
                <Label>عنوان</Label>
                <Input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>موقعیت</Label>
                <Input value={draft.location} onChange={(e) => setDraft({ ...draft, location: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>ظرفیت</Label>
                <Input value={draft.capacity} onChange={(e) => setDraft({ ...draft, capacity: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>سال اجرا</Label>
                <Input value={draft.year} onChange={(e) => setDraft({ ...draft, year: e.target.value })} />
              </div>
              <div className="col-span-2 space-y-2">
                <Label>توضیحات</Label>
                <Textarea rows={3} value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>کارفرما</Label>
                <Input value={draft.client} onChange={(e) => setDraft({ ...draft, client: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>تصویر کاور</Label>
                <div className="flex gap-2">
                  <Input value={draft.image} onChange={(e) => setDraft({ ...draft, image: e.target.value })} placeholder="URL" />
                  <Button variant="outline" onClick={() => setShowPicker(true)}>
                    <ImageIcon className="w-4 h-4 mr-1" /> انتخاب
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowEdit(false)}>انصراف</Button>
              <Button onClick={async () => {
                if (!editingId) return;
                await updateProject(editingId, draft);
                setShowEdit(false);
              }}>ذخیره</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Media picker shared */}
        <MediaPicker
          open={showPicker}
          onOpenChange={setShowPicker}
          onSelect={(file) => setDraft(prev => ({ ...prev, image: file.url }))}
          accept={['image']}
        />
      </div>
    </AdminLayout>
  );
}

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
