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

const courseFiles = [
    '00-project-brief.md',
    '01-figma-audit.md',
    '02-fe-be-contracts.md',
    '03-design-system.md',
    '04-content-foundation.md',
    '05-header-hero-clients.md',
    '06-services-features.md',
    '07-remaining-components.md',
    '08-remote-app.md',
    '09-excel-importer.md',
    '10-batch-migration.md',
    '11-integration-qa.md',
];

const requiredFiles = [
    'README.md',
    'SUBMISSION.md',
    'gradle.properties',
    'docs/contracts/component-contracts.md',
    ...courseFiles.map((file) => `docs/course/${file}`),
    'client-extensions/nexcent-global-assets/client-extension.yaml',
    'client-extensions/nexcent-global-assets/assets/global.css',
    'client-extensions/nexcent-global-assets/assets/global.js',
    'client-extensions/nexcent-theme-css/client-extension.yaml',
    'client-extensions/nexcent-theme-css/package.json',
    'client-extensions/nexcent-theme-css/src/frontend-token-definition.json',
    'client-extensions/nexcent-landing-elements/client-extension.yaml',
    'client-extensions/nexcent-landing-elements/package.json',
    'client-extensions/nexcent-landing-elements/src/index.tsx',
    'client-extensions/nexcent-remote-app-registration/client-extension.yaml',
    'remote-apps/nexcent-community-app/package.json',
    'remote-apps/nexcent-community-app/tsconfig.json',
    'remote-apps/nexcent-community-app/vite.config.ts',
    'remote-apps/nexcent-community-app/public/index.html',
    'remote-apps/nexcent-community-app/src/index.tsx',
    'remote-apps/nexcent-community-app/src/styles.css',
    'client-extensions/nexcent-content-batch/client-extension.yaml',
    'scripts/batch/prepare-structured-content-export.mjs',
    'scripts/batch/export-structured-content.sh',
    'scripts/batch/export-structured-content.ps1',
];

for (const requiredFile of requiredFiles) {
    await requireFile(requiredFile);
}

if (await exists('docs/lab-guide')) {
    const oldLessons = (await readdir(path.join(repositoryRoot, 'docs/lab-guide')))
        .filter((file) => file.endsWith('.md'));

    if (oldLessons.length) {
        failures.push(
            `Legacy v1 lessons remain under docs/lab-guide: ${oldLessons.join(', ')}`
        );
    }
}

await requireText('gradle.properties', [
    'liferay.workspace.product=dxp-2026.q1.1-lts',
]);

await requireText('README.md', [
    'coordinated frontend/backend delivery project',
    'Community Updates Remote App',
    'archive/course-v1',
    'Explicit non-goals',
]);

await requireText('docs/contracts/component-contracts.md', [
    'NXC Landing Hero',
    'NXC Client Logo',
    'NXC Services Intro',
    'NXC Service Item',
    'NXC Feature Item',
    'NXC Statistics Intro',
    'NXC Statistic Item',
    'NXC Testimonial',
    'NXC Community Intro',
    'NXC Community Card',
    'NXC CTA',
    'Joint FE–BE Definition of Done',
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
    'client-extensions/nexcent-global-assets/assets/global.css',
    [
        'var(--nxc-style-primary, #4caf4f)',
        'var(--nxc-style-container-width, 72rem)',
        'var(--nxc-style-radius-md, 0.75rem)',
    ]
);

await requireText(
    'client-extensions/nexcent-theme-css/client-extension.yaml',
    [
        'type: themeCSS',
        'clayURL: css/clay.css',
        'mainURL: css/main.css',
        'frontendTokenDefinitionJSON: src/frontend-token-definition.json',
    ]
);

await requireText('client-extensions/nexcent-theme-css/package.json', [
    '"baseTheme": "styled"',
]);

await requireText(
    'client-extensions/nexcent-remote-app-registration/client-extension.yaml',
    [
        'baseURL: http://localhost:4173',
        'htmlElementName: nexcent-community-app',
        'type: customElement',
        'useESM: true',
    ]
);

await requireText('remote-apps/nexcent-community-app/package.json', [
    '"build": "vite build"',
    '"preview": "vite preview --host 0.0.0.0 --port 4173"',
    '"typecheck": "tsc --noEmit"',
]);

await requireText('remote-apps/nexcent-community-app/src/index.tsx', [
    "const ELEMENT_NAME = 'nexcent-community-app'",
    'NXC Community Intro',
    'NXC Community Card',
    "status: 'loading'",
    "status: 'empty'",
    "status: 'error'",
]);

await requireText(
    'client-extensions/nexcent-content-batch/client-extension.yaml',
    [
        'type: batch',
        'type: oAuthApplicationHeadlessServer',
        'Liferay.Headless.Batch.Engine.everything',
        'Liferay.Headless.Delivery.everything',
    ]
);

if (await exists('client-extensions/nexcent-theme-css/src/frontend-token-definition.json')) {
    const definition = JSON.parse(
        await readFile(
            path.join(
                repositoryRoot,
                'client-extensions/nexcent-theme-css/src/frontend-token-definition.json'
            ),
            'utf8'
        )
    );
    const categories = definition.frontendTokenCategories;

    if (!Array.isArray(categories) || categories.length < 2) {
        failures.push('Style Book token definition must contain at least two categories.');
    }
    else {
        const tokens = categories.flatMap((category) =>
            (category.frontendTokenSets ?? []).flatMap(
                (tokenSet) => tokenSet.frontendTokens ?? []
            )
        );
        const tokenNames = tokens.map((token) => token.name);
        const mappings = tokens.flatMap((token) =>
            (token.mappings ?? [])
                .filter((mapping) => mapping.type === 'cssVariable')
                .map((mapping) => mapping.value)
        );

        if (new Set(tokenNames).size !== tokenNames.length) {
            failures.push('Style Book token definition contains duplicate token names.');
        }

        if (new Set(mappings).size !== mappings.length) {
            failures.push('Style Book token definition contains duplicate CSS variable mappings.');
        }

        for (const required of [
            'nxc-style-primary',
            'nxc-style-font-family',
            'nxc-style-container-width',
            'nxc-style-section-space',
            'nxc-style-radius-md',
        ]) {
            if (!mappings.includes(required)) {
                failures.push(`Style Book token definition is missing mapping: ${required}`);
            }
        }
    }
}

const forbiddenBusinessText = [
    'Lessons and insights',
    'Membership Organisations',
    'National Associations',
    'Clubs and Groups',
    'The unseen of spending three years at Pixelgrade',
];

async function scanFrontendDirectory(relativeDirectory) {
    const directory = path.join(repositoryRoot, relativeDirectory);

    if (!(await exists(relativeDirectory))) {
        return;
    }

    for (const entry of await readdir(directory, {withFileTypes: true})) {
        const absolutePath = path.join(directory, entry.name);
        const relativePath = path.relative(repositoryRoot, absolutePath);

        if (entry.isDirectory()) {
            await scanFrontendDirectory(relativePath);
            continue;
        }

        if (!/\.(css|js|jsx|ts|tsx)$/.test(entry.name)) {
            continue;
        }

        const content = await readFile(absolutePath, 'utf8');

        for (const forbiddenText of forbiddenBusinessText) {
            if (content.includes(forbiddenText)) {
                failures.push(
                    `Frontend source hard-codes sample content "${forbiddenText}" in ${relativePath}.`
                );
            }
        }
    }
}

await scanFrontendDirectory('client-extensions/nexcent-landing-elements/src');
await scanFrontendDirectory('remote-apps/nexcent-community-app/src');

for (const forbiddenPath of ['docker-compose.yml', 'modules']) {
    if (await exists(forbiddenPath)) {
        failures.push(
            `${forbiddenPath} is outside the rebuilt core project scope.`
        );
    }
}

if (failures.length) {
    console.error('Rebuilt project contract verification failed:\n');

    for (const failure of failures) {
        console.error(`- ${failure}`);
    }

    process.exit(1);
}

console.log('Rebuilt project contract verification passed.');
console.log('- Original FE–BE Figma scope');
console.log('- Twelve rebuilt course chapters');
console.log('- Component-by-component FE–BE contracts');
console.log('- Theme CSS, Style Book, Global CSS, and Global JavaScript');
console.log('- Hero, Services, Features, and Importer Custom Elements');
console.log('- Externally hosted Community Remote App scaffold');
console.log('- Web Content, Excel, Batch Client Extension, and Headless Batch scope');
console.log('- No unrelated backend platform modules in core scope');
