import {mkdir, readFile, writeFile} from 'node:fs/promises';
import path from 'node:path';

const [inputPath, outputDirectory, outputName = '20-structured-content.batch-engine-data.json'] = process.argv.slice(2);

if (!inputPath || !outputDirectory) {
    console.error('Usage: node package-batch-export.mjs <export.json> <output-directory> [output-file]');
    process.exit(1);
}

const source = JSON.parse(await readFile(inputPath, 'utf8'));

if (!source.configuration || typeof source.configuration !== 'object') {
    throw new Error('The Batch Engine export has no generated configuration block. Do not invent it manually.');
}

if (!Array.isArray(source.items)) {
    throw new Error('The Batch Engine export has no items array.');
}

const approvedItems = source.items.filter((item) =>
    String(item.externalReferenceCode ?? '').startsWith('NXC-')
);

const externalReferenceCodes = approvedItems.map((item) => item.externalReferenceCode);
const duplicates = externalReferenceCodes.filter(
    (value, index) => externalReferenceCodes.indexOf(value) !== index
);

if (duplicates.length) {
    throw new Error(`Duplicate ERCs: ${[...new Set(duplicates)].join(', ')}`);
}

if (!approvedItems.length) {
    throw new Error('No approved NXC-* records were found in the export.');
}

await mkdir(outputDirectory, {recursive: true});

const outputPath = path.join(outputDirectory, outputName);
const payload = {
    configuration: source.configuration,
    items: approvedItems,
};

await writeFile(outputPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

console.log(`Wrote ${approvedItems.length} records to ${outputPath}`);
