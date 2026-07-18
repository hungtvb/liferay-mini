import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {test} from 'node:test';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

import {normalizeHeadlessPage} from './headless-adapter.mjs';

const prototypeDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(prototypeDirectory, '../..');
const [fallback, source] = await Promise.all([
  readFile(path.join(prototypeDirectory, 'data/mock-content.json'), 'utf8').then(JSON.parse),
  readFile(path.join(repositoryRoot, 'sample-data/json/landing-content.json'), 'utf8').then(JSON.parse),
]);

function data(name, value) {
  return {contentFieldValue: {data: value}, name};
}

function image(name, fileName) {
  return {
    contentFieldValue: {
      image: {contentUrl: `/documents/${fileName}`, title: fileName},
    },
    name,
  };
}

function content(row, fields, title = row.title ?? row.heading ?? row.name ?? row.label) {
  return {
    contentFields: fields,
    externalReferenceCode: row.externalReferenceCode,
    id: Math.abs(
      [...row.externalReferenceCode].reduce(
        (hash, character) => (hash * 31 + character.charCodeAt(0)) | 0,
        7
      )
    ),
    title,
  };
}

function intro(row, extra = []) {
  return content(row, [
    data('heading', row.heading),
    data('description', row.description),
    ...extra,
  ]);
}

const records = {
  clients: source.clients.map((row) =>
    content(row, [
      data('name', row.name),
      image('logo', row.logoFile),
      data('logoAlt', row.logoAlt),
      data('websiteUrl', row.websiteUrl),
      data('sortOrder', row.sortOrder),
      data('active', row.active),
    ])
  ),
  clientsIntro: source.clientsIntro.map((row) => intro(row)),
  communityCards: source.communityCards.map((row) =>
    content(row, [
      data('title', row.title),
      data('summary', row.summary),
      image('thumbnail', row.thumbnailFile),
      data('thumbnailAlt', row.thumbnailAlt),
      data('targetUrl', row.targetUrl),
      data('publishedDate', row.publishedDate),
      data('sortOrder', row.sortOrder),
      data('active', row.active),
    ])
  ),
  communityIntro: source.communityIntro.map((row) => intro(row)),
  cta: source.cta.map((row) =>
    content(row, [
      data('heading', row.heading),
      data('ctaLabel', row.ctaLabel),
      data('ctaUrl', row.ctaUrl),
      data('ctaTarget', row.ctaTarget),
      data('backgroundVariant', row.backgroundVariant),
      data('active', row.active),
    ])
  ),
  features: source.features.map((row) =>
    content(row, [
      data('title', row.title),
      data('descriptionHTML', row.descriptionHTML),
      image('image', row.imageFile),
      data('imageAlt', row.imageAlt),
      data('ctaLabel', row.ctaLabel),
      data('ctaUrl', row.ctaUrl),
      data('imagePosition', row.imagePosition),
      data('backgroundVariant', row.backgroundVariant),
      data('sortOrder', row.sortOrder),
      data('active', row.active),
    ])
  ),
  hero: source.hero.map((row) =>
    content(row, [
      data('title', row.title),
      data('highlightedText', row.highlightedText),
      data('description', row.description),
      data('ctaLabel', row.ctaLabel),
      data('ctaUrl', row.ctaUrl),
      data('ctaTarget', row.ctaTarget),
      image('illustration', row.imageFile),
      data('illustrationAlt', row.imageAlt),
      data('sortOrder', row.sortOrder),
      data('active', row.active),
    ])
  ),
  services: source.services.map((row) =>
    content(row, [
      data('title', row.title),
      data('description', row.description),
      image('icon', row.iconFile),
      data('iconAlt', row.iconAlt),
      data('linkLabel', row.linkLabel),
      data('linkUrl', row.linkUrl),
      data('sortOrder', row.sortOrder),
      data('active', row.active),
    ])
  ),
  servicesIntro: source.servicesIntro.map((row) => intro(row)),
  statistics: source.statistics.map((row) =>
    content(row, [
      data('label', row.label),
      data('value', row.value),
      data('valueSuffix', row.valueSuffix),
      image('icon', row.iconFile),
      data('iconAlt', row.iconAlt),
      data('sortOrder', row.sortOrder),
      data('active', row.active),
    ])
  ),
  statisticsIntro: source.statisticsIntro.map((row) =>
    intro(row, [data('highlightedText', row.highlightedText)])
  ),
  testimonials: source.testimonials.map((row) =>
    content(row, [
      data('quote', row.quote),
      data('customerName', row.customerName),
      data('customerRole', row.customerRole),
      data('customerCompany', row.customerCompany),
      image('customerImage', row.customerImageFile),
      data('customerImageAlt', row.customerImageAlt),
      data('ctaLabel', row.ctaLabel),
      data('ctaUrl', row.ctaUrl),
      data('sortOrder', row.sortOrder),
      data('active', row.active),
    ], row.customerName)
  ),
};

test('normalizes all Liferay content structures into the static page model', () => {
  const page = normalizeHeadlessPage({
    baseUrl: 'https://liferay.example.com',
    fallback,
    locale: 'en-US',
    records,
  });

  assert.equal(page.hero.title, source.hero[0].title);
  assert.equal(page.clients.items.length, source.clients.length);
  assert.match(page.clients.items[0].logo.url, /^https:\/\/liferay\.example\.com\//);
  assert.equal(page.services.items[0].link.label, source.services[0].linkLabel);
  assert.equal(page.features[1].backgroundVariant, 'muted');
  assert.equal(page.statistics.items[0].value, '2,245,341+');
  assert.equal(page.testimonial.person.initials, 'TS');
  assert.equal(page.community.items.length, 3);
  assert.equal(page.cta.cta.target, '_self');
});
