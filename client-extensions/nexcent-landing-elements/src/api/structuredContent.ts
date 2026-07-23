import {portalFetch} from './http';

export type Page<T> = {
    items: T[];
    page: number;
    pageSize: number;
    totalCount: number;
};

export type ContentStructure = {
    externalReferenceCode?: string;
    id: number;
    key?: string;
    name: string;
};

export type ImageValue = {
    contentUrl?: string;
    description?: string;
    id?: number;
    title?: string;
};

export type ContentFieldValue = {
    data?: unknown;
    document?: ImageValue;
    image?: ImageValue;
    value?: unknown;
};

export type ContentField = {
    contentFieldValue?: ContentFieldValue;
    fieldReference?: string;
    name: string;
    nestedContentFields?: ContentField[];
};

export type StructuredContent = {
    contentFields: ContentField[];
    contentStructureId: number;
    datePublished?: string;
    externalReferenceCode: string;
    friendlyUrlPath?: string;
    id: number;
    title: string;
};

export type ListStructuredContentsOptions = {
    filter?: string;
    pageSize?: number;
    sort?: string;
};

const requestCache = new Map<string, Promise<unknown>>();

function normalizeIdentifier(value: string | number | undefined): string {
    return String(value ?? '').trim().toLowerCase();
}

function cachedPortalFetch<T>(path: string, locale = ''): Promise<T> {
    const cacheKey = `${locale}:${path}`;
    const cachedRequest = requestCache.get(cacheKey);

    if (cachedRequest) {
        return cachedRequest as Promise<T>;
    }

    const request = portalFetch<T>(path, {
        headers: locale ? {'Accept-Language': locale} : undefined,
    });

    requestCache.set(cacheKey, request);
    request.catch(() => requestCache.delete(cacheKey));

    return request;
}

export async function listContentStructures(
    siteId: string,
    locale = ''
): Promise<ContentStructure[]> {
    const page = await cachedPortalFetch<Page<ContentStructure>>(
        `/o/headless-delivery/v1.0/sites/${encodeURIComponent(siteId)}/content-structures?pageSize=200`,
        locale
    );

    return page.items;
}

export async function resolveContentStructure(
    siteId: string,
    identifier: string,
    locale = ''
): Promise<ContentStructure> {
    const normalizedIdentifier = normalizeIdentifier(identifier);

    if (!normalizedIdentifier) {
        throw new Error('A Content Structure key or ERC is required.');
    }

    if (/^\d+$/.test(normalizedIdentifier)) {
        return {
            id: Number(normalizedIdentifier),
            name: identifier,
        };
    }

    const structures = await listContentStructures(siteId, locale);
    const structure = structures.find((item) =>
        [item.externalReferenceCode, item.key, item.id].some(
            (candidate) => normalizeIdentifier(candidate) === normalizedIdentifier
        )
    );

    if (!structure) {
        throw new Error(
            `Content Structure key or ERC "${identifier}" was not found in site ${siteId}.`
        );
    }

    return structure;
}

export async function listStructuredContents(
    contentStructureId: number,
    locale = '',
    options: ListStructuredContentsOptions = {}
): Promise<StructuredContent[]> {
    const pageSize = Math.min(
        100,
        Math.max(1, Math.trunc(options.pageSize ?? 100))
    );
    const query = new URLSearchParams({pageSize: String(pageSize)});

    if (options.filter?.trim()) {
        query.set('filter', options.filter.trim());
    }

    if (options.sort?.trim()) {
        query.set('sort', options.sort.trim());
    }

    const page = await cachedPortalFetch<Page<StructuredContent>>(
        `/o/headless-delivery/v1.0/content-structures/${encodeURIComponent(
            String(contentStructureId)
        )}/structured-contents?${query.toString()}`,
        locale
    );

    return page.items;
}

export function clearStructuredContentRequestCache(): void {
    requestCache.clear();
}

export function flattenContentFields(
    fields: ContentField[]
): Map<string, ContentFieldValue> {
    const result = new Map<string, ContentFieldValue>();

    const visit = (items: ContentField[]) => {
        for (const field of items) {
            if (field.contentFieldValue) {
                result.set(field.name, field.contentFieldValue);

                if (field.fieldReference) {
                    result.set(field.fieldReference, field.contentFieldValue);
                }
            }

            if (field.nestedContentFields?.length) {
                visit(field.nestedContentFields);
            }
        }
    };

    visit(fields);

    return result;
}

export function readText(
    fields: Map<string, ContentFieldValue>,
    name: string,
    fallback = ''
): string {
    const value = fields.get(name)?.data;

    return typeof value === 'string' ? value : fallback;
}

export function readValue(
    fields: Map<string, ContentFieldValue>,
    name: string,
    fallback = ''
): string {
    const fieldValue = fields.get(name);
    const value = fieldValue?.value ?? fieldValue?.data;

    if (value === null || value === undefined) {
        return fallback;
    }

    return String(value).trim() || fallback;
}

export function readNumber(
    fields: Map<string, ContentFieldValue>,
    name: string,
    fallback = 0
): number {
    const value = fields.get(name)?.data;
    const numberValue = typeof value === 'number' ? value : Number(value);

    return Number.isFinite(numberValue) ? numberValue : fallback;
}

export function readBoolean(
    fields: Map<string, ContentFieldValue>,
    name: string,
    fallback = false
): boolean {
    const value = fields.get(name)?.data;

    if (typeof value === 'boolean') {
        return value;
    }

    if (typeof value === 'string') {
        return value.toLowerCase() === 'true';
    }

    return fallback;
}

export function readImage(
    fields: Map<string, ContentFieldValue>,
    name: string
): ImageValue | undefined {
    const value = fields.get(name);

    return value?.image ?? value?.document;
}
