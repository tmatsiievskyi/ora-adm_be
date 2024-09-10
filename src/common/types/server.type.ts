import { Common } from '@utils/common.util';
import { FileService } from '@utils/file.util';
import { Formatter } from '@utils/formatter.util';
import { IncomingMessage, ServerResponse } from 'http';
import { EHttpStatusCode, EMessageCode } from './http.type';
import { Logger } from '@utils/logger.util';
import { UserService } from 'src/modules/users/user.service';
import { AuthService } from 'src/modules/auth/auth.service';
import { Validate } from '@utils/validate.util';
import { Crypting } from '@utils/crypting.util';
import { Jwt } from '@utils/jwt.util';
import { Cookie } from '@utils/cookie.util';

export type TRequest = IncomingMessage;
export type TResponse = ServerResponse;
export type TReqUrlData = {
  name: string;
  action?: string;
  id?: string;
  query?: URLSearchParams;
  method: string | undefined;
  url: string;
  urlWithMethod: string;
};
export type TApiException = {
  message: TExceptionMessage;
  messageCode: EMessageCode;
  statusCode: EHttpStatusCode;
};
export type TApiResponse<T> = {
  data: T | null;
  meta: Record<string, any> | null;
  errors: string[] | null;
  message: string | null;
};

export type TExceptionMessage = string | Record<string, string>[];

export type TContainer = {
  fileService: FileService;
  formatter: Formatter;
  common: Common;
  logger: Logger;
  validate: Validate;
  crypting: Crypting;
  jwt: Jwt;
  cookie: Cookie;
};

export type TLocalFilesToFind = {
  path: string;
  suffix: string;
};

export type TCookieOptions = {
  Expires?: number | string;
  path?: string;
  domain?: string;
  Secure?: boolean;
  HttpOnly?: boolean;
};

export type TAcessTokenPayload = {
  login: string;
  type: 'access';
};

export type TRefreshTokenPayload = {
  login: string;
  type: 'refresh';
};
