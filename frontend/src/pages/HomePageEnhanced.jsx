import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaMapMarkerAlt, FaStar, FaRoute, FaUsers, FaArrowRight, FaPlay, FaRocket, FaHeart, FaGlobe, FaCompass, FaClock } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import { locationsAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

// Register GSAP plugins
gsap.registerPlugin(TextPlugin);

const HomePage = () => {
  const navigate = useNavigate();
  
  const [categories, setCategories] = useState([]);
  const [featuredLocations, setFeaturedLocations] = useState([]);
  const [stats, setStats] = useState({ totalLocations: 0, totalCategories: 0, totalRoutes: 0 });
  const [loading, setLoading] = useState(true);
  const [currentText, setCurrentText] = useState(0);
  
  // Animation refs
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const bgRef = useRef(null);
  const particlesRef = useRef([]);
  
  // Text animation array
  const heroTexts = [
    "Navigate Bhubaneswar",
    "Explore Heritage City", 
    "Discover Smart Routes",
    "Find Your Way Home"
  ];

  // GSAP Animations
  useEffect(() => {
    const tl = gsap.timeline();
    
    // Background gradient animation
    tl.to(bgRef.current, {
      backgroundPosition: "100% 50%",
      duration: 20,
      repeat: -1,
      yoyo: true,
      ease: "none"
    });

    // Floating particles animation
    particlesRef.current.forEach((particle, index) => {
      if (particle) {
        gsap.to(particle, {
          y: "random(-20, 20)",
          x: "random(-10, 10)",
          rotation: "random(-180, 180)",
          duration: "random(3, 6)",
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: index * 0.2
        });
      }
    });

    // Hero text animation with typewriter effect
    const textAnimation = gsap.timeline({ repeat: -1 });
    heroTexts.forEach((text, index) => {
      textAnimation
        .to(titleRef.current, {
          text: text,
          duration: 2,
          ease: "none",
          delay: 0.5
        })
        .to({}, { duration: 2 }); // Wait before next text
    });

    return () => {
      tl.kill();
      textAnimation.kill();
    };
  }, []);

  // Card hover animations
  const handleCardHover = (e, isHovering) => {
    const card = e.currentTarget;
    gsap.to(card, {
      scale: isHovering ? 1.05 : 1,
      rotationY: isHovering ? 5 : 0,
      z: isHovering ? 50 : 0,
      duration: 0.4,
      ease: "power2.out"
    });
    
    gsap.to(card.querySelector('.card-glow'), {
      opacity: isHovering ? 1 : 0,
      duration: 0.3
    });
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Set a timeout to prevent infinite loading
        const timeout = setTimeout(() => {
          setLoading(false);
          console.log('Loading timeout - using fallback data');
        }, 3000);
        
        // Load categories and locations from the real API
        const [categoriesData, locationsData] = await Promise.all([
          locationsAPI.getCategories().catch(() => ({ data: [] })),
          locationsAPI.getAllLocations({ limit: 6 }).catch(() => ({ data: [] }))
        ]);
        
        clearTimeout(timeout);
        
        setCategories(categoriesData.data && categoriesData.data.length > 0 ? categoriesData.data : [
          {
            id: 'landmarks',
            name: 'Landmarks & Heritage',
            description: 'Temples, historical sites, and cultural attractions',
            icon: '🏛️',
            color: '#3B82F6',
            count: 8
          },
          {
            id: 'educational',
            name: 'Educational',
            description: 'Universities, colleges, and schools',
            icon: '🎓',
            color: '#10B981',
            count: 4
          },
          {
            id: 'healthcare',
            name: 'Healthcare',
            description: 'Hospitals, clinics, and medical centers',
            icon: '🏥',
            color: '#EF4444',
            count: 2
          },
          {
            id: 'transport',
            name: 'Transport Hubs',
            description: 'Railway, airport, and bus terminals',
            icon: '🚌',
            color: '#F59E0B',
            count: 3
          }
        ]);
        
        setFeaturedLocations(locationsData.data && locationsData.data.length > 0 ? locationsData.data : [
          {
            id: 'lm_001',
            name: 'Lingaraj Temple',
            address: 'Old Town, Bhubaneswar',
            category: 'Landmarks',
            rating: 4.8,
            image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=300'
          },
          {
            id: 'ed_001', 
            name: 'IIT Bhubaneswar',
            address: 'Khordha, Bhubaneswar',
            category: 'Educational',
            rating: 4.9,
            image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=300'
          },
          {
            id: 'hc_001',
            name: 'AIIMS Bhubaneswar',
            address: 'Sijua, Bhubaneswar',
            category: 'Healthcare',
            rating: 4.7,
            image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=300'
          }
        ]);
        
        // Calculate stats
        setStats({
          totalLocations: 19,
          totalCategories: 6,
          totalRoutes: 156
        });
        
      } catch (error) {
        console.error('Error loading homepage data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

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
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.6, -0.05, 0.01, 0.99]
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      rotateX: -15
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  // Show loading spinner while data is loading
  if (loading) {
    return <LoadingSpinner text="Loading Bhubaneswar's amazing places..." />;
  }

  return (
    <motion.div 
      className="min-h-screen overflow-hidden"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Animated Background */}
      <div 
        ref={bgRef}
        className="fixed inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 opacity-10"
        style={{
          backgroundSize: "400% 400%",
          backgroundPosition: "0% 50%"
        }}
      />
      
      {/* Floating Particles */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          ref={el => particlesRef.current[i] = el}
          className="fixed w-2 h-2 bg-blue-500 rounded-full opacity-20"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}

      {/* Hero Section */}
      <motion.section 
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden"
        variants={itemVariants}
      >
        {/* Animated Grid Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="grid grid-cols-12 grid-rows-8 gap-4 h-full w-full p-8">
            {Array.from({ length: 96 }).map((_, i) => (
              <motion.div
                key={i}
                className="bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-lg"
                initial={{ opacity: 0, scale: 0, rotateY: 0 }}
                animate={{ 
                  opacity: [0, 0.8, 0], 
                  scale: [0, 1, 0.8, 1, 0],
                  rotateY: [0, 180, 360],
                  backgroundColor: [
                    'rgba(99, 102, 241, 0.1)',
                    'rgba(139, 92, 246, 0.3)', 
                    'rgba(236, 72, 153, 0.2)',
                    'rgba(59, 130, 246, 0.25)',
                    'rgba(168, 85, 247, 0.15)'
                  ]
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  delay: i * 0.05,
                  repeatType: "reverse",
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        </div>

        {/* Animated Background Shapes */}
        <motion.div 
          className="absolute inset-0 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
        >
          <motion.div 
            className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full opacity-20 blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <motion.div 
            className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full opacity-20 blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0]
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </motion.div>

        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <h1 
              ref={titleRef}
              className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6 leading-tight"
            >
              Navigate Bhubaneswar
            </h1>
          </motion.div>
          
          <motion.p 
            ref={subtitleRef}
            className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
          >
            Discover the smart city's hidden gems with our advanced pathfinding system. 
            From ancient temples to modern landmarks, find your perfect route.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.5 }}
          >
            <Link 
              to="/search" 
              className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <FaSearch className="inline mr-3" />
              Start Exploring
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                whileHover={{ scale: 1.05 }}
              />
            </Link>
            
            <Link 
              to="/advanced-routing" 
              className="group px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-full font-semibold text-lg hover:bg-blue-600 hover:text-white transition-all duration-300 flex items-center"
            >
              <FaRoute className="mr-3" />
              Google Maps Route
              <motion.div
                className="ml-2"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <FaArrowRight />
              </motion.div>
            </Link>
          </motion.div>

          {/* Stats Section */}
          <motion.div 
            className="mt-20 grid grid-cols-3 gap-8 max-w-2xl mx-auto"
            variants={containerVariants}
          >
            {[
              { icon: FaMapMarkerAlt, label: "Locations", value: stats.totalLocations, color: "text-blue-600" },
              { icon: FaUsers, label: "Categories", value: stats.totalCategories, color: "text-purple-600" },
              { icon: FaRoute, label: "Routes", value: stats.totalRoutes, color: "text-pink-600" }
            ].map((stat, index) => (
              <motion.div 
                key={index}
                className="text-center group"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
              >
                <motion.div 
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 ${stat.color} mb-4 shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
                  whileHover={{ rotateY: 180 }}
                  transition={{ duration: 0.6 }}
                >
                  <stat.icon className="text-2xl" />
                </motion.div>
                <motion.div 
                  className="text-3xl font-bold text-gray-800"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 2 + index * 0.2 }}
                >
                  {stat.value}+
                </motion.div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Categories Section */}
      <motion.section 
        className="py-20 bg-white relative overflow-hidden"
        variants={itemVariants}
      >
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            variants={itemVariants}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Explore By 
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}Category
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover Bhubaneswar's diverse attractions organized by type
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
          >
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                className="group relative"
                variants={cardVariants}
                whileHover={{ y: -10 }}
                onMouseEnter={(e) => handleCardHover(e, true)}
                onMouseLeave={(e) => handleCardHover(e, false)}
              >
                <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden">
                  {/* Card Glow Effect */}
                  <div className="card-glow absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 rounded-2xl"></div>
                  
                  <div className="relative z-10">
                    <motion.div 
                      className="text-4xl mb-4"
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      transition={{ duration: 0.3 }}
                    >
                      {category.icon}
                    </motion.div>
                    <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                      {category.name}
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {category.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-500">
                        {category.count} locations
                      </span>
                      <motion.div
                        className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center"
                        whileHover={{ scale: 1.1 }}
                      >
                        <FaArrowRight className="text-white text-xs" />
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Featured Locations */}
      <motion.section 
        className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden"
        variants={itemVariants}
      >
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            variants={itemVariants}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Featured 
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {" "}Destinations
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Must-visit places that define the essence of Bhubaneswar
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
          >
            {featuredLocations.map((location, index) => (
              <motion.div
                key={location.id}
                className="group relative"
                variants={cardVariants}
                whileHover={{ y: -15 }}
                onMouseEnter={(e) => handleCardHover(e, true)}
                onMouseLeave={(e) => handleCardHover(e, false)}
              >
                <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
                  {/* Card Glow Effect */}
                  <div className="card-glow absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0"></div>
                  
                  <div className="relative z-10">
                    <div className="relative h-48 overflow-hidden">
                      <motion.img
                        src={location.image}
                        alt={location.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        whileHover={{ scale: 1.1 }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors duration-300">
                        {location.name}
                      </h3>
                      <div className="flex items-center text-gray-500 mb-3">
                        <FaMapMarkerAlt className="mr-2 text-red-500" />
                        {location.address}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <FaStar className="text-yellow-400 mr-1" />
                          <span className="font-semibold text-gray-700">{location.rating}</span>
                        </div>
                        <span className="text-sm bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-3 py-1 rounded-full">
                          {location.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div 
            className="text-center mt-12"
            variants={itemVariants}
          >
            <Link 
              to="/search" 
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <FaGlobe className="mr-3" />
              Explore All Locations
              <motion.div
                className="ml-3"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <FaArrowRight />
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Special Journeys Section */}
      <motion.section 
        className="py-20 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50"
        variants={itemVariants}
      >
        <div className="max-w-7xl mx-auto px-4">
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
              ✨ Special Journeys
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover curated travel experiences showcasing the best of Bhubaneswar's heritage, innovation, and culture
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Heritage Temple Trail",
                subtitle: "Ancient Wisdom Journey",
                price: "₹899",
                duration: "8 hours",
                icon: "🏛️",
                gradient: "from-orange-500 to-red-500"
              },
              {
                title: "Sports & Adventure Circuit",
                subtitle: "Athletic Excellence Tour",
                price: "₹1299",
                duration: "6 hours",
                icon: "⚽",
                gradient: "from-green-500 to-blue-500"
              },
              {
                title: "Education & Innovation Hub",
                subtitle: "Knowledge Discovery Tour",
                price: "₹1099",
                duration: "7 hours",
                icon: "🎓",
                gradient: "from-blue-500 to-purple-500"
              },
              {
                title: "Healthcare & Wellness Journey",
                subtitle: "Holistic Health Experience",
                price: "₹1599",
                duration: "5 hours",
                icon: "🏥",
                gradient: "from-pink-500 to-purple-500"
              }
            ].map((journey, index) => (
              <motion.div
                key={index}
                className="group relative bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden"
                variants={itemVariants}
                whileHover={{ y: -10, scale: 1.02 }}
                onClick={() => navigate('/special-journeys')}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${journey.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                
                <div className="relative z-10">
                  <div className="text-4xl mb-4">{journey.icon}</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors duration-300">
                    {journey.title}
                  </h3>
                  <p className="text-purple-600 font-medium mb-4">{journey.subtitle}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>⏱️ {journey.duration}</span>
                    <span className="font-bold text-lg text-gray-800">{journey.price}</span>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-center py-2 rounded-xl font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    Explore Journey
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div className="text-center mt-12" variants={itemVariants}>
            <Link 
              to="/special-journeys"
              className="inline-flex items-center space-x-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <span>View All Special Journeys</span>
              <FaArrowRight className="text-sm" />
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden"
        variants={itemVariants}
      >
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-white mb-6"
            variants={itemVariants}
          >
            Ready to Start Your Journey?
          </motion.h2>
          <motion.p 
            className="text-xl text-white/90 mb-10 max-w-2xl mx-auto"
            variants={itemVariants}
          >
            Join thousands of explorers discovering the smart city with our intelligent navigation system
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-6 justify-center"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <Link 
                to="/search" 
                className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <FaRocket className="mr-3" />
                Get Started Now
              </Link>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Link 
                to="/about" 
                className="inline-flex items-center px-8 py-4 border-2 border-white text-white rounded-full font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300"
              >
                <FaHeart className="mr-3" />
                Learn More
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </motion.div>
  );
};

export default HomePage;
