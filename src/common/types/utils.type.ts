import { DestinationStream, LoggerOptions } from 'pino';
import { TReqUrlData } from './server.type';

export type TLoggerOptionsOrStream = LoggerOptions | DestinationStream;

export type TParseReq<TBody = void> = Promise<{
  body: TBody | unknown;
  parsedURL: TReqUrlData | null;
  params: Record<string, string>[] | null;
}>;
