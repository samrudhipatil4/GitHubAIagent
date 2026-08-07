# Phase 6 — Commit History & Branch Management

## Objectives

- GitHub commits and branches services
- Frontend commit history and branch management pages
- AI commit summary foundation (used in Phase 7)

## Backend Services

### `src/services/github/commitService.js`

| Method | GitHub API | Description |
|--------|-----------|-------------|
| `getCommits(owner, repo, branch)` | GET /repos/{owner}/{repo}/commits | List commits |
| `getCommit(owner, repo, sha)` | GET /repos/{owner}/{repo}/commits/{sha} | Commit details |
| `compareCommits(owner, repo, base, head)` | GET /repos/{owner}/{repo}/compare/{base}...{head} | Compare |

### `src/services/github/branchService.js`

| Method | GitHub API | Description |
|--------|-----------|-------------|
| `listBranches(owner, repo)` | GET /repos/{owner}/{repo}/branches | List branches |
| `createBranch(owner, repo, branch, sha)` | POST /repos/{owner}/{repo}/git/refs | Create branch |
| `deleteBranch(owner, repo, branch)` | DELETE /repos/{owner}/{repo}/git/refs/heads/{branch} | Delete branch |
| `getBranch(owner, repo, branch)` | GET /repos/{owner}/{repo}/branches/{branch} | Branch details |

## Backend Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/v1/repos/:owner/:repo/commits` | List commits |
| GET | `/api/v1/repos/:owner/:repo/commits/:sha` | Commit details |
| GET | `/api/v1/repos/:owner/:repo/branches` | List branches |
| POST | `/api/v1/repos/:owner/:repo/branches` | Create branch |
| DELETE | `/api/v1/repos/:owner/:repo/branches/:branch` | Delete branch |
| GET | `/api/v1/repos/:owner/:repo/compare/:base...:head` | Compare branches |

## Frontend Pages

### Commits
- Commit list with message, author, date, SHA
- Commit detail with file changes (diff view)
- "Summarize commits" button (AI, Phase 7)

### Branches
- Branch list with protection status
- Create branch form (name + base branch)
- Delete branch with confirmation
- Compare branches link

## Status

- [ ] Commit service
- [ ] Branch service
- [ ] Controllers and routes
- [ ] Frontend commits page
- [ ] Frontend branches page
