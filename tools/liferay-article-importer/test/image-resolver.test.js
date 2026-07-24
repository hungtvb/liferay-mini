import test from 'node:test';
import assert from 'node:assert/strict';
import {ImageResolver, parseImageReference} from '../server/image-resolver.js';

const documents = [
  {id: 1, fileName: 'Hero.webp', externalReferenceCode: 'HERO_ERC', encodingFormat: 'image/webp', title: 'Hero', description: ''},
  {id: 2, fileName: 'other.png', externalReferenceCode: 'OTHER', encodingFormat: 'image/png', title: 'Other'}
];

test('requires file or erc prefix', () => {
  assert.equal(parseImageReference('Hero.webp').valid, false);
  assert.equal(parseImageReference('file:Hero.webp').valid, true);
  assert.equal(parseImageReference('erc:HERO_ERC').valid, true);
  assert.equal(parseImageReference('file:no-extension').valid, false);
});

test('loads one source once and resolves file/erc in memory', async () => {
  let calls = 0;
  const resolver = new ImageResolver({liferay: {async listConfiguredImageDocuments() { calls += 1; return documents; }}});
  const result = await resolver.resolveMany(['file:hero.webp', 'erc:hero_erc', 'file:hero.webp']);
  assert.equal(calls, 1);
  assert.equal(result.indexSummary.distinctReferenceCount, 2);
  assert.equal(result.results.get('file:hero.webp').document.id, 1);
  assert.equal(result.results.get('erc:hero_erc').document.description, 'Hero');
});

test('does not load the image source when there are no references', async () => {
  let calls = 0;
  const resolver = new ImageResolver({liferay: {async listConfiguredImageDocuments() { calls += 1; return documents; }}});
  const result = await resolver.resolveMany([]);
  assert.equal(calls, 0);
  assert.equal(result.indexSummary.distinctReferenceCount, 0);
});

test('does not fallback between file and ERC indexes', async () => {
  const resolver = new ImageResolver({liferay: {async listConfiguredImageDocuments() { return documents; }}});
  const result = await resolver.resolveMany(['file:HERO_ERC.jpg']);
  assert.equal(result.results.get('file:HERO_ERC.jpg').status, 'MISSING');
});
