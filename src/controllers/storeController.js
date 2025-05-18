import StoreCollection from '../db/models/Store.js';
import { findAllStores } from '../services/storeServices.js';


// GET /api/stores
export const getAllStores = async (req, res, next) => {
  const page = req.query.page;
  const limit = req.query.limit;
  try {
    const stores = await findAllStores({ page, limit });
    res.json(stores);
  } catch (error) {
    next(error);
  }
};

// GET /api/stores/nearest
export const getNearestStores = async (req, res, next) => {
  try {
    // Это заглушка. В будущем можно прикрутить geo-поиск
    const stores = await StoreCollection.find().limit(6).sort({ rating: -1 });
    res.json(stores);
  } catch (error) {
  next(error);
  }
};
