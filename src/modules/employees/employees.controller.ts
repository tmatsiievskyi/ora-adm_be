import {
  EEMPLOYEES_ACTIONS,
  EHttpStatusCode,
  EMessageCode,
  IController,
  TConfig,
  TContainer,
  TControllerMethodResult,
  TEmployee,
  TRequest,
  TResponse,
} from '@common/types';
import {
  CreateEmployeeInput,
  createEmployeeSchema,
  deleteByIdEmployeeSchema,
  FindAllEmployeesInput,
  findAllEmployeesSchema,
  FindByIdEmployeeInput,
  TDeleteByIdEmplyeeInput,
  TUpdateByIdEmployeeInput,
  updateByIdEmployeeSchema,
} from './employees.schema';
import { EmployeesService } from './employees.service';
import { NotFoundException } from '@common/exceptions';

class EmployeesController implements IController {
  private readonly employeesService = new EmployeesService();

  constructor(
    private readonly container: TContainer,
    private readonly config: TConfig,
  ) {}

  public async handleRequest(req: TRequest, res: TResponse) {
    const parsedUrl = this.container.common.parseURL(req.url, req.method);

    switch (true) {
      case this.container.common.checkUrlToEnum(
        EEMPLOYEES_ACTIONS.OPTIONS_FIND_ALL,
        parsedUrl?.methodWithHref,
      ): {
        return {
          data: {},
          status: EHttpStatusCode.OK,
          message: EMessageCode.OK,
        };
      }

      case this.container.common.checkUrlToEnum(
        EEMPLOYEES_ACTIONS.FIND_ALL,
        parsedUrl?.methodWithHref,
      ): {
        return await this.findAll(req, res, parsedUrl);
      }

      case this.container.common.checkUrlToEnum(
        EEMPLOYEES_ACTIONS.FIND_BY_ID,
        parsedUrl?.methodWithHref,
      ): {
        return await this.findById(
          req,
          res,
          parsedUrl,
          EEMPLOYEES_ACTIONS.FIND_BY_ID,
        );
      }

      case this.container.common.checkUrlToEnum(
        EEMPLOYEES_ACTIONS.CREATE,
        parsedUrl?.methodWithHref,
      ): {
        return await this.create(req, res);
      }

      case this.container.common.checkUrlToEnum(
        EEMPLOYEES_ACTIONS.DELETE_BY_ID,
        parsedUrl?.methodWithHref,
      ): {
        return await this.deleteById(
          req,
          res,
          parsedUrl,
          EEMPLOYEES_ACTIONS.DELETE_BY_ID,
        );
      }

      case this.container.common.checkUrlToEnum(
        EEMPLOYEES_ACTIONS.UPDATE_BY_ID,
        parsedUrl?.methodWithHref,
      ): {
        return await this.update(
          req,
          res,
          parsedUrl,
          EEMPLOYEES_ACTIONS.UPDATE_BY_ID,
        );
      }

      default: {
        throw new NotFoundException();
      }
    }
  }

  public async findAll(
    req: TRequest,
    res: TResponse,
    parsedUrl: any,
  ): Promise<TControllerMethodResult<TEmployee[]>> {
    const cookieData = this.container.cookie.get(req.headers.cookie);
    const parsedReq = await this.container.common.parseReq<
      void,
      void,
      FindAllEmployeesInput['query']
    >(req);

    this.container.validate.validateReq(parsedReq, findAllEmployeesSchema);

    await this.container.validate.validateAuth(req, this.config.tokens);
    const result = await this.employeesService.findAll(parsedReq.queryParams!);

    return {
      data: result.data,
      status: EHttpStatusCode.OK,
      message: EMessageCode.OK,
    };
  }

  public async findById(
    req: TRequest,
    res: TResponse,
    parsedUrl: any,
    reqMask?: string,
  ): Promise<TControllerMethodResult> {
    const parsedReq = await this.container.common.parseReq<
      void,
      FindByIdEmployeeInput['params']
    >(req, reqMask);

    console.log(parsedReq);

    const result = await this.employeesService.findById(parsedReq.reqParams);

    return {
      data: result,
      status: EHttpStatusCode.OK,
      message: EMessageCode.OK,
    };
  }

  public async create(
    req: TRequest,
    res: TResponse,
  ): Promise<TControllerMethodResult> {
    const parsedReq =
      await this.container.common.parseReq<CreateEmployeeInput['body']>(req);

    this.container.validate.validateReq(parsedReq, createEmployeeSchema);

    const data = await this.employeesService.create(parsedReq.body!);

    return {
      data,
      status: EHttpStatusCode.CREATED,
      message: EMessageCode.OK,
    };
  }

  public async deleteById(
    req: TRequest,
    res: TResponse,
    parsedUrl: any,
    reqMask?: string,
  ): Promise<TControllerMethodResult> {
    const parsedReq = await this.container.common.parseReq<
      void,
      TDeleteByIdEmplyeeInput['params']
    >(req, reqMask);

    this.container.validate.validateReq(parsedReq, deleteByIdEmployeeSchema);

    const data = await this.employeesService.removeById(parsedReq.reqParams!);

    if (!data) throw new NotFoundException();

    return {
      data,
      status: EHttpStatusCode.OK,
      message: EMessageCode.OK,
    };
  }

  public async update(
    req: TRequest,
    res: TResponse,
    parsedUrl: any,
    reqMask?: string,
  ): Promise<TControllerMethodResult> {
    const parsedReq = await this.container.common.parseReq<
      TUpdateByIdEmployeeInput['body'],
      TUpdateByIdEmployeeInput['params']
    >(req, reqMask);

    this.container.validate.validateReq(parsedReq, updateByIdEmployeeSchema);

    const data = await this.employeesService.update(
      parsedReq.reqParams!,
      parsedReq.body!,
    );

    return {
      data,
      status: EHttpStatusCode.OK,
      message: EMessageCode.OK,
    };
  }
}

export default EmployeesController;
