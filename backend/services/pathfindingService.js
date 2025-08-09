// Pathfinding service with real-time calculations for Bhubaneswar

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

// Real-time pricing based on actual services in Bhubaneswar
const calculateTransportCost = (distance, transportMode, timeOfDay = 'normal') => {
  const basePrices = {
    walking: { 
      base: 0, 
      perKm: 0, 
      surge: 1,
      description: 'Free and healthy option'
    },
    cycling: { 
      base: 0, 
      perKm: 0, 
      surge: 1,
      description: 'Eco-friendly and free'
    },
    auto: { 
      base: 25, 
      perKm: 12, 
      surge: timeOfDay === 'peak' ? 1.5 : 1,
      waiting: 2, // per minute waiting
      description: 'Most popular choice in Bhubaneswar'
    },
    bus: { 
      base: 8, 
      perKm: 2, 
      surge: 1,
      maxFare: 45,
      description: 'Most economical public transport'
    },
    car: {
      base: 60,
      perKm: 15,
      surge: timeOfDay === 'peak' ? 1.8 : 1.2,
      booking: 10,
      description: 'Comfortable private transport'
    },
    bike: {
      base: 20,
      perKm: 8,
      surge: timeOfDay === 'peak' ? 1.3 : 1,
      waiting: 1.5,
      description: 'Quick and affordable'
    }
  };

  const pricing = basePrices[transportMode];
  if (!pricing) return { min: 0, max: 0, estimated: 0 };

  if (transportMode === 'walking' || transportMode === 'cycling') {
    return { 
      min: 0, 
      max: 0, 
      estimated: 0, 
      type: 'Free',
      description: pricing.description,
      breakdown: {
        base: 0,
        distance: 0,
        surge: 'None',
        booking: 0
      }
    };
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
    currency: 'INR',
    type: 'Paid',
    description: pricing.description,
    breakdown: {
      base: baseCost,
      distance: Math.round(distanceCost),
      surge: pricing.surge > 1 ? `${Math.round((pricing.surge - 1) * 100)}%` : 'None',
      booking: pricing.booking || 0,
      waiting: pricing.waiting ? `₹${pricing.waiting}/min` : 'N/A'
    },
    paymentMethods: getPaymentMethods(transportMode)
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
    bus: timeOfDay === 'peak' ? 15 : 10,
    walking: 0,
    cycling: 0
  };

  const waitingTime = waitingTimes[transportMode] || 0;
  const totalTime = timeInMinutes + waitingTime;

  return {
    travel: timeInMinutes,
    waiting: waitingTime,
    total: totalTime,
    display: formatTime(totalTime),
    breakdown: {
      travelTime: formatTime(timeInMinutes),
      waitingTime: waitingTime > 0 ? formatTime(waitingTime) : 'None',
      peakHourAdjustment: timeOfDay === 'peak' ? 'Applied' : 'None'
    }
  };
};

// Calculate optimal route based on preferences
const calculateOptimalRoute = (distance, availableModes, preferences = {}) => {
  const scores = {};
  
  availableModes.forEach(mode => {
    let score = 50; // Base score
    
    // Distance efficiency
    if (mode === 'walking' && distance < 2) score += 30;
    else if (mode === 'cycling' && distance < 8) score += 25;
    else if (mode === 'auto' && distance < 12) score += 20;
    else if (mode === 'bus' && distance > 5) score += 15;
    else if (mode === 'car' && distance > 8) score += 20;
    else if (mode === 'bike' && distance < 20) score += 18;
    
    // Preference adjustments
    if (preferences.eco && ['walking', 'cycling'].includes(mode)) score += 20;
    if (preferences.budget && ['walking', 'cycling', 'bus'].includes(mode)) score += 15;
    if (preferences.comfort && ['car', 'auto'].includes(mode)) score += 10;
    if (preferences.speed && ['bike', 'car'].includes(mode)) score += 12;
    
    scores[mode] = Math.max(0, Math.min(100, score));
  });
  
  return scores;
};

// Get available payment methods by transport mode
const getPaymentMethods = (transportMode) => {
  const methods = {
    auto: ['Cash', 'Ola Money', 'UPI', 'Credit/Debit Card'],
    car: ['Cash', 'Ola Money', 'Uber Cash', 'UPI', 'Credit/Debit Card'],
    bike: ['Cash', 'Rapido Wallet', 'UPI', 'Credit/Debit Card'],
    bus: ['Cash', 'Bus Card', 'UPI', 'Mo Bus App'],
    walking: ['None'],
    cycling: ['None']
  };
  
  return methods[transportMode] || ['Cash'];
};

// Format time display
const formatTime = (minutes) => {
  if (minutes < 60) {
    return `${minutes} min${minutes !== 1 ? 's' : ''}`;
  } else {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  }
};

// Calculate environmental impact
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

  // Calculate tree equivalent (1 tree absorbs ~22kg CO2 per year)
  const treeEquivalent = co2Kg / 22 * 365; // Trees needed for a year

  return {
    co2Emissions: {
      grams: Math.round(co2Grams),
      kg: Math.round(co2Kg * 100) / 100,
      display: co2Kg > 1 ? `${Math.round(co2Kg * 100) / 100} kg` : `${Math.round(co2Grams)} g`
    },
    ecoRating: co2Grams === 0 ? 'Excellent' : 
               co2Grams < 500 ? 'Good' : 
               co2Grams < 1000 ? 'Average' : 'Poor',
    ecoScore: Math.max(0, 100 - (co2Grams / 20)),
    treeEquivalent: treeEquivalent > 0.01 ? Math.round(treeEquivalent * 1000) / 1000 : 0,
    carbonOffset: co2Kg * 2.5 // Estimated cost in INR to offset
  };
};

// Calculate route complexity and safety
const calculateRouteSafety = (distance, transportMode, timeOfDay) => {
  let safetyScore = 80; // Base safety score
  let factors = [];

  // Mode-based safety
  const modeSafety = {
    walking: timeOfDay === 'night' ? -15 : 5,
    cycling: timeOfDay === 'peak' ? -10 : 0,
    auto: 10,
    bus: 15,
    car: 20,
    bike: timeOfDay === 'peak' ? -5 : 5
  };

  safetyScore += modeSafety[transportMode] || 0;

  // Distance factors
  if (distance > 20) {
    safetyScore -= 10;
    factors.push('Long distance journey');
  }

  // Time factors
  if (timeOfDay === 'night') {
    safetyScore -= 15;
    factors.push('Night travel - extra caution needed');
  } else if (timeOfDay === 'peak') {
    safetyScore -= 5;
    factors.push('Heavy traffic conditions');
  }

  return {
    score: Math.max(0, Math.min(100, safetyScore)),
    rating: safetyScore >= 80 ? 'High' : safetyScore >= 60 ? 'Medium' : 'Low',
    factors: factors
  };
};

module.exports = {
  calculateDistance,
  calculateTransportCost,
  calculateTravelTime,
  calculateOptimalRoute,
  calculateEnvironmentalImpact,
  calculateRouteSafety,
  formatTime
};
