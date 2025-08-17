import express from 'express';
import {
  getOrders,
  getOrderById,
  createOrder,
} from '../../controllers/orderController.js';
import ctrlWrapper from '../../utils/ctrlWrapper.js';
import verifyAccessTokenMiddleware from '../../middlewares/verifyAccessTokenMiddleware.js';

const orderRoutes = express.Router();

orderRoutes.get('/', verifyAccessTokenMiddleware, ctrlWrapper(getOrders)); // Получить все заказы пользователя
orderRoutes.get('/:id', verifyAccessTokenMiddleware, ctrlWrapper(getOrderById)); // Получить заказ по ID
orderRoutes.post('/', verifyAccessTokenMiddleware, ctrlWrapper(createOrder)); // Создать новый заказ

export default orderRoutes;
