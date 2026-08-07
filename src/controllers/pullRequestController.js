import {
  getPullRequests,
  getPullRequest,
  getPullRequestFiles,
  getPullRequestComments,
  mergePullRequest,
} from '../services/github/pullRequestService.js';
import { successResponse } from '../utils/apiResponse.js';
import { AppError } from '../utils/AppError.js';

export const listPullRequests = async (req, res, next) => {
  try {
    const { owner, repo } = req.params;
    const state = req.query.state || 'open';
    const page = parseInt(req.query.page, 10) || 1;

    if (!['open', 'closed', 'all'].includes(state)) {
      throw new AppError('State must be open, closed, or all', 400);
    }

    const pullRequests = await getPullRequests(req.accessToken, owner, repo, { state, page });
    return successResponse(res, 'Pull requests retrieved successfully', {
      pullRequests,
      owner,
      repo,
      state,
      page,
    });
  } catch (error) {
    next(error);
  }
};

export const getPullRequestDetails = async (req, res, next) => {
  try {
    const { owner, repo, number } = req.params;
    const pullRequest = await getPullRequest(req.accessToken, owner, repo, number);
    return successResponse(res, 'Pull request retrieved successfully', { pullRequest });
  } catch (error) {
    next(error);
  }
};

export const getPullRequestFilesList = async (req, res, next) => {
  try {
    const { owner, repo, number } = req.params;
    const files = await getPullRequestFiles(req.accessToken, owner, repo, number);
    return successResponse(res, 'Pull request files retrieved successfully', { files });
  } catch (error) {
    next(error);
  }
};

export const getPullRequestCommentsList = async (req, res, next) => {
  try {
    const { owner, repo, number } = req.params;
    const comments = await getPullRequestComments(req.accessToken, owner, repo, number);
    return successResponse(res, 'Pull request comments retrieved successfully', { comments });
  } catch (error) {
    next(error);
  }
};

export const mergePullRequestHandler = async (req, res, next) => {
  try {
    const { owner, repo, number } = req.params;
    const { commitTitle, commitMessage, mergeMethod } = req.body;

    const result = await mergePullRequest(req.accessToken, owner, repo, number, {
      commitTitle,
      commitMessage,
      mergeMethod,
    });

    return successResponse(res, result.message || 'Pull request merged successfully', { result });
  } catch (error) {
    next(error);
  }
};
