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

  public async handleRequest(req: TRequest, res: TResponse) {
    const parsedUrl = this.container.common.parseURL(req.url, req.method);

    switch (true) {
      case this.container.common.checkUrlToEnum(
        EAUTH_ACTIONS.OPTIONS_SIGN_UP,
        parsedUrl?.methodWithHref,
      ):
      case this.container.common.checkUrlToEnum(
        EAUTH_ACTIONS.OPTIONS_SIGN_IN,
        parsedUrl?.methodWithHref,
      ):
      case this.container.common.checkUrlToEnum(
        EAUTH_ACTIONS.OPTIONS_REFRESH,
        parsedUrl?.methodWithHref,
      ):
      case this.container.common.checkUrlToEnum(
        EAUTH_ACTIONS.OPTIONS_SIGN_OUT,
        parsedUrl?.methodWithHref,
      ): {
        return {
          data: {},
          status: EHttpStatusCode.OK,
          message: EMessageCode.OK,
        };
      }

      case this.container.common.checkUrlToEnum(
        EAUTH_ACTIONS.SIGN_IN,
        parsedUrl?.methodWithHref,
      ): {
        return await this.handleSignIn(req, res);
      }

      case this.container.common.checkUrlToEnum(
        EAUTH_ACTIONS.SIGN_UP,
        parsedUrl?.methodWithHref,
      ): {
        return await this.handleSignUp(req, res);
      }

      case this.container.common.checkUrlToEnum(
        EAUTH_ACTIONS.SIGN_OUT,
        parsedUrl?.methodWithHref,
      ): {
        return await this.handleSignOut(req, res);
      }

      case this.container.common.checkUrlToEnum(
        EAUTH_ACTIONS.REFRESH,
        parsedUrl?.methodWithHref,
      ): {
        return await this.handleRefresh(req, res);
      }

      default:
        throw new NotFoundException();
    }
  }

  private async handleSignIn(
    req: TRequest,
    res: TResponse,
  ): Promise<TControllerMethodResult> {
    const parsedReq =
      await this.container.common.parseReq<LoginUserInput['body']>(req);
    this.container.validate.validateReq(parsedReq, loginUserSchema);
    if (!parsedReq.body) {
      throw new BadRequest();
    }
    const {
      tokens: [accessToken, refreshToken],
      user,
    } = await this.authService.handleSignIn(parsedReq.body);
    // const accessTokenCookie = this.container.cookie.set(
    //   'accessToken',
    //   accessToken,
    //   {
    //     Expires: this.config.tokens.access.expires,
    //     path: '/api',
    //     HttpOnly: true,
    //     sameSite: 'lax',
    //   },
    // );
    // const refreshTokenCookie = this.container.cookie.set(
    //   'refreshToken',
    //   refreshToken,
    //   {
    //     Expires: this.config.tokens.refresh.expires,
    //     path: '/api',
    //     HttpOnly: true,
    //     sameSite: 'lax',
    //   },
    // );
    // const loggedInCookie = this.container.cookie.set('loggedIn', 'true', {
    //   Expires: this.config.tokens.access.expires,
    //   path: '/api',
    // });
    // res.setHeader('Set-Cookie', [
    //   accessTokenCookie,
    //   refreshTokenCookie,
    //   loggedInCookie,
    // ]);

    const refreshTokenInDB = await this.refreshTokenService.findOneBy({
      login: parsedReq.body.login,
    });

    if (refreshTokenInDB) {
      await this.refreshTokenService.update(
        { login: parsedReq.body.login },
        { login: parsedReq.body.login, token: refreshToken },
      );
    } else {
      await this.refreshTokenService.save({
        login: parsedReq.body.login,
        token: refreshToken,
      });
    }

    this.container.logger.log(
      `User with login: ${parsedReq.body.login} just logged in`,
    );
    return {
      data: { user, tokens: { accessToken, refreshToken } },
      status: EHttpStatusCode.OK,
      message: EMessageCode.OK,
    };
  }

  private async handleSignUp(
    req: TRequest,
    res: TResponse,
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
  ): Promise<TControllerMethodResult> {
    const cookieData = this.container.cookie.get(req.headers.cookie);
    const {
      data: { login },
    } = await this.container.validate.validateAuth(req, this.config.tokens);

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

  private async handleRefresh(req: TRequest, res: TResponse) {
    const cookieData = this.container.cookie.get(req.headers.cookie);
    const token = this.container.validate.parseHeadersAuthToken(req);
    const {
      data: { login, _id },
    } = this.container.validate.validateRefreshToken(token, this.config.tokens);
    await this.refreshTokenService.findOneBy({
      login,
    });

    const [accessToken, refreshToken] =
      await this.authService.generateAuthTokens({ login, _id });

    // const accessTokenCookie = this.container.cookie.set(
    //   'accessToken',
    //   accessToken,
    //   {
    //     Expires: this.config.tokens.access.expires,
    //     path: '/api',
    //     HttpOnly: true,
    //     sameSite: 'lax',
    //   },
    // );
    // const refreshTokenCookie = this.container.cookie.set(
    //   'refreshToken',
    //   refreshToken,
    //   {
    //     Expires: this.config.tokens.refresh.expires,
    //     path: '/api',
    //     HttpOnly: true,
    //     sameSite: 'lax',
    //   },
    // );
    // const loggedInCookie = this.container.cookie.set('loggedIn', 'true', {
    //   Expires: this.config.tokens.access.expires,
    //   path: '/api',
    // });

    await this.refreshTokenService.update(
      { login },
      { login, token: refreshToken },
    );

    // res.setHeader('Set-Cookie', [
    //   accessTokenCookie,
    //   refreshTokenCookie,
    //   loggedInCookie,
    // ]);

    return {
      data: { tokens: { accessToken, refreshToken } },
      status: EHttpStatusCode.OK,
      message: EMessageCode.OK,
    };
  }
}

export default AuthController;
