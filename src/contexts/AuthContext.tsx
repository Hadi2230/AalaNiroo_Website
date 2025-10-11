import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUsers } from './UsersContext';
import { useAuditLog } from './AuditLogContext';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'sales';
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const mockUsers = [
  {
    id: '1',
    name: 'مدیر فروش',
    email: 'admin@aalaniroo.com',
    password: 'admin123',
    role: 'admin' as const,
    avatar: 'https://picsum.photos/40/40'
  },
  {
    id: '2',
    name: 'کارشناس فروش',
    email: 'sales@aalaniroo.com',
    password: 'sales123',
    role: 'sales' as const,
    avatar: 'https://picsum.photos/40/40'
  },
  {
    id: '3',
    name: 'مدیر ارشد',
    email: 'manager@aalaniroo.com',
    password: 'manager123',
    role: 'manager' as const,
    avatar: 'https://picsum.photos/40/40'
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { getUserByEmail } = useUsers();
  const { addLog } = useAuditLog();
  const initialUser = (() => {
    try {
      const saved = localStorage.getItem('user');
      if (saved) return JSON.parse(saved) as User;
      // fallback to cookie
      const cookie = document.cookie.split('; ').find(r => r.startsWith('auth_user='));
      if (cookie) {
        const encoded = cookie.split('=')[1];
        try { return JSON.parse(atob(encoded)) as User; } catch {}
      }
      // fallback to sessionStorage
      const sess = sessionStorage.getItem('user');
      if (sess) return JSON.parse(sess) as User;
      return null;
    } catch {
      return null;
    }
  })();
  const [user, setUser] = useState<User | null>(initialUser);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Keep user alive on storage changes from other tabs
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'user') {
        try {
          if (e.newValue) setUser(JSON.parse(e.newValue));
          else setUser(null);
        } catch {}
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 600));

      // Look up user from UsersContext
      const stored = getUserByEmail(email);
      if (!stored || stored.status !== 'active') {
        setIsLoading(false);
        return false;
      }
      // Validate password using same salted-hash function (re-implement quick inline)
      const enc = new TextEncoder();
      const saltBytes = new Uint8Array(stored.salt.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
      const pwdBytes = enc.encode(password);
      const combined = new Uint8Array(saltBytes.length + pwdBytes.length);
      combined.set(saltBytes);
      combined.set(pwdBytes, saltBytes.length);
      const digest = await crypto.subtle.digest('SHA-256', combined);
      const hash = Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');

      if (hash !== stored.passwordHash) {
        setIsLoading(false);
        return false;
      }

      const userWithoutSecrets = {
        id: stored.id,
        name: stored.name,
        email: stored.email,
        role: stored.role,
        avatar: stored.avatar,
      };
      setUser(userWithoutSecrets as any);
      try { localStorage.setItem('user', JSON.stringify(userWithoutSecrets)); } catch {}
      try { sessionStorage.setItem('user', JSON.stringify(userWithoutSecrets)); } catch {}
      try {
        const encoded = btoa(JSON.stringify(userWithoutSecrets));
        const expDays = 7;
        const d = new Date();
        d.setTime(d.getTime() + (expDays*24*60*60*1000));
        document.cookie = `auth_user=${encoded}; expires=${d.toUTCString()}; path=/`;
      } catch {}
      addLog({ action: 'login', actorEmail: stored.email, actorName: stored.name });
      setIsLoading(false);
      return true;
    } catch {
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    if (user?.email) {
      try { addLog({ action: 'logout', actorEmail: user.email, actorName: user.name }); } catch {}
    }
    setUser(null);
    localStorage.removeItem('user');
    try { sessionStorage.removeItem('user'); } catch {}
    try { document.cookie = 'auth_user=; Max-Age=0; path=/'; } catch {}
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};