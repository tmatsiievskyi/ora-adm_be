import { SubserviceRepo } from 'src/modules/subservices/subservices.repo';
import { getDb } from '../migrations-util/db';
import mongoose from 'mongoose';
import { ServiceRepo } from 'src/modules/services/services.repo';

const migrations = {
  async up() {
    await getDb();
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const subServiceRepo = new SubserviceRepo();

      const updatedSubservices = await subServiceRepo.updateMany(
        { priceSuffix: { $in: null } },
        { priceSuffix: 'common.currency.grn' },
      );

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
