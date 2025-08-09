const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

// Import middleware
const { createRateLimiters } = require('./middleware/rateLimiting');
const { errorHandler, notFound, requestLogger } = require('./middleware/errorHandler');

// Import routes
const routesRouter = require('./routes/routes');
const locationsRouter = require('./routes/locations');

const app = express();
const PORT = process.env.PORT || 5000;

// Rate limiters
const rateLimiters = createRateLimiters();

// Trust proxy for rate limiting
app.set('trust proxy', 1);

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001', 
      'http://localhost:3002',
      'http://localhost:3005',
      'http://localhost:5173',
      'https://your-frontend-domain.com',
      process.env.FRONTEND_URL
    ].filter(Boolean);
    
    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from views directory
app.use(express.static(path.join(__dirname, 'views')));

// Set view engine
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}
app.use(requestLogger);

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Apply rate limiting
app.use('/api/routes', rateLimiters.routes);
app.use('/api/locations/search', rateLimiters.search);
app.use('/api/locations', rateLimiters.locations);
app.use('/api', rateLimiters.general);

// API Routes
app.use('/api/routes', routesRouter);
app.use('/api/locations', locationsRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Bhubaneswar Pathfinding API is running',
    timestamp: new Date().toISOString(),
    version: process.env.API_VERSION || '2.0.0',
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    frontendUrl: process.env.FRONTEND_URL || null,
    services: {
      routes: 'operational',
      locations: 'operational'
    }
  });
});

// Root endpoint with HTML view
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// API documentation endpoint (JSON)
app.get('/api', (req, res) => {
  res.json({
    message: 'Bhubaneswar Advanced Pathfinding API',
    version: process.env.API_VERSION || '2.0.0',
    description: 'Real-time route calculation and location services for Bhubaneswar',
    endpoints: {
      health: {
        url: '/api/health',
        method: 'GET',
        description: 'API health status'
      },
      routes: {
        url: '/api/routes',
        methods: ['POST'],
        description: 'Route calculation and pricing services',
        endpoints: {
          calculateRoute: 'POST /api/routes/calculate-route',
          getPricing: 'POST /api/routes/get-pricing'
        }
      },
      locations: {
        url: '/api/locations',
        methods: ['GET', 'POST'],
        description: 'Location search and discovery services',
        endpoints: {
          getAllLocations: 'GET /api/locations/locations',
          getLocationById: 'GET /api/locations/locations/:id',
          getCategories: 'GET /api/locations/categories',
          findNearby: 'POST /api/locations/locations/nearby',
          search: 'POST /api/locations/search'
        }
      }
    },
    documentation: 'https://github.com/curiousalokgithub/bhubaneswar-advanced-pathfinding',
    frontend: process.env.FRONTEND_URL || 'Not configured',
    rateLimit: {
      general: '100 requests per 15 minutes',
      routes: '30 requests per minute',
      search: '20 requests per minute',
      locations: '50 requests per 5 minutes'
    }
  });
});

// 404 handler
app.use('*', notFound);

// Error handling middleware (must be last)
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated');
  });
});

const server = app.listen(PORT, () => {
  console.log(`🚀 Bhubaneswar Pathfinding API v${process.env.API_VERSION || '2.0.0'} running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🗺️  Routes API: http://localhost:${PORT}/api/routes`);
  console.log(`📍 Locations API: http://localhost:${PORT}/api/locations`);
  console.log(`📚 Documentation: http://localhost:${PORT}/`);
});
