import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaRoute, FaExchangeAlt, FaClock, FaWalking, FaCar, FaBus, FaLocationArrow, FaSearch, FaTimes, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import InteractiveMap from '../components/InteractiveMap';
import pathfindingAPI, { RouteUtils } from '../services/pathfindingAPI';

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
  const [locationCategories, setLocationCategories] = useState({});
  const [transportModes, setTransportModes] = useState([]);
  const [apiStatus, setApiStatus] = useState('checking');
  const [allPricing, setAllPricing] = useState(null);

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
            errorMessage = 'Location request timed out';
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

  // Load locations and check API status on component mount
  useEffect(() => {
    const initializeApp = async () => {
      loadTransportModes();
      await checkAPIStatus();
      setTimeout(() => loadLocations(), 500);
    };
    
    initializeApp();
  }, []);

  const checkAPIStatus = async () => {
    try {
      const health = await pathfindingAPI.checkHealth();
      if (health && health.status === 'OK') {
        setApiStatus('connected');
        toast.success('✅ Backend connected successfully!');
      } else {
        setApiStatus('error');
        toast.error('Backend server not available. Using demo mode.');
      }
    } catch (error) {
      console.error('API health check failed:', error);
      setApiStatus('error');
      toast.error('Backend server not available. Using demo mode.');
    }
  };

  const loadLocations = async () => {
    try {
      if (apiStatus === 'connected') {
        const data = await pathfindingAPI.getLocations();
        let flattenedLocations = [];
        if (data && data.categories) {
          // Set the categories
          setLocationCategories(data.categories);
          
          Object.keys(data.categories).forEach(categoryKey => {
            const category = data.categories[categoryKey];
            if (category && category.locations) {
              const categoryLocations = category.locations.map(loc => ({
                ...loc,
                category: categoryKey,
                categoryName: category.name
              }));
              flattenedLocations = [...flattenedLocations, ...categoryLocations];
            }
          });
        }
        setLocations(flattenedLocations);
        console.log('✅ Loaded locations from backend:', flattenedLocations.length);
      } else {
        loadFallbackData();
      }
    } catch (error) {
      console.error('❌ Failed to load locations:', error);
      loadFallbackData();
    }
  };

  const loadFallbackData = () => {
    const fallbackLocations = [
      { id: 1, name: 'Lingaraj Temple', coords: [20.2372, 85.8344], category: 'landmarks', type: 'Religious' },
      { id: 2, name: 'KIIT University', coords: [20.3558, 85.8166], category: 'educational', type: 'University' },
      { id: 3, name: 'AIIMS Bhubaneswar', coords: [20.1847, 85.8064], category: 'healthcare', type: 'Hospital' },
      { id: 4, name: 'Bhubaneswar Railway Station', coords: [20.2647, 85.8341], category: 'publicTransport', type: 'Railway Station' },
      { id: 5, name: 'Esplanade One Mall', coords: [20.2961, 85.8245], category: 'shopping', type: 'Mall' }
    ];
    setLocations(fallbackLocations);

    // Set up fallback categories
    const fallbackCategories = {
      landmarks: {
        name: 'Landmarks & Heritage',
        icon: '🏛️',
        locations: fallbackLocations.filter(loc => loc.category === 'landmarks')
      },
      educational: {
        name: 'Educational',
        icon: '🎓',
        locations: fallbackLocations.filter(loc => loc.category === 'educational')
      },
      healthcare: {
        name: 'Healthcare',
        icon: '🏥',
        locations: fallbackLocations.filter(loc => loc.category === 'healthcare')
      },
      publicTransport: {
        name: 'Public Transport',
        icon: '🚌',
        locations: fallbackLocations.filter(loc => loc.category === 'publicTransport')
      },
      shopping: {
        name: 'Shopping',
        icon: '🛍️',
        locations: fallbackLocations.filter(loc => loc.category === 'shopping')
      }
    };
    setLocationCategories(fallbackCategories);
  };

  const loadTransportModes = () => {
    setTransportModes([
      { id: 'walking', name: 'Walking', icon: '🚶', color: 'green' },
      { id: 'cycling', name: 'Cycling', icon: '🚴', color: 'blue' },
      { id: 'auto', name: 'Auto', icon: '🛺', color: 'yellow' },
      { id: 'bus', name: 'Bus', icon: '🚌', color: 'red' },
      { id: 'car', name: 'Car', icon: '🚗', color: 'gray' },
      { id: 'bike', name: 'Bike', icon: '🏍️', color: 'purple' }
    ]);
  };

  // Get all locations for suggestions
  const getAllLocations = () => {
    return locations;
  };

  // Filter locations based on search query and category
  const getFilteredLocations = (query = '') => {
    let locations = getAllLocations();
    
    if (selectedCategory !== 'all') {
      locations = locationCategories[selectedCategory]?.locations || [];
    }
    
    if (query.trim()) {
      locations = locations.filter(location =>
        location.name.toLowerCase().includes(query.toLowerCase()) ||
        location.type.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    return locations.slice(0, 10); // Limit to 10 suggestions
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

  // Calculate route
  const calculateRoute = async () => {
    if (!fromLocation || !toLocation) {
      toast.error('Please select both starting point and destination');
      return;
    }

    if (fromLocation === toLocation) {
      toast.error('Starting point and destination cannot be the same');
      return;
    }

    setIsCalculating(true);
    
    try {
      // Simulate route calculation with transport mode considerations
      const selectedTransport = transportModes[transportMode];
      const distance = Math.random() * 15 + 5; // 5-20 km
      const timeInMinutes = (distance / selectedTransport.speed) * 60;
      
      const mockRoute = {
        distance: `${distance.toFixed(1)} km`,
        duration: `${Math.ceil(timeInMinutes)} mins`,
        transportMode: selectedTransport.name,
        steps: [
          `Start from ${fromLocation}`,
          transportMode === 'walking' ? 'Head towards the nearest pedestrian path' : 
          transportMode === 'bus' ? 'Walk to nearest bus stop' :
          transportMode === 'auto' ? 'Wait for auto rickshaw' : 'Get your vehicle ready',
          transportMode === 'bus' ? `Take ${getBusRoute()} bus` : 'Follow the main route',
          'Continue straight for 2.5 km',
          transportMode === 'bus' ? 'Get down at nearest stop to destination' : 'Turn right at the signal',
          `Arrive at ${toLocation}`
        ],
        estimatedCost: getTransportCost(transportMode, distance),
        algorithm: 'Optimized',
        pathQuality: distance <= 10 ? 'Optimal' : 'Good',
        fromCoords,
        toCoords,
        transportFeatures: selectedTransport.features
      };
      
      setRoute(mockRoute);
      toast.success(`Route calculated for ${selectedTransport.name}!`);
    } catch (error) {
      toast.error('Failed to calculate route. Please try again.');
      console.error('Route calculation error:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  // Get transport cost
  const getTransportCost = (mode, distance) => {
    const costs = {
      walking: 'Free',
      cycling: 'Free',
      auto: `₹${Math.ceil(distance * 8)}-${Math.ceil(distance * 12)}`,
      bus: '₹10-30',
      car: `₹${Math.ceil(distance * 6)}-${Math.ceil(distance * 10)}`,
      bike: `₹${Math.ceil(distance * 4)}-${Math.ceil(distance * 8)}`
    };
    return costs[mode] || '₹50-100';
  };

  // Get bus route suggestion
  const getBusRoute = () => {
    const routes = ['Route 1A', 'Route 2B', 'Route 5', 'Route 7', 'Route 12'];
    return routes[Math.floor(Math.random() * routes.length)];
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Advanced Route Planner
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
            Find the best routes in Bhubaneswar with real-time pathfinding algorithms
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Route Planning Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Location Inputs */}
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Plan Your Route</h2>
              
              {/* From Location */}
              <div className="mb-4 relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From
                </label>
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={fromLocation}
                      onChange={(e) => {
                        setFromLocation(e.target.value);
                        setShowFromSuggestions(true);
                        setSearchQuery(e.target.value);
                      }}
                      onFocus={() => setShowFromSuggestions(true)}
                      placeholder="Enter starting location..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                    
                    {/* From Suggestions */}
                    {showFromSuggestions && (
                      <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                        {getFilteredLocations(fromLocation).map((location, index) => (
                          <button
                            key={index}
                            onClick={() => handleLocationSelect(location, 'from')}
                            className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between border-b border-gray-100 last:border-b-0"
                          >
                            <div>
                              <div className="font-medium text-gray-900">{location.name}</div>
                              <div className="text-sm text-gray-600">{location.type}</div>
                            </div>
                            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                              {Object.keys(locationCategories).find(key => 
                                locationCategories[key].locations.includes(location)
                              )}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={getCurrentLocation}
                    disabled={isDetectingLocation}
                    className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors flex items-center"
                    title="Use current location"
                  >
                    {isDetectingLocation ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <FaLocationArrow />
                    )}
                  </button>
                </div>
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
              <div className="mb-4 relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To
                </label>
                <input
                  type="text"
                  value={toLocation}
                  onChange={(e) => {
                    setToLocation(e.target.value);
                    setShowToSuggestions(true);
                    setSearchQuery(e.target.value);
                  }}
                  onFocus={() => setShowToSuggestions(true)}
                  placeholder="Enter destination..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
                
                {/* To Suggestions */}
                {showToSuggestions && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                    {getFilteredLocations(toLocation).map((location, index) => (
                      <button
                        key={index}
                        onClick={() => handleLocationSelect(location, 'to')}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between border-b border-gray-100 last:border-b-0"
                      >
                        <div>
                          <div className="font-medium text-gray-900">{location.name}</div>
                          <div className="text-sm text-gray-600">{location.type}</div>
                        </div>
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                          {Object.keys(locationCategories).find(key => 
                            locationCategories[key].locations.includes(location)
                          )}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Category Filter */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="all">All Categories</option>
                  {Object.entries(locationCategories).map(([key, category]) => (
                    <option key={key} value={key}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Transport Mode Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Transport Mode
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {Object.entries(transportModes).map(([key, mode]) => (
                    <button
                      key={key}
                      onClick={() => setTransportMode(key)}
                      className={`p-3 rounded-lg border-2 transition-all text-center ${
                        transportMode === key
                          ? `border-blue-500 bg-blue-50 text-blue-700`
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-lg mb-1">{mode.icon}</div>
                      <div className="text-xs font-medium">{mode.name}</div>
                      <div className="text-xs text-gray-500">{mode.speed}km/h</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Route Options */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Route Preference
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setRouteType('fastest')}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      routeType === 'fastest'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <FaClock className="mx-auto mb-1" />
                    <div className="text-sm font-medium">Fastest</div>
                  </button>
                  <button
                    onClick={() => setRouteType('shortest')}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      routeType === 'shortest'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <FaRoute className="mx-auto mb-1" />
                    <div className="text-sm font-medium">Shortest</div>
                  </button>
                </div>
              </div>

              {/* Calculate Button */}
              <button
                onClick={calculateRoute}
                disabled={isCalculating || !fromLocation || !toLocation}
                className={`w-full font-medium py-3 px-4 rounded-lg transition-colors ${
                  isCalculating || !fromLocation || !toLocation
                    ? 'bg-gray-400 cursor-not-allowed text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {isCalculating ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Calculating...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <FaRoute className="mr-2" />
                    Calculate Route
                  </div>
                )}
              </button>
            </div>

            {/* Location Categories Quick Access */}
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Access</h3>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(locationCategories).map(([key, category]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedCategory(key)}
                    className={`p-3 rounded-lg border-2 transition-all text-center ${
                      selectedCategory === key
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                    style={{ borderColor: selectedCategory === key ? category.color : undefined }}
                  >
                    <div className="text-2xl mb-1">{category.icon}</div>
                    <div className="text-sm font-medium text-gray-900">{category.name}</div>
                    <div className="text-xs text-gray-500">
                      {category.locations.length} locations
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Route Results and Map */}
          <div className="lg:col-span-2 space-y-6">
            {/* Interactive Map */}
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Interactive Map</h2>
              <InteractiveMap 
                route={route} 
                height="400px" 
                showAllLocations={!route}
                fromCoords={fromCoords}
                toCoords={toCoords}
              />
            </div>

            {/* Route Details */}
            {route && (
              <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Route Details</h2>
                
                {/* Route Summary */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600">{route.distance}</div>
                    <div className="text-sm text-blue-700">Distance</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">{route.duration}</div>
                    <div className="text-sm text-green-700">Duration</div>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-orange-600">{route.estimatedCost}</div>
                    <div className="text-sm text-orange-700">Est. Cost</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg text-center">
                    <div className="text-lg font-bold text-purple-600">{route.transportMode}</div>
                    <div className="text-sm text-purple-700">Transport</div>
                  </div>
                </div>

                {/* Transport Features */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Transport Features</h3>
                  <div className="flex flex-wrap gap-2">
                    {route.transportFeatures.map((feature, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Step by Step Directions */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Step-by-Step Directions</h3>
                  <div className="space-y-3">
                    {route.steps.map((step, index) => (
                      <div key={index} className="flex items-start">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">
                          {index + 1}
                        </div>
                        <div className="text-gray-700">{step}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedSearchPage;
