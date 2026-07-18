import {
    StructuredContent,
    flattenContentFields,
    readBoolean,
    readImage,
    readNumber,
    readText,
} from '../../api/structuredContent';
import {safeLinkUrl} from '../../utils/url';

export type ServiceContent = {
    active: boolean;
    description: string;
    iconAlt: string;
    iconUrl: string;
    id: number;
    sortOrder: number;
    linkLabel: string;
    linkUrl: string;
    title: string;
};

export type ServicesIntroContent = {
    description: string;
    id: number;
    heading: string;
};

export function mapServiceContent(item: StructuredContent): ServiceContent {
    const fields = flattenContentFields(item.contentFields);
    const icon = readImage(fields, 'icon');

    return {
        active: readBoolean(fields, 'active', true),
        description: readText(
            fields,
            'description',
            readText(fields, 'descriptionHtml')
        ),
        iconAlt: readText(fields, 'iconAlt'),
        iconUrl: icon?.contentUrl ?? '',
        id: item.id,
        sortOrder: readNumber(fields, 'sortOrder'),
        linkLabel: readText(fields, 'linkLabel'),
        linkUrl: safeLinkUrl(
            readText(fields, 'linkUrl', readText(fields, 'targetUrl'))
        ),
        title: readText(fields, 'title', item.title),
    };
}

export function mapServicesIntroContent(
    item: StructuredContent
): ServicesIntroContent {
    const fields = flattenContentFields(item.contentFields);

    return {
        description: readText(fields, 'description'),
        heading: readText(fields, 'heading', readText(fields, 'title', item.title)),
        id: item.id,
    };
}
