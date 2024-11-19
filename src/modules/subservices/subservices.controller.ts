import {
  EEMPLOYEES_ACTIONS,
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
  deleteSubserviceByIdSchema,
  findSubserviceByIdSchema,
  TCreateSubserviceSchema,
  TDeleteSubserviceById,
  TFindAllSubservicesInput,
  TFindByIdSubserviceInput,
  TUpdateSubserviceById,
  TUpdateSubservicePriceById,
  updateSubserviceByIdSchema,
  updateSubservicePriceByIdSchema,
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
        ESUBSERVICE_ACTIONS.OPTIONS_PRICE_BY_ID,
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
        ESUBSERVICE_ACTIONS.FIND_BY_ID,
        parsedUrl?.methodWithHref,
      ): {
        return await this.handleFindById(
          req,
          res,
          ESUBSERVICE_ACTIONS.FIND_BY_ID,
        );
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

      case this.container.common.checkUrlToEnum(
        ESUBSERVICE_ACTIONS.UPDATE_PRICE_BY_ID,
        parsedUrl?.methodWithHref,
      ): {
        return await this.handleUpdatePriceById(
          req,
          res,
          ESUBSERVICE_ACTIONS.UPDATE_BY_ID,
        );
      }

      case this.container.common.checkUrlToEnum(
        ESUBSERVICE_ACTIONS.DELETE_BY_ID,
        parsedUrl?.methodWithHref,
      ): {
        return await this.handleDeleteById(
          req,
          res,
          EEMPLOYEES_ACTIONS.DELETE_BY_ID,
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

  private async handleFindById(
    req: TRequest,
    res: TResponse,
    reqMask?: string,
  ) {
    const parsedReq = await this.container.common.parseReq<
      void,
      TFindByIdSubserviceInput['params']
    >(req, reqMask);

    this.container.validate.validateReq(parsedReq, findSubserviceByIdSchema);

    const data = await this.subServiceService.findSubserviceById(
      parsedReq.reqParams!.id,
    );

    if (!data) {
      throw new NotFoundException();
    }

    return {
      data,
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

    const data = await this.subServiceService.create(
      parsedReq.body!.subservice,
      parsedReq.body!.localization,
    );

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

  private async handleUpdatePriceById(
    req: TRequest,
    res: TResponse,
    reqMask?: string,
  ) {
    const parsedReq = await this.container.common.parseReq<
      TUpdateSubservicePriceById['body'],
      TUpdateSubservicePriceById['params']
    >(req, reqMask);

    this.container.validate.validateReq(
      parsedReq,
      updateSubservicePriceByIdSchema,
    );

    const data = await this.subServiceService.updateSubservicePrice(
      parsedReq.reqParams!.id,
      parsedReq.body!.price,
    );

    return {
      data,
      status: EHttpStatusCode.OK,
      message: EMessageCode.OK,
    };
  }

  private async handleDeleteById(
    req: TRequest,
    res: TResponse,
    reqMask?: string,
  ) {
    const parsedReq = await this.container.common.parseReq<
      void,
      TDeleteSubserviceById['params']
    >(req, reqMask);

    this.container.validate.validateReq(parsedReq, deleteSubserviceByIdSchema);

    const data = await this.subServiceService.deleteSubservice(
      parsedReq.reqParams!.id,
    );

    if (!data) {
      throw new NotFoundException();
    }

    return {
      data,
      status: EHttpStatusCode.OK,
      message: EMessageCode.OK,
    };
  }
}

export default SubserviceController;
