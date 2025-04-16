import Review from "../db/models/Review.js";


// GET /api/customer-reviews
export const getCustomerReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find();
    res.json(reviews);
  } catch (error) {
    // res.status(500).json({ message: 'Server error' });
    next(error);
  }
};

