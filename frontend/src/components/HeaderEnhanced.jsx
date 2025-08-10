import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaSearch, FaMapMarkerAlt, FaBars, FaTimes, FaRocket, FaGlobe } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Animation refs
  const headerRef = useRef(null);
  const logoRef = useRef(null);
  const searchRef = useRef(null);
  
  useEffect(() => {
    // Header entrance animation
    const tl = gsap.timeline();
    tl.from(headerRef.current, {
      y: -100,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out"
    })
    .from(logoRef.current, {
      scale: 0,
      rotation: -180,
      duration: 0.6,
      ease: "back.out(1.7)"
    }, "-=0.4")
    .from(searchRef.current, {
      width: 0,
      opacity: 0,
      duration: 0.5,
      ease: "power2.out"
    }, "-=0.3");

    // Scroll listener for header background
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMenuOpen(false);
      
      // Search animation
      gsap.to(searchRef.current, {
        scale: 1.05,
        duration: 0.1,
        yoyo: true,
        repeat: 1
      });
    } else {
      toast.error('Please enter a search query');
      
      // Error animation
      gsap.to(searchRef.current, {
        x: [-10, 10, -10, 10, 0],
        duration: 0.4
      });
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by this browser');
      return;
    }

    const loadingToast = toast.loading('Getting your location...');
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        toast.success('Location found!', { id: loadingToast });
        navigate(`/search?lat=${latitude}&lng=${longitude}`);
      },
      (error) => {
        console.error('Geolocation error:', error);
        let errorMessage = 'Unable to get your location';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
        }
        
        toast.error(errorMessage, { id: loadingToast });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  };

  const navigationItems = [
    { name: 'Home', path: '/', icon: '🏠' },
    { name: 'Search', path: '/search', icon: '🔍' },
    { name: 'Special Journeys', path: '/special-journeys', icon: '✨', featured: true },
    { name: 'Google Maps', path: '/advanced-routing', icon: '🗺️' },
    { name: 'Enhanced Search', path: '/enhanced-search', icon: '⚡' },
    { name: 'Real-time Search', path: '/real-time-search', icon: '🌐' },
    { name: 'About', path: '/about', icon: 'ℹ️' }
  ];

  const isActivePath = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  // Animation variants
  const headerVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.6, -0.05, 0.01, 0.99]
      }
    }
  };

  const menuVariants = {
    hidden: { 
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        when: "afterChildren"
      }
    },
    visible: { 
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const menuItemVariants = {
    hidden: { 
      opacity: 0, 
      x: -20,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      x: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.header 
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-200/50' 
          : 'bg-white/80 backdrop-blur-sm'
      }`}
      variants={headerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <motion.div 
            ref={logoRef}
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/" className="flex items-center space-x-3 group">
              <motion.div 
                className="relative w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg"
                whileHover={{ 
                  rotate: 360,
                  boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)"
                }}
                transition={{ duration: 0.6 }}
              >
                <FaRocket className="text-white text-xl" />
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  whileHover={{ scale: 1.1 }}
                />
              </motion.div>
              <div className="hidden sm:block">
                <motion.h1 
                  className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
                  whileHover={{ scale: 1.05 }}
                >
                  Bhubaneswar
                </motion.h1>
                <motion.p 
                  className="text-sm text-gray-500 -mt-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  Smart Navigation
                </motion.p>
              </div>
            </Link>
          </motion.div>

          {/* Search Bar - Desktop */}
          <motion.form 
            ref={searchRef}
            onSubmit={handleSearch}
            className="hidden md:flex items-center flex-1 max-w-2xl mx-8"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <div className="relative w-full group">
              <motion.input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search locations, landmarks, or addresses..."
                className="w-full pl-12 pr-16 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-300 text-gray-700 placeholder-gray-400"
                whileFocus={{ 
                  scale: 1.02,
                  boxShadow: "0 10px 30px rgba(59, 130, 246, 0.2)"
                }}
              />
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-300" />
              <motion.button
                type="button"
                onClick={handleGetLocation}
                className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaMapMarkerAlt />
              </motion.button>
              <motion.button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-500 to-purple-500 text-white p-2 rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 8px 20px rgba(59, 130, 246, 0.4)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                <FaSearch />
              </motion.button>
            </div>
          </motion.form>

          {/* Desktop Navigation */}
          <motion.nav 
            className="hidden lg:flex items-center space-x-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            {navigationItems.slice(0, 5).map((item, index) => (
              <motion.div key={item.path}>
                <Link
                  to={item.path}
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 group ${
                    isActivePath(item.path)
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                      : item.featured
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md hover:shadow-lg'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-sm">{item.icon}</span>
                  <span className="text-sm font-semibold">{item.name}</span>
                  {item.featured && !isActivePath(item.path) && (
                    <motion.div
                      className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2 }}
                    />
                  )}
                  {isActivePath(item.path) && (
                    <motion.div
                      className="w-2 h-2 bg-white rounded-full"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1 }}
                    />
                  )}
                </Link>
              </motion.div>
            ))}
          </motion.nav>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors duration-300"
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={{ rotate: isMenuOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isMenuOpen ? <FaTimes /> : <FaBars />}
            </motion.div>
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="lg:hidden border-t border-gray-200 bg-white/95 backdrop-blur-lg"
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <div className="px-4 py-6 space-y-4">
                {/* Mobile Search */}
                <motion.form 
                  onSubmit={handleSearch}
                  className="flex items-center space-x-3"
                  variants={menuItemVariants}
                >
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search locations..."
                      className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors duration-300"
                    />
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <button
                      type="button"
                      onClick={handleGetLocation}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors duration-300"
                    >
                      <FaMapMarkerAlt />
                    </button>
                  </div>
                  <motion.button
                    type="submit"
                    className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-3 rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaSearch />
                  </motion.button>
                </motion.form>

                {/* Mobile Navigation */}
                <div className="space-y-2">
                  {navigationItems.map((item, index) => (
                    <motion.div 
                      key={item.path}
                      variants={menuItemVariants}
                    >
                      <Link
                        to={item.path}
                        onClick={() => setIsMenuOpen(false)}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                          isActivePath(item.path)
                            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <span className="text-lg">{item.icon}</span>
                        <span className="font-medium">{item.name}</span>
                        {isActivePath(item.path) && (
                          <motion.div
                            className="ml-auto w-2 h-2 bg-white rounded-full"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                          />
                        )}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Header;
