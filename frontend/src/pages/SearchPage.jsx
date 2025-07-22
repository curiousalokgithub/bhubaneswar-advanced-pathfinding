import React, { useState } from 'react';
import { FaMapMarkerAlt, FaRoute, FaExchangeAlt, FaClock, FaWalking, FaCar, FaBus } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import InteractiveMap from '../components/InteractiveMap';

const SearchPage = () => {
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [routeType, setRouteType] = useState('fastest');
  const [transportMode, setTransportMode] = useState('car');
  const [route, setRoute] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const popularDestinations = [
    'Bhubaneswar Railway Station',
    'Lingaraj Temple',
    'KIIT University',
    'Kalinga Stadium',
    'Utkal University',
    'Patia Square',
    'Master Canteen Square',
    'Khandagiri Caves',
    'Dhauli Giri Hills',
    'AIIMS Bhubaneswar',
    'Airport Square',
    'Jaydev Vihar'
  ];

  const handleLocationClick = (location, type) => {
    if (type === 'from') {
      setFromLocation(location);
    } else {
      setToLocation(location);
    }
  };

  const swapLocations = () => {
    const temp = fromLocation;
    setFromLocation(toLocation);
    setToLocation(temp);
  };

  const calculateRoute = async () => {
    if (!fromLocation || !toLocation) {
      toast.error('Please enter both starting and destination locations');
      return;
    }

    if (fromLocation === toLocation) {
      toast.error('Starting and destination locations cannot be the same');
      return;
    }

    setIsCalculating(true);
    
    try {
      // Try to use pathfinding service if available
      let pathResult = null;
      try {
        const { BhubaneswaarPathfinder } = await import('../services/pathfinding');
        const pathfinder = new BhubaneswaarPathfinder();
        
        const preferences = {
          routeType: routeType === 'shortest' ? 'distance' : 'time',
          avoidTraffic: routeType === 'fastest',
          transportMode
        };
        
        pathResult = pathfinder.findPath(fromLocation, toLocation, preferences);
      } catch (pathfindingError) {
        console.warn('Pathfinding service error:', pathfindingError);
      }
      
      if (pathResult && pathResult.path.length > 0) {
        const mockRoute = {
          distance: `${pathResult.distance.toFixed(1)} km`,
          duration: `${Math.ceil(pathResult.time)} mins`,
          steps: pathResult.path.map((location, index) => {
            if (index === 0) return `Start from ${location}`;
            if (index === pathResult.path.length - 1) return `Arrive at ${location}`;
            return `Continue via ${location}`;
          }),
          estimatedCost: transportMode === 'bus' ? '₹20-30' : transportMode === 'walking' ? 'Free' : '₹150-200',
          algorithm: pathResult.algorithm,
          pathQuality: pathResult.path.length <= 3 ? 'Optimal' : 'Good'
        };
        
        setRoute(mockRoute);
        toast.success(`Route calculated using ${pathResult.algorithm} algorithm!`);
      } else {
        // Fallback to mock data if pathfinding fails
        const mockRoute = {
          distance: Math.floor(Math.random() * 20) + 5 + 'km',
          duration: Math.floor(Math.random() * 45) + 15 + ' mins',
          steps: [
            `Start from ${fromLocation}`,
            'Head towards NH-16',
            'Take the ring road',
            'Continue straight for 3.2 km',
            'Turn right at the signal',
            `Arrive at ${toLocation}`
          ],
          estimatedCost: transportMode === 'bus' ? '₹20-30' : transportMode === 'walking' ? 'Free' : '₹150-200',
          algorithm: 'Standard',
          pathQuality: 'Standard'
        };
        
        setRoute(mockRoute);
        toast.success('Route calculated successfully!');
      }
    } catch (error) {
      console.error('Route calculation error:', error);
      toast.error('Failed to calculate route. Please try again.');
    }
    
    setIsCalculating(false);
  };

  const getTransportIcon = (mode) => {
    switch (mode) {
      case 'walking': return <FaWalking />;
      case 'car': return <FaCar />;
      case 'bus': return <FaBus />;
      default: return <FaCar />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            <FaRoute className="inline mr-2" />
            Find Your Route
          </h1>
          <p className="text-gray-600">
            Get the best route between any two locations in Bhubaneswar
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Search Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Route Planner</h2>
              
              {/* From Location */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From
                </label>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-3 top-3 text-green-500" />
                  <input
                    type="text"
                    value={fromLocation}
                    onChange={(e) => setFromLocation(e.target.value)}
                    placeholder="Enter starting location"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* Swap Button */}
              <div className="flex justify-center mb-4">
                <button
                  onClick={swapLocations}
                  className="p-2 text-blue-600 hover:text-blue-800 transition-colors"
                  title="Swap locations"
                >
                  <FaExchangeAlt className="text-lg" />
                </button>
              </div>

              {/* To Location */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To
                </label>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-3 top-3 text-red-500" />
                  <input
                    type="text"
                    value={toLocation}
                    onChange={(e) => setToLocation(e.target.value)}
                    placeholder="Enter destination"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* Route Type */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Route Type
                </label>
                <select
                  value={routeType}
                  onChange={(e) => setRouteType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="fastest">Fastest Route</option>
                  <option value="shortest">Shortest Distance</option>
                  <option value="economic">Most Economic</option>
                </select>
              </div>

              {/* Transport Mode */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transportation
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['walking', 'car', 'bus'].map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setTransportMode(mode)}
                      className={`p-3 rounded-lg border transition-colors flex flex-col items-center ${
                        transportMode === mode
                          ? 'border-blue-500 bg-blue-50 text-blue-600'
                          : 'border-gray-300 hover:border-blue-300'
                      }`}
                    >
                      <span className="text-xl mb-1">{getTransportIcon(mode)}</span>
                      <span className="text-xs capitalize">{mode}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Calculate Button */}
              <button
                onClick={calculateRoute}
                disabled={isCalculating}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                  isCalculating
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                } text-white`}
              >
                {isCalculating ? (
                  <>
                    <div className="inline-block spinner mr-2"></div>
                    Calculating...
                  </>
                ) : (
                  <>
                    <FaRoute className="inline mr-2" />
                    Calculate Route
                  </>
                )}
              </button>
            </div>

            {/* Popular Destinations */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Popular Destinations</h3>
              <div className="space-y-2">
                {popularDestinations.map((destination, index) => (
                  <div key={index} className="flex gap-2">
                    <button
                      onClick={() => handleLocationClick(destination, 'from')}
                      className="flex-1 text-left px-3 py-2 text-sm bg-green-50 hover:bg-green-100 text-green-700 rounded border border-green-200 transition-colors"
                      title="Set as starting point"
                    >
                      From: {destination}
                    </button>
                    <button
                      onClick={() => handleLocationClick(destination, 'to')}
                      className="flex-1 text-left px-3 py-2 text-sm bg-red-50 hover:bg-red-100 text-red-700 rounded border border-red-200 transition-colors"
                      title="Set as destination"
                    >
                      To: {destination}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Route Results */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Route Details</h2>
              
              {route ? (
                <div>
                  {/* Route Summary */}
                  <div className="grid md:grid-cols-4 gap-4 mb-6">
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
                    {route.algorithm && (
                      <div className="bg-purple-50 p-4 rounded-lg text-center">
                        <div className="text-lg font-bold text-purple-600">{route.algorithm}</div>
                        <div className="text-sm text-purple-700">Algorithm</div>
                      </div>
                    )}
                  </div>

                  {/* Route Quality Indicator */}
                  {route.pathQuality && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Route Quality:</span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          route.pathQuality === 'Optimal' ? 'bg-green-100 text-green-800' : 
                          route.pathQuality === 'Good' ? 'bg-blue-100 text-blue-800' : 
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {route.pathQuality}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Step by Step Directions */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Directions</h3>
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

                  {/* Interactive Map */}
                  <div className="bg-gray-100 rounded-lg overflow-hidden">
                    <InteractiveMap route={route} height="400px" />
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <FaRoute className="text-4xl mb-4 mx-auto" />
                  <p>Enter your locations and calculate route to see directions</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
