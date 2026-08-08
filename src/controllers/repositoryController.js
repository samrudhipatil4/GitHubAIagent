import {
  getRepositories,
  getRepository,
  searchRepositories,
  getRepositoryStats,
  getContributors,
} from '../services/github/repositoryService.js';
import { trackRepositoryAccess } from '../services/memory/memoryService.js';
import { successResponse } from '../utils/apiResponse.js';
import { AppError } from '../utils/AppError.js';

export const listRepositories = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const perPage = Math.min(parseInt(req.query.per_page, 10) || 30, 100);

    const repos = await getRepositories(req.accessToken, { page, perPage });
    return successResponse(res, 'Repositories retrieved successfully', {
      repositories: repos,
      page,
      perPage,
    });
  } catch (error) {
    next(error);
  }
};

export const searchRepos = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || !q.trim()) {
      throw new AppError('Search query is required', 400);
    }

    const page = parseInt(req.query.page, 10) || 1;
    const result = await searchRepositories(req.accessToken, q.trim(), { page });

    return successResponse(res, 'Search completed successfully', result);
  } catch (error) {
    next(error);
  }
};

export const getRepoDetails = async (req, res, next) => {
  try {
    const { owner, repo } = req.params;
    const repository = await getRepository(req.accessToken, owner, repo);
    trackRepositoryAccess(req.session.user.id, owner, repo);
    return successResponse(res, 'Repository retrieved successfully', { repository });
  } catch (error) {
    next(error);
  }
};

export const getRepoStats = async (req, res, next) => {
  try {
    const { owner, repo } = req.params;
    const stats = await getRepositoryStats(req.accessToken, owner, repo);
    return successResponse(res, 'Repository stats retrieved successfully', { stats });
  } catch (error) {
    next(error);
  }
};

export const getRepoContributors = async (req, res, next) => {
  try {
    const { owner, repo } = req.params;
    const contributors = await getContributors(req.accessToken, owner, repo);
    return successResponse(res, 'Contributors retrieved successfully', { contributors });
  } catch (error) {
    next(error);
  }
};
