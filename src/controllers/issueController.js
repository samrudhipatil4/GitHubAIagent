import {
  getIssues,
  getIssue,
  getIssueComments,
  getLabels,
  getCollaborators,
  createIssue,
  updateIssue,
  closeIssue,
  addComment,
} from '../services/github/issueService.js';
import { successResponse } from '../utils/apiResponse.js';
import { AppError } from '../utils/AppError.js';

export const listIssues = async (req, res, next) => {
  try {
    const { owner, repo } = req.params;
    const state = req.query.state || 'open';
    const page = parseInt(req.query.page, 10) || 1;

    if (!['open', 'closed', 'all'].includes(state)) {
      throw new AppError('State must be open, closed, or all', 400);
    }

    const issues = await getIssues(req.accessToken, owner, repo, { state, page });
    return successResponse(res, 'Issues retrieved successfully', {
      issues,
      owner,
      repo,
      state,
      page,
    });
  } catch (error) {
    next(error);
  }
};

export const getIssueDetails = async (req, res, next) => {
  try {
    const { owner, repo, number } = req.params;
    const [issue, comments] = await Promise.all([
      getIssue(req.accessToken, owner, repo, number),
      getIssueComments(req.accessToken, owner, repo, number),
    ]);

    return successResponse(res, 'Issue retrieved successfully', { issue, comments });
  } catch (error) {
    next(error);
  }
};

export const listLabels = async (req, res, next) => {
  try {
    const { owner, repo } = req.params;
    const labels = await getLabels(req.accessToken, owner, repo);
    return successResponse(res, 'Labels retrieved successfully', { labels });
  } catch (error) {
    next(error);
  }
};

export const listCollaborators = async (req, res, next) => {
  try {
    const { owner, repo } = req.params;
    const collaborators = await getCollaborators(req.accessToken, owner, repo);
    return successResponse(res, 'Collaborators retrieved successfully', { collaborators });
  } catch (error) {
    next(error);
  }
};

export const createIssueHandler = async (req, res, next) => {
  try {
    const { owner, repo } = req.params;
    const { title, body, labels, assignees } = req.body;

    if (!title?.trim()) {
      throw new AppError('Issue title is required', 400);
    }

    const issue = await createIssue(req.accessToken, owner, repo, {
      title: title.trim(),
      body: body?.trim() || '',
      labels,
      assignees,
    });

    return successResponse(res, 'Issue created successfully', { issue }, 201);
  } catch (error) {
    next(error);
  }
};

export const updateIssueHandler = async (req, res, next) => {
  try {
    const { owner, repo, number } = req.params;
    const { title, body, labels, assignees } = req.body;

    const issue = await updateIssue(req.accessToken, owner, repo, number, {
      title,
      body,
      labels,
      assignees,
    });

    return successResponse(res, 'Issue updated successfully', { issue });
  } catch (error) {
    next(error);
  }
};

export const closeIssueHandler = async (req, res, next) => {
  try {
    const { owner, repo, number } = req.params;
    const issue = await closeIssue(req.accessToken, owner, repo, number);
    return successResponse(res, 'Issue closed successfully', { issue });
  } catch (error) {
    next(error);
  }
};

export const addCommentHandler = async (req, res, next) => {
  try {
    const { owner, repo, number } = req.params;
    const { body } = req.body;

    if (!body?.trim()) {
      throw new AppError('Comment body is required', 400);
    }

    const comment = await addComment(req.accessToken, owner, repo, number, body.trim());
    return successResponse(res, 'Comment added successfully', { comment }, 201);
  } catch (error) {
    next(error);
  }
};
