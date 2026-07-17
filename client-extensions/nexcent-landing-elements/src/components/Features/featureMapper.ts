import {
    StructuredContent,
    flattenContentFields,
    readBoolean,
    readImage,
    readNumber,
    readText,
} from '../../api/structuredContent';

export type FeatureContent = {
    active: boolean;
    backgroundVariant: 'silver' | 'white';
    ctaLabel: string;
    ctaUrl: string;
    descriptionHtml: string;
    id: number;
    imageAlt: string;
    imagePosition: 'left' | 'right';
    imageUrl: string;
    sortOrder: number;
    title: string;
};

function readChoice<T extends string>(
    value: string,
    allowedValues: readonly T[],
    fallback: T
): T {
    return allowedValues.includes(value as T) ? (value as T) : fallback;
}

export function mapFeatureContent(item: StructuredContent): FeatureContent {
    const fields = flattenContentFields(item.contentFields);
    const image = readImage(fields, 'image');

    return {
        active: readBoolean(fields, 'active', true),
        backgroundVariant: readChoice(
            readText(fields, 'backgroundVariant'),
            ['white', 'silver'] as const,
            'white'
        ),
        ctaLabel: readText(fields, 'ctaLabel'),
        ctaUrl: readText(fields, 'ctaUrl'),
        descriptionHtml: readText(fields, 'descriptionHtml'),
        id: item.id,
        imageAlt: readText(fields, 'imageAlt'),
        imagePosition: readChoice(
            readText(fields, 'imagePosition'),
            ['left', 'right'] as const,
            'left'
        ),
        imageUrl: image?.contentUrl ?? '',
        sortOrder: readNumber(fields, 'sortOrder'),
        title: readText(fields, 'title', item.title),
    };
}
