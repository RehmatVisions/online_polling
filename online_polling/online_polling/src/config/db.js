import mongoose from 'mongoose';
import { config } from './env.js';

mongoose.set('strictQuery', true);

export const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoUri, {
      autoIndex: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};
