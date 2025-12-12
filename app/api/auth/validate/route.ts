/**
 * GET /api/auth/validate
 *
 * Validates the current session and returns user info.
 * Used by middleware and client-side auth checks.
 */

import { NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/session';

export async function GET() {
  try {
    const session = await getCurrentSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      user: {
        id: session.user.id,
        email: session.user.email,
        fullName: session.user.full_name,
        avatarUrl: session.user.avatar_url,
      },
      expiresAt: session.expiresAt.toISOString(),
    });
  } catch (error) {
    console.error('Session validation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
