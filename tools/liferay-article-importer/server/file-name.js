export function safeFileStem(value, fallback = 'structured-content') {
  const normalized = String(value || '')
    .replace(/[Đđ]/g, (character) => character === 'Đ' ? 'D' : 'd')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  return normalized || fallback;
}
