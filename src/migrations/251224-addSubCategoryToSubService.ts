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

      const dentConsult = [
        '66661db14c6fc489c2abff87',
        '66661ea34c6fc489c2abff91',
        '66661ed34c6fc489c2abff95',
        '66661efb4c6fc489c2abff97',
        '66661f0e4c6fc489c2abff99',
      ];

      const updatedSubservices = await subServiceRepo.updateMany(
        { _id: { $in: dentConsult } },
        { subCategory: 'subCategory.dentist.impl' },
      );

      console.log(updatedSubservices);

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
