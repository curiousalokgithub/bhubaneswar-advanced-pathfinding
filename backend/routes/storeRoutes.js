import express from 'express';
import {
  getAllStores,
  getNearbyStores,
  searchStores,
  getStoreById,
  getStoresByCategory,
  createStore
} from '../controllers/storeController.js';

const router = express.Router();

// Public routes
router.get('/', getAllStores);
router.get('/nearby', getNearbyStores);
router.get('/search', searchStores);
router.get('/category/:categorySlug', getStoresByCategory);
router.get('/:id', getStoreById);

// Admin routes (no auth implemented yet)
router.post('/', createStore);

export default router;
