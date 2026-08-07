# Phase 7 — AI Chat Assistant & Tool Calling

## Objectives

- AI chat endpoint with natural language GitHub operations
- Modular tool system for GitHub actions
- LLM integration (Gemini primary, OpenAI optional)
- Frontend chat interface with markdown and tool execution status

## Backend Components

### Agent (`src/agents/chatAgent.js`)
- Receives user message + conversation context
- Sends to LLM with tool definitions
- Executes selected tools via Tool Manager
- Formats and returns natural language response

### Tool Manager (`src/tools/toolManager.js`)
- Registers all GitHub tools
- Dispatches tool calls from AI
- Returns structured results to agent

### Required Tools (`src/tools/`)

| Tool | Description |
|------|-------------|
| `getRepositories()` | List user repositories |
| `getRepository()` | Single repository details |
| `createIssue()` | Create a new issue |
| `updateIssue()` | Update an existing issue |
| `closeIssue()` | Close an issue |
| `getPullRequests()` | List pull requests |
| `mergePullRequest()` | Merge a pull request |
| `getCommits()` | List commits |
| `listBranches()` | List branches |
| `createBranch()` | Create a branch |
| `deleteBranch()` | Delete a branch |
| `listWorkflowRuns()` | List GitHub Actions runs |
| `getUserProfile()` | Get authenticated user profile |
| `searchRepository()` | Search repositories |
| `searchIssues()` | Search issues |
| `searchCode()` | Search code |

### Prompts (`src/prompts/`)
- `systemPrompt.js` — Agent personality and rules
- `toolSelectionPrompt.js` — Tool selection guidance

### AI Service (`src/services/ai/`)
- `geminiService.js` — Google Gemini integration
- `openaiService.js` — OpenAI integration (optional)
- `aiProvider.js` — Provider abstraction layer

## Backend Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/v1/chat` | Send message, receive AI response |
| GET | `/api/v1/chat/history` | Conversation history |

**Request:**
```json
{
  "message": "Show my open pull requests",
  "conversationId": "optional-uuid"
}
```

**Response:**
```json
{
  "success": true,
  "message": "AI response generated",
  "data": {
    "reply": "You have 3 open pull requests...",
    "toolsUsed": ["getPullRequests"],
    "conversationId": "uuid"
  }
}
```

## AI Agent Flow

```
User Message → Chat Agent → LLM (with tools) → Tool Selection
→ Tool Manager → GitHub Service → GitHub API → Tool Result
→ LLM (format response) → Natural Language Reply
```

## Frontend Chat UI

- Message input with send button
- Chat bubbles (user + AI)
- Markdown rendering with code blocks
- Tool execution indicator ("Fetching repositories...")
- Repository/PR links in responses
- Conversation history sidebar

## Environment Variables

```
GEMINI_API_KEY=
OPENAI_API_KEY=
AI_PROVIDER=gemini
AI_MODEL=gemini-2.0-flash
```

## Status

- [ ] AI provider abstraction
- [ ] Gemini service integration
- [ ] Tool definitions and manager
- [ ] Chat agent
- [ ] Chat endpoint
- [ ] Frontend chat UI
