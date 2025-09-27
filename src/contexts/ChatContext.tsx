import React, { createContext, useContext, useReducer, useEffect, useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';

// انواع TypeScript
export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'admin';
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  sessionId: string;
  attachments?: Attachment[];
}

export interface Attachment {
  id: string;
  name: string;
  type: 'image' | 'file' | 'audio' | 'video';
  url: string;
  size: number;
}

export interface ChatSession {
  id: string;
  visitorName: string;
  visitorEmail?: string;
  visitorPhone?: string;
  status: 'active' | 'waiting' | 'closed' | 'archived';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  messages: ChatMessage[];
  unreadCount: number;
  assignedTo?: string;
  assignedAdmin?: string;
  tags: string[];
  rating?: number;
  feedback?: string;
  createdAt: string;
  updatedAt: string;
  lastMessage: string;
  lastActivity: string;
  ipAddress?: string;
  userAgent?: string;
  pageUrl?: string;
  department?: string;
}

interface ChatState {
  sessions: ChatSession[];
  activeSession: ChatSession | null;
  isConnected: boolean;
  notifications: ChatNotification[];
  isLoading: boolean;
  filters: {
    status: string;
    priority: string;
    department: string;
    assigned: string;
    dateRange: {
      from: string;
      to: string;
    };
  };
  searchTerm: string;
  onlineAdmins: string[];
}

export interface ChatNotification {
  id: string;
  type: 'new_session' | 'new_message' | 'session_closed' | 'admin_assigned' | 'priority_changed';
  title: string;
  message: string;
  sessionId: string;
  timestamp: string;
  read: boolean;
  data?: any;
}

type ChatAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_SESSIONS'; payload: ChatSession[] }
  | { type: 'ADD_SESSION'; payload: ChatSession }
  | { type: 'UPDATE_SESSION'; payload: ChatSession }
  | { type: 'DELETE_SESSION'; payload: string }
  | { type: 'ADD_MESSAGE'; payload: { sessionId: string; message: ChatMessage } }
  | { type: 'UPDATE_MESSAGE'; payload: { sessionId: string; messageId: string; updates: Partial<ChatMessage> } }
  | { type: 'DELETE_MESSAGE'; payload: { sessionId: string; messageId: string } }
  | { type: 'MARK_AS_READ'; payload: string }
  | { type: 'MARK_ALL_AS_READ' }
  | { type: 'CLOSE_SESSION'; payload: string }
  | { type: 'REOPEN_SESSION'; payload: string }
  | { type: 'ARCHIVE_SESSION'; payload: string }
  | { type: 'ASSIGN_SESSION'; payload: { sessionId: string; adminId: string; adminName: string } }
  | { type: 'UNASSIGN_SESSION'; payload: string }
  | { type: 'SET_PRIORITY'; payload: { sessionId: string; priority: string } }
  | { type: 'ADD_TAG'; payload: { sessionId: string; tag: string } }
  | { type: 'REMOVE_TAG'; payload: { sessionId: string; tag: string } }
  | { type: 'SET_ACTIVE_SESSION'; payload: string | null }
  | { type: 'SET_CONNECTION_STATUS'; payload: boolean }
  | { type: 'ADD_NOTIFICATION'; payload: ChatNotification }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'CLEAR_NOTIFICATIONS' }
  | { type: 'SET_FILTER'; payload: { key: string; value: any } }
  | { type: 'SET_SEARCH_TERM'; payload: string }
  | { type: 'SET_ONLINE_ADMINS'; payload: string[] }
  | { type: 'ADD_FEEDBACK'; payload: { sessionId: string; rating: number; feedback: string } }
  | { type: 'SYNC_WITH_LOCAL_STORAGE' }
  | { type: 'CLEAR_CHAT_DATA' };

interface ChatContextType {
  // State
  sessions: ChatSession[];
  activeSession: ChatSession | null;
  isConnected: boolean;
  notifications: ChatNotification[];
  isLoading: boolean;
  filters: ChatState['filters'];
  searchTerm: string;
  onlineAdmins: string[];
  
  // Actions
  sendMessage: (text: string, sessionId: string, sender?: 'user' | 'admin', attachments?: Attachment[]) => void;
  createSession: (visitorInfo: { 
    name: string; 
    email?: string; 
    phone?: string;
    ipAddress?: string;
    userAgent?: string;
    pageUrl?: string;
    department?: string;
  }) => string;
  markAsRead: (sessionId: string) => void;
  markAllAsRead: () => void;
  closeSession: (sessionId: string) => void;
  reopenSession: (sessionId: string) => void;
  archiveSession: (sessionId: string) => void;
  deleteSession: (sessionId: string) => void;
  assignSession: (sessionId: string, adminId: string, adminName: string) => void;
  unassignSession: (sessionId: string) => void;
  setPriority: (sessionId: string, priority: string) => void;
  addTag: (sessionId: string, tag: string) => void;
  removeTag: (sessionId: string, tag: string) => void;
  setActiveSession: (sessionId: string | null) => void;
  markNotificationAsRead: (notificationId: string) => void;
  clearNotifications: () => void;
  setFilter: (key: string, value: any) => void;
  setSearchTerm: (term: string) => void;
  addFeedback: (sessionId: string, rating: number, feedback: string) => void;
  updateMessage: (sessionId: string, messageId: string, updates: Partial<ChatMessage>) => void;
  deleteMessage: (sessionId: string, messageId: string) => void;
  syncWithLocalStorage: () => void;
  clearChatData: () => void;
  exportSession: (sessionId: string) => string;
  importSessions: (sessions: ChatSession[]) => void;
  getSessionStats: () => {
    total: number;
    active: number;
    waiting: number;
    closed: number;
    archived: number;
    unread: number;
  };
  searchMessages: (query: string, sessionId?: string) => { session: ChatSession; message: ChatMessage }[];
  getUnreadCount: () => number;
}

// initialState
const initialState: ChatState = {
  sessions: [
    {
      id: 'session-demo-1',
      visitorName: 'احمد رضایی',
      visitorEmail: 'ahmad@example.com',
      visitorPhone: '09123456789',
      status: 'active',
      priority: 'medium',
      messages: [
        {
          id: 'msg-demo-1',
          text: 'سلام، می‌خواستم در مورد ژنراتورها سوال کنم',
          sender: 'user',
          timestamp: new Date().toISOString(),
          status: 'delivered',
          sessionId: 'session-demo-1'
        },
        {
          id: 'msg-demo-2',
          text: 'سلام! چطور می‌تونم کمکتون کنم؟',
          sender: 'admin',
          timestamp: new Date().toISOString(),
          status: 'read',
          sessionId: 'session-demo-1'
        }
      ],
      unreadCount: 1,
      tags: ['ژنراتور', 'مشاوره'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastMessage: 'سلام، می‌خواستم در مورد ژنراتورها سوال کنم',
      lastActivity: new Date().toISOString(),
      department: 'فروش'
    }
  ],
  activeSession: null,
  isConnected: false,
  notifications: [],
  isLoading: false,
  filters: {
    status: 'all',
    priority: 'all',
    department: 'all',
    assigned: 'all',
    dateRange: {
      from: '',
      to: ''
    }
  },
  searchTerm: '',
  onlineAdmins: []
};

// Utility functions
const generateId = (prefix: string = '') => {
  return `${prefix}${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const validateSession = (session: Partial<ChatSession>): boolean => {
  return !!(session.id && session.visitorName && session.createdAt);
};

const validateMessage = (message: Partial<ChatMessage>): boolean => {
  return !!(message.id && message.text && message.sender && message.timestamp);
};

// Reducer (expanded)
const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  console.log('🔄 ChatReducer Action:', action.type);

  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SET_SESSIONS':
      return { ...state, sessions: action.payload, isLoading: false };

    case 'UPDATE_SESSION': {
      const updated = state.sessions.map(s => s.id === action.payload.id ? { ...s, ...action.payload, updatedAt: new Date().toISOString() } : s);
      return { ...state, sessions: updated };
    }

    case 'ADD_SESSION':
      const sessionNotification: ChatNotification = {
        id: generateId('notif-'),
        type: 'new_session',
        title: 'چت جدید',
        message: `چت جدید از ${action.payload.visitorName}`,
        sessionId: action.payload.id,
        timestamp: new Date().toISOString(),
        read: false
      };

      toast.success(`📞 چت جدید از ${action.payload.visitorName}`);

      return {
        ...state,
        sessions: [action.payload, ...state.sessions],
        notifications: [sessionNotification, ...state.notifications]
      };

    case 'ADD_MESSAGE':
      const { sessionId, message } = action.payload;
      
      const updatedSessions = state.sessions.map(session => {
        if (session.id === sessionId) {
          return {
            ...session,
            messages: [...session.messages, message],
            lastMessage: message.text,
            lastActivity: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            unreadCount: message.sender === 'user' ? session.unreadCount + 1 : session.unreadCount
          };
        }
        return session;
      });

      let newNotifications = state.notifications;
      if (message.sender === 'user') {
        const messageNotification: ChatNotification = {
          id: generateId('notif-'),
          type: 'new_message',
          title: 'پیام جدید',
          message: `پیام جدید از ${state.sessions.find(s => s.id === sessionId)?.visitorName}`,
          sessionId,
          timestamp: new Date().toISOString(),
          read: false
        };
        newNotifications = [messageNotification, ...state.notifications];
      }

      return {
        ...state,
        sessions: updatedSessions,
        notifications: newNotifications
      };

    case 'UPDATE_MESSAGE': {
      const { sessionId, messageId, updates } = action.payload;
      return {
        ...state,
        sessions: state.sessions.map(s => s.id === sessionId ? {
          ...s,
          messages: s.messages.map(m => m.id === messageId ? { ...m, ...updates } as ChatMessage : m),
          updatedAt: new Date().toISOString()
        } : s)
      };
    }

    case 'DELETE_MESSAGE': {
      const { sessionId, messageId } = action.payload;
      return {
        ...state,
        sessions: state.sessions.map(s => s.id === sessionId ? {
          ...s,
          messages: s.messages.filter(m => m.id !== messageId),
          updatedAt: new Date().toISOString()
        } : s)
      };
    }

    case 'MARK_AS_READ':
      return {
        ...state,
        sessions: state.sessions.map(session =>
          session.id === action.payload ? { ...session, unreadCount: 0 } : session
        )
      };

    case 'MARK_ALL_AS_READ':
      return {
        ...state,
        sessions: state.sessions.map(session => ({ ...session, unreadCount: 0 }))
      };

    case 'CLOSE_SESSION':
      toast.success('✅ چت بسته شد');
      return {
        ...state,
        sessions: state.sessions.map(session =>
          session.id === action.payload 
            ? { ...session, status: 'closed' as const, updatedAt: new Date().toISOString() }
            : session
        )
      };

    case 'REOPEN_SESSION':
      return {
        ...state,
        sessions: state.sessions.map(session =>
          session.id === action.payload 
            ? { ...session, status: 'active' as const, updatedAt: new Date().toISOString() }
            : session
        )
      };

    case 'ARCHIVE_SESSION':
      return {
        ...state,
        sessions: state.sessions.map(session =>
          session.id === action.payload 
            ? { ...session, status: 'archived' as const, updatedAt: new Date().toISOString() }
            : session
        )
      };

    case 'DELETE_SESSION':
      return { ...state, sessions: state.sessions.filter(s => s.id !== action.payload) };

    case 'ASSIGN_SESSION': {
      const { sessionId, adminId, adminName } = action.payload;
      return {
        ...state,
        sessions: state.sessions.map(s => s.id === sessionId ? {
          ...s,
          assignedTo: adminId,
          assignedAdmin: adminName,
          updatedAt: new Date().toISOString()
        } : s)
      };
    }

    case 'UNASSIGN_SESSION':
      return {
        ...state,
        sessions: state.sessions.map(s => s.id === action.payload ? {
          ...s,
          assignedTo: undefined,
          assignedAdmin: undefined,
          updatedAt: new Date().toISOString()
        } : s)
      };

    case 'SET_PRIORITY': {
      const { sessionId, priority } = action.payload as { sessionId: string; priority: any };
      return {
        ...state,
        sessions: state.sessions.map(s => s.id === sessionId ? { ...s, priority: priority as any, updatedAt: new Date().toISOString() } : s)
      };
    }

    case 'ADD_TAG': {
      const { sessionId, tag } = action.payload;
      return {
        ...state,
        sessions: state.sessions.map(s => s.id === sessionId ? {
          ...s,
          tags: s.tags.includes(tag) ? s.tags : [...s.tags, tag],
          updatedAt: new Date().toISOString()
        } : s)
      };
    }

    case 'REMOVE_TAG': {
      const { sessionId, tag } = action.payload;
      return {
        ...state,
        sessions: state.sessions.map(s => s.id === sessionId ? {
          ...s,
          tags: s.tags.filter(t => t !== tag),
          updatedAt: new Date().toISOString()
        } : s)
      };
    }

    case 'SET_ACTIVE_SESSION':
      return {
        ...state,
        activeSession: action.payload 
          ? state.sessions.find(s => s.id === action.payload) || null
          : null
      };

    case 'SET_CONNECTION_STATUS':
      return { ...state, isConnected: action.payload };

    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [action.payload, ...state.notifications]
      };

    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(n => n.id === action.payload ? { ...n, read: true } : n)
      };

    case 'CLEAR_NOTIFICATIONS':
      return {
        ...state,
        notifications: []
      };

    case 'SET_FILTER':
      return {
        ...state,
        filters: { ...state.filters, [action.payload.key]: action.payload.value }
      };

    case 'SET_SEARCH_TERM':
      return { ...state, searchTerm: action.payload };

    case 'SET_ONLINE_ADMINS':
      return { ...state, onlineAdmins: action.payload };

    case 'ADD_FEEDBACK': {
      const { sessionId, rating, feedback } = action.payload;
      return {
        ...state,
        sessions: state.sessions.map(s => s.id === sessionId ? { ...s, rating, feedback, updatedAt: new Date().toISOString() } : s)
      };
    }

    case 'SYNC_WITH_LOCAL_STORAGE': {
      try {
        const saved = localStorage.getItem('chatSessions');
        if (saved) {
          const sessions = JSON.parse(saved) as ChatSession[];
          return { ...state, sessions };
        }
      } catch (e) {
        console.error('SYNC_WITH_LOCAL_STORAGE failed', e);
      }
      return state;
    }

    case 'CLEAR_CHAT_DATA':
      return { ...state, sessions: [], activeSession: null, notifications: [] };

    default:
      return state;
  }
};

// Context
const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Provider
export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const tabIdRef = useRef<string>(generateId('tab-'));
  const bcRef = useRef<BroadcastChannel | null>(null);
  const skipBroadcastNextRef = useRef<boolean>(false);

  // Load from localStorage
  useEffect(() => {
    const savedSessions = localStorage.getItem('chatSessions');
    if (savedSessions) {
      try {
        const sessions = JSON.parse(savedSessions);
        dispatch({ type: 'SET_SESSIONS', payload: sessions });
      } catch (error) {
        console.error('Error loading sessions:', error);
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('chatSessions', JSON.stringify(state.sessions));
    // Optional: custom event for other listeners
    window.dispatchEvent(new CustomEvent('chatSessionsUpdated', { detail: state.sessions }));

    // Broadcast to other tabs unless it's from an external update we just processed
    if (!skipBroadcastNextRef.current && bcRef.current) {
      try {
        bcRef.current.postMessage({ type: 'SESSIONS_UPDATED', sessions: state.sessions, source: tabIdRef.current });
      } catch (e) {
        console.warn('BroadcastChannel post failed', e);
      }
    }
    // Reset skip flag after performing potential broadcast
    if (skipBroadcastNextRef.current) {
      skipBroadcastNextRef.current = false;
    }
  }, [state.sessions]);

  // Setup cross-tab sync via BroadcastChannel and storage
  useEffect(() => {
    // BroadcastChannel
    if ('BroadcastChannel' in window) {
      try {
        bcRef.current = new BroadcastChannel('chat_channel');
        dispatch({ type: 'SET_CONNECTION_STATUS', payload: true });
        bcRef.current.onmessage = (event: MessageEvent) => {
          const data = event.data || {};
          if (data.source && data.source === tabIdRef.current) return;
          if (data.type === 'SESSIONS_UPDATED' && Array.isArray(data.sessions)) {
            skipBroadcastNextRef.current = true; // avoid rebroadcast loops
            dispatch({ type: 'SET_SESSIONS', payload: data.sessions });
          }
        };
      } catch (e) {
        console.warn('BroadcastChannel init failed', e);
        dispatch({ type: 'SET_CONNECTION_STATUS', payload: false });
      }
    }

    // storage event (fallback)
    const onStorage = (event: StorageEvent) => {
      if (event.key === 'chatSessions' && event.newValue) {
        try {
          const sessions = JSON.parse(event.newValue);
          skipBroadcastNextRef.current = true;
          dispatch({ type: 'SET_SESSIONS', payload: sessions });
        } catch (e) {
          console.error('Failed to parse chatSessions from storage', e);
        }
      }
    };
    window.addEventListener('storage', onStorage);

    return () => {
      window.removeEventListener('storage', onStorage);
      try {
        bcRef.current?.close();
      } catch {}
    };
  }, []);

  // Actions
  const sendMessage = useCallback((text: string, sessionId: string, sender: 'user' | 'admin' = 'user', attachments: Attachment[] = []) => {
    const message: ChatMessage = {
      id: generateId('msg-'),
      text,
      sender,
      timestamp: new Date().toISOString(),
      status: 'sent',
      sessionId,
      attachments
    };

    dispatch({ type: 'ADD_MESSAGE', payload: { sessionId, message } });
    // Broadcast action for instant sync
    try {
      const sessions = JSON.parse(localStorage.getItem('chatSessions') || '[]');
      const nextSessions = (sessions as ChatSession[]).map(s => s.id === sessionId ? {
        ...s,
        messages: [...s.messages, message],
        lastMessage: message.text,
        lastActivity: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        unreadCount: message.sender === 'user' ? s.unreadCount + 1 : s.unreadCount
      } : s);
      localStorage.setItem('chatSessions', JSON.stringify(nextSessions));
      window.dispatchEvent(new CustomEvent('chatSessionsUpdated', { detail: nextSessions }));
      if (bcRef.current) bcRef.current.postMessage({ type: 'SESSIONS_UPDATED', sessions: nextSessions, source: tabIdRef.current });
    } catch {}
  }, []);

  const createSession = useCallback((visitorInfo: { 
    name: string; 
    email?: string; 
    phone?: string;
    ipAddress?: string;
    userAgent?: string;
    pageUrl?: string;
    department?: string;
  }): string => {
    const sessionId = generateId('session-');
    
    const newSession: ChatSession = {
      id: sessionId,
      visitorName: visitorInfo.name,
      visitorEmail: visitorInfo.email,
      visitorPhone: visitorInfo.phone,
      status: 'active',
      priority: 'medium',
      messages: [],
      unreadCount: 0,
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastMessage: '',
      lastActivity: new Date().toISOString(),
      ipAddress: visitorInfo.ipAddress,
      userAgent: visitorInfo.userAgent,
      pageUrl: visitorInfo.pageUrl,
      department: visitorInfo.department || 'عمومی'
    };

    dispatch({ type: 'ADD_SESSION', payload: newSession });
    // Broadcast creation
    try {
      const sessions = JSON.parse(localStorage.getItem('chatSessions') || '[]');
      const nextSessions = [newSession, ...(sessions as ChatSession[])];
      localStorage.setItem('chatSessions', JSON.stringify(nextSessions));
      window.dispatchEvent(new CustomEvent('chatSessionsUpdated', { detail: nextSessions }));
      if (bcRef.current) bcRef.current.postMessage({ type: 'SESSIONS_UPDATED', sessions: nextSessions, source: tabIdRef.current });
    } catch {}
    return sessionId;
  }, []);

  const markAsRead = useCallback((sessionId: string) => {
    dispatch({ type: 'MARK_AS_READ', payload: sessionId });
    try {
      const sessions = JSON.parse(localStorage.getItem('chatSessions') || '[]');
      const nextSessions = (sessions as ChatSession[]).map(s => s.id === sessionId ? { ...s, unreadCount: 0 } : s);
      localStorage.setItem('chatSessions', JSON.stringify(nextSessions));
      window.dispatchEvent(new CustomEvent('chatSessionsUpdated', { detail: nextSessions }));
      if (bcRef.current) bcRef.current.postMessage({ type: 'SESSIONS_UPDATED', sessions: nextSessions, source: tabIdRef.current });
    } catch {}
  }, []);

  const markAllAsRead = useCallback(() => {
    dispatch({ type: 'MARK_ALL_AS_READ' });
  }, []);

  const closeSession = useCallback((sessionId: string) => {
    dispatch({ type: 'CLOSE_SESSION', payload: sessionId });
  }, []);

  const reopenSession = useCallback((sessionId: string) => {
    dispatch({ type: 'REOPEN_SESSION', payload: sessionId });
  }, []);

  const archiveSession = useCallback((sessionId: string) => {
    dispatch({ type: 'ARCHIVE_SESSION', payload: sessionId });
  }, []);

  const deleteSession = useCallback((sessionId: string) => {
    dispatch({ type: 'DELETE_SESSION', payload: sessionId });
  }, []);

  const assignSession = useCallback((sessionId: string, adminId: string, adminName: string) => {
    dispatch({ type: 'ASSIGN_SESSION', payload: { sessionId, adminId, adminName } });
  }, []);

  const unassignSession = useCallback((sessionId: string) => {
    dispatch({ type: 'UNASSIGN_SESSION', payload: sessionId });
  }, []);

  const setPriority = useCallback((sessionId: string, priority: string) => {
    dispatch({ type: 'SET_PRIORITY', payload: { sessionId, priority } });
  }, []);

  const addTag = useCallback((sessionId: string, tag: string) => {
    dispatch({ type: 'ADD_TAG', payload: { sessionId, tag } });
  }, []);

  const removeTag = useCallback((sessionId: string, tag: string) => {
    dispatch({ type: 'REMOVE_TAG', payload: { sessionId, tag } });
  }, []);

  const setActiveSession = useCallback((sessionId: string | null) => {
    dispatch({ type: 'SET_ACTIVE_SESSION', payload: sessionId });
  }, []);

  const markNotificationAsRead = useCallback((notificationId: string) => {
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: notificationId });
  }, []);

  const clearNotifications = useCallback(() => {
    dispatch({ type: 'CLEAR_NOTIFICATIONS' });
  }, []);

  const setFilter = useCallback((key: string, value: any) => {
    dispatch({ type: 'SET_FILTER', payload: { key, value } });
  }, []);

  const setSearchTerm = useCallback((term: string) => {
    dispatch({ type: 'SET_SEARCH_TERM', payload: term });
  }, []);

  const addFeedback = useCallback((sessionId: string, rating: number, feedback: string) => {
    dispatch({ type: 'ADD_FEEDBACK', payload: { sessionId, rating, feedback } });
  }, []);

  const updateMessage = useCallback((sessionId: string, messageId: string, updates: Partial<ChatMessage>) => {
    dispatch({ type: 'UPDATE_MESSAGE', payload: { sessionId, messageId, updates } });
  }, []);

  const deleteMessage = useCallback((sessionId: string, messageId: string) => {
    dispatch({ type: 'DELETE_MESSAGE', payload: { sessionId, messageId } });
  }, []);

  const syncWithLocalStorage = useCallback(() => {
    dispatch({ type: 'SYNC_WITH_LOCAL_STORAGE' });
  }, []);

  const clearChatData = useCallback(() => {
    dispatch({ type: 'CLEAR_CHAT_DATA' });
  }, []);

  const exportSession = useCallback((sessionId: string): string => {
    const session = state.sessions.find(s => s.id === sessionId);
    if (!session) throw new Error('Session not found');
    return JSON.stringify(session, null, 2);
  }, [state.sessions]);

  const importSessions = useCallback((sessions: ChatSession[]) => {
    sessions.forEach(session => {
      if (validateSession(session)) {
        dispatch({ type: 'ADD_SESSION', payload: session });
      }
    });
  }, []);

  const getSessionStats = useCallback(() => ({
    total: state.sessions.length,
    active: state.sessions.filter(s => s.status === 'active').length,
    waiting: state.sessions.filter(s => s.status === 'waiting').length,
    closed: state.sessions.filter(s => s.status === 'closed').length,
    archived: state.sessions.filter(s => s.status === 'archived').length,
    unread: state.sessions.reduce((sum, session) => sum + session.unreadCount, 0)
  }), [state.sessions]);

  const searchMessages = useCallback((query: string, sessionId?: string) => {
    const results: { session: ChatSession; message: ChatMessage }[] = [];
    const lowerQuery = query.toLowerCase();

    const sessionsToSearch = sessionId 
      ? state.sessions.filter(s => s.id === sessionId)
      : state.sessions;

    sessionsToSearch.forEach(session => {
      session.messages.forEach(message => {
        if (message.text.toLowerCase().includes(lowerQuery)) {
          results.push({ session, message });
        }
      });
    });

    return results;
  }, [state.sessions]);

  const getUnreadCount = useCallback(() => {
    return state.sessions.reduce((total, session) => total + session.unreadCount, 0);
  }, [state.sessions]);

  const value: ChatContextType = {
    // State
    sessions: state.sessions,
    activeSession: state.activeSession,
    isConnected: state.isConnected,
    notifications: state.notifications,
    isLoading: state.isLoading,
    filters: state.filters,
    searchTerm: state.searchTerm,
    onlineAdmins: state.onlineAdmins,
    
    // Actions
    sendMessage,
    createSession,
    markAsRead,
    markAllAsRead,
    closeSession,
    reopenSession,
    archiveSession,
    deleteSession,
    assignSession,
    unassignSession,
    setPriority,
    addTag,
    removeTag,
    setActiveSession,
    markNotificationAsRead,
    clearNotifications,
    setFilter,
    setSearchTerm,
    addFeedback,
    updateMessage,
    deleteMessage,
    syncWithLocalStorage,
    clearChatData,
    exportSession,
    importSessions,
    getSessionStats,
    searchMessages,
    getUnreadCount
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

// Hook
export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

// Hook for session management
export const useSession = (sessionId?: string) => {
  const { sessions, setActiveSession, markAsRead, ...context } = useChat();
  
  const session = sessionId ? sessions.find(s => s.id === sessionId) : null;
  
  const selectSession = useCallback((id: string) => {
    setActiveSession(id);
    markAsRead(id);
  }, [setActiveSession, markAsRead]);
  
  return {
    session,
    sessions,
    selectSession,
    setActiveSession,
    markAsRead,
    ...context
  };
};

// Hook for notifications
export const useChatNotifications = () => {
  const { notifications, markNotificationAsRead, clearNotifications } = useChat();
  
  const unreadNotifications = notifications.filter(n => !n.read);
  const unreadCount = unreadNotifications.length;
  
  const markAllAsRead = useCallback(() => {
    notifications.forEach(notif => {
      if (!notif.read) {
        markNotificationAsRead(notif.id);
      }
    });
  }, [notifications, markNotificationAsRead]);
  
  return {
    notifications,
    unreadNotifications,
    unreadCount,
    markNotificationAsRead,
    markAllAsRead,
    clearNotifications
  };
};

export default ChatContext;