import rateLimit from 'express-rate-limit'

// Limit the number of requests to the API to prevent abuse
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  standardHeaders: true, // send RateLimit-* and Retry-After headers
  legacyHeaders: false, // disable the older X-RateLimit-* headers
  message: 'Too many requests from this IP, please try again later.',
  skip: () => process.env.NODE_ENV === 'development', // Skip rate limiting in non-production
})

export default apiLimiter
