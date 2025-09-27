import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'admin' | 'system';
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  sessionId: string;
  adminId?: string;
  isTyping?: boolean;
}

export interface ChatSession {
  id: string;
  visitorName: string;
  visitorEmail?: string;
  visitorPhone?: string;
  status: 'active' | 'closed' | 'waiting';
  createdAt: string;
  updatedAt: string;
  lastMessage: string;
  unreadCount: number;
  assignedTo?: string;
  priority: 'low' | 'medium' | 'high';
  messages: ChatMessage[];
}

interface ChatContextType {
  sessions: ChatSession[];
  activeSession: ChatSession | null;
  isTyping: boolean;
  unreadCount: number;
  sendMessage: (message: string, sessionId: string) => Promise<void>;
  createSession: (visitorInfo: { name: string; email?: string; phone?: string }) => string;
  closeSession: (sessionId: string) => void;
  assignSession: (sessionId: string, adminId: string) => void;
  markAsRead: (sessionId: string) => void;
  setActiveSession: (session: ChatSession | null) => void;
  getUnreadCount: () => number;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Mock data for demo
const initialSessions: ChatSession[] = [
  {
    id: 'session-1',
    visitorName: 'احمد رضایی',
    visitorEmail: 'ahmad@example.com',
    visitorPhone: '09123456789',
    status: 'active',
    createdAt: '2024-01-15T14:00:00Z',
    updatedAt: '2024-01-15T14:30:00Z',
    lastMessage: 'سلام، می‌خواستم در مورد ژنراتورها سوال کنم',
    unreadCount: 3,
    priority: 'medium',
    messages: [
      {
        id: 'msg-1',
        text: 'سلام، چطور می‌تونم کمکتون کنم؟',
        sender: 'admin',
        timestamp: '2024-01-15T14:05:00Z',
        status: 'read',
        sessionId: 'session-1',
        adminId: 'admin-1'
      },
      {
        id: 'msg-2',
        text: 'سلام، می‌خواستم در مورد ژنراتورها سوال کنم',
        sender: 'user',
        timestamp: '2024-01-15T14:10:00Z',
        status: 'delivered',
        sessionId: 'session-1'
      },
      {
        id: 'msg-3',
        text: 'چه نوع ژنراتوری مد نظرتون هست؟',
        sender: 'admin',
        timestamp: '2024-01-15T14:15:00Z',
        status: 'read',
        sessionId: 'session-1',
        adminId: 'admin-1'
      },
      {
        id: 'msg-4',
        text: 'برای یک شرکت صنعتی نیاز دارم',
        sender: 'user',
        timestamp: '2024-01-15T14:20:00Z',
        status: 'delivered',
        sessionId: 'session-1'
      },
      {
        id: 'msg-5',
        text: 'برای اطلاعات بیشتر لطفاً با شماره 021-58635 تماس بگیرید',
        sender: 'admin',
        timestamp: '2024-01-15T14:25:00Z',
        status: 'sent',
        sessionId: 'session-1',
        adminId: 'admin-1'
      },
      {
        id: 'msg-6',
        text: 'ممنون از راهنمایی شما',
        sender: 'user',
        timestamp: '2024-01-15T14:30:00Z',
        status: 'sent',
        sessionId: 'session-1'
      }
    ]
  },
  {
    id: 'session-2',
    visitorName: 'مریم احمدی',
    visitorEmail: 'maryam@example.com',
    status: 'waiting',
    createdAt: '2024-01-15T13:45:00Z',
    updatedAt: '2024-01-15T13:50:00Z',
    lastMessage: 'قیمت ژنراتور 50 کیلووات چقدر است؟',
    unreadCount: 1,
    priority: 'high',
    messages: [
      {
        id: 'msg-7',
        text: 'قیمت ژنراتور 50 کیلووات چقدر است؟',
        sender: 'user',
        timestamp: '2024-01-15T13:50:00Z',
        status: 'sent',
        sessionId: 'session-2'
      }
    ]
  },
  {
    id: 'session-3',
    visitorName: 'علی محمدی',
    visitorEmail: 'ali@example.com',
    visitorPhone: '09345678901',
    status: 'closed',
    createdAt: '2024-01-15T12:30:00Z',
    updatedAt: '2024-01-15T13:00:00Z',
    lastMessage: 'سفارش ثبت شد، ممنون',
    unreadCount: 0,
    priority: 'low',
    messages: [
      {
        id: 'msg-8',
        text: 'سلام، می‌خواستم سفارش ژنراتور بدم',
        sender: 'user',
        timestamp: '2024-01-15T12:35:00Z',
        status: 'read',
        sessionId: 'session-3'
      },
      {
        id: 'msg-9',
        text: 'سلام، خوش آمدید. چه کمکی می‌تونم بکنم؟',
        sender: 'admin',
        timestamp: '2024-01-15T12:40:00Z',
        status: 'read',
        sessionId: 'session-3',
        adminId: 'admin-1'
      },
      {
        id: 'msg-10',
        text: 'سفارش ثبت شد، ممنون',
        sender: 'user',
        timestamp: '2024-01-15T13:00:00Z',
        status: 'read',
        sessionId: 'session-3'
      }
    ]
  }
];

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sessions, setSessions] = useState<ChatSession[]>(initialSessions);
  const [activeSession, setActiveSession] = useState<ChatSession | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();

  // Load sessions from localStorage on mount
  useEffect(() => {
    const savedSessions = localStorage.getItem('chatSessions');
    if (savedSessions) {
      setSessions(JSON.parse(savedSessions));
    }

    // Calculate initial unread count
    const totalUnread = initialSessions.reduce((sum, session) => sum + session.unreadCount, 0);
    setUnreadCount(totalUnread);
  }, []);

  // Save sessions to localStorage whenever sessions change
  useEffect(() => {
    localStorage.setItem('chatSessions', JSON.stringify(sessions));

    // Update unread count
    const totalUnread = sessions.reduce((sum, session) => sum + session.unreadCount, 0);
    setUnreadCount(totalUnread);
  }, [sessions]);

  // Show notification for new messages
  useEffect(() => {
    const handleNewMessage = (event: CustomEvent) => {
      if (event.detail && event.detail.sessionId) {
        // Show browser notification if permission granted
        if (Notification.permission === 'granted') {
          new Notification('پیام جدید', {
            body: `پیام جدید از ${event.detail.visitorName}`,
            icon: '/favicon.ico'
          });
        }
      }
    };

    window.addEventListener('newChatMessage', handleNewMessage as EventListener);
    return () => window.removeEventListener('newChatMessage', handleNewMessage as EventListener);
  }, []);

  const createSession = (visitorInfo: { name: string; email?: string; phone?: string }) => {
    const newSession: ChatSession = {
      id: `session-${Date.now()}`,
      visitorName: visitorInfo.name,
      visitorEmail: visitorInfo.email,
      visitorPhone: visitorInfo.phone,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastMessage: `سلام، چطور می‌تونم کمکتون کنم؟`,
      unreadCount: 0,
      priority: 'medium',
      messages: []
    };

    setSessions(prev => [newSession, ...prev]);
    return newSession.id;
  };

  const sendMessage = async (message: string, sessionId: string) => {
    if (!message.trim()) return;

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      text: message,
      sender: 'user',
      timestamp: new Date().toISOString(),
      status: 'sent',
      sessionId
    };

    // Update session with new message
    setSessions(prev => prev.map(session => {
      if (session.id === sessionId) {
        return {
          ...session,
          messages: [...session.messages, newMessage],
          updatedAt: new Date().toISOString(),
          lastMessage: message,
          unreadCount: session.status === 'waiting' ? session.unreadCount + 1 : 0
        };
      }
      return session;
    }));

    // Simulate admin response after 1-3 seconds
    const responseDelay = Math.random() * 2000 + 1000;
    setTimeout(() => {
      const adminResponse: ChatMessage = {
        id: `msg-${Date.now()}`,
        text: generateAutoResponse(message),
        sender: 'admin',
        timestamp: new Date().toISOString(),
        status: 'sent',
        sessionId,
        adminId: 'admin-1'
      };

      setSessions(prev => prev.map(session => {
        if (session.id === sessionId) {
          return {
            ...session,
            messages: [...session.messages, adminResponse],
            updatedAt: new Date().toISOString(),
            lastMessage: adminResponse.text
          };
        }
        return session;
      }));
    }, responseDelay);
  };

  const generateAutoResponse = (userMessage: string): string => {
    const responses = [
      'ممنون از پیام شما. یکی از کارشناسان ما به زودی با شما تماس خواهد گرفت.',
      'سوال خوبی پرسیدید. لطفاً کمی بیشتر توضیح دهید.',
      'برای اطلاعات دقیق‌تر، لطفاً با شماره 021-58635 تماس بگیرید.',
      'متخصصان ما در حال بررسی درخواست شما هستند.',
      'از صبر و شکیبایی شما سپاسگزاریم.'
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const closeSession = (sessionId: string) => {
    setSessions(prev => prev.map(session =>
      session.id === sessionId
        ? { ...session, status: 'closed', updatedAt: new Date().toISOString() }
        : session
    ));
  };

  const assignSession = (sessionId: string, adminId: string) => {
    setSessions(prev => prev.map(session =>
      session.id === sessionId
        ? { ...session, assignedTo: adminId, status: 'active' }
        : session
    ));
  };

  const markAsRead = (sessionId: string) => {
    setSessions(prev => prev.map(session =>
      session.id === sessionId
        ? { ...session, unreadCount: 0 }
        : session
    ));
  };

  const getUnreadCount = () => {
    return sessions.reduce((total, session) => total + session.unreadCount, 0);
  };

  return (
    <ChatContext.Provider value={{
      sessions,
      activeSession,
      isTyping,
      unreadCount,
      sendMessage,
      createSession,
      closeSession,
      assignSession,
      markAsRead,
      setActiveSession,
      getUnreadCount
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};