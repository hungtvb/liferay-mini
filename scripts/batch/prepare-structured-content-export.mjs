import {mkdir, readFile, writeFile} from 'node:fs/promises';
import path from 'node:path';

const [inputPath, outputPath, prefix = 'NXC-'] = process.argv.slice(2);

if (!inputPath || !outputPath) {
    console.error(
        'Usage: node prepare-structured-content-export.mjs <input.jsont> <output.batch-engine-data.json> [ercPrefix]'
    );
    process.exit(1);
}

if (!outputPath.endsWith('.batch-engine-data.json')) {
    throw new Error('Output filename must end with .batch-engine-data.json.');
}

const payload = JSON.parse(await readFile(inputPath, 'utf8'));
const expectedClassName =
    'com.liferay.headless.delivery.dto.v1_0.StructuredContent';

if (payload.configuration?.className !== expectedClassName) {
    throw new Error(
        `Expected configuration.className ${expectedClassName}, received ${payload.configuration?.className ?? 'undefined'}.`
    );
}

if (!Array.isArray(payload.items)) {
    throw new Error('The exported jsont payload does not contain an items array.');
}

const items = payload.items.filter((item) =>
    String(item.externalReferenceCode ?? '').startsWith(prefix)
);

if (items.length === 0) {
    throw new Error(`No Structured Content items use the ERC prefix "${prefix}".`);
}

const externalReferenceCodes = new Set();

for (const item of items) {
    const externalReferenceCode = String(item.externalReferenceCode ?? '');

    if (!externalReferenceCode) {
        throw new Error('Every exported item must contain an externalReferenceCode.');
    }

    if (externalReferenceCodes.has(externalReferenceCode)) {
        throw new Error(
            `Duplicate externalReferenceCode in export: ${externalReferenceCode}`
        );
    }

    externalReferenceCodes.add(externalReferenceCode);
}

payload.items = items;

await mkdir(path.dirname(outputPath), {recursive: true});
await writeFile(outputPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

console.log(
    `Prepared ${items.length} Structured Content items in ${outputPath}.`
);
