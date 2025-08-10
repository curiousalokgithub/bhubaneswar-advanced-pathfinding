// Advanced Route Calculator with Google Maps Integration
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FaRoute, FaMapMarkerAlt, FaExchangeAlt, FaCar, FaMotorcycle, FaBus, FaWalking, FaLocationArrow, FaSpinner } from 'react-icons/fa';
import googleMapsService from '../services/googleMapsService';

const GoogleMapsRouteCalculator = () => {
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [selectedFrom, setSelectedFrom] = useState(null);
  const [selectedTo, setSelectedTo] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [selectedTravelMode, setSelectedTravelMode] = useState('DRIVING');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);

  const travelModes = [
    { id: 'DRIVING', name: 'Car', icon: FaCar, color: 'bg-blue-500' },
    { id: 'TWO_WHEELER', name: 'Bike', icon: FaMotorcycle, color: 'bg-green-500' },
    { id: 'TRANSIT', name: 'Bus', icon: FaBus, color: 'bg-yellow-500' },
    { id: 'WALKING', name: 'Walk', icon: FaWalking, color: 'bg-purple-500' }
  ];

  // Get current location
  const getCurrentLocation = useCallback(() => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
          
          try {
            const addressResult = await googleMapsService.reverseGeocode(latitude, longitude);
            setFromLocation(addressResult.address);
            setSelectedFrom({
              placeId: addressResult.placeId,
              description: addressResult.address,
              location: { lat: latitude, lng: longitude }
            });
            setUseCurrentLocation(true);
          } catch (error) {
            console.error('Error getting address:', error);
            setFromLocation(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
            setSelectedFrom({
              placeId: 'current_location',
              description: 'Current Location',
              location: { lat: latitude, lng: longitude }
            });
          }
          setLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setError('Unable to get current location. Please enter manually.');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  }, []);

  // Search for location suggestions
  const searchLocations = useCallback(async (query, setSuggestions) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      const result = await googleMapsService.searchPlaces(query);
      if (result.success) {
        setSuggestions(result.predictions);
      }
    } catch (error) {
      console.error('Error searching locations:', error);
    }
  }, []);

  // Debounce search for better performance
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (fromLocation && !selectedFrom) {
        searchLocations(fromLocation, setFromSuggestions);
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [fromLocation, selectedFrom, searchLocations]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (toLocation && !selectedTo) {
        searchLocations(toLocation, setToSuggestions);
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [toLocation, selectedTo, searchLocations]);

  // Calculate route
  const calculateRoute = async () => {
    if (!selectedFrom || !selectedTo) {
      setError('Please select both starting and destination locations.');
      return;
    }

    setLoading(true);
    setError('');
    setRoutes([]);

    try {
      // Get place details to ensure we have coordinates
      let originCoords = selectedFrom.location;
      let destCoords = selectedTo.location;

      if (!originCoords && selectedFrom.placeId !== 'current_location') {
        const fromDetails = await googleMapsService.getPlaceDetails(selectedFrom.placeId);
        originCoords = fromDetails.place.location;
      }

      if (!destCoords) {
        const toDetails = await googleMapsService.getPlaceDetails(selectedTo.placeId);
        destCoords = toDetails.place.location;
      }

      // Calculate route with Google Maps
      const routeResult = await googleMapsService.calculateRoute(
        originCoords,
        destCoords,
        selectedTravelMode,
        {
          alternatives: true,
          avoid: 'tolls'
        }
      );

      if (routeResult.success) {
        setRoutes(routeResult.routes);
      } else {
        setError('No routes found between these locations.');
      }
    } catch (error) {
      console.error('Route calculation error:', error);
      setError(`Failed to calculate route: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Swap locations
  const swapLocations = () => {
    const tempLocation = fromLocation;
    const tempSelected = selectedFrom;
    setFromLocation(toLocation);
    setToLocation(tempLocation);
    setSelectedFrom(selectedTo);
    setSelectedTo(tempSelected);
    setFromSuggestions([]);
    setToSuggestions([]);
  };

  // Format time based on minutes
  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins} mins`;
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <FaRoute className="text-2xl text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-800">Route Calculator</h2>
        <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
          Powered by Google Maps
        </span>
      </div>

      {/* Location Input Section */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* From Location */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            From Location
          </label>
          <div className="relative">
            <FaMapMarkerAlt className="absolute left-3 top-3 text-green-500" />
            <input
              type="text"
              value={fromLocation}
              onChange={(e) => {
                setFromLocation(e.target.value);
                setSelectedFrom(null);
                setUseCurrentLocation(false);
              }}
              placeholder="Enter starting location"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={getCurrentLocation}
              className="absolute right-2 top-2 p-1 text-blue-500 hover:text-blue-700"
              title="Use current location"
            >
              <FaLocationArrow />
            </button>
          </div>
          
          {/* From Suggestions */}
          {fromSuggestions.length > 0 && !selectedFrom && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {fromSuggestions.map((suggestion) => (
                <button
                  key={suggestion.placeId}
                  onClick={() => {
                    setFromLocation(suggestion.description);
                    setSelectedFrom(suggestion);
                    setFromSuggestions([]);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                >
                  <div className="font-medium">{suggestion.mainText}</div>
                  <div className="text-sm text-gray-500">{suggestion.secondaryText}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* To Location */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            To Location
          </label>
          <div className="relative">
            <FaMapMarkerAlt className="absolute left-3 top-3 text-red-500" />
            <input
              type="text"
              value={toLocation}
              onChange={(e) => {
                setToLocation(e.target.value);
                setSelectedTo(null);
              }}
              placeholder="Enter destination"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          {/* To Suggestions */}
          {toSuggestions.length > 0 && !selectedTo && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {toSuggestions.map((suggestion) => (
                <button
                  key={suggestion.placeId}
                  onClick={() => {
                    setToLocation(suggestion.description);
                    setSelectedTo(suggestion);
                    setToSuggestions([]);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                >
                  <div className="font-medium">{suggestion.mainText}</div>
                  <div className="text-sm text-gray-500">{suggestion.secondaryText}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Swap Button */}
      <div className="flex justify-center mb-6">
        <button
          onClick={swapLocations}
          className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
          title="Swap locations"
        >
          <FaExchangeAlt className="text-gray-600" />
        </button>
      </div>

      {/* Travel Mode Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Travel Mode
        </label>
        <div className="flex gap-2 flex-wrap">
          {travelModes.map((mode) => {
            const IconComponent = mode.icon;
            return (
              <button
                key={mode.id}
                onClick={() => setSelectedTravelMode(mode.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  selectedTravelMode === mode.id
                    ? `${mode.color} text-white shadow-lg transform scale-105`
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <IconComponent />
                <span className="font-medium">{mode.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Calculate Button */}
      <div className="mb-6">
        <button
          onClick={calculateRoute}
          disabled={loading || !selectedFrom || !selectedTo}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin" />
              Calculating Route...
            </>
          ) : (
            <>
              <FaRoute />
              Calculate Route
            </>
          )}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Routes Results */}
      {routes.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Route Options</h3>
          {routes.map((route, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-50 rounded-lg p-6 border border-gray-200"
            >
              {/* Route Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-semibold text-lg text-gray-800">
                    Route {index + 1}
                    {route.summary && (
                      <span className="text-sm text-gray-600 ml-2">
                        via {route.summary}
                      </span>
                    )}
                  </h4>
                  <div className="flex gap-4 text-sm text-gray-600 mt-1">
                    <span>📍 {route.distance.text}</span>
                    <span>⏱️ {route.duration.text}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Best Price</div>
                  <div className="text-xl font-bold text-green-600">
                    {formatCurrency(
                      Math.min(
                        ...Object.values(route.pricing).map(p => p.estimatedFare)
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Transportation Options */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(route.pricing).map(([mode, pricing]) => (
                  <div
                    key={mode}
                    className="bg-white rounded-lg p-4 border border-gray-200"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {mode === 'auto' && <FaCar className="text-blue-500" />}
                      {mode === 'bike' && <FaMotorcycle className="text-green-500" />}
                      {mode === 'bus' && <FaBus className="text-yellow-500" />}
                      {mode === 'cab' && <FaCar className="text-purple-500" />}
                      {mode === 'walking' && <FaWalking className="text-gray-500" />}
                      <span className="font-medium capitalize">{mode}</span>
                    </div>
                    <div className="text-lg font-bold text-gray-800">
                      {formatCurrency(pricing.estimatedFare)}
                    </div>
                    <div className="text-sm text-gray-500">
                      🕒 {pricing.details.estimatedTime}
                    </div>
                    {pricing.details.surgeFactor > 1 && (
                      <div className="text-xs text-red-500 mt-1">
                        ⚡ Surge: {pricing.details.surgeFactor}x
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Route Steps (collapsible) */}
              <details className="mt-4">
                <summary className="cursor-pointer font-medium text-blue-600 hover:text-blue-800">
                  View Detailed Directions ({route.steps.length} steps)
                </summary>
                <div className="mt-3 space-y-2 max-h-60 overflow-y-auto">
                  {route.steps.map((step, stepIndex) => (
                    <div
                      key={stepIndex}
                      className="flex gap-3 p-2 bg-white rounded border border-gray-100"
                    >
                      <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                        {stepIndex + 1}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-gray-800">{step.instruction}</div>
                        <div className="text-xs text-gray-500">
                          {step.distance} • {step.duration}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </details>
            </motion.div>
          ))}
        </div>
      )}

      {/* API Key Notice */}
      {!googleMapsService.isApiKeyValid && (
        <div className="mt-6 p-4 bg-yellow-100 border border-yellow-300 text-yellow-800 rounded-lg">
          <strong>Notice:</strong> Google Maps API key is not configured. 
          Please add your API key to the .env.local file to enable route calculation.
        </div>
      )}
    </div>
  );
};

export default GoogleMapsRouteCalculator;
