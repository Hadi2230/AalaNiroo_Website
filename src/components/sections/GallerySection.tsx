import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Link } from 'react-router-dom';
import { MediaGallery, MediaFile } from '@/contexts/MediaContext';

interface GallerySectionProps {
  title: string;
  gallery: MediaGallery;
  files: MediaFile[];
}

export default function GallerySection({ title, gallery, files }: GallerySectionProps) {
  const images = gallery.imageIds
    .map(id => files.find(f => f.id === id))
    .filter(Boolean) as MediaFile[];

  if (images.length === 0) return null;

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{title}</h2>
            <div className="flex gap-1 mt-2 flex-wrap">
              {gallery.tags.map(t => (
                <Badge key={t} variant="outline" className="text-xs">{t}</Badge>
              ))}
            </div>
          </div>
          <Link to={`/galleries/${gallery.slug}`} className="text-blue-600 hover:text-blue-700">مشاهده همه</Link>
        </div>

        <div className="relative">
          <Carousel className="w-full" opts={{ align: 'start', loop: true }}>
            <CarouselContent>
              {images.map((img) => (
                <CarouselItem key={img.id} className="md:basis-1/2 lg:basis-1/3">
                  <Card className="overflow-hidden group">
                    <div className="relative aspect-[4/3] bg-gray-100">
                      <img src={img.url} alt={img.alt} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>
                    <CardContent className="p-3">
                      {img.description && (
                        <div className="text-sm text-gray-600 line-clamp-2">{img.description}</div>
                      )}
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>
    </section>
  );
}

