const requestCounts = new Map();
const WINDOW_MS = 60 * 1000;

export const rateLimitMiddleware = (maxRequests = 100) => (req, res, next) => {
  const key = req.session?.user?.id || req.ip;
  const now = Date.now();

  if (!requestCounts.has(key)) {
    requestCounts.set(key, []);
  }

  const timestamps = requestCounts.get(key).filter((t) => now - t < WINDOW_MS);

  if (timestamps.length >= maxRequests) {
    return res.status(429).json({
      success: false,
      message: 'Too many requests. Please try again later.',
    });
  }

  timestamps.push(now);
  requestCounts.set(key, timestamps);
  next();
};
