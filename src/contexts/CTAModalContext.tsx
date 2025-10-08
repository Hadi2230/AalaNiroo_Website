import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';

interface CTAModalContextType {
  isContactOpen: boolean;
  openContactModal: () => void;
  closeContactModal: () => void;
}

const CTAModalContext = createContext<CTAModalContextType | undefined>(undefined);

export function CTAModalProvider({ children }: { children: ReactNode }) {
  const [isContactOpen, setIsContactOpen] = useState(false);

  const value = useMemo(
    () => ({
      isContactOpen,
      openContactModal: () => setIsContactOpen(true),
      closeContactModal: () => setIsContactOpen(false),
    }),
    [isContactOpen]
  );

  return (
    <CTAModalContext.Provider value={value}>{children}</CTAModalContext.Provider>
  );
}

export function useCTAModal(): CTAModalContextType {
  const ctx = useContext(CTAModalContext);
  if (!ctx) throw new Error('useCTAModal must be used within CTAModalProvider');
  return ctx;
}
