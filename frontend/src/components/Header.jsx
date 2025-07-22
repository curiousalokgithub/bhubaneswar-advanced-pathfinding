import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaSearch, FaMapMarkerAlt, FaBars, FaTimes } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMenuOpen(false);
    } else {
      toast.error('Please enter a search query');
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
        toast.dismiss(loadingToast);
        toast.success('Location found! Showing nearby stores...');
        navigate(`/search?lat=${latitude}&lng=${longitude}&nearby=true`);
      },
      (error) => {
        toast.dismiss(loadingToast);
        let errorMessage = 'Unable to get your location';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
          default:
            errorMessage = 'An unknown error occurred';
            break;
        }
        
        toast.error(errorMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
          >
            <FaMapMarkerAlt className="text-blue-600" />
            <span>Bhubaneswar Routes</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`font-medium transition-colors ${
                isActiveRoute('/') 
                  ? 'text-blue-600' 
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Home
            </Link>
            <Link
              to="/search"
              className={`font-medium transition-colors ${
                isActiveRoute('/search') 
                  ? 'text-blue-600' 
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Route Planner
            </Link>
            <Link
              to="/enhanced-search"
              className={`font-medium transition-colors ${
                isActiveRoute('/enhanced-search') 
                  ? 'text-blue-600' 
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Advanced Search
            </Link>
            <Link
              to="/special-journeys"
              className={`font-medium transition-colors ${
                isActiveRoute('/special-journeys') 
                  ? 'text-blue-600' 
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Special Journeys
            </Link>
            <Link
              to="/about"
              className={`font-medium transition-colors ${
                isActiveRoute('/about') 
                  ? 'text-blue-600' 
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              About
            </Link>
          </nav>

          {/* Search Form - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center space-x-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search destinations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
              >
                <FaSearch />
              </button>
            </div>
            <button
              type="button"
              onClick={handleGetLocation}
              className="btn-primary flex items-center space-x-2"
              title="Find stores near me"
            >
              <FaMapMarkerAlt />
              <span>Near Me</span>
            </button>
          </form>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className={`font-medium transition-colors ${
                  isActiveRoute('/') 
                    ? 'text-blue-600' 
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                Home
              </Link>
              <Link
                to="/search"
                onClick={() => setIsMenuOpen(false)}
                className={`font-medium transition-colors ${
                  isActiveRoute('/search') 
                    ? 'text-blue-600' 
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                Route Planner
              </Link>
              <Link
                to="/enhanced-search"
                onClick={() => setIsMenuOpen(false)}
                className={`font-medium transition-colors ${
                  isActiveRoute('/enhanced-search') 
                    ? 'text-blue-600' 
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                Advanced Search
              </Link>
              <Link
                to="/special-journeys"
                onClick={() => setIsMenuOpen(false)}
                className={`font-medium transition-colors ${
                  isActiveRoute('/special-journeys') 
                    ? 'text-blue-600' 
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                Special Journeys
              </Link>
              <Link
                to="/about"
                onClick={() => setIsMenuOpen(false)}
                className={`font-medium transition-colors ${
                  isActiveRoute('/about') 
                    ? 'text-blue-600' 
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                About
              </Link>
              
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="pt-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Search destinations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <FaSearch />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleGetLocation}
                  className="mt-2 w-full btn-primary flex items-center justify-center space-x-2"
                >
                  <FaMapMarkerAlt />
                  <span>Find Stores Near Me</span>
                </button>
              </form>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
