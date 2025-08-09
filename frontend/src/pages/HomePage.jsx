import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaMapMarkerAlt, FaStar, FaRoute, FaUsers, FaArrowRight, FaPlay } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { locationsAPI } from '../services/api';
import { MotionWrapper, AnimatedCard, StaggeredContainer, FloatingElement } from '../components/motion/MotionWrapper';
import { useGsapHeroTimeline, useGsapCardHover } from '../components/motion/gsapHooks';

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [featuredLocations, setFeaturedLocations] = useState([]);
  const [stats, setStats] = useState({ totalLocations: 0, totalCategories: 0, totalRoutes: 0 });
  const [loading, setLoading] = useState(true);
  
  // Animation refs
  const heroRef = useRef(null);
  const cardRefs = useRef([]);
  
  // GSAP animations
  useGsapHeroTimeline(heroRef);
  useGsapCardHover(cardRefs);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load categories and locations from the real API
        const [categoriesData, locationsData] = await Promise.all([
          locationsAPI.getCategories(),
          locationsAPI.getAllLocations({ limit: 6 })
        ]);
        
        setCategories(categoriesData.data || []);
        setFeaturedLocations(locationsData.data || []);
        
        // Calculate stats
        setStats({
          totalLocations: 19,
          totalCategories: 6,
          totalRoutes: 156
        });
        
      } catch (error) {
        console.error('Error loading homepage data:', error);
        toast.error('Failed to load data');
        
        // Fallback to demo data
        setCategories([
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
        
        setFeaturedLocations([
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
            id: 'th_001',
            name: 'Biju Patnaik Airport',
            address: 'Airport Square, Bhubaneswar',
            category: 'Transport',
            rating: 4.5,
            image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=300'
          }
        ]);
        
        setStats({
          totalLocations: 19,
          totalCategories: 6,
          totalRoutes: 156
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<FaStar key="half" className="text-yellow-400 opacity-50" />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaStar key={`empty-${i}`} className="text-gray-300" />);
    }

    return stars;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading amazing places...</p>
        </div>
      </div>
    );
  }

  return (
    <MotionWrapper className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section with Animations */}
      <section ref={heroRef} className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white py-24 lg:py-32">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <FloatingElement className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl" />
          <FloatingElement className="absolute top-40 right-20 w-48 h-48 bg-blue-400/20 rounded-full blur-2xl" />
          <FloatingElement className="absolute bottom-20 left-1/3 w-40 h-40 bg-indigo-400/15 rounded-full blur-xl" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, duration: 0.8, ease: "back.out(1.7)" }}
              className="inline-block mb-6"
            >
              <FaMapMarkerAlt className="text-6xl text-blue-200" />
            </motion.div>
            
            <motion.h1 
              className="hero-title text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Navigate Bhubaneswar
            </motion.h1>
            
            <motion.p 
              className="hero-subtitle text-xl md:text-2xl mb-4 text-blue-100 max-w-3xl mx-auto"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              Experience intelligent route planning through the Temple City
            </motion.p>
            
            <motion.p 
              className="hero-description text-lg mb-12 text-blue-200 max-w-2xl mx-auto"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              Discover shortest paths, real-time pricing, and environmental impact across 19+ locations
            </motion.p>
            
            <motion.div 
              className="hero-buttons flex flex-col sm:flex-row gap-4 justify-center mb-16"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
            >
              <Link
                to="/search"
                className="group bg-white text-blue-600 hover:bg-blue-50 font-bold py-4 px-8 rounded-xl transition-all duration-300 inline-flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <FaSearch className="mr-3 group-hover:scale-110 transition-transform" />
                Plan Your Route
                <FaArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <motion.button
                onClick={() => {
                  if (navigator.geolocation) {
                    const loadingToast = toast.loading('Finding your location...');
                    navigator.geolocation.getCurrentPosition(
                      (position) => {
                        toast.dismiss(loadingToast);
                        toast.success('Location found!');
                        window.location.href = `/search?lat=${position.coords.latitude}&lng=${position.coords.longitude}&nearby=true`;
                      },
                      () => {
                        toast.dismiss(loadingToast);
                        toast.error('Unable to get your location');
                      }
                    );
                  }
                }}
                className="group bg-transparent border-2 border-white/50 text-white hover:bg-white hover:text-blue-600 font-bold py-4 px-8 rounded-xl transition-all duration-300 inline-flex items-center justify-center backdrop-blur-sm hover:scale-105"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaMapMarkerAlt className="mr-3 group-hover:bounce" />
                From My Location
              </motion.button>
            </motion.div>
            
            {/* Stats Section */}
            <motion.div 
              className="hero-stats grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.6 }}
            >
              <div className="stat-item text-center">
                <motion.div 
                  className="text-4xl font-bold text-white mb-2"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.4, duration: 0.6, ease: "back.out(1.7)" }}
                >
                  {stats.totalLocations}+
                </motion.div>
                <div className="text-blue-200">Locations</div>
              </div>
              <div className="stat-item text-center">
                <motion.div 
                  className="text-4xl font-bold text-white mb-2"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.6, duration: 0.6, ease: "back.out(1.7)" }}
                >
                  {stats.totalCategories}
                </motion.div>
                <div className="text-blue-200">Categories</div>
              </div>
              <div className="stat-item text-center">
                <motion.div 
                  className="text-4xl font-bold text-white mb-2"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.8, duration: 0.6, ease: "back.out(1.7)" }}
                >
                  {stats.totalRoutes}+
                </motion.div>
                <div className="text-blue-200">Possible Routes</div>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="floating-elements absolute inset-0 pointer-events-none">
          <motion.div 
            className="element absolute top-1/4 left-8 w-4 h-4 bg-white/20 rounded-full"
            animate={{ y: [0, -20, 0], rotate: [0, 180, 360] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="element absolute top-1/3 right-12 w-6 h-6 bg-blue-300/30 rounded-full"
            animate={{ y: [0, 30, 0], x: [0, -10, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="element absolute bottom-1/4 left-1/4 w-3 h-3 bg-indigo-200/40 rounded-full"
            animate={{ y: [0, -15, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <StaggeredContainer>
            <motion.div className="text-center mb-16">
              <motion.h2 
                className="text-4xl font-bold text-gray-900 mb-4"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                Explore Categories
              </motion.h2>
              <motion.p 
                className="text-xl text-gray-600 max-w-2xl mx-auto"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                Discover amazing places across different categories in Bhubaneswar
              </motion.p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {categories.map((category, index) => (
                <AnimatedCard
                  key={category.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 text-center border border-gray-100"
                  ref={el => cardRefs.current[index] = el}
                  onClick={() => window.location.href = `/search?category=${category.id}`}
                >
                  <div className="text-4xl mb-4">{category.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{category.name}</h3>
                  <p className="text-gray-600 mb-4">{category.description}</p>
                  <div className="text-sm text-blue-600 font-semibold">
                    {category.count} locations
                  </div>
                  <div className="card-shadow absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-2xl opacity-0 -z-10"></div>
                </AnimatedCard>
              ))}
            </div>
          </StaggeredContainer>
        </div>
      </section>

      {/* Featured Locations */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-16">
            <motion.h2 
              className="text-4xl font-bold text-gray-900 mb-4"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              Featured Locations
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-600 max-w-2xl mx-auto"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Popular destinations that define the essence of Bhubaneswar
            </motion.p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredLocations.map((location, index) => (
              <AnimatedCard
                key={location.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
              >
                <div className="h-48 bg-gradient-to-r from-blue-400 to-indigo-500 relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="text-lg font-bold">{location.name}</div>
                    <div className="text-sm opacity-90">{location.category}</div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-3">
                    <div className="flex text-yellow-400 mr-2">
                      {renderStars(location.rating)}
                    </div>
                    <span className="text-gray-600 text-sm">({location.rating})</span>
                  </div>
                  <p className="text-gray-600 mb-4">{location.address}</p>
                  <Link
                    to={`/search?destination=${location.id}`}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center justify-center"
                  >
                    <FaRoute className="mr-2" />
                    Find Route
                  </Link>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.h2 
            className="text-4xl font-bold mb-6"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            Ready to Explore?
          </motion.h2>
          <motion.p 
            className="text-xl mb-8 text-blue-100"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Start your journey through Bhubaneswar with our intelligent route planner
          </motion.p>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <Link
              to="/search"
              className="bg-white text-blue-600 hover:bg-blue-50 font-bold py-4 px-8 rounded-xl transition-all duration-300 inline-flex items-center shadow-lg hover:shadow-xl"
            >
              <FaSearch className="mr-3" />
              Plan Your Route Now
              <FaArrowRight className="ml-3" />
            </Link>
          </motion.div>
        </div>
      </section>
    </MotionWrapper>
  );
};

export default HomePage;
