import Product from '../db/models/Product.js';

export const getFilteredProducts = async ({
  search = '',
  category,
  page = 1,
  limit = 6,
}) => {
  const query = {
    name: { $regex: search, $options: 'i' }, // Поиск по имени
  };

  if (category && category !== 'All') {
    query.category = category; // Не фильтруем по "All"
  }

  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    Product.find(query).skip(skip).limit(Number(limit)),
    Product.countDocuments(query),
  ]);

  return {
    total,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(total / limit),
    products,
  };
};

export const findProductById = (filter) => {
  const product = Product.findById(filter);
  return product;
};

export const findAllCategories = () => {
  return Product.distinct('category');
};
