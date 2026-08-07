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
};
