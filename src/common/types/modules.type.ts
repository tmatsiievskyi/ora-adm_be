import { TReqUrlData } from './server.type';

export interface IController {
  handleRequest: (url: TReqUrlData) => Promise<any>; //TODO: add type
}

export enum EAUTH_ACTIONS {
  SIGN_IN = 'POST:/api/auth/sign-in',
  SIGN_UP = 'POST:/api/auth/sign-up',
  SIGN_OUT = 'POST:/api/auth/sign-out',
}
