const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Import routes
const routesRouter = require('./routes/routes');
const locationsRouter = require('./routes/locations');

// Middleware
app.use(cors({
  origin: ['http://localhost:3005', 'http://localhost:5173', 'http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));

// Routes
app.use('/api/routes', routesRouter);
app.use('/api/locations', locationsRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Bhubaneswar Pathfinding API is running',
    timestamp: new Date().toISOString(),
    version: '2.0.0'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Bhubaneswar Advanced Pathfinding API',
    version: '2.0.0',
    endpoints: {
      health: '/api/health',
      routes: '/api/routes',
      locations: '/api/locations'
    },
    documentation: 'https://github.com/curiousalokgithub/bhubaneswar-advanced-pathfinding'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Bhubaneswar Pathfinding API running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🗺️  Routes API: http://localhost:${PORT}/api/routes`);
  console.log(`📍 Locations API: http://localhost:${PORT}/api/locations`);
});
