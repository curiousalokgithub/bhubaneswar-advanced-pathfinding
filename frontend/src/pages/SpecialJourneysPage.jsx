import React, { useState } from 'react';
import { FaGraduationCap, FaHeart, FaMapMarkedAlt, FaUtensils, FaHistory, FaRoute, FaClock, FaMapMarkerAlt, FaMoneyBillWave, FaStar, FaArrowLeft, FaPlay } from 'react-icons/fa';
import InteractiveMap from '../components/InteractiveMap';
import { toast } from 'react-hot-toast';

// Import pathfinding service with error handling
let BhubaneswaarPathfinder = null;
try {
  const pathfindingModule = require('../services/pathfinding');
  BhubaneswaarPathfinder = pathfindingModule.BhubaneswaarPathfinder || pathfindingModule.default;
} catch (error) {
  console.warn('Pathfinding service not available');
}

const SpecialJourneysPage = () => {
  const [selectedJourney, setSelectedJourney] = useState(null);
  const [journeyResult, setJourneyResult] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Initialize pathfinder only if available
  const pathfinder = BhubaneswaarPathfinder ? new BhubaneswaarPathfinder() : null;

  const specialJourneys = [
    {
      id: 'heritage',
      title: 'Temple Heritage Trail',
      icon: <FaHistory />,
      description: 'Explore ancient temples and historical sites in optimal sequence',
      color: 'bg-orange-500',
      features: [
        'Optimized temple visiting order',
        'Historical context for each location',
        'Best photography spots',
        'Local priest contact information'
      ]
    },
    {
      id: 'student',
      title: 'Student Life Circuit',
      icon: <FaGraduationCap />,
      description: 'Connect universities, hostels, and student hotspots efficiently',
      color: 'bg-blue-500',
      features: [
        'Budget-friendly route options',
        'Student discount locations',
        'Study cafe recommendations',
        'Late-night safe routes'
      ]
    },
    {
      id: 'foodie',
      title: 'Culinary Adventure',
      icon: <FaUtensils />,
      description: 'Taste the best of Bhubaneswar cuisine in a planned route',
      color: 'bg-green-500',
      features: [
        'Local street food ordering',
        'Restaurant timing optimization',
        'Dietary preference filtering',
        'Food blogger recommendations'
      ]
    },
    {
      id: 'romantic',
      title: 'Romantic Evening Route',
      icon: <FaHeart />,
      description: 'Perfect date planning with scenic locations and timing',
      color: 'bg-pink-500',
      features: [
        'Sunset timing optimization',
        'Romantic restaurant bookings',
        'Scenic viewpoint selection',
        'Privacy-focused locations'
      ]
    },
    {
      id: 'business',
      title: 'Business Circuit',
      icon: <FaMapMarkedAlt />,
      description: 'Efficient business meeting routes with parking info',
      color: 'bg-purple-500',
      features: [
        'Meeting room availability',
        'Parking space information',
        'Traffic-aware scheduling',
        'Professional venue suggestions'
      ]
    }
  ];

  const generateSpecialJourney = (journeyType) => {
    let result = {};
    
    switch (journeyType) {
      case 'heritage':
        result = pathfinder.createHeritageTrail({
          duration: 6,
          includeFood: true,
          difficulty: 'moderate'
        });
        break;
      
      case 'student':
        result = pathfinder.optimizeMultiStopTrip(
          'KIIT_University',
          ['Utkal_University', 'Master_Canteen', 'Patia_Square'],
          'Railway_Station'
        );
        result.specialFeatures = [
          'Budget transport options available',
          'Student discounts at multiple locations',
          'Safe routes for evening travel'
        ];
        break;
      
      case 'foodie':
        const foodSpots = ['Master_Canteen', 'Patia_Square', 'Lingaraj_Temple'];
        result = pathfinder.optimizeMultiStopTrip(
          'Railway_Station',
          foodSpots.slice(1, -1),
          foodSpots[foodSpots.length - 1]
        );
        result.specialFeatures = [
          'Best breakfast at Master Canteen',
          'Lunch recommendations at Patia',
          'Temple prasad experience'
        ];
        break;
      
      default:
        result = { error: 'Journey type not implemented yet' };
    }
    
    return result;
  };

  const handleJourneySelect = (journey) => {
    setSelectedJourney(journey);
    const result = generateSpecialJourney(journey.id);
    setJourneyResult(result);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Special Journey Planner
          </h1>
          <p className="text-xl text-gray-600">
            Unique, curated experiences that Google Maps can't offer
          </p>
        </div>

        {!selectedJourney ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {specialJourneys.map((journey) => (
              <div
                key={journey.id}
                onClick={() => handleJourneySelect(journey)}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer overflow-hidden"
              >
                <div className={`${journey.color} p-6 text-white`}>
                  <div className="text-3xl mb-3">{journey.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{journey.title}</h3>
                  <p className="text-sm opacity-90">{journey.description}</p>
                </div>
                
                <div className="p-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Features:</h4>
                  <ul className="space-y-2">
                    {journey.features.map((feature, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <button className={`mt-4 w-full ${journey.color} text-white py-2 px-4 rounded-lg hover:opacity-90 transition-opacity`}>
                    Plan This Journey
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedJourney.title}
              </h2>
              <button
                onClick={() => {
                  setSelectedJourney(null);
                  setJourneyResult(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ← Back to journeys
              </button>
            </div>

            {journeyResult && !journeyResult.error ? (
              <div className="space-y-6">
                {/* Journey Overview */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {journeyResult.totalDistance?.toFixed(1) || 'N/A'}
                    </div>
                    <div className="text-sm text-blue-700">Total Distance (km)</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {journeyResult.totalTime || 'N/A'} min
                    </div>
                    <div className="text-sm text-green-700">Estimated Time</div>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {journeyResult.optimizedOrder?.length || 0}
                    </div>
                    <div className="text-sm text-orange-700">Stops Planned</div>
                  </div>
                </div>

                {/* Optimized Route */}
                {journeyResult.optimizedOrder && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      Optimized Route Order
                    </h3>
                    <div className="space-y-3">
                      {journeyResult.optimizedOrder.map((location, index) => (
                        <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">
                              {location.replace(/_/g, ' ')}
                            </div>
                            {journeyResult.segments?.[index] && (
                              <div className="text-sm text-gray-600">
                                Distance to next: {journeyResult.segments[index].totalDistance?.toFixed(1)}km
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Special Features */}
                {journeyResult.specialFeatures && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      Special Features & Tips
                    </h3>
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      {journeyResult.specialFeatures.map((feature, index) => (
                        <div key={index} className="flex items-start mb-2 last:mb-0">
                          <span className="text-yellow-600 mr-2">💡</span>
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                {journeyResult.recommendations && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      Local Recommendations
                    </h3>
                    <div className="space-y-3">
                      {journeyResult.recommendations.map((rec, index) => (
                        <div key={index} className="bg-green-50 p-3 rounded-lg">
                          <div className="font-medium text-green-900">
                            {rec.location.replace(/_/g, ' ')}
                          </div>
                          <div className="text-sm text-green-700">{rec.tip}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Unable to generate this journey type yet.</p>
                <p className="text-sm mt-2">Feature coming soon!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SpecialJourneysPage;
