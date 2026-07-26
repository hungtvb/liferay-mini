import test from 'node:test';
import assert from 'node:assert/strict';
import {resolveFriendlyUrl, slugifyFriendlyUrl} from '../server/friendly-url.js';

test('normalizes Vietnamese titles into deterministic slugs', () => {
  assert.equal(slugifyFriendlyUrl('  Trà Vải Đà Nẵng 2026  '), 'tra-vai-da-nang-2026');
});

test('uses an explicit valid friendly URL without rewriting it', () => {
  assert.deepEqual(resolveFriendlyUrl({friendlyUrlPath: 'custom-friendly-url', title: 'Ignored title'}), {
    generated: false,
    value: 'custom-friendly-url'
  });
});

test('rejects explicit values that are not normalized slugs', () => {
  const result = resolveFriendlyUrl({friendlyUrlPath: '/Invalid URL/', title: 'Title'});
  assert.equal(result.code, 'FRIENDLY_URL_INVALID');
  assert.equal(result.value, null);
});

test('reports a generation failure when title has no slug characters', () => {
  const result = resolveFriendlyUrl({friendlyUrlPath: '', title: '🎉🎉'});
  assert.equal(result.code, 'FRIENDLY_URL_GENERATION_FAILED');
  assert.equal(result.value, null);
});
