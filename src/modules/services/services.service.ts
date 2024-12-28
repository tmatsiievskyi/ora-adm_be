import { ServiceRepo } from './services.repo';

export class ServiceseService {
  private readonly serviceRepo = new ServiceRepo();

  public async findAll() {
    const res = await this.serviceRepo.find({});

    return res;
  }
}
