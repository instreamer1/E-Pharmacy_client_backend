import ReviewCollection from '../db/models/Review.js';
import ApiError from '../utils/ApiError.js';

export const createReview = async ({
  userId,
  productId,
  rating,
  name,
  testimonial,
}) => {
  const existing = await ReviewCollection.findOne({ userId, productId });
  if (existing) {
    throw ApiError.Conflict('You have already left a review');
  }

  const newReview = new ReviewCollection({
    userId,
    productId,
    rating,
    name,
    testimonial,
  });
  await newReview.save();
  return newReview;
};
