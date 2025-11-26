import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Allow a default local MongoDB URI for development
    const mongoUri = process.env.MONGO_URI ||
      (process.env.NODE_ENV === 'production' ? null : 'mongodb://127.0.0.1:27017');

    if (!mongoUri) {
      throw new Error('Missing MONGO_URI environment variable');
    }

    if (process.env.NODE_ENV !== 'production') {
      console.log('DEBUG — Using MongoDB URI:', mongoUri);
    }

    const connection = await mongoose.connect(mongoUri, {
      dbName: process.env.MONGO_DB_NAME || 'employee_task_management',
    });

    console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

export default connectDB;
