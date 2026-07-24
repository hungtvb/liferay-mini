export function readStringSetting(
    host: HTMLElement | undefined,
    name: string,
    fallback = ''
): string {
    const value = host?.getAttribute(name);

    if (value === null || value === undefined) {
        return fallback;
    }

    return value.trim() || fallback;
}

export function readBooleanSetting(
    host: HTMLElement | undefined,
    name: string,
    fallback: boolean
): boolean {
    const value = host?.getAttribute(name)?.trim().toLowerCase();

    if (!value) {
        return fallback;
    }

    return !['false', '0', 'no', 'off'].includes(value);
}

export function readNumberSetting(
    host: HTMLElement | undefined,
    name: string,
    fallback: number,
    options: {max?: number; min?: number} = {}
): number {
    const rawValue = host?.getAttribute(name)?.trim();
    const parsedValue = rawValue ? Number(rawValue) : Number.NaN;
    let value = Number.isFinite(parsedValue) ? parsedValue : fallback;

    if (options.min !== undefined) {
        value = Math.max(options.min, value);
    }

    if (options.max !== undefined) {
        value = Math.min(options.max, value);
    }

    return value;
}

export function readLocale(host: HTMLElement | undefined): string {
    return readStringSetting(
        host,
        'locale',
        document.documentElement.lang || 'en-US'
    ).replace('_', '-');
}
