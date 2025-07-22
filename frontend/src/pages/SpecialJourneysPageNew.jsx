import React, { useState } from 'react';
import { FaGraduationCap, FaHeart, FaMapMarkedAlt, FaUtensils, FaHistory, FaRoute, FaClock, FaMapMarkerAlt, FaMoneyBillWave, FaStar, FaArrowLeft, FaPlay, FaTimes } from 'react-icons/fa';
import InteractiveMap from '../components/InteractiveMap';
import { toast } from 'react-hot-toast';

const SpecialJourneysPage = () => {
  const [selectedJourney, setSelectedJourney] = useState(null);
  const [journeyResult, setJourneyResult] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const specialJourneys = [
    {
      id: 'heritage',
      name: 'Temple Heritage Trail',
      icon: '🕉️',
      color: 'orange',
      description: 'Explore ancient temples in chronological order with optimized routes and cultural insights.',
      duration: '4-6 hours',
      cost: '₹200-300',
      difficulty: 'Easy',
      bestTime: 'Early Morning',
      highlights: ['Lingaraj Temple', 'Rajarani Temple', 'Mukteshvara Temple', 'Parasurameswara Temple'],
      locations: ['Lingaraj Temple', 'Parasurameswara Temple', 'Mukteshvara Temple', 'Rajarani Temple'],
      type: 'heritage',
      features: [
        'Chronological temple visits',
        'Cultural significance guide',
        'Photography spots marked',
        'Priest contact information'
      ]
    },
    {
      id: 'student',
      name: 'Student Life Circuit',
      icon: '🎓',
      color: 'green',
      description: 'Budget-friendly routes connecting colleges, libraries, cafes, and student hangout spots.',
      duration: '3-4 hours',
      cost: '₹100-150',
      difficulty: 'Easy',
      bestTime: 'Afternoon',
      highlights: ['KIIT University', 'Utkal University', 'Student Cafes', 'Libraries'],
      locations: ['KIIT University', 'Utkal University', 'Esplanade One Mall', 'Regional Science Centre'],
      type: 'student',
      features: [
        'Budget optimization',
        'Student discounts info',
        'Study spots marked',
        'Wi-Fi available locations'
      ]
    },
    {
      id: 'food',
      name: 'Culinary Adventure',
      icon: '🍛',
      color: 'red',
      description: 'Food routes timed perfectly for breakfast, lunch, snacks, and dinner experiences.',
      duration: '6-8 hours',
      cost: '₹500-800',
      difficulty: 'Medium',
      bestTime: 'All Day',
      highlights: ['Traditional Odia Cuisine', 'Street Food', 'Fine Dining', 'Sweet Shops'],
      locations: ['Ekamra Haat', 'Esplanade One Mall', 'Bhubaneswar Railway Station', 'Tribal Museum'],
      type: 'food',
      features: [
        'Meal timing optimization',
        'Dietary preferences considered',
        'Food safety ratings',
        'Local specialties highlighted'
      ]
    },
    {
      id: 'romantic',
      name: 'Romantic Evening Route',
      icon: '💕',
      color: 'pink',
      description: 'Sunset-timed routes for couples featuring scenic spots and romantic dining.',
      duration: '4-5 hours',
      cost: '₹800-1200',
      difficulty: 'Easy',
      bestTime: 'Evening',
      highlights: ['Sunset Views', 'Romantic Restaurants', 'Peaceful Gardens', 'Cultural Shows'],
      locations: ['Dhauli', 'Khandagiri Caves', 'Tribal Museum', 'Ekamra Haat'],
      type: 'romantic',
      features: [
        'Sunset timing optimization',
        'Romantic ambiance spots',
        'Photography locations',
        'Couple-friendly venues'
      ]
    },
    {
      id: 'business',
      name: 'Business Circuit',
      icon: '💼',
      color: 'blue',
      description: 'Efficient routes for business meetings, conferences, and professional networking.',
      duration: '2-3 hours',
      cost: '₹300-500',
      difficulty: 'Easy',
      bestTime: 'Business Hours',
      highlights: ['IT Parks', 'Conference Centers', 'Hotels', 'Business Centers'],
      locations: ['KIIT University', 'AIIMS Bhubaneswar', 'Kalinga Stadium', 'Esplanade One Mall'],
      type: 'business',
      features: [
        'Parking information',
        'Meeting room availability',
        'Professional services',
        'Network connectivity details'
      ]
    }
  ];

  const generateJourney = async (journey) => {
    setIsGenerating(true);
    setSelectedJourney(journey);
    setShowModal(true);
    
    try {
      // Simulate journey generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const result = {
        name: journey.name,
        totalDistance: `${(Math.random() * 15 + 10).toFixed(1)} km`,
        estimatedTime: journey.duration,
        totalCost: journey.cost,
        locations: journey.locations,
        type: journey.type,
        route: journey.locations.map((location, index) => ({
          step: index + 1,
          location: location,
          duration: `${Math.floor(Math.random() * 30 + 15)} mins`,
          description: getLocationDescription(location, journey.type)
        }))
      };
      
      setJourneyResult(result);
      toast.success(`${journey.name} generated successfully!`);
    } catch (error) {
      toast.error('Failed to generate journey. Please try again.');
      console.error('Journey generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const getLocationDescription = (location, type) => {
    const descriptions = {
      heritage: {
        'Lingaraj Temple': 'Ancient Shiva temple, architectural marvel from 11th century',
        'Rajarani Temple': 'Known as "Love Temple" for its romantic sculptures',
        'Mukteshvara Temple': 'Gem of Kalinga architecture with intricate carvings',
        'Parasurameswara Temple': 'Oldest temple in Bhubaneswar, 7th century'
      },
      student: {
        'KIIT University': 'Premier educational institution with modern facilities',
        'Utkal University': 'Historic university with beautiful campus',
        'Esplanade One Mall': 'Student-friendly shopping and dining hub',
        'Regional Science Centre': 'Interactive learning and study environment'
      },
      food: {
        'Ekamra Haat': 'Traditional Odia cuisine and handicrafts market',
        'Esplanade One Mall': 'Food court with diverse dining options',
        'Bhubaneswar Railway Station': 'Famous for railway platform food',
        'Tribal Museum': 'Museum cafe with organic tribal cuisine'
      },
      romantic: {
        'Dhauli': 'Historic site with stunning sunset views',
        'Khandagiri Caves': 'Ancient caves with peaceful ambiance',
        'Tribal Museum': 'Cultural experience with beautiful gardens',
        'Ekamra Haat': 'Evening cultural performances and dining'
      },
      business: {
        'KIIT University': 'Conference facilities and business incubators',
        'AIIMS Bhubaneswar': 'Medical conferences and professional meetings',
        'Kalinga Stadium': 'Sports business and event management',
        'Esplanade One Mall': 'Business meetings and corporate dining'
      }
    };
    return descriptions[type]?.[location] || 'Explore this amazing location';
  };

  const getColorClasses = (color) => {
    const colorMap = {
      orange: {
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        text: 'text-orange-800',
        button: 'bg-orange-600 hover:bg-orange-700',
        icon: 'text-orange-600'
      },
      green: {
        bg: 'bg-green-50',
        border: 'border-green-200',
        text: 'text-green-800',
        button: 'bg-green-600 hover:bg-green-700',
        icon: 'text-green-600'
      },
      red: {
        bg: 'bg-red-50',
        border: 'border-red-200',
        text: 'text-red-800',
        button: 'bg-red-600 hover:bg-red-700',
        icon: 'text-red-600'
      },
      pink: {
        bg: 'bg-pink-50',
        border: 'border-pink-200',
        text: 'text-pink-800',
        button: 'bg-pink-600 hover:bg-pink-700',
        icon: 'text-pink-600'
      },
      blue: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        text: 'text-blue-800',
        button: 'bg-blue-600 hover:bg-blue-700',
        icon: 'text-blue-600'
      }
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Special Journeys in Bhubaneswar
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
            Discover the Temple City through curated experiences designed for specific interests and preferences
          </p>
        </div>

        {/* Journey Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-12">
          {specialJourneys.map((journey) => {
            const colors = getColorClasses(journey.color);
            return (
              <div key={journey.id} className={`${colors.bg} ${colors.border} border-2 rounded-xl p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1`}>
                {/* Journey Header */}
                <div className="text-center mb-6">
                  <div className="text-4xl sm:text-5xl mb-3">
                    {journey.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                    {journey.name}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    {journey.description}
                  </p>
                </div>

                {/* Journey Stats */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
                  <div className="text-center">
                    <FaClock className={`${colors.icon} mx-auto mb-1 text-sm`} />
                    <div className="text-xs sm:text-sm font-medium text-gray-900">{journey.duration}</div>
                    <div className="text-xs text-gray-600">Duration</div>
                  </div>
                  <div className="text-center">
                    <FaMoneyBillWave className={`${colors.icon} mx-auto mb-1 text-sm`} />
                    <div className="text-xs sm:text-sm font-medium text-gray-900">{journey.cost}</div>
                    <div className="text-xs text-gray-600">Estimated Cost</div>
                  </div>
                  <div className="text-center">
                    <FaStar className={`${colors.icon} mx-auto mb-1 text-sm`} />
                    <div className="text-xs sm:text-sm font-medium text-gray-900">{journey.difficulty}</div>
                    <div className="text-xs text-gray-600">Difficulty</div>
                  </div>
                  <div className="text-center">
                    <FaMapMarkerAlt className={`${colors.icon} mx-auto mb-1 text-sm`} />
                    <div className="text-xs sm:text-sm font-medium text-gray-900">{journey.locations.length}</div>
                    <div className="text-xs text-gray-600">Locations</div>
                  </div>
                </div>

                {/* Best Time */}
                <div className="mb-4">
                  <div className="text-xs text-gray-600 mb-1">Best Time:</div>
                  <div className="text-sm font-medium text-gray-900">{journey.bestTime}</div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => generateJourney(journey)}
                  disabled={isGenerating}
                  className={`w-full ${colors.button} text-white font-medium py-2 sm:py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center text-sm sm:text-base`}
                >
                  <FaPlay className="mr-2" />
                  {isGenerating && selectedJourney?.id === journey.id ? 'Generating...' : 'Start Journey'}
                </button>
              </div>
            );
          })}
        </div>

        {/* Interactive Map Section */}
        <div className="mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">
            Explore Bhubaneswar Locations
          </h2>
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
            <InteractiveMap 
              selectedJourney={journeyResult} 
              height="400px" 
              showAllLocations={!journeyResult} 
            />
          </div>
        </div>
      </div>

      {/* Journey Details Modal */}
      {showModal && selectedJourney && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-screen overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 sm:p-6 flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                {selectedJourney.name}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedJourney(null);
                  setJourneyResult(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <FaTimes className="text-gray-600" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 sm:p-6">
              {isGenerating ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                  <p className="text-lg text-gray-600">Generating your personalized journey...</p>
                </div>
              ) : journeyResult ? (
                <div className="space-y-6">
                  {/* Journey Summary */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <div className="text-lg sm:text-xl font-bold text-blue-600">{journeyResult.totalDistance}</div>
                      <div className="text-sm text-blue-700">Total Distance</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg text-center">
                      <div className="text-lg sm:text-xl font-bold text-green-600">{journeyResult.estimatedTime}</div>
                      <div className="text-sm text-green-700">Duration</div>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg text-center">
                      <div className="text-lg sm:text-xl font-bold text-orange-600">{journeyResult.totalCost}</div>
                      <div className="text-sm text-orange-700">Est. Cost</div>
                    </div>
                  </div>

                  {/* Interactive Map */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Journey Route</h3>
                    <InteractiveMap selectedJourney={journeyResult} height="300px" />
                  </div>

                  {/* Journey Steps */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Journey Itinerary</h3>
                    <div className="space-y-4">
                      {journeyResult.route.map((step, index) => (
                        <div key={index} className="flex items-start bg-gray-50 p-4 rounded-lg">
                          <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mr-4">
                            {step.step}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-1">{step.location}</h4>
                            <p className="text-sm text-gray-600 mb-2">{step.description}</p>
                            <div className="flex items-center text-xs text-blue-600">
                              <FaClock className="mr-1" />
                              {step.duration}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Features */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Special Features</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedJourney.features.map((feature, index) => (
                        <div key={index} className="flex items-center text-sm text-gray-700">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpecialJourneysPage;
