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
  ) => Promise<TControllerMethodResult | undefined>;
}

export enum EAUTH_ACTIONS {
  SIGN_IN = 'POST:/api/auth/sign-in',
  SIGN_UP = 'POST:/api/auth/sign-up',
  SIGN_OUT = 'GET:/api/auth/sign-out',
  REFRESH = 'GET:/api/auth/refresh',
}

export enum EEMPLOYEES_ACTIONS {
  CREATE = 'POST:/api/employees',
  FIND_ALL = 'GET:/api/employees',
  FIND_BY_ID = 'GET:/api/employees/:id',
  UPDATE_BY_ID = 'PUT:/api/employees/:id',
  DELETE_BY_ID = 'DELETE:/api/employees/:id',
}

export type TSignUpBody = {
  login: string;
  password: string;
};
