import React from 'react';
import ModernHeader from '@/components/layout/ModernHeader';
import Footer from '@/components/layout/Footer';
import ChatWidget from '@/components/layout/ChatWidget';
import { useParams } from 'react-router-dom';
import { useMedia } from '@/contexts/MediaContext';
import { Badge } from '@/components/ui/badge';

export default function GalleryDetail() {
  const { slug } = useParams();
  const { getGalleryBySlug, mediaFiles } = useMedia();
  const gallery = slug ? getGalleryBySlug(slug) : undefined;

  if (!gallery) {
    return (
      <div className="min-h-screen flex flex-col">
        <ModernHeader />
        <div className="container mx-auto py-10 flex-1">گالری یافت نشد.</div>
        <Footer />
        <ChatWidget />
      </div>
    );
  }

  const images = gallery.imageIds
    .map(id => mediaFiles.find(f => f.id === id))
    .filter(Boolean);

  return (
    <div className="min-h-screen flex flex-col">
      <ModernHeader />
      <div className="container mx-auto py-10 space-y-6 flex-1">
        <div>
          <h1 className="text-3xl font-bold">{gallery.title}</h1>
          {gallery.description && <p className="text-gray-600 mt-2">{gallery.description}</p>}
          <div className="flex flex-wrap gap-1 mt-2">
            {gallery.tags.map(t => (<Badge key={t} variant="outline" className="text-xs">{t}</Badge>))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img) => img && (
            <div key={img.id} className="relative group">
              <img src={img.url} alt={img.alt} className="w-full h-48 object-cover rounded" />
            </div>
          ))}
        </div>
      </div>
      <Footer />
      <ChatWidget />
    </div>
  );
}

