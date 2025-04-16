


// GET /api/products?search=aspirin&category=Medicine
import { findAllCategories, findProductById, getFilteredProducts } from '../services/productsServices.js';

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
export const getProductById = async (req, res,next) => {
  try {
    const product = await findProductById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    // res.status(500).json({ message: 'Server error' });
    next(error);
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
