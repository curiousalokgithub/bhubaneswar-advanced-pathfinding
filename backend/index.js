const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || ['http://localhost:3000', 'https://bhubaneswar-advanced-pathfinding.vercel.app'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));

// Import route modules
const googleMapsRoutes = require('./routes/googleMapsRoutes');
const travelPlanRoutes = require('./routes/travelPlanRoutes');

// Use route modules
app.use('/api/google-maps', googleMapsRoutes);
app.use('/api/travel-plans', travelPlanRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Bhubaneswar Pathfinding API is running',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    environment: process.env.NODE_ENV || 'development',
    features: {
      googleMaps: !!process.env.GOOGLE_MAPS_API_KEY,
      routes: true,
      locations: true
    }
  });
});

// Basic API routes
app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to Bhubaneswar Pathfinding API',
    version: '2.0.0',
    endpoints: {
      health: '/api/health',
      locations: '/api/locations',
      categories: '/api/categories',
      routes: '/api/routes',
      travelPlans: '/api/travel-plans',
      googleMaps: '/api/google-maps'
    }
  });
});

// Sample locations endpoint
app.get('/api/locations', (req, res) => {
  const limit = parseInt(req.query.limit) || 20;
  const sampleLocations = [
    {
      id: 1,
      name: "Lingaraj Temple",
      category: "Temple",
      lat: 20.2378,
      lng: 85.8315,
      address: "Lingaraj Temple Rd, Old Town, Bhubaneswar",
      description: "Famous 11th-century Hindu temple dedicated to Lord Shiva"
    },
    {
      id: 2,
      name: "Kalinga Stadium",
      category: "Sports",
      lat: 20.2828,
      lng: 85.8044,
      address: "Kalinga Stadium Rd, Bhubaneswar",
      description: "Multi-purpose stadium hosting various sports events"
    },
    {
      id: 3,
      name: "Udayagiri Caves",
      category: "Historical",
      lat: 20.2627,
      lng: 85.7913,
      address: "Udayagiri and Khandagiri Caves, Bhubaneswar",
      description: "Ancient rock-cut caves with historical significance"
    },
    {
      id: 4,
      name: "Esplanade One Mall",
      category: "Shopping",
      lat: 20.2906,
      lng: 85.8245,
      address: "Rasulgarh Square, Bhubaneswar",
      description: "Popular shopping mall and entertainment center"
    },
    {
      id: 5,
      name: "Regional Museum of Natural History",
      category: "Museum",
      lat: 20.2506,
      lng: 85.8467,
      address: "Acharya Vihar, Bhubaneswar",
      description: "Museum showcasing natural history and biodiversity"
    },
    {
      id: 6,
      name: "Jagannath Temple",
      category: "Temple", 
      lat: 20.2543,
      lng: 85.8312,
      address: "Old Town, Bhubaneswar",
      description: "Historic temple dedicated to Lord Jagannath"
    }
  ];

  const limitedLocations = sampleLocations.slice(0, limit);

  res.json({
    success: true,
    data: limitedLocations,
    total: limitedLocations.length
  });
});

// Alternative endpoint path for frontend compatibility
app.get('/api/locations/locations', (req, res) => {
  const limit = parseInt(req.query.limit) || 20;
  const sampleLocations = [
    {
      id: 1,
      name: "Lingaraj Temple",
      category: "Temple",
      lat: 20.2378,
      lng: 85.8315,
      address: "Lingaraj Temple Rd, Old Town, Bhubaneswar",
      description: "Famous 11th-century Hindu temple dedicated to Lord Shiva"
    },
    {
      id: 2,
      name: "Kalinga Stadium",
      category: "Sports",
      lat: 20.2828,
      lng: 85.8044,
      address: "Kalinga Stadium Rd, Bhubaneswar",
      description: "Multi-purpose stadium hosting various sports events"
    },
    {
      id: 3,
      name: "Udayagiri Caves",
      category: "Historical",
      lat: 20.2627,
      lng: 85.7913,
      address: "Udayagiri and Khandagiri Caves, Bhubaneswar",
      description: "Ancient rock-cut caves with historical significance"
    },
    {
      id: 4,
      name: "Esplanade One Mall",
      category: "Shopping",
      lat: 20.2906,
      lng: 85.8245,
      address: "Rasulgarh Square, Bhubaneswar",
      description: "Popular shopping mall and entertainment center"
    },
    {
      id: 5,
      name: "Regional Museum of Natural History",
      category: "Museum",
      lat: 20.2506,
      lng: 85.8467,
      address: "Acharya Vihar, Bhubaneswar",
      description: "Museum showcasing natural history and biodiversity"
    },
    {
      id: 6,
      name: "Jagannath Temple",
      category: "Temple", 
      lat: 20.2543,
      lng: 85.8312,
      address: "Old Town, Bhubaneswar",
      description: "Historic temple dedicated to Lord Jagannath"
    }
  ];

  const limitedLocations = sampleLocations.slice(0, limit);

  res.json({
    success: true,
    data: limitedLocations,
    total: limitedLocations.length
  });
});

// Sample categories endpoint
app.get('/api/categories', (req, res) => {
  const categories = [
    { id: 1, name: 'Temple', icon: '🛕', count: 25 },
    { id: 2, name: 'Shopping', icon: '🛍️', count: 15 },
    { id: 3, name: 'Restaurant', icon: '🍽️', count: 35 },
    { id: 4, name: 'Hospital', icon: '🏥', count: 12 },
    { id: 5, name: 'Museum', icon: '🏛️', count: 8 },
    { id: 6, name: 'Sports', icon: '⚽', count: 10 }
  ];

  res.json({
    success: true,
    data: categories,
    total: categories.length
  });
});

// Alternative endpoint path for frontend compatibility
app.get('/api/locations/categories', (req, res) => {
  const categories = [
    { id: 1, name: 'Temple', icon: '🛕', count: 25 },
    { id: 2, name: 'Shopping', icon: '🛍️', count: 15 },
    { id: 3, name: 'Restaurant', icon: '🍽️', count: 35 },
    { id: 4, name: 'Hospital', icon: '🏥', count: 12 },
    { id: 5, name: 'Museum', icon: '🏛️', count: 8 },
    { id: 6, name: 'Sports', icon: '⚽', count: 10 }
  ];

  res.json({
    success: true,
    data: categories,
    total: categories.length
  });
});

// Routes endpoint
app.get('/api/routes', (req, res) => {
  res.json({
    success: true,
    message: 'Route planning endpoint',
    data: {
      from: req.query.from || 'Current Location',
      to: req.query.to || 'Destination',
      mode: req.query.mode || 'driving',
      distance: '5.2 km',
      duration: '15 minutes',
      route: 'Sample route data would be calculated here'
    }
  });
});

// Error handling middleware
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
    availableEndpoints: ['/api/health', '/api/locations', '/api/categories', '/api/routes', '/api/travel-plans']
  });
});

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'Something went wrong on the server'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Bhubaneswar Pathfinding API Server running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📊 API endpoints: http://localhost:${PORT}/api`);
});

module.exports = app;
