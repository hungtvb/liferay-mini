import {
    type HeadlessStructuredContent,
    readContentImage,
} from '../../headless/headlessContentClient';
import {type ArticleCard} from './Articles.types';

export function mapArticleContent(
    structuredContent: HeadlessStructuredContent
): ArticleCard {
    const title = structuredContent.title?.trim() || 'Untitled article';
    const image = readContentImage(
        structuredContent,
        ['coverImage'],
        {alt: title, url: ''}
    );

    return {
        friendlyUrlPath: structuredContent.friendlyUrlPath?.trim(),
        imageAlt: image.alt || title,
        imageURL: image.url,
        title,
    };
}

export function resolveArticleDetailURL(
    siteBaseURL: string,
    friendlyUrlPath: string | undefined
): string {
    const base = siteBaseURL.trim().replace(/\/+$/, '');
    const path = friendlyUrlPath?.trim().replace(/^\/+|\/+$/g, '') ?? '';

    if (!base || !path) {
        return '';
    }

    return `${base}/w/${path}`;
}
