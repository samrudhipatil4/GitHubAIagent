import { reviewPullRequest, getCachedReview } from '../services/ai/codeReviewService.js';
import { successResponse } from '../utils/apiResponse.js';
import { AppError } from '../utils/AppError.js';

export const createReview = async (req, res, next) => {
  try {
    const { owner, repo, number } = req.params;
    const review = await reviewPullRequest(req.accessToken, owner, repo, number);
    return successResponse(res, 'Code review completed', { review });
  } catch (error) {
    next(error);
  }
};

export const getReview = (req, res, next) => {
  try {
    const { owner, repo, number } = req.params;
    const review = getCachedReview(owner, repo, number);

    if (!review) {
      throw new AppError('No review found. Run POST to generate a review first.', 404);
    }

    return successResponse(res, 'Review retrieved', { review });
  } catch (error) {
    next(error);
  }
};
