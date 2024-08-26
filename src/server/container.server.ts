import { TConfig, TContainer } from '@common/types';
import { Common } from '@utils/common.util';
import { FileService } from '@utils/file.util';
import { Formatter } from '@utils/formatter.util';
import { Logger } from '@utils/logger.util';

export const createContainer = (config: TConfig): TContainer =>
  ({
    fileService: new FileService(),
    formatter: new Formatter(),
    common: new Common(),
    logger: new Logger(config['server']),
  }) as const;
