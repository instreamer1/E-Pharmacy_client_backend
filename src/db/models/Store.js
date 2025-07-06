import mongoose from 'mongoose';
const workingHoursSchema = new mongoose.Schema({
  monday: {
    open: String,  // формат "HH:mm"
    close: String,
  },
  tuesday: {
    open: String,
    close: String,
  },
  wednesday: {
    open: String,
    close: String,
  },
  thursday: {
    open: String,
    close: String,
  },
  friday: {
    open: String,
    close: String,
  },
  saturday: {
    open: String,
    close: String,
  },
  sunday: {
    open: String,
    close: String,
  },
}, { _id: false });

const storeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    location: {
      type: { type: String, default: 'Point' },
      coordinates: [Number], // [lng, lat]
    },
     workingHours: workingHoursSchema,
  },
  { timestamps: true, collection: 'stores' },
);

storeSchema.index({ location: '2dsphere' });
const StoreModel = mongoose.model('Store', storeSchema, 'stores');
export default StoreModel;
