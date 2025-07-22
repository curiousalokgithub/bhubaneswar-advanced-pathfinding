import mongoose from 'mongoose';

const timingSchema = new mongoose.Schema({
  open: { type: String, default: '09:00' },
  close: { type: String, default: '21:00' },
  isClosed: { type: Boolean, default: false }
});

const addressSchema = new mongoose.Schema({
  street: { type: String, required: true, trim: true },
  area: { type: String, required: true, trim: true },
  city: { type: String, required: true, default: 'Bhubaneswar', trim: true },
  state: { type: String, required: true, default: 'Odisha', trim: true },
  pincode: { type: String, required: true, trim: true }
});

const contactSchema = new mongoose.Schema({
  phone: { type: String, trim: true },
  email: { type: String, trim: true, lowercase: true },
  website: { type: String, trim: true }
});

const storeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
    index: true
  },
  address: addressSchema,
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true,
      index: '2dsphere'
    }
  },
  contact: contactSchema,
  timings: {
    monday: timingSchema,
    tuesday: timingSchema,
    wednesday: timingSchema,
    thursday: timingSchema,
    friday: timingSchema,
    saturday: timingSchema,
    sunday: timingSchema
  },
  images: [{ type: String, trim: true }],
  rating: { type: Number, min: 0, max: 5, default: 0 },
  totalRatings: { type: Number, default: 0 },
  features: [{ type: String, trim: true }],
  tags: [{ type: String, trim: true, lowercase: true }],
  isActive: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false }
}, {
  timestamps: true
});

// Text search index
storeSchema.index({ 
  name: 'text', 
  description: 'text', 
  'address.area': 'text',
  tags: 'text'
});

// Virtual for full address
storeSchema.virtual('fullAddress').get(function() {
  return `${this.address.street}, ${this.address.area}, ${this.address.city}, ${this.address.state} - ${this.address.pincode}`;
});

// Static method for nearby search
storeSchema.statics.findNearby = function(lat, lng, maxDistance = 10000, limit = 50) {
  return this.aggregate([
    {
      $geoNear: {
        near: { type: 'Point', coordinates: [lng, lat] },
        distanceField: 'distance',
        maxDistance: maxDistance,
        spherical: true,
        query: { isActive: true }
      }
    },
    { $limit: limit },
    {
      $lookup: {
        from: 'categories',
        localField: 'category',
        foreignField: '_id',
        as: 'category'
      }
    },
    { $unwind: '$category' }
  ]);
};

const Store = mongoose.model('Store', storeSchema);
export default Store;
