const express = require('express');

const router = express.Router();

// Predefined travel plans for Bhubaneswar
const travelPlans = [
  {
    id: 'heritage_trail',
    title: 'Heritage Temple Trail',
    subtitle: 'Ancient Wisdom Journey',
    duration: '8 hours',
    distance: '25 km',
    difficulty: 'Easy',
    type: 'Cultural',
    rating: 4.8,
    reviews: 234,
    price: '₹899',
    priceUSD: 12,
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    description: 'Explore the magnificent temples of Bhubaneswar, showcasing 1000+ years of Kalinga architecture.',
    highlights: [
      'Lingaraj Temple - Lord Shiva\'s abode',
      'Mukteshwar Temple - Gem of Odisha',
      'Parasurameswara Temple - Ancient architecture',
      'Rajarani Temple - Love temple',
      'Brahmeswara Temple - Sacred site'
    ],
    itinerary: [
      { time: '6:00 AM', activity: 'Morning prayers at Lingaraj Temple', duration: '1.5 hours', location: { lat: 20.2367, lng: 85.8329 } },
      { time: '8:00 AM', activity: 'Explore Mukteshwar Temple complex', duration: '1 hour', location: { lat: 20.2444, lng: 85.8209 } },
      { time: '10:00 AM', activity: 'Visit Parasurameswara Temple', duration: '45 minutes', location: { lat: 20.2478, lng: 85.8214 } },
      { time: '12:00 PM', activity: 'Lunch break at traditional restaurant', duration: '1 hour', location: { lat: 20.2456, lng: 85.8156 } },
      { time: '2:00 PM', activity: 'Rajarani Temple photography session', duration: '1 hour', location: { lat: 20.2642, lng: 85.8056 } },
      { time: '4:00 PM', activity: 'Brahmeswara Temple and cultural center', duration: '1.5 hours', location: { lat: 20.2458, lng: 85.8156 } },
      { time: '6:00 PM', activity: 'Evening aarti and conclusion', duration: '30 minutes', location: { lat: 20.2367, lng: 85.8329 } }
    ],
    inclusions: ['Professional guide', 'Temple entry fees', 'Traditional lunch', 'Photography assistance'],
    exclusions: ['Personal expenses', 'Transportation to starting point', 'Tips'],
    transportation: 'AC Vehicle',
    bestTime: 'October to March',
    groupSize: '2-15 people',
    bookingInfo: {
      advanceBooking: '24 hours',
      cancellationPolicy: 'Free cancellation up to 24 hours before',
      paymentMethods: ['Cash', 'UPI', 'Card', 'Net Banking']
    },
    contact: {
      phone: '+91-9876543210',
      email: 'heritage@bhubaneswar-tours.com',
      whatsapp: '+91-9876543210'
    },
    tags: ['heritage', 'temples', 'culture', 'photography', 'spiritual'],
    seasons: ['winter', 'summer'],
    languages: ['English', 'Hindi', 'Odia'],
    accessibility: 'Wheelchair accessible temples available'
  },
  {
    id: 'sports_adventure',
    title: 'Sports & Adventure Circuit',
    subtitle: 'Athletic Excellence Tour',
    duration: '6 hours',
    distance: '18 km',
    difficulty: 'Moderate',
    type: 'Sports',
    rating: 4.6,
    reviews: 156,
    price: '₹1299',
    priceUSD: 16,
    image: 'https://images.unsplash.com/photo-1471295253337-3ceaaedca402?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    description: 'Experience world-class sports facilities and adventure activities in Bhubaneswar.',
    highlights: [
      'Kalinga Stadium - FIFA standard facility',
      'Sports Authority of India complex',
      'Adventure sports at Khandagiri',
      'Boating at Bindusagar Lake',
      'Cycling through smart city routes'
    ],
    itinerary: [
      { time: '7:00 AM', activity: 'Kalinga Stadium tour and track session', duration: '2 hours', location: { lat: 20.2825, lng: 85.8245 } },
      { time: '9:30 AM', activity: 'Sports Authority facilities visit', duration: '1 hour', location: { lat: 20.2756, lng: 85.8156 } },
      { time: '11:00 AM', activity: 'Rock climbing at Khandagiri caves', duration: '2 hours', location: { lat: 20.2678, lng: 85.7956 } },
      { time: '1:30 PM', activity: 'Lunch and rest', duration: '1 hour', location: { lat: 20.2756, lng: 85.8156 } },
      { time: '3:00 PM', activity: 'Boating and water sports', duration: '1.5 hours', location: { lat: 20.2356, lng: 85.8329 } },
      { time: '5:00 PM', activity: 'Cycling tour of smart city', duration: '1 hour', location: { lat: 20.2961, lng: 85.8245 } }
    ],
    inclusions: ['Sports equipment', 'Safety gear', 'Professional instructor', 'Energy drinks', 'First aid support'],
    exclusions: ['Personal insurance', 'Personal gear', 'Food (except energy drinks)'],
    transportation: 'Bicycle + AC Vehicle',
    bestTime: 'November to February',
    groupSize: '4-12 people',
    bookingInfo: {
      advanceBooking: '48 hours',
      cancellationPolicy: 'Free cancellation up to 48 hours before',
      paymentMethods: ['Cash', 'UPI', 'Card']
    },
    contact: {
      phone: '+91-9876543211',
      email: 'sports@bhubaneswar-tours.com',
      whatsapp: '+91-9876543211'
    },
    tags: ['sports', 'adventure', 'fitness', 'outdoor', 'cycling'],
    seasons: ['winter'],
    languages: ['English', 'Hindi'],
    accessibility: 'Requires physical fitness'
  },
  {
    id: 'education_tech',
    title: 'Education & Innovation Hub',
    subtitle: 'Knowledge Discovery Tour',
    duration: '7 hours',
    distance: '35 km',
    difficulty: 'Easy',
    type: 'Educational',
    rating: 4.7,
    reviews: 89,
    price: '₹1099',
    priceUSD: 14,
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    description: 'Discover premier educational institutions and innovation centers shaping India\'s future.',
    highlights: [
      'IIT Bhubaneswar campus tour',
      'Innovation labs and research centers',
      'KIIT University facilities',
      'Startup incubation centers',
      'Technology demonstrations'
    ],
    itinerary: [
      { time: '9:00 AM', activity: 'IIT Bhubaneswar campus tour', duration: '2 hours', location: { lat: 20.1489, lng: 85.6789 } },
      { time: '11:30 AM', activity: 'Research labs and innovation center', duration: '1.5 hours', location: { lat: 20.1489, lng: 85.6789 } },
      { time: '1:00 PM', activity: 'Lunch at campus cafeteria', duration: '1 hour', location: { lat: 20.1489, lng: 85.6789 } },
      { time: '2:30 PM', activity: 'KIIT University visit', duration: '2 hours', location: { lat: 20.3564, lng: 85.8178 } },
      { time: '4:30 PM', activity: 'Startup incubator and demo', duration: '1 hour', location: { lat: 20.3564, lng: 85.8178 } },
      { time: '6:00 PM', activity: 'Technology showcase and Q&A', duration: '30 minutes', location: { lat: 20.3564, lng: 85.8178 } }
    ],
    inclusions: ['Campus access', 'Guest lectures', 'Lab demonstrations', 'Networking session', 'Course materials'],
    exclusions: ['Personal expenses', 'Advanced workshop fees'],
    transportation: 'AC Vehicle',
    bestTime: 'Year round (weekdays)',
    groupSize: '5-20 people',
    bookingInfo: {
      advanceBooking: '1 week',
      cancellationPolicy: 'Free cancellation up to 72 hours before',
      paymentMethods: ['Cash', 'UPI', 'Card', 'Net Banking']
    },
    contact: {
      phone: '+91-9876543212',
      email: 'education@bhubaneswar-tours.com',
      whatsapp: '+91-9876543212'
    },
    tags: ['education', 'technology', 'innovation', 'research', 'career'],
    seasons: ['all'],
    languages: ['English', 'Hindi'],
    accessibility: 'Fully accessible'
  },
  {
    id: 'healthcare_wellness',
    title: 'Healthcare & Wellness Journey',
    subtitle: 'Holistic Health Experience',
    duration: '5 hours',
    distance: '20 km',
    difficulty: 'Easy',
    type: 'Wellness',
    rating: 4.9,
    reviews: 67,
    price: '₹1599',
    priceUSD: 20,
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    description: 'Experience world-class healthcare facilities and traditional wellness practices.',
    highlights: [
      'AIIMS Bhubaneswar facility tour',
      'Traditional Ayurveda center',
      'Yoga and meditation session',
      'Herbal garden exploration',
      'Health screening and consultation'
    ],
    itinerary: [
      { time: '8:00 AM', activity: 'AIIMS facility tour and overview', duration: '1.5 hours', location: { lat: 20.1867, lng: 85.8029 } },
      { time: '10:00 AM', activity: 'Ayurveda center and consultation', duration: '1 hour', location: { lat: 20.2456, lng: 85.8156 } },
      { time: '11:30 AM', activity: 'Yoga and meditation session', duration: '1 hour', location: { lat: 20.2456, lng: 85.8156 } },
      { time: '1:00 PM', activity: 'Healthy lunch and nutrition talk', duration: '1 hour', location: { lat: 20.2456, lng: 85.8156 } },
      { time: '2:30 PM', activity: 'Herbal garden and plant medicine', duration: '1 hour', location: { lat: 20.2456, lng: 85.8156 } },
      { time: '4:00 PM', activity: 'Wellness screening and advice', duration: '30 minutes', location: { lat: 20.1867, lng: 85.8029 } }
    ],
    inclusions: ['Medical consultation', 'Wellness screening', 'Ayurveda products', 'Yoga session', 'Healthy meal'],
    exclusions: ['Prescription medicines', 'Advanced treatments', 'Personal health insurance'],
    transportation: 'AC Vehicle',
    bestTime: 'Year round',
    groupSize: '2-10 people',
    bookingInfo: {
      advanceBooking: '72 hours',
      cancellationPolicy: 'Free cancellation up to 48 hours before',
      paymentMethods: ['Cash', 'UPI', 'Card', 'Net Banking']
    },
    contact: {
      phone: '+91-9876543213',
      email: 'wellness@bhubaneswar-tours.com',
      whatsapp: '+91-9876543213'
    },
    tags: ['wellness', 'health', 'ayurveda', 'yoga', 'meditation'],
    seasons: ['all'],
    languages: ['English', 'Hindi', 'Odia'],
    accessibility: 'Fully accessible with medical support'
  }
];

// GET /api/travel-plans - Get all travel plans
router.get('/', (req, res) => {
  try {
    const { type, difficulty, minPrice, maxPrice, duration } = req.query;
    let filteredPlans = [...travelPlans];

    // Filter by type
    if (type && type !== 'all') {
      filteredPlans = filteredPlans.filter(plan => 
        plan.type.toLowerCase() === type.toLowerCase()
      );
    }

    // Filter by difficulty
    if (difficulty) {
      filteredPlans = filteredPlans.filter(plan => 
        plan.difficulty.toLowerCase() === difficulty.toLowerCase()
      );
    }

    // Filter by price range (convert ₹ to number)
    if (minPrice || maxPrice) {
      filteredPlans = filteredPlans.filter(plan => {
        const price = parseInt(plan.price.replace('₹', '').replace(',', ''));
        if (minPrice && price < parseInt(minPrice)) return false;
        if (maxPrice && price > parseInt(maxPrice)) return false;
        return true;
      });
    }

    // Filter by duration
    if (duration) {
      filteredPlans = filteredPlans.filter(plan => 
        plan.duration.includes(duration)
      );
    }

    res.json({
      success: true,
      data: filteredPlans,
      total: filteredPlans.length,
      filters: { type, difficulty, minPrice, maxPrice, duration }
    });
  } catch (error) {
    console.error('Error fetching travel plans:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch travel plans',
      error: error.message
    });
  }
});

// GET /api/travel-plans/:id - Get specific travel plan
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const plan = travelPlans.find(p => p.id === id);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Travel plan not found'
      });
    }

    res.json({
      success: true,
      data: plan
    });
  } catch (error) {
    console.error('Error fetching travel plan:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch travel plan',
      error: error.message
    });
  }
});

// POST /api/travel-plans/:id/book - Book a travel plan
router.post('/:id/book', (req, res) => {
  try {
    const { id } = req.params;
    const { 
      customerName, 
      email, 
      phone, 
      date, 
      groupSize, 
      specialRequests,
      emergencyContact 
    } = req.body;

    const plan = travelPlans.find(p => p.id === id);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Travel plan not found'
      });
    }

    // Validate required fields
    if (!customerName || !email || !phone || !date || !groupSize) {
      return res.status(400).json({
        success: false,
        message: 'Missing required booking information'
      });
    }

    // Validate group size
    const maxGroupSize = parseInt(plan.groupSize.split('-')[1].replace(' people', ''));
    if (groupSize > maxGroupSize) {
      return res.status(400).json({
        success: false,
        message: `Group size exceeds maximum limit of ${maxGroupSize} people`
      });
    }

    // Calculate total price
    const basePrice = parseInt(plan.price.replace('₹', '').replace(',', ''));
    const totalPrice = basePrice * groupSize;

    // Generate booking ID
    const bookingId = `BHU-${Date.now()}-${id.toUpperCase()}`;

    const booking = {
      bookingId,
      planId: id,
      planTitle: plan.title,
      customerDetails: {
        name: customerName,
        email,
        phone,
        emergencyContact
      },
      bookingDetails: {
        date,
        groupSize,
        totalPrice,
        priceBreakdown: {
          basePrice,
          groupSize,
          totalAmount: totalPrice
        },
        specialRequests: specialRequests || ''
      },
      status: 'confirmed',
      bookingDate: new Date().toISOString(),
      paymentStatus: 'pending'
    };

    // In a real application, you would save this to a database
    console.log('New booking created:', booking);

    res.json({
      success: true,
      data: booking,
      message: 'Booking confirmed successfully!'
    });
  } catch (error) {
    console.error('Error booking travel plan:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to book travel plan',
      error: error.message
    });
  }
});

// GET /api/travel-plans/types/all - Get all plan types
router.get('/types/all', (req, res) => {
  try {
    const types = [...new Set(travelPlans.map(plan => plan.type))];
    res.json({
      success: true,
      data: types
    });
  } catch (error) {
    console.error('Error fetching plan types:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch plan types',
      error: error.message
    });
  }
});

// GET /api/travel-plans/stats/overview - Get overview statistics
router.get('/stats/overview', (req, res) => {
  try {
    const stats = {
      totalPlans: travelPlans.length,
      averageRating: (travelPlans.reduce((sum, plan) => sum + plan.rating, 0) / travelPlans.length).toFixed(1),
      totalReviews: travelPlans.reduce((sum, plan) => sum + plan.reviews, 0),
      priceRange: {
        min: Math.min(...travelPlans.map(plan => parseInt(plan.price.replace('₹', '').replace(',', '')))),
        max: Math.max(...travelPlans.map(plan => parseInt(plan.price.replace('₹', '').replace(',', ''))))
      },
      types: [...new Set(travelPlans.map(plan => plan.type))],
      difficulties: [...new Set(travelPlans.map(plan => plan.difficulty))],
      popularPlans: travelPlans
        .sort((a, b) => b.rating * b.reviews - a.rating * a.reviews)
        .slice(0, 3)
        .map(plan => ({
          id: plan.id,
          title: plan.title,
          rating: plan.rating,
          reviews: plan.reviews,
          price: plan.price
        }))
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching plan statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch plan statistics',
      error: error.message
    });
  }
});

module.exports = router;
