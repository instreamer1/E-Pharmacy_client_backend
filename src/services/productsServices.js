import ProductModel from '../db/models/Product.js';

export const getFilteredProducts = async ({
  search = '',
  category,
  discount,
  page = 1,
  limit = 9,
}) => {
  const actualLimit = Math.min(Number(limit), 12);
  console.log('GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG', discount);

  const query = {
    name: { $regex: search, $options: 'i' },
  };

  if (category && category !== 'All') {
    query.category = category;
  }

  if (discount) {
    query.isDiscountActive = true;
    query.discount = { $gte: Number(discount) };
  }

  const skip = (page - 1) * actualLimit;
  console.log('GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG', query);
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
