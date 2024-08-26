import { Common } from '@utils/common.util';
import { FileService } from '@utils/file.util';
import { Formatter } from '@utils/formatter.util';
import { IncomingMessage, ServerResponse } from 'http';
import { EHttpStatusCode, EMessageCode } from './http.type';
import { Logger } from '@utils/logger.util';

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
};

export type TLocalFilesToFind = {
  path: string;
  suffix: string;
};
