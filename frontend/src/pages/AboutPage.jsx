import React from 'react';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            About Bhubaneswar Route Finder
          </h1>
          <p className="text-xl text-gray-600">
            Your smart navigation companion for exploring the Temple City
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-6">
            We're dedicated to helping people navigate Bhubaneswar efficiently by providing 
            the shortest and most convenient routes between any two locations in Odisha's 
            capital city.
          </p>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What We Offer</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">�️ Smart Routing</h3>
              <p className="text-gray-600">Find the optimal path between any two locations with advanced algorithms.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">� Multiple Transport Modes</h3>
              <p className="text-gray-600">Get routes optimized for walking, driving, or public transportation.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">⚡ Real-time Calculations</h3>
              <p className="text-gray-600">Instant route calculation with distance, time, and cost estimates.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">� Popular Destinations</h3>
              <p className="text-gray-600">Quick access to commonly visited places in the city.</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">About Bhubaneswar</h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            Known as the Temple City of India, Bhubaneswar is the capital city of Odisha 
            and one of India's fastest-growing cities. With its rich cultural heritage, 
            modern infrastructure, and well-planned urban layout, navigating the city 
            efficiently helps you make the most of your time exploring its many attractions.
          </p>
        </div>

        <div className="bg-blue-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Have a Question or Suggestion?
          </h2>
          <p className="text-gray-600 mb-6">
            We'd love to hear from you! Help us improve and grow our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:contact@bhubaneswar-routes.com"
              className="btn-primary inline-flex items-center justify-center"
            >
              📧 Contact Us
            </a>
            <a
              href="https://github.com/yourusername/bhubaneswar-route-finder"
              className="btn-secondary inline-flex items-center justify-center"
              target="_blank"
              rel="noopener noreferrer"
            >
              🚀 View on GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
