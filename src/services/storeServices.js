import StoreCollection from "../db/models/Store.js";

export const findAllStores = async ({ page = 1, limit = 6 }) => {
  const actualLimit = Math.min(Number(limit), 6);
  const skip = (page - 1) * actualLimit;

  const [stores, total] = await Promise.all([
    StoreCollection.find().skip(skip).limit(actualLimit).sort({ rating: -1 }),
    StoreCollection.countDocuments()
  ]);

  return {
    total,
    page: Number(page),
    limit: actualLimit,
    totalPages: Math.ceil(total / actualLimit),
    stores,
  };
};
