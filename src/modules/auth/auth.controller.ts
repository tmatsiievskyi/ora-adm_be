import { NotFoundException } from '@common/exceptions';
import {
  EAUTH_ACTIONS,
  IController,
  TConfig,
  TContainer,
  TRequest,
  TReqUrlData,
  TResponse,
} from '@common/types';

class AuthController implements IController {
  constructor(
    private readonly container: TContainer,
    private readonly config: TConfig,
  ) {}

  public async handleRequest(
    req: TRequest,
    res: TResponse,
    parsedUrl: TReqUrlData,
  ) {
    switch (parsedUrl.urlWithMethod) {
      case EAUTH_ACTIONS.SIGN_IN:
        return await this.handleSignIn(req, res, parsedUrl);
      case EAUTH_ACTIONS.SIGN_UP:
        return 'sign-up';
      case EAUTH_ACTIONS.SIGN_OUT:
        return 'sign-out';

      default:
        throw new NotFoundException();
    }
  }

  private async handleSignIn(
    req: TRequest,
    res: TResponse,
    parsedUrl: TReqUrlData,
  ) {
    const parsedReq = await this.container.common.parseReq(req);
    console.log(parsedReq);
    // const parsedData = await this.container.common.parseArgs<{}>(req);

    res.statusCode = 201;
    res.end(this.container.formatter.formatResp({ signIn: 'ok' }, 0));
  }
}

export default AuthController;
