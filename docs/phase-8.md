# Phase 8 — AI Code Review

## Objectives

- Automatically analyze pull requests using AI
- Detect bugs, security issues, performance problems, and code quality issues
- Frontend code review screen with scores and suggestions

## Workflow

```
User: "Review PR #18"
    ↓
Fetch PR details + changed files (diffs)
    ↓
Send file contents to AI with review prompt
    ↓
AI analyzes each file
    ↓
Return structured review
```

## Backend Service (`src/services/ai/codeReviewService.js`)

| Method | Description |
|--------|-------------|
| `reviewPullRequest(owner, repo, number)` | Full PR review pipeline |
| `analyzeFile(filename, diff, content)` | Single file analysis |
| `generateSummary(reviews)` | Overall PR summary |

## Review Output Structure

```json
{
  "overallScore": 78,
  "summary": "This PR introduces...",
  "files": [
    {
      "filename": "src/utils/helper.js",
      "issues": [
        {
          "type": "bug",
          "severity": "high",
          "line": 42,
          "message": "Potential null reference",
          "suggestion": "Add null check before accessing property"
        }
      ]
    }
  ],
  "categories": {
    "bugs": 2,
    "security": 1,
    "performance": 0,
    "codeQuality": 3
  }
}
```

## Backend Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/v1/repos/:owner/:repo/pulls/:number/review` | AI review a PR |
| GET | `/api/v1/repos/:owner/:repo/pulls/:number/review` | Get cached review |

## Review Prompt (`src/prompts/codeReviewPrompt.js`)

Analyze for:
- **Bugs** — Logic errors, null references, edge cases
- **Security** — Injection, XSS, hardcoded secrets, unsafe dependencies
- **Performance** — N+1 queries, unnecessary loops, memory leaks
- **Code Quality** — Naming, duplication, complexity, best practices

## Frontend Code Review Screen

- Changed files list with issue counts
- Overall score badge (0–100)
- Category breakdown (bugs, security, performance, quality)
- Per-file expandable issue cards with line numbers
- Suggestions with code examples
- "Submit review to GitHub" button (optional)

## Flow Diagram

```
PR Detail → Click "AI Review" → POST /review
→ Fetch PR files → AI analysis per file → Aggregate results
→ Display review screen with scores and suggestions
```

## Status

- [x] Code review service
- [x] Review prompts
- [x] Review endpoint
- [x] Frontend review screen
- [x] Integration with PR detail page
