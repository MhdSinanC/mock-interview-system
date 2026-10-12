import mongoose from 'mongoose';
import { initLocalStore } from '../data/store.js';

let isMongoConnected = false;

export const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mock_interview';

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2000
    });
    isMongoConnected = true;
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`[Database] Local MongoDB not reachable (${error.message}).`);
    console.log(`[Database] Activating High-Reliability Local JSON Persistence Mode.`);
    isMongoConnected = false;
    initLocalStore();
    return false;
  }
};

export const getDbStatus = () => {
  return {
    isMongoConnected,
    mode: isMongoConnected ? 'MongoDB (Mongoose)' : 'Local JSON Persistence Adapter'
  };
};

export { isMongoConnected };
