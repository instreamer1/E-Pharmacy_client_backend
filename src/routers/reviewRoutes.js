import express from 'express';
import { getCustomerReviews } from '../controllers/reviewController.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';

const reviewRoutes = express.Router();

reviewRoutes.get('/', ctrlWrapper(getCustomerReviews));

export default reviewRoutes;
