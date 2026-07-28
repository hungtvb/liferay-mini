const ANSI = {
  bold: '\u001b[1m',
  cyan: '\u001b[36m',
  dim: '\u001b[2m',
  green: '\u001b[32m',
  red: '\u001b[31m',
  reset: '\u001b[0m',
  yellow: '\u001b[33m'
};

function supportsColor(stream) {
  return Boolean(stream?.isTTY && !process.env.NO_COLOR);
}

export function createTerminal({output = process.stdout, error = process.stderr, color = supportsColor(output)} = {}) {
  function paint(value, ...styles) {
    const text = String(value);
    if (!color || styles.length === 0) return text;
    return `${styles.map((style) => ANSI[style]).join('')}${text}${ANSI.reset}`;
  }

  function normalizeDetails(details) {
    const values = Array.isArray(details) ? details : [details];
    return values
      .filter(Boolean)
      .flatMap((value) => String(value).split('\n'));
  }

  function writeBlock(stream, symbol, title, details = [], tone = 'cyan') {
    stream.write(`${paint(symbol, 'bold', tone)} ${paint(title, 'bold', tone)}\n`);
    normalizeDetails(details).forEach((line) => stream.write(`  ${paint(line, 'dim')}\n`));
  }

  return {
    choice(index, label) {
      return `  ${paint(`${index}.`, 'cyan')} ${label}`;
    },

    error(title, details = []) {
      writeBlock(error, '✗', title, details, 'red');
    },

    heading(title) {
      output.write(`\n${paint(title, 'bold', 'cyan')}\n`);
    },

    info(title, details = []) {
      writeBlock(output, 'ℹ', title, details, 'cyan');
    },

    prompt(label, fallback = '') {
      const suffix = fallback ? paint(` [${fallback}]`, 'dim') : '';
      return `${paint('›', 'bold', 'cyan')} ${paint(label, 'bold')}${suffix}: `;
    },

    result(label, value) {
      output.write(`  ${paint(`${label}:`, 'dim')} ${value}\n`);
    },

    success(title, details = []) {
      writeBlock(output, '✓', title, details, 'green');
    },

    warning(title, details = []) {
      writeBlock(output, '!', title, details, 'yellow');
    },

    writeJson(value) {
      output.write(`${paint(JSON.stringify(value, null, 2), 'dim')}\n`);
    }
  };
}
