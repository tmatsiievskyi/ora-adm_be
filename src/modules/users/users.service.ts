import { TContainer, TUser } from '@common/types';
import { UserRepo } from './users.repo';
import { CreateUserInput } from '../auth';

export class UserService {
  constructor(private readonly container: TContainer) {}

  private userRepo: UserRepo = new UserRepo();

  public async findAll() {
    const data = await this.userRepo.find({});

    return data;
  }

  public async createUser(data: CreateUserInput['body']) {
    const createdUser = await this.userRepo.create({
      ...data,
      isVerified: false,
    });

    return this.container.common.removeFromObj(createdUser, ['password']);
  }

  public async findByLogin({ login }: { login: string }) {
    const data = await this.userRepo.findByLogin({ login });

    return data;
  }

  public async findOneBy(data: Partial<TUser>) {
    return await this.userRepo.findOne(data);
  }

  public async findOneById(_id: string) {
    return this.container.common.removeFromObj(
      await this.userRepo.findById(_id),
      ['password'],
    );
  }
}
