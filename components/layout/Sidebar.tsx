'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: string;
}

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onMobileToggle: () => void;
}

const navigation: NavItem[] = [
  { label: 'Dashboard', href: '/', icon: '📊' },
  { label: 'Users', href: '/users', icon: '👥', badge: '2.8K' },
  { label: 'Courses', href: '/courses', icon: '📚', badge: '124' },
  { label: 'Batches', href: '/batches', icon: '🎓', badge: '42' },
  { label: 'Regulations', href: '/regulations', icon: '📋', badge: '18' },
  { label: 'Analytics', href: '/analytics', icon: '📈' },
  { label: 'Settings', href: '/settings', icon: '⚙️' },
];

export default function Sidebar({ isCollapsed, onToggleCollapse, isMobileOpen, onMobileToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full bg-white dark:bg-[var(--surface)] z-40 transition-all duration-300 border-r ${
          isCollapsed ? 'w-20' : 'w-72'
        } ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        style={{
          boxShadow: '1px 0 3px 0 rgb(0 0 0 / 0.1)',
          borderColor: 'var(--border)',
        }}
      >
        {/* Logo Section */}
        <div className="h-20 flex items-center justify-between px-6 border-b" style={{ borderColor: 'var(--border)' }}>
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xl"
                style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary-light))' }}
              >
                🎓
              </div>
              <div>
                <h2 className="font-display font-bold text-base" style={{ color: 'var(--primary)' }}>
                  JKKN COE
                </h2>
                <p className="font-body text-xs" style={{ color: 'var(--neutral-500)' }}>
                  Examination Hub
                </p>
              </div>
            </div>
          )}

          <button
            onClick={onToggleCollapse}
            className="hidden lg:block p-2 rounded-lg hover:bg-[var(--surface)] transition-colors"
            style={{ color: 'var(--neutral-600)' }}
          >
            {isCollapsed ? '→' : '←'}
          </button>
          <button
            onClick={onMobileToggle}
            className="lg:hidden p-2 rounded-lg hover:bg-[var(--surface)] transition-colors"
            style={{ color: 'var(--neutral-600)' }}
          >
            ✕
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1.5">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-300 group relative ${
                  isActive ? 'shadow-sm' : 'hover:bg-[var(--surface)]'
                }`}
                style={{
                  background: isActive ? 'linear-gradient(135deg, var(--primary), var(--primary-light))' : 'transparent',
                  color: isActive ? 'white' : 'var(--neutral-700)',
                }}
              >
                {/* Active indicator */}
                {isActive && (
                  <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full"
                    style={{ background: 'var(--accent)' }}
                  ></div>
                )}

                <span className="text-xl">{item.icon}</span>

                {!isCollapsed && (
                  <>
                    <span className="font-body text-sm font-medium flex-1">{item.label}</span>
                    {item.badge && (
                      <span
                        className="text-xs font-semibold px-2 py-1 rounded-full"
                        style={{
                          background: isActive ? 'rgba(255,255,255,0.2)' : 'var(--surface)',
                          color: isActive ? 'white' : 'var(--neutral-600)',
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        {!isCollapsed && (
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <div
              className="rounded-lg p-3"
              style={{
                background: 'linear-gradient(135deg, var(--secondary), var(--secondary-light))',
                color: 'white',
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span className="font-body font-semibold text-xs leading-tight">Quick Tip</span>
              </div>
              <p className="font-body text-xs opacity-90 leading-tight">
                Use keyboard shortcuts to navigate faster. Press '?' to see all shortcuts.
              </p>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
