import { getDashboardStats } from '../services/github/dashboardService.js';
import { successResponse } from '../utils/apiResponse.js';

export const getStats = async (req, res, next) => {
  try {
    const login = req.session.user.login;
    const stats = await getDashboardStats(req.accessToken, login);
    return successResponse(res, 'Dashboard stats retrieved', { stats });
  } catch (error) {
    next(error);
  }
};
