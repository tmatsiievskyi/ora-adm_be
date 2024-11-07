import { AbstractRepo } from '@common/abstract';
import { TLocal } from '@common/types';
import { Logger } from '@utils/logger.util';
import LocalizationModel from './localization.model';

export class LocalizationRepo extends AbstractRepo<TLocal> {
  protected readonly logger: Logger = new Logger();

  constructor() {
    super(LocalizationModel);
  }
}
