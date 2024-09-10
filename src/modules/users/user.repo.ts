import { AbstractRepo } from '@common/abstract';
import { TUser } from '@common/types';
import UserModel from './user.model';
import { Logger } from '@utils/logger.util';
import { FilterQuery } from 'mongoose';

export class UserRepo extends AbstractRepo<TUser> {
  protected readonly logger: Logger = new Logger();

  constructor() {
    super(UserModel);
  }

  public findByLogin(filterQuery: FilterQuery<{ login: string }>) {
    const data = this.model.findOne(filterQuery);

    return data;
  }
}
