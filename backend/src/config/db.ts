import mongoose from 'mongoose';

const connectDatabase = async (): Promise<void> => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error('MONGO_URI is not defined in environment settings.');
  }

  await mongoose.connect(uri, {
    dbName: 'ehealthcare'
  });

  console.log('MongoDB connected');
};

export default connectDatabase;
