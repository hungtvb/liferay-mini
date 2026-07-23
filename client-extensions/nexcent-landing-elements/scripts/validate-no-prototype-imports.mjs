// Keep production bundles independent from the visual-reference prototype.
import {readdir, readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const projectRoot = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    '..'
);
const sourceRoot = path.join(projectRoot, 'src');
const supportedExtensions = /\.(?:js|jsx|ts|tsx)$/;

async function collectSourceFiles(directory) {
    const entries = await readdir(directory, {withFileTypes: true});
    const files = [];

    for (const entry of entries) {
        const absolutePath = path.join(directory, entry.name);

        if (entry.isDirectory()) {
            files.push(...(await collectSourceFiles(absolutePath)));
        }
        else if (supportedExtensions.test(entry.name)) {
            files.push(absolutePath);
        }
    }

    return files;
}

const violations = [];

for (const sourceFile of await collectSourceFiles(sourceRoot)) {
    const source = await readFile(sourceFile, 'utf8');

    if (source.includes('prototypes/nexcent-static')) {
        violations.push(path.relative(projectRoot, sourceFile));
    }
}

if (violations.length) {
    throw new Error(
        `Production source must not import the static prototype:\n${violations.join('\n')}`
    );
}

console.log('Production source is isolated from prototypes/nexcent-static.');
