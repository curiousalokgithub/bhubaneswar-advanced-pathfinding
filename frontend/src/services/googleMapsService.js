// Google Maps API Service for Bhubaneswar Advanced Pathfinding
import axios from 'axios';

class GoogleMapsService {
  constructor() {
    this.apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    this.baseUrl = 'https://maps.googleapis.com/maps/api';
    
    // Bhubaneswar city bounds for restricting searches
    this.cityBounds = {
      northeast: {
        lat: parseFloat(import.meta.env.VITE_CITY_BOUNDS_NE_LAT) || 20.5,
        lng: parseFloat(import.meta.env.VITE_CITY_BOUNDS_NE_LNG) || 85.95
      },
      southwest: {
        lat: parseFloat(import.meta.env.VITE_CITY_BOUNDS_SW_LAT) || 20.1,
        lng: parseFloat(import.meta.env.VITE_CITY_BOUNDS_SW_LNG) || 85.7
      }
    };

    // Transportation pricing for Bhubaneswar
    this.pricing = {
      auto: parseFloat(import.meta.env.VITE_BASE_AUTO_RATE) || 12,
      bike: parseFloat(import.meta.env.VITE_BASE_BIKE_RATE) || 3,
      bus: parseFloat(import.meta.env.VITE_BASE_BUS_RATE) || 8,
      cab: parseFloat(import.meta.env.VITE_BASE_CAB_RATE) || 15,
      surgeMultiplier: parseFloat(import.meta.env.VITE_SURGE_MULTIPLIER) || 1.5,
      fuelCostPerKm: parseFloat(import.meta.env.VITE_FUEL_COST_PER_KM) || 4.5
    };

    this.isApiKeyValid = this.apiKey && this.apiKey !== 'your_google_maps_api_key_here';
  }

  /**
   * Geocode an address to get coordinates
   */
  async geocodeAddress(address) {
    if (!this.isApiKeyValid) {
      throw new Error('Google Maps API key not configured');
    }

    try {
      const response = await axios.get(`${this.baseUrl}/geocode/json`, {
        params: {
          address: `${address}, Bhubaneswar, Odisha, India`,
          bounds: `${this.cityBounds.southwest.lat},${this.cityBounds.southwest.lng}|${this.cityBounds.northeast.lat},${this.cityBounds.northeast.lng}`,
          region: 'in',
          key: this.apiKey
        }
      });

      if (response.data.status === 'OK' && response.data.results.length > 0) {
        const result = response.data.results[0];
        return {
          success: true,
          location: {
            lat: result.geometry.location.lat,
            lng: result.geometry.location.lng,
            address: result.formatted_address,
            placeId: result.place_id
          },
          bounds: result.geometry.bounds
        };
      } else {
        throw new Error(response.data.error_message || 'Location not found');
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      throw new Error(`Failed to geocode address: ${error.message}`);
    }
  }

  /**
   * Reverse geocode coordinates to get address
   */
  async reverseGeocode(lat, lng) {
    if (!this.isApiKeyValid) {
      throw new Error('Google Maps API key not configured');
    }

    try {
      const response = await axios.get(`${this.baseUrl}/geocode/json`, {
        params: {
          latlng: `${lat},${lng}`,
          key: this.apiKey
        }
      });

      if (response.data.status === 'OK' && response.data.results.length > 0) {
        const result = response.data.results[0];
        return {
          success: true,
          address: result.formatted_address,
          placeId: result.place_id,
          components: result.address_components
        };
      } else {
        throw new Error('Address not found');
      }
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      throw new Error(`Failed to get address: ${error.message}`);
    }
  }

  /**
   * Search for places in Bhubaneswar
   */
  async searchPlaces(query, type = null) {
    if (!this.isApiKeyValid) {
      throw new Error('Google Maps API key not configured');
    }

    try {
      const params = {
        input: query,
        location: `${import.meta.env.VITE_DEFAULT_LAT || 20.2961},${import.meta.env.VITE_DEFAULT_LNG || 85.8245}`,
        radius: 50000, // 50km radius
        strictbounds: true,
        components: 'country:in',
        key: this.apiKey
      };

      if (type) {
        params.types = type;
      }

      const response = await axios.get(`${this.baseUrl}/place/autocomplete/json`, {
        params
      });

      if (response.data.status === 'OK') {
        return {
          success: true,
          predictions: response.data.predictions.map(prediction => ({
            placeId: prediction.place_id,
            description: prediction.description,
            mainText: prediction.structured_formatting.main_text,
            secondaryText: prediction.structured_formatting.secondary_text,
            types: prediction.types
          }))
        };
      } else {
        throw new Error(response.data.error_message || 'Search failed');
      }
    } catch (error) {
      console.error('Places search error:', error);
      throw new Error(`Failed to search places: ${error.message}`);
    }
  }

  /**
   * Get place details by place ID
   */
  async getPlaceDetails(placeId) {
    if (!this.isApiKeyValid) {
      throw new Error('Google Maps API key not configured');
    }

    try {
      const response = await axios.get(`${this.baseUrl}/place/details/json`, {
        params: {
          place_id: placeId,
          fields: 'name,formatted_address,geometry,place_id,types,rating,opening_hours,formatted_phone_number',
          key: this.apiKey
        }
      });

      if (response.data.status === 'OK') {
        const place = response.data.result;
        return {
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
        };
      } else {
        throw new Error(response.data.error_message || 'Place not found');
      }
    } catch (error) {
      console.error('Place details error:', error);
      throw new Error(`Failed to get place details: ${error.message}`);
    }
  }

  /**
   * Calculate route using Google Directions API
   */
  async calculateRoute(origin, destination, travelMode = 'DRIVING', options = {}) {
    if (!this.isApiKeyValid) {
      throw new Error('Google Maps API key not configured');
    }

    try {
      const params = {
        origin: typeof origin === 'string' ? origin : `${origin.lat},${origin.lng}`,
        destination: typeof destination === 'string' ? destination : `${destination.lat},${destination.lng}`,
        mode: travelMode.toLowerCase(),
        alternatives: true,
        key: this.apiKey,
        region: 'in',
        ...options
      };

      // Add avoid options if specified
      if (options.avoid) {
        params.avoid = options.avoid; // tolls, highways, ferries
      }

      const response = await axios.get(`${this.baseUrl}/directions/json`, {
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
            // Calculate pricing for different transport modes
            pricing: this.calculateTransportPricing(distance, duration, travelMode)
          };
        });

        return {
          success: true,
          routes,
          status: response.data.status
        };
      } else {
        throw new Error(response.data.error_message || 'Route not found');
      }
    } catch (error) {
      console.error('Route calculation error:', error);
      throw new Error(`Failed to calculate route: ${error.message}`);
    }
  }

  /**
   * Calculate pricing for different transportation modes in Bhubaneswar
   */
  calculateTransportPricing(distanceKm, durationMinutes, primaryMode = 'DRIVING') {
    const surge = this.isRushHour() ? this.pricing.surgeMultiplier : 1;
    
    return {
      auto: {
        estimatedFare: Math.round((this.pricing.auto * distanceKm + 10) * surge),
        currency: '₹',
        details: {
          baseFare: 10,
          perKmRate: this.pricing.auto,
          surgeFactor: surge,
          estimatedTime: `${Math.round(durationMinutes)} mins`
        }
      },
      bike: {
        estimatedFare: Math.round(this.pricing.bike * distanceKm),
        currency: '₹',
        details: {
          baseFare: 0,
          perKmRate: this.pricing.bike,
          surgeFactor: 1, // No surge for bike
          estimatedTime: `${Math.round(durationMinutes * 0.7)} mins` // Bikes are faster in traffic
        }
      },
      bus: {
        estimatedFare: Math.round(this.pricing.bus + (distanceKm > 5 ? (distanceKm - 5) * 2 : 0)),
        currency: '₹',
        details: {
          baseFare: this.pricing.bus,
          perKmRate: 2,
          surgeFactor: 1,
          estimatedTime: `${Math.round(durationMinutes * 1.3)} mins` // Buses are slower
        }
      },
      cab: {
        estimatedFare: Math.round((this.pricing.cab * distanceKm + 20) * surge),
        currency: '₹',
        details: {
          baseFare: 20,
          perKmRate: this.pricing.cab,
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
          estimatedTime: `${Math.round(distanceKm * 12)} mins`, // 5 km/h walking speed
          calories: Math.round(distanceKm * 50) // Approximate calories burned
        }
      }
    };
  }

  /**
   * Check if current time is rush hour
   */
  isRushHour() {
    const now = new Date();
    const hour = now.getHours();
    
    // Rush hours in Bhubaneswar: 8-10 AM and 6-8 PM
    return (hour >= 8 && hour <= 10) || (hour >= 18 && hour <= 20);
  }

  /**
   * Get distance matrix for multiple origins and destinations
   */
  async getDistanceMatrix(origins, destinations, travelMode = 'DRIVING') {
    if (!this.isApiKeyValid) {
      throw new Error('Google Maps API key not configured');
    }

    try {
      const originsStr = origins.map(o => 
        typeof o === 'string' ? o : `${o.lat},${o.lng}`
      ).join('|');
      
      const destinationsStr = destinations.map(d => 
        typeof d === 'string' ? d : `${d.lat},${d.lng}`
      ).join('|');

      const response = await axios.get(`${this.baseUrl}/distancematrix/json`, {
        params: {
          origins: originsStr,
          destinations: destinationsStr,
          mode: travelMode.toLowerCase(),
          units: 'metric',
          avoid: 'tolls',
          key: this.apiKey
        }
      });

      if (response.data.status === 'OK') {
        return {
          success: true,
          data: response.data,
          matrix: response.data.rows.map((row, originIndex) => 
            row.elements.map((element, destIndex) => ({
              originIndex,
              destinationIndex: destIndex,
              distance: element.distance,
              duration: element.duration,
              status: element.status,
              pricing: element.status === 'OK' ? 
                this.calculateTransportPricing(
                  element.distance.value / 1000,
                  element.duration.value / 60,
                  travelMode
                ) : null
            }))
          ).flat()
        };
      } else {
        throw new Error(response.data.error_message || 'Distance matrix calculation failed');
      }
    } catch (error) {
      console.error('Distance matrix error:', error);
      throw new Error(`Failed to calculate distance matrix: ${error.message}`);
    }
  }

  /**
   * Find nearby places of a specific type
   */
  async findNearbyPlaces(location, type, radius = 5000) {
    if (!this.isApiKeyValid) {
      throw new Error('Google Maps API key not configured');
    }

    try {
      const response = await axios.get(`${this.baseUrl}/place/nearbysearch/json`, {
        params: {
          location: `${location.lat},${location.lng}`,
          radius,
          type,
          key: this.apiKey
        }
      });

      if (response.data.status === 'OK') {
        return {
          success: true,
          places: response.data.results.map(place => ({
            placeId: place.place_id,
            name: place.name,
            location: place.geometry.location,
            vicinity: place.vicinity,
            types: place.types,
            rating: place.rating,
            priceLevel: place.price_level,
            openNow: place.opening_hours?.open_now,
            photos: place.photos?.map(photo => ({
              reference: photo.photo_reference,
              width: photo.width,
              height: photo.height
            }))
          }))
        };
      } else {
        throw new Error(response.data.error_message || 'No nearby places found');
      }
    } catch (error) {
      console.error('Nearby places error:', error);
      throw new Error(`Failed to find nearby places: ${error.message}`);
    }
  }
}

// Create singleton instance
const googleMapsService = new GoogleMapsService();

export default googleMapsService;

// Export specific functions for easier usage
export const {
  geocodeAddress,
  reverseGeocode,
  searchPlaces,
  getPlaceDetails,
  calculateRoute,
  getDistanceMatrix,
  findNearbyPlaces,
  calculateTransportPricing
} = googleMapsService;
