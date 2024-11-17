import { TConfig, TContainer } from '@common/types';
import mongoose from 'mongoose';

export const connectToDB = async (
  config: TConfig['db'],
  logger: TContainer['logger'],
) => {
  try {
    await mongoose.connect(
      `mongodb://${config.dbUser}:${config.dbPassword}@${config.dbHost}:27017/${config.dbName}`,
    );
    logger.log('DB connected');
  } catch (error) {
    console.log(error);
    logger.error('Could not connect to db');
    process.exit(1);
  }
};
