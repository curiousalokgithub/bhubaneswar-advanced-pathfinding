// Location service for managing Bhubaneswar locations data

const { calculateDistance } = require('./pathfindingService');

// Enhanced location database with real coordinates and metadata
const locationCategories = {
  landmarks: {
    name: 'Landmarks & Heritage',
    icon: '🏛️',
    color: '#f97316',
    description: 'Historical sites, temples, and cultural landmarks',
    locations: [
      { 
        id: 'lm_001',
        name: 'Lingaraj Temple', 
        coords: [20.2372, 85.8344], 
        type: 'Religious',
        address: 'Old Town, Bhubaneswar, Odisha 751002',
        openHours: '05:00-22:00',
        description: 'Ancient Hindu temple dedicated to Lord Shiva, dating back to 11th century',
        facilities: ['Parking', 'Prasad Counter', 'Security', 'Shoe Stand'],
        rating: 4.5,
        visitDuration: '1-2 hours',
        entryFee: 'Free',
        bestTimeToVisit: 'Early morning or evening',
        nearbyTransport: ['Auto Stand', 'Bus Stop']
      },
      { 
        id: 'lm_002',
        name: 'Rajarani Temple', 
        coords: [20.2514, 85.8361], 
        type: 'Religious',
        address: 'Tankapani Road, Bhubaneswar, Odisha 751018',
        openHours: '06:00-18:00',
        description: '11th century temple known for its architectural beauty and intricate carvings',
        facilities: ['ASI Museum', 'Garden', 'Parking', 'Guide Services'],
        rating: 4.3,
        visitDuration: '45 minutes - 1 hour',
        entryFee: '₹25 (Indians), ₹300 (Foreigners)',
        bestTimeToVisit: 'Morning hours',
        nearbyTransport: ['Auto Stand', 'Taxi Available']
      },
      { 
        id: 'lm_003',
        name: 'Khandagiri Caves', 
        coords: [20.2614, 85.7842], 
        type: 'Historical',
        address: 'Khandagiri, Bhubaneswar, Odisha 751030',
        openHours: '08:00-18:00',
        description: 'Ancient Jain rock-cut caves with historical significance dating to 2nd century BCE',
        facilities: ['Archaeological Site', 'Climbing Path', 'Guide Services', 'Parking'],
        rating: 4.2,
        visitDuration: '2-3 hours',
        entryFee: '₹25 (Indians), ₹300 (Foreigners)',
        bestTimeToVisit: 'Early morning',
        nearbyTransport: ['Bus Stop', 'Auto Stand']
      },
      { 
        id: 'lm_004',
        name: 'Dhauli Peace Pagoda', 
        coords: [20.1928, 85.8628], 
        type: 'Historical',
        address: 'Dhauli Hills, Bhubaneswar, Odisha 752054',
        openHours: '08:00-18:00',
        description: 'Buddhist peace pagoda at the site of the historic Kalinga War',
        facilities: ['Museum', 'Gardens', 'Light & Sound Show', 'Cafeteria'],
        rating: 4.4,
        visitDuration: '1.5-2 hours',
        entryFee: 'Free (Museum: ₹10)',
        bestTimeToVisit: 'Evening for light show',
        nearbyTransport: ['Tourist Bus', 'Private Vehicle Required']
      },
      { 
        id: 'lm_005',
        name: 'Kalinga Stadium', 
        coords: [20.3096, 85.8022], 
        type: 'Sports',
        address: 'Kalinga Stadium, Bhubaneswar, Odisha 751007',
        openHours: '06:00-22:00',
        description: 'World-class multi-purpose stadium hosting international hockey and other events',
        facilities: ['Multiple Sports Grounds', 'Parking', 'Food Courts', 'Training Facilities'],
        rating: 4.6,
        visitDuration: 'Event dependent',
        entryFee: 'Event dependent',
        bestTimeToVisit: 'During events',
        nearbyTransport: ['Bus Stop', 'Ample Parking']
      }
    ]
  },
  educational: {
    name: 'Educational Institutions',
    icon: '🎓',
    color: '#10b981',
    description: 'Universities, colleges, and research institutions',
    locations: [
      { 
        id: 'ed_001',
        name: 'KIIT University', 
        coords: [20.3558, 85.8166], 
        type: 'University',
        address: 'Campus 1, KIIT Road, Bhubaneswar, Odisha 751024',
        openHours: '24/7',
        description: 'Deemed University with multiple campuses and diverse academic programs',
        facilities: ['Central Library', 'Hostels', 'Medical Center', 'Sports Complex', 'Multiple Campuses'],
        rating: 4.3,
        visitDuration: 'Campus tour: 2-3 hours',
        entryFee: 'Visitor pass required',
        bestTimeToVisit: 'Working hours',
        nearbyTransport: ['University Bus', 'Auto Stand', 'KIIT Bus Service']
      },
      { 
        id: 'ed_002',
        name: 'NIT Rourkela Bhubaneswar Campus', 
        coords: [20.2847, 85.8242], 
        type: 'Engineering',
        address: 'Patia, Bhubaneswar, Odisha 751024',
        openHours: '24/7',
        description: 'Premier engineering institute with excellent academic and research facilities',
        facilities: ['Central Library', 'Advanced Labs', 'Hostels', 'Cafeteria', 'Research Centers'],
        rating: 4.5,
        visitDuration: 'Campus visit: 2-3 hours',
        entryFee: 'Permission required',
        bestTimeToVisit: 'Academic hours',
        nearbyTransport: ['Bus Stop', 'Auto Stand']
      },
      { 
        id: 'ed_003',
        name: 'Utkal University', 
        coords: [20.2847, 85.8292], 
        type: 'University',
        address: 'Vani Vihar, Bhubaneswar, Odisha 751004',
        openHours: '09:00-17:00',
        description: 'State university with diverse academic programs and rich heritage',
        facilities: ['Central Library', 'Examination Hall', 'Administrative Block', 'Campus Gardens'],
        rating: 4.1,
        visitDuration: '1-2 hours',
        entryFee: 'Free for campus visit',
        bestTimeToVisit: 'Morning hours',
        nearbyTransport: ['City Bus', 'Auto Stand']
      }
    ]
  },
  healthcare: {
    name: 'Healthcare Centers',
    icon: '🏥',
    color: '#ef4444',
    description: 'Hospitals, clinics, and medical facilities',
    locations: [
      { 
        id: 'hc_001',
        name: 'AIIMS Bhubaneswar', 
        coords: [20.1847, 85.8064], 
        type: 'Hospital',
        address: 'Sijua, Patrapada, Bhubaneswar, Odisha 751019',
        openHours: '24/7',
        description: 'Premier medical institute and hospital with world-class facilities',
        facilities: ['Emergency', 'OPD', 'IPD', 'Trauma Center', 'Pharmacy', 'Blood Bank', 'Diagnostics'],
        rating: 4.7,
        visitDuration: 'As needed',
        entryFee: 'OPD charges apply',
        bestTimeToVisit: 'Emergency: Anytime, OPD: Morning',
        nearbyTransport: ['Bus Service', 'Auto Stand', 'Ambulance Service']
      },
      { 
        id: 'hc_002',
        name: 'Apollo Hospitals', 
        coords: [20.2847, 85.8192], 
        type: 'Hospital',
        address: 'Plot No 251, Sainik School Road, Unit 15, Bhubaneswar, Odisha 751005',
        openHours: '24/7',
        description: 'Multi-specialty private healthcare with advanced medical technology',
        facilities: ['Emergency', 'Diagnostics', 'Surgery', 'ICU', 'Pharmacy', 'Health Checkup'],
        rating: 4.4,
        visitDuration: 'As needed',
        entryFee: 'Consultation charges apply',
        bestTimeToVisit: 'Appointment preferred',
        nearbyTransport: ['Private Parking', 'Auto Available', 'Cab Service']
      },
      { 
        id: 'hc_003',
        name: 'Sum Hospital', 
        coords: [20.3496, 85.8048], 
        type: 'Hospital',
        address: 'K8, Kalinga Nagar, Ghatikia, Bhubaneswar, Odisha 751003',
        openHours: '24/7',
        description: 'Teaching hospital with medical college and comprehensive healthcare services',
        facilities: ['Emergency', 'Medical College', 'Research Center', 'Ambulance', 'Specialist Clinics'],
        rating: 4.2,
        visitDuration: 'As needed',
        entryFee: 'Moderate charges',
        bestTimeToVisit: 'Emergency: Anytime',
        nearbyTransport: ['Hospital Bus', 'Auto Stand', 'Parking Available']
      }
    ]
  },
  publicTransport: {
    name: 'Transport Hubs',
    icon: '🚌',
    color: '#3b82f6',
    description: 'Railway stations, bus terminals, and airport',
    locations: [
      { 
        id: 'pt_001',
        name: 'Bhubaneswar Railway Station', 
        coords: [20.2647, 85.8341], 
        type: 'Railway Station',
        address: 'Station Square, Kharvel Nagar, Bhubaneswar, Odisha 751001',
        openHours: '24/7',
        description: 'Main railway junction connecting major cities across India',
        facilities: ['Waiting Hall', 'Food Court', 'ATM', 'Parking', 'Taxi Stand', 'Cloak Room', 'WiFi'],
        rating: 4.0,
        visitDuration: 'Transit dependent',
        entryFee: 'Platform ticket: ₹10',
        bestTimeToVisit: 'As per train schedule',
        nearbyTransport: ['Auto Stand', 'Bus Terminal', 'Taxi Service']
      },
      { 
        id: 'pt_002',
        name: 'Biju Patnaik International Airport', 
        coords: [20.2514, 85.7789], 
        type: 'Airport',
        address: 'Airport Road, Bhubaneswar, Odisha 751020',
        openHours: '24/7',
        description: 'International airport serving Odisha with domestic and international flights',
        facilities: ['Domestic Terminal', 'International Terminal', 'Parking', 'Restaurants', 'Duty Free', 'WiFi'],
        rating: 4.3,
        visitDuration: 'Flight dependent',
        entryFee: 'Entry with valid ticket',
        bestTimeToVisit: 'As per flight schedule',
        nearbyTransport: ['Airport Taxi', 'Bus Service', 'Private Cabs']
      },
      { 
        id: 'pt_003',
        name: 'Master Canteen Bus Stand', 
        coords: [20.2715, 85.8361], 
        type: 'Bus Terminal',
        address: 'Master Canteen Square, Bhubaneswar, Odisha 751001',
        openHours: '05:00-23:00',
        description: 'Major city bus terminal connecting various parts of Bhubaneswar',
        facilities: ['Ticket Counter', 'Waiting Area', 'Food Stalls', 'Auto Stand', 'Information Desk'],
        rating: 3.8,
        visitDuration: 'Transit dependent',
        entryFee: 'Bus fare applicable',
        bestTimeToVisit: 'Peak hours: 7-10 AM, 5-8 PM',
        nearbyTransport: ['City Buses', 'Auto Rickshaw', 'Walking Distance to Railway']
      }
    ]
  },
  shopping: {
    name: 'Shopping & Entertainment',
    icon: '🛍️',
    color: '#ec4899',
    description: 'Malls, markets, and shopping centers',
    locations: [
      { 
        id: 'sh_001',
        name: 'Esplanade One Mall', 
        coords: [20.2961, 85.8245], 
        type: 'Mall',
        address: 'Rasulgarh, Bhubaneswar, Odisha 751010',
        openHours: '10:00-22:00',
        description: 'Premium shopping and entertainment destination with multiple brands',
        facilities: ['Multi-brand Stores', 'Food Court', 'Cinema', 'Gaming Zone', 'Parking', 'ATM'],
        rating: 4.2,
        visitDuration: '2-4 hours',
        entryFee: 'Free entry',
        bestTimeToVisit: 'Weekends and evenings',
        nearbyTransport: ['Mall Shuttle', 'Auto Stand', 'Ample Parking']
      },
      { 
        id: 'sh_002',
        name: 'DN Regalia Mall', 
        coords: [20.2847, 85.8192], 
        type: 'Mall',
        address: 'Opposite Sum Hospital, Kalinga Nagar, Bhubaneswar, Odisha 751003',
        openHours: '10:00-22:00',
        description: 'Shopping mall with diverse retail options and dining facilities',
        facilities: ['Retail Stores', 'Restaurants', 'Parking', 'ATM', 'Entertainment Zone'],
        rating: 4.0,
        visitDuration: '2-3 hours',
        entryFee: 'Free entry',
        bestTimeToVisit: 'Evenings and weekends',
        nearbyTransport: ['Bus Stop Nearby', 'Auto Available', 'Parking Facility']
      },
      { 
        id: 'sh_003',
        name: 'Patia Market', 
        coords: [20.3547, 85.8197], 
        type: 'Local Market',
        address: 'Patia, Bhubaneswar, Odisha 751024',
        openHours: '08:00-21:00',
        description: 'Vibrant local market for daily essentials, clothing, and local products',
        facilities: ['Vegetable Market', 'Clothing Stores', 'Electronics', 'Street Food'],
        rating: 3.9,
        visitDuration: '1-2 hours',
        entryFee: 'Free',
        bestTimeToVisit: 'Morning for fresh produce',
        nearbyTransport: ['Bus Stop', 'Auto Stand', 'Walking Distance from KIIT']
      }
    ]
  },
  restaurants: {
    name: 'Restaurants & Food',
    icon: '🍽️',
    color: '#f59e0b',
    description: 'Restaurants, cafes, and food courts',
    locations: [
      { 
        id: 'rs_001',
        name: 'Dalma', 
        coords: [20.2847, 85.8192], 
        type: 'Restaurant',
        address: 'Mayfair Lagoon, Jaydev Vihar, Bhubaneswar, Odisha 751013',
        openHours: '12:00-15:00, 19:00-23:00',
        description: 'Fine dining restaurant serving authentic Odia cuisine',
        facilities: ['Air Conditioning', 'Parking', 'Live Music', 'Private Dining'],
        rating: 4.5,
        visitDuration: '1-2 hours',
        entryFee: 'Premium pricing',
        bestTimeToVisit: 'Dinner time',
        nearbyTransport: ['Valet Parking', 'Auto Available']
      },
      { 
        id: 'rs_002',
        name: 'Truptee Restaurant', 
        coords: [20.2715, 85.8361], 
        type: 'Restaurant',
        address: 'Saheed Nagar, Bhubaneswar, Odisha 751007',
        openHours: '11:00-23:00',
        description: 'Popular local restaurant known for traditional Odia thali',
        facilities: ['Family Dining', 'Take Away', 'Home Delivery'],
        rating: 4.3,
        visitDuration: '45 minutes - 1 hour',
        entryFee: 'Moderate pricing',
        bestTimeToVisit: 'Lunch and dinner',
        nearbyTransport: ['Bus Stop', 'Auto Stand', 'Walking Distance']
      }
    ]
  }
};

// Search locations with filters
const searchLocations = (searchParams) => {
  const { 
    category, 
    type, 
    search, 
    limit = 50,
    offset = 0,
    sortBy = 'name',
    sortOrder = 'asc'
  } = searchParams;

  let result = { ...locationCategories };
  let totalCount = 0;
  let filteredCount = 0;

  // Count total locations
  Object.keys(locationCategories).forEach(cat => {
    totalCount += locationCategories[cat].locations.length;
  });

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
          loc.description.toLowerCase().includes(search.toLowerCase()) ||
          loc.address.toLowerCase().includes(search.toLowerCase())
      );
    });
  }

  // Count filtered results
  Object.keys(result).forEach(cat => {
    filteredCount += result[cat].locations.length;
  });

  // Flatten for sorting and pagination
  let allLocations = [];
  Object.keys(result).forEach(cat => {
    result[cat].locations.forEach(loc => {
      allLocations.push({
        ...loc,
        category: cat,
        categoryInfo: {
          name: result[cat].name,
          icon: result[cat].icon,
          color: result[cat].color
        }
      });
    });
  });

  // Sort locations
  allLocations.sort((a, b) => {
    if (sortBy === 'name') {
      return sortOrder === 'asc' ? 
        a.name.localeCompare(b.name) : 
        b.name.localeCompare(a.name);
    } else if (sortBy === 'rating') {
      return sortOrder === 'asc' ? 
        (a.rating || 0) - (b.rating || 0) : 
        (b.rating || 0) - (a.rating || 0);
    } else if (sortBy === 'type') {
      return sortOrder === 'asc' ? 
        a.type.localeCompare(b.type) : 
        b.type.localeCompare(a.type);
    }
    return 0;
  });

  // Apply pagination
  const paginatedLocations = allLocations.slice(offset, offset + limit);

  // Reconstruct categories with paginated results
  const paginatedResult = {};
  paginatedLocations.forEach(loc => {
    if (!paginatedResult[loc.category]) {
      paginatedResult[loc.category] = {
        ...result[loc.category],
        locations: []
      };
    }
    paginatedResult[loc.category].locations.push(loc);
  });

  return {
    categories: paginatedResult,
    totalCount,
    filteredCount,
    paginatedCount: paginatedLocations.length
  };
};

// Find nearby locations
const findNearbyLocations = (searchParams) => {
  const { 
    coords, 
    radius = 5, 
    limit = 20,
    categories = [],
    excludeCategories = []
  } = searchParams;

  const [userLat, userLon] = coords;
  const nearbyLocations = [];

  // Filter categories to search
  let categoriesToSearch = Object.keys(locationCategories);
  
  if (categories.length > 0) {
    categoriesToSearch = categoriesToSearch.filter(cat => categories.includes(cat));
  }
  
  if (excludeCategories.length > 0) {
    categoriesToSearch = categoriesToSearch.filter(cat => !excludeCategories.includes(cat));
  }

  // Calculate distance to all locations in selected categories
  categoriesToSearch.forEach(category => {
    locationCategories[category].locations.forEach(location => {
      const distance = calculateDistance(
        userLat, userLon,
        location.coords[0], location.coords[1]
      );

      if (distance <= radius) {
        nearbyLocations.push({
          ...location,
          distance: {
            km: Math.round(distance * 100) / 100,
            display: `${Math.round(distance * 100) / 100} km away`
          },
          category: category,
          categoryInfo: {
            name: locationCategories[category].name,
            icon: locationCategories[category].icon,
            color: locationCategories[category].color
          }
        });
      }
    });
  });

  // Sort by distance and limit results
  nearbyLocations.sort((a, b) => a.distance.km - b.distance.km);
  return nearbyLocations.slice(0, limit);
};

// Get location statistics
const getLocationStatistics = () => {
  const stats = {
    totalLocations: 0,
    categoriesCount: Object.keys(locationCategories).length,
    categoryStats: {}
  };

  Object.keys(locationCategories).forEach(cat => {
    const locations = locationCategories[cat].locations;
    stats.totalLocations += locations.length;
    
    stats.categoryStats[cat] = {
      name: locationCategories[cat].name,
      count: locations.length,
      types: [...new Set(locations.map(loc => loc.type))],
      averageRating: locations.reduce((sum, loc) => sum + (loc.rating || 0), 0) / locations.length
    };
  });

  return stats;
};

module.exports = {
  locationCategories,
  searchLocations,
  findNearbyLocations,
  getLocationStatistics
};
