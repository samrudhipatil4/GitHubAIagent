import axios from 'axios';
import { AppError } from '../../utils/AppError.js';

const GITHUB_API = 'https://api.github.com';

export const createGitHubClient = (accessToken) => {
  return axios.create({
    baseURL: GITHUB_API,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/vnd.github+json',
    },
  });
};

export const handleGitHubError = (error) => {
  if (error instanceof AppError) throw error;

  if (error.response) {
    const { status, headers, data } = error.response;

    if (status === 403 && headers['x-ratelimit-remaining'] === '0') {
      throw new AppError('GitHub API rate limit exceeded. Try again later.', 429);
    }
    if (status === 404) {
      throw new AppError(data?.message || 'Resource not found', 404);
    }
    if (status === 401) {
      throw new AppError('GitHub token expired or invalid. Please login again.', 401);
    }

    throw new AppError(data?.message || 'GitHub API request failed', status);
  }

  throw new AppError('Failed to connect to GitHub API', 502);
};

export const githubRequest = async (accessToken, requestFn) => {
  try {
    const client = createGitHubClient(accessToken);
    return await requestFn(client);
  } catch (error) {
    handleGitHubError(error);
  }
};
