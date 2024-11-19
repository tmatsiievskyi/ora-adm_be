import { TFilterQuery, TLocal, TSubservice } from '@common/types';
import { SubservoceRepo } from './subservices.repo';
import { TFindAllSubservicesInput } from './subservices.schema';
import { LocalizationRepo } from '../localization/localization.repo';
import mongoose from 'mongoose';
import { BadRequest } from '@common/exceptions';

export class SubServiceService {
  private readonly subServiceRepo = new SubservoceRepo();
  private readonly localizationRepo = new LocalizationRepo();

  public async findAll(reqData: TFindAllSubservicesInput['query']) {
    const {
      search,
      page = '1',
      limit = '10',
      sortField = 'category',
      sortOrder = 'asc',
      lng = 'uk-UA',
    } = reqData;

    let query: TFilterQuery<TSubservice> = {
      $nor: [
        { category: 'сonsultations' },
        { category: 'analyses' },
        { category: 'examination' },
      ],
    };
    if (search) {
      const localizations = await this.localizationRepo.find({
        lng,
        value: { $regex: search, $options: 'i' },
      });

      const keys = localizations.map((loc) => loc.key);
      query = {
        ...query,
        $or: [
          { label: { $in: keys } },
          { category: { $in: keys } },
          { searchTags: { $in: keys } },
        ],
      };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOrd = sortOrder === 'asc' ? 1 : -1;
    const sort: Record<any, any> = {
      category: 1,
      [sortField]: sortOrd,
      index: 1,
    };

    const { data, total } = await this.subServiceRepo.findWithOptions(query, {
      sort,
      skip,
      limit: parseInt(limit),
    });

    const categoryKeys = [...new Set(data.map((subs) => subs.category))];
    const groupedSubservices = categoryKeys.reduce(
      (acc, category) => {
        const categorySubservices = data.filter(
          (item) => item.category === category,
        );
        acc[category] = categorySubservices;
        return acc;
      },
      {} as Record<string, TSubservice[]>,
    );

    return {
      data: groupedSubservices,
      total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
    };
  }

  public async create(
    data: Omit<TSubservice, '_id' | 'createdAt' | 'updatedAt'>,
    localization: TLocal[],
  ) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const createdSubservice = this.subServiceRepo.create(data, session);
      await this.localizationRepo.createMany(localization, session);
      await session.commitTransaction();
      return createdSubservice;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  public async updateSubserviceById(
    id: string,
    data: { subservice: Partial<TSubservice>; localization: TLocal[] },
    lng?: string,
  ) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const updatedSubservice = await this.localizationRepo.findByIdAndUpdate(
        id,
        data,
        session,
      );

      if (!updatedSubservice) {
        session.abortTransaction();
        return null;
      }

      for (const local of data.localization) {
        await this.localizationRepo.findOneAndUpdate(
          { key: local.key, lng: local.lng },
          { $set: { value: local.value } },
          { upsert: true, session },
        );
      }

      await session.commitTransaction();
      return updatedSubservice;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  public async updateSubservicePrice(id: string, price: number) {
    return await this.subServiceRepo.findByIdAndUpdate(id, { price });
  }

  public async deleteSubservice(id: string) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const deletedSubservice = await this.subServiceRepo.findByIdAndDelete(
        id,
        session,
      );

      if (!deletedSubservice) {
        await session.abortTransaction();
        return false;
      }

      await this.localizationRepo.deleteMany(
        {
          key: { $in: [deletedSubservice.label] },
        },
        session,
      );

      await session.commitTransaction();
      return deletedSubservice;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  public async findSubserviceById(id: string) {
    const subservice = await this.subServiceRepo.findById(id);

    if (!subservice) return false;
    return subservice;
  }
}
