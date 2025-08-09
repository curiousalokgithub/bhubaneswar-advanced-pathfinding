// Error handling middleware for the API
const errorHandler = (err, req, res, next) => {
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    timestamp: new Date().toISOString()
  });

  // Default error
  let error = {
    success: false,
    message: 'Internal Server Error',
    statusCode: 500
  };

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    error.message = 'Resource not found';
    error.statusCode = 404;
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    error.message = 'Duplicate field value entered';
    error.statusCode = 400;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    error.message = Object.values(err.errors).map(val => val.message).join(', ');
    error.statusCode = 400;
  }

  // JSON parse error
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    error.message = 'Invalid JSON syntax';
    error.statusCode = 400;
  }

  // Rate limit error
  if (err.statusCode === 429) {
    error.message = 'Too many requests';
    error.statusCode = 429;
  }

  res.status(error.statusCode).json({
    success: false,
    error: error.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    timestamp: new Date().toISOString(),
    requestId: req.headers['x-request-id'] || 'unknown'
  });
};

// 404 handler
const notFound = (req, res, next) => {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
    availableRoutes: {
      routes: '/api/routes',
      locations: '/api/locations',
      health: '/api/health'
    },
    timestamp: new Date().toISOString()
  });
};

// Request logging middleware
const requestLogger = (req, res, next) => {
  const startTime = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    console.log(`${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms - ${req.ip}`);
  });
  
  next();
};

// Async error wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  errorHandler,
  notFound,
  requestLogger,
  asyncHandler
};
