// Real-time Chat Service
export class ChatService {
  private static instance: ChatService;
  private eventSource: EventSource | null = null;
  private listeners: Map<string, Function[]> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  private constructor() {}

  static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }
    return ChatService.instance;
  }

  // Connect to real-time updates
  connect() {
    if (this.eventSource) {
      this.disconnect();
    }

    try {
      // Prefer simulated updates in dev unless CHAT_SSE_URL is provided
      const sseUrl = (import.meta as any)?.env?.VITE_CHAT_SSE_URL;
      if (!sseUrl) {
        this.simulateRealTimeUpdates();
        return;
      }
      this.eventSource = new EventSource(sseUrl);
      
      this.eventSource.onopen = () => {
        console.log('🔗 Chat service connected');
        this.reconnectAttempts = 0;
        this.emit('connected', {});
      };

      this.eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.emit('message', data);
        } catch (error) {
          console.error('Error parsing chat message:', error);
        }
      };

      this.eventSource.onerror = (error) => {
        console.error('Chat service error:', error);
        this.emit('error', error);
        this.handleReconnect();
      };

    } catch (error) {
      console.error('Failed to connect to chat service:', error);
      this.simulateRealTimeUpdates();
    }
  }

  // Simulate real-time updates for development
  private simulateRealTimeUpdates() {
    console.log('🔄 Simulating real-time chat updates');
    
    // Simulate new messages every 10-30 seconds
    const simulateMessage = () => {
      const messages = [
        'سلام! چطور می‌تونم کمکتون کنم؟',
        'آیا سوال خاصی در مورد محصولات ما دارید؟',
        'لطفاً کمی صبر کنید، کارشناس ما به زودی پاسخ خواهد داد.',
        'برای اطلاعات بیشتر می‌تونید با شماره 021-58635 تماس بگیرید.',
        'ممنون از صبر شما. چطور می‌تونم بهتر کمکتون کنم؟'
      ];

      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      
      this.emit('message', {
        type: 'new_message',
        sessionId: 'simulated-session',
        message: {
          id: `sim-${Date.now()}`,
          text: randomMessage,
          sender: 'admin',
          timestamp: new Date().toISOString(),
          status: 'delivered'
        }
      });

      // Schedule next message
      const nextDelay = Math.random() * 20000 + 10000; // 10-30 seconds
      setTimeout(simulateMessage, nextDelay);
    };

    // Start simulation after 5 seconds
    setTimeout(simulateMessage, 5000);
  }

  // Handle reconnection
  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
      
      console.log(`🔄 Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);
      
      setTimeout(() => {
        this.connect();
      }, delay);
    } else {
      console.error('❌ Max reconnection attempts reached');
      this.emit('disconnected', {});
    }
  }

  // Disconnect from real-time updates
  disconnect() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    this.emit('disconnected', {});
  }

  // Send message to server
  async sendMessage(message: {
    text: string;
    sessionId: string;
    sender: 'user' | 'admin';
    attachments?: any[];
  }) {
    try {
      // In a real app, this would send to your backend API
      const response = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      return await response.json();
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  // Create new chat session
  async createSession(visitorInfo: {
    name: string;
    email?: string;
    phone?: string;
    department?: string;
  }) {
    try {
      const response = await fetch('/api/chat/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(visitorInfo),
      });

      if (!response.ok) {
        throw new Error('Failed to create session');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating session:', error);
      // Return a simulated session for development
      return {
        id: `session-${Date.now()}`,
        ...visitorInfo,
        status: 'active',
        createdAt: new Date().toISOString(),
      };
    }
  }

  // Event system
  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  off(event: string, callback: Function) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      const index = eventListeners.indexOf(callback);
      if (index > -1) {
        eventListeners.splice(index, 1);
      }
    }
  }

  private emit(event: string, data: any) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(callback => callback(data));
    }
  }

  // Get connection status
  isConnected(): boolean {
    return this.eventSource?.readyState === EventSource.OPEN;
  }
}

// Export singleton instance
export const chatService = ChatService.getInstance();