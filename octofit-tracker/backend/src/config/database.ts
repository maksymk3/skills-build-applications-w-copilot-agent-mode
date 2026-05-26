import mongoose from 'mongoose';

const defaultMongoUri = 'mongodb://127.0.0.1:27017/octofit_db';

export const getMongoUri = (): string => process.env.MONGODB_URI || defaultMongoUri;

export const connectDatabase = async (): Promise<void> => {
  mongoose.set('strictQuery', true);
  mongoose.set('bufferCommands', false);

  const mongoUri = getMongoUri();
  await mongoose.connect(mongoUri);
  console.log(`MongoDB connected to ${mongoUri}`);
};

export const disconnectDatabase = async (): Promise<void> => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
};
