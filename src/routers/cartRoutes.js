import express from 'express';
import {
  getCartItems,
  updateCart,
  checkout,
} from '../controllers/cartController.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import authenticate from '../middlewares/authenticate.js';
import { checkoutCartSchema, updateCartSchema } from '../schemas/cartSchema.js';
import validateBody from '../utils/validateBody.js';

const cartRoutes = express.Router();

cartRoutes.get('/', authenticate, ctrlWrapper(getCartItems)); // Получить товары в корзине
cartRoutes.put('/update', authenticate,validateBody(updateCartSchema), ctrlWrapper(updateCart)); // Обновить корзину
cartRoutes.post('/checkout', authenticate, validateBody(checkoutCartSchema), ctrlWrapper(checkout)); // Оформить заказ

export default cartRoutes;
