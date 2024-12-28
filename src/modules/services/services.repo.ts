import { AbstractRepo } from '@common/abstract';
import { TService } from '@common/types';
import ServiceModel from './services.model';
import { Logger } from '@utils/logger.util';

export class ServiceRepo extends AbstractRepo<TService> {
  protected readonly logger: Logger = new Logger();

  constructor() {
    super(ServiceModel);
  }
}
