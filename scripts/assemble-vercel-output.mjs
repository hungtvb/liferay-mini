#!/usr/bin/env node

import {cp, mkdir, rm} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

const repositoryRoot = path.dirname(
    path.dirname(fileURLToPath(import.meta.url))
);
const outputDirectory = path.join(repositoryRoot, '.vercel-static');
const prototypeDirectory = path.join(
    repositoryRoot,
    'prototypes/nexcent-static'
);
const remoteAppDirectory = path.join(
    repositoryRoot,
    'remote-apps/nexcent-articles/dist'
);

await rm(outputDirectory, {force: true, recursive: true});
await mkdir(outputDirectory, {recursive: true});
await cp(prototypeDirectory, outputDirectory, {recursive: true});
await cp(remoteAppDirectory, path.join(outputDirectory, 'articles'), {
    recursive: true,
});

console.log('Assembled Nexcent landing page and Nexcent Articles for Vercel.');
