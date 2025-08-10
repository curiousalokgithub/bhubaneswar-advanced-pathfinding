// Advanced Route Planning Page with Google Maps Integration
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaRoute, FaMapMarkerAlt, FaSearch, FaCog, FaInfoCircle } from 'react-icons/fa';
import GoogleMapsRouteCalculator from '../components/GoogleMapsRouteCalculator';
import googleMapsService from '../services/googleMapsService';

const AdvancedRoutePlanningPage = () => {
  const [isApiConfigured, setIsApiConfigured] = useState(false);
  const [showSetupGuide, setShowSetupGuide] = useState(false);

  useEffect(() => {
    setIsApiConfigured(googleMapsService.isApiKeyValid);
  }, []);

  const setupSteps = [
    {
      step: 1,
      title: "Get Google Maps API Key",
      description: "Visit Google Cloud Console and create a new project or select existing one",
      link: "https://console.cloud.google.com/apis/credentials"
    },
    {
      step: 2,
      title: "Enable Required APIs",
      description: "Enable Places API, Directions API, Distance Matrix API, and Geocoding API",
      apis: ["Places API", "Directions API", "Distance Matrix API", "Geocoding API"]
    },
    {
      step: 3,
      title: "Add API Key to Environment",
      description: "Add your API key to frontend/.env.local file",
      code: "VITE_GOOGLE_MAPS_API_KEY=your_actual_api_key_here"
    },
    {
      step: 4,
      title: "Restart Development Server",
      description: "Restart your development server to load the new environment variables"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FaRoute className="text-3xl text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Advanced Route Planning
                </h1>
                <p className="text-gray-600">
                  Real-time routing with Google Maps integration for Bhubaneswar
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                isApiConfigured 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  isApiConfigured ? 'bg-green-500' : 'bg-red-500'
                }`} />
                {isApiConfigured ? 'Google Maps Active' : 'API Not Configured'}
              </div>
              
              {!isApiConfigured && (
                <button
                  onClick={() => setShowSetupGuide(!showSetupGuide)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FaCog />
                  Setup Guide
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Setup Guide Modal */}
        {showSetupGuide && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 bg-white rounded-xl shadow-lg p-6 border border-blue-200"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <FaInfoCircle className="text-blue-600" />
                Google Maps API Setup Guide
              </h2>
              <button
                onClick={() => setShowSetupGuide(false)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ×
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {setupSteps.map((step) => (
                <div key={step.step} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {step.step}
                    </div>
                    <h3 className="font-semibold text-gray-800">{step.title}</h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{step.description}</p>
                  
                  {step.link && (
                    <a
                      href={step.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm underline"
                    >
                      Open Google Cloud Console →
                    </a>
                  )}
                  
                  {step.apis && (
                    <div className="mt-2">
                      <div className="text-xs text-gray-500 mb-1">APIs to enable:</div>
                      <div className="flex flex-wrap gap-1">
                        {step.apis.map((api) => (
                          <span
                            key={api}
                            className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                          >
                            {api}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {step.code && (
                    <div className="mt-2">
                      <div className="text-xs text-gray-500 mb-1">Add to .env.local:</div>
                      <code className="text-xs bg-gray-200 text-gray-800 px-2 py-1 rounded block">
                        {step.code}
                      </code>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> The Google Maps APIs have usage limits and may require billing setup 
                for production use. The first $200 of usage each month is free, which covers most development needs.
              </p>
            </div>
          </motion.div>
        )}

        {/* Features Grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-lg"
          >
            <FaMapMarkerAlt className="text-3xl text-green-500 mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">Smart Location Search</h3>
            <p className="text-gray-600">
              Search any location in Bhubaneswar with autocomplete suggestions powered by Google Places API.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-lg"
          >
            <FaRoute className="text-3xl text-blue-500 mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">Multiple Route Options</h3>
            <p className="text-gray-600">
              Get alternative routes with real-time traffic data and choose the best option for your journey.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-6 shadow-lg"
          >
            <FaSearch className="text-3xl text-purple-500 mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">Accurate Pricing</h3>
            <p className="text-gray-600">
              Get estimated costs for Auto, Bike, Bus, Cab with real-time surge pricing for Bhubaneswar.
            </p>
          </motion.div>
        </div>

        {/* Main Route Calculator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <GoogleMapsRouteCalculator />
        </motion.div>

        {/* Additional Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-white rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-4">How It Works</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Real-time Data</h4>
              <p className="text-gray-600 text-sm">
                Our system uses Google Maps API to provide real-time traffic data, 
                ensuring you get the most accurate route timing and distance calculations.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Local Pricing</h4>
              <p className="text-gray-600 text-sm">
                Pricing calculations are specifically calibrated for Bhubaneswar's transportation 
                market, including auto-rickshaws, bikes, buses, and cabs.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Multiple Modes</h4>
              <p className="text-gray-600 text-sm">
                Compare different transportation modes including driving, biking, 
                public transit, and walking to choose the best option for your needs.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Surge Detection</h4>
              <p className="text-gray-600 text-sm">
                Automatic detection of rush hours (8-10 AM, 6-8 PM) applies surge pricing 
                multipliers to give you realistic cost estimates.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdvancedRoutePlanningPage;
