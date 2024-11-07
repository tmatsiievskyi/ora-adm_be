import { NotFoundException } from '@common/exceptions';
import { Logger } from '@utils/logger.util';
import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';

export abstract class AbstractRepo<TDocument> {
  protected abstract readonly logger: Logger;

  constructor(protected readonly model: Model<TDocument>) {}

  async find(filterQuert: FilterQuery<TDocument>) {
    const result = await this.model.find(filterQuert).lean<TDocument[]>(true);

    if (!result.length) throw new NotFoundException();

    return result;
  }

  async findWithPagination<TDocument = any>(
    page: number,
    pageSize: number,
  ): Promise<TDocument[]> {
    return this.model.aggregate([
      {
        $facet: {
          metadata: [{ $count: 'totalCount' }],
          items: [{ $skip: (page - 1) * pageSize }, { $limit: pageSize }],
        },
      },
    ]);
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

  async create(document: Omit<TDocument, '_id' | 'createdAt' | 'updatedAt'>) {
    const createdDoument = new this.model({
      ...document,
      _id: new Types.ObjectId(),
    });

    return (await createdDoument.save()).toJSON() as unknown as TDocument;
  }

  async createMany(
    documents: Omit<TDocument, '_id' | 'createdAt' | 'updatedAt'>[],
  ) {
    const data = await this.model.insertMany(documents);
  }

  async findOneAndDelete(filterQuery: FilterQuery<TDocument>) {
    return await this.model.findOneAndDelete(filterQuery).lean<TDocument>(true);
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

  async deleteMany(filterQuery: FilterQuery<TDocument>) {
    return await this.model.deleteMany(filterQuery);
  }
}
