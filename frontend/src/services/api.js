import axios from 'axios';

// API Base URL - use environment variable or fallback to localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // Reduced timeout for faster fallback
  headers: {
    'Content-Type': 'application/json',
  },
});

// Simple retry mechanism
const retryRequest = async (fn, retries = 2) => {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0 && (error.code === 'NETWORK_ERROR' || error.code === 'ECONNABORTED')) {
      console.log(`Retrying request... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return retryRequest(fn, retries - 1);
    }
    throw error;
  }
};

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
      console.warn('Backend unavailable, using fallback data');
      // Fallback data when backend is unavailable
      return {
        success: true,
        data: [
          {
            id: 1,
            name: "Kalinga Stadium",
            description: "Major sports complex in Bhubaneswar",
            category: "Sports",
            coordinates: { lat: 20.2961, lng: 85.8245 },
            address: "Unit 9, Bhubaneswar, Odisha 751022",
            rating: 4.5,
            openingHours: "6:00 AM - 10:00 PM"
          },
          {
            id: 2,
            name: "Lingaraj Temple",
            description: "Ancient Hindu temple dedicated to Lord Shiva",
            category: "Temple",
            coordinates: { lat: 20.2370, lng: 85.8362 },
            address: "Old Town, Bhubaneswar, Odisha 751002",
            rating: 4.8,
            openingHours: "5:00 AM - 9:00 PM"
          },
          {
            id: 3,
            name: "Esplanade One Mall",
            description: "Popular shopping destination",
            category: "Shopping",
            coordinates: { lat: 20.2906, lng: 85.8245 },
            address: "Rasulgarh, Bhubaneswar, Odisha 751010",
            rating: 4.2,
            openingHours: "10:00 AM - 10:00 PM"
          },
          {
            id: 4,
            name: "Khandagiri Caves",
            description: "Ancient Jain rock-cut caves",
            category: "Historical",
            coordinates: { lat: 20.1833, lng: 85.7833 },
            address: "Khandagiri, Bhubaneswar, Odisha 751030",
            rating: 4.3,
            openingHours: "9:00 AM - 6:00 PM"
          },
          {
            id: 5,
            name: "Patia Market",
            description: "Local market for daily essentials",
            category: "Market",
            coordinates: { lat: 20.3549, lng: 85.8197 },
            address: "Patia, Bhubaneswar, Odisha 751024",
            rating: 4.0,
            openingHours: "6:00 AM - 9:00 PM"
          },
          {
            id: 6,
            name: "Biju Patnaik International Airport",
            description: "Main airport serving Bhubaneswar",
            category: "Transportation",
            coordinates: { lat: 20.2544, lng: 85.8179 },
            address: "Airport Area, Bhubaneswar, Odisha 751020",
            rating: 4.1,
            openingHours: "24/7"
          }
        ],
        total: 6,
        page: 1,
        limit: params.limit || 20
      };
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
      console.warn('Backend unavailable, using fallback categories');
      // Fallback categories when backend is unavailable
      return {
        success: true,
        data: [
          {
            id: 1,
            name: "Temples",
            description: "Religious and spiritual places",
            icon: "🏛️",
            count: 12
          },
          {
            id: 2,
            name: "Shopping",
            description: "Malls and shopping centers",
            icon: "🛍️",
            count: 8
          },
          {
            id: 3,
            name: "Historical",
            description: "Historical monuments and sites",
            icon: "🏛️",
            count: 6
          },
          {
            id: 4,
            name: "Sports",
            description: "Sports complexes and stadiums",
            icon: "⚽",
            count: 4
          },
          {
            id: 5,
            name: "Transportation",
            description: "Airports, stations, and transport hubs",
            icon: "🚌",
            count: 3
          },
          {
            id: 6,
            name: "Markets",
            description: "Local markets and bazaars",
            icon: "🏪",
            count: 5
          }
        ],
        total: 6
      };
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
