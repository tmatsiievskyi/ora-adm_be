import { toBuffer } from 'qrcode';
import { TGenerateQRInput } from './qr.schema';

export class QRService {
  public async generateQR(data: TGenerateQRInput['body']) {
    const qrCode = await toBuffer(data.url, {
      errorCorrectionLevel: 'M',
      type: 'png',
      margin: 1,
    });
    const dd = qrCode.toString('base64');
    return dd;
  }
}
