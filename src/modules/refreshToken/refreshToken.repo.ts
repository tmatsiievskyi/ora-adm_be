import { AbstractRepo } from '@common/abstract';
import { TRefreshToken } from '@common/types';
import RefreshTokenModel from './refreshToken.model';
import { Logger } from '@utils/logger.util';
import { FilterQuery } from 'mongoose';

export class RefreshTokenRepo extends AbstractRepo<TRefreshToken> {
  protected readonly logger: Logger = new Logger();

  constructor() {
    super(RefreshTokenModel);
  }

  findOneByLogin(filterQuery: FilterQuery<TRefreshToken>) {
    const data = this.model.findOne(filterQuery);

    return data;
  }
}
