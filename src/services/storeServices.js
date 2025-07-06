import StoreModel from '../db/models/Store.js';

export const findAllStores = async ({ page = 1, limit = 6 }) => {
  const actualLimit = Math.min(Number(limit), 6);
  const skip = (page - 1) * actualLimit;

  const [result, total] = await Promise.all([
    StoreModel.find().skip(skip).limit(actualLimit).sort({ rating: -1 }),
    StoreModel.countDocuments(),
  ]);

  const stores = result.map((pharmacy) => ({
    _id: pharmacy._id,
    name: pharmacy.name,
    address: pharmacy.address,
    city: pharmacy.city,
    phone: pharmacy.phone,
    rating: pharmacy.rating,
    location: pharmacy.location,
    workingHours: pharmacy.workingHours,
    isOpenNow: isPharmacyOpenNow(pharmacy.workingHours),
  }));

  return {
    total,
    page: Number(page),
    limit: actualLimit,
    totalPages: Math.ceil(total / actualLimit),
    stores,
  };
};

export const findNearestStores = async (lat, lng) => {
  const result = await StoreModel.find({
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [parseFloat(lng), parseFloat(lat)],
        },
        $maxDistance: 1000000, // find radius (10 км)
      },
    },
  })
    .limit(6)
    .exec();

  const stores = result.map((pharmacy) => ({
    _id: pharmacy._id,
    name: pharmacy.name,
    address: pharmacy.address,
    city: pharmacy.city,
    phone: pharmacy.phone,
    rating: pharmacy.rating,
    location: pharmacy.location,
    workingHours: pharmacy.workingHours,
    isOpenNow: isPharmacyOpenNow(pharmacy.workingHours),
  }));

   return stores;
};

export const findRandomNearestStores = async () => {
  const result = await StoreModel.aggregate([{ $sample: { size: 6 } }]);

  const stores = result.map((pharmacy) => ({
    _id: pharmacy._id,
    name: pharmacy.name,
    address: pharmacy.address,
    city: pharmacy.city,
    phone: pharmacy.phone,
    rating: pharmacy.rating,
    location: pharmacy.location,
    workingHours: pharmacy.workingHours,
    isOpenNow: isPharmacyOpenNow(pharmacy.workingHours),
  }));

  return stores;

};

export const isPharmacyOpenNow = (workingHours) => {
  const days = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ];
  const now = new Date();
  const dayName = days[now.getDay()];
  const hours = workingHours?.[dayName];

  if (!hours || !hours.open || !hours.close) return false;

  const [openH, openM] = hours.open.split(':').map(Number);
  const [closeH, closeM] = hours.close.split(':').map(Number);

  const openTime = new Date(now);
  openTime.setHours(openH, openM, 0, 0);

  const closeTime = new Date(now);
  closeTime.setHours(closeH, closeM, 0, 0);

  return now >= openTime && now <= closeTime;
};
