import {readdir} from 'node:fs/promises';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

async function collect(directory) {
  const entries = await readdir(directory, {withFileTypes: true});
  const result = [];

  for (const entry of entries) {
    const absolute = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      result.push(...await collect(absolute));
    }
    else if (entry.name.endsWith('.js') || entry.name.endsWith('.mjs')) {
      result.push(absolute);
    }
  }

  return result;
}

const files = [
  ...await collect(path.join(root, 'server')),
  ...await collect(path.join(root, 'public')),
  ...await collect(path.join(root, 'scripts')),
  ...await collect(path.join(root, 'test'))
];

for (const file of files) {
  const result = spawnSync(process.execPath, ['--check', file], {encoding: 'utf8'});

  if (result.status !== 0) {
    process.stderr.write(result.stderr);
    process.exit(result.status || 1);
  }
}

console.log(`Syntax check passed for ${files.length} JavaScript files.`);
