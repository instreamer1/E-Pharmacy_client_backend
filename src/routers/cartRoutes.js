import express from 'express';
import {
  getCartItems,
  updateCart,
  checkout,
} from '../controllers/cartController.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import { checkoutCartSchema, updateCartSchema } from '../schemas/cartSchema.js';
import validateBody from '../utils/validateBody.js';
import verifyAccessTokenMiddleware from '../middlewares/verifyAccessTokenMiddleware.js';

const cartRoutes = express.Router();

cartRoutes.get('/', verifyAccessTokenMiddleware, ctrlWrapper(getCartItems)); // Получить товары в корзине
cartRoutes.put('/update', verifyAccessTokenMiddleware,validateBody(updateCartSchema), ctrlWrapper(updateCart)); // Обновить корзину
cartRoutes.post('/checkout', verifyAccessTokenMiddleware, validateBody(checkoutCartSchema), ctrlWrapper(checkout)); // Оформить заказ

export default cartRoutes;
