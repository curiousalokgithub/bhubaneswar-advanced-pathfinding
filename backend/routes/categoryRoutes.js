import express from 'express';
import {
  getAllCategories,
  getCategoryBySlug,
  getParentCategories,
  getSubcategories,
  createCategory,
  getCategoryStats
} from '../controllers/categoryController.js';

const router = express.Router();

// Public routes
router.get('/', getAllCategories);
router.get('/parents', getParentCategories);
router.get('/stats', getCategoryStats);
router.get('/:slug', getCategoryBySlug);
router.get('/:parentSlug/subcategories', getSubcategories);

// Admin routes (no auth implemented yet)
router.post('/', createCategory);

export default router;
