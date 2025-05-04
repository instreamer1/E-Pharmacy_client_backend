// GET /api/products?search=aspirin&category=Medicine
import ReviewCollection from '../db/models/Review.js';
import {
  findAllCategories,
  findProductById,
  getFilteredProducts,
} from '../services/productsServices.js';
import ApiError from '../utils/ApiError.js';

export const getProducts = async (req, res, next) => {
  try {
    const { search = '', category, page = 1, limit = 6 } = req.query;
    const data = await getFilteredProducts({
      search,
      category,
      page,
      limit,
    });

    res.json(data);
  } catch (error) {
    next(error);
  }
};

// GET /api/products/:id
export const getProductByIdWithReviews = async (req, res, next) => {
  const { id: productId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 6;
  const skip = (page - 1) * limit;
  const userId = req.user?._id;

  // if (!mongoose.Types.ObjectId.isValid(productId)) {
  //   return next(ApiError.BadRequest('Invalid product ID'));
  // }
  try {
    const product = await findProductById(productId);
    if (!product) {
      return next(ApiError.NotFound('Product not found'));
    }

    const [reviews, total, userReview] = await Promise.all([
      ReviewCollection.find({ productId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      ReviewCollection.countDocuments({ productId }),
      userId ? ReviewCollection.findOne({ productId, userId }).lean() : null,
    ]);

    res.json({
      product,
      reviews: {reviews,  pagination: {
        total,
        page,
        totalPages: Math.ceil(total / limit),
      }},
      userReview: userReview || null,

    });
  } catch (error) {
    // res.status(500).json({ message: 'Server error' });
    next(ApiError.InternalError('Failed to load product with reviews'));
  }
};

// GET /api/products/categories (все категории)
export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await findAllCategories();
    res.json(categories);
  } catch (error) {
    next(error);
  }
};
