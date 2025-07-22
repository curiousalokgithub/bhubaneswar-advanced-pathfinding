import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaMapMarkerAlt, FaStar, FaStore, FaRoute } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { categoryAPI, storeAPI } from '../services/api';

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [featuredStores, setFeaturedStores] = useState([]);
  const [stats, setStats] = useState({ totalStores: 0, totalCategories: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set dummy data for now since we're converting to pathfinder
    setLoading(true);
    setTimeout(() => {
      // Mock data for demonstration
      setCategories([
        {
          _id: '1',
          name: 'Public Transport',
          slug: 'public-transport',
          description: 'Bus stops, railway stations, and transit points',
          icon: '🚌',
          color: '#3B82F6',
          storeCount: 25
        },
        {
          _id: '2',
          name: 'Landmarks',
          slug: 'landmarks',
          description: 'Famous places and tourist attractions',
          icon: '🏛️',
          color: '#EF4444',
          storeCount: 15
        },
        {
          _id: '3',
          name: 'Educational',
          slug: 'educational',
          description: 'Schools, colleges, and universities',
          icon: '🎓',
          color: '#10B981',
          storeCount: 30
        },
        {
          _id: '4',
          name: 'Healthcare',
          slug: 'healthcare',
          description: 'Hospitals and medical centers',
          icon: '🏥',
          color: '#F59E0B',
          storeCount: 20
        }
      ]);
      
      setFeaturedStores([
        {
          _id: '1',
          name: 'Bhubaneswar Railway Station',
          description: 'Main railway station connecting to all major cities',
          category: { name: 'Transport', color: '#3B82F6' },
          address: { area: 'Master Canteen', city: 'Bhubaneswar' },
          rating: 4.2,
          totalRatings: 150,
          features: ['24x7', 'Parking', 'Food Court']
        },
        {
          _id: '2',
          name: 'Lingaraj Temple',
          description: 'Ancient Hindu temple dedicated to Lord Shiva',
          category: { name: 'Landmarks', color: '#EF4444' },
          address: { area: 'Old Town', city: 'Bhubaneswar' },
          rating: 4.8,
          totalRatings: 500,
          features: ['Heritage Site', 'Guided Tours']
        },
        {
          _id: '3',
          name: 'KIIT University',
          description: 'Deemed university with multiple campuses',
          category: { name: 'Educational', color: '#10B981' },
          address: { area: 'Patia', city: 'Bhubaneswar' },
          rating: 4.5,
          totalRatings: 300,
          features: ['Campus', 'Library', 'Hostels']
        }
      ]);
      
      setStats({ totalStores: 90, totalCategories: 8 });
      setLoading(false);
    }, 500);
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Navigate Bhubaneswar
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Find the shortest path between any two locations in the Temple City
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/search"
                className="bg-white text-blue-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg transition-colors inline-flex items-center justify-center"
              >
                <FaSearch className="mr-2" />
                Find Route
              </Link>
              <button
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
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 font-bold py-3 px-8 rounded-lg transition-colors inline-flex items-center justify-center"
              >
                <FaMapMarkerAlt className="mr-2" />
                From My Location
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {stats.totalStores}+
              </div>
              <div className="text-gray-600">Locations</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {stats.totalCategories}+
              </div>
              <div className="text-gray-600">Categories</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">⚡</div>
              <div className="text-gray-600">Smart Routing</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">🗺️</div>
              <div className="text-gray-600">Live Maps</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Browse by Location Type
            </h2>
            <p className="text-gray-600 text-lg">
              Find routes to different types of places in Bhubaneswar
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category._id}
                to={`/category/${category.slug}`}
                className="card hover:shadow-md transition-shadow text-center group"
              >
                <div 
                  className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-2xl group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: `${category.color}20` }}
                >
                  <span>{category.icon}</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{category.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{category.description}</p>
                <div className="text-sm text-blue-600 font-medium">
                  {category.storeCount || 0} locations
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              to="/search"
              className="btn-primary inline-flex items-center"
            >
              <FaStore className="mr-2" />
              View All Categories
            </Link>
          </div>
        </div>
      </section>

      {/* Special Journeys Section */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Discover Special Journeys
            </h2>
            <p className="text-gray-600 text-lg">
              Experience Bhubaneswar through curated routes designed for specific interests
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Temple Heritage Trail */}
            <div className="card hover:shadow-lg transition-all group">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  🕉️
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Temple Heritage Trail</h3>
                <p className="text-gray-600 mb-4">Explore ancient temples in chronological order with optimized routes</p>
                <div className="flex justify-center items-center text-sm text-orange-600 font-medium mb-4">
                  <FaMapMarkerAlt className="mr-1" />
                  8 Sacred Temples
                </div>
              </div>
            </div>

            {/* Student Life Circuit */}
            <div className="card hover:shadow-lg transition-all group">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  🎓
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Student Life Circuit</h3>
                <p className="text-gray-600 mb-4">Budget-friendly routes connecting colleges, libraries, and hangout spots</p>
                <div className="flex justify-center items-center text-sm text-green-600 font-medium mb-4">
                  <FaMapMarkerAlt className="mr-1" />
                  Budget Routes
                </div>
              </div>
            </div>

            {/* Culinary Adventure */}
            <div className="card hover:shadow-lg transition-all group">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  🍛
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Culinary Adventure</h3>
                <p className="text-gray-600 mb-4">Food routes timed perfectly for breakfast, lunch, and dinner</p>
                <div className="flex justify-center items-center text-sm text-red-600 font-medium mb-4">
                  <FaMapMarkerAlt className="mr-1" />
                  Timed Routes
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link
              to="/special-journeys"
              className="btn-primary inline-flex items-center"
            >
              <FaRoute className="mr-2" />
              Explore All Special Journeys
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Stores Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Popular Destinations
            </h2>
            <p className="text-gray-600 text-lg">
              Most visited places in Bhubaneswar
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredStores.map((store) => (
              <Link
                key={store._id}
                to={`/store/${store._id}`}
                className="card store-card"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-lg text-gray-900 leading-tight">
                    {store.name}
                  </h3>
                  <div 
                    className="category-badge text-white text-xs px-2 py-1"
                    style={{ backgroundColor: store.category?.color || '#3B82F6' }}
                  >
                    {store.category?.name}
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {store.description}
                </p>

                <div className="flex items-center mb-3">
                  <div className="flex items-center mr-2">
                    {renderStars(store.rating)}
                  </div>
                  <span className="text-sm text-gray-600">
                    {store.rating?.toFixed(1)} ({store.totalRatings} reviews)
                  </span>
                </div>

                <div className="flex items-center text-sm text-gray-600 mb-3">
                  <FaMapMarkerAlt className="mr-2 text-gray-400" />
                  <span className="truncate">{store.address?.area}, {store.address?.city}</span>
                </div>

                {store.features && store.features.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {store.features.slice(0, 3).map((feature, index) => (
                      <span 
                        key={index}
                        className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                      >
                        {feature}
                      </span>
                    ))}
                    {store.features.length > 3 && (
                      <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                        +{store.features.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              to="/search"
              className="btn-primary inline-flex items-center"
            >
              <FaStore className="mr-2" />
              View All Stores
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Navigate Bhubaneswar?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Get the shortest route to any destination in the city
          </p>
          <Link
            to="/search"
            className="bg-white text-blue-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg transition-colors inline-flex items-center"
          >
            <FaSearch className="mr-2" />
            Find Your Route
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
