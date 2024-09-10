import { TConfig, TContainer } from '@common/types';
import mongoose from 'mongoose';

export const connectToDB = async (
  config: TConfig['db'],
  logger: TContainer['logger'],
) => {
  try {
    await mongoose.connect(config.dbUrl + '/' + config.dbName);
    logger.log('DB connected');
  } catch (error) {
    logger.error('Could not connect to db');
    process.exit(1);
  }
};
