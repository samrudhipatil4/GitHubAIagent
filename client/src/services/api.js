const API_BASE = '/api/v1';

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include',
    ...options,
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    const error = new Error(data.message || 'Request failed');
    error.status = response.status;
    throw error;
  }

  return data;
}

export const api = {
  health: () => request('/health'),

  getProfile: () => request('/auth/profile'),

  logout: () => request('/auth/logout', { method: 'POST' }),

  loginUrl: `${API_BASE}/auth/github`,

  getRepositories: (page = 1) => request(`/repos?page=${page}`),

  searchRepositories: (query, page = 1) =>
    request(`/repos/search?q=${encodeURIComponent(query)}&page=${page}`),

  getRepository: (owner, repo) => request(`/repos/${owner}/${repo}`),

  getRepositoryStats: (owner, repo) => request(`/repos/${owner}/${repo}/stats`),

  getRepositoryContributors: (owner, repo) =>
    request(`/repos/${owner}/${repo}/contributors`),

  getPullRequests: (owner, repo, state = 'open', page = 1) =>
    request(`/repos/${owner}/${repo}/pulls?state=${state}&page=${page}`),

  getPullRequest: (owner, repo, number) =>
    request(`/repos/${owner}/${repo}/pulls/${number}`),

  getPullRequestFiles: (owner, repo, number) =>
    request(`/repos/${owner}/${repo}/pulls/${number}/files`),

  getPullRequestComments: (owner, repo, number) =>
    request(`/repos/${owner}/${repo}/pulls/${number}/comments`),

  mergePullRequest: (owner, repo, number, body = {}) =>
    request(`/repos/${owner}/${repo}/pulls/${number}/merge`, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),

  getIssues: (owner, repo, state = 'open', page = 1) =>
    request(`/repos/${owner}/${repo}/issues?state=${state}&page=${page}`),

  getIssue: (owner, repo, number) =>
    request(`/repos/${owner}/${repo}/issues/${number}`),

  getIssueLabels: (owner, repo) =>
    request(`/repos/${owner}/${repo}/issues/labels`),

  getIssueCollaborators: (owner, repo) =>
    request(`/repos/${owner}/${repo}/issues/collaborators`),

  createIssue: (owner, repo, body) =>
    request(`/repos/${owner}/${repo}/issues`, {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  updateIssue: (owner, repo, number, body) =>
    request(`/repos/${owner}/${repo}/issues/${number}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),

  closeIssue: (owner, repo, number) =>
    request(`/repos/${owner}/${repo}/issues/${number}/close`, {
      method: 'POST',
    }),

  addIssueComment: (owner, repo, number, body) =>
    request(`/repos/${owner}/${repo}/issues/${number}/comments`, {
      method: 'POST',
      body: JSON.stringify({ body }),
    }),

  getCommits: (owner, repo, sha, page = 1) => {
    const params = new URLSearchParams({ page });
    if (sha) params.set('sha', sha);
    return request(`/repos/${owner}/${repo}/commits?${params}`);
  },

  getCommit: (owner, repo, sha) =>
    request(`/repos/${owner}/${repo}/commits/${sha}`),

  getBranches: (owner, repo) =>
    request(`/repos/${owner}/${repo}/branches`),

  createBranch: (owner, repo, body) =>
    request(`/repos/${owner}/${repo}/branches`, {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  deleteBranch: (owner, repo, branch) =>
    request(`/repos/${owner}/${repo}/branches/${encodeURIComponent(branch)}`, {
      method: 'DELETE',
    }),

  compareBranches: (owner, repo, base, head) =>
    request(`/repos/${owner}/${repo}/compare?base=${encodeURIComponent(base)}&head=${encodeURIComponent(head)}`),

  sendChatMessage: (message, conversationId) =>
    request('/chat', {
      method: 'POST',
      body: JSON.stringify({ message, conversationId }),
    }),

  getChatHistory: (conversationId) => {
    const query = conversationId ? `?conversationId=${conversationId}` : '';
    return request(`/chat/history${query}`);
  },

  reviewPullRequest: (owner, repo, number) =>
    request(`/repos/${owner}/${repo}/pulls/${number}/review`, { method: 'POST' }),

  getPullRequestReview: (owner, repo, number) =>
    request(`/repos/${owner}/${repo}/pulls/${number}/review`),

  getRepositoryInsights: (owner, repo) =>
    request(`/repos/${owner}/${repo}/insights`),

  explainRepository: (owner, repo) =>
    request(`/repos/${owner}/${repo}/insights/explain`),

  generateReadme: (owner, repo) =>
    request(`/repos/${owner}/${repo}/insights/readme`, { method: 'POST' }),

  explainStructure: (owner, repo) =>
    request(`/repos/${owner}/${repo}/insights/structure`),

  explainPackageJson: (owner, repo) =>
    request(`/repos/${owner}/${repo}/insights/package-json`),

  explainDockerfile: (owner, repo) =>
    request(`/repos/${owner}/${repo}/insights/dockerfile`),

  getDashboardStats: () => request('/dashboard/stats'),

  getPreferences: () => request('/memory/preferences'),

  updatePreferences: (body) =>
    request('/memory/preferences', { method: 'PUT', body: JSON.stringify(body) }),

  getActivity: () => request('/memory/activity'),

  getMcpTools: () => request('/mcp/tools'),

  getWorkflowRuns: (owner, repo) =>
    request(`/repos/${owner}/${repo}/actions/runs`),

  getFailedWorkflowRuns: (owner, repo) =>
    request(`/repos/${owner}/${repo}/actions/runs/failed`),

  getLatestDeployment: (owner, repo) =>
    request(`/repos/${owner}/${repo}/actions/deployment`),

  rerunWorkflow: (owner, repo, runId) =>
    request(`/repos/${owner}/${repo}/actions/runs/${runId}/rerun`, { method: 'POST' }),

  explainWorkflowFailure: (owner, repo, runId) =>
    request(`/repos/${owner}/${repo}/actions/runs/${runId}/explain`),
};
