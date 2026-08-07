# Architecture Overview

## Project Vision

AI GitHub Assistant is a full-stack application that lets developers manage GitHub repositories, pull requests, issues, commits, and workflows using natural language.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React + Vite)                   │
│  Login │ Dashboard │ Repos │ PRs │ Issues │ Chat │ Review   │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP /api/v1
┌──────────────────────────▼──────────────────────────────────┐
│                    Backend (Express.js)                      │
│  Routes → Controllers → Services → GitHub / AI             │
│  Middleware: Auth, Validation, Error Handling, Logging       │
└──────────────┬─────────────────────────────┬────────────────┘
               │                             │
     ┌─────────▼─────────┐         ┌─────────▼─────────┐
     │   GitHub REST API  │         │  Gemini / OpenAI  │
     └───────────────────┘         └───────────────────┘
```

## AI Agent Flow

```
User Request → Understand Intent → Select GitHub Tool → Execute GitHub API
→ Analyze Result → Generate Response → Display to User
```

## Tool Flow

```
AI → Tool Manager → GitHub Service → GitHub REST API → Response → AI Formatter
```

## Folder Structure

```
AI-GitHub-Assistant/
├── client/                 # React frontend
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── layouts/
│       ├── hooks/
│       └── services/
├── src/                    # Express backend
│   ├── config/
│   ├── controllers/
│   ├── routes/
│   ├── services/
│   │   ├── ai/
│   │   ├── github/
│   │   └── auth/
│   ├── agents/
│   ├── tools/
│   ├── prompts/
│   ├── middleware/
│   └── utils/
├── docs/
├── Dockerfile
└── docker-compose.yml
```

## API Response Standards

**Success:**
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {}
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error description"
}
```

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Node.js, Express.js, ES6 Modules |
| Frontend | React, Vite, Tailwind CSS, React Router |
| AI | Google Gemini (primary), OpenAI (optional) |
| Auth | GitHub OAuth 2.0 |
| API | GitHub REST API, GraphQL (optional) |
| Deployment | Docker, Railway, Render, AWS EC2 |

## Security

- Environment variables for all secrets
- Helmet for HTTP security headers
- CORS configured for frontend origin
- HTTP-only cookies for session tokens (Phase 2)
- Input validation via express-validator
