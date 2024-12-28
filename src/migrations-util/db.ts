import mongoose from 'mongoose';

const mongoURI = `mongodb://${process.env.MONGO_HOST}`;

export const getDb = async () => {
  const client = await mongoose.connect(mongoURI, {
    replicaSet: 'rs0',
    dbName: `${process.env.MONGO_INITDB_DATABASE}`,
  });
  return client;
};
