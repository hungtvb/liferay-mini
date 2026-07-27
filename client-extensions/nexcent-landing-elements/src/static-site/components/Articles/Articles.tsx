import {resolveStaticAsset} from '../../assets';
import {useStructuredContentCollection} from '../../headless/useStructuredContentCollection';
import {
    readNumberSetting,
    readStringSetting,
} from '../../runtime/fragmentSettings';
import {mapArticleContent, resolveArticleDetailURL} from './articleMapper';
import {type ArticleCard} from './Articles.types';

type ArticlesProps = {
    host?: HTMLElement;
};

const DEFAULT_TITLE = 'Caring is the new marketing';
const DEFAULT_DESCRIPTION =
    "The Nexcent blog is the best place to read about the latest membership insights, trends and more. See who's joining the community, read about how our community are increasing their membership income and lot's more.";

const PREVIEW_ARTICLES: ArticleCard[] = [
    {
        imageAlt: 'Safeguarding process meeting',
        imageURL: resolveStaticAsset('article1'),
        title: 'Creating Streamlined Safeguarding Processes with OneRen',
    },
    {
        imageAlt: 'Laptop and work desk',
        imageURL: resolveStaticAsset('article2'),
        title: 'What are your safeguarding responsibilities and how can you manage them?',
    },
    {
        imageAlt: 'Laptop keyboard',
        imageURL: resolveStaticAsset('article3'),
        title: 'Revamping the Membership Model with Triathlon Australia',
    },
];

export function Articles({host}: ArticlesProps) {
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
    const title = readStringSetting(host, 'title', DEFAULT_TITLE);
    const description = readStringSetting(
        host,
        'description',
        DEFAULT_DESCRIPTION
    );
    const readMoreLabel = readStringSetting(host, 'read-more-label', 'Read more');
    const {error, items, status} = useStructuredContentCollection({
        host,
        mapContent: mapArticleContent,
        maxItems,
        previewItems: PREVIEW_ARTICLES,
        structureIdentifier,
    });
    const resolvedItems = items.map((item) => ({
        ...item,
        detailURL: resolveArticleDetailURL(
            siteBaseURL,
            item.friendlyUrlPath
        ),
    }));
    const missingFriendlyUrl = resolvedItems.filter(
        (item) => !item.detailURL
    ).length;

    if (host && (status === 'loading' || status === 'empty')) {
        return null;
    }

    return (
        <section className="marketing articles" data-runtime-state={status} id="articles">
            <div className="marketing__container articles__container">
                <div className="marketing__title articles__title title">
                    <h2>{title}</h2>
                    <p>{description}</p>
                </div>

                <div className="marketing__items articles__items mt">
                    {resolvedItems.map((item, index) => (
                        <article
                            className="marketing__item articles__item"
                            key={`${item.title}-${index}`}
                        >
                            {item.imageURL ? (
                                <div className="marketing__img articles__image img">
                                    <img src={item.imageURL} alt={item.imageAlt} />
                                </div>
                            ) : null}
                            <div className="marketing__info articles__content">
                                <p>{item.title}</p>
                                {item.detailURL ? (
                                    <a
                                        className="btn__wrapper articles__link"
                                        href={item.detailURL}
                                        target="_self"
                                    >
                                        {readMoreLabel} &nbsp; →
                                    </a>
                                ) : (
                                    <span
                                        className="btn__wrapper articles__link"
                                        aria-disabled="true"
                                    >
                                        {readMoreLabel} &nbsp; →
                                    </span>
                                )}
                            </div>
                        </article>
                    ))}
                </div>

                {error ? (
                    <span className="sr-only" role="status">
                        Unable to load Articles: {error.message}
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
