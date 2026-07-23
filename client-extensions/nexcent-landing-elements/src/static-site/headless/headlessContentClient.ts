import {
    clearStructuredContentRequestCache,
    type ContentField,
    type ImageValue,
    listStructuredContents,
    resolveContentStructure,
    type StructuredContent,
} from '../../api/structuredContent';

export type HeadlessDocument = ImageValue;
export type HeadlessContentField = ContentField;
export type HeadlessStructuredContent = StructuredContent;

type LoadStructuredContentsOptions = {
    locale: string;
    pageSize?: number;
    siteId: string;
    structureIdentifier: string;
};

function normalizeIdentifier(value: string | number | undefined): string {
    return String(value ?? '').trim().toLowerCase();
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
        [field.fieldReference, field.name].some((candidate) =>
            normalizedNames.includes(normalizeIdentifier(candidate))
        )
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
    const structure = await resolveContentStructure(
        siteId,
        structureIdentifier,
        locale
    );
    const contents = await listStructuredContents(structure.id, locale, {
        pageSize,
        sort: 'contentFields/sortOrder:asc',
    });

    return contents
        .filter((item) => readContentBoolean(item, ['active', 'enabled'], true))
        .sort(
            (left, right) =>
                readContentNumber(left, ['sortOrder', 'displayOrder'], 0) -
                readContentNumber(right, ['sortOrder', 'displayOrder'], 0)
        )
        .slice(0, pageSize);
}

export function clearHeadlessContentRequestCache(): void {
    clearStructuredContentRequestCache();
}
