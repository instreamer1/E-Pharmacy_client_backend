import ProductCollection from '../db/models/Product.js';

export const getFilteredProducts = async ({
  search = '',
  category,
  page = 1,
  limit = 6,
}) => {
  const query = {
    name: { $regex: search, $options: 'i' }, 
  };

  if (category && category !== 'All') {
    query.category = category;
  }

  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    ProductCollection.find(query).skip(skip).limit(Number(limit)),
    ProductCollection.countDocuments(query),
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
  const product = ProductCollection.findById(filter);
  return product;
};

export const findAllCategories = () => {
  return ProductCollection.distinct('category');
};
