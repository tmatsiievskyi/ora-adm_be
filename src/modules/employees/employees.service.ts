import { TEmployee } from '@common/types';
import { EmployeesRepo } from './employees.repo';
import {
  CreateEmployeeInput,
  FindAllEmployeesInput,
  findAllEmployeesSchema,
  FindByIdEmployeeInput,
  TDeleteByIdEmplyeeInput,
  TUpdateByIdEmployeeInput,
} from './employees.schema';

export class EmployeesService {
  private readonly employeesRepo = new EmployeesRepo();

  public async findAll(reqData: FindAllEmployeesInput['query']) {
    const { page = '1', limit = '10' } = reqData;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    return this.employeesRepo.findWithOptions<TEmployee>(
      {},
      { skip, sort: {}, limit: parseInt(limit) },
    );
  }

  public async findById(data: FindByIdEmployeeInput['params'] | null) {
    return this.employeesRepo.findOne({ _id: data?.id });
  }

  public async create(data: CreateEmployeeInput['body']) {
    return this.employeesRepo.create(data);
  }

  public async removeById(data: TDeleteByIdEmplyeeInput['params']) {
    return this.employeesRepo.findOneAndDelete({ _id: data.id });
  }

  public async update(
    params: TUpdateByIdEmployeeInput['params'],
    body: TUpdateByIdEmployeeInput['body'],
  ) {
    return this.employeesRepo.findOneAndUpdate(
      { _id: params.id },
      { $set: body },
    );
  }
}
