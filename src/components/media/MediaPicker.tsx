import React, { useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useMedia, MediaFile } from '@/contexts/MediaContext';
import { Search, Image as ImageIcon, Filter } from 'lucide-react';

interface MediaPickerProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSelect: (file: MediaFile) => void;
  accept?: Array<'image' | 'video' | 'document' | 'audio'>;
}

export default function MediaPicker({ open, onOpenChange, onSelect, accept = ['image'] }: MediaPickerProps) {
  const { mediaFiles } = useMedia();
  const [q, setQ] = useState('');
  const [type, setType] = useState<'all' | 'image' | 'video' | 'document' | 'audio'>(accept.length === 1 ? accept[0] : 'all');

  const filtered = useMemo(() => {
    let files = mediaFiles;
    if (type !== 'all') files = files.filter(f => f.type === type);
    if (accept.length) files = files.filter(f => accept.includes(f.type));
    if (q.trim()) {
      const qq = q.toLowerCase();
      files = files.filter(f => f.name.toLowerCase().includes(qq) || f.description.toLowerCase().includes(qq) || f.tags.join(',').toLowerCase().includes(qq));
    }
    return files;
  }, [mediaFiles, q, type, accept]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>انتخاب رسانه</DialogTitle>
        </DialogHeader>
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="جستجوی رسانه..." className="pr-9" />
          </div>
          <Button variant={type === 'all' ? 'default' : 'outline'} onClick={() => setType('all')}>همه</Button>
          <Button variant={type === 'image' ? 'default' : 'outline'} onClick={() => setType('image')}>عکس</Button>
          <Button variant={type === 'video' ? 'default' : 'outline'} onClick={() => setType('video')}>ویدیو</Button>
        </div>
        {filtered.length === 0 ? (
          <div className="text-gray-500">موردی یافت نشد.</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((f) => (
              <button key={f.id} className="text-left group" onClick={() => { onSelect(f); onOpenChange(false); }}>
                <div className="relative aspect-square bg-gray-100 rounded overflow-hidden">
                  {f.type === 'image' ? (
                    <img src={f.url} alt={f.alt} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <ImageIcon className="w-10 h-10" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="text-xs">{f.type === 'image' ? 'عکس' : f.type}</Badge>
                  </div>
                </div>
                <div className="mt-2 text-sm truncate">{f.name}</div>
              </button>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

