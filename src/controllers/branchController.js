import {
  listBranches,
  getBranch,
  createBranch,
  deleteBranch,
} from '../services/github/branchService.js';
import { successResponse } from '../utils/apiResponse.js';
import { AppError } from '../utils/AppError.js';

export const listBranchesHandler = async (req, res, next) => {
  try {
    const { owner, repo } = req.params;
    const branches = await listBranches(req.accessToken, owner, repo);
    return successResponse(res, 'Branches retrieved successfully', { branches, owner, repo });
  } catch (error) {
    next(error);
  }
};

export const getBranchDetails = async (req, res, next) => {
  try {
    const { owner, repo, branch } = req.params;
    const branchData = await getBranch(req.accessToken, owner, repo, branch);
    return successResponse(res, 'Branch retrieved successfully', { branch: branchData });
  } catch (error) {
    next(error);
  }
};

export const createBranchHandler = async (req, res, next) => {
  try {
    const { owner, repo } = req.params;
    const { name, sha } = req.body;

    if (!name?.trim()) {
      throw new AppError('Branch name is required', 400);
    }

    const result = await createBranch(req.accessToken, owner, repo, name, sha);
    return successResponse(res, 'Branch created successfully', { branch: result }, 201);
  } catch (error) {
    next(error);
  }
};

export const deleteBranchHandler = async (req, res, next) => {
  try {
    const { owner, repo, branch } = req.params;
    const result = await deleteBranch(req.accessToken, owner, repo, branch);
    return successResponse(res, 'Branch deleted successfully', result);
  } catch (error) {
    next(error);
  }
};
