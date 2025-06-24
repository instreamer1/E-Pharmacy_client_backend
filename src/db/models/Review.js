import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    productId: { type: String, required: true },
    userId: { type: String, required: true,  select: false},
    rating: { type: Number, required: true, min: 1, max: 5 },
    name: { type: String, required: true },
    testimonial: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

reviewSchema.index({ userId: 1, productId: 1 }, { unique: true });

const ReviewCollection = mongoose.model('Review', reviewSchema);
export default ReviewCollection;
