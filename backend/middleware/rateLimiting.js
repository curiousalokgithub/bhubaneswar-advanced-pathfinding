// Rate limiting middleware for API protection
const rateLimitStore = new Map();

const rateLimit = (options = {}) => {
  const {
    windowMs = 15 * 60 * 1000, // 15 minutes
    maxRequests = 100,
    message = 'Too many requests from this IP, please try again later.',
    statusCode = 429,
    skipSuccessfulRequests = false,
    skipFailedRequests = false
  } = options;

  return (req, res, next) => {
    const clientIP = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
    const currentTime = Date.now();
    
    // Clean up old entries
    for (const [ip, data] of rateLimitStore.entries()) {
      if (currentTime - data.resetTime > windowMs) {
        rateLimitStore.delete(ip);
      }
    }

    // Get or create client data
    let clientData = rateLimitStore.get(clientIP);
    
    if (!clientData) {
      clientData = {
        count: 0,
        resetTime: currentTime + windowMs
      };
      rateLimitStore.set(clientIP, clientData);
    }

    // Reset if window expired
    if (currentTime > clientData.resetTime) {
      clientData.count = 0;
      clientData.resetTime = currentTime + windowMs;
    }

    // Check if limit exceeded
    if (clientData.count >= maxRequests) {
      const timeUntilReset = Math.round((clientData.resetTime - currentTime) / 1000);
      
      res.set({
        'X-RateLimit-Limit': maxRequests,
        'X-RateLimit-Remaining': 0,
        'X-RateLimit-Reset': new Date(clientData.resetTime).toISOString(),
        'Retry-After': timeUntilReset
      });

      return res.status(statusCode).json({
        success: false,
        error: 'Rate limit exceeded',
        message: message,
        retryAfter: timeUntilReset
      });
    }

    // Increment counter
    clientData.count++;

    // Set headers
    res.set({
      'X-RateLimit-Limit': maxRequests,
      'X-RateLimit-Remaining': maxRequests - clientData.count,
      'X-RateLimit-Reset': new Date(clientData.resetTime).toISOString()
    });

    next();
  };
};

// Specific rate limiters for different endpoints
const createRateLimiters = () => {
  return {
    general: rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 100,
      message: 'Too many requests, please try again later.'
    }),
    
    routes: rateLimit({
      windowMs: 1 * 60 * 1000, // 1 minute
      maxRequests: 30,
      message: 'Too many route calculations, please slow down.'
    }),
    
    search: rateLimit({
      windowMs: 1 * 60 * 1000, // 1 minute
      maxRequests: 20,
      message: 'Too many search requests, please try again soon.'
    }),
    
    locations: rateLimit({
      windowMs: 5 * 60 * 1000, // 5 minutes
      maxRequests: 50,
      message: 'Too many location requests, please try again later.'
    })
  };
};

module.exports = {
  rateLimit,
  createRateLimiters
};
