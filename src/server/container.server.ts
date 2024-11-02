import { TConfig, TContainer } from '@common/types';
import { Common } from '@utils/common.util';
import { Cookie } from '@utils/cookie.util';
import { Crypting } from '@utils/crypting.util';
import { FileService } from '@utils/file.util';
import { Formatter } from '@utils/formatter.util';
import { Jwt } from '@utils/jwt.util';
import { Logger } from '@utils/logger.util';
import { Validate } from '@utils/validate.util';

export const createContainer = (config: TConfig): TContainer =>
  ({
    fileService: new FileService(),
    formatter: new Formatter(),
    common: new Common(),
    logger: new Logger(config['server']),
    validate: new Validate(),
    crypting: new Crypting(),
    jwt: new Jwt(),
    cookie: new Cookie(),
  }) as const;
