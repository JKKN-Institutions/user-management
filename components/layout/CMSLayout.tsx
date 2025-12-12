'use client';

import { ReactNode, useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';

interface CMSLayoutProps {
  children: ReactNode;
}

export default function CMSLayout({ children }: CMSLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--background)' }}>
      {/* Sidebar */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileSidebarOpen}
        onMobileToggle={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
      />

      {/* Mobile Overlay */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'
        }`}
      >
        {/* Header */}
        <Header onMobileSidebarToggle={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)} />

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 sm:p-6 animate-fade-in-up">
            {children}
          </div>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
