// src/db/initMongoDB.js

import mongoose from 'mongoose';
import  env  from '../utils/env.js';

const initMongoDBConnection = async () => {

    const user = encodeURIComponent(env('MONGODB_USER'));
    const pwd = encodeURIComponent(env('MONGODB_PASSWORD'));
    const url = env('MONGODB_URL');
    const db = env('MONGODB_DB');


    const connectionString = `mongodb+srv://${user}:${pwd}@${url}/${db}?retryWrites=true&w=majority`;

  try {
    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connection successfully established!');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

export default initMongoDBConnection ;
