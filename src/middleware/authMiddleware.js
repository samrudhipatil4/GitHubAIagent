import { AppError } from '../utils/AppError.js';

export const requireAuth = (req, _res, next) => {
  if (!req.session?.user) {
    return next(new AppError('Authentication required', 401));
  }
  next();
};

export const attachAccessToken = (req, _res, next) => {
  if (!req.session?.accessToken) {
    return next(new AppError('GitHub access token missing. Please login again.', 401));
  }
  req.accessToken = req.session.accessToken;
  next();
};
