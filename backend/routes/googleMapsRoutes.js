// Google Maps Integration Routes for Backend
const express = require('express');
const axios = require('axios');
const router = express.Router();

// Google Maps API Configuration
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
const GOOGLE_MAPS_BASE_URL = 'https://maps.googleapis.com/maps/api';

// Bhubaneswar city bounds for restricting searches
const CITY_BOUNDS = {
  northeast: { lat: 20.5, lng: 85.95 },
  southwest: { lat: 20.1, lng: 85.7 }
};

// Transportation pricing for Bhubaneswar
const PRICING_CONFIG = {
  auto: { baseRate: 12, baseFare: 10 },
  bike: { baseRate: 3, baseFare: 0 },
  bus: { baseRate: 2, baseFare: 8 },
  cab: { baseRate: 15, baseFare: 20 },
  surgeMultiplier: 1.5,
  fuelCostPerKm: 4.5
};

// Helper function to check if current time is rush hour
const isRushHour = () => {
  const now = new Date();
  const hour = now.getHours();
  return (hour >= 8 && hour <= 10) || (hour >= 18 && hour <= 20);
};

// Helper function to calculate transport pricing
const calculateTransportPricing = (distanceKm, durationMinutes) => {
  const surge = isRushHour() ? PRICING_CONFIG.surgeMultiplier : 1;
  
  return {
    auto: {
      estimatedFare: Math.round((PRICING_CONFIG.auto.baseRate * distanceKm + PRICING_CONFIG.auto.baseFare) * surge),
      currency: '₹',
      details: {
        baseFare: PRICING_CONFIG.auto.baseFare,
        perKmRate: PRICING_CONFIG.auto.baseRate,
        surgeFactor: surge,
        estimatedTime: `${Math.round(durationMinutes)} mins`
      }
    },
    bike: {
      estimatedFare: Math.round(PRICING_CONFIG.bike.baseRate * distanceKm),
      currency: '₹',
      details: {
        baseFare: PRICING_CONFIG.bike.baseFare,
        perKmRate: PRICING_CONFIG.bike.baseRate,
        surgeFactor: 1,
        estimatedTime: `${Math.round(durationMinutes * 0.7)} mins`
      }
    },
    bus: {
      estimatedFare: Math.round(PRICING_CONFIG.bus.baseFare + (distanceKm > 5 ? (distanceKm - 5) * PRICING_CONFIG.bus.baseRate : 0)),
      currency: '₹',
      details: {
        baseFare: PRICING_CONFIG.bus.baseFare,
        perKmRate: PRICING_CONFIG.bus.baseRate,
        surgeFactor: 1,
        estimatedTime: `${Math.round(durationMinutes * 1.3)} mins`
      }
    },
    cab: {
      estimatedFare: Math.round((PRICING_CONFIG.cab.baseRate * distanceKm + PRICING_CONFIG.cab.baseFare) * surge),
      currency: '₹',
      details: {
        baseFare: PRICING_CONFIG.cab.baseFare,
        perKmRate: PRICING_CONFIG.cab.baseRate,
        surgeFactor: surge,
        estimatedTime: `${Math.round(durationMinutes)} mins`
      }
    },
    walking: {
      estimatedFare: 0,
      currency: '₹',
      details: {
        baseFare: 0,
        perKmRate: 0,
        surgeFactor: 1,
        estimatedTime: `${Math.round(distanceKm * 12)} mins`,
        calories: Math.round(distanceKm * 50)
      }
    }
  };
};

// Geocode an address
router.post('/geocode', async (req, res) => {
  try {
    if (!GOOGLE_MAPS_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'Google Maps API key not configured'
      });
    }

    const { address } = req.body;
    
    if (!address) {
      return res.status(400).json({
        success: false,
        error: 'Address is required'
      });
    }

    const response = await axios.get(`${GOOGLE_MAPS_BASE_URL}/geocode/json`, {
      params: {
        address: `${address}, Bhubaneswar, Odisha, India`,
        bounds: `${CITY_BOUNDS.southwest.lat},${CITY_BOUNDS.southwest.lng}|${CITY_BOUNDS.northeast.lat},${CITY_BOUNDS.northeast.lng}`,
        region: 'in',
        key: GOOGLE_MAPS_API_KEY
      }
    });

    if (response.data.status === 'OK' && response.data.results.length > 0) {
      const result = response.data.results[0];
      
      res.json({
        success: true,
        location: {
          lat: result.geometry.location.lat,
          lng: result.geometry.location.lng,
          address: result.formatted_address,
          placeId: result.place_id
        },
        bounds: result.geometry.bounds
      });
    } else {
      res.status(404).json({
        success: false,
        error: response.data.error_message || 'Location not found'
      });
    }
  } catch (error) {
    console.error('Geocoding error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to geocode address'
    });
  }
});

// Reverse geocode coordinates
router.post('/reverse-geocode', async (req, res) => {
  try {
    if (!GOOGLE_MAPS_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'Google Maps API key not configured'
      });
    }

    const { lat, lng } = req.body;
    
    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        error: 'Latitude and longitude are required'
      });
    }

    const response = await axios.get(`${GOOGLE_MAPS_BASE_URL}/geocode/json`, {
      params: {
        latlng: `${lat},${lng}`,
        key: GOOGLE_MAPS_API_KEY
      }
    });

    if (response.data.status === 'OK' && response.data.results.length > 0) {
      const result = response.data.results[0];
      
      res.json({
        success: true,
        address: result.formatted_address,
        placeId: result.place_id,
        components: result.address_components
      });
    } else {
      res.status(404).json({
        success: false,
        error: 'Address not found'
      });
    }
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get address'
    });
  }
});

// Search places with autocomplete
router.get('/places/search', async (req, res) => {
  try {
    if (!GOOGLE_MAPS_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'Google Maps API key not configured'
      });
    }

    const { query, type } = req.query;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Query parameter is required'
      });
    }

    const params = {
      input: query,
      location: '20.2961,85.8245', // Bhubaneswar center
      radius: 50000,
      strictbounds: true,
      components: 'country:in',
      key: GOOGLE_MAPS_API_KEY
    };

    if (type) {
      params.types = type;
    }

    const response = await axios.get(`${GOOGLE_MAPS_BASE_URL}/place/autocomplete/json`, {
      params
    });

    if (response.data.status === 'OK') {
      const predictions = response.data.predictions.map(prediction => ({
        placeId: prediction.place_id,
        description: prediction.description,
        mainText: prediction.structured_formatting.main_text,
        secondaryText: prediction.structured_formatting.secondary_text,
        types: prediction.types
      }));

      res.json({
        success: true,
        predictions
      });
    } else {
      res.status(404).json({
        success: false,
        error: response.data.error_message || 'No places found'
      });
    }
  } catch (error) {
    console.error('Places search error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search places'
    });
  }
});

// Get place details
router.get('/places/details/:placeId', async (req, res) => {
  try {
    if (!GOOGLE_MAPS_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'Google Maps API key not configured'
      });
    }

    const { placeId } = req.params;

    const response = await axios.get(`${GOOGLE_MAPS_BASE_URL}/place/details/json`, {
      params: {
        place_id: placeId,
        fields: 'name,formatted_address,geometry,place_id,types,rating,opening_hours,formatted_phone_number',
        key: GOOGLE_MAPS_API_KEY
      }
    });

    if (response.data.status === 'OK') {
      const place = response.data.result;
      
      res.json({
        success: true,
        place: {
          placeId: place.place_id,
          name: place.name,
          address: place.formatted_address,
          location: place.geometry.location,
          types: place.types,
          rating: place.rating,
          openingHours: place.opening_hours,
          phoneNumber: place.formatted_phone_number
        }
      });
    } else {
      res.status(404).json({
        success: false,
        error: response.data.error_message || 'Place not found'
      });
    }
  } catch (error) {
    console.error('Place details error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get place details'
    });
  }
});

// Calculate route with pricing
router.post('/calculate-route', async (req, res) => {
  try {
    if (!GOOGLE_MAPS_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'Google Maps API key not configured'
      });
    }

    const { origin, destination, travelMode = 'DRIVING', options = {} } = req.body;
    
    if (!origin || !destination) {
      return res.status(400).json({
        success: false,
        error: 'Origin and destination are required'
      });
    }

    const params = {
      origin: typeof origin === 'string' ? origin : `${origin.lat},${origin.lng}`,
      destination: typeof destination === 'string' ? destination : `${destination.lat},${destination.lng}`,
      mode: travelMode.toLowerCase(),
      alternatives: true,
      key: GOOGLE_MAPS_API_KEY,
      region: 'in',
      ...options
    };

    const response = await axios.get(`${GOOGLE_MAPS_BASE_URL}/directions/json`, {
      params
    });

    if (response.data.status === 'OK' && response.data.routes.length > 0) {
      const routes = response.data.routes.map((route, index) => {
        const leg = route.legs[0];
        const distance = leg.distance.value / 1000; // Convert to km
        const duration = leg.duration.value / 60; // Convert to minutes

        return {
          routeIndex: index,
          summary: route.summary,
          distance: {
            text: leg.distance.text,
            value: distance,
            meters: leg.distance.value
          },
          duration: {
            text: leg.duration.text,
            value: duration,
            seconds: leg.duration.value
          },
          startAddress: leg.start_address,
          endAddress: leg.end_address,
          steps: leg.steps.map(step => ({
            instruction: step.html_instructions.replace(/<[^>]*>/g, ''),
            distance: step.distance.text,
            duration: step.duration.text,
            startLocation: step.start_location,
            endLocation: step.end_location,
            travelMode: step.travel_mode
          })),
          overview_polyline: route.overview_polyline.points,
          warnings: route.warnings,
          copyrights: route.copyrights,
          pricing: calculateTransportPricing(distance, duration)
        };
      });

      res.json({
        success: true,
        routes,
        status: response.data.status
      });
    } else {
      res.status(404).json({
        success: false,
        error: response.data.error_message || 'Route not found'
      });
    }
  } catch (error) {
    console.error('Route calculation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to calculate route'
    });
  }
});

// Get distance matrix
router.post('/distance-matrix', async (req, res) => {
  try {
    if (!GOOGLE_MAPS_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'Google Maps API key not configured'
      });
    }

    const { origins, destinations, travelMode = 'DRIVING' } = req.body;
    
    if (!origins || !destinations) {
      return res.status(400).json({
        success: false,
        error: 'Origins and destinations are required'
      });
    }

    const originsStr = origins.map(o => 
      typeof o === 'string' ? o : `${o.lat},${o.lng}`
    ).join('|');
    
    const destinationsStr = destinations.map(d => 
      typeof d === 'string' ? d : `${d.lat},${d.lng}`
    ).join('|');

    const response = await axios.get(`${GOOGLE_MAPS_BASE_URL}/distancematrix/json`, {
      params: {
        origins: originsStr,
        destinations: destinationsStr,
        mode: travelMode.toLowerCase(),
        units: 'metric',
        avoid: 'tolls',
        key: GOOGLE_MAPS_API_KEY
      }
    });

    if (response.data.status === 'OK') {
      const matrix = response.data.rows.map((row, originIndex) => 
        row.elements.map((element, destIndex) => ({
          originIndex,
          destinationIndex: destIndex,
          distance: element.distance,
          duration: element.duration,
          status: element.status,
          pricing: element.status === 'OK' ? 
            calculateTransportPricing(
              element.distance.value / 1000,
              element.duration.value / 60
            ) : null
        }))
      ).flat();

      res.json({
        success: true,
        data: response.data,
        matrix
      });
    } else {
      res.status(404).json({
        success: false,
        error: response.data.error_message || 'Distance matrix calculation failed'
      });
    }
  } catch (error) {
    console.error('Distance matrix error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to calculate distance matrix'
    });
  }
});

// Health check for Google Maps integration
router.get('/health', (req, res) => {
  res.json({
    success: true,
    service: 'Google Maps Integration',
    status: 'active',
    apiConfigured: !!GOOGLE_MAPS_API_KEY,
    features: [
      'Geocoding',
      'Reverse Geocoding', 
      'Place Search',
      'Place Details',
      'Route Calculation',
      'Distance Matrix',
      'Bhubaneswar Pricing'
    ],
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
