import React from 'react';
import ModernHeader from './ModernHeader';
import Footer from './Footer';
import ChatWidget from './ChatWidget';
import './PageLayout.css';

interface PageLayoutProps {
  children: React.ReactNode;
  showChat?: boolean;
  className?: string;
}

/**
 * PageLayout Component
 * Wraps page content with header, footer and applies the background color #7a8d9b
 * to the main content area, excluding header and footer
 * 
 * Professional implementation with proper CSS class composition
 */
const PageLayout: React.FC<PageLayoutProps> = ({ 
  children, 
  showChat = true,
  className = ''
}) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header - maintains its own background */}
      <ModernHeader />
      
      {/* Main Content Area - with custom background color #7a8d9b */}
      <main 
        className={`flex-1 page-content-wrapper ${className}`}
        style={{ 
          backgroundColor: '#7a8d9b',
          position: 'relative',
          isolation: 'isolate'
        }}
      >
        {children}
      </main>
      
      {/* Footer - maintains its own background */}
      <Footer />
      
      {/* Chat Widget */}
      {showChat && <ChatWidget />}
    </div>
  );
};

export default PageLayout;