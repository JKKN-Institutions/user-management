'use client';

import { useState } from 'react';

interface HeaderProps {
  onMobileSidebarToggle: () => void;
}

export default function Header({ onMobileSidebarToggle }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const notifications = [
    { id: 1, title: 'New user registered', time: '5 min ago', unread: true },
    { id: 2, title: 'Course updated', time: '23 min ago', unread: true },
    { id: 3, title: 'Batch created', time: '1 hour ago', unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header
      className="h-20 bg-white/95 dark:bg-[var(--surface)]/95 border-b sticky top-0 z-30"
      style={{
        borderColor: 'var(--border)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-4 sm:gap-6">
        {/* Mobile Menu Button */}
        <button
          onClick={onMobileSidebarToggle}
          className="lg:hidden p-2 rounded-lg hover:bg-[var(--surface)] transition-colors"
          style={{ color: 'var(--primary)' }}
        >
          <span className="text-2xl">☰</span>
        </button>

        {/* Breadcrumb */}
        <div className="hidden md:block">
          <nav className="flex items-center gap-2 font-body text-sm">
            <span style={{ color: 'var(--neutral-400)' }}>Home</span>
            <span style={{ color: 'var(--neutral-400)' }}>/</span>
            <span style={{ color: 'var(--primary)' }} className="font-semibold">Dashboard</span>
          </nav>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">🔍</span>
            <input
              type="text"
              placeholder="Search users, courses, batches..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl font-body text-sm border-2 transition-all duration-300 focus:outline-none"
              style={{
                borderColor: searchQuery ? 'var(--primary)' : 'var(--border)',
                background: 'var(--surface)',
                color: 'var(--foreground)',
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-sm"
                style={{ color: 'var(--neutral-400)' }}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Quick Add Button */}
          <button
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl font-body font-medium text-white transition-all duration-300 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
              boxShadow: '0 4px 12px rgba(160, 29, 58, 0.25)',
            }}
          >
            <span className="text-lg">+</span>
            <span className="text-sm">Quick Add</span>
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-3 rounded-xl hover:bg-[var(--surface)] transition-colors"
              style={{ color: 'var(--neutral-700)' }}
            >
              <span className="text-2xl">🔔</span>
              {unreadCount > 0 && (
                <span
                  className="absolute top-2 right-2 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center text-white"
                  style={{ background: 'var(--primary)' }}
                >
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div
                className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-[var(--surface)] rounded-xl overflow-hidden animate-scale-in border"
                style={{
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                  borderColor: 'var(--border)',
                }}
              >
                <div className="p-4 border-b" style={{ borderColor: 'var(--border)' }}>
                  <h3 className="font-display font-bold text-base" style={{ color: 'var(--primary)' }}>
                    Notifications
                  </h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className="p-4 border-b hover:bg-[var(--surface)] transition-colors cursor-pointer"
                      style={{ borderColor: 'var(--border)' }}
                    >
                      <div className="flex items-start gap-3">
                        {notif.unread && (
                          <div className="w-2 h-2 rounded-full mt-2" style={{ background: 'var(--primary)' }}></div>
                        )}
                        <div className="flex-1">
                          <p className="font-body font-semibold text-sm mb-1" style={{ color: 'var(--neutral-900)' }}>
                            {notif.title}
                          </p>
                          <p className="font-body text-xs" style={{ color: 'var(--neutral-500)' }}>
                            {notif.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 text-center border-t" style={{ borderColor: 'var(--border)' }}>
                  <button className="font-body text-sm font-semibold" style={{ color: 'var(--primary)' }}>
                    View All Notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-[var(--surface)] transition-colors"
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-display font-bold"
                style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary-light))' }}
              >
                AK
              </div>
              <div className="hidden lg:block text-left">
                <p className="font-body font-semibold text-xs" style={{ color: 'var(--neutral-900)' }}>
                  Admin User
                </p>
                <p className="font-body text-xs" style={{ color: 'var(--neutral-500)' }}>
                  Administrator
                </p>
              </div>
              <span className="text-sm" style={{ color: 'var(--neutral-400)' }}>▼</span>
            </button>

            {/* User Dropdown */}
            {showUserMenu && (
              <div
                className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-[var(--surface)] rounded-xl overflow-hidden animate-scale-in border"
                style={{
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                  borderColor: 'var(--border)',
                }}
              >
                <div className="p-3 space-y-1">
                  {['Profile', 'Settings', 'Preferences', 'Help & Support'].map((item) => (
                    <button
                      key={item}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-[var(--surface)] transition-colors font-body text-sm"
                      style={{ color: 'var(--neutral-700)' }}
                    >
                      {item}
                    </button>
                  ))}
                </div>
                <div className="border-t p-3" style={{ borderColor: 'var(--border)' }}>
                  <button
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-red-50 transition-colors font-body text-sm font-semibold"
                    style={{ color: 'var(--primary)' }}
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
