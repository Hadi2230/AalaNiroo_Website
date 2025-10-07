import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, Image as ImageIcon, Info } from 'lucide-react';
import { useAboutContent } from '@/contexts/AboutContentContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMedia } from '@/contexts/MediaContext';
import MediaPicker from '@/components/media/MediaPicker';
import AdminLayout from '@/components/layout/AdminLayout';

export default function AdminAbout() {
  const { content, updateLocale, addTeamMember, updateTeamMember, removeTeamMember, setGalleryImages, setHeroImage } = useAboutContent();
  const { language } = useLanguage();
  const { getFileById } = useMedia();

  const [langTab, setLangTab] = useState<'fa' | 'en'>(language);
  const [openTeamMedia, setOpenTeamMedia] = useState<string | null>(null);
  const [openGalleryPicker, setOpenGalleryPicker] = useState(false);
  const [openHeroPicker, setOpenHeroPicker] = useState(false);

  return (
    <AdminLayout>
      <div className="space-y-8 p-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-950 dark:to-indigo-950 min-h-screen">
        {/* Header Card */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Info className="w-8 h-8 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    مدیریت صفحه درباره ما
                  </CardTitle>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">ویرایش متن‌ها، تیم و گالری شرکت</p>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>
        
        {/* Content Cards */}
        <div className="space-y-8">

      <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle>متن‌های اصلی</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Hero Image Picker */}
          <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-900/40 border border-white/20">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">
                {content.heroImageId ? (
                  (() => { const f = getFileById(content.heroImageId!); return f ? <img src={f.thumbnailUrl || f.url} alt={f.alt} className="w-full h-full object-cover" /> : <ImageIcon className="w-8 h-8 text-gray-400" />; })()
                ) : (
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <div>
                <div className="font-semibold mb-1">تصویر هدر صفحه درباره ما</div>
                <div className="text-sm text-gray-500">این تصویر در بخش هدر صفحه /about نمایش داده می‌شود.</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {content.heroImageId && (
                <Button variant="outline" onClick={() => setHeroImage(null)}>حذف تصویر</Button>
              )}
              <Button onClick={() => setOpenHeroPicker(true)}>انتخاب/تغییر تصویر</Button>
            </div>
          </div>

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

      <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle>تیم ما</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => addTeamMember({ name: '', role: '', bio: '' })} className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 shadow-md">
              <Plus className="w-4 h-4 mr-2" /> عضو جدید
            </Button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {content.team.map((m) => {
              const photo = m.photoId ? getFileById(m.photoId) : undefined;
              return (
                <Card key={m.id} className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-0 shadow-md hover:shadow-lg transition-all">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setOpenTeamMedia(m.id)}
                        className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100/80 border border-white/20 ring-1 ring-black/5 dark:ring-white/5 flex items-center justify-center shadow-sm"
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

      <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle>گالری شرکت</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-end">
            <Button variant="outline" className="border-2 hover:border-cyan-500 hover:bg-cyan-50 dark:hover:bg-cyan-950 transition-all" onClick={() => setOpenGalleryPicker(true)}>انتخاب تصاویر گالری</Button>
          </div>
          {content.galleryImageIds.length === 0 ? (
            <div className="text-gray-500 text-sm">هنوز تصویری انتخاب نشده است.</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {content.galleryImageIds.map((id) => {
                const f = getFileById(id);
                if (!f) return null;
                return (
                  <div key={id} className="aspect-square overflow-hidden rounded-xl ring-1 ring-black/5 dark:ring-white/5 shadow-sm">
                    <img src={f.thumbnailUrl || f.url} alt={f.alt} className="w-full h-full object-cover" />
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

        {/* Media pickers */}
        <MediaPicker
          open={openTeamMedia !== null}
          onOpenChange={(v) => !v && setOpenTeamMedia(null)}
          onSelect={(f) => { if (openTeamMedia) updateTeamMember(openTeamMedia, { photoId: f.id }); setOpenTeamMedia(null); }}
          accept={['image']}
        />

        <MediaPicker
          open={openGalleryPicker}
          onOpenChange={setOpenGalleryPicker}
          onSelect={(f) => { setGalleryImages([f.id]); setOpenGalleryPicker(false); }}
          accept={['image']}
        />

        <MediaPicker
          open={openHeroPicker}
          onOpenChange={setOpenHeroPicker}
          onSelect={(f) => { setHeroImage(f.id); setOpenHeroPicker(false); }}
          accept={['image']}
        />
        </div>
      </div>
    </AdminLayout>
  );
}

