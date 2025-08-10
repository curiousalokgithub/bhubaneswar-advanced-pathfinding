// Enhanced Route Calculator with Google Maps Integration
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaRoute, FaMapMarkerAlt, FaExchangeAlt, FaCar, FaMotorcycle, FaBus, FaWalking } from 'react-icons/fa';
import GoogleMapsRouteCalculator from './GoogleMapsRouteCalculator';
import { routesAPI } from '../services/api';

const RouteCalculator = () => {
  const [useGoogleMaps, setUseGoogleMaps] = useState(true);
  const [locations, setLocations] = useState([]);
  
  // Fallback local route calculation
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [selectedTransport, setSelectedTransport] = useState('auto');
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load local locations for fallback
    const loadLocations = async () => {
      try {
        const response = await routesAPI.getRoutesHealth();
        // If Google Maps service fails, we'll use local data
      } catch (error) {
        console.log('Using local route calculation');
        setUseGoogleMaps(false);
      }
    };
    loadLocations();
  }, []);

  // If Google Maps is available, use the advanced calculator
  if (useGoogleMaps) {
    return (
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Advanced Route Planning</h2>
          <button
            onClick={() => setUseGoogleMaps(false)}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Use Simple Calculator
          </button>
        </div>
        <GoogleMapsRouteCalculator />
      </div>
    );
  }

  // Fallback simple calculator
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">Simple Route Calculator</h2>
        <button
          onClick={() => setUseGoogleMaps(true)}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Use Google Maps
        </button>
      </div>
      
      {/* Simple route calculator content */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            From Location
          </label>
          <input
            type="text"
            value={fromLocation}
            onChange={(e) => setFromLocation(e.target.value)}
            placeholder="Enter starting location"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            To Location
          </label>
          <input
            type="text"
            value={toLocation}
            onChange={(e) => setToLocation(e.target.value)}
            placeholder="Enter destination"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="text-center text-gray-500">
          <p>Basic route calculation - for advanced features including real-time data,</p>
          <p>pricing estimates, and multiple route options, use Google Maps mode.</p>
        </div>
      </div>
    </div>
  );
};

export default RouteCalculator;