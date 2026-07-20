import {access, readFile} from 'node:fs/promises';

const requiredFiles = [
    'modules/nexcent-training/nexcent-training-osgi/build.gradle',
    'modules/nexcent-training/nexcent-training-osgi/bnd.bnd',
    'modules/nexcent-training/nexcent-training-service/service.xml',
    'modules/nexcent-training/nexcent-training-rest-impl/rest-config.yaml',
    'modules/nexcent-training/nexcent-training-rest-impl/rest-openapi.yaml',
    'training/master-track-code-labs/fragments/nexcent-section-wrapper/fragment.json',
    'training/master-track-code-labs/fragments/nexcent-section-wrapper/configuration.json',
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

console.log(
    `Validated ${requiredFiles.length} required files, ${ercs.length} mock content ERCs, ${categoryNames.length} taxonomy categories, and ${taxonomy.tags.length} tags.`
);
