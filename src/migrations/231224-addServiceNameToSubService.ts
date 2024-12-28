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
      const allSubServices = await subServiceRepo.find({});

      for (const subService of allSubServices) {
        const service = subService.service
          ? await serviceRepo.findById(subService.service.toString())
          : null;
        const data = await subServiceRepo.findByIdAndUpdate(
          String(subService._id),
          {
            $set: { serviceName: service ? service.name : subService.category },
          },
          session,
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
