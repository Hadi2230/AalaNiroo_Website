import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import { useAboutContent } from '@/contexts/AboutContentContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMedia } from '@/contexts/MediaContext';
import MediaPicker from '@/components/media/MediaPicker';

export default function AdminAbout() {
  const { content, updateLocale, addTeamMember, updateTeamMember, removeTeamMember, setGalleryImages } = useAboutContent();
  const { language } = useLanguage();
  const { getFileById } = useMedia();

  const [langTab, setLangTab] = useState<'fa' | 'en'>(language);
  const [openTeamMedia, setOpenTeamMedia] = useState<string | null>(null);
  const [openGalleryPicker, setOpenGalleryPicker] = useState(false);

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white mb-6">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold">مدیریت صفحه درباره ما</h1>
          <p className="text-blue-100 mt-1">ویرایش متن‌ها، تیم و گالری شرکت</p>
        </div>
      </div>
      <div className="container mx-auto px-4 pb-10 space-y-8">

      <Card>
        <CardHeader>
          <CardTitle>متن‌های اصلی</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs value={langTab} onValueChange={(v) => setLangTab(v as 'fa' | 'en')}>
            <TabsList>
              <TabsTrigger value="fa">فارسی</TabsTrigger>
              <TabsTrigger value="en">English</TabsTrigger>
            </TabsList>
            {(['fa','en'] as const).map((loc) => (
              <TabsContent key={loc} value={loc} className="space-y-4">
                <Input
                  value={content[loc].heroTitle}
                  onChange={(e) => updateLocale(loc, { heroTitle: e.target.value })}
                  placeholder={loc === 'fa' ? 'عنوان هدر' : 'Hero title'}
                />
                <Input
                  value={content[loc].heroSubtitle}
                  onChange={(e) => updateLocale(loc, { heroSubtitle: e.target.value })}
                  placeholder={loc === 'fa' ? 'زیرعنوان' : 'Subtitle'}
                />
                <div className="grid md:grid-cols-2 gap-3">
                  <Input
                    value={content[loc].teamTitle}
                    onChange={(e) => updateLocale(loc, { teamTitle: e.target.value })}
                    placeholder={loc === 'fa' ? 'عنوان بخش تیم' : 'Team section title'}
                  />
                  <Input
                    value={content[loc].galleryTitle}
                    onChange={(e) => updateLocale(loc, { galleryTitle: e.target.value })}
                    placeholder={loc === 'fa' ? 'عنوان گالری' : 'Gallery title'}
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                  <Input
                    value={content[loc].teamSubtitle}
                    onChange={(e) => updateLocale(loc, { teamSubtitle: e.target.value })}
                    placeholder={loc === 'fa' ? 'زیرعنوان بخش تیم' : 'Team section subtitle'}
                  />
                  <Input
                    value={content[loc].gallerySubtitle}
                    onChange={(e) => updateLocale(loc, { gallerySubtitle: e.target.value })}
                    placeholder={loc === 'fa' ? 'زیرعنوان گالری' : 'Gallery subtitle'}
                  />
                </div>
                <Textarea
                  value={content[loc].companyText}
                  onChange={(e) => updateLocale(loc, { companyText: e.target.value })}
                  placeholder={loc === 'fa' ? 'متن توضیح شرکت' : 'Company text'}
                  rows={5}
                />
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>تیم ما</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => addTeamMember({ name: '', role: '', bio: '' })}>
              <Plus className="w-4 h-4 mr-2" /> عضو جدید
            </Button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {content.team.map((m) => {
              const photo = m.photoId ? getFileById(m.photoId) : undefined;
              return (
                <Card key={m.id}>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setOpenTeamMedia(m.id)}
                        className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center"
                        aria-label="انتخاب تصویر"
                      >
                        {photo ? (
                          <img src={photo.thumbnailUrl || photo.url} alt={m.name} className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="w-8 h-8 text-gray-400" />
                        )}
                      </button>
                      <div className="flex-1 grid grid-cols-1 gap-2">
                        <Input value={m.name} onChange={(e) => updateTeamMember(m.id, { name: e.target.value })} placeholder="نام" />
                        <Input value={m.role} onChange={(e) => updateTeamMember(m.id, { role: e.target.value })} placeholder="سمت" />
                        <Input value={m.experience || ''} onChange={(e) => updateTeamMember(m.id, { experience: e.target.value })} placeholder="تجربه (مثلاً 10 سال)" />
                      </div>
                      <Button variant="destructive" size="icon" onClick={() => removeTeamMember(m.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <Textarea value={m.bio || ''} onChange={(e) => updateTeamMember(m.id, { bio: e.target.value })} placeholder="بیو/توضیحات" rows={3} />
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>گالری شرکت</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setOpenGalleryPicker(true)}>انتخاب تصاویر گالری</Button>
          </div>
          {content.galleryImageIds.length === 0 ? (
            <div className="text-gray-500 text-sm">هنوز تصویری انتخاب نشده است.</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {content.galleryImageIds.map((id) => {
                const f = getFileById(id);
                if (!f) return null;
                return (
                  <div key={id} className="aspect-square overflow-hidden rounded-lg">
                    <img src={f.thumbnailUrl || f.url} alt={f.alt} className="w-full h-full object-cover" />
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Media pickers */}
      <Dialog open={openTeamMedia !== null} onOpenChange={(v) => !v && setOpenTeamMedia(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>انتخاب تصویر عضو تیم</DialogTitle>
          </DialogHeader>
          {openTeamMedia && (
            <MediaPicker
              open={true}
              onOpenChange={() => setOpenTeamMedia(null)}
              onSelect={(f) => { updateTeamMember(openTeamMedia, { photoId: f.id }); }}
              accept={['image']}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={openGalleryPicker} onOpenChange={setOpenGalleryPicker}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>انتخاب تصاویر گالری</DialogTitle>
          </DialogHeader>
          <MediaPicker
            open={openGalleryPicker}
            onOpenChange={setOpenGalleryPicker}
            onSelect={(f) => { setGalleryImages([f.id]); setOpenGalleryPicker(false); }}
            accept={['image']}
          />
        </DialogContent>
      </Dialog>
      </div>
    </div>
  );
}

