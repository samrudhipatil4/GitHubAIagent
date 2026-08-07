# Phase 3 — Repository Module

## Objectives

- Create reusable GitHub repository service
- REST endpoints for repository operations
- Frontend repositories page with list, search, and detail views

## Backend Service (`src/services/github/repositoryService.js`)

| Method | GitHub API | Description |
|--------|-----------|-------------|
| `getRepositories()` | GET /user/repos | List user repositories |
| `getRepository(owner, repo)` | GET /repos/{owner}/{repo} | Single repo details |
| `searchRepositories(query)` | GET /search/repositories | Search repos |
| `getRepositoryStats(owner, repo)` | Multiple endpoints | Stars, forks, languages |
| `getContributors(owner, repo)` | GET /repos/{owner}/{repo}/contributors | Contributors list |

## Backend Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/v1/repos` | List authenticated user's repositories |
| GET | `/api/v1/repos/:owner/:repo` | Repository details |
| GET | `/api/v1/repos/search?q=` | Search repositories |
| GET | `/api/v1/repos/:owner/:repo/stats` | Repository statistics |
| GET | `/api/v1/repos/:owner/:repo/contributors` | Contributors |

## Frontend Pages

### Repository List
- Grid/list of repos with name, description, language, stars
- Search bar
- Click to navigate to detail page

### Repository Detail
- Name, description, stars, forks
- Languages breakdown
- Contributors
- Branches list (Phase 6)
- Latest commits preview (Phase 6)

## Flow Diagram

```
Dashboard → Repositories Page → GET /api/v1/repos → GitHub API
→ Display repo cards → Click repo → GET /api/v1/repos/:owner/:repo
```

## Error Handling

- Handle GitHub rate limits (403 with `X-RateLimit-Remaining`)
- Return 404 for private repos user cannot access
- Paginate large repo lists

## Status

- [x] Repository service
- [x] Repository controller and routes
- [x] Frontend repo list page
- [x] Frontend repo detail page
- [x] Search functionality
