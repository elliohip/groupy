import rateLimit from 'express-rate-limit';

const rateLimiterUsingThirdParty = rateLimit({
  windowMs: 30 * 1000,
  max: 30,
  message: 'You have exceeded the 30 requests in 30s limit!', 
  standardHeaders: true,
  legacyHeaders: false,
});

export default rateLimiterUsingThirdParty;