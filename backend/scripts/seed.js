import mongoose from 'mongoose';
import Category from '../models/Category.js';
import Store from '../models/Store.js';
import dotenv from 'dotenv';

dotenv.config();

const categories = [
  {
    name: 'Restaurants & Food',
    description: 'Restaurants, cafes, food courts, and eateries',
    icon: '🍽️',
    color: '#EF4444',
    tags: ['food', 'restaurant', 'dining', 'cafe']
  },
  {
    name: 'Shopping & Retail',
    description: 'Clothing, electronics, books, and general retail stores',
    icon: '🛍️',
    color: '#8B5CF6',
    tags: ['shopping', 'retail', 'clothing', 'electronics']
  },
  {
    name: 'Healthcare & Pharmacy',
    description: 'Hospitals, clinics, pharmacies, and medical services',
    icon: '⚕️',
    color: '#10B981',
    tags: ['healthcare', 'medical', 'pharmacy', 'hospital']
  },
  {
    name: 'Banking & ATM',
    description: 'Banks, ATMs, and financial services',
    icon: '🏦',
    color: '#3B82F6',
    tags: ['bank', 'atm', 'finance', 'money']
  },
  {
    name: 'Education & Training',
    description: 'Schools, colleges, coaching centers, and educational institutes',
    icon: '🎓',
    color: '#F59E0B',
    tags: ['education', 'school', 'college', 'training']
  },
  {
    name: 'Automotive Services',
    description: 'Car service, petrol pumps, spare parts, and automotive care',
    icon: '🚗',
    color: '#EF4444',
    tags: ['automotive', 'car', 'petrol', 'service']
  },
  {
    name: 'Beauty & Wellness',
    description: 'Salons, spas, gyms, and wellness centers',
    icon: '💄',
    color: '#EC4899',
    tags: ['beauty', 'salon', 'spa', 'wellness', 'gym']
  },
  {
    name: 'Entertainment & Recreation',
    description: 'Cinemas, gaming zones, parks, and entertainment venues',
    icon: '🎬',
    color: '#8B5CF6',
    tags: ['entertainment', 'cinema', 'gaming', 'recreation']
  }
];

const stores = [
  // Restaurants & Food
  {
    name: 'Dalma Restaurant',
    description: 'Authentic Odia cuisine with traditional flavors and modern presentation',
    address: {
      street: 'Plot No 1, Janpath',
      area: 'Bhubaneswar',
      city: 'Bhubaneswar',
      state: 'Odisha',
      pincode: '751001'
    },
    location: {
      type: 'Point',
      coordinates: [85.8245, 20.2961]
    },
    contact: {
      phone: '+91 674-2536789',
      email: 'info@dalmarestaurant.com'
    },
    rating: 4.5,
    totalRatings: 245,
    features: ['AC', 'Parking', 'Family Dining', 'Traditional Cuisine'],
    tags: ['odia food', 'traditional', 'dalma', 'authentic'],
    isVerified: true
  },
  {
    name: 'Trident Hotel Restaurant',
    description: 'Fine dining restaurant offering international and local cuisine',
    address: {
      street: 'Plot No C-1, Chandrasekharpur',
      area: 'Chandrasekharpur',
      city: 'Bhubaneswar',
      state: 'Odisha',
      pincode: '751016'
    },
    location: {
      type: 'Point',
      coordinates: [85.8167, 20.3176]
    },
    contact: {
      phone: '+91 674-2301010',
      email: 'dining@tridentbhubaneswar.com'
    },
    rating: 4.7,
    totalRatings: 189,
    features: ['AC', 'Valet Parking', 'Bar', 'Live Music'],
    tags: ['fine dining', 'hotel restaurant', 'international cuisine'],
    isVerified: true
  },
  
  // Shopping & Retail
  {
    name: 'Esplanade One Mall',
    description: 'Premium shopping mall with international and national brands',
    address: {
      street: 'Plot No 1A/1B, Rasulgarh',
      area: 'Rasulgarh',
      city: 'Bhubaneswar',
      state: 'Odisha',
      pincode: '751010'
    },
    location: {
      type: 'Point',
      coordinates: [85.8049, 20.2870]
    },
    contact: {
      phone: '+91 674-6680000',
      email: 'info@esplanadeone.com'
    },
    rating: 4.3,
    totalRatings: 567,
    features: ['AC', 'Food Court', 'Cinema', 'Parking', 'Kids Zone'],
    tags: ['mall', 'shopping', 'brands', 'entertainment'],
    isVerified: true
  },
  {
    name: 'DN Regalia Mall',
    description: 'Modern shopping destination with diverse retail options',
    address: {
      street: 'Kalinga Studio Rd, Bharat Heavy Electricals Limited',
      area: 'Rasulgarh',
      city: 'Bhubaneswar',
      state: 'Odisha',
      pincode: '751010'
    },
    location: {
      type: 'Point',
      coordinates: [85.7989, 20.2845]
    },
    contact: {
      phone: '+91 674-2396500'
    },
    rating: 4.1,
    totalRatings: 343,
    features: ['AC', 'Food Court', 'Parking', 'Multiple Floors'],
    tags: ['mall', 'shopping', 'retail', 'family'],
    isVerified: true
  },

  // Healthcare & Pharmacy
  {
    name: 'AIIMS Bhubaneswar',
    description: 'All India Institute of Medical Sciences - Premier medical care',
    address: {
      street: 'Sijua, Patrapada',
      area: 'Bhubaneswar',
      city: 'Bhubaneswar',
      state: 'Odisha',
      pincode: '751019'
    },
    location: {
      type: 'Point',
      coordinates: [85.7753, 20.1845]
    },
    contact: {
      phone: '+91 674-2476270',
      email: 'director@aiimsbhubaneswar.edu.in'
    },
    rating: 4.6,
    totalRatings: 892,
    features: ['Emergency', '24x7', 'Specialized Care', 'Research Hospital'],
    tags: ['aiims', 'hospital', 'medical', 'government'],
    isVerified: true
  },
  {
    name: 'Apollo Hospitals',
    description: 'Multi-specialty hospital with advanced medical facilities',
    address: {
      street: 'Plot No 251, Sainik School Rd',
      area: 'Unit 15, Bhubaneswar',
      city: 'Bhubaneswar',
      state: 'Odisha',
      pincode: '751005'
    },
    location: {
      type: 'Point',
      coordinates: [85.8412, 20.2456]
    },
    contact: {
      phone: '+91 674-6677000',
      email: 'bhubaneswar@apollohospitals.com'
    },
    rating: 4.4,
    totalRatings: 456,
    features: ['Emergency', '24x7', 'ICU', 'Surgery', 'Diagnostics'],
    tags: ['apollo', 'hospital', 'private', 'specialty'],
    isVerified: true
  },

  // Banking & ATM
  {
    name: 'SBI Main Branch',
    description: 'State Bank of India main branch with all banking services',
    address: {
      street: 'Raj Mahal Square',
      area: 'Master Canteen',
      city: 'Bhubaneswar',
      state: 'Odisha',
      pincode: '751001'
    },
    location: {
      type: 'Point',
      coordinates: [85.8315, 20.2654]
    },
    contact: {
      phone: '+91 674-2531045'
    },
    rating: 3.8,
    totalRatings: 123,
    features: ['ATM', 'Locker', 'Net Banking', 'RTGS/NEFT'],
    tags: ['sbi', 'bank', 'atm', 'government'],
    isVerified: true
  },

  // Education & Training
  {
    name: 'KIIT University',
    description: 'Kalinga Institute of Industrial Technology - Deemed University',
    address: {
      street: 'Kalinga Nagar',
      area: 'KIIT Road',
      city: 'Bhubaneswar',
      state: 'Odisha',
      pincode: '751024'
    },
    location: {
      type: 'Point',
      coordinates: [85.8178, 20.3556]
    },
    contact: {
      phone: '+91 674-2725466',
      email: 'info@kiit.ac.in'
    },
    rating: 4.5,
    totalRatings: 1234,
    features: ['Campus', 'Hostel', 'Library', 'Labs', 'Sports'],
    tags: ['kiit', 'university', 'engineering', 'education'],
    isVerified: true
  },

  // Automotive Services
  {
    name: 'Indian Oil Petrol Pump',
    description: 'Indian Oil fuel station with additional services',
    address: {
      street: 'NH-16, Khordha Road',
      area: 'Khandagiri',
      city: 'Bhubaneswar',
      state: 'Odisha',
      pincode: '751030'
    },
    location: {
      type: 'Point',
      coordinates: [85.7898, 20.2567]
    },
    contact: {
      phone: '+91 674-2456789'
    },
    rating: 4.0,
    totalRatings: 89,
    features: ['24x7', 'Car Wash', 'Air/Water', 'Convenience Store'],
    tags: ['petrol pump', 'fuel', 'indian oil', 'highway'],
    isVerified: true
  },

  // Beauty & Wellness
  {
    name: 'Lakme Salon',
    description: 'Premium beauty salon with professional services',
    address: {
      street: 'Forum Mart Mall, Saheed Nagar',
      area: 'Saheed Nagar',
      city: 'Bhubaneswar',
      state: 'Odisha',
      pincode: '751007'
    },
    location: {
      type: 'Point',
      coordinates: [85.8456, 20.2945]
    },
    contact: {
      phone: '+91 674-6678890',
      email: 'saheedngr@lakmesalon.com'
    },
    rating: 4.2,
    totalRatings: 156,
    features: ['AC', 'Hair Care', 'Skin Care', 'Bridal Package'],
    tags: ['lakme', 'salon', 'beauty', 'hair', 'spa'],
    isVerified: true
  },

  // Entertainment & Recreation
  {
    name: 'INOX Cinema',
    description: 'Premium movie theater with latest films and comfortable seating',
    address: {
      street: 'DN Regalia Mall, Kalinga Studio Road',
      area: 'Rasulgarh',
      city: 'Bhubaneswar',
      state: 'Odisha',
      pincode: '751010'
    },
    location: {
      type: 'Point',
      coordinates: [85.7989, 20.2845]
    },
    contact: {
      phone: '+91 674-6677788'
    },
    rating: 4.3,
    totalRatings: 278,
    features: ['AC', 'Recliner Seats', 'Dolby Sound', 'Food & Beverages'],
    tags: ['inox', 'cinema', 'movies', 'entertainment'],
    isVerified: true
  }
];

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Category.deleteMany({});
    await Store.deleteMany({});
    console.log('🧹 Cleared existing data');

    // Insert categories
    const insertedCategories = await Category.insertMany(categories);
    console.log(`✅ Inserted ${insertedCategories.length} categories`);

    // Map category names to IDs
    const categoryMap = {};
    insertedCategories.forEach(cat => {
      categoryMap[cat.name] = cat._id;
    });

    // Assign category IDs to stores
    const storesWithCategories = stores.map(store => ({
      ...store,
      category: categoryMap[
        store.name.includes('Restaurant') || store.name.includes('Dalma') ? 'Restaurants & Food' :
        store.name.includes('Mall') ? 'Shopping & Retail' :
        store.name.includes('Hospital') || store.name.includes('AIIMS') ? 'Healthcare & Pharmacy' :
        store.name.includes('Bank') || store.name.includes('SBI') ? 'Banking & ATM' :
        store.name.includes('University') || store.name.includes('KIIT') ? 'Education & Training' :
        store.name.includes('Petrol') || store.name.includes('Oil') ? 'Automotive Services' :
        store.name.includes('Salon') || store.name.includes('Lakme') ? 'Beauty & Wellness' :
        store.name.includes('Cinema') || store.name.includes('INOX') ? 'Entertainment & Recreation' :
        'Shopping & Retail'
      ]
    }));

    // Insert stores
    const insertedStores = await Store.insertMany(storesWithCategories);
    console.log(`✅ Inserted ${insertedStores.length} stores`);

    console.log('🎉 Database seeding completed successfully!');
    console.log(`📊 Summary: ${insertedCategories.length} categories, ${insertedStores.length} stores`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  }
};

// Run the seed script
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase();
}

export default seedDatabase;
