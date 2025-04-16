import express from 'express';
import { getOrders, getOrderById, createOrder } from '../controllers/orderController.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import authenticate from '../middlewares/authenticate.js';

const orderRoutes = express.Router();

orderRoutes.get('/', authenticate, ctrlWrapper(getOrders)); // Получить все заказы пользователя
orderRoutes.get('/:id', authenticate, ctrlWrapper(getOrderById)); // Получить заказ по ID
orderRoutes.post('/', authenticate, ctrlWrapper(createOrder)); // Создать новый заказ

export default orderRoutes;
