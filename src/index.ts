import { createServer } from '@server/create.server';

(async () => {
  const app = await createServer();

  app.startServer();
})();
