// utils/seedPharmacies.js

import mongoose from 'mongoose';
import env from '../utils/env.js';

const user = encodeURIComponent(env('MONGODB_USER'));
const pwd = encodeURIComponent(env('MONGODB_PASSWORD'));
const url = env('MONGODB_URL');
const db = env('MONGODB_DB');

const connectionString = `mongodb+srv://${user}:${pwd}@${url}/${db}?retryWrites=true&w=majority`;
await mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

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

const storeSchema = new mongoose.Schema({
  name: String,
  address: String,
  city: String,
  phone: String,
  rating: Number,
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number], // [lng, lat]
  },
  workingHours: workingHoursSchema,
});
storeSchema.index({ location: '2dsphere' });
const StoreModel = mongoose.model('Store', storeSchema, 'stores');

const pharmacies = [
  {
    name: 'Pharmacy Hope',
    address: 'Shevchenka St, 100',
    city: 'Lviv',
    phone: '0322-45-67-89',
    rating: 4,
    location: { type: 'Point', coordinates: [24.0316, 49.8429] },
    workingHours: {
      monday: { open: '08:00', close: '20:00' },
      tuesday: { open: '08:00', close: '20:00' },
      wednesday: { open: '08:00', close: '20:00' },
      thursday: { open: '08:00', close: '20:00' },
      friday: { open: '08:00', close: '20:00' },
      saturday: { open: '09:00', close: '18:00' },
      sunday: { open: null, close: null },
    },
  },
  {
    name: 'Pharmakor',
    address: 'Hoholia St, 24',
    city: 'Kharkiv',
    phone: '0572-58-22-12',
    rating: 3,
    location: { type: 'Point', coordinates: [36.2304, 49.9935] },
    workingHours: {
      monday: { open: '08:00', close: '20:00' },
      tuesday: { open: '08:00', close: '20:00' },
      wednesday: { open: '08:00', close: '20:00' },
      thursday: { open: '08:00', close: '20:00' },
      friday: { open: '08:00', close: '20:00' },
      saturday: { open: '09:00', close: '18:00' },
      sunday: { open: null, close: null },
    },
  },
  {
    name: 'Aesculap',
    address: 'Peace Ave, 5',
    city: 'Dnipro',
    phone: '056-744-55-66',
    rating: 5,
    location: { type: 'Point', coordinates: [35.0456, 48.4647] },
  },
  {
    name: 'Balsam',
    address: 'Soborna St, 14',
    city: 'Rivne',
    phone: '0362-62-33-44',
    rating: 3,
    location: { type: 'Point', coordinates: [26.2516, 50.6199] },
  },
  {
    name: 'Med-Service',
    address: 'Lesi Ukrainki St, 78',
    city: 'Zaporizhzhia',
    phone: '0612-34-56-78',
    rating: 4,
    location: { type: 'Point', coordinates: [35.1396, 47.8388] },
    workingHours: {
      monday: { open: '08:00', close: '20:00' },
      tuesday: { open: '08:00', close: '20:00' },
      wednesday: { open: '08:00', close: '20:00' },
      thursday: { open: '08:00', close: '20:00' },
      friday: { open: '08:00', close: '20:00' },
      saturday: { open: '09:00', close: '18:00' },
      sunday: { open: null, close: null },
    },
  },
  {
    name: 'Pharmacy',
    address: 'Freedom Ave, 120',
    city: 'Ternopil',
    phone: '0352-52-43-21',
    rating: 3,
    location: { type: 'Point', coordinates: [25.5902, 49.5535] },
    workingHours: {
      monday: { open: '08:00', close: '20:00' },
      tuesday: { open: '08:00', close: '20:00' },
      wednesday: { open: '08:00', close: '20:00' },
      thursday: { open: '08:00', close: '20:00' },
      friday: { open: '08:00', close: '20:00' },
      saturday: { open: '09:00', close: '18:00' },
      sunday: { open: null, close: null },
    },
  },
  {
    name: 'Pharmacy 24',
    address: 'Kyivska St, 48',
    city: 'Cherkasy',
    phone: '0472-35-67-89',
    rating: 4,
    location: { type: 'Point', coordinates: [32.0598, 49.4444] },
    workingHours: {
      monday: { open: '08:00', close: '20:00' },
      tuesday: { open: '08:00', close: '20:00' },
      wednesday: { open: '08:00', close: '20:00' },
      thursday: { open: '08:00', close: '20:00' },
      friday: { open: '08:00', close: '20:00' },
      saturday: { open: '09:00', close: '18:00' },
      sunday: { open: null, close: null },
    },
  },
  {
    name: 'Good Medicines',
    address: 'Independence St, 67',
    city: 'Ivano-Frankivsk',
    phone: '0342-50-60-70',
    rating: 5,
    location: { type: 'Point', coordinates: [24.7096, 48.9226] },
    workingHours: {
      monday: { open: '08:00', close: '20:00' },
      tuesday: { open: '08:00', close: '20:00' },
      wednesday: { open: '08:00', close: '20:00' },
      thursday: { open: '08:00', close: '20:00' },
      friday: { open: '08:00', close: '20:00' },
      saturday: { open: '09:00', close: '18:00' },
      sunday: { open: null, close: null },
    },
  },
  {
    name: 'Plantain',
    address: 'Petlyury St, 29',
    city: 'Vinnytsia',
    phone: '0432-65-88-99',
    rating: 4,
    location: { type: 'Point', coordinates: [28.4826, 49.2328] },
    workingHours: {
      monday: { open: '08:00', close: '20:00' },
      tuesday: { open: '08:00', close: '20:00' },
      wednesday: { open: '08:00', close: '20:00' },
      thursday: { open: '08:00', close: '20:00' },
      friday: { open: '08:00', close: '20:00' },
      saturday: { open: '09:00', close: '18:00' },
      sunday: { open: null, close: null },
    },
  },
  {
    name: 'Pharmacy Plus',
    address: 'Dovzhenka St, 3',
    city: 'Lutsk',
    phone: '0332-78-90-10',
    rating: 3,
    location: { type: 'Point', coordinates: [25.3424, 50.7472] },
    workingHours: {
      monday: { open: '08:00', close: '20:00' },
      tuesday: { open: '08:00', close: '20:00' },
      wednesday: { open: '08:00', close: '20:00' },
      thursday: { open: '08:00', close: '20:00' },
      friday: { open: '08:00', close: '20:00' },
      saturday: { open: '09:00', close: '18:00' },
      sunday: { open: null, close: null },
    },
  },
  {
    name: 'Med-Medicines',
    address: 'Kosmonavtiv St, 12',
    city: 'Mykolaiv',
    phone: '0512-47-58-69',
    rating: 2,
    location: { type: 'Point', coordinates: [32.0089, 46.975] },
    workingHours: {
      monday: { open: '08:00', close: '20:00' },
      tuesday: { open: '08:00', close: '20:00' },
      wednesday: { open: '08:00', close: '20:00' },
      thursday: { open: '08:00', close: '20:00' },
      friday: { open: '08:00', close: '20:00' },
      saturday: { open: '09:00', close: '18:00' },
      sunday: { open: null, close: null },
    },
  },
  {
    name: 'Pharmaland',
    address: 'Gagarin Ave, 17',
    city: 'Kherson',
    phone: '0552-49-50-60',
    rating: 4,
    location: { type: 'Point', coordinates: [32.6178, 46.6369] },
    workingHours: {
      monday: { open: '08:00', close: '20:00' },
      tuesday: { open: '08:00', close: '20:00' },
      wednesday: { open: '08:00', close: '20:00' },
      thursday: { open: '08:00', close: '20:00' },
      friday: { open: '08:00', close: '20:00' },
      saturday: { open: '09:00', close: '18:00' },
      sunday: { open: null, close: null },
    },
  },
  {
    name: 'Medicines from the Heart',
    address: 'Starokyivska St, 5',
    city: 'Chernihiv',
    phone: '0462-67-89-90',
    rating: 5,
    location: { type: 'Point', coordinates: [31.291, 51.4982] },
    workingHours: {
      monday: { open: '08:00', close: '20:00' },
      tuesday: { open: '08:00', close: '20:00' },
      wednesday: { open: '08:00', close: '20:00' },
      thursday: { open: '08:00', close: '20:00' },
      friday: { open: '08:00', close: '20:00' },
      saturday: { open: '09:00', close: '18:00' },
      sunday: { open: null, close: null },
    },
  },
  {
    name: 'Good Day Pharmacy',
    address: 'Halytska St, 23',
    city: 'Chernivtsi',
    phone: '0372-55-66-77',
    rating: 4,
    location: { type: 'Point', coordinates: [25.9403, 48.2915] },
    workingHours: {
      monday: { open: '08:00', close: '20:00' },
      tuesday: { open: '08:00', close: '20:00' },
      wednesday: { open: '08:00', close: '20:00' },
      thursday: { open: '08:00', close: '20:00' },
      friday: { open: '08:00', close: '20:00' },
      saturday: { open: '09:00', close: '18:00' },
      sunday: { open: null, close: null },
    },
  },
  {
    name: 'Health',
    address: 'Stepana Bandery St, 56',
    city: 'Uzhhorod',
    phone: '0312-61-62-63',
    rating: 3,
    location: { type: 'Point', coordinates: [22.2935, 48.6208] },
    workingHours: {
      monday: { open: '08:00', close: '20:00' },
      tuesday: { open: '08:00', close: '20:00' },
      wednesday: { open: '08:00', close: '20:00' },
      thursday: { open: '08:00', close: '20:00' },
      friday: { open: '08:00', close: '20:00' },
      saturday: { open: '09:00', close: '18:00' },
      sunday: { open: null, close: null },
    },
  },
  {
    name: 'Panacea',
    address: 'Chervonoi Kalyny Ave, 76',
    city: 'Lviv',
    phone: '032-245-76-88',
    rating: 2,
    location: { type: 'Point', coordinates: [24.0342, 49.8381] },
    workingHours: {
      monday: { open: '08:00', close: '20:00' },
      tuesday: { open: '08:00', close: '20:00' },
      wednesday: { open: '08:00', close: '20:00' },
      thursday: { open: '08:00', close: '20:00' },
      friday: { open: '08:00', close: '20:00' },
      saturday: { open: '09:00', close: '18:00' },
      sunday: { open: null, close: null },
    },
  },
  {
    name: 'Pharmplanet',
    address: 'Ostrozkoho St, 37',
    city: 'Poltava',
    phone: '0532-60-71-82',
    rating: 5,
    location: { type: 'Point', coordinates: [34.5529, 49.5883] },
    workingHours: {
      monday: { open: '08:00', close: '20:00' },
      tuesday: { open: '08:00', close: '20:00' },
      wednesday: { open: '08:00', close: '20:00' },
      thursday: { open: '08:00', close: '20:00' },
      friday: { open: '08:00', close: '20:00' },
      saturday: { open: '09:00', close: '18:00' },
      sunday: { open: null, close: null },
    },
  },
  {
    name: 'Pharmacy Penny',
    address: 'Krymskoho St, 18',
    city: 'Simferopol',
    phone: '0652-51-62-73',
    rating: 4,
    location: { type: 'Point', coordinates: [34.1085, 44.9481] },
    workingHours: {
      monday: { open: '08:00', close: '20:00' },
      tuesday: { open: '08:00', close: '20:00' },
      wednesday: { open: '08:00', close: '20:00' },
      thursday: { open: '08:00', close: '20:00' },
      friday: { open: '08:00', close: '20:00' },
      saturday: { open: '09:00', close: '18:00' },
      sunday: { open: null, close: null },
    },
  },
  {
    name: 'Pharmacy 36.6',
    address: 'Hrushevskoho St, 4',
    city: 'Kyiv',
    phone: '044-501-36-86',
    rating: 3,
    location: { type: 'Point', coordinates: [30.5234, 50.4501] },
    workingHours: {
      monday: { open: '08:00', close: '20:00' },
      tuesday: { open: '08:00', close: '20:00' },
      wednesday: { open: '08:00', close: '20:00' },
      thursday: { open: '08:00', close: '20:00' },
      friday: { open: '08:00', close: '20:00' },
      saturday: { open: '09:00', close: '18:00' },
      sunday: { open: null, close: null },
    },
  },
  {
    name: 'Vitafarm',
    address: 'Studentska St, 12',
    city: 'Sumy',
    phone: '0542-67-88-99',
    rating: 5,
    location: { type: 'Point', coordinates: [34.8019, 50.9077] },
    workingHours: {
      monday: { open: '08:00', close: '20:00' },
      tuesday: { open: '08:00', close: '20:00' },
      wednesday: { open: '08:00', close: '20:00' },
      thursday: { open: '08:00', close: '20:00' },
      friday: { open: '08:00', close: '20:00' },
      saturday: { open: '09:00', close: '18:00' },
      sunday: { open: null, close: null },
    },
  },
];
async function seed() {
  try {
    await mongoose.connect(connectionString);
    console.log('Connected to myPharmacyDB');

    await StoreModel.deleteMany();
    await StoreModel.insertMany(pharmacies);
    console.log('Inserted into `stores` collection');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

seed();

// node src/utils/seedPharmacies.js
