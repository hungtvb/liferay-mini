const AUTH_CODES = new Set(['CONFIG_MISSING', 'OAUTH_FAILED']);
const INPUT_CODES = new Set([
  'CHOICE_EMPTY',
  'COMMAND_UNKNOWN',
  'CREATE_STRATEGY_INVALID',
  'FILE_REQUIRED',
  'IMAGE_SOURCE_INVALID',
  'IMPORT_STRATEGY_INVALID',
  'SITE_ID_INVALID',
  'TASK_ID_REQUIRED'
]);
const VALIDATION_CODES = new Set([
  'ERC_ALREADY_EXISTS',
  'UPSERT_CONFIRMATION_REQUIRED',
  'VALIDATION_FAILED',
  'WORKBOOK_INVALID'
]);

function redact(value) {
  if (Array.isArray(value)) return value.map(redact);
  if (!value || typeof value !== 'object') return value;

  return Object.fromEntries(Object.entries(value).map(([key, nested]) => {
    if (/authorization|client.?secret|password|token/i.test(key)) return [key, '[redacted]'];
    return [key, redact(nested)];
  }));
}

export function isAbortLike(error) {
  return error?.name === 'AbortError'
    || error?.code === 'ABORT_ERR'
    || error?.code === 'ERR_USE_AFTER_CLOSE';
}

function liferayApiPresentation(error) {
  const status = Number(error?.details?.status || error?.status || 0);
  if (status === 401) {
    return {
      message: 'Liferay rejected the current authentication.',
      hint: 'Check the OAuth2 Client ID and Client Secret in the local .env file.'
    };
  }
  if (status === 403) {
    return {
      message: 'Liferay denied this operation.',
      hint: 'Check the OAuth2 scopes and the permissions of the configured application.'
    };
  }
  if (status === 404) {
    return {
      message: 'A configured Liferay resource could not be found.',
      hint: 'Run npm run cli init again and select the current Structure and folders.'
    };
  }
  return {
    message: 'Liferay could not complete the request.',
    hint: 'Review the current Site, Structure, folder, and permission settings.'
  };
}

export function presentCliError(error, {verbose = false} = {}) {
  let message;
  let hint;
  let exitCode = Number(error?.status) >= 500 ? 1 : 2;

  if (error?.code === 'IMPORT_CANCELLED') {
    message = 'Import cancelled.';
    exitCode = 0;
  }
  else if (isAbortLike(error)) {
    message = 'Cancelled by user.';
    exitCode = 0;
  }
  else if (error?.code === 'PROFILE_NOT_FOUND') {
    message = 'No CLI profile is configured yet.';
    hint = 'Run npm run cli init first.';
  }
  else if (error?.code === 'BATCH_SUBMISSION_UNKNOWN') {
    message = 'The import request may have reached Liferay, but its Batch task ID was not confirmed.';
    hint = 'Check Liferay Batch Engine before retrying to avoid duplicate content.';
  }
  else if (error?.code === 'LIFERAY_UNREACHABLE') {
    message = 'Could not connect to Liferay.';
    hint = 'Check LIFERAY_BASE_URL and verify that Liferay is running.';
  }
  else if (error?.code === 'LIFERAY_API_ERROR') {
    ({message, hint} = liferayApiPresentation(error));
  }
  else if (AUTH_CODES.has(error?.code)) {
    message = error?.code === 'OAUTH_FAILED'
      ? 'Could not authenticate with Liferay.'
      : 'The local CLI configuration is incomplete.';
    hint = error?.code === 'OAUTH_FAILED'
      ? 'Check the OAuth2 Client ID and Client Secret in the local .env file.'
      : error.message;
  }
  else if (error?.code === 'ENOENT') {
    message = 'The workbook file was not found.';
    hint = error.path
      ? `Check this path: ${error.path}`
      : 'Place the .xlsx file in workbooks/ or enter its correct path.';
  }
  else if (error?.code === 'WORKBOOK_INVALID') {
    message = 'The workbook could not be read.';
    hint = 'Generate a fresh template, copy only the content rows, and save it as an .xlsx file.';
  }
  else if (VALIDATION_CODES.has(error?.code)) {
    message = 'The import was not started.';
    hint = error.message;
  }
  else if (INPUT_CODES.has(error?.code) || (Number(error?.status) >= 400 && Number(error?.status) < 500)) {
    message = 'The command needs different input.';
    hint = error.message;
  }
  else if (Number(error?.status) >= 500) {
    message = 'The command could not be completed because a service or system error occurred.';
    hint = 'Try again. Run with --verbose if technical details are needed.';
  }
  else {
    message = 'Something went wrong while running the command.';
    hint = 'Run the command again with --verbose for technical details.';
    exitCode = 1;
  }

  const lines = [message];
  if (hint && hint !== message) lines.push(hint);

  if (verbose) {
    const technical = {
      code: error?.code || error?.name || 'ERROR',
      details: redact(error?.details),
      message: error?.message,
      status: error?.status,
      stack: error?.stack
    };
    lines.push(`Technical details:\n${JSON.stringify(technical, null, 2)}`);
  }

  return {exitCode, lines};
}
