import {access, readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const projectDirectory = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    '..'
);
const fragmentDirectory = path.join(projectDirectory, 'fragments');

const headlessFragments = [
    'nexcent-react-hero',
    'nexcent-react-community',
    'nexcent-react-marketing',
];
const settingsFragments = [
    'nexcent-react-clients',
    'nexcent-react-feature-primary',
    'nexcent-react-statistics',
    'nexcent-react-feature-secondary',
    'nexcent-react-testimonial',
    'nexcent-react-cta',
];

for (const fragmentName of [...headlessFragments, ...settingsFragments]) {
    const directory = path.join(fragmentDirectory, fragmentName);
    const definitionPath = path.join(directory, 'fragment.json');
    const configurationPath = path.join(directory, 'configuration.json');
    const htmlPath = path.join(directory, 'index.html');

    await access(configurationPath);

    const definition = JSON.parse(await readFile(definitionPath, 'utf8'));
    const configuration = JSON.parse(await readFile(configurationPath, 'utf8'));
    const html = await readFile(htmlPath, 'utf8');

    if (definition.configurationPath !== 'configuration.json') {
        throw new Error(`${fragmentName} must declare configurationPath.`);
    }

    if (!Array.isArray(configuration.fieldSets) || configuration.fieldSets.length === 0) {
        throw new Error(`${fragmentName} must expose Fragment Settings.`);
    }

    if (!html.includes(`<${fragmentName}`)) {
        throw new Error(`${fragmentName} index.html must render its matching custom element.`);
    }
}

for (const fragmentName of headlessFragments) {
    const html = await readFile(
        path.join(fragmentDirectory, fragmentName, 'index.html'),
        'utf8'
    );

    for (const attribute of ['locale=', 'site-id=', 'structure-identifier=']) {
        if (!html.includes(attribute)) {
            throw new Error(`${fragmentName} is missing ${attribute}`);
        }
    }
}

for (const fragmentName of settingsFragments) {
    const html = await readFile(
        path.join(fragmentDirectory, fragmentName, 'index.html'),
        'utf8'
    );

    if (html.includes('structure-identifier=') || html.includes('site-id=')) {
        throw new Error(
            `${fragmentName} must use Fragment Settings props without a Headless source.`
        );
    }
}

const heroSource = await readFile(
    path.join(projectDirectory, 'src/static-site/components/Hero.tsx'),
    'utf8'
);
const sectionSource = await readFile(
    path.join(projectDirectory, 'src/static-site/components/ContentSections.tsx'),
    'utf8'
);
const headlessClient = await readFile(
    path.join(
        projectDirectory,
        'src/static-site/headless/headlessContentClient.ts'
    ),
    'utf8'
);

if (!heroSource.includes('useStructuredContentCollection')) {
    throw new Error('Hero must load Structured Content through the shared hook.');
}

for (const componentName of ['StaticCommunity', 'StaticMarketing']) {
    const componentStart = sectionSource.indexOf(`function ${componentName}`);
    const exportStart = sectionSource.indexOf(`export function ${componentName}`);

    if (componentStart < 0 && exportStart < 0) {
        throw new Error(`Missing ${componentName}.`);
    }
}

for (const endpoint of [
    '/content-structures?pageSize=200',
    '/structured-contents?pageSize=',
]) {
    if (!headlessClient.includes(endpoint)) {
        throw new Error(`Headless content client is missing ${endpoint}.`);
    }
}

console.log(
    `Validated ${headlessFragments.length} Headless sections and ${settingsFragments.length} Fragment Settings sections.`
);
