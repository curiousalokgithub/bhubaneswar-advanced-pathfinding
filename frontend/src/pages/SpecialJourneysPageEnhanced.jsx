import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { FaRoute, FaClock, FaMapMarkerAlt, FaStar, FaCamera, FaHeart, FaShare, FaDownload, FaPlay, FaCalendar, FaUsers, FaBus, FaCar } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { travelPlansAPI } from '../services/apiEnhanced';
import { bhubaneswarPhotos } from '../data/bhubaneswarPhotos';
import LoadingSpinner from '../components/LoadingSpinner';

const SpecialJourneysPageEnhanced = () => {
  const [travelPlans, setTravelPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const heroRef = useRef(null);
  const cardsRef = useRef([]);

  // Predefined special travel plans for Bhubaneswar
  const specialPlans = [
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
      image: bhubaneswarPhotos.lingaraj_temple.main,
      gallery: bhubaneswarPhotos.lingaraj_temple.gallery,
      description: 'Explore the magnificent temples of Bhubaneswar, showcasing 1000+ years of Kalinga architecture.',
      highlights: [
        'Lingaraj Temple - Lord Shiva\'s abode',
        'Mukteshwar Temple - Gem of Odisha',
        'Parasurameswara Temple - Ancient architecture',
        'Rajarani Temple - Love temple',
        'Brahmeswara Temple - Sacred site'
      ],
      itinerary: [
        { time: '6:00 AM', activity: 'Morning prayers at Lingaraj Temple', duration: '1.5 hours' },
        { time: '8:00 AM', activity: 'Explore Mukteshwar Temple complex', duration: '1 hour' },
        { time: '10:00 AM', activity: 'Visit Parasurameswara Temple', duration: '45 minutes' },
        { time: '12:00 PM', activity: 'Lunch break at traditional restaurant', duration: '1 hour' },
        { time: '2:00 PM', activity: 'Rajarani Temple photography session', duration: '1 hour' },
        { time: '4:00 PM', activity: 'Brahmeswara Temple and cultural center', duration: '1.5 hours' },
        { time: '6:00 PM', activity: 'Evening aarti and conclusion', duration: '30 minutes' }
      ],
      inclusions: ['Professional guide', 'Temple entry fees', 'Traditional lunch', 'Photography assistance'],
      transportation: 'AC Vehicle',
      bestTime: 'October to March',
      groupSize: '2-15 people'
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
      image: bhubaneswarPhotos.kalinga_stadium.main,
      gallery: bhubaneswarPhotos.kalinga_stadium.gallery,
      description: 'Experience world-class sports facilities and adventure activities in Bhubaneswar.',
      highlights: [
        'Kalinga Stadium - FIFA standard facility',
        'Sports Authority of India complex',
        'Adventure sports at Khandagiri',
        'Boating at Bindusagar Lake',
        'Cycling through smart city routes'
      ],
      itinerary: [
        { time: '7:00 AM', activity: 'Kalinga Stadium tour and track session', duration: '2 hours' },
        { time: '9:30 AM', activity: 'Sports Authority facilities visit', duration: '1 hour' },
        { time: '11:00 AM', activity: 'Rock climbing at Khandagiri caves', duration: '2 hours' },
        { time: '1:30 PM', activity: 'Lunch and rest', duration: '1 hour' },
        { time: '3:00 PM', activity: 'Boating and water sports', duration: '1.5 hours' },
        { time: '5:00 PM', activity: 'Cycling tour of smart city', duration: '1 hour' }
      ],
      inclusions: ['Sports equipment', 'Safety gear', 'Professional instructor', 'Energy drinks'],
      transportation: 'Bicycle + AC Vehicle',
      bestTime: 'November to February',
      groupSize: '4-12 people'
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
      image: bhubaneswarPhotos.iit_bhubaneswar.main,
      gallery: bhubaneswarPhotos.iit_bhubaneswar.gallery,
      description: 'Discover premier educational institutions and innovation centers shaping India\'s future.',
      highlights: [
        'IIT Bhubaneswar campus tour',
        'Innovation labs and research centers',
        'KIIT University facilities',
        'Startup incubation centers',
        'Technology demonstrations'
      ],
      itinerary: [
        { time: '9:00 AM', activity: 'IIT Bhubaneswar campus tour', duration: '2 hours' },
        { time: '11:30 AM', activity: 'Research labs and innovation center', duration: '1.5 hours' },
        { time: '1:00 PM', activity: 'Lunch at campus cafeteria', duration: '1 hour' },
        { time: '2:30 PM', activity: 'KIIT University visit', duration: '2 hours' },
        { time: '4:30 PM', activity: 'Startup incubator and demo', duration: '1 hour' },
        { time: '6:00 PM', activity: 'Technology showcase and Q&A', duration: '30 minutes' }
      ],
      inclusions: ['Campus access', 'Guest lectures', 'Lab demonstrations', 'Networking session'],
      transportation: 'AC Vehicle',
      bestTime: 'Year round (weekdays)',
      groupSize: '5-20 people'
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
      image: bhubaneswarPhotos.aiims_bhubaneswar.main,
      gallery: bhubaneswarPhotos.aiims_bhubaneswar.gallery,
      description: 'Experience world-class healthcare facilities and traditional wellness practices.',
      highlights: [
        'AIIMS Bhubaneswar facility tour',
        'Traditional Ayurveda center',
        'Yoga and meditation session',
        'Herbal garden exploration',
        'Health screening and consultation'
      ],
      itinerary: [
        { time: '8:00 AM', activity: 'AIIMS facility tour and overview', duration: '1.5 hours' },
        { time: '10:00 AM', activity: 'Ayurveda center and consultation', duration: '1 hour' },
        { time: '11:30 AM', activity: 'Yoga and meditation session', duration: '1 hour' },
        { time: '1:00 PM', activity: 'Healthy lunch and nutrition talk', duration: '1 hour' },
        { time: '2:30 PM', activity: 'Herbal garden and plant medicine', duration: '1 hour' },
        { time: '4:00 PM', activity: 'Wellness screening and advice', duration: '30 minutes' }
      ],
      inclusions: ['Medical consultation', 'Wellness screening', 'Ayurveda products', 'Yoga session'],
      transportation: 'AC Vehicle',
      bestTime: 'Year round',
      groupSize: '2-10 people'
    }
  ];

  // GSAP animations
  useEffect(() => {
    const tl = gsap.timeline();
    
    // Hero animation
    tl.from(heroRef.current, {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: "power3.out"
    });

    // Staggered card animations
    gsap.fromTo(cardsRef.current, {
      opacity: 0,
      y: 100,
      scale: 0.8
    }, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.8,
      stagger: 0.2,
      ease: "back.out(1.7)",
      delay: 0.5
    });
  }, []);

  useEffect(() => {
    const loadTravelPlans = async () => {
      setLoading(true);
      try {
        // Try to fetch from API first
        const response = await travelPlansAPI.getTravelPlans();
        if (response.success && response.data.length > 0) {
          setTravelPlans(response.data);
        } else {
          // Fallback to predefined plans
          setTravelPlans(specialPlans);
        }
      } catch (error) {
        console.error('Error loading travel plans:', error);
        // Use predefined plans as fallback
        setTravelPlans(specialPlans);
        toast.error('Using offline travel plans');
      } finally {
        setLoading(false);
      }
    };

    loadTravelPlans();
  }, []);

  // Filter plans by type
  const filteredPlans = activeTab === 'all' 
    ? travelPlans 
    : travelPlans.filter(plan => plan.type.toLowerCase() === activeTab);

  // Handle plan selection
  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    gsap.to(window, { scrollTo: 0, duration: 0.5 });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading amazing travel plans..." />;
  }

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Hero Section */}
      <motion.section 
        ref={heroRef}
        className="relative py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white overflow-hidden"
        variants={itemVariants}
      >
        <div className="absolute inset-0 bg-black/20" />
        
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 bg-white rounded-full opacity-30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.7, 0.3]
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-6"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            Special Journeys
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            Curated travel experiences showcasing the best of Bhubaneswar's heritage, innovation, and culture
          </motion.p>

          {/* Filter Tabs */}
          <motion.div 
            className="flex flex-wrap justify-center gap-4 mb-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            {['all', 'cultural', 'sports', 'educational', 'wellness'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  activeTab === tab
                    ? 'bg-white text-blue-600 shadow-lg scale-105'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Travel Plans Grid */}
      <motion.section 
        className="py-20"
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredPlans.map((plan, index) => (
              <motion.div
                key={plan.id}
                ref={el => cardsRef.current[index] = el}
                className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer"
                variants={itemVariants}
                whileHover={{ y: -10, scale: 1.02 }}
                onClick={() => handlePlanSelect(plan)}
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <motion.img
                    src={plan.image}
                    alt={plan.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    whileHover={{ scale: 1.1 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  
                  {/* Price Badge */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2">
                    <span className="text-lg font-bold text-gray-800">{plan.price}</span>
                  </div>

                  {/* Type Badge */}
                  <div className="absolute top-4 left-4 bg-blue-500/90 backdrop-blur-sm rounded-full px-3 py-1">
                    <span className="text-sm font-semibold text-white">{plan.type}</span>
                  </div>

                  {/* Duration */}
                  <div className="absolute bottom-4 left-4 flex items-center text-white">
                    <FaClock className="mr-2" />
                    <span className="font-semibold">{plan.duration}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                    {plan.title}
                  </h3>
                  
                  <p className="text-blue-600 font-medium mb-3">{plan.subtitle}</p>
                  
                  <p className="text-gray-600 mb-4 line-clamp-2">{plan.description}</p>

                  {/* Stats */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <FaStar className="text-yellow-400 mr-1" />
                      <span className="font-semibold text-gray-700">{plan.rating}</span>
                      <span className="text-gray-500 ml-1">({plan.reviews})</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <FaRoute className="mr-1" />
                      <span>{plan.distance}</span>
                    </div>
                  </div>

                  {/* Highlights Preview */}
                  <div className="space-y-1 mb-4">
                    {plan.highlights.slice(0, 2).map((highlight, idx) => (
                      <div key={idx} className="flex items-center text-sm text-gray-600">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mr-2" />
                        {highlight}
                      </div>
                    ))}
                    {plan.highlights.length > 2 && (
                      <div className="text-sm text-blue-600 font-medium">
                        +{plan.highlights.length - 2} more highlights
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <motion.button
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      View Details
                    </motion.button>
                    <motion.button
                      className="p-3 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:text-blue-500 transition-colors duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaHeart />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Plan Detail Modal */}
      <AnimatePresence>
        {selectedPlan && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPlan(null)}
          >
            <motion.div
              className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal content would go here - detailed itinerary, booking form, etc. */}
              <div className="p-8">
                <h2 className="text-3xl font-bold mb-4">{selectedPlan.title}</h2>
                <p className="text-gray-600 mb-6">{selectedPlan.description}</p>
                
                {/* Detailed itinerary */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Detailed Itinerary</h3>
                  {selectedPlan.itinerary?.map((item, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="text-blue-600 font-semibold">{item.time}</div>
                      <div className="flex-1">
                        <div className="font-medium">{item.activity}</div>
                        <div className="text-sm text-gray-500">{item.duration}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex justify-end space-x-4">
                  <button
                    onClick={() => setSelectedPlan(null)}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-300"
                  >
                    Close
                  </button>
                  <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300">
                    Book Now
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SpecialJourneysPageEnhanced;
