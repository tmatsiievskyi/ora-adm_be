import {
  AccessTokenMissingException,
  AuthException,
  HttpException,
} from '@common/exceptions';
import { AnyZodObject } from 'zod';
import { Jwt } from './jwt.util';
import {
  TAcessTokenPayload,
  TConfig,
  TRefreshTokenPayload,
  TRequest,
} from '@common/types';

export class Validate {
  private readonly jwt = new Jwt();

  public validateReq(parsedReq: any, schema: AnyZodObject) {
    try {
      schema.parse({
        body: parsedReq.body,
        query: parsedReq.queryParams,
        params: parsedReq.reqParams,
      });
    } catch (e: any) {
      throw new HttpException({ statusCode: 400, message: e });
    }
  }

  public async validateAuth(req: TRequest, config: TConfig['tokens']) {
    // if (!('accessToken' in data) && !('refreshToken' in data)) {
    //   throw new AuthException();
    // }
    // if (!('accessToken' in data) && 'refreshToken' in data) {
    //   throw new AccessTokenMissingException();
    // }
    // return this.jwt.verifyJwt<TAcessTokenPayload>(
    //   data.accessToken,
    //   config.access.secret,
    // );

    const authToken = this.parseHeadersAuthToken(req);
    if (!authToken) throw new AuthException();

    const data = this.readToken(authToken, config);

    return data;
  }

  public parseHeadersAuthToken(req: TRequest) {
    let foundedToken: string | null = null;

    console.log(req.headers.authorization);

    if (req && req.headers && req.headers.authorization) {
      const parts = req.headers.authorization.split(' ');
      if (parts.length === 2) {
        const scheme: string = parts[0];
        const credentials: string = parts[1];

        if (/^Bearer:$/i.test(scheme)) {
          foundedToken = credentials;
        }
      }
    }

    return foundedToken;
  }

  public readToken(token: string, config: TConfig['tokens']) {
    return this.jwt.verifyJwt<TAcessTokenPayload>(token, config.access.secret);
  }

  public validateRefreshToken(token: string | null, config: TConfig['tokens']) {
    if (!token) throw new AuthException();

    return this.jwt.verifyJwt<TRefreshTokenPayload>(
      token,
      config.refresh.secret,
    );
  }
}
