import {
    StructuredContent,
    flattenContentFields,
    readBoolean,
    readImage,
    readNumber,
    readText,
} from '../../api/structuredContent';

export type HeroContent = {
    active: boolean;
    ctaLabel: string;
    ctaUrl: string;
    description: string;
    highlightedText: string;
    id: number;
    imageAlt: string;
    imageUrl: string;
    sortOrder: number;
    title: string;
};

export function mapHeroContent(item: StructuredContent): HeroContent {
    const fields = flattenContentFields(item.contentFields);
    const image = readImage(fields, 'illustration');

    return {
        active: readBoolean(fields, 'active', true),
        ctaLabel: readText(fields, 'ctaLabel'),
        ctaUrl: readText(fields, 'ctaUrl'),
        description: readText(fields, 'description'),
        highlightedText: readText(fields, 'highlightedText'),
        id: item.id,
        imageAlt: readText(fields, 'illustrationAlt'),
        imageUrl: image?.contentUrl ?? '',
        sortOrder: readNumber(fields, 'sortOrder'),
        title: readText(fields, 'title', item.title),
    };
}
