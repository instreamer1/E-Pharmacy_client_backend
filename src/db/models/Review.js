import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  testimonial: {
    type: String,
    required: true,
  },
}, { timestamps: true, collection: 'reviews' });

const Review = mongoose.model('Review', reviewSchema);
export default Review;
