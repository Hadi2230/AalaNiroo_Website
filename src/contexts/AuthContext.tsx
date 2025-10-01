import React, { createContext, useContext, useState, useEffect } from 'react';

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
    avatar: '/api/placeholder/40/40'
  },
  {
    id: '2',
    name: 'کارشناس فروش',
    email: 'sales@aalaniroo.com',
    password: 'sales123',
    role: 'sales' as const,
    avatar: '/api/placeholder/40/40'
  },
  {
    id: '3',
    name: 'مدیر ارشد',
    email: 'manager@aalaniroo.com',
    password: 'manager123',
    role: 'manager' as const,
    avatar: '/api/placeholder/40/40'
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initialUser = (() => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) as User : null;
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

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const foundUser = mockUsers.find(u => u.email === email && u.password === password);

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      setIsLoading(false);
      return true;
    }

    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
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