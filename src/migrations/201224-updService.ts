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
      const serviceRepo = new ServiceRepo();
      const service = await serviceRepo.findOne({ name: 'vertebrologist' });
      const subServicesId = (
        await subServiceRepo.find({ category: 'vertebrologist' })
      ).map((item) => item._id);

      console.log(service, subServicesId);

      await serviceRepo.findByIdAndUpdate(
        String(service._id),
        {
          subServices: subServicesId,
          $unset: { subService: 1 },
        },
        session,
      );

      for (const subService of subServicesId) {
        const data = await subServiceRepo.findByIdAndUpdate(
          String(subService),
          { $set: { service: service._id }, $unset: { category: 1 } },
        );
      }

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
