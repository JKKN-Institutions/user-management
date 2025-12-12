/**
 * Next.js Middleware for Authentication
 *
 * Protects routes that require authentication by validating session cookies.
 * Redirects unauthenticated users to the login page.
 */

import { NextRequest, NextResponse } from 'next/server';

// Routes that require authentication
const PROTECTED_ROUTES = ['/dashboard'];

// Routes that should redirect to dashboard if already authenticated
const AUTH_ROUTES = ['/login'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get('session_token')?.value;

  // Check if trying to access a protected route
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  // Check if trying to access an auth route (login)
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  if (isProtectedRoute) {
    if (!sessionToken) {
      // No session token, redirect to login
      const url = new URL('/login', request.url);
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }

    // Validate session by calling the API
    // Note: In production, consider using edge-compatible validation
    // or a JWT approach for better performance
    try {
      const validateUrl = new URL('/api/auth/validate', request.url);
      const response = await fetch(validateUrl, {
        headers: {
          Cookie: `session_token=${sessionToken}`,
        },
      });

      if (!response.ok) {
        // Invalid session, redirect to login
        const url = new URL('/login', request.url);
        url.searchParams.set('redirect', pathname);
        const redirectResponse = NextResponse.redirect(url);
        // Clear invalid cookie
        redirectResponse.cookies.delete('session_token');
        return redirectResponse;
      }
    } catch {
      // If validation fails, allow through and let the page handle it
      // This prevents blocking if the API is temporarily unavailable
      console.warn('Session validation failed in middleware');
    }
  }

  if (isAuthRoute && sessionToken) {
    // Already has a session token, redirect to dashboard
    // Note: Token might be invalid, but dashboard will handle that
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes (handled separately)
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api).*)',
  ],
};
