# 🤖 AI GitHub Assistant

An AI-powered GitHub Assistant that enables developers to manage repositories, pull requests, issues, commits, and workflows using natural language.

## Features

- **GitHub OAuth** — Secure authentication (Phase 2)
- **Repository Management** — Browse, search, and analyze repos (Phase 3)
- **Pull Requests** — View, review, and merge PRs (Phase 4)
- **Issues** — Create, edit, assign, and close issues (Phase 5)
- **Commit History** — Browse commits and branches (Phase 6)
- **AI Chat** — Natural language GitHub operations (Phase 7)
- **AI Code Review** — Automated PR analysis (Phase 8)
- **Repository Insights** — AI summaries and analytics (Phase 9)
- **MCP Integration** — Model Context Protocol for AI tools (Phase 10)
- **Memory & Preferences** — Saved settings and activity (Phase 10)
- **GitHub Actions Assistant** — Workflow monitoring and AI failure analysis (Phase 10)

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Node.js, Express.js, ES6 Modules |
| Frontend | React, Vite, Tailwind CSS |
| AI | Google Gemini (primary), OpenAI (optional) |
| Auth | GitHub OAuth 2.0 |
| Deployment | Docker, Railway, Render, AWS |

## Project Structure

```
├── client/          # React frontend
├── src/             # Express backend
│   ├── config/
│   ├── controllers/
│   ├── routes/
│   ├── services/
│   ├── middleware/
│   ├── agents/
│   ├── tools/
│   └── utils/
├── docs/            # Phase documentation
├── Dockerfile
└── docker-compose.yml
```

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Setup

```bash
# Clone the repository
git clone <repo-url>
cd AI-GitHub-Assistant

# Install backend dependencies
npm install

# Install frontend dependencies
cd client && npm install && cd ..

# Configure environment
cp .env.example .env
```

### Development

```bash
# Run backend only
npm run dev

# Run frontend only
npm run dev:client

# Run both concurrently
npm run dev:all
```

- Backend: http://localhost:3000
- Frontend: http://localhost:5173
- Health check: http://localhost:3000/api/v1/health

### GitHub OAuth Setup

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a new **OAuth App**
3. Set **Authorization callback URL** to:
   ```
   http://localhost:3000/api/v1/auth/github/callback
   ```
4. Copy Client ID and Client Secret into your `.env` file
5. Set a strong `SESSION_SECRET`
6. Restart the backend and click **Sign in with GitHub**

### AI Chat Setup (Phase 7)

1. Get a Gemini API key at https://aistudio.google.com/apikey
2. Add to `.env`:
   ```
   GEMINI_API_KEY=your_gemini_api_key
   AI_MODEL=gemini-2.0-flash
   ```
3. Restart backend and open **AI Chat** in the sidebar

### Docker

```bash
docker compose up --build
```

## API Response Format

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

## Development Roadmap

| Phase | Status | Description |
|-------|--------|-------------|
| 1 | ✅ Complete | Project setup, health API, basic UI |
| 2 | ✅ Complete | GitHub OAuth & dashboard |
| 3 | ✅ Complete | Repository module |
| 4 | ✅ Complete | Pull request module |
| 5 | ✅ Complete | Issues module |
| 6 | ✅ Complete | Commits & branches |
| 7 | ✅ Complete | AI chat & tool calling |
| 8 | ✅ Complete | AI code review |
| 9 | ✅ Complete | Repository insights |
| 10 | ✅ Complete | MCP, memory & deployment |

See [docs/](docs/) for detailed phase documentation.

## License

MIT
