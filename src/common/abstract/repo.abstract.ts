import { NotFoundException } from '@common/exceptions';
import { Logger } from '@utils/logger.util';
import {
  ClientSession,
  FilterQuery,
  IfAny,
  Model,
  Types,
  UpdateQuery,
} from 'mongoose';

export abstract class AbstractRepo<TDocument> {
  protected abstract readonly logger: Logger;

  constructor(protected readonly model: Model<TDocument>) {}

  async find(filterQuert: FilterQuery<TDocument>) {
    return this.model.find(filterQuert).lean<TDocument[]>(true);
  }

  async findWithOptions<TDocument = any>(
    query: FilterQuery<TDocument>,
    {
      sort,
      skip,
      limit,
    }: { sort: Record<string, 1 | -1>; skip: number; limit: number },
  ) {
    const data = await this.model
      .find(query)
      .skip(skip)
      .sort(sort)
      .limit(limit);
    const total = await this.model.countDocuments(query);

    return { data, total };
  }

  async findOne(filterQuery: FilterQuery<Omit<TDocument, '_id'>>) {
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

  async findById(_id: string) {
    const document = await this.model.findById(_id).lean<TDocument>(true);

    if (!document) {
      this.logger.warn({}, `The document was not found with _id: ${_id}`);
      throw new NotFoundException();
    }

    return document;
  }

  async create(
    document: Omit<TDocument, '_id' | 'createdAt' | 'updatedAt'>,
    session?: ClientSession,
  ) {
    const createdDoument = new this.model({
      ...document,
      _id: new Types.ObjectId(),
    });

    return (
      await createdDoument.save({ session })
    ).toJSON() as unknown as TDocument;
  }

  async createMany(
    documents: Omit<TDocument, '_id' | 'createdAt' | 'updatedAt'>[],
    session?: ClientSession,
  ) {
    return await this.model.insertMany(documents, { session });
  }

  async findOneAndDelete(filterQuery: FilterQuery<TDocument>) {
    return await this.model.findOneAndDelete(filterQuery).lean<TDocument>(true);
  }

  async findOneAndUpdate(
    filterQuery: FilterQuery<TDocument>,
    update: UpdateQuery<TDocument>,
    options?: Record<string, any>,
  ) {
    const document = await this.model
      .findOneAndUpdate(filterQuery, update, options)
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

  async findByIdAndUpdate(
    id: string,
    update: UpdateQuery<TDocument>,
    session?: ClientSession,
  ) {
    const document = await this.model.findByIdAndUpdate(id, update, {
      new: true,
      session,
    });

    if (!document) {
      this.logger.warn({}, `Document with id: ${id} was not updated`);

      return null;
    }

    return document;
  }

  async findByIdAndDelete(id: string, session?: ClientSession) {
    const deletedDocument = await this.model.findByIdAndDelete(id, { session });
    if (!deletedDocument) return false;

    return deletedDocument;
  }

  async deleteMany(
    filterQuery: FilterQuery<TDocument>,
    session?: ClientSession,
  ) {
    return await this.model.deleteMany(filterQuery, { session });
  }
}
