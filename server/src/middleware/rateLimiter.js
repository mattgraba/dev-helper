import rateLimit from 'express-rate-limit';

// Rate limiter for AI endpoints - prevents abuse and helps stay within OpenAI limits
// Limits: 20 requests per minute per IP (adjust based on your OpenAI tier)
export const aiRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: 20, // 20 requests per window
  message: {
    error: 'Too many requests. Please wait a moment before trying again.',
    retryAfter: 60,
  },
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false,
  // Use user ID if authenticated, otherwise fall back to IP
  keyGenerator: (req) => {
    // If user is authenticated, use their ID (bypasses IP-based concerns)
    if (req.user?.id) {
      return `user_${req.user.id}`;
    }
    // For unauthenticated requests, use IP
    return `ip_${req.ip}`;
  },
  // Disable IPv6 validation - we use prefixed keys and user IDs primarily
  validate: { keyGeneratorIpFallback: false },
});

// Stricter limiter for auth routes to prevent brute force
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts per 15 minutes
  message: {
    error: 'Too many login attempts. Please try again later.',
    retryAfter: 900,
  },
  standardHeaders: true,
  legacyHeaders: false,
});
