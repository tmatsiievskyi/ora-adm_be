import {
  EHttpStatusCode,
  ELOCALIZATION_ACTIONS,
  EMessageCode,
  IController,
  TConfig,
  TContainer,
  TRequest,
  TResponse,
} from '@common/types';
import { LocalizationService } from './localization.service';
import { NotFoundException } from '@common/exceptions';
import {
  findLocalizationJsonSchema,
  TFindAllLocalizationInput,
} from './localization.schema';

class LocalizationController implements IController {
  private readonly localizationService: LocalizationService;

  constructor(
    private readonly container: TContainer,
    private readonly config: TConfig,
  ) {
    this.localizationService = new LocalizationService(container);
  }

  public async handleRequest(req: TRequest, res: TResponse) {
    const parsedURL = this.container.common.parseURL(req.url, req.method);

    switch (true) {
      case this.container.common.checkUrlToEnum(
        ELOCALIZATION_ACTIONS.SYNCHRONIZE_OPTIONS,
        parsedURL?.methodWithHref,
      ): {
        return {
          data: {},
          status: EHttpStatusCode.OK,
          message: EMessageCode.OK,
        };
      }
      case this.container.common.checkUrlToEnum(
        ELOCALIZATION_ACTIONS.SYNCHRONIZE,
        parsedURL?.methodWithHref,
      ): {
        return await this.handleSynchronize(req, res);
      }
      case this.container.common.checkUrlToEnum(
        ELOCALIZATION_ACTIONS.FIND_LOCALIZATION_JSON_OPTIONS,
        parsedURL?.methodWithHref,
      ): {
        return {
          data: {},
          status: EHttpStatusCode.OK,
          message: EMessageCode.OK,
        };
      }
      case this.container.common.checkUrlToEnum(
        ELOCALIZATION_ACTIONS.FIND_LOCALIZATION_JSON,
        parsedURL?.methodWithHref,
      ): {
        return await this.findAll(req, res);
      }

      default:
        throw new NotFoundException();
    }
  }

  private async handleSynchronize(req: TRequest, res: TResponse) {
    const data = await this.localizationService.synchronize();

    return {
      data,
      status: EHttpStatusCode.OK,
      message: EMessageCode.OK,
    };
  }

  private async findAll(req: TRequest, res: TResponse) {
    const parsedReq = await this.container.common.parseReq<
      void,
      void,
      TFindAllLocalizationInput['query']
    >(req);

    this.container.validate.validateReq(parsedReq, findLocalizationJsonSchema);

    const result = await this.localizationService.findAllJson(
      parsedReq.queryParams,
    );
    return {
      data: result,
      status: EHttpStatusCode.OK,
      message: EMessageCode.OK,
    };
  }
}

export default LocalizationController;
