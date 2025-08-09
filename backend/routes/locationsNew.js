const express = require('express');
const router = express.Router();
const { 
  getAllLocations, 
  getLocationById, 
  getNearbyLocations, 
  getCategories,
  searchLocationsByQuery 
} = require('../controllers/locationController');

// Get all locations with enhanced filtering and search
router.get('/locations', getAllLocations);

// Get location details by ID
router.get('/locations/:id', getLocationById);

// Get all available categories
router.get('/categories', getCategories);

// Find nearby locations
router.post('/locations/nearby', getNearbyLocations);

// Advanced search with filters
router.post('/search', searchLocationsByQuery);

// Health check for locations service
router.get('/health', (req, res) => {
  res.json({
    success: true,
    service: 'Locations API',
    status: 'operational',
    timestamp: new Date().toISOString(),
    availableEndpoints: [
      'GET /locations',
      'GET /locations/:id',
      'GET /categories',
      'POST /locations/nearby',
      'POST /search',
      'GET /health'
    ]
  });
});

module.exports = router;
