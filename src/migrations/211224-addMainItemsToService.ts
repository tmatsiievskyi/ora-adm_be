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
      const serviceRepo = new ServiceRepo();
      const service = await serviceRepo.findOne({ name: 'dentist' });
      const mainItemsLocKeys = [
        'service.dentist.mainItems.napr',
        'service.dentist.mainItems.prof',
        'service.dentist.mainItems.white',
        'service.dentist.mainItems.unpain',
        'service.dentist.mainItems.child',
        'service.dentist.mainItems.terap',
        'service.dentist.mainItems.korin',
        'service.dentist.mainItems.orto',
        'service.dentist.mainItems.ortoDont',
        'service.dentist.mainItems.fixMet',
        'service.dentist.mainItems.fixCer',
        'service.dentist.mainItems.surger',
        'service.dentist.mainItems.impl',
      ];

      await serviceRepo.findByIdAndUpdate(
        String(service._id),
        {
          mainItems: mainItemsLocKeys,
        },
        session,
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
