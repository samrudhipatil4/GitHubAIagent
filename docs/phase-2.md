# Phase 2 — GitHub OAuth & Dashboard

## Objectives

- Implement GitHub OAuth 2.0 login flow
- Store and manage access tokens securely
- User profile endpoint
- Session management and logout
- Wire frontend login button to OAuth
- Dashboard with user profile widget

## Backend Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/v1/auth/github` | Redirect to GitHub OAuth |
| GET | `/api/v1/auth/github/callback` | Handle OAuth callback, store token |
| GET | `/api/v1/auth/profile` | Return authenticated user profile |
| POST | `/api/v1/auth/logout` | Clear session / token |

## Environment Variables

```
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GITHUB_CALLBACK_URL=http://localhost:3000/api/v1/auth/github/callback
SESSION_SECRET=
FRONTEND_URL=http://localhost:5173
```

## Implementation Plan

### Services (`src/services/auth/`)

- `githubOAuthService.js` — OAuth URL generation, token exchange
- `sessionService.js` — Session/token storage (in-memory or Redis)

### Middleware

- `authMiddleware.js` — Verify session/token on protected routes

### Frontend

- Login button redirects to `/api/v1/auth/github`
- After callback, redirect to dashboard
- Profile widget shows avatar, username, connected status
- Protected routes require authentication

## Flow Diagram

```
User clicks Login → GET /auth/github → GitHub Authorization
→ User approves → GET /auth/github/callback → Exchange code for token
→ Store token in session → Redirect to Dashboard → GET /auth/profile
```

## Dashboard Widgets (Phase 2)

- User profile (avatar, name, GitHub link)
- Placeholder counts for repos, PRs, issues (real data in Phase 3–6)

## Testing

1. Create GitHub OAuth App at https://github.com/settings/developers
2. Set callback URL to match env
3. Test login → profile → logout flow

## Status

- [x] GitHub OAuth service
- [x] Auth routes and controller
- [x] Session middleware
- [x] Frontend login flow
- [x] Dashboard profile widget
- [x] Auth context and route guards
