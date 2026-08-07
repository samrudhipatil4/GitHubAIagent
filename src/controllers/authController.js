import {
  generateState,
  getAuthorizationUrl,
  exchangeCodeForToken,
  getUserProfile,
} from '../services/auth/githubOAuthService.js';
import { successResponse } from '../utils/apiResponse.js';
import { AppError } from '../utils/AppError.js';
import { env } from '../config/env.js';

export const githubLogin = (req, res, next) => {
  try {
    const state = generateState();
    req.session.oauthState = state;
    const url = getAuthorizationUrl(state);
    res.redirect(url);
  } catch (error) {
    next(error);
  }
};

export const githubCallback = async (req, res, next) => {
  try {
    const { code, state, error, error_description: errorDescription } = req.query;

    if (error) {
      const message = encodeURIComponent(errorDescription || error);
      return res.redirect(`${env.CLIENT_URL}/?error=${message}`);
    }

    if (!code) {
      throw new AppError('Authorization code missing', 400);
    }

    if (!state || state !== req.session.oauthState) {
      throw new AppError('Invalid OAuth state', 403);
    }

    delete req.session.oauthState;

    const accessToken = await exchangeCodeForToken(code);
    const user = await getUserProfile(accessToken);

    req.session.accessToken = accessToken;
    req.session.user = user;

    res.redirect(`${env.CLIENT_URL}/dashboard`);
  } catch (error) {
    const message = encodeURIComponent(error.message || 'Authentication failed');
    res.redirect(`${env.CLIENT_URL}/?error=${message}`);
  }
};

export const getProfile = (req, res) => {
  return successResponse(res, 'Profile retrieved successfully', {
    user: req.session.user,
    connected: true,
  });
};

export const logout = (req, res, next) => {
  if (!req.session) {
    return successResponse(res, 'Logged out successfully');
  }

  req.session.destroy((err) => {
    if (err) return next(new AppError('Failed to logout', 500));
    res.clearCookie('connect.sid');
    return successResponse(res, 'Logged out successfully');
  });
};
