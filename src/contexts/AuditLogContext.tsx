import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export interface AuditLogEntry {
  id: string;
  actorEmail?: string;
  actorName?: string;
  action: string; // e.g., "login", "logout", "user.create", "user.update"
  target?: string; // e.g., user id or email
  metadata?: Record<string, any>;
  userAgent?: string;
  createdAt: string;
}

interface AuditLogContextType {
  logs: AuditLogEntry[];
  addLog: (entry: Omit<AuditLogEntry, 'id' | 'createdAt' | 'userAgent'>) => void;
  clearLogs: () => void;
}

const AuditLogContext = createContext<AuditLogContextType | undefined>(undefined);

const STORAGE_KEY = 'auditLogs';

export const AuditLogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [logs, setLogs] = useState<AuditLogEntry[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as AuditLogEntry[];
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  });

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(logs)); } catch {}
  }, [logs]);

  const addLog = useCallback((entry: Omit<AuditLogEntry, 'id' | 'createdAt' | 'userAgent'>) => {
    const full: AuditLogEntry = {
      id: `al-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      createdAt: new Date().toISOString(),
      ...entry,
    };
    setLogs(prev => [full, ...prev].slice(0, 2000));
  }, []);

  const clearLogs = useCallback(() => setLogs([]), []);

  const value = useMemo(() => ({ logs, addLog, clearLogs }), [logs, addLog, clearLogs]);

  return (
    <AuditLogContext.Provider value={value}>{children}</AuditLogContext.Provider>
  );
};

export const useAuditLog = (): AuditLogContextType => {
  const ctx = useContext(AuditLogContext);
  if (!ctx) throw new Error('useAuditLog must be used within AuditLogProvider');
  return ctx;
};
