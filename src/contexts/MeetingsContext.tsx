import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

export type MeetingBooking = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  date: string; // ISO date
  time: string; // e.g., 14:30
  notes?: string;
  createdAt: string;
};

export type MeetingSettings = {
  defaultDurationMinutes: number;
  workingDays: number[]; // 0-6 (Sun-Sat)
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  locationNote?: string;
};

type MeetingsContextType = {
  bookings: MeetingBooking[];
  settings: MeetingSettings;
  saveSettings: (s: Partial<MeetingSettings>) => void;
  addBooking: (b: Omit<MeetingBooking, 'id' | 'createdAt'>) => void;
  removeBooking: (id: string) => void;
  isModalOpen: boolean;
  openModal: (defaults?: Partial<Pick<MeetingBooking, 'date' | 'time'>>) => void;
  closeModal: () => void;
  modalDefaults?: Partial<Pick<MeetingBooking, 'date' | 'time'>>;
};

const MeetingsContext = createContext<MeetingsContextType | undefined>(undefined);

export const useMeetings = () => {
  const ctx = useContext(MeetingsContext);
  if (!ctx) throw new Error('useMeetings must be used within MeetingsProvider');
  return ctx;
};

const defaultSettings: MeetingSettings = {
  defaultDurationMinutes: 30,
  workingDays: [1,2,3,4,5],
  startTime: '09:00',
  endTime: '17:00',
  locationNote: ''
};

export const MeetingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bookings, setBookings] = useState<MeetingBooking[]>([]);
  const [settings, setSettings] = useState<MeetingSettings>(defaultSettings);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalDefaults, setModalDefaults] = useState<MeetingsContextType['modalDefaults']>();

  useEffect(() => {
    try {
      const s = localStorage.getItem('meetingsSettings');
      if (s) setSettings(JSON.parse(s));
    } catch {}
    try {
      const b = localStorage.getItem('meetingsBookings');
      if (b) setBookings(JSON.parse(b));
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem('meetingsSettings', JSON.stringify(settings)); } catch {}
  }, [settings]);

  useEffect(() => {
    try { localStorage.setItem('meetingsBookings', JSON.stringify(bookings)); } catch {}
  }, [bookings]);

  const saveSettings = (s: Partial<MeetingSettings>) => {
    setSettings(prev => ({ ...prev, ...s }));
    toast.success('تنظیمات جلسات ذخیره شد');
  };

  const addBooking = (b: Omit<MeetingBooking, 'id' | 'createdAt'>) => {
    const id = Math.random().toString(36).slice(2);
    const createdAt = new Date().toISOString();
    setBookings(prev => [{ ...b, id, createdAt }, ...prev]);
    toast.success('جلسه رزرو شد');
    setIsModalOpen(false);
  };

  const removeBooking = (id: string) => {
    setBookings(prev => prev.filter(b => b.id !== id));
  };

  const openModal = (defaults?: MeetingsContextType['modalDefaults']) => {
    setModalDefaults(defaults);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const value = useMemo(() => ({
    bookings, settings, saveSettings, addBooking, removeBooking, isModalOpen, openModal, closeModal, modalDefaults
  }), [bookings, settings, isModalOpen, modalDefaults]);

  return (
    <MeetingsContext.Provider value={value}>{children}</MeetingsContext.Provider>
  );
};
