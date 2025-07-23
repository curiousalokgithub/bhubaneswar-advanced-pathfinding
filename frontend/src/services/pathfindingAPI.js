// Enhanced API service for backend integration
const API_BASE_URL = 'http://localhost:5000/api';

class PathfindingAPI {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Generic API call method with error handling
  async apiCall(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`API call failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Calculate real-time route with dynamic pricing
  async calculateRoute(routeData) {
    const {
      fromCoords,
      toCoords,
      transportMode,
      routePreference = 'fastest',
      timeOfDay = this.getTimeOfDay()
    } = routeData;

    if (!fromCoords || !toCoords || !transportMode) {
      throw new Error('Missing required route parameters');
    }

    return await this.apiCall('/routes/calculate-route', {
      method: 'POST',
      body: JSON.stringify({
        fromCoords,
        toCoords,
        transportMode,
        routePreference,
        timeOfDay
      })
    });
  }

  // Get real-time pricing for all transport modes
  async getAllPricing(fromCoords, toCoords) {
    if (!fromCoords || !toCoords) {
      throw new Error('Coordinates required for pricing calculation');
    }

    return await this.apiCall('/routes/get-pricing', {
      method: 'POST',
      body: JSON.stringify({
        fromCoords,
        toCoords,
        timeOfDay: this.getTimeOfDay()
      })
    });
  }

  // Get locations with enhanced data
  async getLocations(filters = {}) {
    const { category, type, search } = filters;
    const params = new URLSearchParams();
    
    if (category) params.append('category', category);
    if (type) params.append('type', type);
    if (search) params.append('search', search);
    
    const query = params.toString();
    const endpoint = `/locations/locations${query ? `?${query}` : ''}`;
    
    return await this.apiCall(endpoint);
  }

  // Get location details by ID
  async getLocationById(locationId) {
    if (!locationId) {
      throw new Error('Location ID is required');
    }

    return await this.apiCall(`/locations/${locationId}`);
  }

  // Find nearby locations
  async getNearbyLocations(coords, radius = 5, limit = 10) {
    if (!coords || coords.length !== 2) {
      throw new Error('Valid coordinates required');
    }

    return await this.apiCall('/locations/nearby', {
      method: 'POST',
      body: JSON.stringify({
        coords,
        radius,
        limit
      })
    });
  }

  // Check API health
  async checkHealth() {
    try {
      return await this.apiCall('/health');
    } catch (error) {
      return { status: 'ERROR', message: 'API is not available' };
    }
  }

  // Utility method to determine time of day for pricing
  getTimeOfDay() {
    const hour = new Date().getHours();
    
    // Peak hours: 8-10 AM, 6-9 PM
    if ((hour >= 8 && hour <= 10) || (hour >= 18 && hour <= 21)) {
      return 'peak';
    }
    
    return 'normal';
  }

  // Utility method to format coordinates
  static formatCoordinates(coords) {
    if (!coords || coords.length !== 2) return null;
    return [parseFloat(coords[0]), parseFloat(coords[1])];
  }

  // Utility method to calculate estimated arrival time
  static calculateArrivalTime(durationMinutes) {
    const now = new Date();
    const arrivalTime = new Date(now.getTime() + durationMinutes * 60000);
    
    return {
      time: arrivalTime.toLocaleTimeString('en-IN', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      date: arrivalTime.toLocaleDateString('en-IN'),
      timestamp: arrivalTime.toISOString()
    };
  }

  // Utility method to format distance
  static formatDistance(km) {
    if (km < 1) {
      return `${Math.round(km * 1000)} m`;
    }
    return `${km.toFixed(1)} km`;
  }

  // Utility method to format price range
  static formatPriceRange(pricing) {
    if (pricing.type === 'Free') {
      return 'Free';
    }
    
    if (pricing.min === pricing.max) {
      return `₹${pricing.estimated}`;
    }
    
    return `₹${pricing.min}-${pricing.max}`;
  }
}

// Create and export singleton instance
const pathfindingAPI = new PathfindingAPI();

// Additional utility functions for route planning
export const RouteUtils = {
  // Validate coordinates
  isValidCoordinates(coords) {
    return coords && 
           Array.isArray(coords) && 
           coords.length === 2 && 
           !isNaN(coords[0]) && 
           !isNaN(coords[1]) &&
           coords[0] >= -90 && coords[0] <= 90 &&
           coords[1] >= -180 && coords[1] <= 180;
  },

  // Check if coordinates are in Bhubaneswar area
  isInBhubaneswar(coords) {
    if (!this.isValidCoordinates(coords)) return false;
    
    const [lat, lng] = coords;
    // Approximate bounds for Bhubaneswar
    return lat >= 20.1 && lat <= 20.5 && lng >= 85.7 && lng <= 85.9;
  },

  // Get transport mode icon
  getTransportIcon(mode) {
    const icons = {
      walking: '🚶',
      cycling: '🚴',
      auto: '🛺',
      bus: '🚌',
      car: '🚗',
      bike: '🏍️'
    };
    return icons[mode] || '🚶';
  },

  // Get route quality color
  getQualityColor(rating) {
    const colors = {
      'Excellent': '#10b981',
      'Good': '#3b82f6',
      'Average': '#f59e0b',
      'Poor': '#ef4444'
    };
    return colors[rating] || '#6b7280';
  },

  // Format duration display
  formatDuration(minutes) {
    if (minutes < 60) {
      return `${minutes} min${minutes !== 1 ? 's' : ''}`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  }
};

export default pathfindingAPI;
