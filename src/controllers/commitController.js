import { getCommits, getCommit, compareCommits } from '../services/github/commitService.js';
import { successResponse } from '../utils/apiResponse.js';
import { AppError } from '../utils/AppError.js';

export const listCommits = async (req, res, next) => {
  try {
    const { owner, repo } = req.params;
    const { sha } = req.query;
    const page = parseInt(req.query.page, 10) || 1;

    const commits = await getCommits(req.accessToken, owner, repo, { sha, page });
    return successResponse(res, 'Commits retrieved successfully', {
      commits,
      owner,
      repo,
      branch: sha || 'default',
      page,
    });
  } catch (error) {
    next(error);
  }
};

export const getCommitDetails = async (req, res, next) => {
  try {
    const { owner, repo, sha } = req.params;
    const commit = await getCommit(req.accessToken, owner, repo, sha);
    return successResponse(res, 'Commit retrieved successfully', { commit });
  } catch (error) {
    next(error);
  }
};

export const compareBranches = async (req, res, next) => {
  try {
    const { owner, repo } = req.params;
    const { base, head } = req.query;

    if (!base || !head) {
      throw new AppError('Both base and head query parameters are required', 400);
    }

    const comparison = await compareCommits(req.accessToken, owner, repo, base, head);
    return successResponse(res, 'Comparison retrieved successfully', { comparison, base, head });
  } catch (error) {
    next(error);
  }
};
