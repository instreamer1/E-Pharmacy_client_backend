import ProductModel from '../db/models/Product.js';

export const getFilteredProducts = async ({
  search = '',
  category,
  page = 1,
  limit = 9,
}) => {
  const actualLimit = Math.min(Number(limit), 12);

  const query = {
    name: { $regex: search, $options: 'i' },
  };

  if (category && category !== 'All') {
    query.category = category;
  }

  const skip = (page - 1) * actualLimit;

  const [products, total] = await Promise.all([
    ProductModel.find(query).skip(skip).limit(Number(actualLimit)),
    ProductModel.countDocuments(query),
  ]);

  return {
    total,
    page: Number(page),
    limit: actualLimit,
    totalPages: Math.ceil(total / limit),
    products,
  };
};

export const findProductById = (filter) => {
  const product = ProductModel.findById(filter);
  return product;
};

export const findAllCategories = () => {
  return ProductModel.distinct('category');
};
