import {
    StructuredContent,
    flattenContentFields,
    readBoolean,
    readImage,
    readNumber,
    readText,
} from '../../api/structuredContent';

export type ServiceContent = {
    active: boolean;
    descriptionHtml: string;
    iconAlt: string;
    iconUrl: string;
    id: number;
    sortOrder: number;
    targetUrl: string;
    title: string;
};

export type ServicesIntroContent = {
    active: boolean;
    description: string;
    id: number;
    sortOrder: number;
    title: string;
};

export function mapServiceContent(item: StructuredContent): ServiceContent {
    const fields = flattenContentFields(item.contentFields);
    const icon = readImage(fields, 'icon');

    return {
        active: readBoolean(fields, 'active', true),
        descriptionHtml: readText(fields, 'descriptionHtml'),
        iconAlt: readText(fields, 'iconAlt'),
        iconUrl: icon?.contentUrl ?? '',
        id: item.id,
        sortOrder: readNumber(fields, 'sortOrder'),
        targetUrl: readText(fields, 'targetUrl'),
        title: readText(fields, 'title', item.title),
    };
}

export function mapServicesIntroContent(
    item: StructuredContent
): ServicesIntroContent {
    const fields = flattenContentFields(item.contentFields);

    return {
        active: readBoolean(fields, 'active', true),
        description: readText(fields, 'description'),
        id: item.id,
        sortOrder: readNumber(fields, 'sortOrder'),
        title: readText(fields, 'title', item.title),
    };
}
