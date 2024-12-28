import { MIME_TYPES } from '@common/contstants';
import { EHttpStatusCode, EMessageCode } from './http.type';
import { TRequest, TReqUrlData, TResponse } from './server.type';

export type TControllerMethodResult<T = unknown> = {
  data: T;
  total?: number;
  currentPage?: number;
  totalPages?: number;
  status: EHttpStatusCode;
  message: EMessageCode;
  mime_type?: keyof typeof MIME_TYPES;
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
  SIGN_OUT = 'POST:/api/auth/sign-out',
  REFRESH = 'POST:/api/auth/refresh',
  OPTIONS_SIGN_UP = 'OPTIONS:/api/auth/sign-up',
  OPTIONS_SIGN_IN = 'OPTIONS:/api/auth/sign-in',
  OPTIONS_SIGN_OUT = 'OPTIONS:/api/auth/sign-out',
  OPTIONS_REFRESH = 'OPTIONS:/api/auth/refresh',
}

export enum EEMPLOYEES_ACTIONS {
  CREATE = 'POST:/api/employees',
  FIND_ALL = 'GET:/api/employees',
  FIND_BY_ID = 'GET:/api/employees/:id',
  UPDATE_BY_ID = 'PUT:/api/employees/:id',
  DELETE_BY_ID = 'DELETE:/api/employees/:id',
  OPTIONS_FIND_ALL = 'OPTIONS:/api/employees',
}

export enum ESUBSERVICE_ACTIONS {
  CREATE = 'POST:/api/subservices',
  FIND_ALL = 'GET:/api/subservices',
  FIND_BY_ID = 'GET:/api/subservices/:id',
  UPDATE_BY_ID = 'PUT:/api/subservices/:id',
  UPDATE_PRICE_BY_ID = 'PUT:/api/subservices/:id/price',
  DELETE_BY_ID = 'DELETE:/api/subservices/:id',
  OPTIONS = 'OPTIONS:/api/subservices',
  OPTIONS_BY_ID = 'OPTIONS:/api/subservices/:id',
  OPTIONS_PRICE_BY_ID = 'OPTIONS:/api/subservices/:id/price',
}

export enum ESERVICE_ACTION {
  CREATE = 'POST:/api/services',
  FIND_ALL = 'GET:/api/services',
  FIND_BY_ID = 'GET:/api/services/:id',
  UPDATE_BY_ID = 'PUT:/api/services/:id',
  DELETE_BY_ID = 'DELETE:/api/services/:id',
  OPTIONS = 'OPTIONS:/api/services',
  OPTIONS_BY_ID = 'OPTIONS:/api/services/:id',
}

export enum EUSER_ACTIONS {
  ME = 'GET:/api/users/me',
  OPTIONS_ME = 'OPTIONS:/api/users/me',
}

export enum ELOCALIZATION_ACTIONS {
  SYNCHRONIZE = 'GET:/api/localization/synchronize',
  SYNCHRONIZE_OPTIONS = 'OPTIONS:/api/localization/synchronize',
  FIND_LOCALIZATION_JSON = 'GET:/api/localization/json',
  FIND_LOCALIZATION_JSON_OPTIONS = 'OPTIONS:/api/localization/json',
}

export enum EQR_ACTIONS {
  GENERATE_QR = 'POST:/api/qr/generate',
  GENERATE_QR_OPTIONS = 'OPTIONS:/api/qr/generate',
}

export type TSignUpBody = {
  login: string;
  password: string;
};
