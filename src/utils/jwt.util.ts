import { TokenException, TokenExpiredException } from '@common/exceptions';
import { sign, verify, SignOptions, JwtPayload } from 'jsonwebtoken';

export class Jwt {
  public async generateJwt(
    data: Record<string, any>,
    secret: string,
    options?: SignOptions,
  ) {
    try {
      return sign(data, secret, options);
    } catch (error) {
      throw new TokenException();
    }
  }

  public verifyJwt<T>(token: string, secret: string) {
    try {
      const decoded = verify(token, secret) as T;
      return decoded;
    } catch (error) {
      console.log(error);
      throw new TokenExpiredException(); //TODO: check error code
      // if(error && error?.code ===)
    }
  }
}
