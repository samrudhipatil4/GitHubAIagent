import { errorResponse } from '../utils/apiResponse.js';
import { env } from '../config/env.js';

export const errorHandler = (err, _req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const message =
    err.isOperational || !env.isProduction
      ? err.message
      : 'Internal server error';

  if (!err.isOperational) {
    console.error('Unhandled error:', err);
  }

  return errorResponse(res, message, statusCode);
};
