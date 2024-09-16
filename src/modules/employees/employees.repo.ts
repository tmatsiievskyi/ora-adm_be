import { AbstractRepo } from '@common/abstract';
import { TEmployee } from '@common/types';
import { Logger } from '@utils/logger.util';
import EmployeeModel from './employee.model';

export class EmployeesRepo extends AbstractRepo<TEmployee> {
  protected readonly logger: Logger = new Logger();

  constructor() {
    super(EmployeeModel);
  }
}
