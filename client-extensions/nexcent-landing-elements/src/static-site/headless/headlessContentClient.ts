import {
    clearStructuredContentRequestCache,
    type ContentField,
    type ImageValue,
    listStructuredContents,
    readContentBoolean,
    readContentImage,
    readContentNumber,
    readContentText,
    resolveContentStructure,
    type StructuredContent,
} from '../../api/structuredContent';

export type HeadlessDocument = ImageValue;
export type HeadlessContentField = ContentField;
export type HeadlessStructuredContent = StructuredContent;

export {
    readContentBoolean,
    readContentImage,
    readContentNumber,
    readContentText,
};

type LoadStructuredContentsOptions = {
    locale: string;
    pageSize?: number;
    siteId: string;
    structureIdentifier: string;
};

function readOptionalContentNumber(
    content: HeadlessStructuredContent,
    names: string[]
): number | undefined {
    const rawValue = readContentText(content, names, '');

    if (!rawValue) {
        return undefined;
    }

    const value = Number(rawValue);

    return Number.isFinite(value) ? value : undefined;
}

function publishedTimestamp(content: HeadlessStructuredContent): number {
    const value = Date.parse(content.datePublished ?? '');

    return Number.isFinite(value) ? value : 0;
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
        flatten: true,
        pageSize: 100,
    });

    return contents
        .filter((item) => readContentBoolean(item, ['active', 'enabled'], true))
        .sort((left, right) => {
            const leftOrder = readOptionalContentNumber(left, [
                'sortOrder',
                'displayOrder',
            ]);
            const rightOrder = readOptionalContentNumber(right, [
                'sortOrder',
                'displayOrder',
            ]);

            if (leftOrder !== undefined || rightOrder !== undefined) {
                return (
                    (leftOrder ?? Number.MAX_SAFE_INTEGER) -
                    (rightOrder ?? Number.MAX_SAFE_INTEGER)
                );
            }

            return publishedTimestamp(right) - publishedTimestamp(left);
        })
        .slice(0, pageSize);
}

export function clearHeadlessContentRequestCache(): void {
    clearStructuredContentRequestCache();
}
