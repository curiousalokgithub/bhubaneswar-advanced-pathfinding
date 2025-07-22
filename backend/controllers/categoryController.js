import Category from '../models/Category.js';

// Get all categories
export const getAllCategories = async (req, res) => {
  try {
    const includeInactive = req.query.includeInactive === 'true';
    const withStoreCounts = req.query.withStoreCounts === 'true';

    let categories;

    if (withStoreCounts) {
      // Get categories with store counts using aggregation
      const pipeline = [
        ...(includeInactive ? [] : [{ $match: { isActive: true } }]),
        {
          $lookup: {
            from: 'stores',
            localField: '_id',
            foreignField: 'category',
            pipeline: [{ $match: { isActive: true } }],
            as: 'stores'
          }
        },
        {
          $addFields: {
            storeCount: { $size: '$stores' }
          }
        },
        {
          $project: {
            stores: 0,
            __v: 0
          }
        },
        { $sort: { sortOrder: 1, name: 1 } }
      ];

      categories = await Category.aggregate(pipeline);
    } else {
      // Simple category fetch
      const filter = includeInactive ? {} : { isActive: true };
      categories = await Category.find(filter)
        .select('-__v')
        .sort({ sortOrder: 1, name: 1 })
        .lean();
    }

    res.json({
      success: true,
      data: categories,
      count: categories.length
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      error: error.message
    });
  }
};

// Get category by slug
export const getCategoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const category = await Category.findOne({ slug, isActive: true })
      .select('-__v')
      .lean();

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Get store count for this category
    const storeCount = await Category.aggregate([
      { $match: { _id: category._id } },
      {
        $lookup: {
          from: 'stores',
          localField: '_id',
          foreignField: 'category',
          pipeline: [{ $match: { isActive: true } }],
          as: 'stores'
        }
      },
      {
        $project: {
          storeCount: { $size: '$stores' }
        }
      }
    ]);

    category.storeCount = storeCount[0]?.storeCount || 0;

    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch category',
      error: error.message
    });
  }
};

// Get parent categories only
export const getParentCategories = async (req, res) => {
  try {
    const withStoreCounts = req.query.withStoreCounts === 'true';

    let categories;

    if (withStoreCounts) {
      categories = await Category.aggregate([
        { $match: { isActive: true, parentCategory: null } },
        {
          $lookup: {
            from: 'stores',
            localField: '_id',
            foreignField: 'category',
            pipeline: [{ $match: { isActive: true } }],
            as: 'stores'
          }
        },
        {
          $addFields: {
            storeCount: { $size: '$stores' }
          }
        },
        {
          $project: {
            stores: 0,
            __v: 0
          }
        },
        { $sort: { sortOrder: 1, name: 1 } }
      ]);
    } else {
      categories = await Category.find({ 
        isActive: true, 
        parentCategory: null 
      })
        .select('-__v')
        .sort({ sortOrder: 1, name: 1 })
        .lean();
    }

    res.json({
      success: true,
      data: categories,
      count: categories.length
    });
  } catch (error) {
    console.error('Error fetching parent categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch parent categories',
      error: error.message
    });
  }
};

// Get subcategories of a parent category
export const getSubcategories = async (req, res) => {
  try {
    const { parentSlug } = req.params;

    // Find parent category
    const parentCategory = await Category.findOne({ 
      slug: parentSlug, 
      isActive: true 
    });

    if (!parentCategory) {
      return res.status(404).json({
        success: false,
        message: 'Parent category not found'
      });
    }

    // Get subcategories
    const subcategories = await Category.find({
      parentCategory: parentCategory._id,
      isActive: true
    })
      .select('-__v')
      .sort({ sortOrder: 1, name: 1 })
      .lean();

    res.json({
      success: true,
      data: subcategories,
      count: subcategories.length,
      parent: {
        name: parentCategory.name,
        slug: parentCategory.slug,
        description: parentCategory.description
      }
    });
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subcategories',
      error: error.message
    });
  }
};

// Create new category (Admin only - placeholder)
export const createCategory = async (req, res) => {
  try {
    const categoryData = req.body;

    // Validate required fields
    if (!categoryData.name) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required'
      });
    }

    // Check if category with same name already exists
    const existingCategory = await Category.findOne({ 
      name: categoryData.name.trim() 
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Category with this name already exists'
      });
    }

    // If parentCategory is provided, verify it exists
    if (categoryData.parentCategory) {
      const parentExists = await Category.findById(categoryData.parentCategory);
      if (!parentExists) {
        return res.status(400).json({
          success: false,
          message: 'Invalid parent category ID'
        });
      }
    }

    const category = new Category(categoryData);
    await category.save();

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category
    });
  } catch (error) {
    console.error('Error creating category:', error);
    
    // Handle unique constraint error
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({
        success: false,
        message: `Category with this ${field} already exists`
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create category',
      error: error.message
    });
  }
};

// Get category statistics
export const getCategoryStats = async (req, res) => {
  try {
    const stats = await Category.aggregate([
      { $match: { isActive: true } },
      {
        $lookup: {
          from: 'stores',
          localField: '_id',
          foreignField: 'category',
          pipeline: [{ $match: { isActive: true } }],
          as: 'stores'
        }
      },
      {
        $group: {
          _id: null,
          totalCategories: { $sum: 1 },
          totalStores: { $sum: { $size: '$stores' } },
          averageStoresPerCategory: { $avg: { $size: '$stores' } },
          categoriesWithStores: {
            $sum: {
              $cond: [{ $gt: [{ $size: '$stores' }, 0] }, 1, 0]
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          totalCategories: 1,
          totalStores: 1,
          averageStoresPerCategory: { $round: ['$averageStoresPerCategory', 2] },
          categoriesWithStores: 1,
          categoriesWithoutStores: { $subtract: ['$totalCategories', '$categoriesWithStores'] }
        }
      }
    ]);

    const result = stats[0] || {
      totalCategories: 0,
      totalStores: 0,
      averageStoresPerCategory: 0,
      categoriesWithStores: 0,
      categoriesWithoutStores: 0
    };

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error fetching category stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch category statistics',
      error: error.message
    });
  }
};
