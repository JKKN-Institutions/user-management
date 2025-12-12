/**
 * Gmail OAuth Callback
 *
 * Temporary route to get Gmail refresh token.
 * Delete this file after getting the token.
 */

import { NextRequest, NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');

  if (!code) {
    // Generate auth URL
    const oauth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/gmail-callback`
    );

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://mail.google.com/'],
      prompt: 'consent',
      include_granted_scopes: true,
    });

    return NextResponse.redirect(authUrl);
  }

  // Exchange code for tokens
  try {
    const oauth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/gmail-callback`
    );

    const { tokens } = await oauth2Client.getToken(code);

    const refreshToken = tokens.refresh_token;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Gmail Token Generated</title>
        <style>
          body { font-family: system-ui; max-width: 600px; margin: 50px auto; padding: 20px; }
          .token { background: #f0f0f0; padding: 15px; border-radius: 8px; word-break: break-all; font-family: monospace; margin: 10px 0; }
          .success { color: #16a34a; }
          .warning { color: #d97706; }
          code { background: #e5e7eb; padding: 2px 6px; border-radius: 4px; }
        </style>
      </head>
      <body>
        ${refreshToken ? `
          <h1 class="success">✓ Gmail Token Generated!</h1>
          <p>Add this to your <code>.env.local</code> file:</p>
          <div class="token">GMAIL_REFRESH_TOKEN=${refreshToken}</div>
        ` : `
          <h1 class="warning">⚠ No Refresh Token Returned</h1>
          <p>Google didn't return a refresh token. This usually means you need to revoke access first.</p>
          <p><strong>Steps to fix:</strong></p>
          <ol>
            <li>Go to <a href="https://myaccount.google.com/permissions" target="_blank">Google Account Permissions</a></li>
            <li>Find and remove access for "JKKN" or your app</li>
            <li>Come back and try again: <a href="/api/auth/gmail-callback">Retry</a></li>
          </ol>
        `}
        <h3>Debug Info:</h3>
        <div class="token">Access Token: ${tokens.access_token?.substring(0, 20)}...</div>
        <div class="token">Refresh Token: ${refreshToken || 'NOT PROVIDED'}</div>
        <p style="margin-top: 20px; color: #666;">
          After updating .env.local, restart your dev server.
        </p>
      </body>
      </html>
    `;

    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html' },
    });
  } catch (error) {
    console.error('Gmail token error:', error);
    return NextResponse.json({ error: 'Failed to get token', details: String(error) }, { status: 500 });
  }
}
