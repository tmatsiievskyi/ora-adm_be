import { TContainer, TUser } from '@common/types';
import { UserRepo } from './user.repo';
import { CreateUserInput } from '../auth';

export class UserService {
  constructor(private readonly container: TContainer) {}

  private userRepo: UserRepo = new UserRepo();

  public async findAll() {
    const data = await this.userRepo.find({});

    return data;
  }

  public async findByLogin({ login }: { login: string }) {
    const data = await this.userRepo.findByLogin({ login });

    return data;
  }

  public async createUser(data: CreateUserInput['body']) {
    const createdUser = await this.userRepo.create(data);

    return this.container.common.removeFromObj(createdUser, ['password']);
  }
}
