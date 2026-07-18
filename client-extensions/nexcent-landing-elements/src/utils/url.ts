const SAFE_PROTOCOLS = new Set(['http:', 'https:']);

export function safeLinkUrl(value: string): string {
    const url = value.trim();

    if (!url) {
        return '';
    }

    if (url.startsWith('/') || url.startsWith('#')) {
        return url;
    }

    try {
        const parsed = new URL(url);

        return SAFE_PROTOCOLS.has(parsed.protocol) ? url : '';
    }
    catch {
        return '';
    }
}
