'use client';

import { useState, useEffect } from 'react';
import CMSLayout from '@/components/layout/CMSLayout';

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const stats = [
    {
      label: 'Total Users',
      value: '2,847',
      change: '+12.5%',
      trend: 'up',
      icon: '👥',
      delay: '0ms'
    },
    {
      label: 'Active Courses',
      value: '124',
      change: '+8.2%',
      trend: 'up',
      icon: '📚',
      delay: '100ms'
    },
    {
      label: 'Current Batches',
      value: '42',
      change: '-2.1%',
      trend: 'down',
      icon: '🎓',
      delay: '200ms'
    },
    {
      label: 'Regulations',
      value: '18',
      change: '0%',
      trend: 'neutral',
      icon: '📋',
      delay: '300ms'
    },
  ];

  const recentActivity = [
    { action: 'New user registered', detail: 'Priya Sharma - B.Tech CSE', time: '5 min ago', type: 'user' },
    { action: 'Course updated', detail: 'Advanced Machine Learning - Syllabus revision', time: '23 min ago', type: 'course' },
    { action: 'Batch created', detail: 'AI & ML Specialization Batch - Fall 2025', time: '1 hour ago', type: 'batch' },
    { action: 'Regulation approved', detail: 'Academic Calendar 2025-26', time: '2 hours ago', type: 'regulation' },
    { action: 'User role updated', detail: 'Dr. Kumar - Promoted to Department Head', time: '3 hours ago', type: 'user' },
  ];

  const quickActions = [
    { label: 'Add New User', href: '/users/add', color: 'burgundy' },
    { label: 'Create Course', href: '/courses/add', color: 'sage' },
    { label: 'Manage Batches', href: '/batches', color: 'gold' },
  ];

  return (
    <CMSLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header
          className="mb-6 animate-fade-in-up"
          style={{ animationDelay: '0ms' }}
        >
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl sm:text-4xl font-bold mb-1 leading-tight"
                  style={{ color: 'var(--primary)' }}>
                Controller of Examination
              </h1>
              <p className="font-body text-sm leading-tight" style={{ color: 'var(--neutral-600)' }}>
                Management Dashboard
              </p>
            </div>
            <div className="font-body text-sm sm:text-right" style={{ color: 'var(--neutral-600)' }}>
              <div className="font-semibold" suppressHydrationWarning>
                {currentTime.toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              <div className="text-xs mt-1" suppressHydrationWarning>
                {currentTime.toLocaleTimeString('en-US')}
              </div>
            </div>
          </div>
          <div className="mt-3 h-px bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent opacity-30"></div>
        </header>

        {/* Statistics Cards */}
        <section className="mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="relative group animate-fade-in-up"
                style={{
                  animationDelay: stat.delay,
                  opacity: 0,
                }}
              >
                <div
                  className="relative bg-white dark:bg-[var(--surface)] rounded-xl p-4 transition-all duration-500 hover:-translate-y-1 border"
                  style={{
                    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
                    borderColor: 'var(--border)',
                  }}
                >
                  {/* Decorative corner accent */}
                  <div
                    className="absolute top-0 right-0 w-16 h-16 rounded-bl-full opacity-10"
                    style={{ background: `var(--${stat.trend === 'up' ? 'secondary' : stat.trend === 'down' ? 'primary' : 'accent'})` }}
                  ></div>

                  <div className="relative">
                    <div className="text-2xl mb-1">{stat.icon}</div>
                    <div className="font-body text-xs font-medium mb-1 leading-tight" style={{ color: 'var(--neutral-500)' }}>
                      {stat.label}
                    </div>
                    <div className="font-display text-2xl font-bold mb-1 leading-tight" style={{ color: 'var(--neutral-900)' }}>
                      {stat.value}
                    </div>
                    <div className="flex items-center gap-1">
                      <span
                        className="font-body text-sm font-semibold"
                        style={{
                          color: stat.trend === 'up' ? 'var(--secondary)' : stat.trend === 'down' ? 'var(--primary)' : 'var(--neutral-500)'
                        }}
                      >
                        {stat.change}
                      </span>
                      <span className="font-body text-xs" style={{ color: 'var(--neutral-400)' }}>
                        vs last month
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Recent Activity */}
          <section
            className="lg:col-span-2 animate-fade-in-up"
            style={{ animationDelay: '400ms', opacity: 0 }}
          >
            <div
              className="bg-white dark:bg-[var(--surface)] rounded-xl p-5 border"
              style={{
                boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
                borderColor: 'var(--border)',
              }}
            >
              <h2 className="font-display text-xl font-bold mb-4 leading-tight" style={{ color: 'var(--primary)' }}>
                Recent Activity
              </h2>

              <div className="space-y-2">
                {recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 pb-2 border-b last:border-0 last:pb-0 group hover:bg-[var(--surface)] -mx-3 px-3 py-2 rounded-lg transition-all duration-300"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    <div
                      className="w-2 h-2 rounded-full mt-1 flex-shrink-0"
                      style={{
                        background: activity.type === 'user' ? 'var(--primary)' :
                                   activity.type === 'course' ? 'var(--secondary)' :
                                   activity.type === 'batch' ? 'var(--accent)' : 'var(--neutral-400)'
                      }}
                    ></div>
                    <div className="flex-1 min-w-0">
                      <div className="font-body text-sm font-semibold mb-0.5 leading-tight" style={{ color: 'var(--neutral-900)' }}>
                        {activity.action}
                      </div>
                      <div className="font-body text-xs mb-0.5 leading-tight" style={{ color: 'var(--neutral-600)' }}>
                        {activity.detail}
                      </div>
                      <div className="font-body text-xs leading-tight" style={{ color: 'var(--neutral-400)' }}>
                        {activity.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Quick Actions & Info */}
          <section
            className="space-y-4 animate-fade-in-up"
            style={{ animationDelay: '500ms', opacity: 0 }}
          >
            {/* Quick Actions */}
            <div
              className="bg-white dark:bg-[var(--surface)] rounded-xl p-4 border"
              style={{
                boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
                borderColor: 'var(--border)',
              }}
            >
              <h3 className="font-display text-lg font-bold mb-3 leading-tight" style={{ color: 'var(--primary)' }}>
                Quick Actions
              </h3>
              <div className="space-y-2">
                {quickActions.map((action) => (
                  <button
                    key={action.label}
                    className="w-full font-body text-sm font-medium py-2.5 px-3 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg text-white leading-tight"
                    style={{
                      background: action.color === 'burgundy' ? 'var(--primary)' :
                                 action.color === 'sage' ? 'var(--secondary)' :
                                 'var(--accent)',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Upcoming Events */}
            <div
              className="bg-white dark:bg-[var(--surface)] rounded-xl p-4 border"
              style={{
                boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
                borderColor: 'var(--border)',
              }}
            >
              <h3 className="font-display text-lg font-bold mb-3 leading-tight" style={{ color: 'var(--primary)' }}>
                Upcoming
              </h3>
              <div className="space-y-2">
                <div className="border-l-3 pl-3 py-1.5" style={{ borderColor: 'var(--secondary)' }}>
                  <div className="font-body font-semibold text-xs mb-0.5 leading-tight" style={{ color: 'var(--neutral-900)' }}>
                    Course Registration Deadline
                  </div>
                  <div className="font-body text-xs leading-tight" style={{ color: 'var(--neutral-500)' }}>
                    November 20, 2025
                  </div>
                </div>
                <div className="border-l-3 pl-3 py-1.5" style={{ borderColor: 'var(--accent)' }}>
                  <div className="font-body font-semibold text-xs mb-0.5 leading-tight" style={{ color: 'var(--neutral-900)' }}>
                    Faculty Development Program
                  </div>
                  <div className="font-body text-xs leading-tight" style={{ color: 'var(--neutral-500)' }}>
                    November 25-27, 2025
                  </div>
                </div>
                <div className="border-l-3 pl-3 py-1.5" style={{ borderColor: 'var(--primary)' }}>
                  <div className="font-body font-semibold text-xs mb-0.5 leading-tight" style={{ color: 'var(--neutral-900)' }}>
                    Academic Review Meeting
                  </div>
                  <div className="font-body text-xs leading-tight" style={{ color: 'var(--neutral-500)' }}>
                    December 1, 2025
                  </div>
                </div>
              </div>
            </div>

            {/* System Status */}
            <div
              className="bg-gradient-to-br from-[var(--secondary)] to-[var(--secondary-light)] rounded-xl p-4 text-white"
              style={{
                boxShadow: '0 4px 12px rgba(15, 118, 110, 0.25)',
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse"></div>
                <span className="font-body text-sm font-semibold leading-tight">System Status</span>
              </div>
              <div className="font-body text-xs opacity-90 leading-tight">
                All systems operational
              </div>
            </div>
          </section>
        </div>
      </div>
    </CMSLayout>
  );
}
