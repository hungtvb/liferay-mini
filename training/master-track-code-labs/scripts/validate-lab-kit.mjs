import {access, readFile} from 'node:fs/promises';

const requiredFiles = [
    'modules/nexcent-training/nexcent-training-osgi/build.gradle',
    'modules/nexcent-training/nexcent-training-osgi/bnd.bnd',
    'modules/nexcent-training/nexcent-training-service/service.xml',
    'modules/nexcent-training/nexcent-training-rest-impl/rest-config.yaml',
    'modules/nexcent-training/nexcent-training-rest-impl/rest-openapi.yaml',
    'modules/nexcent-site-shell/nexcent-site-shell-rest-api/bnd.bnd',
    'modules/nexcent-site-shell/nexcent-site-shell-rest-api/build.gradle',
    'modules/nexcent-site-shell/nexcent-site-shell-rest-impl/bnd.bnd',
    'modules/nexcent-site-shell/nexcent-site-shell-rest-impl/build.gradle',
    'modules/nexcent-site-shell/nexcent-site-shell-rest-impl/rest-config.yaml',
    'modules/nexcent-site-shell/nexcent-site-shell-rest-impl/rest-openapi.yaml',
    'modules/nexcent-site-shell/nexcent-site-shell-rest-impl/src/main/java/com/nexcent/site/shell/rest/internal/resource/v1_0/SiteShellResourceImpl.java',
    'client-extensions/nexcent-theme/client-extension.yaml',
    'client-extensions/nexcent-theme/assets/global-entry.css',
    'client-extensions/nexcent-theme/assets/global.css',
    'client-extensions/nexcent-theme/assets/react-shell.css',
    'client-extensions/nexcent-theme/src/frontend-token-definition.json',
    'training/master-track-code-labs/fragments/nexcent-account-actions/fragment.json',
    'training/master-track-code-labs/fragments/nexcent-mobile-navigation/fragment.json',
    'training/master-track-code-labs/fragments/nexcent-mobile-navigation/configuration.json',
    'training/master-track-code-labs/fragments/nexcent-mobile-navigation/index.html',
    'training/master-track-code-labs/fragments/nexcent-mobile-navigation/index.css',
    'training/master-track-code-labs/fragments/nexcent-mobile-navigation/index.js',
    'training/master-track-code-labs/fragments/nexcent-section-wrapper/fragment.json',
    'training/master-track-code-labs/fragments/nexcent-section-wrapper/configuration.json',
    'training/master-track-code-labs/fragments/nexcent-react-header/fragment.json',
    'training/master-track-code-labs/fragments/nexcent-react-header/configuration.json',
    'training/master-track-code-labs/fragments/nexcent-react-header/index.html',
    'training/master-track-code-labs/fragments/nexcent-react-footer/fragment.json',
    'training/master-track-code-labs/fragments/nexcent-react-footer/configuration.json',
    'training/master-track-code-labs/fragments/nexcent-react-footer/index.html',
    'training/master-track-code-labs/web-content-templates/nxc-landing-hero.ftl',
    'training/master-track-code-labs/web-content-templates/nxc-service-item.ftl',
    'training/master-track-code-labs/sample-data/nexcent-landing.mock.json',
    'training/master-track-code-labs/sample-data/nexcent-taxonomy.json',
    'training/master-track-code-labs/sample-data/community-articles.csv',
    'client-extensions/nexcent-training-batch-lab/client-extension.yaml',
];

for (const file of requiredFiles) {
    await access(file);
}

const mock = JSON.parse(
    await readFile(
        'training/master-track-code-labs/sample-data/nexcent-landing.mock.json',
        'utf8'
    )
);

const records = [
    mock.hero,
    mock.clientsIntro,
    ...mock.clients,
    mock.servicesIntro,
    ...mock.services,
    ...mock.features,
    mock.statisticsIntro,
    ...mock.statistics,
    mock.testimonial,
    mock.communityIntro,
    ...mock.community,
    mock.cta,
];

const ercs = records.map((record) => record.externalReferenceCode);

if (ercs.some((erc) => !String(erc).startsWith('NXC-'))) {
    throw new Error('Every mock content record must use an NXC-* ERC.');
}

if (new Set(ercs).size !== ercs.length) {
    throw new Error('Mock content contains duplicate ERCs.');
}

for (const list of [
    mock.clients,
    mock.services,
    mock.features,
    mock.statistics,
    mock.community,
]) {
    const orders = list.map((item) => item.sortOrder);

    if (new Set(orders).size !== orders.length) {
        throw new Error('A mock content list contains duplicate sortOrder values.');
    }
}

const taxonomy = JSON.parse(
    await readFile(
        'training/master-track-code-labs/sample-data/nexcent-taxonomy.json',
        'utf8'
    )
);

if (taxonomy.vocabulary?.name !== 'Nexcent Topics') {
    throw new Error('Taxonomy sample must define the Nexcent Topics vocabulary.');
}

if (taxonomy.vocabulary?.visibility !== 'public') {
    throw new Error('Nexcent Topics must be public for the visitor-facing lab.');
}

const categoryNames = taxonomy.categories.flatMap((category) => [
    category.name,
    ...(category.children ?? []).map((child) => child.name),
]);

if (new Set(categoryNames).size !== categoryNames.length) {
    throw new Error('Taxonomy sample contains duplicate category names.');
}

for (const requiredCategory of [
    'Membership',
    'Community',
    'Events',
    'Webinars',
    'Meetups',
    'Marketing',
]) {
    if (!categoryNames.includes(requiredCategory)) {
        throw new Error(`Taxonomy sample is missing category ${requiredCategory}.`);
    }
}

if (new Set(taxonomy.tags).size !== taxonomy.tags.length) {
    throw new Error('Taxonomy sample contains duplicate tags.');
}

for (const requiredTag of ['featured', 'homepage', 'beginner']) {
    if (!taxonomy.tags.includes(requiredTag)) {
        throw new Error(`Taxonomy sample is missing tag ${requiredTag}.`);
    }
}

const csv = await readFile(
    'training/master-track-code-labs/sample-data/community-articles.csv',
    'utf8'
);
const expectedHeader =
    'externalReferenceCode,title,summary,imageFileName,imageAlt,linkLabel,linkUrl,publicationDate,sortOrder,active';

if (csv.split(/\r?\n/, 1)[0] !== expectedHeader) {
    throw new Error('Community CSV header does not match the import contract.');
}

const serviceXml = await readFile(
    'modules/nexcent-training/nexcent-training-service/service.xml',
    'utf8'
);

for (const expected of [
    'name="ImportJob"',
    'name="jobKey"',
    'name="JK_G"',
    'name="G"',
]) {
    if (!serviceXml.includes(expected)) {
        throw new Error(`Service Builder contract is missing ${expected}.`);
    }
}

if (
    serviceXml.includes('name="externalReferenceCode"') ||
    serviceXml.includes('external-reference-code=')
) {
    throw new Error(
        'The operational entity must map external ERC input to jobKey instead of using Service Builder reserved ERC generation.'
    );
}

const restOpenApi = await readFile(
    'modules/nexcent-training/nexcent-training-rest-impl/rest-openapi.yaml',
    'utf8'
);

for (const expected of [
    'postSiteImportJob',
    'getSiteImportJob',
    '/sites/{siteId}/import-jobs',
]) {
    if (!restOpenApi.includes(expected)) {
        throw new Error(`REST Builder contract is missing ${expected}.`);
    }
}

const siteShellOpenApi = await readFile(
    'modules/nexcent-site-shell/nexcent-site-shell-rest-impl/rest-openapi.yaml',
    'utf8'
);

for (const expected of [
    'getSiteSiteShell',
    '/sites/{siteId}/site-shell',
    'AccountContext',
    'NavigationItem',
]) {
    if (!siteShellOpenApi.includes(expected)) {
        throw new Error(`Site Shell REST contract is missing ${expected}.`);
    }
}

const siteShellBuild = await readFile(
    'modules/nexcent-site-shell/nexcent-site-shell-rest-impl/build.gradle',
    'utf8'
);

for (const expected of [
    'auth.verifier.guest.allowed=true',
    'liferay.access.control.disable=true',
    'oauth2.scopechecker.type=none',
]) {
    if (!siteShellBuild.includes(expected)) {
        throw new Error(`Site Shell public read contract is missing ${expected}.`);
    }
}

const themeClientExtension = await readFile(
    'client-extensions/nexcent-theme/client-extension.yaml',
    'utf8'
);
const themeEntry = await readFile(
    'client-extensions/nexcent-theme/assets/global-entry.css',
    'utf8'
);
const reactShellCss = await readFile(
    'client-extensions/nexcent-theme/assets/react-shell.css',
    'utf8'
);

if (!themeClientExtension.includes('url: global-entry.css')) {
    throw new Error('Nexcent Global CSS must load the React-aware global entry.');
}

for (const expected of ['./global.css', './react-shell.css']) {
    if (!themeEntry.includes(expected)) {
        throw new Error(`Theme global entry is missing ${expected}.`);
    }
}

for (const expected of [
    'nexcent-react-header',
    'nexcent-react-footer',
    '--nxc-color-primary',
    'lfr-layout-structure-item-nexcent-react-header',
]) {
    if (!reactShellCss.includes(expected)) {
        throw new Error(`React shell theme bridge is missing ${expected}.`);
    }
}

for (const fragmentPath of [
    'training/master-track-code-labs/fragments/nexcent-react-header/index.html',
    'training/master-track-code-labs/fragments/nexcent-react-footer/index.html',
]) {
    const fragmentHtml = (await readFile(fragmentPath, 'utf8')).trim();

    if (!/^<nexcent-react-(header|footer)\b[^>]*><\/nexcent-react-\1>$/.test(fragmentHtml)) {
        throw new Error(`${fragmentPath} must contain exactly one React custom-element tag.`);
    }

    if (!fragmentHtml.includes('themeDisplay.getScopeGroupId()')) {
        throw new Error(`${fragmentPath} must pass the runtime site ID to React.`);
    }
}

console.log(
    `Validated ${requiredFiles.length} required files, ${ercs.length} mock content ERCs, ${categoryNames.length} taxonomy categories, and ${taxonomy.tags.length} tags.`
);
