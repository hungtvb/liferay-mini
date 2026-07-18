import {
    StructuredContent,
    flattenContentFields,
    readBoolean,
    readImage,
    readNumber,
    readText,
} from '../../api/structuredContent';
import {safeLinkUrl} from '../../utils/url';

export type HeroContent = {
    active: boolean;
    ctaLabel: string;
    ctaTarget: '_blank' | '_self';
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
        ctaTarget:
            readText(fields, 'ctaTarget') === '_blank' ? '_blank' : '_self',
        ctaUrl: safeLinkUrl(readText(fields, 'ctaUrl')),
        description: readText(fields, 'description'),
        highlightedText: readText(fields, 'highlightedText'),
        id: item.id,
        imageAlt: readText(fields, 'illustrationAlt'),
        imageUrl: image?.contentUrl ?? '',
        sortOrder: readNumber(fields, 'sortOrder'),
        title: readText(fields, 'title', item.title),
    };
}
