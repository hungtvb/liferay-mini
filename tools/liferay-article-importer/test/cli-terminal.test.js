import assert from 'node:assert/strict';
import test from 'node:test';
import {createTerminal} from '../cli/terminal.js';

function capture() {
  let value = '';
  return {
    stream: {
      isTTY: true,
      write(chunk) {
        value += chunk;
      }
    },
    value() {
      return value;
    }
  };
}

test('terminal differentiates prompts, success, warning, and error output with colors', () => {
  const stdout = capture();
  const stderr = capture();
  const terminal = createTerminal({output: stdout.stream, error: stderr.stream, color: true});

  const prompt = terminal.prompt('Batch task ID', '1');
  terminal.heading('Batch task result');
  terminal.success('Batch task 42 was found.');
  terminal.warning('Batch task 2 was not found.', ['Check the task ID.']);
  terminal.error('Could not connect to Liferay.', ['Check LIFERAY_BASE_URL.']);

  assert.match(prompt, /\u001b\[36m/);
  assert.match(stdout.value(), /\u001b\[32m/);
  assert.match(stdout.value(), /\u001b\[33m/);
  assert.match(stdout.value(), /Batch task result/);
  assert.match(stderr.value(), /\u001b\[31m/);
});

test('terminal remains readable when colors are disabled', () => {
  const stdout = capture();
  const terminal = createTerminal({output: stdout.stream, error: stdout.stream, color: false});

  assert.equal(terminal.prompt('Select', '1'), '› Select [1]: ');
  terminal.success('Profile initialized successfully.', ['Profile: default']);

  assert.equal(stdout.value(), '✓ Profile initialized successfully.\n  Profile: default\n');
  assert.doesNotMatch(stdout.value(), /\u001b\[/);
});
