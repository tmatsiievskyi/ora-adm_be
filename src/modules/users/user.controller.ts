import {
  IController,
  TConfig,
  TContainer,
  TRequest,
  TReqUrlData,
  TResponse,
} from '@common/types';
import { UserService } from './user.service';

class UserController implements IController {
  private userService: UserService;

  constructor(
    private readonly container: TContainer,
    private readonly config: TConfig,
  ) {
    this.userService = new UserService(this.container);
  }

  public async handleRequest(req: TRequest, res: TResponse) {
    return undefined;
  }
}

export default UserController;
