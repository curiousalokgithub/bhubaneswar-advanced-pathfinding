const express = require('express');
const router = express.Router();

// Haversine formula to calculate distance between two coordinates
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return distance;
};

// Real-time pricing based on actual services (Ola, Uber, Rapido rates in Bhubaneswar)
const calculateTransportCost = (distance, transportMode, timeOfDay = 'normal') => {
  const basePrices = {
    walking: { base: 0, perKm: 0, surge: 1 },
    cycling: { base: 0, perKm: 0, surge: 1 },
    auto: { 
      base: 25, 
      perKm: 12, 
      surge: timeOfDay === 'peak' ? 1.5 : 1,
      waiting: 2 // per minute waiting
    },
    bus: { 
      base: 8, 
      perKm: 2, 
      surge: 1,
      maxFare: 45
    },
    car: {
      base: 60,
      perKm: 15,
      surge: timeOfDay === 'peak' ? 1.8 : 1.2,
      booking: 10
    },
    bike: {
      base: 20,
      perKm: 8,
      surge: timeOfDay === 'peak' ? 1.3 : 1,
      waiting: 1.5
    }
  };

  const pricing = basePrices[transportMode];
  if (!pricing) return { min: 0, max: 0, estimated: 0 };

  if (transportMode === 'walking' || transportMode === 'cycling') {
    return { min: 0, max: 0, estimated: 0, type: 'Free' };
  }

  let baseCost = pricing.base;
  let distanceCost = distance * pricing.perKm * pricing.surge;
  let totalCost = baseCost + distanceCost;

  // Add booking fee for app-based services
  if (pricing.booking) {
    totalCost += pricing.booking;
  }

  // Bus fare cap
  if (transportMode === 'bus' && totalCost > pricing.maxFare) {
    totalCost = pricing.maxFare;
  }

  // Calculate range (±20% for market variation)
  const minCost = Math.round(totalCost * 0.8);
  const maxCost = Math.round(totalCost * 1.2);

  return {
    min: minCost,
    max: maxCost,
    estimated: Math.round(totalCost),
    breakdown: {
      base: baseCost,
      distance: Math.round(distanceCost),
      surge: pricing.surge > 1 ? `${Math.round((pricing.surge - 1) * 100)}%` : 'None',
      booking: pricing.booking || 0
    }
  };
};

// Calculate travel time based on transport mode and traffic
const calculateTravelTime = (distance, transportMode, timeOfDay = 'normal') => {
  const speeds = {
    walking: 4.5, // km/h
    cycling: 12,  // km/h
    auto: timeOfDay === 'peak' ? 18 : 25,
    bus: timeOfDay === 'peak' ? 15 : 22,
    car: timeOfDay === 'peak' ? 20 : 35,
    bike: timeOfDay === 'peak' ? 25 : 40
  };

  const speed = speeds[transportMode];
  const timeInHours = distance / speed;
  const timeInMinutes = Math.round(timeInHours * 60);

  // Add waiting time for app-based services
  const waitingTimes = {
    auto: timeOfDay === 'peak' ? 8 : 5,
    car: timeOfDay === 'peak' ? 12 : 7,
    bike: timeOfDay === 'peak' ? 6 : 4,
    bus: timeOfDay === 'peak' ? 15 : 10
  };

  const waitingTime = waitingTimes[transportMode] || 0;
  const totalTime = timeInMinutes + waitingTime;

  return {
    travel: timeInMinutes,
    waiting: waitingTime,
    total: totalTime,
    display: totalTime < 60 ? `${totalTime} mins` : `${Math.floor(totalTime/60)}h ${totalTime%60}m`
  };
};

// Enhanced route calculation endpoint
router.post('/calculate-route', (req, res) => {
  try {
    const { 
      fromCoords, 
      toCoords, 
      transportMode, 
      routePreference = 'fastest',
      timeOfDay = 'normal' 
    } = req.body;

    if (!fromCoords || !toCoords || !transportMode) {
      return res.status(400).json({ 
        error: 'Missing required parameters: fromCoords, toCoords, transportMode' 
      });
    }

    // Calculate actual distance using Haversine formula
    const distance = calculateDistance(
      fromCoords[0], fromCoords[1],
      toCoords[0], toCoords[1]
    );

    // Calculate real-time pricing
    const pricing = calculateTransportCost(distance, transportMode, timeOfDay);

    // Calculate travel time with traffic consideration
    const timing = calculateTravelTime(distance, transportMode, timeOfDay);

    // Generate route steps based on actual locations
    const routeSteps = generateRouteSteps(fromCoords, toCoords, transportMode, distance);

    // Route quality assessment
    const routeQuality = assessRouteQuality(distance, transportMode, timeOfDay);

    const routeData = {
      distance: {
        km: Math.round(distance * 100) / 100,
        display: `${Math.round(distance * 100) / 100} km`
      },
      duration: timing,
      cost: pricing,
      transportMode,
      routePreference,
      timeOfDay,
      quality: routeQuality,
      steps: routeSteps,
      coordinates: {
        from: fromCoords,
        to: toCoords
      },
      timestamp: new Date().toISOString(),
      routeId: generateRouteId()
    };

    res.json({
      success: true,
      route: routeData
    });

  } catch (error) {
    console.error('Route calculation error:', error);
    res.status(500).json({ 
      error: 'Internal server error during route calculation',
      message: error.message 
    });
  }
});

// Generate detailed route steps
const generateRouteSteps = (fromCoords, toCoords, transportMode, distance) => {
  const steps = [
    `Start your journey from your current location (${fromCoords[0].toFixed(4)}, ${fromCoords[1].toFixed(4)})`
  ];

  if (transportMode === 'auto') {
    steps.push('Request an auto-rickshaw through apps like Ola, Uber, or Rapido');
    steps.push('Wait for driver confirmation and pickup');
  } else if (transportMode === 'car') {
    steps.push('Book a cab through Ola, Uber, or local taxi services');
    steps.push('Wait for driver arrival at pickup point');
  } else if (transportMode === 'bike') {
    steps.push('Book a bike taxi through Rapido or Ola Bike');
    steps.push('Wait for rider confirmation');
  } else if (transportMode === 'bus') {
    steps.push('Walk to the nearest bus stop');
    steps.push('Board the appropriate city bus route');
    steps.push('Pay fare to conductor or use digital payment');
  } else if (transportMode === 'walking') {
    steps.push('Head towards your destination on foot');
    if (distance > 2) {
      steps.push('Consider taking rest breaks during the journey');
    }
  } else if (transportMode === 'cycling') {
    steps.push('Get your bicycle ready');
    steps.push('Follow cycling-friendly routes where available');
  }

  // Add intermediate steps based on distance
  if (distance > 5) {
    steps.push('Continue on main road for majority of the journey');
    steps.push('Follow navigation prompts for turns and directions');
  }

  if (transportMode === 'bus') {
    steps.push('Get down at the stop nearest to your destination');
    steps.push('Walk the remaining distance if needed');
  }

  steps.push(`Arrive at your destination (${toCoords[0].toFixed(4)}, ${toCoords[1].toFixed(4)})`);

  return steps;
};

// Assess route quality based on multiple factors
const assessRouteQuality = (distance, transportMode, timeOfDay) => {
  let score = 100;
  let factors = [];

  // Distance factor
  if (distance > 15) {
    score -= 15;
    factors.push('Long distance journey');
  } else if (distance < 2) {
    score += 10;
    factors.push('Short distance - very convenient');
  }

  // Time of day factor
  if (timeOfDay === 'peak') {
    score -= 20;
    factors.push('Peak hours - expect delays');
  } else {
    score += 10;
    factors.push('Off-peak hours - smooth journey');
  }

  // Transport mode efficiency
  const efficiency = {
    walking: distance < 3 ? 20 : -10,
    cycling: distance < 8 ? 15 : -5,
    auto: distance < 12 ? 10 : 5,
    bus: 5,
    car: distance > 5 ? 15 : 0,
    bike: distance < 15 ? 12 : 8
  };

  score += efficiency[transportMode] || 0;

  // Determine quality rating
  let rating;
  if (score >= 90) rating = 'Excellent';
  else if (score >= 75) rating = 'Good';
  else if (score >= 60) rating = 'Average';
  else rating = 'Poor';

  return {
    score: Math.max(0, Math.min(100, score)),
    rating,
    factors
  };
};

// Generate unique route ID
const generateRouteId = () => {
  return 'route_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Get real-time pricing for all transport modes
router.post('/get-pricing', (req, res) => {
  try {
    const { fromCoords, toCoords, timeOfDay = 'normal' } = req.body;
    
    const distance = calculateDistance(
      fromCoords[0], fromCoords[1],
      toCoords[0], toCoords[1]
    );

    const transportModes = ['walking', 'cycling', 'auto', 'bus', 'car', 'bike'];
    const pricing = {};

    transportModes.forEach(mode => {
      pricing[mode] = {
        cost: calculateTransportCost(distance, mode, timeOfDay),
        time: calculateTravelTime(distance, mode, timeOfDay)
      };
    });

    res.json({
      success: true,
      distance: Math.round(distance * 100) / 100,
      pricing,
      timeOfDay,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Pricing calculation error:', error);
    res.status(500).json({ error: 'Failed to calculate pricing' });
  }
});

module.exports = router;
