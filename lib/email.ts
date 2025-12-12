/**
 * Email Service
 *
 * Handles sending verification emails using Gmail API directly.
 */

import { google } from 'googleapis';

let gmailClient: ReturnType<typeof google.gmail> | null = null;

function getGmailClient() {
  if (!gmailClient) {
    const clientId = process.env.GMAIL_CLIENT_ID;
    const clientSecret = process.env.GMAIL_CLIENT_SECRET;
    const refreshToken = process.env.GMAIL_REFRESH_TOKEN;

    if (!clientId || !clientSecret || !refreshToken) {
      throw new Error('Gmail OAuth2 credentials are not configured');
    }

    const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
    oauth2Client.setCredentials({ refresh_token: refreshToken });

    gmailClient = google.gmail({ version: 'v1', auth: oauth2Client });
  }
  return gmailClient;
}

/**
 * Create email in RFC 2822 format
 */
function createEmail(to: string, from: string, subject: string, html: string): string {
  const messageParts = [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${subject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=utf-8',
    '',
    html,
  ];
  const message = messageParts.join('\n');

  // Base64 encode for Gmail API
  return Buffer.from(message)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Send verification code email
 */
export async function sendVerificationCodeEmail(email: string, code: string): Promise<void> {
  const fromEmail = process.env.GMAIL_USER;
  const fromName = process.env.EMAIL_FROM_NAME || 'JKKN';

  if (!fromEmail) {
    throw new Error('GMAIL_USER is not configured');
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #6366f1 0%, #9333ea 100%); padding: 30px; border-radius: 16px 16px 0 0; text-align: center;">
        <div style="background: white; width: 60px; height: 60px; border-radius: 12px; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center;">
          <span style="font-size: 24px; font-weight: bold; color: #6366f1;">JK</span>
        </div>
        <h1 style="color: white; margin: 0; font-size: 24px;">JKKN User Management</h1>
      </div>

      <div style="background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
        <h2 style="margin: 0 0 15px; color: #111827;">Your Verification Code</h2>
        <p style="margin: 0 0 20px; color: #6b7280;">Use the following code to sign in to your account:</p>

        <div style="background: white; border: 2px solid #e5e7eb; border-radius: 12px; padding: 20px; text-align: center; margin: 20px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #111827; font-family: monospace;">${code}</span>
        </div>

        <p style="margin: 20px 0 0; color: #6b7280; font-size: 14px;">
          This code will expire in <strong>2 minutes</strong>.
        </p>
        <p style="margin: 10px 0 0; color: #6b7280; font-size: 14px;">
          If you didn't request this code, you can safely ignore this email.
        </p>
      </div>

      <div style="padding: 20px; text-align: center; color: #9ca3af; font-size: 12px;">
        <p style="margin: 0;">© ${new Date().getFullYear()} JKKN Educational Institutions. All rights reserved.</p>
        <p style="margin: 5px 0 0;">This is an automated message, please do not reply.</p>
      </div>
    </body>
    </html>
  `;

  try {
    const gmail = getGmailClient();
    const encodedMessage = createEmail(
      email,
      `${fromName} <${fromEmail}>`,
      `${code} is your JKKN verification code`,
      html
    );

    await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage,
      },
    });
  } catch (err) {
    console.error('Gmail API error:', err);
    throw err;
  }
}
