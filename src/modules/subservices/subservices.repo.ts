import { AbstractRepo } from '@common/abstract';
import { TSubservice } from '@common/types';
import { Logger } from '@utils/logger.util';
import SubserviceModel from './subservices.model';

export class SubserviceRepo extends AbstractRepo<TSubservice> {
  protected readonly logger: Logger = new Logger();

  constructor() {
    super(SubserviceModel);
  }
}
