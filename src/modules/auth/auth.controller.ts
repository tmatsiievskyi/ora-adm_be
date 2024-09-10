import { BadRequest, NotFoundException } from '@common/exceptions';
import {
  EAUTH_ACTIONS,
  EHttpStatusCode,
  EMessageCode,
  IController,
  TConfig,
  TContainer,
  TControllerMethodResult,
  TRequest,
  TReqUrlData,
  TResponse,
} from '@common/types';
import {
  createUserSchema,
  CreateUserInput,
  LoginUserInput,
  loginUserSchema,
} from '../auth/auth.schema';
import { AuthService } from './auth.service';
import { UserService } from '../users';
import { RefreshTokenService } from '../refreshToken/refreshToken.service';

class AuthController implements IController {
  private readonly authService: AuthService;
  private readonly refreshTokenService: RefreshTokenService;

  constructor(
    private readonly container: TContainer,
    private readonly config: TConfig,
  ) {
    this.authService = new AuthService(this.container, this.config.tokens);
    this.refreshTokenService = new RefreshTokenService();
  }

  public async handleRequest(
    req: TRequest,
    res: TResponse,
    parsedUrl: TReqUrlData,
  ) {
    switch (parsedUrl.urlWithMethod) {
      case EAUTH_ACTIONS.SIGN_IN:
        return await this.handleSignIn(req, res, parsedUrl);
      case EAUTH_ACTIONS.SIGN_UP:
        return await this.handleSignUp(req, res, parsedUrl);
      case EAUTH_ACTIONS.SIGN_OUT:
        return await this.handleSignOut(req, res, parsedUrl);
      case EAUTH_ACTIONS.REFRESH:
        return await this.handleRefresh(req, res, parsedUrl);

      default:
        throw new NotFoundException();
    }
  }

  private async handleSignIn(
    req: TRequest,
    res: TResponse,
    parsedUrl: TReqUrlData,
  ): Promise<TControllerMethodResult> {
    const parsedReq =
      await this.container.common.parseReq<LoginUserInput['body']>(req);
    this.container.validate.validateReq(parsedReq, loginUserSchema);
    if (!parsedReq.body) {
      throw new BadRequest();
    }
    const [accessToken, refreshToken] = await this.authService.handleSignIn(
      parsedReq.body,
    );
    const accessTokenCookie = this.container.cookie.set(
      'accessToken',
      accessToken,
      {
        Expires: this.config.tokens.access.expires,
        HttpOnly: true,
      },
    );
    const refreshTokenCookie = this.container.cookie.set(
      'refreshToken',
      refreshToken,
      {
        Expires: this.config.tokens.refresh.expires,
        HttpOnly: true,
      },
    );
    const loggedInCookie = this.container.cookie.set('loggedIn', 'true', {
      Expires: this.config.tokens.access.expires,
    });
    res.setHeader('Set-Cookie', [
      accessTokenCookie,
      refreshTokenCookie,
      loggedInCookie,
    ]);
    await this.refreshTokenService.save({
      login: parsedReq.body.login,
      token: refreshToken,
    });
    this.container.logger.log(
      `User with login: ${parsedReq.body.login} just logged in`,
    );
    return {
      data: 'ok',
      status: EHttpStatusCode.OK,
      message: EMessageCode.OK,
    };
  }

  private async handleSignUp(
    req: TRequest,
    res: TResponse,
    parsedUrl: TReqUrlData,
  ): Promise<TControllerMethodResult> {
    const parsedReq =
      await this.container.common.parseReq<CreateUserInput['body']>(req);
    if (!parsedReq.body) {
      throw new BadRequest();
    }
    this.container.validate.validateReq(parsedReq, createUserSchema);
    const result = await this.authService.handleSignUp(parsedReq.body);

    this.container.logger.log(
      `Created user with login: ${parsedReq.body.login}`,
    );

    return {
      data: result,
      status: EHttpStatusCode.CREATED,
      message: EMessageCode.OK,
    };
  }

  private async handleSignOut(
    req: TRequest,
    res: TResponse,
    parsedUrl: TReqUrlData,
  ): Promise<TControllerMethodResult> {
    const cookieData = this.container.cookie.get(req.headers.cookie);
    const { login } = await this.container.validate.validateAuth(
      cookieData,
      this.config.tokens,
    );

    await this.refreshTokenService.delete({ login });

    const accessTokenCookie = this.container.cookie.delete('accessToken');
    const refreshTokenCookie = this.container.cookie.delete('refreshToken');
    const loggedInCookie = this.container.cookie.delete('loggedIn');

    res.setHeader('Set-Cookie', [
      accessTokenCookie,
      refreshTokenCookie,
      loggedInCookie,
    ]);

    this.container.logger.log(`User with login: ${login} just logged out`);

    return {
      data: 'ok',
      status: EHttpStatusCode.OK,
      message: EMessageCode.OK,
    };
  }

  private async handleRefresh(
    req: TRequest,
    res: TResponse,
    parsedUrl: TReqUrlData,
  ) {
    const cookieData = this.container.cookie.get(req.headers.cookie);
    const { login } = this.container.validate.validateRefreshToken(
      cookieData,
      this.config.tokens,
    );
    await this.refreshTokenService.findOneBy({
      login,
    });

    const [accessToken, refreshToken] =
      await this.authService.generateAuthTokens(login);

    const accessTokenCookie = this.container.cookie.set(
      'accessToken',
      accessToken,
      {
        Expires: this.config.tokens.access.expires,
        HttpOnly: true,
      },
    );
    const refreshTokenCookie = this.container.cookie.set(
      'refreshToken',
      refreshToken,
      {
        Expires: this.config.tokens.refresh.expires,
        HttpOnly: true,
      },
    );
    const loggedInCookie = this.container.cookie.set('loggedIn', 'true', {
      Expires: this.config.tokens.access.expires,
    });

    await this.refreshTokenService.update(
      { login },
      { login, token: refreshToken },
    );

    res.setHeader('Set-Cookie', [
      accessTokenCookie,
      refreshTokenCookie,
      loggedInCookie,
    ]);

    return {
      data: 'ok',
      status: EHttpStatusCode.OK,
      message: EMessageCode.OK,
    };
  }
}

export default AuthController;
