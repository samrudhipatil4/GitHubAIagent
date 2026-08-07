# Phase 9 — Repository Insights

## Objectives

- Generate AI-powered repository summaries and analytics
- Explain repository structure, package.json, Dockerfile
- Frontend insights widgets on repository and dashboard pages

## Features

| Feature | Description |
|---------|-------------|
| Repository Summary | AI-generated overview of purpose, stack, and health |
| Explain Repository | Natural language explanation of what the repo does |
| Generate README | AI-generated README.md content |
| Folder Structure | Explain directory layout and purpose |
| Explain package.json | Dependencies, scripts, and config breakdown |
| Explain Dockerfile | Container setup and deployment explanation |
| Contributors | Top contributors with activity stats |
| Languages | Language breakdown chart |
| Commit Activity | Commit frequency over time |
| Issue/PR Statistics | Open vs closed trends |

## Backend Service (`src/services/ai/repositoryInsightService.js`)

| Method | Description |
|--------|-------------|
| `summarizeRepository(owner, repo)` | Full repo summary |
| `explainRepository(owner, repo)` | Detailed explanation |
| `generateReadme(owner, repo)` | Generate README content |
| `explainFolderStructure(owner, repo)` | Directory tree explanation |
| `explainPackageJson(owner, repo)` | package.json analysis |
| `explainDockerfile(owner, repo)` | Dockerfile analysis |
| `getContributors(owner, repo)` | Contributor statistics |
| `getLanguageStats(owner, repo)` | Language breakdown |
| `getCommitActivity(owner, repo)` | Commit activity graph data |
| `getIssuePRStats(owner, repo)` | Issue and PR statistics |

## Backend Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/v1/repos/:owner/:repo/insights/summary` | Repository summary |
| GET | `/api/v1/repos/:owner/:repo/insights/explain` | Explain repository |
| POST | `/api/v1/repos/:owner/:repo/insights/readme` | Generate README |
| GET | `/api/v1/repos/:owner/:repo/insights/structure` | Folder structure |
| GET | `/api/v1/repos/:owner/:repo/insights/package-json` | Explain package.json |
| GET | `/api/v1/repos/:owner/:repo/insights/dockerfile` | Explain Dockerfile |
| GET | `/api/v1/repos/:owner/:repo/insights/contributors` | Contributors |
| GET | `/api/v1/repos/:owner/:repo/insights/languages` | Language stats |
| GET | `/api/v1/repos/:owner/:repo/insights/activity` | Commit activity |
| GET | `/api/v1/repos/:owner/:repo/insights/stats` | Issue/PR stats |

## Frontend

### Repository Insights Tab
- Summary card with AI-generated overview
- Language chart (pie/bar)
- Commit activity graph
- Contributor list
- Issue/PR statistics cards
- Action buttons: "Explain", "Generate README", "Explain Structure"

### Dashboard Widgets (updated)
- Total repositories count
- Open PRs count
- Open issues count
- Recent commits
- AI activity feed

## Status

- [ ] Repository insight service
- [ ] Insight endpoints
- [ ] Frontend insights tab
- [ ] Dashboard widget updates
- [ ] Chart components
