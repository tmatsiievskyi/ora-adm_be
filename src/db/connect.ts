import { TConfig, TContainer } from '@common/types';
import mongoose, { ConnectOptions } from 'mongoose';

export const connectToDB = async (
  config: TConfig['db'],
  logger: TContainer['logger'],
) => {
  // const mongoURI = `mongodb://${config.dbUser}:${config.dbPassword}@${config.dbHost}:27017/${config.dbName}`;

  const mongoURI = `mongodb://taras:030922@db:27017`;

  console.log(mongoURI, 1112);
  try {
    await mongoose.connect(mongoURI, {
      replicaSet: 'rs0',
      autoIndex: true,
      autoCreate: true,
      dbName: 'ORA',
    });
    logger.log('DB connected');
  } catch (error) {
    console.log(error);
    logger.error('Could not connect to db');
    process.exit(1);
  }
};
