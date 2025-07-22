import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  icon: {
    type: String,
    trim: true
  },
  color: {
    type: String,
    default: '#3B82F6',
    trim: true
  },
  parentCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  sortOrder: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Pre-save middleware to generate slug
categorySchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  }
  next();
});

// Virtual for subcategories
categorySchema.virtual('subcategories', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parentCategory'
});

// Virtual for store count
categorySchema.virtual('storeCount', {
  ref: 'Store',
  localField: '_id',
  foreignField: 'category',
  count: true
});

// Static method to get categories with store counts
categorySchema.statics.getWithStoreCounts = function() {
  return this.aggregate([
    { $match: { isActive: true } },
    {
      $lookup: {
        from: 'stores',
        localField: '_id',
        foreignField: 'category',
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
        stores: 0
      }
    },
    { $sort: { sortOrder: 1, name: 1 } }
  ]);
};

const Category = mongoose.model('Category', categorySchema);
export default Category;
