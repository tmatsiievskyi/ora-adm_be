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
} from '@common/types';

export class Validate {
  private readonly jwt = new Jwt();

  public validateReq(parsedReq: any, schema: AnyZodObject) {
    try {
      schema.parse({
        body: parsedReq.body,
        query: parsedReq.parsedURL?.query,
        params: parsedReq.params,
      });
    } catch (e: any) {
      throw new HttpException({ statusCode: 401, message: e });
    }
  }

  public async validateAuth(
    data: Record<string, string>,
    config: TConfig['tokens'],
  ) {
    if (!('accessToken' in data || !('refreshToken' in data))) {
      throw new AuthException();
    }

    if (!('accessToken' in data) && 'refreshToken' in data) {
      throw new AccessTokenMissingException();
    }

    return this.jwt.verifyJwt<TAcessTokenPayload>(
      data.accessToken,
      config.access.secret,
    );
  }

  public validateRefreshToken(
    data: Record<string, string>,
    config: TConfig['tokens'],
  ) {
    if (!('refreshToken' in data)) {
      throw new AuthException();
    }
    return this.jwt.verifyJwt<TRefreshTokenPayload>(
      data.refreshToken,
      config.refresh.secret,
    );
  }
}
