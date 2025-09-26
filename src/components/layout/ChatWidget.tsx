import { useState, useEffect } from 'react';
import { MessageCircle, X, Send, User, Bot, Phone, Mail, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useChat } from '@/contexts/ChatContext';
import { useLanguage } from '@/contexts/LanguageContext';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [visitorInfo, setVisitorInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [showVisitorForm, setShowVisitorForm] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const { sessions, activeSession, sendMessage, createSession, setActiveSession } = useChat();
  const { t, dir } = useLanguage();

  const currentSession = sessionId ? sessions.find(s => s.id === sessionId) : null;
  const messages = currentSession?.messages || [];

  useEffect(() => {
    // Check if there's an existing session
    const existingSession = sessions.find(s => s.status === 'active');
    if (existingSession) {
      setSessionId(existingSession.id);
      setShowVisitorForm(false);
    }
  }, [sessions]);

  const handleStartChat = () => {
    if (visitorInfo.name.trim()) {
      const newSessionId = createSession(visitorInfo);
      setSessionId(newSessionId);
      setShowVisitorForm(false);
    }
  };

  const handleSendMessage = async () => {
    if (message.trim() && sessionId) {
      await sendMessage(message, sessionId);
      setMessage('');
    }
  };

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

  return (
    <>
      {/* Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110"
        >
          {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
          {sessions.length > 0 && (
            <Badge className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0 flex items-center justify-center bg-red-500 text-white text-xs">
              {sessions.filter(s => s.status === 'active').length}
            </Badge>
          )}
        </Button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[600px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border dark:border-gray-700 z-50 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg">پشتیبانی آنلاین</h3>
                <p className="text-sm opacity-90">
                  {currentSession?.status === 'active' ? 'در حال چت' : 'آماده پاسخگویی'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${currentSession?.status === 'active' ? 'bg-green-400' : 'bg-yellow-400'} animate-pulse`} />
                <span className="text-xs">
                  {currentSession?.status === 'active' ? 'آنلاین' : 'منتظر'}
                </span>
              </div>
            </div>
          </div>

          {/* Visitor Info Form */}
          {showVisitorForm && (
            <div className="flex-1 p-6 bg-gray-50 dark:bg-gray-700">
              <div className="text-center mb-6">
                <MessageCircle className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                <h4 className="font-semibold mb-2">شروع چت</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  لطفاً اطلاعات خود را وارد کنید تا بتوانیم بهتر کمک کنیم
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">نام شما *</label>
                  <Input
                    value={visitorInfo.name}
                    onChange={(e) => setVisitorInfo({...visitorInfo, name: e.target.value})}
                    placeholder="نام و نام خانوادگی"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">ایمیل (اختیاری)</label>
                  <Input
                    type="email"
                    value={visitorInfo.email}
                    onChange={(e) => setVisitorInfo({...visitorInfo, email: e.target.value})}
                    placeholder="email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">شماره تماس (اختیاری)</label>
                  <Input
                    value={visitorInfo.phone}
                    onChange={(e) => setVisitorInfo({...visitorInfo, phone: e.target.value})}
                    placeholder="09xxxxxxxxx"
                  />
                </div>

                <Button
                  onClick={handleStartChat}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  disabled={!visitorInfo.name.trim()}
                >
                  شروع چت
                </Button>
              </div>
            </div>
          )}

          {/* Chat Messages */}
          {!showVisitorForm && currentSession && (
            <>
              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-700">
                <div className="space-y-4">
                  {messages.map((msg, index) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} ${index === messages.length - 1 ? 'animate-fade-in' : ''}`}
                    >
                      <div className="flex items-start gap-2 max-w-[85%]">
                        {msg.sender !== 'user' && (
                          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                            {getMessageIcon(msg.sender)}
                          </div>
                        )}
                        <div
                          className={`p-3 rounded-2xl ${getMessageStyle(msg.sender)} shadow-sm`}
                        >
                          <p className="text-sm leading-relaxed">{msg.text}</p>
                          <div className="flex items-center justify-between mt-2 text-xs opacity-70">
                            <span>{formatTime(msg.timestamp)}</span>
                            {msg.sender === 'user' && (
                              <span>{msg.status === 'sent' ? '✓' : msg.status === 'delivered' ? '✓✓' : '✓✓'}</span>
                            )}
                          </div>
                        </div>
                        {msg.sender === 'user' && (
                          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Typing Indicator */}
                  {currentSession?.status === 'active' && (
                    <div className="flex justify-start">
                      <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-600 p-3 rounded-2xl">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                        <span className="text-xs text-gray-500">در حال تایپ...</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t dark:border-gray-600 bg-white dark:bg-gray-800">
                <div className="flex gap-3 items-end">
                  <div className="flex-1">
                    <Input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="پیام خود را بنویسید..."
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="border-gray-300 dark:border-gray-600 focus:border-blue-500"
                      disabled={currentSession?.status === 'closed'}
                    />
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    size="sm"
                    disabled={!message.trim() || currentSession?.status === 'closed'}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-4"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>

                {/* Contact Info */}
                <div className="flex items-center justify-center gap-4 mt-3 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    <span>021-58635</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    <span>info@aalaniroo.com</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default ChatWidget;
