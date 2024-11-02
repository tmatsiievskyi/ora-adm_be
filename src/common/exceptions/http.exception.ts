import {
  EHttpStatusCode,
  EMessageCode,
  TApiException,
  TExceptionMessage,
} from '@common/types';

export class HttpException extends Error {
  readonly message: string | object | any;
  readonly messageCode: EMessageCode;
  readonly statusCode: EHttpStatusCode;

  constructor(param?: Partial<TApiException>) {
    super();

    this.message =
      param?.message ||
      'The server encountered an error while processing the request.';
    this.messageCode = param?.messageCode || EMessageCode.INTERNAL_SERVER_ERROR;
    this.statusCode =
      param?.statusCode || EHttpStatusCode.INTERNAL_SERVER_ERROR;
  }
}

export class NotFoundException extends HttpException {
  constructor(
    message?: TExceptionMessage,
    code?: EHttpStatusCode,
    messageCode?: EMessageCode,
  ) {
    super({
      message: message || 'Not Found',
      messageCode: messageCode || EMessageCode.NOT_FOUND,
      statusCode: code || EHttpStatusCode.NOT_FOUND,
    });
  }
}

export class BadRequest extends HttpException {
  constructor(
    message?: TExceptionMessage,
    code?: EHttpStatusCode,
    messageCode?: EMessageCode,
  ) {
    super({
      message: message || 'Bad Request',
      messageCode: messageCode || EMessageCode.BAD_REQUEST,
      statusCode: code || EHttpStatusCode.BAD_REQUEST,
    });
  }
}

export class AuthException extends HttpException {
  constructor(
    message?: TExceptionMessage,
    code?: EHttpStatusCode,
    messageCode?: EMessageCode,
  ) {
    super({
      message: message || 'Auth Exception',
      messageCode: messageCode || EMessageCode.INVALID_CREDENTIALS,
      statusCode: code || EHttpStatusCode.UNAUTHORIZED,
    });
  }
}

export class UserVerifiedException extends HttpException {
  constructor(
    message?: TExceptionMessage,
    code?: EHttpStatusCode,
    messageCode?: EMessageCode,
  ) {
    super({
      message: message || 'User is not verified',
      messageCode: messageCode || EMessageCode.INVALID_CREDENTIALS,
      statusCode: code || EHttpStatusCode.UNAUTHORIZED,
    });
  }
}

export class TokenException extends HttpException {
  constructor() {
    super({
      message: 'Token exception',
      messageCode: EMessageCode.TOKEN_VERIFY,
      statusCode: EHttpStatusCode.UNAUTHORIZED,
    });
  }
}

export class TokenExpiredException extends HttpException {
  constructor(message?: TExceptionMessage) {
    super({
      message: message || 'Token expired',
      messageCode: EMessageCode.TOKEN_EXPIRED,
      statusCode: EHttpStatusCode.UNAUTHORIZED,
    });
  }
}

export class AccessTokenMissingException extends HttpException {
  constructor(message?: TExceptionMessage) {
    super({
      message: message || 'Access token is missing',
      messageCode: EMessageCode.TOKEN_NOT_PROVIDED,
      statusCode: EHttpStatusCode.UNAUTHORIZED,
    });
  }
}
