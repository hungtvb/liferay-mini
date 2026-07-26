const MAX_FRIENDLY_URL_LENGTH = 255;

function blank(value) {
  return value == null || String(value).trim() === '';
}

export function slugifyFriendlyUrl(value) {
  return String(value || '')
    .trim()
    .replace(/[Đđ]/g, (character) => character === 'Đ' ? 'D' : 'd')
    .normalize('NFKD')
    .replace(/\p{M}+/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, MAX_FRIENDLY_URL_LENGTH)
    .replace(/-+$/g, '');
}

export function resolveFriendlyUrl({friendlyUrlPath, title}) {
  if (blank(friendlyUrlPath)) {
    if (blank(title)) return {generated: true, value: null};
    const generated = slugifyFriendlyUrl(title);
    if (!generated) {
      return {
        code: 'FRIENDLY_URL_GENERATION_FAILED',
        generated: true,
        message: 'Friendly URL could not be generated from the Content Title',
        value: null
      };
    }
    return {generated: true, value: generated};
  }

  const explicit = String(friendlyUrlPath).trim();
  if (explicit.length > MAX_FRIENDLY_URL_LENGTH) {
    return {
      code: 'FRIENDLY_URL_INVALID',
      generated: false,
      message: `Friendly URL must not exceed ${MAX_FRIENDLY_URL_LENGTH} characters`,
      value: null
    };
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(explicit)) {
    return {
      code: 'FRIENDLY_URL_INVALID',
      generated: false,
      message: 'Friendly URL must contain only lowercase letters, numbers, and single hyphens without leading or trailing hyphens',
      value: null
    };
  }

  return {generated: false, value: explicit};
}

export {MAX_FRIENDLY_URL_LENGTH};
