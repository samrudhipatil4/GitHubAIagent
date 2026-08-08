import { githubRequest } from '../services/github/githubClient.js';
import { getRepositories, getRepository, searchRepositories } from '../services/github/repositoryService.js';
import { getPullRequests, mergePullRequest } from '../services/github/pullRequestService.js';
import { getIssues, createIssue, updateIssue, closeIssue } from '../services/github/issueService.js';
import { getCommits } from '../services/github/commitService.js';
import { listBranches, createBranch, deleteBranch } from '../services/github/branchService.js';
import { getUserProfile } from '../services/auth/githubOAuthService.js';

export const listWorkflowRuns = async (accessToken, owner, repo) => {
  const { data } = await githubRequest(accessToken, (client) =>
    client.get(`/repos/${owner}/${repo}/actions/runs`, { params: { per_page: 10 } })
  );

  return data.workflow_runs.map((run) => ({
    id: run.id,
    name: run.name,
    status: run.status,
    conclusion: run.conclusion,
    branch: run.head_branch,
    event: run.event,
    createdAt: run.created_at,
    htmlUrl: run.html_url,
  }));
};

export const searchIssues = async (accessToken, query) => {
  const { data } = await githubRequest(accessToken, (client) =>
    client.get('/search/issues', { params: { q: query, per_page: 10 } })
  );

  return {
    totalCount: data.total_count,
    items: data.items.map((item) => ({
      number: item.number,
      title: item.title,
      state: item.state,
      htmlUrl: item.html_url,
      repository: item.repository_url.split('/repos/')[1],
    })),
  };
};

export const searchCode = async (accessToken, query) => {
  const { data } = await githubRequest(accessToken, (client) =>
    client.get('/search/code', { params: { q: query, per_page: 10 } })
  );

  return {
    totalCount: data.total_count,
    items: data.items.map((item) => ({
      name: item.name,
      path: item.path,
      repository: item.repository.full_name,
      htmlUrl: item.html_url,
    })),
  };
};

export const toolHandlers = {
  getRepositories: async (args, token) => getRepositories(token, { page: args.page || 1 }),

  getRepository: async (args, token) => getRepository(token, args.owner, args.repo),

  searchRepository: async (args, token) => searchRepositories(token, args.query),

  getUserProfile: async (_args, token) => getUserProfile(token),

  getPullRequests: async (args, token) =>
    getPullRequests(token, args.owner, args.repo, { state: args.state || 'open' }),

  mergePullRequest: async (args, token) =>
    mergePullRequest(token, args.owner, args.repo, args.number),

  getIssues: async (args, token) =>
    getIssues(token, args.owner, args.repo, { state: args.state || 'open' }),

  createIssue: async (args, token) =>
    createIssue(token, args.owner, args.repo, {
      title: args.title,
      body: args.body || '',
      labels: args.labels,
    }),

  updateIssue: async (args, token) =>
    updateIssue(token, args.owner, args.repo, args.number, {
      title: args.title,
      body: args.body,
    }),

  closeIssue: async (args, token) => closeIssue(token, args.owner, args.repo, args.number),

  searchIssues: async (args, token) => searchIssues(token, args.query),

  getCommits: async (args, token) =>
    getCommits(token, args.owner, args.repo, { sha: args.branch }),

  listBranches: async (args, token) => listBranches(token, args.owner, args.repo),

  createBranch: async (args, token) => {
    const branches = await listBranches(token, args.owner, args.repo);
    const base = branches.find((b) => b.name === args.fromBranch);
    if (!base) throw new Error(`Base branch "${args.fromBranch}" not found`);
    return createBranch(token, args.owner, args.repo, args.name, base.sha);
  },

  deleteBranch: async (args, token) => deleteBranch(token, args.owner, args.repo, args.branch),

  listWorkflowRuns: async (args, token) => listWorkflowRuns(token, args.owner, args.repo),

  searchCode: async (args, token) => searchCode(token, args.query),
};
