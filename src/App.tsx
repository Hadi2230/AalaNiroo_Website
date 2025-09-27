import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';

import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { ChatProvider } from '@/contexts/ChatContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { CompanyProvider } from '@/contexts/CompanyContext';

// ---------- ProtectedRoute ----------
const RequireAuth = ({
  children,
  roles,
}: {
  children: JSX.Element;
  roles?: string[];
}) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// ---------- Error Boundary ----------
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error Boundary Caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong. Please refresh or contact support.</h1>;
    }
    return this.props.children;
  }
}

// ---------- Public Pages ----------
import ModernIndex from './pages/ModernIndex';
import About from './pages/About';
import Products from './pages/Products';
import Projects from './pages/Projects';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import NotFound from './pages/NotFound';

// ---------- Admin Pages ----------
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/AdminProducts';
import AdminOrders from './pages/AdminOrders';
import AdminCustomers from './pages/AdminCustomers';
import AdminReports from './pages/AdminReports';
import AdminIntegrations from './pages/AdminIntegrations';
import AdminChat from './pages/AdminChat';
import AdminContent from './pages/AdminContent';
import AdminMedia from './pages/AdminMedia';
import AdminPages from './pages/AdminPages';

// ---------- React Query Client ----------
const queryClient = new QueryClient();

// ---------- App Component ----------
const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ChatProvider>
        <LanguageProvider>
          <CompanyProvider>
            <TooltipProvider>
            <Toaster position="top-right" richColors expand={true} />

            <ErrorBoundary>
              <BrowserRouter
                future={{
                  v7_startTransition: true,
                  v7_relativeSplatPath: true,
                }}
              >
                <Routes>
                  {/* 🌍 Public Routes */}
                  <Route path="/" element={<ModernIndex />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/blog" element={<Blog />} />

                  {/* 🔑 Authentication */}
                  <Route path="/admin/login" element={<AdminLogin />} />

                  {/* 🛠️ Admin Routes */}
                  <Route
                    path="/admin/dashboard"
                    element={
                      <RequireAuth roles={['admin', 'manager', 'sales']}>
                        <AdminDashboard />
                      </RequireAuth>
                    }
                  />
                  <Route
                    path="/admin/products"
                    element={
                      <RequireAuth roles={['admin', 'manager']}>
                        <AdminProducts />
                      </RequireAuth>
                    }
                  />
                  <Route
                    path="/admin/orders"
                    element={
                      <RequireAuth roles={['admin', 'manager', 'sales']}>
                        <AdminOrders />
                      </RequireAuth>
                    }
                  />
                  <Route
                    path="/admin/customers"
                    element={
                      <RequireAuth roles={['admin', 'manager', 'sales']}>
                        <AdminCustomers />
                      </RequireAuth>
                    }
                  />
                  <Route
                    path="/admin/reports"
                    element={
                      <RequireAuth roles={['admin', 'manager']}>
                        <AdminReports />
                      </RequireAuth>
                    }
                  />
                  <Route
                    path="/admin/integrations"
                    element={
                      <RequireAuth roles={['admin', 'manager']}>
                        <AdminIntegrations />
                      </RequireAuth>
                    }
                  />
                  <Route
                    path="/admin/chat"
                    element={
                      <RequireAuth roles={['admin', 'manager', 'sales']}>
                        <AdminChat />
                      </RequireAuth>
                    }
                  />
                  <Route
                    path="/admin/content"
                    element={
                      <RequireAuth roles={['admin', 'manager']}>
                        <AdminContent />
                      </RequireAuth>
                    }
                  />
                  <Route
                    path="/admin/media"
                    element={
                      <RequireAuth roles={['admin', 'manager']}>
                        <AdminMedia />
                      </RequireAuth>
                    }
                  />
                  <Route
                    path="/admin/pages"
                    element={
                      <RequireAuth roles={['admin', 'manager']}>
                        <AdminPages />
                      </RequireAuth>
                    }
                  />

                  {/* 🛑 404 */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </ErrorBoundary>
            </TooltipProvider>
          </CompanyProvider>
        </LanguageProvider>
      </ChatProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;