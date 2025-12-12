/**
 * GET /api/debug/oauth-url
 *
 * Debug endpoint to see the exact OAuth URL being generated.
 * DELETE THIS FILE after debugging!
 */

import { NextResponse } from 'next/server';
import { getGoogleAuthUrl } from '@/lib/auth';

export async function GET() {
  try {
    const testState = 'debug-test-state';
    const authUrl = getGoogleAuthUrl(testState);

    // Parse the URL to show components
    const url = new URL(authUrl);

    return NextResponse.json({
      fullUrl: authUrl,
      params: {
        client_id: url.searchParams.get('client_id'),
        redirect_uri: url.searchParams.get('redirect_uri'),
        scope: url.searchParams.get('scope'),
        state: url.searchParams.get('state'),
        hd: url.searchParams.get('hd'),
        prompt: url.searchParams.get('prompt'),
        access_type: url.searchParams.get('access_type'),
        response_type: url.searchParams.get('response_type'),
      }
    });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
