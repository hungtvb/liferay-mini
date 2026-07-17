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
    image?: ImageValue;
};

export type ContentField = {
    contentFieldValue?: ContentFieldValue;
    name: string;
    nestedContentFields?: ContentField[];
};

export type StructuredContent = {
    contentFields: ContentField[];
    contentStructureId: number;
    externalReferenceCode: string;
    id: number;
    title: string;
};

export async function listContentStructures(
    siteId: string
): Promise<ContentStructure[]> {
    const page = await portalFetch<Page<ContentStructure>>(
        `/o/headless-delivery/v1.0/sites/${encodeURIComponent(siteId)}/content-structures?pageSize=100`
    );

    return page.items;
}

export async function resolveContentStructure(
    siteId: string,
    identifier: string
): Promise<ContentStructure> {
    const normalizedIdentifier = identifier.trim().toLowerCase();
    const structures = await listContentStructures(siteId);
    const structure = structures.find(
        (item) =>
            item.externalReferenceCode?.toLowerCase() ===
                normalizedIdentifier ||
            item.name.trim().toLowerCase() === normalizedIdentifier
    );

    if (!structure) {
        throw new Error(
            `Content Structure "${identifier}" was not found in site ${siteId}.`
        );
    }

    return structure;
}

export async function listStructuredContents(
    contentStructureId: number
): Promise<StructuredContent[]> {
    const page = await portalFetch<Page<StructuredContent>>(
        `/o/headless-delivery/v1.0/content-structures/${contentStructureId}/structured-contents?flatten=true&pageSize=100`
    );

    return page.items;
}

export function flattenContentFields(
    fields: ContentField[]
): Map<string, ContentFieldValue> {
    const result = new Map<string, ContentFieldValue>();

    const visit = (items: ContentField[]) => {
        for (const field of items) {
            if (field.contentFieldValue) {
                result.set(field.name, field.contentFieldValue);
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
    return fields.get(name)?.image;
}
