import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type UserRole = 'superadmin' | 'admin' | 'manager' | 'sales';
export type UserStatus = 'active' | 'disabled';

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  passwordHash: string; // hex
  salt: string; // hex
  requirePasswordReset?: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
  // Fine-grained access control overrides (optional)
  grants?: string[];
  denies?: string[];
}

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface UsersContextType {
  users: PublicUser[];
  getUserByEmail: (email: string) => StoredUser | undefined;
  createUser: (data: { name: string; email: string; role: UserRole; password: string; avatar?: string; status?: UserStatus; requirePasswordReset?: boolean; grants?: string[]; denies?: string[]; }) => Promise<PublicUser>;
  updateUser: (id: string, updates: Partial<Pick<StoredUser, 'name' | 'role' | 'status' | 'avatar' | 'requirePasswordReset' | 'grants' | 'denies' | 'lastLoginAt'>>) => Promise<boolean>;
  resetPassword: (id: string, newPassword: string) => Promise<boolean>;
  changePassword: (id: string, oldPassword: string, newPassword: string) => Promise<boolean>;
  deleteUser: (id: string) => Promise<boolean>;
}

const UsersContext = createContext<UsersContextType | undefined>(undefined);

export const useUsers = (): UsersContextType => {
  const ctx = useContext(UsersContext);
  if (!ctx) throw new Error('useUsers must be used within UsersProvider');
  return ctx;
};

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function sha256Hex(input: Uint8Array): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', input);
  return toHex(digest);
}

async function hashPassword(password: string, saltHex: string): Promise<string> {
  const enc = new TextEncoder();
  const saltBytes = new Uint8Array(saltHex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
  const pwdBytes = enc.encode(password);
  const combined = new Uint8Array(saltBytes.length + pwdBytes.length);
  combined.set(saltBytes);
  combined.set(pwdBytes, saltBytes.length);
  return await sha256Hex(combined);
}

function randomHex(bytes = 16): string {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return toHex(arr.buffer);
}

const STORAGE_KEY = 'users';

export const UsersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<StoredUser[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as StoredUser[];
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  });

  // Seed superadmin if missing
  useEffect(() => {
    if (!users.some(u => u.role === 'superadmin')) {
      (async () => {
        const salt = randomHex(16);
        const password = 'ChangeMe!234';
        const passwordHash = await hashPassword(password, salt);
        const now = new Date().toISOString();
        const seed: StoredUser = {
          id: `u-${Date.now()}`,
          name: 'Super Admin',
          email: 'root@aalaniroo.com',
          role: 'superadmin',
          status: 'active',
          avatar: 'https://picsum.photos/40/40',
          salt,
          passwordHash,
          requirePasswordReset: true,
          createdAt: now,
          updatedAt: now,
        };
        setUsers(prev => {
          const next = [seed, ...prev];
          try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
          return next;
        });
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(users)); } catch {}
  }, [users]);

  const getUserByEmail = useCallback((email: string): StoredUser | undefined => {
    return users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }, [users]);

  const createUser = useCallback(async (data: { name: string; email: string; role: UserRole; password: string; avatar?: string; status?: UserStatus; requirePasswordReset?: boolean; grants?: string[]; denies?: string[]; }): Promise<PublicUser> => {
    const exists = users.some(u => u.email.toLowerCase() === data.email.toLowerCase());
    if (exists) throw new Error('Email already exists');
    const salt = randomHex(16);
    const passwordHash = await hashPassword(data.password, salt);
    const now = new Date().toISOString();
    const stored: StoredUser = {
      id: `u-${Date.now()}`,
      name: data.name,
      email: data.email,
      role: data.role,
      status: data.status || 'active',
      avatar: data.avatar,
      salt,
      passwordHash,
      requirePasswordReset: !!data.requirePasswordReset,
      createdAt: now,
      updatedAt: now,
      grants: data.grants,
      denies: data.denies,
    };
    setUsers(prev => [stored, ...prev]);
    const { passwordHash: _p, salt: _s, ...pub } = stored;
    return pub as PublicUser;
  }, [users]);

  const updateUser = useCallback(async (id: string, updates: Partial<Pick<StoredUser, 'name' | 'role' | 'status' | 'avatar' | 'requirePasswordReset' | 'grants' | 'denies' | 'lastLoginAt'>>): Promise<boolean> => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates, updatedAt: new Date().toISOString() } : u));
    return true;
  }, []);

  const changePassword = useCallback(async (id: string, oldPassword: string, newPassword: string): Promise<boolean> => {
    const user = users.find(u => u.id === id);
    if (!user) return false;
    // verify old password
    const enc = new TextEncoder();
    const saltBytes = new Uint8Array(user.salt.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
    const pwdBytes = enc.encode(oldPassword);
    const combined = new Uint8Array(saltBytes.length + pwdBytes.length);
    combined.set(saltBytes);
    combined.set(pwdBytes, saltBytes.length);
    const digest = await crypto.subtle.digest('SHA-256', combined);
    const oldHash = Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
    if (oldHash !== user.passwordHash) return false;
    // set new password
    const newSalt = randomHex(16);
    const newHash = await hashPassword(newPassword, newSalt);
    setUsers(prev => prev.map(u => u.id === id ? { ...u, salt: newSalt, passwordHash: newHash, requirePasswordReset: false, updatedAt: new Date().toISOString() } : u));
    return true;
  }, [users]);

  const resetPassword = useCallback(async (id: string, newPassword: string): Promise<boolean> => {
    const salt = randomHex(16);
    const passwordHash = await hashPassword(newPassword, salt);
    setUsers(prev => prev.map(u => u.id === id ? { ...u, salt, passwordHash, updatedAt: new Date().toISOString(), requirePasswordReset: false } : u));
    return true;
  }, []);

  const deleteUser = useCallback(async (id: string): Promise<boolean> => {
    setUsers(prev => prev.filter(u => u.id !== id));
    return true;
  }, []);

  const value: UsersContextType = useMemo(() => ({
    users: users.map(({ passwordHash: _p, salt: _s, grants: _g, denies: _d, ...u }) => u),
    getUserByEmail,
    createUser,
    updateUser,
    changePassword,
    resetPassword,
    deleteUser,
  }), [users, getUserByEmail, createUser, updateUser, resetPassword, deleteUser]);

  return (
    <UsersContext.Provider value={value}>{children}</UsersContext.Provider>
  );
}
