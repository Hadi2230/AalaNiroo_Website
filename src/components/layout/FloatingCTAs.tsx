import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Phone } from 'lucide-react';
import { useMeetings } from '@/contexts/MeetingsContext';
import { useCTA } from '@/hooks/useCTA';

export default function FloatingCTAs() {
  const { openModal } = useMeetings();
  const { showContactMessage } = useCTA();

  return (
    <div className="fixed bottom-24 right-6 z-40 flex flex-col gap-2">
      <Button
        variant="outline"
        size="icon"
        className="w-9 h-9 rounded-full bg-white/90 backdrop-blur text-cyan-700 hover:bg-white"
        onClick={openModal}
        aria-label="book-meeting"
      >
        <Calendar className="w-4 h-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="w-9 h-9 rounded-full bg-white/90 backdrop-blur text-cyan-700 hover:bg-white"
        onClick={showContactMessage}
        aria-label="quick-call"
      >
        <Phone className="w-4 h-4" />
      </Button>
    </div>
  );
}
