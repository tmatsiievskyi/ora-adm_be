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

  public async handleRequest(
    req: TRequest,
    res: TResponse,
    parsedUrl: TReqUrlData,
  ) {
    return undefined;
    // const asd = await this.handleSignUp(req, res, parsedUrl);
    // switch (parsedUrl.urlWithMethod) {
    //   // case EAUTH_ACTIONS.SIGN_IN:
    //   //   return await this.handleSignIn(req, res, parsedUrl);
    //   case EAUTH_ACTIONS.SIGN_UP:
    //     return await this.handleSignUp(req, res, parsedUrl);
    //   // case EAUTH_ACTIONS.SIGN_OUT:
    //   //   return 'sign-out';

    //   default:
    //     throw new NotFoundException();
    // }
  }
}

export default UserController;
