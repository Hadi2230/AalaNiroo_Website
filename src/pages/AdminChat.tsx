import { useState, useEffect, useRef, useCallback } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useChat, ChatSession, ChatMessage } from '@/contexts/ChatContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import {
  MessageCircle,
  Send,
  User,
  Clock,
  CheckCircle,
  AlertTriangle,
  Search,
  Filter,
  MoreVertical,
  Phone,
  Mail,
  Calendar,
  Archive,
  Trash2,
  Eye,
  Users,
  MessageSquare,
  Activity,
  RefreshCw,
  Paperclip,
  Download,
  Star,
  Tag,
  Settings,
  Zap,
  Bell,
  TrendingUp,
  BarChart3,
  UserCheck,
  UserX,
  AlertOctagon,
  CheckCircle2,
  XCircle,
  PlayCircle,
  PauseCircle,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  ExternalLink,
  Copy,
  Edit3
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const AdminChat = () => {
  const { 
    sessions, 
    activeSession, 
    setActiveSession, 
    markAsRead, 
    closeSession, 
    assignSession,
    setPriority,
    addTag,
    removeTag,
    sendMessage,
    notifications,
    isConnected,
    getSessionStats,
    searchMessages
  } = useChat();
  
  const { user } = useAuth();
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [showChatDetails, setShowChatDetails] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showStats, setShowStats] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [onlineAdmins, setOnlineAdmins] = useState(['admin-1', 'admin-2']);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  // Auto-scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedSession?.messages]);

  // Auto-refresh sessions
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        // Force re-render to show real-time updates
        setSelectedSession(prev => 
          prev ? sessions.find(s => s.id === prev.id) || null : null
        );
      }, 2000);
      
      return () => clearInterval(interval);
    }
  }, [autoRefresh, sessions]);

  // Play notification sound
  useEffect(() => {
    if (soundEnabled && notifications.length > 0) {
      const latestNotif = notifications[0];
      if (!latestNotif.read && latestNotif.type === 'new_message') {
        // Create audio notification
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7bVnHgU8k9n1unEpBSF+zPLaizsIGGS57OihUBELTKXh8bllHgg2jdT0xXkrBSJ7yO/eizEIHWq+8+OWT' + 'QwNUqzn77RpHgU7k9j1vHAqBSJ9y/PajDwIF2K37OihURELTKXh8bllHgg2jdT0xXkrBSJ7yO/eizEIHWq+8+OWTQ==');
        audio.volume = 0.3;
        audio.play().catch(() => {
          console.log('Audio notification failed');
        });
      }
    }
  }, [notifications, soundEnabled]);

  // Filter sessions (with null check)
  const filteredSessions = (sessions || []).filter(session => {
    const matchesSearch = !searchTerm || 
      session.visitorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.lastMessage.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (session.tags || []).some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
    const matchesStatus = statusFilter === 'all' || session.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || session.priority === priorityFilter;
    const matchesDepartment = departmentFilter === 'all' || session.department === departmentFilter;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesDepartment;
  });

  // Sort sessions by priority and last activity
  const sortedSessions = [...filteredSessions].sort((a, b) => {
    // Priority order: urgent > high > medium > low
    const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
    const aPriority = priorityOrder[a.priority] || 1;
    const bPriority = priorityOrder[b.priority] || 1;
    
    if (aPriority !== bPriority) {
      return bPriority - aPriority;
    }
    
    // Then by last activity
    return new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime();
  });

  const handleSelectSession = useCallback((session: ChatSession) => {
    setSelectedSession(session);
    setActiveSession(session.id);
    markAsRead(session.id);
  }, [setActiveSession, markAsRead]);

  const handleSendReply = useCallback(async () => {
    if (!replyMessage.trim() || !selectedSession || !user) return;

    try {
      await sendMessage(replyMessage.trim(), selectedSession.id, 'admin');
      setReplyMessage('');
      setIsTyping(false);
      
      // Clear typing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      toast.success('پیام ارسال شد');
    } catch (error) {
      console.error('Error sending reply:', error);
      toast.error('خطا در ارسال پیام');
    }
  }, [replyMessage, selectedSession, user, sendMessage]);

  const handleQuickReply = useCallback((text: string) => {
    if (selectedSession) {
      sendMessage(text, selectedSession.id, 'admin');
    }
  }, [selectedSession, sendMessage]);

  const handleTyping = useCallback(() => {
    setIsTyping(true);
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 1000);
  }, []);

  const handleAssignToMe = useCallback((sessionId: string) => {
    if (user) {
      assignSession(sessionId, user.id, user.name);
    }
  }, [assignSession, user]);

  const handlePriorityChange = useCallback((sessionId: string, priority: string) => {
    setPriority(sessionId, priority);
  }, [setPriority]);

  const handleAddTag = useCallback((sessionId: string, tag: string) => {
    if (tag.trim()) {
      addTag(sessionId, tag.trim());
    }
  }, [addTag]);

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('fa-IR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('fa-IR');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 border-green-200">فعال</Badge>;
      case 'waiting':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">منتظر</Badge>;
      case 'closed':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">بسته شده</Badge>;
      case 'archived':
        return <Badge className="bg-purple-100 text-purple-800 border-purple-200">آرشیو</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <Badge className="bg-red-100 text-red-800 border-red-200 animate-pulse">فوری</Badge>;
      case 'high':
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">بالا</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">متوسط</Badge>;
      case 'low':
        return <Badge className="bg-green-100 text-green-800 border-green-200">پایین</Badge>;
      default:
        return <Badge variant="secondary">{priority}</Badge>;
    }
  };

  const getMessageStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <Clock className="w-3 h-3 text-gray-400" />;
      case 'delivered':
        return <CheckCircle className="w-3 h-3 text-blue-500" />;
      case 'read':
        return <CheckCircle2 className="w-3 h-3 text-green-500" />;
      default:
        return null;
    }
  };

  const quickReplies = [
    'سلام! چطور می‌تونم کمکتون کنم؟',
    'ممنون از تماستون. لطفاً کمی صبر کنید.',
    'برای اطلاعات بیشتر با شماره 021-58635 تماس بگیرید.',
    'کارشناس ما به زودی با شما تماس خواهد گرفت.',
    'آیا سوال دیگری دارید؟',
    'از وقتی که گذاشتید متشکرم.'
  ];

  const stats = getSessionStats ? getSessionStats() : {
    total: 0,
    active: 0,
    waiting: 0,
    closed: 0,
    archived: 0,
    unread: 0
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header with Stats */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">مدیریت چت آنلاین</h1>
                <p className="text-blue-100">پاسخگویی real-time به مشتریان</p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{stats.active}</div>
                  <div className="text-sm text-blue-100">فعال</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{stats.waiting}</div>
                  <div className="text-sm text-blue-100">منتظر</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{stats.unread}</div>
                  <div className="text-sm text-blue-100">خوانده نشده</div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
                  <span className="text-sm">
                    {isConnected ? 'آنلاین' : 'آفلاین'}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-12 gap-6 h-[calc(100vh-12rem)]">
          {/* Sessions List */}
          <Card className="col-span-4 flex flex-col bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold flex items-center gap-3">
                  <MessageCircle className="w-6 h-6 text-blue-600" />
                  چت‌های فعال
                  <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
                    {sortedSessions.length}
                  </Badge>
                </CardTitle>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setAutoRefresh(!autoRefresh)}
                    className={autoRefresh ? 'bg-green-50 text-green-600' : ''}
                  >
                    <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className={soundEnabled ? 'bg-blue-50 text-blue-600' : ''}
                  >
                    {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setShowStats(!showStats)}
                  >
                    <BarChart3 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Filters */}
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="جستجو در چت‌ها..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="text-xs">
                      <SelectValue placeholder="وضعیت" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">همه</SelectItem>
                      <SelectItem value="active">فعال</SelectItem>
                      <SelectItem value="waiting">منتظر</SelectItem>
                      <SelectItem value="closed">بسته</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger className="text-xs">
                      <SelectValue placeholder="اولویت" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">همه</SelectItem>
                      <SelectItem value="urgent">فوری</SelectItem>
                      <SelectItem value="high">بالا</SelectItem>
                      <SelectItem value="medium">متوسط</SelectItem>
                      <SelectItem value="low">پایین</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                    <SelectTrigger className="text-xs">
                      <SelectValue placeholder="بخش" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">همه</SelectItem>
                      <SelectItem value="فروش">فروش</SelectItem>
                      <SelectItem value="فنی">فنی</SelectItem>
                      <SelectItem value="خدمات">خدمات</SelectItem>
                      <SelectItem value="عمومی">عمومی</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto p-0">
              <div className="space-y-1 p-4">
                {sortedSessions.map((session) => (
                  <Card
                    key={session.id}
                    onClick={() => handleSelectSession(session)}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-md border ${
                      selectedSession?.id === session.id
                        ? 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800 shadow-md'
                        : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm">
                                {session.visitorName.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-sm truncate">{session.visitorName}</span>
                                {session.assignedTo === user?.id && (
                                  <UserCheck className="w-3 h-3 text-green-600" />
                                )}
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                {getStatusBadge(session.status)}
                                {getPriorityBadge(session.priority)}
                                {session.department && (
                                  <Badge variant="outline" className="text-xs">
                                    {session.department}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
                            {session.lastMessage || 'هنوز پیامی ارسال نشده'}
                          </div>

                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>{formatTime(session.lastActivity)}</span>
                            <div className="flex items-center gap-2">
                              {session.unreadCount > 0 && (
                                <Badge variant="destructive" className="text-xs px-1.5 py-0.5">
                                  {session.unreadCount}
                                </Badge>
                              )}
                              <span>{session.messages.length} پیام</span>
                            </div>
                          </div>

                          {/* Tags */}
                          {(session.tags || []).length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {(session.tags || []).slice(0, 2).map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs px-1.5 py-0.5">
                                  {tag}
                                </Badge>
                              ))}
                              {(session.tags || []).length > 2 && (
                                <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                                  +{(session.tags || []).length - 2}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="w-8 h-8 p-0">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>عملیات سریع</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleAssignToMe(session.id)}>
                              <UserCheck className="w-4 h-4 mr-2" />
                              تخصیص به من
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handlePriorityChange(session.id, 'high')}>
                              <AlertTriangle className="w-4 h-4 mr-2" />
                              اولویت بالا
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => closeSession(session.id)}>
                              <Archive className="w-4 h-4 mr-2" />
                              بستن چت
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {sortedSessions.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>{searchTerm ? 'چت یافت نشد' : 'چت فعالی وجود ندارد'}</p>
                    <p className="text-xs mt-1">منتظر چت‌های جدید از وبسایت...</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Chat Area */}
          <Card className={`${showChatDetails ? 'col-span-5' : 'col-span-8'} flex flex-col bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl`}>
            {selectedSession ? (
              <>
                {/* Chat Header */}
                <CardHeader className="border-b dark:border-gray-700 pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold">
                          {selectedSession.visitorName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div>
                        <h3 className="font-bold text-lg flex items-center gap-2">
                          {selectedSession.visitorName}
                          {selectedSession.assignedTo === user?.id && (
                            <Badge className="bg-green-100 text-green-800 text-xs">
                              تخصیص یافته به شما
                            </Badge>
                          )}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                          {selectedSession.visitorEmail && (
                            <span className="flex items-center gap-1">
                              <Mail className="w-4 h-4" />
                              {selectedSession.visitorEmail}
                            </span>
                          )}
                          {selectedSession.visitorPhone && (
                            <span className="flex items-center gap-1">
                              <Phone className="w-4 h-4" />
                              {selectedSession.visitorPhone}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(selectedSession.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowChatDetails(!showChatDetails)}
                      >
                        {showChatDetails ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                      </Button>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Settings className="w-4 h-4 mr-2" />
                            عملیات
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>مدیریت چت</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleAssignToMe(selectedSession.id)}>
                            <UserCheck className="w-4 h-4 mr-2" />
                            تخصیص به من
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handlePriorityChange(selectedSession.id, 'high')}>
                            <AlertTriangle className="w-4 h-4 mr-2" />
                            اولویت بالا
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAddTag(selectedSession.id, 'مهم')}>
                            <Tag className="w-4 h-4 mr-2" />
                            اضافه کردن تگ
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => closeSession(selectedSession.id)}>
                            <Archive className="w-4 h-4 mr-2" />
                            بستن چت
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardHeader>

                {/* Messages Area */}
                <div className="flex-1 p-4 overflow-y-auto bg-gray-50/50 dark:bg-gray-700/50">
                  <div className="space-y-4">
                    {selectedSession.messages.map((msg, index) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.sender === 'admin' ? 'justify-start' : 'justify-end'} ${
                          index === selectedSession.messages.length - 1 ? 'animate-fade-in' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3 max-w-[80%]">
                          {msg.sender === 'admin' && (
                            <Avatar className="w-8 h-8 flex-shrink-0">
                              <AvatarFallback className="bg-blue-600 text-white">
                                <Bot className="w-4 h-4" />
                              </AvatarFallback>
                            </Avatar>
                          )}

                          <div className={`p-4 rounded-2xl shadow-sm ${
                            msg.sender === 'admin'
                              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600'
                              : 'bg-blue-600 text-white'
                          }`}>
                            <p className="text-sm leading-relaxed">{msg.text}</p>
                            
                            {/* Attachments */}
                            {msg.attachments && msg.attachments.length > 0 && (
                              <div className="mt-2 space-y-2">
                                {msg.attachments.map((attachment) => (
                                  <div key={attachment.id} className="flex items-center gap-2 p-2 bg-black/10 rounded-lg">
                                    <Paperclip className="w-4 h-4" />
                                    <span className="text-xs">{attachment.name}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                            
                            <div className="flex items-center justify-between mt-2 text-xs opacity-70">
                              <span>{formatTime(msg.timestamp)}</span>
                              <div className="flex items-center gap-1">
                                {getMessageStatusIcon(msg.status)}
                                {msg.sender === 'admin' && (
                                  <span className="text-xs">
                                    {user?.name || 'ادمین'}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {msg.sender === 'user' && (
                            <Avatar className="w-8 h-8 flex-shrink-0">
                              <AvatarFallback className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
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
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-blue-600 text-white">
                              <Bot className="w-4 h-4" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex items-center gap-2 bg-white dark:bg-gray-700 p-3 rounded-2xl shadow-sm">
                            <div className="flex gap-1">
                              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                            <span className="text-xs text-gray-500">
                              {user?.name || 'ادمین'} در حال تایپ...
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </div>
                </div>

                {/* Quick Replies */}
                <div className="px-4 py-2 border-t dark:border-gray-600 bg-gray-50 dark:bg-gray-800">
                  <div className="flex flex-wrap gap-2">
                    {quickReplies.slice(0, 3).map((reply, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        size="sm"
                        onClick={() => handleQuickReply(reply)}
                        className="text-xs h-7 px-2 bg-white dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900 text-blue-600 border border-blue-200"
                      >
                        {reply.substring(0, 20)}...
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Reply Input */}
                <div className="p-4 border-t dark:border-gray-600 bg-white dark:bg-gray-800">
                  <div className="flex gap-3 items-end">
                    <div className="flex-1">
                      <Textarea
                        value={replyMessage}
                        onChange={(e) => {
                          setReplyMessage(e.target.value);
                          handleTyping();
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendReply();
                          }
                        }}
                        placeholder="پاسخ خود را بنویسید..."
                        className="min-h-[60px] max-h-[120px] resize-none border-gray-300 dark:border-gray-600 focus:border-blue-500"
                        disabled={selectedSession.status === 'closed'}
                      />
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <Button
                        onClick={handleSendReply}
                        disabled={!replyMessage.trim() || selectedSession.status === 'closed'}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 w-12 h-12 p-0"
                      >
                        <Send className="w-5 h-5" />
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="icon"
                        className="w-12 h-12 p-0"
                        disabled
                      >
                        <Paperclip className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {selectedSession.status === 'closed' && (
                    <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                      <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-300">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="text-sm">این چت بسته شده است</span>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">چتی انتخاب نشده</h3>
                  <p>از لیست سمت راست یک چت انتخاب کنید</p>
                  <div className="mt-4">
                    <Badge variant="outline" className="flex items-center gap-2 mx-auto w-fit">
                      <Activity className="w-4 h-4" />
                      آماده پاسخگویی
                    </Badge>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Chat Details Sidebar */}
          {selectedSession && showChatDetails && (
            <Card className="col-span-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-3">
                  <Activity className="w-5 h-5 text-blue-600" />
                  جزئیات چت
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Visitor Info */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    اطلاعات بازدیدکننده
                  </h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <label className="text-xs text-gray-500 uppercase tracking-wide">نام</label>
                      <p className="font-medium">{selectedSession.visitorName}</p>
                    </div>
                    
                    {selectedSession.visitorEmail && (
                      <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <label className="text-xs text-gray-500 uppercase tracking-wide">ایمیل</label>
                        <p className="font-medium text-sm">{selectedSession.visitorEmail}</p>
                      </div>
                    )}
                    
                    {selectedSession.visitorPhone && (
                      <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <label className="text-xs text-gray-500 uppercase tracking-wide">تلفن</label>
                        <p className="font-medium">{selectedSession.visitorPhone}</p>
                      </div>
                    )}
                    
                    {selectedSession.department && (
                      <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <label className="text-xs text-gray-500 uppercase tracking-wide">بخش</label>
                        <p className="font-medium">{selectedSession.department}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Session Stats */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    آمار چت
                  </h4>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="text-lg font-bold text-blue-600">{selectedSession.messages.length}</div>
                        <div className="text-xs text-gray-600">پیام</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="text-lg font-bold text-green-600">{selectedSession.unreadCount}</div>
                        <div className="text-xs text-gray-600">خوانده نشده</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">وضعیت:</span>
                        {getStatusBadge(selectedSession.status)}
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">اولویت:</span>
                        {getPriorityBadge(selectedSession.priority)}
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">شروع:</span>
                        <span className="font-medium">{formatTime(selectedSession.createdAt)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">آخرین فعالیت:</span>
                        <span className="font-medium">{formatTime(selectedSession.lastActivity)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    تگ‌ها
                  </h4>
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-1">
                      {(selectedSession.tags || []).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-4 h-4 p-0 ml-1 hover:bg-red-100"
                            onClick={() => removeTag(selectedSession.id, tag)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex gap-2">
                      <Input
                        placeholder="تگ جدید..."
                        className="text-xs h-8"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            const input = e.target as HTMLInputElement;
                            if (input.value.trim()) {
                              handleAddTag(selectedSession.id, input.value.trim());
                              input.value = '';
                            }
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    عملیات سریع
                  </h4>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full justify-start text-sm h-9"
                      onClick={() => markAsRead(selectedSession.id)}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      علامت‌گذاری خوانده شده
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full justify-start text-sm h-9"
                      onClick={() => handleAssignToMe(selectedSession.id)}
                    >
                      <UserCheck className="w-4 h-4 mr-2" />
                      تخصیص به من
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full justify-start text-sm h-9"
                      onClick={() => closeSession(selectedSession.id)}
                    >
                      <Archive className="w-4 h-4 mr-2" />
                      بستن چت
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full justify-start text-sm h-9"
                      onClick={() => {
                        navigator.clipboard.writeText(selectedSession.id);
                        toast.success('ID چت کپی شد');
                      }}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      کپی ID چت
                    </Button>
                  </div>
                </div>

                {/* Rating & Feedback */}
                {selectedSession.rating && (
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Star className="w-4 h-4" />
                      نظر مشتری
                    </h4>
                    <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm text-gray-600">امتیاز:</span>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= (selectedSession.rating || 0)
                                  ? 'text-yellow-500 fill-yellow-500'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      {selectedSession.feedback && (
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {selectedSession.feedback}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Stats Modal */}
        <Dialog open={showStats} onOpenChange={setShowStats}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>آمار چت آنلاین</DialogTitle>
              <DialogDescription>
                گزارش کامل عملکرد سیستم چت
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                  <div className="text-sm text-gray-600">کل چت‌ها</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.active}</div>
                  <div className="text-sm text-gray-600">فعال</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-600">{stats.waiting}</div>
                  <div className="text-sm text-gray-600">منتظر</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">{stats.closed}</div>
                  <div className="text-sm text-gray-600">بسته شده</div>
                </CardContent>
              </Card>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminChat;