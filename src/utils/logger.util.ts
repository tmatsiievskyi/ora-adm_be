import { TConfig, TLoggerOptionsOrStream } from '@common/types';
import { Level, levels, pino } from 'pino';

export const options: Record<string, TLoggerOptionsOrStream> = {
  development: {
    level: 'trace',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
      },
    },
    name: 'ora-adm_be',
  },
  production: {},

  test: {},
};

export class Logger {
  private readonly logger: pino.Logger;

  constructor(private readonly config?: TConfig['server']) {
    this.logger = this.initLogger(this.config?.nodeEnv || 'development');
  }

  debug(obj: object, message: string) {
    this.logger.debug(obj, message);
  }

  log(message?: string, obj?: object) {
    this.logger.info(obj, message);
  }

  warn(obj: object, message?: string) {
    this.logger.warn(obj, message);
  }

  error(obj: unknown, message?: string) {
    this.logger.error(obj, message);
  }

  private initLogger(nodeEnv: string): pino.Logger {
    return pino(options[nodeEnv]);
  }
}
