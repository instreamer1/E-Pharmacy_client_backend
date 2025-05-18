import express from 'express';
import { getAllStores, getNearestStores } from '../controllers/storeController.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';

const pharmacyRoutes = express.Router();

pharmacyRoutes.get('/', ctrlWrapper(getAllStores));
pharmacyRoutes.get('/nearest', ctrlWrapper(getNearestStores));

export default pharmacyRoutes;
