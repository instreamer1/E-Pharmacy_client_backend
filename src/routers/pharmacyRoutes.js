import express from 'express';
import { getAllPharmacies, getNearestPharmacies } from '../controllers/pharmacyController.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';

const pharmacyRoutes = express.Router();

pharmacyRoutes.get('/', ctrlWrapper(getAllPharmacies));
pharmacyRoutes.get('/nearest', ctrlWrapper(getNearestPharmacies));

export default pharmacyRoutes;
