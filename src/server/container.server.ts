import { TContainer } from '@common/types';
import { Common } from '@utils/common.util';
import { FileService } from '@utils/file.util';
import { Formatter } from '@utils/formatter.util';

export const createContainer = (): TContainer =>
  ({
    fileService: new FileService(),
    formatter: new Formatter(),
    common: new Common(),
  }) as const;
