# Phase 1 — Project Setup & Basic UI

## Objectives

- Initialize Node.js backend with Express
- Environment configuration and logging
- Centralized error handling
- Health check API
- React + Vite frontend with dark theme
- Login screen and app shell (sidebar + placeholder pages)
- Docker support
- Project documentation

## Backend Deliverables

| Item | Description |
|------|-------------|
| Express server | ES6 modules, `app.js` + `server.js` separation |
| Health API | `GET /api/v1/health` |
| Middleware | helmet, cors, morgan, error handler, 404 handler |
| Utils | `apiResponse.js`, `AppError.js` |
| Config | `env.js` for environment variables |

## Frontend Deliverables

| Item | Description |
|------|-------------|
| Login screen | Logo, intro, GitHub login button (wired in Phase 2) |
| App layout | Dark theme sidebar navigation |
| Placeholder pages | Dashboard, Repositories, PRs, Issues, Commits, Chat, Review, Settings |
| API service | Base HTTP client for backend calls |

## API Endpoints

### GET /api/v1/health

**Response:**
```json
{
  "success": true,
  "message": "Server is healthy",
  "data": {
    "status": "ok",
    "uptime": 123.45,
    "timestamp": "2026-08-06T10:30:00.000Z",
    "environment": "development",
    "appName": "AI GitHub Assistant"
  }
}
```

## Flow Diagram

```
Client → Express → Morgan → Helmet → CORS → Routes → Controller → JSON Response
                                                      ↓ (on error)
                                              Error Middleware → JSON Error
```

## Testing Instructions

```bash
# Backend
npm run dev
curl http://localhost:3000/api/v1/health

# Frontend
cd client && npm run dev

# Docker
docker compose up --build
curl http://localhost:3000/api/v1/health
```

## Postman Collection

Import `docs/postman/phase-1.json` — contains health check endpoint.

## Status

- [x] Backend Express setup
- [x] Health API
- [x] Error handling
- [x] Frontend shell
- [x] Docker support
- [x] README
