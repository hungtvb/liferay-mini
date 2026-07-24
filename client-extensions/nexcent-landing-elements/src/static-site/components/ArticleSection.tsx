import content from '../fallback/content.json';
import {resolveStaticAsset} from '../assets';
import {
    type HeadlessStructuredContent,
    readContentImage,
} from '../headless/headlessContentClient';
import {useStructuredContentCollection} from '../headless/useStructuredContentCollection';
import {
    readNumberSetting,
    readStringSetting,
} from '../runtime/fragmentSettings';

type HostProps = {
    host?: HTMLElement;
};

type ArticleCard = {
    friendlyUrlPath?: string;
    imageAlt: string;
    imageURL: string;
    linkHref?: string;
    title: string;
};

const FALLBACK_ARTICLES: ArticleCard[] = content.marketing.items.map((item) => ({
    imageAlt: item.imageAlt,
    imageURL: resolveStaticAsset(item.image),
    linkHref: item.linkHref,
    title: item.title,
}));

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

function mapArticleContent(
    structuredContent: HeadlessStructuredContent,
    index: number
): ArticleCard {
    const fallback =
        FALLBACK_ARTICLES[index % FALLBACK_ARTICLES.length] ??
        FALLBACK_ARTICLES[0];
    const title = structuredContent.title?.trim() || fallback.title;
    const image = readContentImage(
        structuredContent,
        ['coverImage'],
        {alt: title, url: fallback.imageURL}
    );

    return {
        friendlyUrlPath: structuredContent.friendlyUrlPath?.trim(),
        imageAlt: image.alt || title,
        imageURL: image.url,
        title,
    };
}

export function StaticArticles({host}: HostProps) {
    const structureIdentifier = readStringSetting(
        host,
        'structure-identifier',
        'NXC_ARTICLE'
    );
    const siteBaseURL = readStringSetting(host, 'site-base-url');
    const maxItems = readNumberSetting(host, 'max-items', 3, {
        max: 12,
        min: 1,
    });
    const title = readStringSetting(host, 'title', content.marketing.title);
    const description = readStringSetting(
        host,
        'description',
        content.marketing.description
    );
    const readMoreLabel = readStringSetting(host, 'read-more-label', 'Read more');
    const {error, items, status} = useStructuredContentCollection({
        fallback: FALLBACK_ARTICLES,
        host,
        mapContent: mapArticleContent,
        maxItems,
        structureIdentifier,
    });
    const resolvedItems = items.map((item) => ({
        ...item,
        linkHref:
            resolveArticleDetailURL(siteBaseURL, item.friendlyUrlPath) ||
            item.linkHref ||
            '',
    }));
    const missingFriendlyUrl = resolvedItems.filter((item) => !item.linkHref).length;

    return (
        <section className="marketing" data-runtime-state={status} id="articles">
            <div className="marketing__container">
                <div className="marketing__title title">
                    <h2>{title}</h2>
                    <p>{description}</p>
                </div>

                <div className="marketing__items mt">
                    {resolvedItems.map((item, index) => (
                        <article className="marketing__item" key={`${item.title}-${index}`}>
                            <div className="marketing__img img">
                                <img src={item.imageURL} alt={item.imageAlt} />
                            </div>
                            <div className="marketing__info">
                                <p>{item.title}</p>
                                {item.linkHref ? (
                                    <a
                                        className="btn__wrapper"
                                        href={item.linkHref}
                                        target="_self"
                                    >
                                        {readMoreLabel} &nbsp; →
                                    </a>
                                ) : (
                                    <span className="btn__wrapper" aria-disabled="true">
                                        {readMoreLabel} &nbsp; →
                                    </span>
                                )}
                            </div>
                        </article>
                    ))}
                </div>

                {error ? (
                    <span className="sr-only" role="status">
                        Articles are using fallback content: {error.message}
                    </span>
                ) : null}

                {status === 'ready' && missingFriendlyUrl > 0 ? (
                    <span className="sr-only" role="status">
                        {missingFriendlyUrl} Article links are unavailable. Verify the Article
                        friendly URL and the Nexcent Article Display Page Template.
                    </span>
                ) : null}
            </div>
        </section>
    );
}
