import React from 'react';

const StorePage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Store Details
          </h1>
          <p className="text-gray-600">
            Complete store information
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="text-center text-gray-500">
            <div className="mb-4">
              <div className="inline-block w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                🏬
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Store details coming soon!</h3>
            <p>We're creating detailed store profile pages with all the information you need.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StorePage;
