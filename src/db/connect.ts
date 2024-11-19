import { TConfig, TContainer } from '@common/types';
import mongoose, { ConnectOptions } from 'mongoose';

export const connectToDB = async (
  config: TConfig['db'],
  logger: TContainer['logger'],
) => {
  const mongoURI = `mongodb://${config.dbHost}`;

  try {
    await mongoose.connect(mongoURI, {
      replicaSet: 'rs0',
      dbName: `${config.dbName}`,
    });
    logger.log('DB connected');
  } catch (error) {
    console.log(error);
    logger.error('Could not connect to db');
    process.exit(1);
  }
};
