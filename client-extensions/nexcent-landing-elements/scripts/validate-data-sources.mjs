import {access, readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const projectDirectory = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    '..'
);
const fragmentDirectory = path.join(projectDirectory, 'fragments');

const headlessFragmentDefaults = {
    'nexcent-react-community': 'NXC_SERVICE_ITEM',
    'nexcent-react-hero': 'NXC_LANDING_HERO',
    'nexcent-react-marketing': 'NXC_ARTICLE',
};
const headlessFragments = Object.keys(headlessFragmentDefaults);
const settingsFragments = [
    'nexcent-react-clients',
    'nexcent-react-feature-primary',
    'nexcent-react-statistics',
    'nexcent-react-feature-secondary',
    'nexcent-react-testimonial',
    'nexcent-react-cta',
];

async function readJson(filePath) {
    return JSON.parse(await readFile(filePath, 'utf8'));
}

function configurationFields(configuration) {
    return configuration.fieldSets.flatMap((fieldSet) => fieldSet.fields ?? []);
}

for (const fragmentName of [...headlessFragments, ...settingsFragments]) {
    const directory = path.join(fragmentDirectory, fragmentName);
    const definitionPath = path.join(directory, 'fragment.json');
    const configurationPath = path.join(directory, 'configuration.json');
    const htmlPath = path.join(directory, 'index.html');

    await access(configurationPath);

    const definition = await readJson(definitionPath);
    const configuration = await readJson(configurationPath);
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

    if (fragmentName in headlessFragmentDefaults) {
        const structureField = configurationFields(configuration).find(
            (field) => field.name === 'structureIdentifier'
        );
        const expectedDefault = headlessFragmentDefaults[fragmentName];

        if (structureField?.defaultValue !== expectedDefault) {
            throw new Error(
                `${fragmentName} must default to Structure ERC/key "${expectedDefault}".`
            );
        }
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

const articleFragmentHtml = await readFile(
    path.join(fragmentDirectory, 'nexcent-react-marketing', 'index.html'),
    'utf8'
);

if (!articleFragmentHtml.includes('site-base-url=')) {
    throw new Error('Article list Fragment must pass the current Site display URL.');
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

const shellContracts = {
    'nexcent-react-footer': {
        embeddedPropsMarker: 'data-nexcent-footer-props',
        selectors: [
            'companyNavigation',
            'supportNavigation',
            'socialNavigation',
        ],
    },
    'nexcent-react-header': {
        embeddedPropsMarker: 'data-nexcent-header-props',
        selectors: ['navigationSource'],
    },
};

for (const [fragmentName, contract] of Object.entries(shellContracts)) {
    const directory = path.join(fragmentDirectory, fragmentName);
    const configuration = await readJson(
        path.join(directory, 'configuration.json')
    );
    const html = await readFile(path.join(directory, 'index.html'), 'utf8');
    const fields = configurationFields(configuration);

    for (const selectorName of contract.selectors) {
        const selector = fields.find((field) => field.name === selectorName);

        if (selector?.type !== 'navigationMenuSelector') {
            throw new Error(
                `${fragmentName} must expose ${selectorName} as navigationMenuSelector.`
            );
        }
    }

    if (!html.includes(contract.embeddedPropsMarker)) {
        throw new Error(
            `${fragmentName} must embed its Liferay context as JSON props.`
        );
    }
}

const componentSources = {
    Articles: await readFile(
        path.join(
            projectDirectory,
            'src/static-site/components/Articles/Articles.tsx'
        ),
        'utf8'
    ),
    Community: await readFile(
        path.join(
            projectDirectory,
            'src/static-site/components/Community/Community.tsx'
        ),
        'utf8'
    ),
    Footer: await readFile(
        path.join(projectDirectory, 'src/static-site/components/Footer.tsx'),
        'utf8'
    ),
    Header: await readFile(
        path.join(projectDirectory, 'src/static-site/components/Header.tsx'),
        'utf8'
    ),
    Hero: await readFile(
        path.join(projectDirectory, 'src/static-site/components/Hero.tsx'),
        'utf8'
    ),
};
const articleMapper = await readFile(
    path.join(
        projectDirectory,
        'src/static-site/components/Articles/articleMapper.ts'
    ),
    'utf8'
);
const sharedHeadlessApi = await readFile(
    path.join(projectDirectory, 'src/api/structuredContent.ts'),
    'utf8'
);
const headlessAdapter = await readFile(
    path.join(
        projectDirectory,
        'src/static-site/headless/headlessContentClient.ts'
    ),
    'utf8'
);
const headlessHook = await readFile(
    path.join(
        projectDirectory,
        'src/static-site/headless/useStructuredContentCollection.ts'
    ),
    'utf8'
);
const staticPageSource = await readFile(
    path.join(projectDirectory, 'src/static-site/StaticPage.tsx'),
    'utf8'
);

for (const componentName of ['Header', 'Footer']) {
    if (componentSources[componentName].includes('useSiteShell')) {
        throw new Error(
            `${componentName} must consume embedded Fragment props without the Site Shell BFF.`
        );
    }
}

for (const componentName of ['Hero', 'Community', 'Articles']) {
    if (!componentSources[componentName].includes('useStructuredContentCollection')) {
        throw new Error(
            `${componentName} must load Structured Content through the shared hook.`
        );
    }
}

for (const expectedComponent of [
    '<Clients />',
    '<Community />',
    '<Feature featureKey="primary" />',
    '<Statistics />',
    '<Testimonial />',
    '<Articles />',
    '<Cta />',
]) {
    if (!staticPageSource.includes(expectedComponent)) {
        throw new Error(`Preview page is missing production component ${expectedComponent}.`);
    }
}

for (const expected of [
    '/content-structures?pageSize=200',
    'new URLSearchParams',
    "query.set('flatten', 'true')",
    'options.pageSize',
    'friendlyUrlPath?: string',
]) {
    if (!sharedHeadlessApi.includes(expected)) {
        throw new Error(`Shared Structured Content API is missing ${expected}.`);
    }
}

if (sharedHeadlessApi.includes('contentUrl?: string;\n    datePublished')) {
    throw new Error('StructuredContent must not declare the unsupported contentUrl property.');
}

for (const sharedFunction of [
    'resolveContentStructure',
    'listStructuredContents',
    'clearStructuredContentRequestCache',
]) {
    if (!headlessAdapter.includes(sharedFunction)) {
        throw new Error(
            `Headless adapter must reuse ${sharedFunction}.`
        );
    }
}

if (headlessAdapter.includes("sort: 'contentFields/sortOrder:asc'")) {
    throw new Error(
        'The generic Structured Content loader must not sort by an optional Structure field on the server.'
    );
}

for (const expected of ['content.datePublished', 'flatten: true']) {
    if (!headlessAdapter.includes(expected)) {
        throw new Error(`Headless delivery contract is missing ${expected}.`);
    }
}

for (const expected of [
    "['coverImage']",
    'structuredContent.friendlyUrlPath',
    '`$\{base}/w/$\{path}`',
]) {
    if (!articleMapper.includes(expected)) {
        throw new Error(`Article mapper contract is missing ${expected}.`);
    }
}

for (const expected of ["'site-base-url'", 'previewItems: PREVIEW_ARTICLES']) {
    if (!componentSources.Articles.includes(expected)) {
        throw new Error(`Article component contract is missing ${expected}.`);
    }
}

if (
    componentSources.Articles.includes('structuredContent.contentUrl') ||
    articleMapper.includes('structuredContent.contentUrl')
) {
    throw new Error('Article list must not depend on unsupported StructuredContent.contentUrl.');
}

if (!headlessHook.includes('pageSize: maxItems')) {
    throw new Error('Fragment maximum items must be passed to the Headless loader.');
}

if (!headlessHook.includes("items: host ? []")) {
    throw new Error('Runtime Headless loading must not render preview fixture items.');
}

for (const [componentName, source] of Object.entries(componentSources)) {
    if (source.includes("fallback/content.json")) {
        throw new Error(
            `${componentName} must not import the page-level fallback content snapshot.`
        );
    }
}

if (sharedHeadlessApi.includes('item.name, item.id')) {
    throw new Error('Structure resolution must not use the editable display name.');
}

console.log(
    `Validated ${headlessFragments.length} Headless sections, ${settingsFragments.length} Fragment Settings sections, ${Object.keys(shellContracts).length} embedded shell contracts, extracted production components, and the NXC_ARTICLE delivery contract.`
);
