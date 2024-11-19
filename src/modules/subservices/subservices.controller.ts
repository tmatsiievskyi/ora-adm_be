import {
  EHttpStatusCode,
  EMessageCode,
  ESUBSERVICE_ACTIONS,
  IController,
  TConfig,
  TContainer,
  TControllerMethodResult,
  TRequest,
  TResponse,
} from '@common/types';
import { SubServiceService } from './subservices.service';
import { BadRequest, NotFoundException } from '@common/exceptions';
import {
  createSubserviceSchema,
  TCreateSubserviceSchema,
  TFindAllSubservicesInput,
  TUpdateSubserviceById,
  updateSubserviceByIdSchema,
} from './subservices.schema';

class SubserviceController implements IController {
  private readonly subServiceService = new SubServiceService();

  constructor(
    private readonly container: TContainer,
    private readonly config: TConfig,
  ) {}

  public async handleRequest(req: TRequest, res: TResponse) {
    const parsedUrl = this.container.common.parseURL(req.url, req.method);

    switch (true) {
      case this.container.common.checkUrlToEnum(
        ESUBSERVICE_ACTIONS.OPTIONS,
        parsedUrl?.methodWithHref,
      ):
      case this.container.common.checkUrlToEnum(
        ESUBSERVICE_ACTIONS.OPTIONS_BY_ID,
        parsedUrl?.methodWithHref,
      ): {
        return {
          data: {},
          status: EHttpStatusCode.OK,
          message: EMessageCode.OK,
        };
      }

      case this.container.common.checkUrlToEnum(
        ESUBSERVICE_ACTIONS.FIND_ALL,
        parsedUrl?.methodWithHref,
      ): {
        return await this.hanleFindAll(req, res);
      }

      case this.container.common.checkUrlToEnum(
        ESUBSERVICE_ACTIONS.CREATE,
        parsedUrl?.methodWithHref,
      ): {
        return await this.handleCreate(req, res);
      }

      case this.container.common.checkUrlToEnum(
        ESUBSERVICE_ACTIONS.UPDATE_BY_ID,
        parsedUrl?.methodWithHref,
      ): {
        return await this.handleUpdateById(
          req,
          res,
          ESUBSERVICE_ACTIONS.UPDATE_BY_ID,
        );
      }

      default:
        throw new NotFoundException();
    }
  }

  private async hanleFindAll(
    req: TRequest,
    res: TResponse,
  ): Promise<TControllerMethodResult> {
    await this.container.validate.validateAuth(req, this.config.tokens);

    const parsedReq = await this.container.common.parseReq<
      void,
      void,
      TFindAllSubservicesInput['query']
    >(req);

    const result = await this.subServiceService.findAll(parsedReq.queryParams!);

    return {
      data: result.data,
      total: result.total,
      currentPage: result.currentPage,
      totalPages: result.totalPages,
      status: EHttpStatusCode.OK,
      message: EMessageCode.OK,
    };
  }

  private async handleCreate(req: TRequest, res: TResponse) {
    const parsedReq =
      await this.container.common.parseReq<TCreateSubserviceSchema['body']>(
        req,
      );

    this.container.validate.validateReq(parsedReq, createSubserviceSchema);

    const data = this.subServiceService.create(
      parsedReq.body!.subservice,
      parsedReq.body!.localizations,
    );

    console.log(data);

    return {
      data,
      status: EHttpStatusCode.CREATED,
      message: EMessageCode.OK,
    };
  }

  private async handleUpdateById(
    req: TRequest,
    res: TResponse,
    reqMask?: string,
  ) {
    const parsedReq = await this.container.common.parseReq<
      TUpdateSubserviceById['body'],
      TUpdateSubserviceById['params']
    >(req, reqMask);

    console.log(parsedReq);

    this.container.validate.validateReq(parsedReq, updateSubserviceByIdSchema);

    const data = await this.subServiceService.updateSubserviceById(
      parsedReq.reqParams!.id,
      parsedReq.body!,
    );

    if (!data) throw new BadRequest();

    return {
      data,
      status: EHttpStatusCode.OK,
      message: EMessageCode.OK,
    };
  }
}

export default SubserviceController;
