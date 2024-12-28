import {
  EHttpStatusCode,
  EMessageCode,
  ESERVICE_ACTION,
  IController,
  TConfig,
  TContainer,
  TRequest,
  TResponse,
} from '@common/types';
import { ServiceseService } from './services.service';
import { NotFoundException } from '@common/exceptions';

class ServiceController implements IController {
  private readonly servicesService = new ServiceseService();

  constructor(
    private readonly container: TContainer,
    private readonly config: TConfig,
  ) {}

  public async handleRequest(req: TRequest, res: TResponse) {
    const parsedUrl = this.container.common.parseURL(req.url, req.method);

    switch (true) {
      case this.container.common.checkUrlToEnum(
        ESERVICE_ACTION.FIND_ALL,
        parsedUrl?.methodWithHref,
      ): {
        return {
          data: {},
          status: EHttpStatusCode.OK,
          message: EMessageCode.OK,
        };
      }
      default:
        throw new NotFoundException();
    }
  }
}

export default ServiceController;
