const express = require('express');
const router = express.Router();

// Enhanced location database with real coordinates and metadata
const locationCategories = {
  landmarks: {
    name: 'Landmarks',
    icon: '🏛️',
    color: '#f97316',
    locations: [
      { 
        id: 'lm_001',
        name: 'Lingaraj Temple', 
        coords: [20.2372, 85.8344], 
        type: 'Religious',
        address: 'Old Town, Bhubaneswar, Odisha 751002',
        openHours: '05:00-22:00',
        description: 'Ancient Hindu temple dedicated to Lord Shiva',
        facilities: ['Parking', 'Prasad Counter', 'Security']
      },
      { 
        id: 'lm_002',
        name: 'Rajarani Temple', 
        coords: [20.2514, 85.8361], 
        type: 'Religious',
        address: 'Tankapani Road, Bhubaneswar, Odisha 751018',
        openHours: '06:00-18:00',
        description: '11th century temple known for its architectural beauty',
        facilities: ['ASI Museum', 'Garden', 'Parking']
      },
      { 
        id: 'lm_003',
        name: 'Khandagiri Caves', 
        coords: [20.2614, 85.7842], 
        type: 'Historical',
        address: 'Khandagiri, Bhubaneswar, Odisha 751030',
        openHours: '08:00-18:00',
        description: 'Ancient Jain rock-cut caves with historical significance',
        facilities: ['Archaeological Site', 'Climbing Path', 'Guide Services']
      },
      { 
        id: 'lm_004',
        name: 'Dhauli Peace Pagoda', 
        coords: [20.1928, 85.8628], 
        type: 'Historical',
        address: 'Dhauli Hills, Bhubaneswar, Odisha 752054',
        openHours: '08:00-18:00',
        description: 'Buddhist peace pagoda at the site of Kalinga War',
        facilities: ['Museum', 'Gardens', 'Light & Sound Show']
      },
      { 
        id: 'lm_005',
        name: 'Kalinga Stadium', 
        coords: [20.3096, 85.8022], 
        type: 'Sports',
        address: 'Kalinga Stadium, Bhubaneswar, Odisha 751007',
        openHours: '06:00-22:00',
        description: 'Multi-purpose stadium hosting international events',
        facilities: ['Multiple Sports', 'Parking', 'Food Courts']
      }
    ]
  },
  educational: {
    name: 'Educational',
    icon: '🎓',
    color: '#10b981',
    locations: [
      { 
        id: 'ed_001',
        name: 'KIIT University', 
        coords: [20.3558, 85.8166], 
        type: 'University',
        address: 'Campus 1, KIIT Road, Bhubaneswar, Odisha 751024',
        openHours: '24/7',
        description: 'Deemed University with multiple campuses',
        facilities: ['Library', 'Hostels', 'Medical Center', 'Sports Complex']
      },
      { 
        id: 'ed_002',
        name: 'NIT Rourkela Bhubaneswar Campus', 
        coords: [20.2847, 85.8242], 
        type: 'Engineering',
        address: 'Patia, Bhubaneswar, Odisha 751024',
        openHours: '24/7',
        description: 'Premier engineering institute',
        facilities: ['Central Library', 'Labs', 'Hostels', 'Cafeteria']
      },
      { 
        id: 'ed_003',
        name: 'Utkal University', 
        coords: [20.2847, 85.8292], 
        type: 'University',
        address: 'Vani Vihar, Bhubaneswar, Odisha 751004',
        openHours: '09:00-17:00',
        description: 'State university with diverse academic programs',
        facilities: ['Central Library', 'Examination Hall', 'Administrative Block']
      }
    ]
  },
  healthcare: {
    name: 'Healthcare',
    icon: '🏥',
    color: '#ef4444',
    locations: [
      { 
        id: 'hc_001',
        name: 'AIIMS Bhubaneswar', 
        coords: [20.1847, 85.8064], 
        type: 'Hospital',
        address: 'Sijua, Patrapada, Bhubaneswar, Odisha 751019',
        openHours: '24/7',
        description: 'Premier medical institute and hospital',
        facilities: ['Emergency', 'OPD', 'IPD', 'Trauma Center', 'Pharmacy']
      },
      { 
        id: 'hc_002',
        name: 'Apollo Hospitals', 
        coords: [20.2847, 85.8192], 
        type: 'Hospital',
        address: 'Plot No 251, Sainik School Road, Unit 15, Bhubaneswar, Odisha 751005',
        openHours: '24/7',
        description: 'Multi-specialty private healthcare',
        facilities: ['Emergency', 'Diagnostics', 'Surgery', 'ICU', 'Pharmacy']
      },
      { 
        id: 'hc_003',
        name: 'Sum Hospital', 
        coords: [20.3496, 85.8048], 
        type: 'Hospital',
        address: 'K8, Kalinga Nagar, Ghatikia, Bhubaneswar, Odisha 751003',
        openHours: '24/7',
        description: 'Teaching hospital with medical college',
        facilities: ['Emergency', 'Medical College', 'Research Center', 'Ambulance']
      }
    ]
  },
  publicTransport: {
    name: 'Public Transport',
    icon: '🚌',
    color: '#3b82f6',
    locations: [
      { 
        id: 'pt_001',
        name: 'Bhubaneswar Railway Station', 
        coords: [20.2647, 85.8341], 
        type: 'Railway Station',
        address: 'Station Square, Kharvel Nagar, Bhubaneswar, Odisha 751001',
        openHours: '24/7',
        description: 'Main railway junction connecting major cities',
        facilities: ['Waiting Hall', 'Food Court', 'ATM', 'Parking', 'Taxi Stand']
      },
      { 
        id: 'pt_002',
        name: 'Biju Patnaik International Airport', 
        coords: [20.2514, 85.7789], 
        type: 'Airport',
        address: 'Airport Road, Bhubaneswar, Odisha 751020',
        openHours: '24/7',
        description: 'International airport serving Odisha',
        facilities: ['Domestic Terminal', 'International Terminal', 'Parking', 'Restaurants']
      },
      { 
        id: 'pt_003',
        name: 'Master Canteen Bus Stand', 
        coords: [20.2715, 85.8361], 
        type: 'Bus Terminal',
        address: 'Master Canteen Square, Bhubaneswar, Odisha 751001',
        openHours: '05:00-23:00',
        description: 'Major city bus terminal',
        facilities: ['Ticket Counter', 'Waiting Area', 'Food Stalls', 'Auto Stand']
      }
    ]
  },
  shopping: {
    name: 'Shopping & Malls',
    icon: '🛍️',
    color: '#ec4899',
    locations: [
      { 
        id: 'sh_001',
        name: 'Esplanade One Mall', 
        coords: [20.2961, 85.8245], 
        type: 'Mall',
        address: 'Rasulgarh, Bhubaneswar, Odisha 751010',
        openHours: '10:00-22:00',
        description: 'Premium shopping and entertainment destination',
        facilities: ['Multi-brand Stores', 'Food Court', 'Cinema', 'Gaming Zone']
      },
      { 
        id: 'sh_002',
        name: 'DN Regalia Mall', 
        coords: [20.2847, 85.8192], 
        type: 'Mall',
        address: 'Opposite Sum Hospital, Kalinga Nagar, Bhubaneswar, Odisha 751003',
        openHours: '10:00-22:00',
        description: 'Shopping mall with diverse retail options',
        facilities: ['Retail Stores', 'Restaurants', 'Parking', 'ATM']
      }
    ]
  }
};

// Get all locations with enhanced data
router.get('/locations', (req, res) => {
  try {
    const { category, type, search } = req.query;
    let result = { ...locationCategories };

    // Filter by category
    if (category && result[category]) {
      result = { [category]: result[category] };
    }

    // Filter by type
    if (type) {
      Object.keys(result).forEach(cat => {
        result[cat].locations = result[cat].locations.filter(
          loc => loc.type.toLowerCase().includes(type.toLowerCase())
        );
      });
    }

    // Search functionality
    if (search) {
      Object.keys(result).forEach(cat => {
        result[cat].locations = result[cat].locations.filter(
          loc => 
            loc.name.toLowerCase().includes(search.toLowerCase()) ||
            loc.type.toLowerCase().includes(search.toLowerCase()) ||
            loc.description.toLowerCase().includes(search.toLowerCase())
        );
      });
    }

    res.json({
      success: true,
      categories: result,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Location fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch locations' });
  }
});

// Get location by ID with detailed information
router.get('/locations/:id', (req, res) => {
  try {
    const { id } = req.params;
    let foundLocation = null;
    let categoryName = null;

    // Search through all categories
    Object.keys(locationCategories).forEach(cat => {
      const location = locationCategories[cat].locations.find(loc => loc.id === id);
      if (location) {
        foundLocation = location;
        categoryName = cat;
      }
    });

    if (!foundLocation) {
      return res.status(404).json({ error: 'Location not found' });
    }

    res.json({
      success: true,
      location: foundLocation,
      category: categoryName,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Location detail error:', error);
    res.status(500).json({ error: 'Failed to fetch location details' });
  }
});

// Get nearby locations based on coordinates
router.post('/locations/nearby', (req, res) => {
  try {
    const { coords, radius = 5, limit = 10 } = req.body; // radius in km

    if (!coords || coords.length !== 2) {
      return res.status(400).json({ error: 'Valid coordinates required' });
    }

    const [userLat, userLon] = coords;
    const nearbyLocations = [];

    // Calculate distance to all locations
    Object.keys(locationCategories).forEach(category => {
      locationCategories[category].locations.forEach(location => {
        const distance = calculateDistance(
          userLat, userLon,
          location.coords[0], location.coords[1]
        );

        if (distance <= radius) {
          nearbyLocations.push({
            ...location,
            distance: Math.round(distance * 100) / 100,
            category
          });
        }
      });
    });

    // Sort by distance and limit results
    nearbyLocations.sort((a, b) => a.distance - b.distance);
    const limitedResults = nearbyLocations.slice(0, limit);

    res.json({
      success: true,
      count: limitedResults.length,
      locations: limitedResults,
      searchParams: { coords, radius, limit },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Nearby locations error:', error);
    res.status(500).json({ error: 'Failed to find nearby locations' });
  }
});

// Helper function to calculate distance (same as in routes.js)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

module.exports = router;
