import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  MessageCircle, 
  X, 
  Send, 
  User, 
  Bot, 
  Phone, 
  Mail, 
  Loader2, 
  Paperclip,
  Image,
  FileText,
  Minimize2,
  Maximize2,
  Settings,
  Clock,
  CheckCircle,
  AlertCircle,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useChat } from '@/contexts/ChatContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCompany } from '@/contexts/CompanyContext';
import { toast } from 'sonner';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [visitorInfo, setVisitorInfo] = useState({
    name: '',
    email: '',
    phone: '',
    department: 'عمومی'
  });
  const [showVisitorForm, setShowVisitorForm] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');
  const [lastSeen, setLastSeen] = useState<string>('');
  const [unreadMessages, setUnreadMessages] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const { 
    sessions, 
    sendMessage, 
    createSession, 
    markAsRead,
    notifications,
    isConnected,
    getUnreadCount
  } = useChat();
  
  const { language, t, dir } = useLanguage();
  const { companyData } = useCompany();
  const company = companyData[language];

  const currentSession = sessionId ? sessions.find(s => s.id === sessionId) : null;
  const messages = currentSession?.messages || [];

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Check for existing session on mount
  useEffect(() => {
    const existingSessionId = localStorage.getItem('chatWidgetSessionId');
    if (existingSessionId) {
      const existingSession = sessions.find(s => s.id === existingSessionId && s.status !== 'closed');
      if (existingSession) {
        setSessionId(existingSessionId);
        setShowVisitorForm(false);
        setConnectionStatus('connected');
      } else {
        localStorage.removeItem('chatWidgetSessionId');
      }
    }
  }, [sessions]);

  // Update connection status
  useEffect(() => {
    if (sessionId) {
      setConnectionStatus(isConnected ? 'connected' : 'disconnected');
    }
  }, [isConnected, sessionId]);

  // Update unread count when widget is closed
  useEffect(() => {
    if (!isOpen && currentSession) {
      const newMessages = messages.filter(msg => 
        msg.sender === 'admin' && 
        new Date(msg.timestamp) > new Date(lastSeen)
      );
      setUnreadMessages(newMessages.length);
    } else if (isOpen) {
      setUnreadMessages(0);
      setLastSeen(new Date().toISOString());
      if (sessionId) {
        markAsRead(sessionId);
      }
    }
  }, [isOpen, messages, lastSeen, sessionId, currentSession, markAsRead]);

  // Listen for new notifications
  useEffect(() => {
    const unreadNotifs = notifications.filter(n => 
      !n.read && 
      n.sessionId === sessionId && 
      n.type === 'new_message'
    );
    
    if (unreadNotifs.length > 0 && !isOpen) {
      setUnreadMessages(prev => prev + unreadNotifs.length);
      
      // Show browser notification
      if ('Notification' in window && Notification.permission === 'granted') {
        const latestNotif = unreadNotifs[0];
        new Notification('پیام جدید از پشتیبانی', {
          body: latestNotif.message,
          icon: '/favicon.ico',
          tag: 'chat-widget'
        });
      }
    }
  }, [notifications, sessionId, isOpen]);

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const handleStartChat = useCallback(async () => {
    if (!visitorInfo.name.trim()) {
      toast.error('لطفاً نام خود را وارد کنید');
      return;
    }

    try {
      setConnectionStatus('connecting');
      
      const newSessionId = await createSession({
        name: visitorInfo.name,
        email: visitorInfo.email || undefined,
        phone: visitorInfo.phone || undefined,
        department: visitorInfo.department,
        pageUrl: window.location.href,
        userAgent: navigator.userAgent,
        ipAddress: 'Unknown' // In real app, get from backend
      });
      
      setSessionId(newSessionId);
      localStorage.setItem('chatWidgetSessionId', newSessionId);
      setShowVisitorForm(false);
      setConnectionStatus('connected');
      
      // Send welcome message
      setTimeout(() => {
        sendMessage(
          `سلام ${visitorInfo.name}! چطور می‌تونم کمکتون کنم؟`, 
          newSessionId, 
          'admin'
        );
      }, 1000);
      
      toast.success('چت با موفقیت شروع شد');
    } catch (error) {
      console.error('Error starting chat:', error);
      setConnectionStatus('disconnected');
      toast.error('خطا در شروع چت');
    }
  }, [visitorInfo, createSession, sendMessage]);

  const handleSendMessage = useCallback(async () => {
    if (!message.trim() || !sessionId) return;

    try {
      await sendMessage(message.trim(), sessionId, 'user');
      setMessage('');
      setIsTyping(false);
      
      // Clear typing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Simulate admin typing after user message
      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
        }, 2000 + Math.random() * 3000);
      }, 500);
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('خطا در ارسال پیام');
    }
  }, [message, sessionId, sendMessage]);

  const handleTyping = useCallback(() => {
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 1000);
  }, []);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    } else {
      handleTyping();
    }
  }, [handleSendMessage, handleTyping]);

  const handleCloseChat = useCallback(() => {
    setIsOpen(false);
    if (sessionId) {
      setLastSeen(new Date().toISOString());
    }
  }, [sessionId]);

  const handleEndChat = useCallback(() => {
    if (sessionId && window.confirm('آیا مطمئن هستید که می‌خواهید چت را پایان دهید؟')) {
      localStorage.removeItem('chatWidgetSessionId');
      setSessionId(null);
      setShowVisitorForm(true);
      setConnectionStatus('disconnected');
      setMessage('');
      setIsOpen(false);
      toast.info('چت پایان یافت');
    }
  }, [sessionId]);

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('fa-IR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMessageIcon = (sender: string) => {
    switch (sender) {
      case 'user':
        return <User className="w-4 h-4" />;
      case 'admin':
        return <Bot className="w-4 h-4" />;
      default:
        return <MessageCircle className="w-4 h-4" />;
    }
  };

  const getMessageStyle = (sender: string) => {
    switch (sender) {
      case 'user':
        return 'bg-blue-600 text-white ml-auto';
      case 'admin':
        return 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white';
      default:
        return 'bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-100';
    }
  };

  const getConnectionStatusBadge = () => {
    switch (connectionStatus) {
      case 'connecting':
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <Loader2 className="w-3 h-3 animate-spin" />
            در حال اتصال...
          </Badge>
        );
      case 'connected':
        return (
          <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            آنلاین
          </Badge>
        );
      case 'disconnected':
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <div className="w-2 h-2 bg-red-500 rounded-full" />
            آفلاین
          </Badge>
        );
    }
  };

  return (
    <>
      {/* Professional Chat Button */}
      <div className="fixed bottom-6 left-6 z-50">
        <div className="relative group">
          {/* Main Chat Button */}
          <Button
            onClick={() => setIsOpen(!isOpen)}
            className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 hover:from-blue-600 hover:via-blue-700 hover:to-purple-700 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-110 group relative overflow-hidden"
          >
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Icon with Animation */}
            <div className="relative z-10">
              {isOpen ? (
                <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300 text-white" />
              ) : (
                <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform duration-300 text-white" />
              )}
            </div>
            
            {/* Shine Effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          </Button>
          
          {/* Professional Unread Badge */}
          {unreadMessages > 0 && !isOpen && (
            <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold flex items-center justify-center shadow-lg animate-pulse border-2 border-white">
              {unreadMessages > 9 ? '9+' : unreadMessages}
            </div>
          )}
          
          {/* Professional Pulse Animation */}
          {!isOpen && (
            <>
              <div className="absolute inset-0 rounded-full bg-blue-500 animate-ping opacity-30"></div>
              <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-20" style={{ animationDelay: '0.5s' }}></div>
            </>
          )}
          
          {/* Online Status Indicator */}
          {connectionStatus === 'connected' && !isOpen && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
          )}
        </div>
      </div>

      {/* Professional Chat Window */}
      {isOpen && (
        <div className={`fixed bottom-24 left-6 w-96 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 z-50 flex flex-col overflow-hidden transition-all duration-500 ${
          isMinimized ? 'h-16' : 'h-[600px]'
        }`}>
          
          {/* Professional Header */}
          <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-600 text-white p-5 flex-shrink-0 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-50"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
            
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="w-12 h-12 border-3 border-white/30 shadow-lg">
                    <AvatarImage src="/api/placeholder/48/48" />
                    <AvatarFallback className="bg-white/20 text-white font-bold text-lg">
                      <Bot className="w-6 h-6" />
                    </AvatarFallback>
                  </Avatar>
                  {connectionStatus === 'connected' && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-1">{company.name}</h3>
                  <div className="flex items-center gap-3">
                    {getConnectionStatusBadge()}
                    {currentSession && (
                      <span className="text-xs opacity-90 bg-white/20 px-2 py-1 rounded-full">
                        ID: {currentSession.id.slice(-6)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="text-white hover:bg-white/20 w-8 h-8"
                >
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCloseChat}
                  className="text-white hover:bg-white/20 w-8 h-8"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            {/* Connection Info */}
            <div className="mt-2 text-sm opacity-90">
              {connectionStatus === 'connected' && currentSession ? (
                <span>متصل به پشتیبانی • {messages.length} پیام</span>
              ) : connectionStatus === 'connecting' ? (
                <span>در حال اتصال به پشتیبانی...</span>
              ) : (
                <span>آماده شروع گفتگو</span>
              )}
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Visitor Info Form */}
              {showVisitorForm ? (
                <div className="flex-1 p-6 bg-gray-50 dark:bg-gray-700 overflow-y-auto">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageCircle className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="font-bold text-xl mb-2 text-gray-900 dark:text-white">
                      {language === 'fa' ? 'شروع گفتگو' : 'Start Conversation'}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {language === 'fa' 
                        ? 'لطفاً اطلاعات خود را وارد کنید تا بتوانیم بهتر کمک کنیم'
                        : 'Please enter your information so we can help you better'
                      }
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        {language === 'fa' ? 'نام شما' : 'Your Name'} *
                      </label>
                      <Input
                        value={visitorInfo.name}
                        onChange={(e) => setVisitorInfo({...visitorInfo, name: e.target.value})}
                        placeholder={language === 'fa' ? 'نام و نام خانوادگی' : 'Full Name'}
                        className="border-gray-300 dark:border-gray-600"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        {language === 'fa' ? 'ایمیل (اختیاری)' : 'Email (Optional)'}
                      </label>
                      <Input
                        type="email"
                        value={visitorInfo.email}
                        onChange={(e) => setVisitorInfo({...visitorInfo, email: e.target.value})}
                        placeholder="email@example.com"
                        className="border-gray-300 dark:border-gray-600"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        {language === 'fa' ? 'شماره تماس (اختیاری)' : 'Phone (Optional)'}
                      </label>
                      <Input
                        value={visitorInfo.phone}
                        onChange={(e) => setVisitorInfo({...visitorInfo, phone: e.target.value})}
                        placeholder="09xxxxxxxxx"
                        className="border-gray-300 dark:border-gray-600"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        {language === 'fa' ? 'موضوع مورد نظر' : 'Subject'}
                      </label>
                      <select
                        value={visitorInfo.department}
                        onChange={(e) => setVisitorInfo({...visitorInfo, department: e.target.value})}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="عمومی">سوال عمومی</option>
                        <option value="فروش">فروش و قیمت‌گذاری</option>
                        <option value="فنی">پشتیبانی فنی</option>
                        <option value="خدمات">خدمات پس از فروش</option>
                        <option value="شکایات">شکایات و پیشنهادات</option>
                      </select>
                    </div>

                    <Button
                      onClick={handleStartChat}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 h-12 text-lg font-semibold"
                      disabled={!visitorInfo.name.trim() || connectionStatus === 'connecting'}
                    >
                      {connectionStatus === 'connecting' ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          در حال اتصال...
                        </>
                      ) : (
                        <>
                          <MessageCircle className="w-5 h-5 mr-2" />
                          {language === 'fa' ? 'شروع چت' : 'Start Chat'}
                        </>
                      )}
                    </Button>
                  </div>
                  
                  {/* Quick Contact Info */}
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
                    <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                      <p className="mb-3">{language === 'fa' ? 'یا با ما تماس بگیرید:' : 'Or contact us:'}</p>
                      <div className="flex items-center justify-center gap-4">
                        <div className="flex items-center gap-1">
                          <Phone className="w-4 h-4 text-blue-600" />
                          <span className="font-medium">{company.phone}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Mail className="w-4 h-4 text-blue-600" />
                          <span className="font-medium">{company.email}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Chat Messages */}
                  <div className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-700">
                    {/* Welcome Message */}
                    {messages.length === 0 && (
                      <div className="text-center py-8">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Bot className="w-6 h-6 text-white" />
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">
                          {language === 'fa' 
                            ? 'سلام! چطور می‌تونم کمکتون کنم؟'
                            : 'Hello! How can I help you?'
                          }
                        </p>
                      </div>
                    )}

                    {/* Messages */}
                    <div className="space-y-4">
                      {messages.map((msg, index) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} ${
                            index === messages.length - 1 ? 'animate-fade-in' : ''
                          }`}
                        >
                          <div className="flex items-start gap-2 max-w-[85%]">
                            {msg.sender !== 'user' && (
                              <Avatar className="w-8 h-8 flex-shrink-0">
                                <AvatarFallback className="bg-gray-200 dark:bg-gray-600">
                                  {getMessageIcon(msg.sender)}
                                </AvatarFallback>
                              </Avatar>
                            )}
                            
                            <div className={`p-3 rounded-2xl shadow-sm ${getMessageStyle(msg.sender)}`}>
                              <p className="text-sm leading-relaxed">{msg.text}</p>
                              
                              {/* Attachments */}
                              {msg.attachments && msg.attachments.length > 0 && (
                                <div className="mt-2 space-y-2">
                                  {msg.attachments.map((attachment) => (
                                    <div key={attachment.id} className="flex items-center gap-2 p-2 bg-white/10 rounded-lg">
                                      {attachment.type === 'image' ? (
                                        <Image className="w-4 h-4" />
                                      ) : (
                                        <FileText className="w-4 h-4" />
                                      )}
                                      <span className="text-xs">{attachment.name}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                              
                              <div className="flex items-center justify-between mt-2 text-xs opacity-70">
                                <span>{formatTime(msg.timestamp)}</span>
                                {msg.sender === 'user' && (
                                  <span className="flex items-center gap-1">
                                    {msg.status === 'sent' && <Clock className="w-3 h-3" />}
                                    {msg.status === 'delivered' && <CheckCircle className="w-3 h-3" />}
                                    {msg.status === 'read' && <CheckCircle className="w-3 h-3 text-green-400" />}
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            {msg.sender === 'user' && (
                              <Avatar className="w-8 h-8 flex-shrink-0">
                                <AvatarFallback className="bg-blue-600 text-white">
                                  <User className="w-4 h-4" />
                                </AvatarFallback>
                              </Avatar>
                            )}
                          </div>
                        </div>
                      ))}

                      {/* Typing Indicator */}
                      {isTyping && (
                        <div className="flex justify-start">
                          <div className="flex items-center gap-2">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="bg-gray-200 dark:bg-gray-600">
                                <Bot className="w-4 h-4" />
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-600 p-3 rounded-2xl">
                              <div className="flex gap-1">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                              </div>
                              <span className="text-xs text-gray-500">در حال تایپ...</span>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div ref={messagesEndRef} />
                    </div>
                  </div>

                  {/* Chat Input */}
                  <div className="p-4 border-t dark:border-gray-600 bg-white dark:bg-gray-800 flex-shrink-0">
                    {/* Quick Actions */}
                    <div className="flex items-center gap-2 mb-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => sendMessage('سلام، می‌خواستم قیمت ژنراتور بپرسم', sessionId!, 'user')}
                        className="text-xs h-7 px-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                      >
                        💰 قیمت محصولات
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => sendMessage('می‌خواستم درباره خدمات پس از فروش بپرسم', sessionId!, 'user')}
                        className="text-xs h-7 px-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                      >
                        🔧 خدمات
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => sendMessage('لطفاً با من تماس بگیرید', sessionId!, 'user')}
                        className="text-xs h-7 px-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                      >
                        📞 تماس
                      </Button>
                    </div>

                    <div className="flex gap-2 items-end">
                      <div className="flex-1">
                        <Textarea
                          ref={messageInputRef}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          onKeyDown={handleKeyPress}
                          placeholder={language === 'fa' ? 'پیام خود را بنویسید...' : 'Type your message...'}
                          className="min-h-[40px] max-h-[120px] resize-none border-gray-300 dark:border-gray-600 focus:border-blue-500"
                          disabled={connectionStatus !== 'connected'}
                        />
                      </div>
                      
                      <div className="flex flex-col gap-1">
                        <Button
                          onClick={handleSendMessage}
                          disabled={!message.trim() || connectionStatus !== 'connected'}
                          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 w-10 h-10 p-0"
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="icon"
                          className="w-10 h-10 p-0"
                          disabled
                        >
                          <Paperclip className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Session Actions */}
                    {currentSession && (
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                          <Clock className="w-3 h-3" />
                          <span>شروع: {formatTime(currentSession.createdAt)}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleEndChat}
                            className="text-red-600 hover:text-red-700 text-xs h-7"
                          >
                            پایان چت
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      )}

      {/* Floating Help Button */}
      {!isOpen && (
        <div className="fixed bottom-24 left-6 z-40">
          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0 shadow-lg max-w-xs">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {language === 'fa' ? 'سوالی دارید؟' : 'Have a question?'}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {language === 'fa' ? 'همین الان با ما چت کنید' : 'Chat with us now'}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(true)}
                  className="w-6 h-6 p-0 ml-auto"
                >
                  <Zap className="w-4 h-4 text-blue-600" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default ChatWidget;