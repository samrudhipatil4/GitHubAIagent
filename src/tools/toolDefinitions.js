import { SchemaType } from '@google/generative-ai';

export const toolDeclarations = [
  {
    name: 'getRepositories',
    description: 'List repositories for the authenticated user',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        page: { type: SchemaType.NUMBER, description: 'Page number (default 1)' },
      },
    },
  },
  {
    name: 'getRepository',
    description: 'Get details of a specific repository',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        owner: { type: SchemaType.STRING, description: 'Repository owner' },
        repo: { type: SchemaType.STRING, description: 'Repository name' },
      },
      required: ['owner', 'repo'],
    },
  },
  {
    name: 'searchRepository',
    description: 'Search GitHub repositories by keyword',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        query: { type: SchemaType.STRING, description: 'Search query' },
      },
      required: ['query'],
    },
  },
  {
    name: 'getUserProfile',
    description: 'Get the authenticated GitHub user profile',
    parameters: { type: SchemaType.OBJECT, properties: {} },
  },
  {
    name: 'getPullRequests',
    description: 'List pull requests for a repository',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        owner: { type: SchemaType.STRING },
        repo: { type: SchemaType.STRING },
        state: { type: SchemaType.STRING, description: 'open, closed, or all' },
      },
      required: ['owner', 'repo'],
    },
  },
  {
    name: 'mergePullRequest',
    description: 'Merge a pull request',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        owner: { type: SchemaType.STRING },
        repo: { type: SchemaType.STRING },
        number: { type: SchemaType.NUMBER, description: 'PR number' },
      },
      required: ['owner', 'repo', 'number'],
    },
  },
  {
    name: 'getIssues',
    description: 'List issues for a repository (excludes pull requests)',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        owner: { type: SchemaType.STRING },
        repo: { type: SchemaType.STRING },
        state: { type: SchemaType.STRING, description: 'open, closed, or all' },
      },
      required: ['owner', 'repo'],
    },
  },
  {
    name: 'createIssue',
    description: 'Create a new issue in a repository',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        owner: { type: SchemaType.STRING },
        repo: { type: SchemaType.STRING },
        title: { type: SchemaType.STRING },
        body: { type: SchemaType.STRING },
        labels: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
      },
      required: ['owner', 'repo', 'title'],
    },
  },
  {
    name: 'updateIssue',
    description: 'Update an existing issue',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        owner: { type: SchemaType.STRING },
        repo: { type: SchemaType.STRING },
        number: { type: SchemaType.NUMBER },
        title: { type: SchemaType.STRING },
        body: { type: SchemaType.STRING },
      },
      required: ['owner', 'repo', 'number'],
    },
  },
  {
    name: 'closeIssue',
    description: 'Close an issue',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        owner: { type: SchemaType.STRING },
        repo: { type: SchemaType.STRING },
        number: { type: SchemaType.NUMBER },
      },
      required: ['owner', 'repo', 'number'],
    },
  },
  {
    name: 'searchIssues',
    description: 'Search issues across GitHub',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        query: { type: SchemaType.STRING, description: 'GitHub issue search query' },
      },
      required: ['query'],
    },
  },
  {
    name: 'getCommits',
    description: 'List commits for a repository branch',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        owner: { type: SchemaType.STRING },
        repo: { type: SchemaType.STRING },
        branch: { type: SchemaType.STRING, description: 'Branch name (optional)' },
      },
      required: ['owner', 'repo'],
    },
  },
  {
    name: 'listBranches',
    description: 'List branches in a repository',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        owner: { type: SchemaType.STRING },
        repo: { type: SchemaType.STRING },
      },
      required: ['owner', 'repo'],
    },
  },
  {
    name: 'createBranch',
    description: 'Create a new branch from an existing branch',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        owner: { type: SchemaType.STRING },
        repo: { type: SchemaType.STRING },
        name: { type: SchemaType.STRING, description: 'New branch name' },
        fromBranch: { type: SchemaType.STRING, description: 'Base branch name' },
      },
      required: ['owner', 'repo', 'name', 'fromBranch'],
    },
  },
  {
    name: 'deleteBranch',
    description: 'Delete a branch',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        owner: { type: SchemaType.STRING },
        repo: { type: SchemaType.STRING },
        branch: { type: SchemaType.STRING },
      },
      required: ['owner', 'repo', 'branch'],
    },
  },
  {
    name: 'listWorkflowRuns',
    description: 'List GitHub Actions workflow runs for a repository',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        owner: { type: SchemaType.STRING },
        repo: { type: SchemaType.STRING },
      },
      required: ['owner', 'repo'],
    },
  },
  {
    name: 'searchCode',
    description: 'Search code across GitHub',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        query: { type: SchemaType.STRING, description: 'Code search query' },
      },
      required: ['query'],
    },
  },
];
