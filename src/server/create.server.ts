import { config } from '@config';
import { HttpServer } from './http.server';
import { TLocalFilesToFind } from '@common/types';
import { createContainer } from './container.server';
import { connectToDB } from '@db';

export const createServer = async () => {
  const controllersToFind: TLocalFilesToFind = {
    path: './src/modules',
    suffix: '.controller.ts',
  };

  const container = createContainer(config);

  await connectToDB(config['db'], container['logger']);

  const httpServer = new HttpServer(config, container, controllersToFind);

  return httpServer;
};
