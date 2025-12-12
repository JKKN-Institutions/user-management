'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function LoginContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const errorMessages: Record<string, string> = {
    domain: 'Access denied. Only @jkkn.ac.in accounts are allowed.',
    oauth_cancelled: 'Sign-in was cancelled. Please try again.',
    invalid_state: 'Security check failed. Please try again.',
    missing_code: 'Authentication failed. Please try again.',
    authentication_failed: 'Authentication failed. Please try again.',
    oauth_start_failed: 'Could not start sign-in. Please try again.',
  };

  const errorMessage = error ? errorMessages[error] || 'An error occurred. Please try again.' : null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 p-5">
      <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-md w-full text-center">
        {/* Logo */}
        <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mx-auto mb-6 flex items-center justify-center">
          <span className="text-white text-3xl font-bold">JK</span>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to JKKN</h1>
        <p className="text-gray-600 mb-8">Sign in with your institutional account</p>

        {/* Error Message */}
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
            <p className="text-red-800 text-sm">{errorMessage}</p>
          </div>
        )}

        {/* Sign in Button */}
        <a
          href="/api/auth/google/start"
          className="w-full inline-flex items-center justify-center gap-3 bg-white border-2 border-gray-200 rounded-xl py-4 px-6 text-gray-700 font-semibold hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Sign in with Google
        </a>

        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="px-4 text-gray-400 text-sm">Restricted access</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        {/* Notice */}
        <div className="bg-amber-50 border border-amber-400 rounded-lg p-4 text-left">
          <p className="text-amber-900 text-sm font-semibold mb-1">JKKN Users Only</p>
          <p className="text-amber-800 text-sm">
            Sign-in is restricted to @jkkn.ac.in accounts. Please use your institutional email address.
          </p>
        </div>

        <p className="mt-8 pt-6 border-t border-gray-200 text-gray-400 text-xs">
          &copy; 2024 JKKN Educational Institutions. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
          <div className="text-white">Loading...</div>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
