const rateLimit = require('express-rate-limit');

// FAIRNESS MECHANISM #1: Rate Limiting
// Prevents abuse by limiting requests per IP address
// This ensures fair access and prevents spam/DOS attacks

const createLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs, // Time window in milliseconds
    max, // Max requests per windowMs
    message,
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    skip: (req) => {
      // Skip rate limiting for health checks
      return req.path === '/api/health';
    },
    keyGenerator: (req, res) => {
      // Use IP address as the key for rate limiting
      return req.ip || req.socket.remoteAddress;
    }
  });
};

// General API rate limiter: 100 requests per 15 minutes per IP
const apiLimiter = createLimiter(
  15 * 60 * 1000,
  100,
  'Too many requests from this IP, please try again later.'
);

// Strict limiter for feedback submission: 10 requests per hour per IP
const feedbackLimiter = createLimiter(
  60 * 60 * 1000,
  10,
  'Too many feedback submissions. Please try again later.'
);

// Strict limiter for authentication: 5 attempts per 15 minutes per IP
const authLimiter = createLimiter(
  15 * 60 * 1000,
  5,
  'Too many login attempts, please try again later.'
);

// Moderate limiter for voting/rating: 20 per hour per IP
const votingLimiter = createLimiter(
  60 * 60 * 1000,
  20,
  'Too many votes submitted. Please try again later.'
);

module.exports = {
  apiLimiter,
  feedbackLimiter,
  authLimiter,
  votingLimiter
};
