import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaRoute, FaExchangeAlt, FaClock, FaWalking, FaCar, FaBus, FaLocationArrow, FaSearch, FaTimes, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import InteractiveMap from '../components/InteractiveMap';
import { pathfindingAPI, routesAPI, locationsAPI, systemAPI } from '../services/api';

const EnhancedSearchPage = () => {
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [fromCoords, setFromCoords] = useState(null);
  const [toCoords, setToCoords] = useState(null);
  const [routeType, setRouteType] = useState('fastest');
  const [transportMode, setTransportMode] = useState('car');
  const [route, setRoute] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locations, setLocations] = useState([]);
  const [locationCategories, setLocationCategories] = useState([]);
  const [transportModes, setTransportModes] = useState([]);
  const [apiStatus, setApiStatus] = useState('checking');
  const [allPricing, setAllPricing] = useState(null);

  // Load locations and check API status on component mount
  useEffect(() => {
    checkAPIStatus();
    loadLocations();
    loadTransportModes();
  }, []);

  const checkAPIStatus = async () => {
    try {
      const health = await systemAPI.getHealth();
      setApiStatus(health.status === 'OK' ? 'connected' : 'error');
    } catch (error) {
      setApiStatus('error');
      console.error('API health check failed:', error);
    }
  };

  const loadLocations = async () => {
    try {
      const categoriesData = await locationsAPI.getCategories();
      const locationsData = await locationsAPI.getAllLocations();
      
      setLocationCategories([
        { id: 'all', name: 'All Categories', icon: '📍' },
        ...categoriesData.categories?.map(cat => ({ 
          id: cat.id, 
          name: cat.name, 
          icon: cat.icon 
        })) || []
      ]);
      
      // Flatten locations from all categories
      const allLocations = [];
      if (locationsData.data?.categories) {
        Object.values(locationsData.data.categories).forEach(category => {
          category.locations?.forEach(location => {
            allLocations.push({
              ...location,
              categoryName: category.name
            });
          });
        });
      }
      setLocations(allLocations);
    } catch (error) {
      console.error('Failed to load locations:', error);
      toast.error('Failed to load locations');
      // Fallback to empty arrays
      setLocations([]);
      setLocationCategories([{ id: 'all', name: 'All Categories', icon: '📍' }]);
    }
  };

  const loadTransportModes = () => {
    setTransportModes([
      { id: 'walking', name: 'Walking', icon: '🚶', color: 'green', speed: 5 },
      { id: 'cycling', name: 'Cycling', icon: '🚴', color: 'blue', speed: 15 },
      { id: 'auto', name: 'Auto', icon: '🛺', color: 'yellow', speed: 25 },
      { id: 'bus', name: 'Bus', icon: '🚌', color: 'red', speed: 20 },
      { id: 'car', name: 'Car', icon: '🚗', color: 'gray', speed: 40 },
      { id: 'bike', name: 'Bike', icon: '🏍️', color: 'purple', speed: 35 }
    ]);
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'temple': '🛕',
      'hospital': '🏥',
      'education': '🎓',
      'transport': '🚌',
      'shopping': '🛒',
      'restaurant': '🍽️',
      'tourist': '🏛️',
      'landmark': '📍'
    };
    return icons[category.toLowerCase()] || '📍';
  };

  // Get current location
  const getCurrentLocation = () => {
    setIsDetectingLocation(true);
    
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by this browser');
      setIsDetectingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setFromLocation('Your Current Location');
        setFromCoords([latitude, longitude]);
        toast.success('Current location detected!');
        setIsDetectingLocation(false);
      },
      (error) => {
        setIsDetectingLocation(false);
        let errorMessage = 'Unable to get your location';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timeout';
            break;
          default:
            errorMessage = 'An unknown error occurred';
            break;
        }
        
        toast.error(errorMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  // Filter locations based on search query and category
  const getFilteredLocations = (query = '') => {
    let filteredLocations = locations;
    
    if (selectedCategory !== 'all') {
      filteredLocations = locations.filter(loc => loc.category === selectedCategory);
    }
    
    if (query.trim()) {
      filteredLocations = filteredLocations.filter(location =>
        location.name.toLowerCase().includes(query.toLowerCase()) ||
        location.type?.toLowerCase().includes(query.toLowerCase()) ||
        location.category?.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    return filteredLocations.slice(0, 10); // Limit to 10 suggestions
  };

  // Handle location selection
  const handleLocationSelect = (location, field) => {
    if (field === 'from') {
      setFromLocation(location.name);
      setFromCoords(location.coords);
      setShowFromSuggestions(false);
    } else {
      setToLocation(location.name);
      setToCoords(location.coords);
      setShowToSuggestions(false);
    }
  };

  // Swap locations
  const swapLocations = () => {
    const tempLocation = fromLocation;
    const tempCoords = fromCoords;
    
    setFromLocation(toLocation);
    setFromCoords(toCoords);
    
    setToLocation(tempLocation);
    setToCoords(tempCoords);
  };

  // Calculate route using backend API
  const calculateRoute = async () => {
    if (!fromLocation || !toLocation) {
      toast.error('Please select both starting point and destination');
      return;
    }

    if (fromLocation === toLocation) {
      toast.error('Starting point and destination cannot be the same');
      return;
    }

    if (!fromCoords || !toCoords) {
      toast.error('Please select valid locations with coordinates');
      return;
    }

    if (apiStatus !== 'connected') {
      toast.error('Backend server is not available. Please try again later.');
      return;
    }

    setIsCalculating(true);
    
    try {
      // Calculate route using backend API
      const routeData = await routesAPI.calculateRoute({
        fromCoords,
        toCoords,
        transportMode,
        routePreference: routeType,
        timeOfDay: 'normal'
      });

      // Get pricing for all transport modes
      const pricingData = await routesAPI.getAllPricing(fromCoords, toCoords);
      setAllPricing(pricingData);

      // Format the route for display
      const formattedRoute = {
        ...routeData.route,
        fromLocation,
        toLocation,
        fromCoords,
        toCoords,
        transportMode,
        allPricing: pricingData.pricing
      };

      setRoute(formattedRoute);
      toast.success('Route calculated successfully!');
    } catch (error) {
      console.error('Route calculation failed:', error);
      toast.error(`Failed to calculate route: ${error.message}`);
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">Enhanced Pathfinding</h1>
          <p className="text-blue-100">Find the best routes with real-time calculations and dynamic pricing</p>
          
          {/* API Status Indicator */}
          <div className="mt-4 flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${
              apiStatus === 'connected' ? 'bg-green-400' : 
              apiStatus === 'checking' ? 'bg-yellow-400' : 'bg-red-400'
            }`}></div>
            <span className="text-sm">
              {apiStatus === 'connected' ? 'Backend Connected' : 
               apiStatus === 'checking' ? 'Checking Connection...' : 'Backend Offline'}
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Search Panel */}
          <div className="space-y-6">
            {/* Location Inputs */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <FaRoute className="mr-2 text-blue-600" />
                Route Planning
              </h2>

              {/* From Location */}
              <div className="relative mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={fromLocation}
                    onChange={(e) => {
                      setFromLocation(e.target.value);
                      setShowFromSuggestions(true);
                    }}
                    onFocus={() => setShowFromSuggestions(true)}
                    placeholder="Enter starting location..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={getCurrentLocation}
                    disabled={isDetectingLocation}
                    className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
                    title="Use current location"
                  >
                    {isDetectingLocation ? <FaSpinner className="animate-spin" /> : <FaLocationArrow />}
                  </button>
                </div>

                {/* From Suggestions */}
                {showFromSuggestions && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {getFilteredLocations(fromLocation).map((location, index) => (
                      <div
                        key={index}
                        onClick={() => handleLocationSelect(location, 'from')}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                      >
                        <span className="mr-2">{getCategoryIcon(location.category)}</span>
                        <div>
                          <div className="font-medium">{location.name}</div>
                          <div className="text-sm text-gray-500">{location.category}</div>
                        </div>
                      </div>
                    ))}
                    {getFilteredLocations(fromLocation).length === 0 && (
                      <div className="px-4 py-2 text-gray-500">No locations found</div>
                    )}
                  </div>
                )}
              </div>

              {/* Swap Button */}
              <div className="flex justify-center mb-4">
                <button
                  onClick={swapLocations}
                  className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                  title="Swap locations"
                >
                  <FaExchangeAlt className="text-gray-600" />
                </button>
              </div>

              {/* To Location */}
              <div className="relative mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To
                </label>
                <input
                  type="text"
                  value={toLocation}
                  onChange={(e) => {
                    setToLocation(e.target.value);
                    setShowToSuggestions(true);
                  }}
                  onFocus={() => setShowToSuggestions(true)}
                  placeholder="Enter destination..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />

                {/* To Suggestions */}
                {showToSuggestions && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {getFilteredLocations(toLocation).map((location, index) => (
                      <div
                        key={index}
                        onClick={() => handleLocationSelect(location, 'to')}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                      >
                        <span className="mr-2">{getCategoryIcon(location.category)}</span>
                        <div>
                          <div className="font-medium">{location.name}</div>
                          <div className="text-sm text-gray-500">{location.category}</div>
                        </div>
                      </div>
                    ))}
                    {getFilteredLocations(toLocation).length === 0 && (
                      <div className="px-4 py-2 text-gray-500">No locations found</div>
                    )}
                  </div>
                )}
              </div>

              {/* Transport Mode Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transport Mode
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {transportModes.map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => setTransportMode(mode.id)}
                      className={`p-3 rounded-lg border flex flex-col items-center transition-colors ${
                        transportMode === mode.id
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-lg mb-1">{mode.icon}</span>
                      <span className="text-xs">{mode.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Route Type */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Route Preference
                </label>
                <select
                  value={routeType}
                  onChange={(e) => setRouteType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="fastest">Fastest Route</option>
                  <option value="shortest">Shortest Distance</option>
                  <option value="scenic">Scenic Route</option>
                  <option value="economical">Most Economical</option>
                </select>
              </div>

              {/* Calculate Button */}
              <button
                onClick={calculateRoute}
                disabled={isCalculating || !fromLocation || !toLocation}
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isCalculating ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Calculating Route...
                  </>
                ) : (
                  <>
                    <FaRoute className="mr-2" />
                    Calculate Route
                  </>
                )}
              </button>
            </div>

            {/* Route Result */}
            {route && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <FaClock className="mr-2 text-green-600" />
                  Route Details
                </h3>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{route.distance}</div>
                    <div className="text-sm text-gray-600">Distance</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{route.duration}</div>
                    <div className="text-sm text-gray-600">Duration</div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Estimated Cost:</span>
                    <span className="text-lg font-bold text-green-600">{route.estimatedCost}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Transport:</span>
                    <span className="capitalize">{route.transportMode}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Route Quality:</span>
                    <span className={`px-2 py-1 rounded text-sm ${
                      route.pathQuality === 'Excellent' ? 'bg-green-100 text-green-800' :
                      route.pathQuality === 'Good' ? 'bg-blue-100 text-blue-800' :
                      route.pathQuality === 'Average' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {route.pathQuality}
                    </span>
                  </div>
                </div>

                {route.steps && (
                  <div>
                    <h4 className="font-medium mb-2">Route Steps:</h4>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                      {route.steps.map((step, index) => (
                        <li key={index}>{step}</li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            )}

            {/* All Transport Pricing */}
            {allPricing && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <FaMoneyBillWave className="mr-2 text-yellow-600" />
                  Pricing Comparison
                </h3>
                
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(allPricing).map(([mode, pricing]) => (
                    <div key={mode} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="capitalize font-medium">{RouteUtils.getTransportIcon(mode)} {mode}</span>
                        <span className="font-bold text-green-600">
                          {RouteUtils.formatPriceRange(pricing)}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {pricing.type} • {pricing.duration}min
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Map Panel */}
          <div className="lg:sticky lg:top-4">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden h-96 lg:h-[600px]">
              <InteractiveMap
                fromCoords={fromCoords}
                toCoords={toCoords}
                locations={locations}
                route={route}
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Click outside to close suggestions */}
      {(showFromSuggestions || showToSuggestions) && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => {
            setShowFromSuggestions(false);
            setShowToSuggestions(false);
          }}
        />
      )}
    </div>
  );
};

export default EnhancedSearchPage;
