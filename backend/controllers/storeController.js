import Store from '../models/Store.js';
import Category from '../models/Category.js';

// Get all stores with pagination and filtering
export const getAllStores = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const category = req.query.category;
    const isVerified = req.query.isVerified;
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    // Build filter query
    const filter = { isActive: true };
    if (category) filter.category = category;
    if (isVerified !== undefined) filter.isVerified = isVerified === 'true';

    // Calculate skip
    const skip = (page - 1) * limit;

    // Get stores with populated category
    const stores = await Store.find(filter)
      .populate('category', 'name slug color icon')
      .select('-__v')
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count
    const totalStores = await Store.countDocuments(filter);
    const totalPages = Math.ceil(totalStores / limit);

    res.json({
      success: true,
      data: stores,
      pagination: {
        currentPage: page,
        totalPages,
        totalStores,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching stores:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch stores',
      error: error.message
    });
  }
};

// Get nearby stores
export const getNearbyStores = async (req, res) => {
  try {
    const { lat, lng, maxDistance = 10000, limit = 50 } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    const distance = parseInt(maxDistance);
    const resultLimit = parseInt(limit);

    // Validate coordinates
    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid coordinates provided'
      });
    }

    const stores = await Store.findNearby(latitude, longitude, distance, resultLimit);

    res.json({
      success: true,
      data: stores,
      count: stores.length,
      coordinates: { lat: latitude, lng: longitude },
      maxDistance: distance
    });
  } catch (error) {
    console.error('Error fetching nearby stores:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch nearby stores',
      error: error.message
    });
  }
};

// Search stores
export const searchStores = async (req, res) => {
  try {
    const { q, category, area, limit = 20 } = req.query;
    
    if (!q || q.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    // Build search query
    const searchQuery = {
      $and: [
        { isActive: true },
        {
          $or: [
            { $text: { $search: q } },
            { name: { $regex: q, $options: 'i' } },
            { 'address.area': { $regex: q, $options: 'i' } },
            { tags: { $in: [new RegExp(q, 'i')] } }
          ]
        }
      ]
    };

    // Add category filter
    if (category) {
      searchQuery.$and.push({ category });
    }

    // Add area filter
    if (area) {
      searchQuery.$and.push({ 'address.area': { $regex: area, $options: 'i' } });
    }

    const stores = await Store.find(searchQuery)
      .populate('category', 'name slug color icon')
      .select('-__v')
      .limit(parseInt(limit))
      .sort({ score: { $meta: 'textScore' }, rating: -1 })
      .lean();

    res.json({
      success: true,
      data: stores,
      count: stores.length,
      query: q
    });
  } catch (error) {
    console.error('Error searching stores:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search stores',
      error: error.message
    });
  }
};

// Get single store by ID
export const getStoreById = async (req, res) => {
  try {
    const { id } = req.params;

    const store = await Store.findOne({ _id: id, isActive: true })
      .populate('category', 'name slug color icon description')
      .select('-__v')
      .lean();

    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    res.json({
      success: true,
      data: store
    });
  } catch (error) {
    console.error('Error fetching store:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch store',
      error: error.message
    });
  }
};

// Get stores by category
export const getStoresByCategory = async (req, res) => {
  try {
    const { categorySlug } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    // Find category by slug
    const category = await Category.findOne({ slug: categorySlug, isActive: true });
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    const skip = (page - 1) * limit;

    const stores = await Store.find({ category: category._id, isActive: true })
      .populate('category', 'name slug color icon')
      .select('-__v')
      .sort({ rating: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalStores = await Store.countDocuments({ category: category._id, isActive: true });
    const totalPages = Math.ceil(totalStores / limit);

    res.json({
      success: true,
      data: stores,
      category: {
        name: category.name,
        slug: category.slug,
        description: category.description,
        color: category.color,
        icon: category.icon
      },
      pagination: {
        currentPage: page,
        totalPages,
        totalStores,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching stores by category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch stores by category',
      error: error.message
    });
  }
};

// Create new store (Admin only - placeholder for now)
export const createStore = async (req, res) => {
  try {
    const storeData = req.body;
    
    // Validate required fields
    const requiredFields = ['name', 'category', 'address', 'location'];
    const missingFields = requiredFields.filter(field => !storeData[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Verify category exists
    const categoryExists = await Category.findById(storeData.category);
    if (!categoryExists) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category ID'
      });
    }

    const store = new Store(storeData);
    await store.save();

    // Populate category before sending response
    await store.populate('category', 'name slug color icon');

    res.status(201).json({
      success: true,
      message: 'Store created successfully',
      data: store
    });
  } catch (error) {
    console.error('Error creating store:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create store',
      error: error.message
    });
  }
};
