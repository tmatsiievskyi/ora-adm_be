import { SubserviceRepo } from 'src/modules/subservices/subservices.repo';
import { getDb } from '../migrations-util/db';
import mongoose from 'mongoose';

const migrations = {
  async up() {
    await getDb();
    const session = await mongoose.startSession();
    session.startTransaction();

    const options = {
      pre: { pricePrefix: 'common.pre' },
      arc: { archived: true },
      suf: { priceSuffix: 'common.currency.euro' },
      sufD: { priceSuffix: 'common.currency.usd' },
    };

    try {
      const subServiceRepo = new SubserviceRepo();

      const result = await subServiceRepo.findByIdAndUpdate(
        '66661a454c6fc489c2abff65',
        options.sufD,
      );
      console.log(result);

      await session.commitTransaction();
    } catch (error) {
      console.log(error);
      session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }

    return 'ok';
  },
  down() {},
};

const runMigration = async () => {
  const functionName = process.env.FUNCTION_NAME;

  if (!functionName || !(functionName in migrations)) {
    console.error(`Migration function ${functionName} not found.`);
    process.exit(1);
  }

  console.log(`Running migration function: ${functionName}`);
  await migrations[functionName as keyof typeof migrations]();
  console.log('Migration completed');
  process.exit(0);
};

runMigration();
