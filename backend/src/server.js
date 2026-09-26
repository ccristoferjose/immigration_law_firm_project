import { createApp } from './app.js';
import { env } from './config/env.js';
import { bootstrap } from './db/bootstrap.js';

async function start() {
  await bootstrap();
  const app = createApp();
  app.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`[server] API listening on :${env.port} (${env.nodeEnv})`);
  });
}

start().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('[server] Fatal startup error:', err);
  process.exit(1);
});
