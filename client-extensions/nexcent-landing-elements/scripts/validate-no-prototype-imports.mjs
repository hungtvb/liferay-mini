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

function isPreviewOrTest(relativePath) {
    return (
        relativePath.includes('/preview/') ||
        relativePath.includes('\\preview\\') ||
        /(?:^|[\\/])[^\\/]+\.(?:test|spec)\.[jt]sx?$/.test(relativePath)
    );
}

const violations = [];

for (const sourceFile of await collectSourceFiles(sourceRoot)) {
    const source = await readFile(sourceFile, 'utf8');
    const relativePath = path.relative(projectRoot, sourceFile);

    if (source.includes('prototypes/nexcent-static')) {
        violations.push(`${relativePath}: imports prototypes/nexcent-static`);
    }

    if (
        !isPreviewOrTest(relativePath) &&
        (source.includes('fallback/content.json') ||
            source.includes('fallback/assets/css/style.css'))
    ) {
        violations.push(`${relativePath}: imports the fallback page snapshot`);
    }
}

if (violations.length) {
    throw new Error(
        `Production source import boundaries are violated:\n${violations.join('\n')}`
    );
}

console.log(
    'Production source is isolated from the prototype and copied fallback content/CSS snapshots.'
);
