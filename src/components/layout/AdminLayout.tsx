import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  Calendar,
  MessageCircle,
  Zap,
  Shield,
  Database,
  Mail,
  Phone,
  User,
  Moon,
  Sun,
  ChevronDown,
  BadgeAlert,
  FileText,
  Image
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(3);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isLoading } = useAuth();
  const { dir } = useLanguage();

  // داده‌های نمونه برای نوتیفیکیشن‌ها
  const notifications = [
    {
      id: 1,
      title: 'سفارش جدید',
      message: 'سفارش #ORD-1567 ثبت شد',
      time: '2 دقیقه پیش',
      type: 'order',
      read: false
    },
    {
      id: 2,
      title: 'پیام جدید',
      message: 'مشتری جدید در چت پیام گذاشته',
      time: '15 دقیقه پیش',
      type: 'chat',
      read: false
    },
    {
      id: 3,
      title: 'هشدار موجودی',
      message: 'موجودی محصول FG Wilson کم است',
      time: '1 ساعت پیش',
      type: 'warning',
      read: true
    }
  ];

  const menuItems = [
    { 
      path: '/admin/dashboard', 
      icon: LayoutDashboard, 
      label: 'داشبورد',
      badge: null
    },
    { 
      path: '/admin/about', 
      icon: Users, 
      label: 'درباره ما',
      badge: null
    },
    { 
      path: '/admin/products', 
      icon: Package, 
      label: 'محصولات',
      badge: '12'
    },
    { 
      path: '/admin/orders', 
      icon: ShoppingCart, 
      label: 'سفارشات',
      badge: '5'
    },
    { 
      path: '/admin/customers', 
      icon: Users, 
      label: 'مشتریان',
      badge: '23'
    },
    { 
      path: '/admin/users', 
      icon: User, 
      label: 'کاربران',
      badge: null
    },
    { 
      path: '/admin/chat', 
      icon: MessageCircle, 
      label: 'مدیریت چت',
      badge: '3'
    },
    { 
      path: '/admin/content', 
      icon: FileText, 
      label: 'مدیریت محتوا',
      badge: null
    },
    { 
      path: '/admin/projects', 
      icon: Shield, 
      label: 'پروژه‌ها',
      badge: null
    },
    { 
      path: '/admin/media', 
      icon: Image, 
      label: 'مدیریت رسانه',
      badge: null
    },
    { 
      path: '/admin/projects', 
      icon: Shield, 
      label: 'پروژه‌ها', 
      badge: null
    },
    { 
      path: '/admin/meetings', 
      icon: Calendar, 
      label: 'جلسات', 
      badge: null
    },
    { 
      path: '/admin/pages', 
      icon: Settings, 
      label: 'مدیریت صفحات',
      badge: null
    },
    { 
      path: '/admin/reports', 
      icon: BarChart3, 
      label: 'گزارش‌ها',
      badge: null
    },
    { 
      path: '/admin/integrations', 
      icon: Database, 
      label: 'ادغام‌ها',
      badge: null
    }
  ];

  useEffect(() => {
    // بررسی حالت تاریک از localStorage
    const isDark = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const markAllAsRead = () => {
    setUnreadNotifications(0);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <ShoppingCart className="w-4 h-4 text-blue-600" />;
      case 'chat':
        return <MessageCircle className="w-4 h-4 text-green-600" />;
      case 'warning':
        return <BadgeAlert className="w-4 h-4 text-red-600" />;
      default:
        return <Bell className="w-4 h-4 text-gray-600" />;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">ادمین</Badge>;
      case 'manager':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">مدیر</Badge>;
      case 'sales':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">فروش</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-gray-600">در حال بارگذاری پنل مدیریت...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 right-0 z-50 w-80 bg-white dark:bg-gray-800 shadow-2xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ direction: 'rtl' }}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-l from-blue-600 to-purple-600 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <div className="text-lg font-bold">اعلا نیرو</div>
              <div className="text-sm opacity-90">پنل مدیریت</div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white hover:bg-white/20"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* User Info */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-gray-900 dark:text-white truncate">
                {user?.name || 'کاربر سیستم'}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                {user?.email || 'admin@aalaniroo.com'}
              </div>
              <div className="mt-1">
                {getRoleBadge(user?.role || 'admin')}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-l from-blue-500 to-blue-600 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${
                  isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'
                }`} />
                <span className="flex-1 font-medium">{item.label}</span>
                {item.badge && (
                  <Badge 
                    variant={isActive ? "secondary" : "outline"}
                    className={`text-xs ${
                      isActive 
                        ? 'bg-white/20 text-white border-white/30' 
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                    }`}
                  >
                    {item.badge}
                  </Badge>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 ml-2" />
            خروج از سیستم
          </Button>
          
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-2">
            <span>v1.0.0</span>
            <span>© 2024 اعلا نیرو</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden" style={{ direction: 'rtl' }}>
        {/* Top Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between p-4">
            {/* Left Section - Menu Button & Search */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-600 dark:text-gray-300"
              >
                <Menu className="w-5 h-5" />
              </Button>
              
              <div className="relative w-80">
                <Search className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="جستجو در پنل مدیریت..."
                  className="w-full pr-10 pl-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Right Section - Actions */}
            <div className="flex items-center gap-3">
              {/* Dark Mode Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleDarkMode}
                className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>

              {/* Notifications */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="relative text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Bell className="w-5 h-5" />
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -left-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {unreadNotifications}
                    </span>
                  )}
                </Button>

                {/* Notifications Dropdown */}
                {notificationsOpen && (
                  <div className="absolute left-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 dark:text-white">اعلان‌ها</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={markAllAsRead}
                          className="text-blue-600 hover:text-blue-700 text-xs"
                        >
                          علامت‌گذاری همه به عنوان خوانده شده
                        </Button>
                      </div>
                    </div>
                    
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors ${
                            !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            {getNotificationIcon(notification.type)}
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-gray-900 dark:text-white">
                                {notification.title}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                {notification.message}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                {notification.time}
                              </div>
                            </div>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                      <Button variant="ghost" className="w-full text-blue-600 hover:text-blue-700">
                        مشاهده همه اعلان‌ها
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* User Menu */}
              <div className="relative">
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </Button>

                {/* User Dropdown */}
                {userMenuOpen && (
                  <div className="absolute left-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {user?.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {user?.name || 'کاربر سیستم'}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {user?.email || 'admin@aalaniroo.com'}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-2">
                      <Button variant="ghost" className="w-full justify-start text-gray-700 dark:text-gray-200">
                        <User className="w-4 h-4 ml-2" />
                        پروفایل کاربری
                      </Button>
                      <Button variant="ghost" className="w-full justify-start text-gray-700 dark:text-gray-200">
                        <Settings className="w-4 h-4 ml-2" />
                        تنظیمات حساب
                      </Button>
                    </div>
                    
                    <div className="p-2 border-t border-gray-200 dark:border-gray-700">
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start text-red-600 hover:text-red-700"
                        onClick={handleLogout}
                      >
                        <LogOut className="w-4 h-4 ml-2" />
                        خروج از سیستم
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-gray-50/50 dark:bg-gray-900/50">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>

      {/* Overlay for Mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Close dropdowns when clicking outside */}
      {(userMenuOpen || notificationsOpen) && (
        <div 
          className="fixed inset-0 z-30"
          onClick={() => {
            setUserMenuOpen(false);
            setNotificationsOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default AdminLayout;