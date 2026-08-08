# Phase 5 — Issues Module

## Objectives

- GitHub issues service for full issue lifecycle management
- Frontend issues page with create, edit, close, assign, label, and comment

## Backend Service (`src/services/github/issueService.js`)

| Method | GitHub API | Description |
|--------|-----------|-------------|
| `getIssues(owner, repo, state)` | GET /repos/{owner}/{repo}/issues | List issues |
| `getIssue(owner, repo, number)` | GET /repos/{owner}/{repo}/issues/{number} | Issue details |
| `createIssue(owner, repo, data)` | POST /repos/{owner}/{repo}/issues | Create issue |
| `updateIssue(owner, repo, number, data)` | PATCH /repos/{owner}/{repo}/issues/{number} | Update issue |
| `closeIssue(owner, repo, number)` | PATCH ... (state: closed) | Close issue |
| `addComment(owner, repo, number, body)` | POST .../issues/{number}/comments | Add comment |
| `assignMembers(owner, repo, number, assignees)` | PATCH issue | Assign members |
| `addLabels(owner, repo, number, labels)` | PATCH issue | Add labels |

## Backend Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/v1/repos/:owner/:repo/issues` | List issues |
| GET | `/api/v1/repos/:owner/:repo/issues/:number` | Issue details |
| POST | `/api/v1/repos/:owner/:repo/issues` | Create issue |
| PATCH | `/api/v1/repos/:owner/:repo/issues/:number` | Update issue |
| POST | `/api/v1/repos/:owner/:repo/issues/:number/close` | Close issue |
| POST | `/api/v1/repos/:owner/:repo/issues/:number/comments` | Add comment |

## Frontend Pages

### Issue List
- Filter by state (open, closed)
- Issue number, title, labels, assignees

### Issue Detail / Create
- Title, body (markdown editor)
- Labels selector
- Assignee selector
- Comments thread
- Close button

## Flow Diagram

```
Issues Page → GET /issues → Display list
→ Create Issue → POST /issues → Redirect to detail
→ Edit/Close/Comment → PATCH/POST → Refresh detail
```

## Status

- [x] Issue service
- [x] Issue controller and routes
- [x] Frontend issue list page
- [x] Frontend issue create/edit page
- [x] Comment and label support
