import test from 'node:test';
import assert from 'node:assert/strict';
import {safeFileStem} from '../server/file-name.js';

test('normalizes names for generated Excel files', () => {
  assert.equal(safeFileStem('NXC Articles 2026'), 'nxc-articles-2026');
  assert.equal(safeFileStem('Trà Đá'), 'tra-da');
});

test('uses a stable fallback when normalization removes every character', () => {
  assert.equal(safeFileStem('日本語'), 'structured-content');
  assert.equal(safeFileStem('', 'report'), 'report');
});
