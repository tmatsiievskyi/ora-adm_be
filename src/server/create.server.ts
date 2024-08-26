import { config } from '@config';
import { HttpServer } from './http.server';
import { TLocalFilesToFind } from '@common/types';
import { createContainer } from './container.server';

export const createServer = () => {
  const controllersToFind: TLocalFilesToFind = {
    path: './src/modules',
    suffix: '.controller.ts',
  };

  const container = createContainer(config);

  const httpServer = new HttpServer(config, container, controllersToFind);

  return httpServer;
};
