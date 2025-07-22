import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

// Import routes
import storeRoutes from './routes/storeRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://bhubaneswar-store-locator.vercel.app'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Connect to MongoDB
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bhubaneswar-stores';
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('⚠️  Server will continue without database functionality');
    return false;
  }
};

// Routes
app.get('/', (req, res) => {
  res.json({
    message: '🏪 Bhubaneswar Store Locator API',
    version: '1.0.0',
    description: 'Find retail stores in Bhubaneswar, Odisha',
    endpoints: {
      stores: '/api/stores',
      categories: '/api/categories',
      health: '/health',
      docs: '/api/docs'
    },
    status: 'operational',
    timestamp: new Date().toISOString()
  });
});

// Health check
app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.status(dbStatus === 'connected' ? 200 : 503).json({
    status: dbStatus === 'connected' ? 'healthy' : 'unhealthy',
    database: dbStatus,
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// API Documentation
app.get('/api/docs', (req, res) => {
  res.json({
    title: 'Bhubaneswar Store Locator API',
    version: '1.0.0',
    description: 'REST API for finding retail stores in Bhubaneswar',
    baseURL: `${req.protocol}://${req.get('host')}/api`,
    endpoints: {
      stores: {
        'GET /api/stores': 'Get all stores with pagination',
        'GET /api/stores/nearby?lat=20.2961&lng=85.8245&radius=5': 'Find nearby stores',
        'GET /api/stores/search?q=grocery': 'Search stores',
        'GET /api/stores/:id': 'Get store details',
        'POST /api/stores': 'Create store (Admin)',
        'PUT /api/stores/:id': 'Update store (Admin)',
        'DELETE /api/stores/:id': 'Delete store (Admin)'
      },
      categories: {
        'GET /api/categories': 'Get all categories',
        'POST /api/categories': 'Create category (Admin)'
      }
    },
    sampleRequests: {
      nearbyStores: '/api/stores/nearby?lat=20.2961&lng=85.8245&radius=5',
      searchStores: '/api/stores/search?q=grocery&category=electronics'
    }
  });
});

// API Routes
app.use('/api/stores', storeRoutes);
app.use('/api/categories', categoryRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
    availableEndpoints: ['/api/stores', '/api/categories', '/health', '/api/docs']
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

// Start server
app.listen(PORT, '0.0.0.0', async () => {
  console.log(`🚀 Bhubaneswar Store Locator API running on port ${PORT}`);
  console.log(`📍 API Docs: http://localhost:${PORT}/api/docs`);
  const dbConnected = await connectDB();
  if (dbConnected) {
    console.log('🎉 Server started with database connectivity');
  } else {
    console.log('⚠️  Server started in demo mode (no database)');
  }
});

export default app;
