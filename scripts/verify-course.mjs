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
    if (!(await exists(relativePath))) {
        failures.push(`Missing required file: ${relativePath}`);
        return;
    }

    const content = await readFile(
        path.join(repositoryRoot, relativePath),
        'utf8'
    );

    for (const value of values) {
        if (!content.includes(value)) {
            failures.push(`${relativePath} does not contain: ${value}`);
        }
    }
}

const deliveryCourseFiles = [
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
    'gradlew',
    'gradlew.bat',
    'gradle/wrapper/gradle-wrapper.jar',
    'gradle/wrapper/gradle-wrapper.properties',
    'docs/contracts/component-contracts.md',
    ...deliveryCourseFiles.map((file) => `docs/course/${file}`),
    'docs/master-track/README.md',
    'docs/master-track/01-frontend-code-labs.md',
    'docs/master-track/02-content-code-labs.md',
    'docs/master-track/03-application-code-labs.md',
    'docs/master-track/04-migration-code-labs.md',
    'client-extensions/nexcent-theme/client-extension.yaml',
    'client-extensions/nexcent-theme/package.json',
    'client-extensions/nexcent-theme/assets/favicon.svg',
    'client-extensions/nexcent-theme/assets/global.css',
    'client-extensions/nexcent-theme/assets/global.js',
    'client-extensions/nexcent-theme/src/frontend-token-definition.json',
    'client-extensions/nexcent-theme/style-book/nexcent-default/style-book.json',
    'client-extensions/nexcent-theme/style-book/nexcent-default/frontend-tokens-values.json',
    'client-extensions/nexcent-landing-elements/client-extension.yaml',
    'client-extensions/nexcent-landing-elements/package.json',
    'client-extensions/nexcent-landing-elements/package-lock.json',
    'client-extensions/nexcent-landing-elements/src/index.tsx',
    'client-extensions/nexcent-remote-app-registration/client-extension.yaml',
    'remote-apps/nexcent-community-app/package.json',
    'remote-apps/nexcent-community-app/package-lock.json',
    'remote-apps/nexcent-community-app/src/index.tsx',
    'remote-apps/nexcent-community-app/src/styles.css',
    'client-extensions/nexcent-content-batch/client-extension.yaml',
    'client-extensions/nexcent-training-batch-lab/client-extension.yaml',
    'modules/nexcent-training/nexcent-training-osgi/build.gradle',
    'modules/nexcent-training/nexcent-training-service/service.xml',
    'modules/nexcent-training/nexcent-training-rest-impl/rest-config.yaml',
    'modules/nexcent-training/nexcent-training-rest-impl/rest-openapi.yaml',
    'training/master-track-code-labs/sample-data/nexcent-landing.mock.json',
    'training/master-track-code-labs/sample-data/community-articles.csv',
    'training/master-track-code-labs/scripts/validate-lab-kit.mjs',
    'training/master-track-code-labs/scripts/package-batch-export.mjs',
    'scripts/batch/prepare-structured-content-export.mjs',
    'scripts/assemble-vercel-output.mjs',
    'prototypes/nexcent-static/headless-adapter.mjs',
    'prototypes/nexcent-static/headless-adapter.test.mjs',
];

for (const requiredFile of requiredFiles) {
    await requireFile(requiredFile);
}

await requireText('gradle.properties', [
    'liferay.workspace.product=dxp-2026.q1.1-lts',
]);

await requireText('README.md', [
    'Nexcent Liferay Training Master Track',
    'Practitioner',
    'Frontend Developer',
    'Liferay Application Developer',
    'client-extensions/nexcent-theme',
    'modules/nexcent-training',
    'archive/course-v1',
    'SOURCE READY / RUNTIME PENDING',
]);

await requireText('docs/master-track/README.md', [
    'Code Lab Kit',
    'Service Builder',
    'REST Builder',
    'Batch Client Extension',
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

const themeRoot = 'client-extensions/nexcent-theme';

await requireText(`${themeRoot}/client-extension.yaml`, [
    'type: themeCSS',
    'frontendTokenDefinitionJSON: src/frontend-token-definition.json',
    'type: globalCSS',
    'type: globalJS',
    'type: themeFavicon',
]);
await requireText(`${themeRoot}/package.json`, ['"baseTheme": "styled"']);
await requireText(`${themeRoot}/assets/global.css`, [
    'var(--nxc-style-primary, #4caf4f)',
    'var(--nxc-style-container-width, 73.875rem)',
    'var(--nxc-style-body-size, 0.875rem)',
    '.nxc-site-header',
    '.nxc-site-footer',
    '.nxc-newsletter',
]);
await requireText(`${themeRoot}/assets/global.js`, [
    'window.Nexcent',
    'getPortalContext',
    'getStyleToken',
]);

await requireText(
    'client-extensions/nexcent-remote-app-registration/client-extension.yaml',
    [
        'baseURL: https://nexcent-liferay-static.vercel.app/remote-app',
        'htmlElementName: nexcent-community-app',
        'type: customElement',
        'useESM: true',
    ]
);

await requireText('remote-apps/nexcent-community-app/src/index.tsx', [
    "const ELEMENT_NAME = 'nexcent-community-app'",
    'NXC Community Intro',
    'NXC Community Card',
    "status: 'loading'",
    "status: 'empty'",
    "status: 'error'",
]);

for (const batchConfig of [
    'client-extensions/nexcent-content-batch/client-extension.yaml',
    'client-extensions/nexcent-training-batch-lab/client-extension.yaml',
]) {
    await requireText(batchConfig, [
        'type: batch',
        'type: oAuthApplicationHeadlessServer',
        'Liferay.Headless.Batch.Engine.everything',
        'Liferay.Headless.Delivery.everything',
    ]);
}

await requireText(
    'modules/nexcent-training/nexcent-training-osgi/src/main/java/com/nexcent/training/osgi/internal/NexcentTrainingStatusComponent.java',
    [
        '@Component',
        '@Reference',
        'osgi.command.scope=nexcent',
        'osgi.command.function=status',
    ]
);
await requireText(
    'modules/nexcent-training/nexcent-training-service/service.xml',
    ['name="ImportJob"', 'name="externalReferenceCode"', 'name="ERC_G"']
);
await requireText(
    'modules/nexcent-training/nexcent-training-rest-impl/rest-openapi.yaml',
    ['postSiteImportJob', 'getSiteImportJob']
);

const tokenDefinitionPath = `${themeRoot}/src/frontend-token-definition.json`;
const styleBookPath = `${themeRoot}/style-book/nexcent-default/style-book.json`;
const styleBookValuesPath = `${themeRoot}/style-book/nexcent-default/frontend-tokens-values.json`;

if (
    await exists(tokenDefinitionPath) &&
    await exists(styleBookPath) &&
    await exists(styleBookValuesPath)
) {
    const definition = JSON.parse(
        await readFile(path.join(repositoryRoot, tokenDefinitionPath), 'utf8')
    );
    const values = JSON.parse(
        await readFile(path.join(repositoryRoot, styleBookValuesPath), 'utf8')
    );
    const styleBook = JSON.parse(
        await readFile(path.join(repositoryRoot, styleBookPath), 'utf8')
    );
    const tokens = (definition.frontendTokenCategories ?? []).flatMap(
        (category) => (category.frontendTokenSets ?? []).flatMap(
            (tokenSet) => tokenSet.frontendTokens ?? []
        )
    );
    const names = tokens.map((token) => token.name);
    const mappings = tokens.map((token) =>
        (token.mappings ?? []).find(
            (mapping) => mapping.type === 'cssVariable'
        )?.value
    );

    if (!tokens.length) {
        failures.push('Theme frontend token definition is empty.');
    }
    if (new Set(names).size !== names.length) {
        failures.push('Theme frontend token names are not unique.');
    }
    if (mappings.some((mapping) => !mapping)) {
        failures.push('Every theme token must define a CSS variable mapping.');
    }
    if (new Set(mappings).size !== mappings.length) {
        failures.push('Theme CSS variable mappings are not unique.');
    }

    for (const token of tokens) {
        const configured = values[token.name];
        const mapping = token.mappings?.find(
            (item) => item.type === 'cssVariable'
        )?.value;

        if (!configured) {
            failures.push(`Style Book is missing token: ${token.name}`);
        }
        else if (configured.cssVariableMapping !== mapping) {
            failures.push(`Style Book mapping mismatch: ${token.name}`);
        }
    }

    if (styleBook.name !== 'Nexcent Default') {
        failures.push('The default Style Book must be named Nexcent Default.');
    }
    if (styleBook.themeId !== 'nexcent-theme-css') {
        failures.push('The Style Book must target nexcent-theme-css.');
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
    if (!(await exists(relativeDirectory))) {
        return;
    }

    const directory = path.join(repositoryRoot, relativeDirectory);

    for (const entry of await readdir(directory, {withFileTypes: true})) {
        const relativePath = path.join(relativeDirectory, entry.name);

        if (entry.isDirectory()) {
            await scanFrontendDirectory(relativePath);
            continue;
        }

        if (!/\.(css|js|jsx|ts|tsx)$/.test(entry.name)) {
            continue;
        }

        const content = await readFile(
            path.join(repositoryRoot, relativePath),
            'utf8'
        );

        for (const forbiddenText of forbiddenBusinessText) {
            if (content.includes(forbiddenText)) {
                failures.push(
                    `${relativePath} contains hard-coded business content: ${forbiddenText}`
                );
            }
        }
    }
}

await scanFrontendDirectory('client-extensions/nexcent-landing-elements/src');
await scanFrontendDirectory('remote-apps/nexcent-community-app/src');

if (await exists('docs/lab-guide')) {
    const legacyLessons = (
        await readdir(path.join(repositoryRoot, 'docs/lab-guide'))
    ).filter((file) => file.endsWith('.md'));

    if (legacyLessons.length) {
        failures.push(
            `Legacy lessons remain under docs/lab-guide: ${legacyLessons.join(', ')}`
        );
    }
}

if (failures.length) {
    console.error('Course contract verification failed:');

    for (const failure of failures) {
        console.error(`- ${failure}`);
    }

    process.exit(1);
}

console.log(
    `Course contract verification passed with ${requiredFiles.length} required files.`
);
