import {mkdir, readdir, readFile, rm, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';

const require = createRequire(import.meta.url);
const {default: JSZip} = await import('jszip');

const projectDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const fragmentSourceDirectory = path.join(projectDirectory, 'fragments');
const outputDirectory = path.join(projectDirectory, 'build', 'fragments');
const outputPath = path.join(outputDirectory, 'collections-nexcent-components.zip');
const collectionKey = 'nexcent-components';

async function addDirectory(zip, sourceDirectory, zipDirectory) {
    const entries = await readdir(sourceDirectory, {withFileTypes: true});

    for (const entry of entries) {
        if (entry.name === '.gitkeep' || entry.name.endsWith('.zip')) {
            continue;
        }

        const sourcePath = path.join(sourceDirectory, entry.name);
        const targetPath = path.posix.join(zipDirectory, entry.name);

        if (entry.isDirectory()) {
            await addDirectory(zip, sourcePath, targetPath);
        }
        else {
            zip.file(targetPath, await readFile(sourcePath));
        }
    }
}

const collectionPath = path.join(fragmentSourceDirectory, 'collection.json');
const collection = JSON.parse(await readFile(collectionPath, 'utf8'));

if (!collection.name) {
    throw new Error(`Invalid Fragment Set descriptor: ${collectionPath}`);
}

const fragmentEntries = (await readdir(fragmentSourceDirectory, {withFileTypes: true}))
    .filter((entry) => entry.isDirectory())
    .sort((left, right) => left.name.localeCompare(right.name));

if (fragmentEntries.length === 0) {
    throw new Error(`No fragment directories found in: ${fragmentSourceDirectory}`);
}

for (const entry of fragmentEntries) {
    const fragmentDirectory = path.join(fragmentSourceDirectory, entry.name);
    const fragmentDefinitionPath = path.join(fragmentDirectory, 'fragment.json');
    const fragmentDefinition = JSON.parse(await readFile(fragmentDefinitionPath, 'utf8'));

    for (const propertyName of ['htmlPath', 'cssPath', 'jsPath', 'configurationPath']) {
        const referencedFile = fragmentDefinition[propertyName];

        if (!referencedFile) {
            continue;
        }

        await readFile(path.join(fragmentDirectory, referencedFile));
    }
}

await rm(outputDirectory, {force: true, recursive: true});
await mkdir(outputDirectory, {recursive: true});

const zip = new JSZip();
await addDirectory(zip, fragmentSourceDirectory, collectionKey);
await writeFile(outputPath, await zip.generateAsync({compression: 'DEFLATE', type: 'nodebuffer'}));

console.log(`Created Fragment Set package: ${outputPath}`);
