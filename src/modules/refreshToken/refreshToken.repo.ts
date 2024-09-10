import { AbstractRepo } from '@common/abstract';
import { TRefreshToken } from '@common/types';
import RefreshTokenModel from './refreshToken.model';
import { Logger } from '@utils/logger.util';

export class RefreshTokenRepo extends AbstractRepo<TRefreshToken> {
  protected readonly logger: Logger = new Logger();

  constructor() {
    super(RefreshTokenModel);
  }
}
