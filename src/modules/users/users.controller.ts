import {
  EHttpStatusCode,
  EMessageCode,
  EUSER_ACTIONS,
  IController,
  TConfig,
  TContainer,
  TControllerMethodResult,
  TRequest,
  TReqUrlData,
  TResponse,
} from '@common/types';
import { UserService } from './users.service';
import { NotFoundException } from '@common/exceptions';

class UserController implements IController {
  private userService: UserService;

  constructor(
    private readonly container: TContainer,
    private readonly config: TConfig,
  ) {
    this.userService = new UserService(this.container);
  }

  public async handleRequest(req: TRequest, res: TResponse) {
    const parsedUrl = this.container.common.parseURL(req.url, req.method);

    switch (true) {
      case this.container.common.checkUrlToEnum(
        EUSER_ACTIONS.OPTIONS_ME,
        parsedUrl?.methodWithHref,
      ): {
        return {
          data: {},
          status: EHttpStatusCode.OK,
          message: EMessageCode.OK,
        };
      }
      case this.container.common.checkUrlToEnum(
        EUSER_ACTIONS.ME,
        parsedUrl?.methodWithHref,
      ): {
        return await this.getMe(req, res);
      }

      default:
        throw new NotFoundException();
    }
  }

  private async getMe(
    req: TRequest,
    res: TResponse,
  ): Promise<TControllerMethodResult> {
    const cookieData = this.container.cookie.get(req.headers.cookie);

    const parsedToken = await this.container.validate.validateAuth(
      req,
      this.config.tokens,
    );

    console.log(parsedToken.data._id);

    const userData = await this.userService.findOneById(parsedToken.data._id);

    return {
      data: userData,
      status: EHttpStatusCode.OK,
      message: EMessageCode.OK,
    };
  }
}

export default UserController;
