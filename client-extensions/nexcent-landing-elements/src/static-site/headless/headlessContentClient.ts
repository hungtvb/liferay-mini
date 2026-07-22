export type HeadlessDocument = {
    contentUrl?: string;
    description?: string;
    id?: number | string;
    title?: string;
};

export type HeadlessContentField = {
    contentFieldValue?: {
        data?: unknown;
        document?: HeadlessDocument;
        image?: HeadlessDocument;
    };
    name?: string;
    nestedContentFields?: HeadlessContentField[];
};

export type HeadlessStructuredContent = {
    contentFields?: HeadlessContentField[];
    contentStructureId?: number | string;
    datePublished?: string;
    externalReferenceCode?: string;
    friendlyUrlPath?: string;
    id?: number | string;
    title?: string;
};

type HeadlessCollection<T> = {
    items?: T[];
};

type HeadlessContentStructure = {
    externalReferenceCode?: string;
    id?: number | string;
    key?: string;
    name?: string;
};

type LoadStructuredContentsOptions = {
    locale: string;
    pageSize?: number;
    siteId: string;
    structureIdentifier: string;
};

const requestCache = new Map<string, Promise<unknown>>();

function requestJSON<T>(url: string, locale: string): Promise<T> {
    const cacheKey = `${locale}:${url}`;
    const cachedRequest = requestCache.get(cacheKey);

    if (cachedRequest) {
        return cachedRequest as Promise<T>;
    }

    const request = fetch(url, {
        credentials: 'same-origin',
        headers: {
            Accept: 'application/json',
            'Accept-Language': locale,
        },
    }).then(async (response) => {
        if (!response.ok) {
            throw new Error(
                `Headless Delivery request failed (${response.status} ${response.statusText}) for ${url}`
            );
        }

        return (await response.json()) as T;
    });

    requestCache.set(cacheKey, request);

    request.catch(() => requestCache.delete(cacheKey));

    return request;
}

function normalizeIdentifier(value: string | number | undefined): string {
    return String(value ?? '').trim().toLowerCase();
}

async function resolveContentStructureId(
    siteId: string,
    structureIdentifier: string,
    locale: string
): Promise<string> {
    const normalizedIdentifier = normalizeIdentifier(structureIdentifier);

    if (!normalizedIdentifier) {
        throw new Error('Missing content structure identifier.');
    }

    if (/^\d+$/.test(normalizedIdentifier)) {
        return normalizedIdentifier;
    }

    const encodedSiteId = encodeURIComponent(siteId);
    const response = await requestJSON<HeadlessCollection<HeadlessContentStructure>>(
        `/o/headless-delivery/v1.0/sites/${encodedSiteId}/content-structures?pageSize=200`,
        locale
    );
    const structure = (response.items ?? []).find((item) =>
        [item.externalReferenceCode, item.key, item.name, item.id].some(
            (candidate) => normalizeIdentifier(candidate) === normalizedIdentifier
        )
    );

    if (!structure?.id) {
        throw new Error(
            `Unable to resolve content structure "${structureIdentifier}" in site ${siteId}.`
        );
    }

    return String(structure.id);
}

function flattenFields(fields: HeadlessContentField[] = []): HeadlessContentField[] {
    return fields.flatMap((field) => [
        field,
        ...flattenFields(field.nestedContentFields ?? []),
    ]);
}

function findField(
    content: HeadlessStructuredContent,
    names: string[]
): HeadlessContentField | undefined {
    const normalizedNames = names.map(normalizeIdentifier);

    return flattenFields(content.contentFields).find((field) =>
        normalizedNames.includes(normalizeIdentifier(field.name))
    );
}

export function readContentText(
    content: HeadlessStructuredContent,
    names: string[],
    fallback = ''
): string {
    const data = findField(content, names)?.contentFieldValue?.data;

    if (data === null || data === undefined) {
        return fallback;
    }

    return String(data).trim() || fallback;
}

export function readContentBoolean(
    content: HeadlessStructuredContent,
    names: string[],
    fallback = true
): boolean {
    const value = readContentText(content, names, '');

    if (!value) {
        return fallback;
    }

    return !['false', '0', 'no', 'off'].includes(value.toLowerCase());
}

export function readContentNumber(
    content: HeadlessStructuredContent,
    names: string[],
    fallback = 0
): number {
    const value = Number(readContentText(content, names, ''));

    return Number.isFinite(value) ? value : fallback;
}

export function readContentImage(
    content: HeadlessStructuredContent,
    names: string[],
    fallback: {alt: string; url: string}
): {alt: string; url: string} {
    const fieldValue = findField(content, names)?.contentFieldValue;
    const image = fieldValue?.image ?? fieldValue?.document;
    const rawData = fieldValue?.data;
    let dataImage: HeadlessDocument | undefined;

    if (rawData && typeof rawData === 'object') {
        dataImage = rawData as HeadlessDocument;
    }
    else if (typeof rawData === 'string' && rawData.trim().startsWith('{')) {
        try {
            dataImage = JSON.parse(rawData) as HeadlessDocument;
        }
        catch {
            dataImage = undefined;
        }
    }

    const resolvedImage = image ?? dataImage;

    return {
        alt:
            resolvedImage?.description?.trim() ||
            resolvedImage?.title?.trim() ||
            fallback.alt,
        url: resolvedImage?.contentUrl?.trim() || fallback.url,
    };
}

export async function loadStructuredContents({
    locale,
    pageSize = 100,
    siteId,
    structureIdentifier,
}: LoadStructuredContentsOptions): Promise<HeadlessStructuredContent[]> {
    const structureId = await resolveContentStructureId(
        siteId,
        structureIdentifier,
        locale
    );
    const response = await requestJSON<HeadlessCollection<HeadlessStructuredContent>>(
        `/o/headless-delivery/v1.0/content-structures/${encodeURIComponent(
            structureId
        )}/structured-contents?flatten=true&pageSize=${pageSize}`,
        locale
    );

    return (response.items ?? [])
        .filter((item) => readContentBoolean(item, ['active', 'enabled'], true))
        .sort(
            (left, right) =>
                readContentNumber(left, ['sortOrder', 'displayOrder'], 0) -
                readContentNumber(right, ['sortOrder', 'displayOrder'], 0)
        );
}

export function clearHeadlessContentRequestCache(): void {
    requestCache.clear();
}
