export const toolLabels = {
  getRepositories: 'Fetching repositories',
  getRepository: 'Fetching repository details',
  searchRepository: 'Searching repositories',
  getUserProfile: 'Fetching user profile',
  getPullRequests: 'Fetching pull requests',
  mergePullRequest: 'Merging pull request',
  getIssues: 'Fetching issues',
  createIssue: 'Creating issue',
  updateIssue: 'Updating issue',
  closeIssue: 'Closing issue',
  searchIssues: 'Searching issues',
  getCommits: 'Fetching commits',
  listBranches: 'Fetching branches',
  createBranch: 'Creating branch',
  deleteBranch: 'Deleting branch',
  listWorkflowRuns: 'Fetching workflow runs',
  searchCode: 'Searching code',
};

export const getToolDisplayName = (name) => toolLabels[name] || name;
