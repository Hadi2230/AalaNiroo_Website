import React from 'react';
import ModernHeader from '@/components/layout/ModernHeader';
import Footer from '@/components/layout/Footer';
import ChatWidget from '@/components/layout/ChatWidget';
import { useMedia } from '@/contexts/MediaContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

export default function Galleries() {
  const { listGalleries, mediaFiles } = useMedia();
  const galleries = listGalleries();

  return (
    <div className="min-h-screen flex flex-col">
      <ModernHeader />
      <div className="container mx-auto py-10 space-y-8 flex-1">
        <div>
          <h1 className="text-3xl font-bold">گالری پروژه‌ها</h1>
          <p className="text-gray-600 mt-2">مجموعه تصاویر پروژه‌های انجام‌شده</p>
        </div>

        {galleries.length === 0 ? (
          <div className="text-gray-500">هنوز گالری‌ای ثبت نشده است.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleries.map(g => {
              const cover = g.coverImageId ? mediaFiles.find(f => f.id === g.coverImageId) : undefined;
              const count = g.imageIds.length;
              return (
                <Link key={g.id} to={`/galleries/${g.slug}`}>
                  <Card className="overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="relative aspect-video bg-gray-100">
                      {cover ? (
                        <img src={cover.url} alt={cover.alt} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">بدون کاور</div>
                      )}
                      <div className="absolute top-2 right-2">
                        <Badge variant="secondary" className="text-xs">{count} عکس</Badge>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="font-semibold">{g.title}</div>
                      {g.description && <div className="text-sm text-gray-600 line-clamp-2 mt-1">{g.description}</div>}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {g.tags.map(t => (<Badge key={t} variant="outline" className="text-xs">{t}</Badge>))}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
      <ChatWidget />
    </div>
  );
}

