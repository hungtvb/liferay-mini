import 'dotenv/config';
import {createApp} from './app.js';
import {loadConfig} from './config.js';
import {LiferayClient} from './liferay-client.js';
import {SessionStore} from './session-store.js';

try {
  const config = loadConfig();
  const liferay = new LiferayClient(config);
  const sessions = new SessionStore({maxSessions: config.maxActiveSessions, ttlMs: config.sessionTtlMs});
  createApp({config, liferay, sessions}).listen(config.port, config.host, () => {
    console.log(`Liferay Flat Structured Content Importer: http://${config.host}:${config.port}`);
  });
}
catch (error) {
  console.error(`[${error.code || 'STARTUP_ERROR'}] ${error.message}`);
  process.exitCode = 1;
}
