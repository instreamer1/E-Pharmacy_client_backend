import express from 'express';
import {
  getProducts,
  getAllCategories,
  getProductByIdWithReviews,
} from '../../controllers/productController.js';
import ctrlWrapper from '../../utils/ctrlWrapper.js';
import optionalAuth from '../../middlewares/optionalAuthMiddleware.js';

const productRoutes = express.Router();

productRoutes.get('/', ctrlWrapper(getProducts));
productRoutes.get('/categories', ctrlWrapper(getAllCategories));
productRoutes.get('/:id', optionalAuth, ctrlWrapper(getProductByIdWithReviews));

export default productRoutes;
