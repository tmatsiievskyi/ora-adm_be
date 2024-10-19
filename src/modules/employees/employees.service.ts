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

  public async findAll(data: FindAllEmployeesInput['query'] | null) {
    if (!data) return this.employeesRepo.find({});

    return this.employeesRepo.findWithPagination<TEmployee>(
      Number(data?.page),
      Number(data?.pageSize),
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
