import assert from 'node:assert/strict';
import test from 'node:test';
import {AppError} from '../server/errors.js';
import {presentCliError, resolveCliExitCode} from '../cli/error-output.js';

test('Ctrl+C style aborts are presented as a successful user cancellation', () => {
  const result = presentCliError(Object.assign(new Error('aborted'), {name: 'AbortError'}));
  assert.equal(result.exitCode, 0);
  assert.deepEqual(result.lines, ['Cancelled by user.']);
});

test('interactive import cancellation is not presented as an error', () => {
  const result = presentCliError(new AppError(409, 'IMPORT_CANCELLED', 'Import cancelled'));
  assert.equal(result.exitCode, 0);
  assert.deepEqual(result.lines, ['Import cancelled.']);
});

test('interactive CLI errors exit cleanly while automation preserves failure codes', () => {
  assert.equal(resolveCliExitCode(2, {interactive: true}), 0);
  assert.equal(resolveCliExitCode(1, {interactive: true}), 0);
  assert.equal(resolveCliExitCode(2, {interactive: false}), 2);
  assert.equal(resolveCliExitCode(1, {interactive: false}), 1);
});

test('known Liferay errors include a useful next action', () => {
  const result = presentCliError(new AppError(502, 'LIFERAY_UNREACHABLE', 'Cannot reach the Liferay API'));
  assert.equal(result.exitCode, 1);
  assert.match(result.lines[0], /connect to Liferay/i);
  assert.match(result.lines[1], /LIFERAY_BASE_URL/);
});

test('technical codes and details are hidden unless verbose is enabled', () => {
  const error = new AppError(502, 'OAUTH_FAILED', 'authentication failed', {
    clientSecret: 'never-print-me',
    status: 401
  });
  const normal = presentCliError(error);
  assert.equal(normal.lines.some((line) => line.includes('OAUTH_FAILED')), false);

  const verbose = presentCliError(error, {verbose: true});
  const output = verbose.lines.join('\n');
  assert.match(output, /OAUTH_FAILED/);
  assert.match(output, /\[redacted\]/);
  assert.equal(output.includes('never-print-me'), false);
});

test('missing workbook errors show the affected path', () => {
  const error = Object.assign(new Error('missing'), {
    code: 'ENOENT',
    path: 'workbooks/missing.xlsx'
  });
  const result = presentCliError(error);
  assert.match(result.lines[0], /not found/i);
  assert.match(result.lines[1], /workbooks\/missing\.xlsx/);
});
