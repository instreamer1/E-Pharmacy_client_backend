import ReviewCollection from "../db/models/Review.js";
import { createReview } from "../services/reviewsServices.js";
import ApiError from '../utils/ApiError.js';


// GET /api/customer-reviews
// export const getCustomerReviews = async (req, res, next) => {
//   try {
//     const reviews = await ReviewCollection.find();
//     res.json(reviews);
//   } catch (error) {
//     // res.status(500).json({ message: 'Server error' });
//     next(error);
//   }
// };

// GET /reviews?page=1&limit=10
export const getCustomerReviews = async (req, res) => {
  const { productId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const skip = (page - 1) * limit;

  try {
    const [reviews, total] = await Promise.all([
      ReviewCollection.find({ productId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
        ReviewCollection.countDocuments({ productId }),
    ]);

    res.json({
      reviews,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении отзывов', error });
  }
};


export const createCustomerReview = async (req, res, next) => {
  try {
    const { userId, productId, rating, name, testimonial } = req.body;
    const review = await createReview({ userId, productId, rating, name, testimonial });
    res.status(201).json(review);
  } catch (error) {
    next(error);
  }
};

export const changeCustomerReview = async (req, res) => {
  const { id } = req.params;
  const { rating, pros, cons, comment } = req.body;
  const userId = req.user?._id;

  try {
    const review = await ReviewCollection.findById(id);

    if (!review) {
      return res.status(404).json({ message: 'Отзыв не найден' });
    }

    if (!review.userId.equals(userId)) {
      return res.status(403).json({ message: 'Нет доступа к редактированию этого отзыва' });
    }

    review.rating = rating ?? review.rating;
    review.pros = pros ?? review.pros;
    review.cons = cons ?? review.cons;
    review.comment = comment ?? review.comment;

    await review.save();

    res.json(review);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при редактировании отзыва', error });
  }
};

export const deleteCustomerReview =async (req, res) => {
  const { id } = req.params;
  const userId = req.user?._id;

  try {
    const review = await ReviewCollection.findById(id);

    if (!review) {
      return res.status(404).json({ message: 'Отзыв не найден' });
    }

    if (!review.userId.equals(userId)) {
      return res.status(403).json({ message: 'Нет доступа к удалению этого отзыва' });
    }

    await review.deleteOne();

    res.json({ message: 'Отзыв удален' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при удалении отзыва', error });
  }
};
