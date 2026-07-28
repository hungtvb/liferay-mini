import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import test from 'node:test';

const toolRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

test('CLI process exits successfully when Ctrl+C cancels an interactive prompt', async () => {
  const child = spawn(process.execPath, ['cli/index.js', 'init'], {
    cwd: toolRoot,
    env: {
      ...process.env,
      LIFERAY_OAUTH_CLIENT_SECRET: ''
    },
    stdio: ['pipe', 'pipe', 'pipe']
  });

  let stdout = '';
  let stderr = '';
  let interrupted = false;

  const timeout = setTimeout(() => {
    child.kill('SIGKILL');
  }, 5000);

  child.stdout.setEncoding('utf8');
  child.stderr.setEncoding('utf8');
  child.stderr.on('data', (chunk) => { stderr += chunk; });
  child.stdout.on('data', (chunk) => {
    stdout += chunk;
    if (!interrupted && stdout.includes('Liferay base URL')) {
      interrupted = true;
      child.kill('SIGINT');
    }
  });

  const result = await new Promise((resolve, reject) => {
    child.once('error', reject);
    child.once('close', (code, signal) => resolve({code, signal}));
  });

  clearTimeout(timeout);
  assert.equal(interrupted, true);
  assert.deepEqual(result, {code: 0, signal: null});
  assert.match(stdout, /Cancelled by user\./);
  assert.equal(stderr, '');
});
