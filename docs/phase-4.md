# Phase 4 — Pull Request Module

## Objectives

- GitHub pull request service with full CRUD operations
- Frontend PR list and detail pages
- Foundation for AI code review (Phase 8)

## Backend Service (`src/services/github/pullRequestService.js`)

| Method | GitHub API | Description |
|--------|-----------|-------------|
| `getPullRequests(owner, repo, state)` | GET /repos/{owner}/{repo}/pulls | List PRs |
| `getPullRequest(owner, repo, number)` | GET /repos/{owner}/{repo}/pulls/{number} | PR details |
| `getPullRequestFiles(owner, repo, number)` | GET /repos/{owner}/{repo}/pulls/{number}/files | Changed files |
| `getPullRequestComments(owner, repo, number)` | GET /repos/{owner}/{repo}/pulls/{number}/comments | PR comments |
| `mergePullRequest(owner, repo, number)` | PUT /repos/{owner}/{repo}/pulls/{number}/merge | Merge PR |
| `createPullRequestReview(owner, repo, number, body)` | POST .../pulls/{number}/reviews | Submit review |

## Backend Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/v1/repos/:owner/:repo/pulls` | List pull requests |
| GET | `/api/v1/repos/:owner/:repo/pulls/:number` | PR details |
| GET | `/api/v1/repos/:owner/:repo/pulls/:number/files` | Changed files |
| GET | `/api/v1/repos/:owner/:repo/pulls/:number/comments` | PR comments |
| PUT | `/api/v1/repos/:owner/:repo/pulls/:number/merge` | Merge PR |

## Frontend Pages

### Pull Request List
- Filter by state (open, closed, merged)
- PR number, title, author, labels, created date

### Pull Request Detail
- Title, description, status, reviewers
- Files changed tab
- Comments tab
- Merge button (with confirmation)
- "AI Review" button placeholder (Phase 8)

## Flow Diagram

```
PRs Page → GET /pulls?state=open → Display PR list
→ Click PR → GET /pulls/:number + /files → PR Detail Page
```

## Status

- [x] Pull request service
- [x] PR controller and routes
- [x] Frontend PR list page
- [x] Frontend PR detail page
- [x] Merge functionality
