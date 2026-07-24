import 'dotenv/config';
import {createApp} from './app.js';
import {loadConfig} from './config.js';
import {LiferayClient} from './liferay-client.js';
import {SessionStore} from './session-store.js';

try {
  const config = loadConfig();
  const liferay = new LiferayClient(config);
  const sessions = new SessionStore(config.sessionTtlMs);
  const app = createApp({config, liferay, sessions});

  app.listen(config.port, '127.0.0.1', () => {
    console.log(`Nexcent Article Importer: http://127.0.0.1:${config.port}`);
    console.log(`Liferay: ${config.baseUrl} | Site: ${config.siteId}`);
  });
}
catch (error) {
  console.error(`[startup] ${error.message}`);
  process.exitCode = 1;
}
