'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const response = await fetch('/api/auth/validate');
        if (!response.ok) {
          router.push('/login');
          return;
        }
        const data = await response.json();
        setUser(data.user);
      } catch {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const firstName = user.fullName?.split(' ')[0] || 'User';
  const initial = (user.fullName || user.email || '?').charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">JK</span>
            </div>
            <span className="text-xl font-bold text-gray-900">JKKN Portal</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="font-semibold text-gray-900 text-sm">{user.fullName || 'User'}</div>
              <div className="text-gray-500 text-xs">{user.email}</div>
            </div>

            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt="Avatar"
                className="w-10 h-10 rounded-full border-2 border-gray-200"
              />
            ) : (
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">{initial}</span>
              </div>
            )}

            <form action="/api/auth/logout" method="POST">
              <button
                type="submit"
                className="bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-8">
        {/* Welcome Card */}
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-8 text-white mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {firstName}!</h1>
          <p className="opacity-90">You&apos;ve successfully signed in with your JKKN account.</p>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Account Info */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <h2 className="font-semibold text-gray-900">Account Information</h2>
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-xl">
                👤
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-4">Your account details and session information.</p>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Email</span>
                <span className="text-gray-900 font-medium">{user.email}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Name</span>
                <span className="text-gray-900 font-medium">{user.fullName || '-'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">User ID</span>
                <span className="text-gray-900 font-medium font-mono text-xs">
                  {user.id.substring(0, 8)}...
                </span>
              </div>
            </div>
          </div>

          {/* Security Info */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <h2 className="font-semibold text-gray-900">Session Security</h2>
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-xl">
                🔒
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-4">Your session is secured with the following measures:</p>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Cookie</span>
                <span className="text-gray-900 font-medium">HttpOnly, SameSite=Lax</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Duration</span>
                <span className="text-gray-900 font-medium">30 days</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Domain</span>
                <span className="text-gray-900 font-medium">@jkkn.ac.in only</span>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <h2 className="font-semibold text-gray-900">Quick Actions</h2>
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-xl">
                ⚡
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              This is a demo dashboard. In a production application, you would see your actual features here.
            </p>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Status</span>
                <span className="text-green-600 font-medium flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Authenticated
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
