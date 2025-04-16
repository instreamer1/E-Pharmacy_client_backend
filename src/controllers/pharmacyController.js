import Pharmacy from "../db/models/Pharmacy.js";


// GET /api/stores
export const getAllPharmacies = async (req, res, next) => {
  try {
    const pharmacies = await Pharmacy.find();
    res.json(pharmacies);
  } catch (error) {
    // res.status(500).json({ message: 'Server error' });
    next(error);
  }
};

// GET /api/stores/nearest
export const getNearestPharmacies = async (req, res, next) => {
  try {
    // Это заглушка. В будущем можно прикрутить geo-поиск
    const pharmacies = await Pharmacy.find().limit(5).sort({ rating: -1 });
    res.json(pharmacies);
  } catch (error) {
    // res.status(500).json({ message: 'Server error' });
    next(error);
  }
};
