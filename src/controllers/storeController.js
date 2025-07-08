import { findAllStores, findNearestStores, findRandomNearestStores } from '../services/storeServices.js';

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
    const { lat, lng } = req.query;

    if (lat && lng) {
      const stores = await findNearestStores(lat, lng);

      return res.status(200).json(stores);
    }
    // random
    const randomStores = await findRandomNearestStores();
    //rating
    // const randomStores = await StoreModel.find().limit(6).sort({ rating: -1 });
    return res.status(200).json(randomStores);
  } catch (error) {
    next(error);
  }
};
