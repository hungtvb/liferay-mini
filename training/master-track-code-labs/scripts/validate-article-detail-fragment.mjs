import {access, readFile} from 'node:fs/promises';

const root =
    'training/master-track-code-labs/fragments/nexcent-article-detail';
const requiredFiles = [
    `${root}/fragment.json`,
    `${root}/configuration.json`,
    `${root}/index.html`,
    `${root}/index.css`,
    `${root}/index.js`,
    'training/master-track-code-labs/web-content-templates/nxc-article-body.ftl',
];

for (const file of requiredFiles) {
    await access(file);
}

const fragment = JSON.parse(await readFile(`${root}/fragment.json`, 'utf8'));
const configuration = JSON.parse(
    await readFile(`${root}/configuration.json`, 'utf8')
);
const html = await readFile(`${root}/index.html`, 'utf8');
const css = await readFile(`${root}/index.css`, 'utf8');
const js = await readFile(`${root}/index.js`, 'utf8');
const bodyTemplate = await readFile(
    'training/master-track-code-labs/web-content-templates/nxc-article-body.ftl',
    'utf8'
);

if (fragment.fragmentEntryKey !== 'nexcent_article_detail') {
    throw new Error('Article Detail fragment must keep its stable fragmentEntryKey.');
}

for (const [property, expected] of Object.entries({
    configurationPath: 'configuration.json',
    cssPath: 'index.css',
    htmlPath: 'index.html',
    jsPath: 'index.js',
    type: 'component',
})) {
    if (fragment[property] !== expected) {
        throw new Error(`Article Detail fragment has invalid ${property}.`);
    }
}

const fields = configuration.fieldSets?.flatMap((fieldSet) => fieldSet.fields) ?? [];
const configurationNames = new Set(fields.map((field) => field.name));

for (const name of ['showBackLink', 'background', 'bodyWidth', 'showTopics']) {
    if (!configurationNames.has(name)) {
        throw new Error(`Article Detail configuration is missing ${name}.`);
    }
}

const editableIds = [
    ...html.matchAll(/data-lfr-editable-id="([^"]+)"/g),
].map((match) => match[1]);

if (new Set(editableIds).size !== editableIds.length) {
    throw new Error('Article Detail fragment contains duplicate editable IDs.');
}

for (const id of [
    'backLink',
    'eyebrow',
    'publishedDate',
    'title',
    'summary',
    'authorName',
    'coverImage',
    'body',
    'topicsHeading',
]) {
    if (!editableIds.includes(id)) {
        throw new Error(`Article Detail fragment is missing editable ${id}.`);
    }
}

for (const contract of [
    'data-lfr-editable-type="image"',
    'data-lfr-editable-type="rich-text"',
    '<lfr-drop-zone id="article-topics"></lfr-drop-zone>',
    "configuration.showTopics!true",
    "configuration.showBackLink!true",
]) {
    if (!html.includes(contract)) {
        throw new Error(`Article Detail markup is missing contract: ${contract}`);
    }
}

for (const selector of [
    '.nxc-article-detail__title',
    '.nxc-article-detail__cover',
    '.nxc-article-detail__body',
    '.nxc-article-detail__topics',
    '@media (max-width: 56.25rem)',
    '@media (max-width: 35.9375rem)',
    '@media (prefers-reduced-motion: reduce)',
]) {
    if (!css.includes(selector)) {
        throw new Error(`Article Detail CSS is missing ${selector}.`);
    }
}

if (!js.includes("nexcentArticleDetailReady = 'true'")) {
    throw new Error('Article Detail readiness marker is missing.');
}

if (!bodyTemplate.includes('${body.getData()}')) {
    throw new Error('Article body mapping fallback template is incomplete.');
}

console.log(
    `Validated Nexcent Article Detail fragment with ${editableIds.length} editable elements.`
);
