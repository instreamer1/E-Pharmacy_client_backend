import express from 'express';
import {
  getProducts,
  getProductById,
  getAllCategories,
} from '../controllers/productController.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';

const productRoutes = express.Router();

productRoutes.get('/', ctrlWrapper(getProducts));
productRoutes.get('/categories', getAllCategories);
productRoutes.get('/:id', ctrlWrapper(getProductById));

export default productRoutes;
