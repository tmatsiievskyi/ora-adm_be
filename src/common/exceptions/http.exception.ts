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
