import axios from 'axios';
import crypto from 'crypto';
import { env } from '../../config/env.js';
import { AppError } from '../../utils/AppError.js';

const GITHUB_AUTH_URL = 'https://github.com/login/oauth/authorize';
const GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token';
const GITHUB_API_URL = 'https://api.github.com';

const SCOPES = ['read:user', 'user:email', 'repo'];

export const generateState = () => crypto.randomBytes(16).toString('hex');

export const getAuthorizationUrl = (state) => {
  if (!env.GITHUB_CLIENT_ID) {
    throw new AppError('GitHub OAuth is not configured. Set GITHUB_CLIENT_ID.', 503);
  }

  const params = new URLSearchParams({
    client_id: env.GITHUB_CLIENT_ID,
    redirect_uri: env.GITHUB_CALLBACK_URL,
    scope: SCOPES.join(' '),
    state,
  });

  return `${GITHUB_AUTH_URL}?${params.toString()}`;
};

export const exchangeCodeForToken = async (code) => {
  if (!env.GITHUB_CLIENT_ID || !env.GITHUB_CLIENT_SECRET) {
    throw new AppError('GitHub OAuth is not configured.', 503);
  }

  try {
    const response = await axios.post(
      GITHUB_TOKEN_URL,
      {
        client_id: env.GITHUB_CLIENT_ID,
        client_secret: env.GITHUB_CLIENT_SECRET,
        code,
      },
      {
        headers: { Accept: 'application/json' },
      }
    );

    if (response.data.error) {
      throw new AppError(response.data.error_description || 'OAuth token exchange failed', 401);
    }

    return response.data.access_token;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to exchange authorization code', 502);
  }
};

export const getUserProfile = async (accessToken) => {
  try {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/vnd.github+json',
    };

    const [userResponse, emailResponse] = await Promise.all([
      axios.get(`${GITHUB_API_URL}/user`, { headers }),
      axios.get(`${GITHUB_API_URL}/user/emails`, { headers }),
    ]);

    const user = userResponse.data;
    const primaryEmail = emailResponse.data.find((e) => e.primary)?.email || user.email;

    return {
      id: user.id,
      login: user.login,
      name: user.name,
      email: primaryEmail,
      avatarUrl: user.avatar_url,
      profileUrl: user.html_url,
      bio: user.bio,
      publicRepos: user.public_repos,
      followers: user.followers,
      following: user.following,
    };
  } catch {
    throw new AppError('Failed to fetch GitHub user profile', 502);
  }
};
