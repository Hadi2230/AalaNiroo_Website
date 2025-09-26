import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useChat, ChatSession, ChatMessage } from '@/contexts/ChatContext';
import { useAuth } from '@/contexts/AuthContext';
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
  MapPin,
  Calendar,
  Archive,
  Trash2,
  Eye,
  Users,
  MessageSquare,
  Activity,
  RefreshCw,
  Maximize2,
  Minimize2,
  Paperclip,
  Download
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
  DialogTrigger,
} from '@/components/ui/dialog';

const AdminChat = () => {
  const { sessions, activeSession, setActiveSession, markAsRead, closeSession, assignSession } = useChat();
  const { user } = useAuth();
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [showChatDetails, setShowChatDetails] = useState(true);

  // Filter sessions based on search and filters
  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.visitorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || session.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || session.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

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
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-100 text-red-800 border-red-200">بالا</Badge>;
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
        return <span className="text-gray-400">✓</span>;
      case 'delivered':
        return <span className="text-blue-500">✓✓</span>;
      case 'read':
        return <span className="text-green-500">✓✓</span>;
      default:
        return null;
    }
  };

  const handleSendMessage = () => {
    if (message.trim() && selectedSession) {
      // This would normally call sendMessage from context
      console.log('Sending message:', message, 'to session:', selectedSession.id);
      setMessage('');
    }
  };

  const handleCloseSession = (sessionId: string) => {
    closeSession(sessionId);
    if (selectedSession?.id === sessionId) {
      setSelectedSession(null);
    }
  };

  const handleAssignSession = (sessionId: string) => {
    if (user) {
      assignSession(sessionId, user.id);
    }
  };

  const currentSession = selectedSession || activeSession;

  return (
    <AdminLayout>
      <div className="flex h-[calc(100vh-8rem)] gap-6 p-6">
        {/* Sessions List */}
        <Card className="w-96 flex flex-col bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold flex items-center gap-3">
                <MessageCircle className="w-6 h-6 text-blue-600" />
                چت‌های فعال
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
                  {sessions.filter(s => s.status === 'active').length}
                </Badge>
                <Button variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Search and Filters */}
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

              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="وضعیت" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">همه وضعیت‌ها</SelectItem>
                    <SelectItem value="active">فعال</SelectItem>
                    <SelectItem value="waiting">منتظر</SelectItem>
                    <SelectItem value="closed">بسته شده</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="اولویت" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">همه اولویت‌ها</SelectItem>
                    <SelectItem value="high">بالا</SelectItem>
                    <SelectItem value="medium">متوسط</SelectItem>
                    <SelectItem value="low">پایین</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto">
            <div className="space-y-3">
              {filteredSessions.map((session) => (
                <div
                  key={session.id}
                  onClick={() => setSelectedSession(session)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all hover:shadow-md ${
                    selectedSession?.id === session.id
                      ? 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800'
                      : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm">{session.visitorName}</span>
                        {getStatusBadge(session.status)}
                        {getPriorityBadge(session.priority)}
                      </div>

                      <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        {session.lastMessage}
                      </div>

                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{formatDate(session.updatedAt)}</span>
                        <span>{formatTime(session.updatedAt)}</span>
                        {session.unreadCount > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {session.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>عملیات</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => markAsRead(session.id)}>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          علامت‌گذاری به عنوان خوانده شده
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAssignSession(session.id)}>
                          <User className="w-4 h-4 mr-2" />
                          تخصیص به من
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleCloseSession(session.id)}>
                          <Archive className="w-4 h-4 mr-2" />
                          بستن چت
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" />
                          حذف چت
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}

              {filteredSessions.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>چت فعالی یافت نشد</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="flex-1 flex flex-col bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
          {currentSession ? (
            <>
              {/* Chat Header */}
              <CardHeader className="border-b dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{currentSession.visitorName}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                        <span className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          {currentSession.visitorEmail || 'ایمیل ثبت نشده'}
                        </span>
                        {currentSession.visitorPhone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-4 h-4" />
                            {currentSession.visitorPhone}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(currentSession.createdAt)}
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
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      خروجی چت
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* Chat Messages */}
              <CardContent className="flex-1 flex flex-col p-0">
                {/* Messages Container */}
                <div className="flex-1 p-6 overflow-y-auto">
                  <div className="space-y-4">
                    {currentSession.messages.map((msg, index) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.sender === 'admin' ? 'justify-start' : 'justify-end'} ${index === currentSession.messages.length - 1 ? 'animate-fade-in' : ''}`}
                      >
                        <div className="flex items-start gap-3 max-w-[80%]">
                          {msg.sender === 'admin' && (
                            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                              <MessageSquare className="w-4 h-4" />
                            </div>
                          )}

                          <div
                            className={`p-4 rounded-2xl shadow-sm ${
                              msg.sender === 'admin'
                                ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                                : 'bg-blue-600 text-white'
                            }`}
                          >
                            <p className="text-sm leading-relaxed">{msg.text}</p>
                            <div className="flex items-center justify-between mt-2 text-xs opacity-70">
                              <span>{formatTime(msg.timestamp)}</span>
                              {msg.sender !== 'admin' && getMessageStatusIcon(msg.status)}
                            </div>
                          </div>

                          {msg.sender !== 'admin' && (
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                              <User className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Chat Input */}
                <div className="p-6 border-t dark:border-gray-700 bg-white dark:bg-gray-800">
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <Textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="پیام خود را بنویسید..."
                        className="min-h-[60px] resize-none border-gray-300 dark:border-gray-600 focus:border-blue-500"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button
                        onClick={handleSendMessage}
                        disabled={!message.trim()}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 h-12"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="h-12">
                        <Paperclip className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex items-center justify-center gap-2 mt-4 text-sm">
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                      پاسخ سریع 1
                    </Button>
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                      پاسخ سریع 2
                    </Button>
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                      پاسخ سریع 3
                    </Button>
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex-1 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">چتی انتخاب نشده</h3>
                <p>از لیست سمت راست یک چت انتخاب کنید</p>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Chat Details Sidebar */}
        {currentSession && showChatDetails && (
          <Card className="w-80 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-3">
                <Activity className="w-5 h-5 text-blue-600" />
                جزئیات چت
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Visitor Info */}
              <div>
                <h4 className="font-semibold mb-3">اطلاعات بازدیدکننده</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-500">نام</label>
                    <p className="font-medium">{currentSession.visitorName}</p>
                  </div>
                  {currentSession.visitorEmail && (
                    <div>
                      <label className="text-sm text-gray-500">ایمیل</label>
                      <p className="font-medium">{currentSession.visitorEmail}</p>
                    </div>
                  )}
                  {currentSession.visitorPhone && (
                    <div>
                      <label className="text-sm text-gray-500">شماره تماس</label>
                      <p className="font-medium">{currentSession.visitorPhone}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Session Stats */}
              <div>
                <h4 className="font-semibold mb-3">آمار چت</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">تعداد پیام‌ها:</span>
                    <span className="font-medium">{currentSession.messages.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">وضعیت:</span>
                    {getStatusBadge(currentSession.status)}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">اولویت:</span>
                    {getPriorityBadge(currentSession.priority)}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">تاریخ ایجاد:</span>
                    <span className="font-medium text-sm">{formatDate(currentSession.createdAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">آخرین فعالیت:</span>
                    <span className="font-medium text-sm">{formatTime(currentSession.updatedAt)}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div>
                <h4 className="font-semibold mb-3">عملیات</h4>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => markAsRead(currentSession.id)}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    علامت‌گذاری به عنوان خوانده شده
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => handleCloseSession(currentSession.id)}
                  >
                    <Archive className="w-4 h-4 mr-2" />
                    بستن چت
                  </Button>

                  <Button variant="outline" className="w-full justify-start">
                    <Download className="w-4 h-4 mr-2" />
                    خروجی چت
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminChat;