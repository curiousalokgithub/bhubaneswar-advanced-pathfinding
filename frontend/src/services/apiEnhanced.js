import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for authentication and logging
api.interceptors.request.use(
  (config) => {
    console.log(`🌐 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    
    // Add API key if available for external services
    const apiKey = import.meta.env.VITE_API_KEY;
    if (apiKey && config.url?.includes('external')) {
      config.headers['X-API-Key'] = apiKey;
    }
    
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.config.url} - ${response.status}`);
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', error.response?.status, error.message);
    
    // Handle specific error codes
    if (error.response?.status === 401) {
      console.warn('🔐 Unauthorized access - redirecting to login');
    } else if (error.response?.status === 503) {
      console.warn('🔧 Service temporarily unavailable');
    }
    
    return Promise.reject(error);
  }
);

// Enhanced Locations API
export const locationsAPI = {
  // Get all locations with enhanced filtering
  getAllLocations: async (params = {}) => {
    try {
      const response = await api.get('/locations/locations', { params });
      return {
        success: true,
        data: response.data?.data || [],
        message: 'Locations fetched successfully'
      };
    } catch (error) {
      console.error('Error fetching locations:', error);
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || 'Failed to fetch locations'
      };
    }
  },

  // Get location by ID with full details
  getLocationById: async (id) => {
    try {
      const response = await api.get(`/locations/locations/${id}`);
      return {
        success: true,
        data: response.data?.data || {},
        message: 'Location details fetched successfully'
      };
    } catch (error) {
      console.error('Error fetching location details:', error);
      return {
        success: false,
        data: {},
        message: error.response?.data?.message || 'Failed to fetch location details'
      };
    }
  },

  // Get categories with location counts
  getCategories: async () => {
    try {
      const response = await api.get('/locations/categories');
      return {
        success: true,
        data: response.data?.data || [],
        message: 'Categories fetched successfully'
      };
    } catch (error) {
      console.error('Error fetching categories:', error);
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || 'Failed to fetch categories'
      };
    }
  },

  // Search locations with advanced filters
  searchLocations: async (query, filters = {}) => {
    try {
      const params = {
        q: query,
        ...filters
      };
      const response = await api.get('/locations/search', { params });
      return {
        success: true,
        data: response.data?.data || [],
        message: 'Search completed successfully'
      };
    } catch (error) {
      console.error('Error searching locations:', error);
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || 'Search failed'
      };
    }
  },

  // Get nearby locations
  getNearbyLocations: async (lat, lng, radius = 5000) => {
    try {
      const params = { lat, lng, radius };
      const response = await api.get('/locations/nearby', { params });
      return {
        success: true,
        data: response.data?.data || [],
        message: 'Nearby locations fetched successfully'
      };
    } catch (error) {
      console.error('Error fetching nearby locations:', error);
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || 'Failed to fetch nearby locations'
      };
    }
  }
};

// Enhanced Google Maps API
export const googleMapsAPI = {
  // Geocode address
  geocodeAddress: async (address) => {
    try {
      const response = await api.post('/google-maps/geocode', { address });
      return {
        success: true,
        data: response.data?.data || {},
        message: 'Address geocoded successfully'
      };
    } catch (error) {
      console.error('Error geocoding address:', error);
      return {
        success: false,
        data: {},
        message: error.response?.data?.message || 'Geocoding failed'
      };
    }
  },

  // Search places
  searchPlaces: async (query, location = null) => {
    try {
      const payload = { query };
      if (location) {
        payload.location = location;
      }
      const response = await api.post('/google-maps/search', payload);
      return {
        success: true,
        data: response.data?.data || [],
        message: 'Places search completed successfully'
      };
    } catch (error) {
      console.error('Error searching places:', error);
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || 'Places search failed'
      };
    }
  },

  // Calculate route
  calculateRoute: async (origin, destination, travelMode = 'driving') => {
    try {
      const response = await api.post('/google-maps/route', {
        origin,
        destination,
        travelMode
      });
      return {
        success: true,
        data: response.data?.data || {},
        message: 'Route calculated successfully'
      };
    } catch (error) {
      console.error('Error calculating route:', error);
      return {
        success: false,
        data: {},
        message: error.response?.data?.message || 'Route calculation failed'
      };
    }
  },

  // Get distance matrix
  getDistanceMatrix: async (origins, destinations, travelMode = 'driving') => {
    try {
      const response = await api.post('/google-maps/distance-matrix', {
        origins,
        destinations,
        travelMode
      });
      return {
        success: true,
        data: response.data?.data || {},
        message: 'Distance matrix calculated successfully'
      };
    } catch (error) {
      console.error('Error calculating distance matrix:', error);
      return {
        success: false,
        data: {},
        message: error.response?.data?.message || 'Distance matrix calculation failed'
      };
    }
  }
};

// Routes and Pathfinding API
export const routesAPI = {
  // Get route between two points
  getRoute: async (start, end, options = {}) => {
    try {
      const response = await api.post('/routes/calculate', {
        start,
        end,
        ...options
      });
      return {
        success: true,
        data: response.data?.data || {},
        message: 'Route calculated successfully'
      };
    } catch (error) {
      console.error('Error calculating route:', error);
      return {
        success: false,
        data: {},
        message: error.response?.data?.message || 'Route calculation failed'
      };
    }
  },

  // Get optimal route for multiple destinations
  getOptimalRoute: async (destinations, options = {}) => {
    try {
      const response = await api.post('/routes/optimize', {
        destinations,
        ...options
      });
      return {
        success: true,
        data: response.data?.data || {},
        message: 'Optimal route calculated successfully'
      };
    } catch (error) {
      console.error('Error calculating optimal route:', error);
      return {
        success: false,
        data: {},
        message: error.response?.data?.message || 'Optimal route calculation failed'
      };
    }
  }
};

// Special Travel Plans API
export const travelPlansAPI = {
  // Get predefined travel plans
  getTravelPlans: async () => {
    try {
      const response = await api.get('/travel-plans');
      return {
        success: true,
        data: response.data?.data || [],
        message: 'Travel plans fetched successfully'
      };
    } catch (error) {
      console.error('Error fetching travel plans:', error);
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || 'Failed to fetch travel plans'
      };
    }
  },

  // Create custom travel plan
  createTravelPlan: async (planData) => {
    try {
      const response = await api.post('/travel-plans', planData);
      return {
        success: true,
        data: response.data?.data || {},
        message: 'Travel plan created successfully'
      };
    } catch (error) {
      console.error('Error creating travel plan:', error);
      return {
        success: false,
        data: {},
        message: error.response?.data?.message || 'Failed to create travel plan'
      };
    }
  },

  // Get travel plan by ID
  getTravelPlanById: async (id) => {
    try {
      const response = await api.get(`/travel-plans/${id}`);
      return {
        success: true,
        data: response.data?.data || {},
        message: 'Travel plan details fetched successfully'
      };
    } catch (error) {
      console.error('Error fetching travel plan details:', error);
      return {
        success: false,
        data: {},
        message: error.response?.data?.message || 'Failed to fetch travel plan details'
      };
    }
  }
};

// Health check and system status
export const systemAPI = {
  // Check backend health
  checkHealth: async () => {
    try {
      const response = await api.get('/health');
      return {
        success: true,
        data: response.data || {},
        message: 'System is healthy'
      };
    } catch (error) {
      console.error('Health check failed:', error);
      return {
        success: false,
        data: {},
        message: 'System health check failed'
      };
    }
  },

  // Get system statistics
  getStats: async () => {
    try {
      const response = await api.get('/stats');
      return {
        success: true,
        data: response.data?.data || {},
        message: 'Statistics fetched successfully'
      };
    } catch (error) {
      console.error('Error fetching statistics:', error);
      return {
        success: false,
        data: {},
        message: 'Failed to fetch statistics'
      };
    }
  }
};

// Export the main API instance for custom requests
export default api;
