import { TRequest, TReqUrlData, TResponse } from './server.type';
import { TParseReq } from './utils.type';

export interface IController {
  handleRequest: (
    req: TRequest,
    res: TResponse,
    parsedURL: TReqUrlData,
  ) => Promise<any>; //TODO: add type
}

export enum EAUTH_ACTIONS {
  SIGN_IN = 'POST:/api/auth/sign-in',
  SIGN_UP = 'POST:/api/auth/sign-up',
  SIGN_OUT = 'POST:/api/auth/sign-out',
}
