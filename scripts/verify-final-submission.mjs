import {access, readFile, readdir} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const repositoryRoot = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    '..'
);

const failures = [];

async function exists(relativePath) {
    try {
        await access(path.join(repositoryRoot, relativePath));
        return true;
    }
    catch {
        return false;
    }
}

async function requireFile(relativePath) {
    if (!(await exists(relativePath))) {
        failures.push(`Missing required file: ${relativePath}`);
    }
}

async function walkFiles(relativeDirectory) {
    if (!(await exists(relativeDirectory))) {
        return [];
    }

    const absoluteDirectory = path.join(repositoryRoot, relativeDirectory);
    const files = [];

    for (const entry of await readdir(absoluteDirectory, {withFileTypes: true})) {
        const relativePath = path.join(relativeDirectory, entry.name);

        if (entry.isDirectory()) {
            files.push(...await walkFiles(relativePath));
        }
        else if (entry.isFile()) {
            files.push(relativePath);
        }
    }

    return files;
}

function isFixtureFile(relativePath) {
    const name = path.basename(relativePath).toLowerCase();

    return name !== '.gitkeep' &&
        name !== 'readme.md' &&
        !name.endsWith('.lock') &&
        !name.endsWith('.lck');
}

const scaffoldFiles = [
    'FINAL-SUBMISSION.md',
    'SUBMISSION.md',
    'configs/local/README.md',
    'submission/evidence/README.md',
    'submission/evidence/manifest.template.json',
    'docs/master-track/README.md',
    'docs/master-track/05-taxonomy-and-asset-classification.md',
    'client-extensions/nexcent-landing-elements/client-extension.yaml',
    'modules/nexcent-training/nexcent-training-service/service.xml',
    'modules/nexcent-training/nexcent-training-rest-impl/rest-openapi.yaml',
];

for (const file of scaffoldFiles) {
    await requireFile(file);
}

if (failures.length) {
    console.error('Final submission scaffold verification failed:');

    for (const failure of failures) {
        console.error(`- ${failure}`);
    }

    process.exit(1);
}

const readyFile = 'submission/READY';

if (!(await exists(readyFile))) {
    console.log(
        'Final submission scaffold is valid. Runtime package remains PENDING because submission/READY is absent.'
    );
    process.exit(0);
}

const runtimeFiles = [
    'configs/local/portal-ext.properties',
    'configs/local/data/hypersonic/lportal.properties',
    'submission/evidence/manifest.json',
];

for (const file of runtimeFiles) {
    await requireFile(file);
}

const readyContent = await readFile(
    path.join(repositoryRoot, readyFile),
    'utf8'
);

if (!/^verifiedCommit=[0-9a-f]{40}$/m.test(readyContent)) {
    failures.push(
        'submission/READY must contain verifiedCommit=<40 character commit SHA>.'
    );
}

if (!/^verifiedAt=\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/m.test(readyContent)) {
    failures.push(
        'submission/READY must contain verifiedAt=<ISO-8601 UTC timestamp>.'
    );
}

const hsqlFiles = (await walkFiles('configs/local/data/hypersonic'))
    .filter(isFixtureFile);
const hasDatabasePayload = hsqlFiles.some((file) =>
    /lportal\.(script|data|backup)$/i.test(file)
);

if (!hasDatabasePayload) {
    failures.push(
        'The HSQL fixture must contain lportal.script, lportal.data, or lportal.backup.'
    );
}

const documentLibraryFiles = (
    await walkFiles('configs/local/data/document_library')
).filter(isFixtureFile);

if (!documentLibraryFiles.length) {
    failures.push(
        'The final fixture must contain at least one Documents and Media binary under configs/local/data/document_library.'
    );
}

const batchDirectories = [
    'client-extensions/nexcent-content-batch/batch',
    'client-extensions/nexcent-training-batch-lab/batch',
];
const batchPayloads = [];

for (const directory of batchDirectories) {
    batchPayloads.push(
        ...(await walkFiles(directory)).filter((file) =>
            file.endsWith('.batch-engine-data.json')
        )
    );
}

if (!batchPayloads.length) {
    failures.push(
        'At least one version-generated *.batch-engine-data.json payload is required.'
    );
}

const submissionText = await readFile(
    path.join(repositoryRoot, 'SUBMISSION.md'),
    'utf8'
);
const placeholders = submissionText.match(/<[^>\n]{1,120}>/g) ?? [];

if (placeholders.length) {
    failures.push(
        `SUBMISSION.md still contains placeholder values: ${[...new Set(placeholders)].slice(0, 8).join(', ')}`
    );
}

let manifest;

try {
    manifest = JSON.parse(
        await readFile(
            path.join(repositoryRoot, 'submission/evidence/manifest.json'),
            'utf8'
        )
    );
}
catch (error) {
    failures.push(`Unable to parse submission evidence manifest: ${error.message}`);
}

if (manifest) {
    if (manifest.submissionStatus !== 'READY') {
        failures.push('Evidence manifest submissionStatus must be READY.');
    }

    if (manifest.liferayProduct !== 'dxp-2026.q1.1-lts') {
        failures.push(
            'Evidence manifest must target dxp-2026.q1.1-lts.'
        );
    }

    if (!/^\d{4}-\d{2}-\d{2}T/.test(manifest.verifiedAt ?? '')) {
        failures.push('Evidence manifest verifiedAt is missing or invalid.');
    }

    if (!/^[0-9a-f]{40}$/.test(manifest.verifiedCommit ?? '')) {
        failures.push(
            'Evidence manifest verifiedCommit must be a 40 character commit SHA.'
        );
    }

    if (!Array.isArray(manifest.checks) || !manifest.checks.length) {
        failures.push('Evidence manifest must contain runtime checks.');
    }
    else {
        for (const check of manifest.checks) {
            if (check.status !== 'PASS') {
                failures.push(
                    `Evidence check ${check.id ?? '<missing id>'} is not PASS.`
                );
            }

            if (!String(check.evidence ?? '').trim()) {
                failures.push(
                    `Evidence check ${check.id ?? '<missing id>'} has no evidence.`
                );
            }
        }
    }
}

if (failures.length) {
    console.error('Final submission readiness verification failed:');

    for (const failure of failures) {
        console.error(`- ${failure}`);
    }

    process.exit(1);
}

console.log('Final submission is READY.');
console.log(`HSQL fixture files: ${hsqlFiles.length}`);
console.log(`Document library files: ${documentLibraryFiles.length}`);
console.log(`Batch payloads: ${batchPayloads.length}`);
