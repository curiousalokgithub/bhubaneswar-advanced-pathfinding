// Location categories with comprehensive data for Bhubaneswar
export const locationCategories = {
  landmarks: {
    name: 'Landmarks',
    icon: '🏛️',
    color: '#f97316',
    locations: [
      { name: 'Lingaraj Temple', coords: [20.2372, 85.8344], type: 'Religious' },
      { name: 'Rajarani Temple', coords: [20.2514, 85.8361], type: 'Religious' },
      { name: 'Mukteshvara Temple', coords: [20.2433, 85.8356], type: 'Religious' },
      { name: 'Parasurameswara Temple', coords: [20.2428, 85.8358], type: 'Religious' },
      { name: 'Khandagiri Caves', coords: [20.2614, 85.7842], type: 'Historical' },
      { name: 'Dhauli Peace Pagoda', coords: [20.1928, 85.8628], type: 'Historical' },
      { name: 'Udayagiri Caves', coords: [20.2606, 85.7839], type: 'Historical' },
      { name: 'Kalinga Stadium', coords: [20.3096, 85.8022], type: 'Sports' },
      { name: 'Tribal Museum', coords: [20.2725, 85.8314], type: 'Cultural' },
      { name: 'Ekamra Haat', coords: [20.2597, 85.8278], type: 'Cultural' }
    ]
  },
  educational: {
    name: 'Educational',
    icon: '🎓',
    color: '#10b981',
    locations: [
      { name: 'KIIT University', coords: [20.3558, 85.8166], type: 'University' },
      { name: 'Utkal University', coords: [20.2847, 85.8292], type: 'University' },
      { name: 'NIT Rourkela Bhubaneswar Campus', coords: [20.2847, 85.8242], type: 'Engineering' },
      { name: 'Xavier Institute of Management', coords: [20.3012, 85.8022], type: 'Management' },
      { name: 'Siksha O Anusandhan University', coords: [20.3496, 85.8048], type: 'University' },
      { name: 'Regional Science Centre', coords: [20.2514, 85.8361], type: 'Science' },
      { name: 'Odisha State Museum', coords: [20.2648, 85.8347], type: 'Museum' },
      { name: 'Pathani Samanta Planetarium', coords: [20.2725, 85.8314], type: 'Science' },
      { name: 'Central Library', coords: [20.2682, 85.8328], type: 'Library' },
      { name: 'KIIT International School', coords: [20.3489, 85.8145], type: 'School' }
    ]
  },
  healthcare: {
    name: 'Healthcare',
    icon: '🏥',
    color: '#ef4444',
    locations: [
      { name: 'AIIMS Bhubaneswar', coords: [20.1847, 85.8064], type: 'Hospital' },
      { name: 'Apollo Hospitals', coords: [20.2847, 85.8192], type: 'Hospital' },
      { name: 'Kalinga Hospital', coords: [20.2715, 85.8361], type: 'Hospital' },
      { name: 'Sum Hospital', coords: [20.3496, 85.8048], type: 'Hospital' },
      { name: 'Capital Hospital', coords: [20.2648, 85.8347], type: 'Government Hospital' },
      { name: 'CARE Hospitals', coords: [20.2961, 85.8245], type: 'Hospital' },
      { name: 'Hi-Tech Medical College', coords: [20.3012, 85.8022], type: 'Medical College' },
      { name: 'Medanta Hospital', coords: [20.2715, 85.8361], type: 'Hospital' },
      { name: 'BMC Bhagabati', coords: [20.2682, 85.8328], type: 'Government Hospital' },
      { name: '24x7 Medical Store - Master Canteen', coords: [20.2715, 85.8361], type: 'Pharmacy' }
    ]
  },
  publicTransport: {
    name: 'Public Transport',
    icon: '🚌',
    color: '#3b82f6',
    locations: [
      { name: 'Bhubaneswar Railway Station', coords: [20.2647, 85.8341], type: 'Railway Station' },
      { name: 'New Bhubaneswar Railway Station', coords: [20.2847, 85.8192], type: 'Railway Station' },
      { name: 'Biju Patnaik International Airport', coords: [20.2514, 85.7789], type: 'Airport' },
      { name: 'Master Canteen Bus Stand', coords: [20.2715, 85.8361], type: 'Bus Terminal' },
      { name: 'Baramunda Bus Terminal', coords: [20.3012, 85.8022], type: 'Bus Terminal' },
      { name: 'Kalpana Square Bus Stop', coords: [20.2847, 85.8292], type: 'Bus Stop' },
      { name: 'Raj Mahal Square Bus Stop', coords: [20.2682, 85.8328], type: 'Bus Stop' },
      { name: 'Sishu Bhawan Square Bus Stop', coords: [20.2725, 85.8314], type: 'Bus Stop' },
      { name: 'Vani Vihar Bus Stop', coords: [20.2847, 85.8292], type: 'Bus Stop' },
      { name: 'Patia Bus Stop', coords: [20.3558, 85.8166], type: 'Bus Stop' },
      { name: 'Metro Station - Master Canteen', coords: [20.2715, 85.8361], type: 'Metro Station' },
      { name: 'Auto Stand - Kalpana Square', coords: [20.2847, 85.8292], type: 'Auto Stand' }
    ]
  },
  shopping: {
    name: 'Shopping & Malls',
    icon: '🛍️',
    color: '#ec4899',
    locations: [
      { name: 'Esplanade One Mall', coords: [20.2961, 85.8245], type: 'Mall' },
      { name: 'DN Regalia Mall', coords: [20.2847, 85.8192], type: 'Mall' },
      { name: 'Forum Mart', coords: [20.2715, 85.8361], type: 'Shopping Center' },
      { name: 'Reliance Digital', coords: [20.2847, 85.8292], type: 'Electronics' },
      { name: 'Big Bazaar', coords: [20.2961, 85.8245], type: 'Department Store' },
      { name: 'Shoppers Stop', coords: [20.2847, 85.8192], type: 'Fashion' },
      { name: 'Unit-1 Market Building', coords: [20.2682, 85.8328], type: 'Traditional Market' },
      { name: 'Unit-4 Market', coords: [20.2725, 85.8314], type: 'Traditional Market' },
      { name: 'Saheed Nagar Market', coords: [20.3012, 85.8022], type: 'Local Market' },
      { name: 'Patia Market', coords: [20.3558, 85.8166], type: 'Local Market' }
    ]
  }
};

export const transportModes = {
  walking: {
    name: 'Walking',
    icon: '🚶',
    speed: 5, // km/h
    color: '#10b981',
    features: ['Pedestrian paths', 'Shortest distance', 'Exercise route']
  },
  cycling: {
    name: 'Cycling',
    icon: '🚴',
    speed: 15, // km/h  
    color: '#f59e0b',
    features: ['Bike lanes', 'Eco-friendly', 'Moderate speed']
  },
  auto: {
    name: 'Auto Rickshaw',
    icon: '🛺',
    speed: 25, // km/h
    color: '#ef4444',
    features: ['Door-to-door', 'Affordable', 'Local transport']
  },
  bus: {
    name: 'Public Bus',
    icon: '🚌',
    speed: 20, // km/h
    color: '#3b82f6',
    features: ['Economical', 'Fixed routes', 'Eco-friendly']
  },
  car: {
    name: 'Private Car',
    icon: '🚗',
    speed: 40, // km/h
    color: '#8b5cf6',
    features: ['Comfortable', 'Fast', 'Door-to-door']
  },
  bike: {
    name: 'Motorcycle',
    icon: '🏍️',
    speed: 35, // km/h
    color: '#f97316',
    features: ['Quick', 'Traffic-friendly', 'Economical']
  }
};
