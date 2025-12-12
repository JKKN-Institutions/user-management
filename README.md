# JKKN User Management

A Next.js application with Google OAuth authentication, restricted to `@jkkn.ac.in` domain users.

## Features

- Google OAuth2 Sign-In with `google-auth-library`
- Domain restriction to `@jkkn.ac.in` accounts only
- PostgreSQL session storage with secure tokens
- HttpOnly, SameSite cookies for session management
- Next.js App Router with middleware-based route protection
- 30-day session lifetime

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (via Supabase)
- **Auth**: Google OAuth2

## Prerequisites

- Node.js 18.x or higher
- PostgreSQL database (Supabase recommended)
- Google Cloud Console project with OAuth2 credentials

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

You also need to install the additional auth dependencies:

```bash
npm install google-auth-library pg @types/pg
```

### 2. Set Up Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Navigate to **APIs & Services > Credentials**
4. Click **Create Credentials > OAuth client ID**
5. Select **Web application**
6. Add authorized redirect URI: `http://localhost:3000/api/auth/google/callback`
7. Copy the Client ID and Client Secret

### 3. Configure Environment Variables

```bash
# Copy the example file
cp .env.example .env.local

# Edit .env.local with your values
```

Required environment variables:

| Variable | Description |
|----------|-------------|
| `GOOGLE_CLIENT_ID` | OAuth2 Client ID from Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | OAuth2 Client Secret |
| `GOOGLE_REDIRECT_URI` | Full callback URL (e.g., `http://localhost:3000/api/auth/google/callback`) |
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXT_PUBLIC_APP_URL` | Base URL of your app (e.g., `http://localhost:3000`) |
| `ALLOWED_DOMAIN` | Allowed email domain (default: `jkkn.ac.in`) |

### 4. Run Database Migrations

Option A: Using Supabase SQL Editor
1. Go to your Supabase project
2. Navigate to SQL Editor
3. Copy contents of `migrations.sql` and execute

Option B: Using psql
```bash
psql $DATABASE_URL -f migrations.sql
```

### 5. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000/login](http://localhost:3000/login) to sign in.

## Project Structure

```
user_management/
├── app/
│   ├── api/
│   │   └── auth/
│   │       ├── google/
│   │       │   ├── start/route.ts      # Initiate OAuth flow
│   │       │   └── callback/route.ts   # Handle OAuth callback
│   │       ├── logout/route.ts         # End session
│   │       └── validate/route.ts       # Validate session
│   ├── login/page.tsx                  # Login page
│   └── dashboard/page.tsx              # Protected dashboard
├── lib/
│   ├── db.ts                           # PostgreSQL connection
│   ├── auth.ts                         # OAuth helpers
│   └── session.ts                      # Session management
├── middleware.ts                       # Route protection
├── migrations.sql                      # Database schema
├── .env.example                        # Environment template
└── README.md                           # This file
```

## API Routes

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/auth/google/start` | Initiates Google OAuth flow |
| GET | `/api/auth/google/callback` | Handles OAuth callback |
| POST | `/api/auth/logout` | Ends session and clears cookie |
| GET | `/api/auth/validate` | Validates current session |

## Authentication Flow

1. User clicks "Sign in with Google" on `/login`
2. Redirected to `/api/auth/google/start`
3. Server generates state token, redirects to Google
4. User authenticates with Google
5. Google redirects to `/api/auth/google/callback`
6. Server validates state, exchanges code for tokens
7. Server verifies email domain is `@jkkn.ac.in`
8. Server creates/updates user, creates session
9. Session cookie set, user redirected to `/dashboard`

## Security Features

1. **Session Tokens**: 256-bit cryptographically random via `crypto.randomBytes(32)`
2. **Cookie Security**:
   - `HttpOnly`: Prevents JavaScript access
   - `SameSite=Lax`: CSRF protection
   - `Secure`: HTTPS-only in production
3. **State Parameter**: CSRF protection for OAuth flow
4. **Domain Restriction**: Validates both `hd` claim and email suffix
5. **Parameterized Queries**: All SQL uses parameterized queries

## Production Deployment

### Environment Variables for Production

```bash
NODE_ENV=production
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxx
GOOGLE_REDIRECT_URI=https://yourdomain.com/api/auth/google/callback
DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require
NEXT_PUBLIC_APP_URL=https://yourdomain.com
ALLOWED_DOMAIN=jkkn.ac.in
```

### Google Cloud Console Setup for Production

1. Add production redirect URI: `https://yourdomain.com/api/auth/google/callback`
2. Verify domain ownership if required
3. Update OAuth consent screen with production details

## Troubleshooting

### "redirect_uri_mismatch" Error
- Ensure callback URL in Google Cloud Console matches `GOOGLE_REDIRECT_URI` exactly
- Include full path: `http://localhost:3000/api/auth/google/callback`

### "Access Denied" for Valid Users
- Verify email domain is `@jkkn.ac.in`
- Check `ALLOWED_DOMAIN` environment variable

### Database Connection Errors
- Verify `DATABASE_URL` is correct
- For Supabase, use the connection pooler URL
- Ensure SSL mode is configured correctly

### Session Not Persisting
- Check browser isn't blocking cookies
- Verify `NEXT_PUBLIC_APP_URL` matches your domain

## License

MIT
