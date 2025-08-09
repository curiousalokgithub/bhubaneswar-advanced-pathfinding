import axios from 'axios';

// API Base URL - use environment variable or fallback to localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging and authentication
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and logging
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    if (error.response) {
      console.error(`❌ API Error: ${error.response.status} ${error.response.config.url}`, error.response.data);
    } else if (error.request) {
      console.error('❌ Network Error:', error.message);
    } else {
      console.error('❌ Request Setup Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Routes API methods
export const routesAPI = {
  // Calculate route between two points
  calculateRoute: async (routeData) => {
    try {
      const response = await api.post('/routes/calculate-route', routeData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to calculate route');
    }
  },

  // Get pricing for all transport modes
  getAllPricing: async (fromCoords, toCoords, timeOfDay = 'normal') => {
    try {
      const response = await api.post('/routes/get-pricing', {
        fromCoords,
        toCoords,
        timeOfDay
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to get pricing');
    }
  },

  // Check routes service health
  getRoutesHealth: async () => {
    try {
      const response = await api.get('/routes/health');
      return response.data;
    } catch (error) {
      throw new Error('Routes service unavailable');
    }
  }
};

// Locations API methods
export const locationsAPI = {
  // Get all locations with filters
  getAllLocations: async (params = {}) => {
    try {
      const response = await api.get('/locations/locations', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch locations');
    }
  },

  // Get location by ID
  getLocationById: async (id) => {
    try {
      const response = await api.get(`/locations/locations/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Location not found');
    }
  },

  // Get all location categories
  getCategories: async () => {
    try {
      const response = await api.get('/locations/categories');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch categories');
    }
  },

  // Find nearby locations
  getNearbyLocations: async (coords, radius = 5, limit = 20, categories = []) => {
    try {
      const response = await api.post('/locations/locations/nearby', {
        coords,
        radius,
        limit,
        categories
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to find nearby locations');
    }
  },

  // Advanced location search
  searchLocations: async (query, filters = {}) => {
    try {
      const response = await api.post('/locations/search', {
        query,
        ...filters
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Search failed');
    }
  }
};

// System API methods
export const systemAPI = {
  // Get API health status
  getHealth: async () => {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      throw new Error('API unavailable');
    }
  },

  // Get API documentation
  getApiInfo: async () => {
    try {
      const response = await axios.get(API_BASE_URL.replace('/api', '/api'));
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch API info');
    }
  }
};

// Combined API object for easy imports
export const pathfindingAPI = {
  routes: routesAPI,
  locations: locationsAPI,
  system: systemAPI
};

// Default export
export default pathfindingAPI;
