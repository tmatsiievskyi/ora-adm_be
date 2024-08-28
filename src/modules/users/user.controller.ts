import { IController, TRequest, TReqUrlData, TResponse } from '@common/types';

class UserController implements IController {
  public handleRequest = async (
    req: TRequest,
    res: TResponse,
    reqUrl: TReqUrlData,
  ) => {};
}

export default UserController;
