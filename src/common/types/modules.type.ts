import { EHttpStatusCode, EMessageCode } from './http.type';
import { TRequest, TReqUrlData, TResponse } from './server.type';
import { TParseReq } from './utils.type';

export type TControllerMethodResult = {
  data: any;
  status: EHttpStatusCode;
  message: EMessageCode;
};

export interface IController {
  handleRequest: (
    req: TRequest,
    res: TResponse,
    parsedURL: TReqUrlData,
  ) => Promise<TControllerMethodResult | undefined>; //TODO: add type
}

export enum EAUTH_ACTIONS {
  SIGN_IN = 'POST:/api/auth/sign-in',
  SIGN_UP = 'POST:/api/auth/sign-up',
  SIGN_OUT = 'GET:/api/auth/sign-out',
  REFRESH = 'GET:/api/auth/refresh',
}

export type TSignUpBody = {
  login: string;
  password: string;
};
