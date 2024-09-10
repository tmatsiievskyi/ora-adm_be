import { NotFoundException } from '@common/exceptions';
import { Logger } from '@utils/logger.util';
import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';

export abstract class AbstractRepo<TDocument> {
  protected abstract readonly logger: Logger;

  constructor(protected readonly model: Model<TDocument>) {}

  async find(filterQuert: FilterQuery<TDocument>) {
    return this.model.find(filterQuert).lean<TDocument[]>(true);
  }

  async findOne(filterQuery: FilterQuery<TDocument>) {
    const document = await this.model
      .findOne(filterQuery)
      .lean<TDocument>(true);

    if (!document) {
      this.logger.warn(
        {},
        `The document was not found with filterQuery ${filterQuery}`,
      );
      throw new NotFoundException();
    }

    return document;
  }

  async create(document: Omit<TDocument, '_id' | 'createdAt' | 'updatedAt'>) {
    const createdDoument = new this.model({
      ...document,
      _id: new Types.ObjectId(),
    });

    return (await createdDoument.save()).toJSON() as unknown as TDocument;
  }

  async findOneAndDelete(filterQuery: FilterQuery<TDocument>) {
    return await this.model.findOneAndDelete(filterQuery);
  }

  async findOneAndUpdate(
    filterQuery: FilterQuery<TDocument>,
    update: UpdateQuery<TDocument>,
  ) {
    const document = await this.model
      .findOneAndUpdate(filterQuery, update, {
        new: true,
      })
      .lean<TDocument>(true);

    if (!document) {
      this.logger.warn(
        {},
        `Document was not found with filter query ${filterQuery}`,
      );
      throw new NotFoundException();
    }

    return document;
  }
}
