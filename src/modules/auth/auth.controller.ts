import { NotFoundException } from '@common/exceptions';
import {
  EAUTH_ACTIONS,
  IController,
  TConfig,
  TContainer,
  TReqUrlData,
} from '@common/types';

class AuthController implements IController {
  constructor(
    private readonly container: TContainer,
    private readonly config: TConfig,
  ) {}

  public async handleRequest(parsedUrl: TReqUrlData) {
    switch (parsedUrl.urlWithMethod) {
      case EAUTH_ACTIONS.SIGN_IN:
        return 'sign-in';
      case EAUTH_ACTIONS.SIGN_UP:
        return 'sign-up';
      case EAUTH_ACTIONS.SIGN_OUT:
        return 'sign-out';

      default:
        throw new NotFoundException();
    }
  }
}

export default AuthController;
