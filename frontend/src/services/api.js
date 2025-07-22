import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
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

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Store API methods
export const storeAPI = {
  // Get all stores with pagination and filters
  getAllStores: async (params = {}) => {
    const response = await api.get('/stores', { params });
    return response.data;
  },

  // Get nearby stores
  getNearbyStores: async (lat, lng, maxDistance = 10000, limit = 50) => {
    const response = await api.get('/stores/nearby', {
      params: { lat, lng, maxDistance, limit }
    });
    return response.data;
  },

  // Search stores
  searchStores: async (query, filters = {}) => {
    const response = await api.get('/stores/search', {
      params: { q: query, ...filters }
    });
    return response.data;
  },

  // Get single store by ID
  getStoreById: async (id) => {
    const response = await api.get(`/stores/${id}`);
    return response.data;
  },

  // Get stores by category
  getStoresByCategory: async (categorySlug, params = {}) => {
    const response = await api.get(`/stores/category/${categorySlug}`, { params });
    return response.data;
  },

  // Create new store (admin)
  createStore: async (storeData) => {
    const response = await api.post('/stores', storeData);
    return response.data;
  }
};

// Category API methods
export const categoryAPI = {
  // Get all categories
  getAllCategories: async (params = {}) => {
    const response = await api.get('/categories', { params });
    return response.data;
  },

  // Get category by slug
  getCategoryBySlug: async (slug) => {
    const response = await api.get(`/categories/${slug}`);
    return response.data;
  },

  // Get parent categories only
  getParentCategories: async (withStoreCounts = true) => {
    const response = await api.get('/categories/parents', {
      params: { withStoreCounts }
    });
    return response.data;
  },

  // Get subcategories
  getSubcategories: async (parentSlug) => {
    const response = await api.get(`/categories/${parentSlug}/subcategories`);
    return response.data;
  },

  // Get category statistics
  getCategoryStats: async () => {
    const response = await api.get('/categories/stats');
    return response.data;
  },

  // Create new category (admin)
  createCategory: async (categoryData) => {
    const response = await api.post('/categories', categoryData);
    return response.data;
  }
};

// Health check
export const healthAPI = {
  checkHealth: async () => {
    const response = await api.get('/health');
    return response.data;
  }
};

// Export default api instance
export default api;
