# JKKN User Management System

A secure, enterprise-grade authentication system built with Next.js, featuring dual authentication methods for JKKN Educational Institutions.

## Overview

This application provides a robust user management solution with Google OAuth and email verification code authentication, specifically designed for your domain users. Built with modern security practices and optimized for best use.

## Key Features

### Authentication
- **Google OAuth 2.0** - Seamless single sign-on with Google Workspace
- **Email Verification** - Passwordless login via 6-digit verification codes

### Security
- 256-bit cryptographically secure session tokens
- HttpOnly, SameSite cookies with HTTPS enforcement
- CSRF protection via state parameter validation
- Rate limiting on verification code requests
- 2-minute code expiration for enhanced security

### Technical
- Server-side session management with PostgreSQL
- 30-day session persistence
- Middleware-based route protection
- Real-time session validation

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16, React 19, Tailwind CSS |
| Backend | Next.js API Routes |
| Database | PostgreSQL (Supabase) |
| Authentication | Google OAuth 2.0, Gmail API |
| Email Service | Gmail API with OAuth 2.0 |

## Prerequisites

- Node.js 18.x or higher
- PostgreSQL database (Supabase recommended)
- Google Cloud Console project
- Gmail API access

## Installation

### 1. Clone and Install

```bash
git clone <repository-url>
cd user-management
npm install
```

### 2. Google Cloud Setup

1. Navigate to [Google Cloud Console](https://console.cloud.google.com/)
2. Create or select a project
3. Go to **APIs & Services > Credentials**
4. Create **OAuth 2.0 Client ID** (Web application)
5. Add authorized redirect URIs:
   ```
   https://your-domain/api/auth/google/callback
   https://your-domain/api/auth/gmail-callback
   ```
6. Enable **Gmail API** under **APIs & Services > Library**

### 3. Environment Configuration

```bash
cp .env.example .env.local
```

Configure the following variables in `.env.local`:

#### Supabase
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

#### Google OAuth
```env
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=https://your-domain/api/auth/google/callback
```

#### Gmail API
```env
GMAIL_CLIENT_ID=your-client-id.apps.googleusercontent.com
GMAIL_CLIENT_SECRET=your-client-secret
GMAIL_REFRESH_TOKEN=your-refresh-token
GMAIL_USER=sender@domain.com
EMAIL_FROM_NAME=YourAppName
```

#### Application
```env
NEXT_PUBLIC_APP_URL=https://your-domain
ALLOWED_DOMAIN=yourdomain.com
```

## Project Architecture

```
user-management/
├── app/
│   ├── api/auth/
│   │   ├── google/
│   │   │   ├── start/route.ts          # OAuth initiation
│   │   │   └── callback/route.ts       # OAuth callback handler
│   │   ├── email/
│   │   │   ├── send-code/route.ts      # Verification code dispatch
│   │   │   └── verify-code/route.ts    # Code validation & login
│   │   ├── gmail-callback/route.ts     # Gmail token utility
│   │   ├── logout/route.ts             # Session termination
│   │   └── validate/route.ts           # Session validation
│   ├── login/page.tsx                  # Authentication UI
│   └── dashboard/page.tsx              # Protected area
├── lib/
│   ├── supabase.ts                     # Database client
│   ├── auth.ts                         # OAuth utilities
│   ├── session.ts                      # Session management
│   ├── verification.ts                 # Code generation & validation
│   └── email.ts                        # Gmail API service
└── middleware.ts                       # Route protection
```

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/auth/google/start` | Initiates Google OAuth flow |
| `GET` | `/api/auth/google/callback` | Processes OAuth callback |
| `POST` | `/api/auth/email/send-code` | Sends verification code |
| `POST` | `/api/auth/email/verify-code` | Validates code & creates session |
| `POST` | `/api/auth/logout` | Terminates session |
| `GET` | `/api/auth/validate` | Validates current session |

## Authentication Flows

### Google OAuth
```
User → Sign in with Google → Google OAuth → Domain Validation → Session Creation → Dashboard
```

### Email Verification
```
User → Enter Email → Receive Code → Enter Code → Session Creation → Dashboard
```

## Security Implementation

| Feature | Implementation |
|---------|----------------|
| Session Tokens | `crypto.randomBytes(32)` - 256-bit entropy |
| Cookie Flags | `HttpOnly`, `SameSite=Lax`, `Secure` (production) |
| OAuth Security | State parameter with CSRF validation |
| Domain Control | Dual validation via `hd` claim and email suffix |
| Rate Limiting | 3 codes per email per 10 minutes |
| Code Expiry | 2-minute TTL on verification codes |

## Production Deployment

### Environment Variables
```env
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com
GOOGLE_REDIRECT_URI=https://your-domain.com/api/auth/google/callback
```

### Google Cloud Configuration
1. Add production redirect URIs
2. Complete domain verification
3. Publish OAuth consent screen

## License

MIT License - See [LICENSE](LICENSE) for details.

---

**JKKN Educational Institutions** | Built with Next.js
