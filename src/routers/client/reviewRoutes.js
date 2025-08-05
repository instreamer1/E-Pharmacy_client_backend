import express from 'express';

import ctrlWrapper from '../../utils/ctrlWrapper.js';
import { reviewSchema } from '../../schemas/reviewSchema.js';
import validateBody from '../../utils/validateBody.js';
import { createCustomerReview } from '../../controllers/reviewController.js';
import verifyAccessTokenMiddleware from '../../middlewares/verifyAccessTokenMiddleware.js';

const reviewRoutes = express.Router();

// reviewRoutes.get('/', ctrlWrapper(getCustomerReviews));

reviewRoutes.post(
  '/',
  verifyAccessTokenMiddleware,
  validateBody(reviewSchema),
  ctrlWrapper(createCustomerReview),
);
// reviewRoutes.put('/reviews/:id', authenticate, ...);
// reviewRoutes.delete('/reviews/:id', authenticate, ...);

export default reviewRoutes;
