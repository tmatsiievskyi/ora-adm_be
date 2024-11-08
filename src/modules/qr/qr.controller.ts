import {
  EHttpStatusCode,
  EMessageCode,
  EQR_ACTIONS,
  IController,
  TConfig,
  TContainer,
  TRequest,
  TResponse,
} from '@common/types';
import { QRService } from './qr.service';
import { NotFoundException } from '@common/exceptions';
import { generateQRSchema, TGenerateQRInput } from './qr.schema';

class QRController implements IController {
  private readonly QRService = new QRService();

  constructor(
    private readonly container: TContainer,
    private readonly config: TConfig,
  ) {}

  public async handleRequest(req: TRequest, res: TResponse) {
    const parsedUrl = this.container.common.parseURL(req.url, req.method);

    switch (true) {
      case this.container.common.checkUrlToEnum(
        EQR_ACTIONS.GENERATE_QR_OPTIONS,
        parsedUrl?.methodWithHref,
      ): {
        return {
          data: {},
          status: EHttpStatusCode.OK,
          message: EMessageCode.OK,
        };
      }

      case this.container.common.checkUrlToEnum(
        EQR_ACTIONS.GENERATE_QR,
        parsedUrl?.methodWithHref,
      ): {
        return await this.handleGenerate(req, res);
      }

      default: {
        throw new NotFoundException();
      }
    }
  }

  public async handleGenerate(req: TRequest, res: TResponse) {
    const parsedReq =
      await this.container.common.parseReq<TGenerateQRInput['body']>(req);

    this.container.validate.validateReq(parsedReq, generateQRSchema);

    const result = await this.QRService.generateQR(parsedReq.body!);

    return {
      data: result,
      status: EHttpStatusCode.OK,
      message: EMessageCode.OK,
    };
  }
}

export default QRController;
