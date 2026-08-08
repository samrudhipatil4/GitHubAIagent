export const MCP_TO_HANDLER = {
  list_repositories: 'getRepositories',
  get_repository: 'getRepository',
  search_repository: 'searchRepository',
  get_user_profile: 'getUserProfile',
  list_issues: 'getIssues',
  create_issue: 'createIssue',
  update_issue: 'updateIssue',
  close_issue: 'closeIssue',
  search_issues: 'searchIssues',
  list_pull_requests: 'getPullRequests',
  merge_pull_request: 'mergePullRequest',
  list_commits: 'getCommits',
  list_branches: 'listBranches',
  create_branch: 'createBranch',
  delete_branch: 'deleteBranch',
  list_workflow_runs: 'listWorkflowRuns',
  search_code: 'searchCode',
};

export const HANDLER_TO_MCP = Object.fromEntries(
  Object.entries(MCP_TO_HANDLER).map(([mcp, handler]) => [handler, mcp])
);

export const mcpToolDefinitions = [
  {
    name: 'list_repositories',
    description: 'List repositories for the authenticated user',
    inputSchema: { type: 'object', properties: { page: { type: 'number' } } },
  },
  {
    name: 'get_repository',
    description: 'Get details of a specific repository',
    inputSchema: {
      type: 'object',
      properties: { owner: { type: 'string' }, repo: { type: 'string' } },
      required: ['owner', 'repo'],
    },
  },
  {
    name: 'list_issues',
    description: 'List issues for a repository',
    inputSchema: {
      type: 'object',
      properties: {
        owner: { type: 'string' },
        repo: { type: 'string' },
        state: { type: 'string', enum: ['open', 'closed', 'all'] },
      },
      required: ['owner', 'repo'],
    },
  },
  {
    name: 'create_issue',
    description: 'Create a new issue',
    inputSchema: {
      type: 'object',
      properties: {
        owner: { type: 'string' },
        repo: { type: 'string' },
        title: { type: 'string' },
        body: { type: 'string' },
        labels: { type: 'array', items: { type: 'string' } },
      },
      required: ['owner', 'repo', 'title'],
    },
  },
  {
    name: 'list_pull_requests',
    description: 'List pull requests for a repository',
    inputSchema: {
      type: 'object',
      properties: {
        owner: { type: 'string' },
        repo: { type: 'string' },
        state: { type: 'string' },
      },
      required: ['owner', 'repo'],
    },
  },
  {
    name: 'list_commits',
    description: 'List commits for a repository branch',
    inputSchema: {
      type: 'object',
      properties: {
        owner: { type: 'string' },
        repo: { type: 'string' },
        branch: { type: 'string' },
      },
      required: ['owner', 'repo'],
    },
  },
  {
    name: 'list_branches',
    description: 'List branches in a repository',
    inputSchema: {
      type: 'object',
      properties: { owner: { type: 'string' }, repo: { type: 'string' } },
      required: ['owner', 'repo'],
    },
  },
  {
    name: 'list_workflow_runs',
    description: 'List GitHub Actions workflow runs',
    inputSchema: {
      type: 'object',
      properties: { owner: { type: 'string' }, repo: { type: 'string' } },
      required: ['owner', 'repo'],
    },
  },
  {
    name: 'search_code',
    description: 'Search code across GitHub',
    inputSchema: {
      type: 'object',
      properties: { query: { type: 'string' } },
      required: ['query'],
    },
  },
];
