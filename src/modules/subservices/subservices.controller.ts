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
import { NotFoundException } from '@common/exceptions';
import { TFindAllSubservicesInput } from './subservices.schema';

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
      status: EHttpStatusCode.OK,
      message: EMessageCode.OK,
    };
  }
}

export default SubserviceController;
