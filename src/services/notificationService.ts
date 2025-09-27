// Notification Service for Admin Panel
export class NotificationService {
  private static instance: NotificationService;
  private permission: NotificationPermission = 'default';
  private audioContext: AudioContext | null = null;
  private notificationSound: AudioBuffer | null = null;

  private constructor() {
    this.initializeAudio();
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // Initialize audio context for notification sounds
  private async initializeAudio() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      await this.createNotificationSound();
    } catch (error) {
      console.warn('Audio context not available:', error);
    }
  }

  // Create a pleasant notification sound
  private async createNotificationSound() {
    if (!this.audioContext) return;

    try {
      const sampleRate = this.audioContext.sampleRate;
      const duration = 0.5; // 500ms
      const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
      const data = buffer.getChannelData(0);

      // Create a pleasant chime sound
      for (let i = 0; i < data.length; i++) {
        const t = i / sampleRate;
        const frequency1 = 800; // C5
        const frequency2 = 1000; // C6
        const envelope = Math.exp(-t * 3); // Exponential decay
        
        data[i] = (
          Math.sin(2 * Math.PI * frequency1 * t) * 0.3 +
          Math.sin(2 * Math.PI * frequency2 * t) * 0.2
        ) * envelope;
      }

      this.notificationSound = buffer;
    } catch (error) {
      console.warn('Failed to create notification sound:', error);
    }
  }

  // Request notification permission
  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return 'denied';
    }

    if (this.permission === 'granted') {
      return this.permission;
    }

    try {
      this.permission = await Notification.requestPermission();
      return this.permission;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return 'denied';
    }
  }

  // Show browser notification
  async showNotification(title: string, options: NotificationOptions = {}) {
    if (this.permission !== 'granted') {
      const newPermission = await this.requestPermission();
      if (newPermission !== 'granted') {
        console.warn('Notification permission denied');
        return null;
      }
    }

    try {
      const notification = new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'chat-notification',
        requireInteraction: false,
        silent: false,
        ...options
      });

      // Auto-close after 5 seconds
      setTimeout(() => {
        notification.close();
      }, 5000);

      return notification;
    } catch (error) {
      console.error('Error showing notification:', error);
      return null;
    }
  }

  // Play notification sound
  async playNotificationSound() {
    if (!this.audioContext || !this.notificationSound) {
      // Fallback to simple beep
      this.playFallbackSound();
      return;
    }

    try {
      const source = this.audioContext.createBufferSource();
      const gainNode = this.audioContext.createGain();
      
      source.buffer = this.notificationSound;
      source.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      // Set volume
      gainNode.gain.value = 0.3;
      
      source.start();
    } catch (error) {
      console.warn('Error playing notification sound:', error);
      this.playFallbackSound();
    }
  }

  // Fallback sound using Web Audio API
  private playFallbackSound() {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.warn('Fallback sound failed:', error);
    }
  }

  // Show chat notification
  async showChatNotification(type: 'new_message' | 'new_session' | 'urgent_message', data: any) {
    const notifications = {
      new_message: {
        title: '💬 پیام جدید',
        body: `پیام جدید از ${data.visitorName || 'مشتری'}`,
        icon: '/favicon.ico'
      },
      new_session: {
        title: '🆕 چت جدید',
        body: `چت جدید از ${data.visitorName || 'مشتری جدید'}`,
        icon: '/favicon.ico'
      },
      urgent_message: {
        title: '🚨 پیام فوری',
        body: `پیام فوری از ${data.visitorName || 'مشتری'}`,
        icon: '/favicon.ico'
      }
    };

    const notification = notifications[type];
    if (!notification) return;

    // Show browser notification
    await this.showNotification(notification.title, {
      body: notification.body,
      icon: notification.icon,
      tag: `chat-${type}-${data.sessionId || 'unknown'}`
    });

    // Play sound
    await this.playNotificationSound();
  }

  // Show admin panel notification
  async showAdminNotification(message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') {
    const icons = {
      info: 'ℹ️',
      success: '✅',
      warning: '⚠️',
      error: '❌'
    };

    await this.showNotification(`${icons[type]} ${message}`, {
      icon: '/favicon.ico',
      tag: `admin-${type}`
    });
  }

  // Check if notifications are supported
  isSupported(): boolean {
    return 'Notification' in window;
  }

  // Get current permission status
  getPermission(): NotificationPermission {
    return this.permission;
  }
}

// Export singleton instance
export const notificationService = NotificationService.getInstance();