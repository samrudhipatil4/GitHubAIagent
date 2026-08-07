import { successResponse } from '../utils/apiResponse.js';
import { env } from '../config/env.js';

export const healthCheck = (_req, res) => {
  return successResponse(res, 'Server is healthy', {
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
    appName: env.APP_NAME,
  });
};
