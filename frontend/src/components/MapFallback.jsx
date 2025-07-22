import React from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';

const MapFallback = ({ selectedJourney, route, height = "400px" }) => {
  return (
    <div 
      style={{ height, width: '100%' }} 
      className="bg-gradient-to-br from-blue-100 to-green-100 rounded-lg flex items-center justify-center border-2 border-dashed border-blue-300"
    >
      <div className="text-center text-gray-700 p-6">
        <FaMapMarkerAlt className="text-4xl mb-4 mx-auto text-blue-600" />
        <h3 className="text-lg font-semibold mb-2">Interactive Map View</h3>
        {selectedJourney && (
          <div className="mb-4">
            <p className="text-sm font-medium mb-2">{selectedJourney.name}</p>
            <div className="text-sm text-gray-600">
              <p>📍 Locations: {selectedJourney.locations?.length || 0}</p>
              <p>⏱️ Duration: {selectedJourney.estimatedTime || 'N/A'}</p>
              <p>💰 Cost: {selectedJourney.totalCost || 'N/A'}</p>
            </div>
          </div>
        )}
        {route && (
          <div className="mb-4">
            <p className="text-sm font-medium mb-2">Route Details</p>
            <div className="text-sm text-gray-600">
              <p>📏 Distance: {route.distance}</p>
              <p>⏱️ Duration: {route.duration}</p>
              <p>💰 Est. Cost: {route.estimatedCost}</p>
            </div>
          </div>
        )}
        <p className="text-sm text-gray-500">
          Map visualization powered by Leaflet
        </p>
      </div>
    </div>
  );
};

export default MapFallback;
