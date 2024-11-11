import { HEADERS, MIME_TYPES } from '@common/contstants';
import { HttpException, NotFoundException } from '@common/exceptions';
import {
  EHttpStatusCode,
  TConfig,
  TContainer,
  IController,
  TLocalFilesToFind,
  TRequest,
  TResponse,
} from '@common/types';
import { Server as HttpServ, createServer } from 'node:http';

export class HttpServer {
  private server: HttpServ;
  private controllers: Record<string, IController>;

  constructor(
    private readonly config: TConfig,
    private readonly container: TContainer,
    private readonly controllersToFind: TLocalFilesToFind,
  ) {}

  private async handleRequest(req: TRequest, res: TResponse) {
    const { url, method } = req;
    const startTime = Date.now();
    try {
      if (!url || !method) {
        throw new HttpException({
          message: 'Not valid request',
          statusCode: EHttpStatusCode.BAD_REQUEST,
        });
      }

      const href = url.split('?')[0];
      const [base, name, action] = href.substring(1).split('/');

      if (!name || !this.controllers[name]) {
        throw new NotFoundException();
      }
      const result = await this.controllers[name].handleRequest(req, res);
      const mimeType = MIME_TYPES[result?.mime_type || 'json'];
      // res.statusCode = result?.status || 200;
      res.writeHead(result?.status || 200, {
        ...HEADERS,
        'Content-Type': mimeType,
      });

      res.end(
        this.container.formatter.formatResp(
          result?.data,
          Date.now() - startTime,
          result?.message,
          result?.total,
        ),
      );
    } catch (error) {
      this.container.logger.error(error, 'Request Handler');
      if (error instanceof HttpException) {
        res.writeHead(error.statusCode, {
          ...HEADERS,
          'Content-Type': 'application/json',
        });
        res.end(this.container.formatter.formatResp(error, 0, error.message));
      } else {
        const err = this.container.formatter.errorHandler(error);
        res.writeHead(EHttpStatusCode.INTERNAL_SERVER_ERROR, {
          ...HEADERS,
          'Content-Type': 'application/json',
        });
        res.end(this.container.formatter.formatResp(err, 0, err.message));
      }
    }
  }

  private async getModules() {
    const files = await this.container.fileService.readdirRecur(
      this.controllersToFind.path,
      this.controllersToFind.suffix,
    );

    if (!files.length) {
      throw new Error('Files is not found');
    }

    for (const { fileName, filePath, fullName } of files) {
      this.controllers = {
        ...this.controllers,
        [fileName]: new (await import(filePath)).default(
          this.container,
          this.config,
        ) as IController,
      };
    }
  }

  private listenHttpServer(): Promise<void> {
    return new Promise((res) => {
      process.on('unhandledRejection', (reason) => {
        this.container.logger.error(reason, 'unhandledRejection');
      });

      process.on('rejectionHandled', (reason) => {
        this.container.logger.error(reason, 'rejectionHandled');
      });

      process.on('multipleResolves', (type, promise, reason) => {
        this.container.logger.error(
          {
            error: { type, promise, reason },
          },
          'MultipleResolves',
        );
      });

      process.on('uncaughtException', (error) => {
        this.container.logger.error(error, 'uncaughtException');
        process.exit(1);
      });

      return this.server.listen(this.config.server.port, () => {
        this.container.logger.log(
          `The server is running on ${this.config.server.port}`,
          {},
        );
        return res();
      });
    });
  }

  public async startServer() {
    await this.getModules();
    this.server = createServer(async (req: TRequest, res: TResponse) => {
      await this.handleRequest(req, res);
    });
    await this.listenHttpServer();
  }
}
