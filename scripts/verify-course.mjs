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

async function requireText(relativePath, values) {
    const absolutePath = path.join(repositoryRoot, relativePath);

    if (!(await exists(relativePath))) {
        failures.push(`Missing required file: ${relativePath}`);
        return;
    }

    const content = await readFile(absolutePath, 'utf8');

    for (const value of values) {
        if (!content.includes(value)) {
            failures.push(`${relativePath} does not contain: ${value}`);
        }
    }
}

const requiredFiles = [
    'README.md',
    'SUBMISSION.md',
    'gradle.properties',
    'client-extensions/nexcent-global-assets/client-extension.yaml',
    'client-extensions/nexcent-global-assets/assets/global.css',
    'client-extensions/nexcent-global-assets/assets/global.js',
    'client-extensions/nexcent-landing-elements/client-extension.yaml',
    'client-extensions/nexcent-landing-elements/package.json',
    'client-extensions/nexcent-landing-elements/src/index.tsx',
    'client-extensions/nexcent-content-batch/client-extension.yaml',
    'scripts/batch/prepare-structured-content-export.mjs',
    'scripts/batch/export-structured-content.sh',
    'scripts/batch/export-structured-content.ps1',
    'sample-data/json/landing-content.json',
    'sample-data/csv/heroes.csv',
    'sample-data/csv/services-intro.csv',
    'sample-data/csv/services.csv',
    'sample-data/csv/features.csv',
];

for (const requiredFile of requiredFiles) {
    await requireFile(requiredFile);
}

for (let lesson = 0; lesson <= 14; lesson++) {
    const prefix = String(lesson).padStart(2, '0');
    const lessonFiles = (await readdir(path.join(repositoryRoot, 'docs/lab-guide')))
        .filter((file) => file.startsWith(`${prefix}-`) && file.endsWith('.md'));

    if (lessonFiles.length !== 1) {
        failures.push(
            `Expected exactly one Lab ${prefix} Markdown file, found ${lessonFiles.length}.`
        );
    }
}

await requireText('gradle.properties', [
    'liferay.workspace.product=dxp-2026.q1.1-lts',
]);

await requireText(
    'client-extensions/nexcent-landing-elements/client-extension.yaml',
    [
        'htmlElementName: nexcent-hero',
        'htmlElementName: nexcent-services',
        'htmlElementName: nexcent-features',
        'htmlElementName: nexcent-content-importer',
        'useESM: true',
    ]
);

await requireText(
    'client-extensions/nexcent-global-assets/client-extension.yaml',
    ['type: globalCSS', 'type: globalJS', 'scope: company']
);

await requireText(
    'client-extensions/nexcent-content-batch/client-extension.yaml',
    [
        'type: batch',
        'type: oAuthApplicationHeadlessServer',
        'Liferay.Headless.Batch.Engine.everything',
        'Liferay.Headless.Delivery.everything',
    ]
);

await requireText('client-extensions/nexcent-landing-elements/package.json', [
    '"exceljs": "4.4.0"',
    '"generate:workbook"',
]);

const sampleDataPath = path.join(
    repositoryRoot,
    'sample-data/json/landing-content.json'
);

if (await exists('sample-data/json/landing-content.json')) {
    const sampleData = JSON.parse(await readFile(sampleDataPath, 'utf8'));
    const expectedCounts = {
        features: 2,
        hero: 1,
        services: 3,
        servicesIntro: 1,
    };
    const externalReferenceCodes = [];

    for (const [section, expectedCount] of Object.entries(expectedCounts)) {
        const items = sampleData[section];

        if (!Array.isArray(items)) {
            failures.push(`Sample data section ${section} is not an array.`);
            continue;
        }

        if (items.length !== expectedCount) {
            failures.push(
                `Sample data section ${section} expected ${expectedCount} items, found ${items.length}.`
            );
        }

        for (const item of items) {
            if (!String(item.externalReferenceCode ?? '').startsWith('NXC-')) {
                failures.push(
                    `${section} item has an invalid externalReferenceCode: ${item.externalReferenceCode}`
                );
            }

            externalReferenceCodes.push(item.externalReferenceCode);
        }
    }

    if (new Set(externalReferenceCodes).size !== externalReferenceCodes.length) {
        failures.push('Sample data contains duplicate externalReferenceCode values.');
    }

    if (externalReferenceCodes.length !== 7) {
        failures.push(
            `Expected seven sample ERCs, found ${externalReferenceCodes.length}.`
        );
    }
}

const frontendDirectory = path.join(
    repositoryRoot,
    'client-extensions/nexcent-landing-elements/src'
);
const forbiddenBusinessText = [
    'Lessons and insights',
    'Membership Organisations',
    'National Associations',
    'Clubs and Groups',
    'The unseen of spending three years at Pixelgrade',
];

async function scanDirectory(directory) {
    for (const entry of await readdir(directory, {withFileTypes: true})) {
        const absolutePath = path.join(directory, entry.name);

        if (entry.isDirectory()) {
            await scanDirectory(absolutePath);
            continue;
        }

        if (!/\.(css|ts|tsx)$/.test(entry.name)) {
            continue;
        }

        const content = await readFile(absolutePath, 'utf8');

        for (const forbiddenText of forbiddenBusinessText) {
            if (content.includes(forbiddenText)) {
                failures.push(
                    `Frontend source hard-codes sample content "${forbiddenText}" in ${path.relative(repositoryRoot, absolutePath)}.`
                );
            }
        }
    }
}

if (await exists('client-extensions/nexcent-landing-elements/src')) {
    await scanDirectory(frontendDirectory);
}

if (await exists('docker-compose.yml')) {
    failures.push('docker-compose.yml must not be part of the local initBundle course.');
}

if (failures.length) {
    console.error('Course contract verification failed:\n');

    for (const failure of failures) {
        console.error(`- ${failure}`);
    }

    process.exit(1);
}

console.log('Course contract verification passed.');
console.log('- Liferay DXP 2026.Q1.1 LTS baseline');
console.log('- Labs 00–14 present');
console.log('- Hero, Services, Features, and Importer Custom Elements');
console.log('- Company-scoped Global CSS and JavaScript');
console.log('- Batch Client Extension and OAuth scopes');
console.log('- Seven unique NXC sample records');
console.log('- No sample business content hard-coded in frontend source');
