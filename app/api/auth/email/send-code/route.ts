/**
 * Send Verification Code API
 *
 * POST /api/auth/email/send-code
 * Body: { email: string }
 */

import { NextRequest, NextResponse } from 'next/server';
import { createVerificationCode, isAllowedEmailDomain, checkRateLimit, getAllowedDomain } from '@/lib/verification';
import { sendVerificationCodeEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Check domain restriction
    if (!isAllowedEmailDomain(normalizedEmail)) {
      return NextResponse.json(
        { error: `Only @${getAllowedDomain()} email addresses are allowed` },
        { status: 403 }
      );
    }

    // Check rate limiting
    const withinLimit = await checkRateLimit(normalizedEmail);
    if (!withinLimit) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again in a few minutes.' },
        { status: 429 }
      );
    }

    // Generate and store verification code
    const code = await createVerificationCode(normalizedEmail);

    // Send email
    await sendVerificationCodeEmail(normalizedEmail, code);

    return NextResponse.json({
      success: true,
      message: 'Verification code sent',
    });
  } catch (error) {
    console.error('Send verification code error:', error);
    return NextResponse.json({ error: 'Failed to send verification code' }, { status: 500 });
  }
}
