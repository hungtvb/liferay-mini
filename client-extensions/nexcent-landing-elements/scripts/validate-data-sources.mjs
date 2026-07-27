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
const settingsFragments = [
    'nexcent-react-clients',
    'nexcent-react-feature-primary',
    'nexcent-react-statistics',
    'nexcent-react-feature-secondary',
    'nexcent-react-testimonial',
    'nexcent-react-cta',
];

async function exists(filePath) {
    try {
        await access(filePath);
        return true;
    }
    catch {
        return false;
    }
}

async function readJson(filePath) {
    return JSON.parse(await readFile(filePath, 'utf8'));
}

function configurationFields(configuration) {
    return configuration.fieldSets.flatMap((fieldSet) => fieldSet.fields ?? []);
}

for (const fragmentName of [
    ...Object.keys(headlessFragmentDefaults),
    ...settingsFragments,
]) {
    const directory = path.join(fragmentDirectory, fragmentName);
    const definition = await readJson(path.join(directory, 'fragment.json'));
    const configuration = await readJson(
        path.join(directory, 'configuration.json')
    );
    const html = await readFile(path.join(directory, 'index.html'), 'utf8');

    if (definition.configurationPath !== 'configuration.json') {
        throw new Error(`${fragmentName} must declare configurationPath.`);
    }

    if (!configurationFields(configuration).length) {
        throw new Error(`${fragmentName} must expose Fragment Settings.`);
    }

    if (!html.includes(`<${fragmentName}`)) {
        throw new Error(`${fragmentName} must render its matching custom element.`);
    }

    const expectedStructure = headlessFragmentDefaults[fragmentName];

    if (expectedStructure) {
        const structureField = configurationFields(configuration).find(
            (field) => field.name === 'structureIdentifier'
        );

        if (structureField?.defaultValue !== expectedStructure) {
            throw new Error(
                `${fragmentName} must default to ${expectedStructure}.`
            );
        }

        for (const attribute of [
            'locale=',
            'site-id=',
            'structure-identifier=',
        ]) {
            if (!html.includes(attribute)) {
                throw new Error(`${fragmentName} is missing ${attribute}`);
            }
        }
    }
    else if (
        html.includes('structure-identifier=') ||
        html.includes('site-id=')
    ) {
        throw new Error(
            `${fragmentName} must use Fragment Settings without a Headless source.`
        );
    }
}

const articleFragmentHtml = await readFile(
    path.join(fragmentDirectory, 'nexcent-react-marketing', 'index.html'),
    'utf8'
);

if (!articleFragmentHtml.includes('site-base-url=')) {
    throw new Error('Articles Fragment must pass the current Site display URL.');
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
        if (
            fields.find((field) => field.name === selectorName)?.type !==
            'navigationMenuSelector'
        ) {
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

const sourcePaths = {
    Articles: 'src/static-site/components/Articles/Articles.tsx',
    ArticleMapper: 'src/static-site/components/Articles/articleMapper.ts',
    Community: 'src/static-site/components/Community/Community.tsx',
    Footer: 'src/static-site/components/Footer/Footer.tsx',
    Header: 'src/static-site/components/Header/Header.tsx',
    Hero: 'src/static-site/components/Hero.tsx',
    Hook: 'src/static-site/headless/useStructuredContentCollection.ts',
    Page: 'src/static-site/StaticPage.tsx',
    Register: 'src/static-site/registerStaticElements.tsx',
    StyleBoundary: 'src/static-site/StaticStyleBoundary.tsx',
};
const sources = Object.fromEntries(
    await Promise.all(
        Object.entries(sourcePaths).map(async ([name, sourcePath]) => [
            name,
            await readFile(path.join(projectDirectory, sourcePath), 'utf8'),
        ])
    )
);

for (const obsoletePath of [
    'src/static-site/components/ContentSections.tsx',
    'src/static-site/components/ArticleSection.tsx',
    'src/static-site/StaticRuntimeOverrides.tsx',
    'src/static-site/fallback/assets/css/style.css',
    'src/static-site/fallback/assets/css/style.css.map',
]) {
    if (await exists(path.join(projectDirectory, obsoletePath))) {
        throw new Error(`Obsolete source still exists: ${obsoletePath}`);
    }
}

for (const componentName of ['Hero', 'Community', 'Articles']) {
    if (!sources[componentName].includes('useStructuredContentCollection')) {
        throw new Error(`${componentName} must use the shared Headless hook.`);
    }
}

for (const componentName of ['Header', 'Footer']) {
    if (
        sources[componentName].includes('fallback/content.json') ||
        sources[componentName].includes('useSiteShell')
    ) {
        throw new Error(
            `${componentName} must use embedded props without page fallback data or Site Shell requests.`
        );
    }
}

for (const expected of [
    "['coverImage']",
    'structuredContent.friendlyUrlPath',
    'return `${base}/w/${path}`',
]) {
    if (!sources.ArticleMapper.includes(expected)) {
        throw new Error(`Article mapper is missing contract: ${expected}`);
    }
}

if (
    sources.ArticleMapper.includes('structuredContent.contentUrl') ||
    sources.Articles.includes('structuredContent.contentUrl')
) {
    throw new Error('Articles must not depend on StructuredContent.contentUrl.');
}

for (const expected of [
    "'site-base-url'",
    'previewItems: PREVIEW_ARTICLES',
]) {
    if (!sources.Articles.includes(expected)) {
        throw new Error(`Articles component is missing contract: ${expected}`);
    }
}

if (
    !sources.Hook.includes('items: host ? []') ||
    !sources.Hook.includes("setState({items: [], status: 'loading'})") ||
    !sources.Hook.includes("setState({error, items: [], status: 'error'})")
) {
    throw new Error('Runtime Headless states must never render preview items.');
}

for (const component of [
    'Clients',
    'Community',
    'Feature',
    'Statistics',
    'Testimonial',
    'Articles',
    'Cta',
]) {
    if (!sources.Page.includes(`<${component}`)) {
        throw new Error(`Preview page is missing production ${component}.`);
    }
}

if (
    !sources.Register.includes("'nexcent-react-marketing'") ||
    !sources.Register.includes("'nexcent-react-articles'")
) {
    throw new Error('Articles must preserve the Marketing alias during migration.');
}

if (
    !sources.StyleBoundary.includes("landing.scss?inline") ||
    sources.StyleBoundary.includes('normalizeStaticCss') ||
    sources.StyleBoundary.includes('LOCAL_OVERRIDES')
) {
    throw new Error('Shadow styles must come from compiled landing.scss only.');
}

await access(
    path.join(projectDirectory, 'src/static-site/styles/landing.scss')
);

console.log(
    'Validated Fragment sources, extracted components, runtime states, Articles delivery, and the compiled SCSS contract.'
);
