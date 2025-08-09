const { calculateDistance, calculateTransportCost, calculateTravelTime } = require('../services/pathfindingService');

// Calculate route between two points
const calculateRoute = async (req, res) => {
  try {
    const { 
      fromCoords, 
      toCoords, 
      transportMode, 
      routePreference = 'fastest',
      timeOfDay = 'normal',
      preferences = {}
    } = req.body;

    // Validation
    if (!fromCoords || !toCoords || !transportMode) {
      return res.status(400).json({ 
        success: false,
        error: 'Missing required parameters: fromCoords, toCoords, transportMode',
        required: ['fromCoords', 'toCoords', 'transportMode']
      });
    }

    if (!Array.isArray(fromCoords) || fromCoords.length !== 2 || 
        !Array.isArray(toCoords) || toCoords.length !== 2) {
      return res.status(400).json({ 
        success: false,
        error: 'Coordinates must be arrays with [latitude, longitude]' 
      });
    }

    const validTransportModes = ['walking', 'cycling', 'auto', 'bus', 'car', 'bike'];
    if (!validTransportModes.includes(transportMode)) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid transport mode',
        validModes: validTransportModes
      });
    }

    // Calculate route data
    const distance = calculateDistance(
      fromCoords[0], fromCoords[1],
      toCoords[0], toCoords[1]
    );

    const pricing = calculateTransportCost(distance, transportMode, timeOfDay);
    const timing = calculateTravelTime(distance, transportMode, timeOfDay);
    
    // Generate route steps
    const routeSteps = generateRouteSteps(fromCoords, toCoords, transportMode, distance);
    
    // Assess route quality
    const routeQuality = assessRouteQuality(distance, transportMode, timeOfDay, preferences);

    // Calculate environmental impact
    const environmentalImpact = calculateEnvironmentalImpact(distance, transportMode);

    const routeData = {
      routeId: generateRouteId(),
      distance: {
        km: Math.round(distance * 100) / 100,
        meters: Math.round(distance * 1000),
        display: `${Math.round(distance * 100) / 100} km`
      },
      duration: timing,
      cost: pricing,
      transportMode,
      routePreference,
      timeOfDay,
      quality: routeQuality,
      environmentalImpact,
      steps: routeSteps,
      coordinates: {
        from: fromCoords,
        to: toCoords
      },
      metadata: {
        apiVersion: '2.0.0',
        timestamp: new Date().toISOString(),
        calculationTime: Date.now()
      }
    };

    res.json({
      success: true,
      route: routeData
    });

  } catch (error) {
    console.error('Route calculation error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error during route calculation',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Route calculation failed'
    });
  }
};

// Get pricing for all transport modes
const getAllPricing = async (req, res) => {
  try {
    const { fromCoords, toCoords, timeOfDay = 'normal' } = req.body;
    
    if (!fromCoords || !toCoords) {
      return res.status(400).json({ 
        success: false,
        error: 'Missing required coordinates' 
      });
    }

    const distance = calculateDistance(
      fromCoords[0], fromCoords[1],
      toCoords[0], toCoords[1]
    );

    const transportModes = ['walking', 'cycling', 'auto', 'bus', 'car', 'bike'];
    const pricing = {};

    transportModes.forEach(mode => {
      pricing[mode] = {
        cost: calculateTransportCost(distance, mode, timeOfDay),
        time: calculateTravelTime(distance, mode, timeOfDay),
        environmental: calculateEnvironmentalImpact(distance, mode),
        recommended: isRecommendedMode(distance, mode, timeOfDay)
      };
    });

    // Sort by recommendation score
    const sortedModes = Object.entries(pricing)
      .sort(([,a], [,b]) => (b.recommended.score || 0) - (a.recommended.score || 0))
      .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});

    res.json({
      success: true,
      distance: {
        km: Math.round(distance * 100) / 100,
        display: `${Math.round(distance * 100) / 100} km`
      },
      pricing: sortedModes,
      timeOfDay,
      recommendations: getTopRecommendations(pricing, distance),
      metadata: {
        timestamp: new Date().toISOString(),
        apiVersion: '2.0.0'
      }
    });

  } catch (error) {
    console.error('Pricing calculation error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to calculate pricing' 
    });
  }
};

// Helper Functions
const generateRouteSteps = (fromCoords, toCoords, transportMode, distance) => {
  const steps = [
    {
      instruction: `Start your journey from your current location`,
      coordinates: fromCoords,
      type: 'start'
    }
  ];

  // Mode-specific initial steps
  const modeInstructions = {
    auto: [
      'Open ride-hailing app (Ola, Uber, Rapido)',
      'Select auto-rickshaw option',
      'Confirm pickup location',
      'Wait for driver confirmation and arrival'
    ],
    car: [
      'Open cab booking app (Ola, Uber)',
      'Select car category (Mini, Prime, etc.)',
      'Confirm pickup and destination',
      'Wait for driver assignment and arrival'
    ],
    bike: [
      'Open bike taxi app (Rapido, Ola Bike)',
      'Select bike ride option',
      'Confirm pickup point',
      'Wait for rider confirmation'
    ],
    bus: [
      'Walk to the nearest bus stop',
      'Check route information and timings',
      'Board the appropriate city bus',
      'Pay fare to conductor or use digital payment'
    ],
    walking: [
      'Plan your walking route',
      distance > 2 ? 'Consider rest stops during the journey' : 'Enjoy the short walk'
    ],
    cycling: [
      'Check your bicycle condition',
      'Plan cycling-friendly route',
      'Follow traffic rules and use cycle lanes where available'
    ]
  };

  modeInstructions[transportMode]?.forEach(instruction => {
    steps.push({
      instruction,
      type: 'preparation'
    });
  });

  // Journey steps
  if (distance > 5) {
    steps.push({
      instruction: 'Continue on main road following navigation',
      type: 'journey'
    });
  }

  if (transportMode === 'bus') {
    steps.push({
      instruction: 'Get down at the stop nearest to destination',
      type: 'transit'
    });
  }

  steps.push({
    instruction: `Arrive at your destination`,
    coordinates: toCoords,
    type: 'end'
  });

  return steps;
};

const assessRouteQuality = (distance, transportMode, timeOfDay, preferences = {}) => {
  let score = 100;
  let factors = [];

  // Distance factor
  if (distance > 15) {
    score -= 15;
    factors.push('Long distance journey');
  } else if (distance < 2) {
    score += 10;
    factors.push('Short convenient distance');
  }

  // Time factor
  if (timeOfDay === 'peak') {
    score -= 20;
    factors.push('Peak hours - expect delays');
  } else {
    score += 10;
    factors.push('Off-peak hours - smooth journey');
  }

  // Mode efficiency
  const efficiency = {
    walking: distance < 3 ? 20 : -10,
    cycling: distance < 8 ? 15 : -5,
    auto: distance < 12 ? 10 : 5,
    bus: 5,
    car: distance > 5 ? 15 : 0,
    bike: distance < 15 ? 12 : 8
  };

  score += efficiency[transportMode] || 0;

  // User preferences
  if (preferences.eco && ['walking', 'cycling'].includes(transportMode)) {
    score += 15;
    factors.push('Eco-friendly option');
  }

  if (preferences.budget && ['walking', 'cycling', 'bus'].includes(transportMode)) {
    score += 10;
    factors.push('Budget-friendly option');
  }

  if (preferences.comfort && ['car', 'auto'].includes(transportMode)) {
    score += 8;
    factors.push('Comfortable travel option');
  }

  // Rating determination
  let rating, color;
  if (score >= 90) { rating = 'Excellent'; color = '#10b981'; }
  else if (score >= 75) { rating = 'Good'; color = '#f59e0b'; }
  else if (score >= 60) { rating = 'Average'; color = '#f97316'; }
  else { rating = 'Poor'; color = '#ef4444'; }

  return {
    score: Math.max(0, Math.min(100, score)),
    rating,
    color,
    factors
  };
};

const calculateEnvironmentalImpact = (distance, transportMode) => {
  // CO2 emissions in grams per km
  const emissions = {
    walking: 0,
    cycling: 0,
    bus: 80, // Public transport efficiency
    auto: 120,
    bike: 95,
    car: 180
  };

  const co2Grams = (emissions[transportMode] || 0) * distance;
  const co2Kg = co2Grams / 1000;

  return {
    co2Emissions: {
      grams: Math.round(co2Grams),
      kg: Math.round(co2Kg * 100) / 100,
      display: co2Kg > 1 ? `${Math.round(co2Kg * 100) / 100} kg` : `${Math.round(co2Grams)} g`
    },
    ecoRating: co2Grams === 0 ? 'Excellent' : 
               co2Grams < 500 ? 'Good' : 
               co2Grams < 1000 ? 'Average' : 'Poor',
    ecoScore: Math.max(0, 100 - (co2Grams / 20))
  };
};

const isRecommendedMode = (distance, mode, timeOfDay) => {
  let score = 50;

  // Distance-based scoring
  const distanceScores = {
    walking: distance < 2 ? 30 : distance < 5 ? 10 : -20,
    cycling: distance < 8 ? 25 : distance < 15 ? 10 : -10,
    auto: distance > 2 && distance < 12 ? 20 : 10,
    bus: distance > 5 ? 15 : 5,
    car: distance > 8 ? 20 : distance > 3 ? 15 : 5,
    bike: distance > 3 && distance < 20 ? 18 : 8
  };

  score += distanceScores[mode] || 0;

  // Time-based adjustments
  if (timeOfDay === 'peak') {
    if (['walking', 'cycling'].includes(mode)) score += 15;
    else score -= 10;
  }

  return {
    score: Math.max(0, Math.min(100, score)),
    recommended: score > 60,
    reason: score > 60 ? 'Highly suitable for this journey' : 
            score > 40 ? 'Suitable option' : 'Not ideal for this journey'
  };
};

const getTopRecommendations = (pricing, distance) => {
  const recommendations = Object.entries(pricing)
    .filter(([, data]) => data.recommended.recommended)
    .sort(([, a], [, b]) => b.recommended.score - a.recommended.score)
    .slice(0, 3)
    .map(([mode, data]) => ({
      mode,
      reason: data.recommended.reason,
      score: data.recommended.score
    }));

  return recommendations;
};

const generateRouteId = () => {
  return 'route_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
};

module.exports = {
  calculateRoute,
  getAllPricing
};
