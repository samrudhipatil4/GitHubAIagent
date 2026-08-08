import { toolHandlers } from './githubTools.js';
import { mcpClient } from '../mcp/mcpClient.js';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';

export const executeTool = async (name, args, accessToken) => {
  if (env.USE_MCP) {
    return mcpClient.callTool(name, args, accessToken);
  }

  const handler = toolHandlers[name];

  if (!handler) {
    throw new AppError(`Unknown tool: ${name}`, 400);
  }

  try {
    const result = await handler(args || {}, accessToken);
    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Tool execution failed',
    };
  }
};

export const getToolDisplayName = (name) => {
  const labels = {
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
  return labels[name] || `Running ${name}`;
};
