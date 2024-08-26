import { createServer } from '@server/create.server';

(() => {
  const app = createServer();

  app.startServer();
})();
