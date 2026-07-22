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
    'nexcent-react-marketing': 'NXC_COMMUNITY_CARD',
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

    if (fragmentName in headlessFragmentDefaults) {
        const fields = configuration.fieldSets.flatMap((fieldSet) => fieldSet.fields ?? []);
        const structureField = fields.find(
            (field) => field.name === 'structureIdentifier'
        );
        const expectedDefault = headlessFragmentDefaults[fragmentName];

        if (structureField?.defaultValue !== expectedDefault) {
            throw new Error(
                `${fragmentName} must default to Structure key "${expectedDefault}".`
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
    const configuration = JSON.parse(
        await readFile(path.join(directory, 'configuration.json'), 'utf8')
    );
    const html = await readFile(path.join(directory, 'index.html'), 'utf8');
    const fields = configuration.fieldSets.flatMap(
        (fieldSet) => fieldSet.fields ?? []
    );

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

const footerConfiguration = JSON.parse(
    await readFile(
        path.join(
            fragmentDirectory,
            'nexcent-react-footer',
            'configuration.json'
        ),
        'utf8'
    )
);
const footerFields = footerConfiguration.fieldSets.flatMap(
    (fieldSet) => fieldSet.fields ?? []
);

for (const obsoleteSocialField of [
    'instagramURL',
    'dribbbleURL',
    'twitterURL',
    'youtubeURL',
]) {
    if (footerFields.some((field) => field.name === obsoleteSocialField)) {
        throw new Error(
            `Footer must use Social Navigation instead of ${obsoleteSocialField}.`
        );
    }
}

const headerSource = await readFile(
    path.join(projectDirectory, 'src/static-site/components/Header.tsx'),
    'utf8'
);
const footerSource = await readFile(
    path.join(projectDirectory, 'src/static-site/components/Footer.tsx'),
    'utf8'
);

for (const [componentName, source] of [
    ['Header', headerSource],
    ['Footer', footerSource],
]) {
    if (source.includes('useSiteShell')) {
        throw new Error(
            `${componentName} must consume embedded Fragment props without the Site Shell BFF.`
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
    '/structured-contents?flatten=true&pageSize=100',
]) {
    if (!sharedHeadlessApi.includes(endpoint)) {
        throw new Error(`Shared Structured Content API is missing ${endpoint}.`);
    }
}

for (const sharedFunction of [
    'resolveContentStructure',
    'listStructuredContents',
    'clearStructuredContentRequestCache',
]) {
    if (!headlessAdapter.includes(sharedFunction)) {
        throw new Error(
            `Pixel-perfect Headless adapter must reuse ${sharedFunction}.`
        );
    }
}

if (sharedHeadlessApi.includes('item.name, item.id')) {
    throw new Error('Structure resolution must not use the editable display name.');
}

console.log(
    `Validated ${headlessFragments.length} Headless sections, ${settingsFragments.length} Fragment Settings sections, and ${Object.keys(shellContracts).length} embedded shell contracts.`
);
