import content from '../../../../../prototypes/nexcent-static/content.json';
import {resolveStaticAsset} from '../assets';
import {
    type HeadlessStructuredContent,
    readContentImage,
    readContentText,
} from '../headless/headlessContentClient';
import {useStructuredContentCollection} from '../headless/useStructuredContentCollection';
import {
    readBooleanSetting,
    readNumberSetting,
    readStringSetting,
} from '../runtime/fragmentSettings';

type HostProps = {
    host?: HTMLElement;
};

type ClientLogo = {
    alt: string;
    imageURL: string;
};

type CommunityItem = {
    description: string;
    imageAlt: string;
    imageURL: string;
    title: string;
};

type MarketingItem = {
    imageAlt: string;
    imageURL: string;
    linkHref: string;
    linkLabel: string;
    linkTarget: string;
    title: string;
};

const FALLBACK_CLIENT_LOGOS: ClientLogo[] = content.clients.logos.map((logo) => ({
    alt: logo.alt,
    imageURL: resolveStaticAsset(logo.image),
}));

const FALLBACK_COMMUNITY_ITEMS: CommunityItem[] = content.community.items.map(
    (item) => ({
        description: item.description,
        imageAlt: item.imageAlt,
        imageURL: resolveStaticAsset(item.image),
        title: item.title,
    })
);

const FALLBACK_MARKETING_ITEMS: MarketingItem[] = content.marketing.items.map(
    (item) => ({
        imageAlt: item.imageAlt,
        imageURL: resolveStaticAsset(item.image),
        linkHref: item.linkHref,
        linkLabel: item.linkLabel,
        linkTarget: '_self',
        title: item.title,
    })
);

function ClientLogos({
    duplicate = false,
    logos,
}: {
    duplicate?: boolean;
    logos: ClientLogo[];
}) {
    return (
        <div
            aria-hidden={duplicate || undefined}
            className="ticker__items ticker__marquee"
        >
            {logos.map((logo, index) => (
                <div className="ticker__item" key={`${logo.imageURL}-${index}-${duplicate}`}>
                    <img src={logo.imageURL} alt={duplicate ? '' : logo.alt} />
                </div>
            ))}
        </div>
    );
}

function readClientLogos(host: HTMLElement | undefined): ClientLogo[] {
    return FALLBACK_CLIENT_LOGOS.map((fallback, index) => ({
        alt: readStringSetting(host, `logo-${index + 1}-alt`, fallback.alt),
        imageURL: readStringSetting(
            host,
            `logo-${index + 1}-url`,
            fallback.imageURL
        ),
    }));
}

export function StaticClients({host}: HostProps) {
    const logos = readClientLogos(host);
    const title = readStringSetting(host, 'title', content.clients.title);
    const description = readStringSetting(
        host,
        'description',
        content.clients.description
    );
    const showTicker = readBooleanSetting(host, 'show-ticker', true);

    return (
        <section className="clients">
            <div className="clients__container">
                <div className="title">
                    <h2>{title}</h2>
                    <p>{description}</p>
                </div>

                <div className="clients__wrapper mt">
                    <div className="clients__ticker ticker">
                        <div className="clients__box ticker__wrapper">
                            <ClientLogos logos={logos} />
                            {showTicker ? <ClientLogos duplicate logos={logos} /> : null}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function mapCommunityContent(
    structuredContent: HeadlessStructuredContent,
    index: number
): CommunityItem {
    const fallback =
        FALLBACK_COMMUNITY_ITEMS[index % FALLBACK_COMMUNITY_ITEMS.length] ??
        FALLBACK_COMMUNITY_ITEMS[0];
    const image = readContentImage(
        structuredContent,
        ['icon', 'image', 'iconFile'],
        {alt: fallback.imageAlt, url: fallback.imageURL}
    );

    return {
        description: readContentText(
            structuredContent,
            ['description', 'summary'],
            fallback.description
        ),
        imageAlt: readContentText(
            structuredContent,
            ['iconAlt', 'imageAlt'],
            image.alt
        ),
        imageURL: image.url,
        title: readContentText(
            structuredContent,
            ['title', 'heading'],
            structuredContent.title || fallback.title
        ),
    };
}

export function StaticCommunity({host}: HostProps) {
    const structureIdentifier = readStringSetting(
        host,
        'structure-identifier',
        'NXC Service Item'
    );
    const maxItems = readNumberSetting(host, 'max-items', 3, {
        max: 12,
        min: 1,
    });
    const title = readStringSetting(host, 'title', content.community.title);
    const description = readStringSetting(
        host,
        'description',
        content.community.description
    );
    const {error, items, status} = useStructuredContentCollection({
        fallback: FALLBACK_COMMUNITY_ITEMS,
        host,
        mapContent: mapCommunityContent,
        maxItems,
        structureIdentifier,
    });

    return (
        <section className="community" data-runtime-state={status} id="services">
            <div className="community__container">
                <div className="community__title title">
                    <h2>{title}</h2>
                    <p>{description}</p>
                </div>

                <div className="community__items mt">
                    {items.map((item, index) => (
                        <article className="community__item" key={`${item.title}-${index}`}>
                            <div className="community__icon">
                                <img src={item.imageURL} alt={item.imageAlt} />
                            </div>
                            <h3>{item.title}</h3>
                            <p>{item.description}</p>
                        </article>
                    ))}
                </div>

                {error ? (
                    <span className="sr-only" role="status">
                        Services are using fallback content: {error.message}
                    </span>
                ) : null}
            </div>
        </section>
    );
}

type FeatureKey = keyof typeof content.features;

type FeatureProps = HostProps & {
    featureKey: FeatureKey;
};

export function StaticFeature({featureKey, host}: FeatureProps) {
    const fallback = content.features[featureKey];
    const title = readStringSetting(host, 'title', fallback.title);
    const description = readStringSetting(
        host,
        'description',
        fallback.description
    );
    const buttonLabel = readStringSetting(
        host,
        'button-label',
        fallback.buttonLabel
    );
    const buttonHref = readStringSetting(
        host,
        'button-url',
        fallback.buttonHref
    );
    const buttonTarget = readStringSetting(host, 'button-target', '_self');
    const imageURL = readStringSetting(
        host,
        'image-url',
        resolveStaticAsset(fallback.image)
    );
    const imageAlt = readStringSetting(host, 'image-alt', fallback.imageAlt);
    const showButton = readBooleanSetting(host, 'show-button', true);

    return (
        <section
            className="pixelgrade section"
            id={featureKey === 'primary' ? 'features' : undefined}
        >
            <div className="pixelgrade__container section__container block">
                <div className="pixelgrade__item section__item block__item">
                    <h2 className="pixelgrade__title block__title">{title}</h2>
                    <p className="block__info">{description}</p>
                    {showButton ? (
                        <a
                            className="pixelgrade__btn btn block__box"
                            href={buttonHref}
                            target={buttonTarget || undefined}
                        >
                            {buttonLabel}
                        </a>
                    ) : null}
                </div>

                <div className="pixelgrade__img section__img">
                    <img src={imageURL} alt={imageAlt} />
                </div>
            </div>
        </section>
    );
}

export function StaticStatistics({host}: HostProps) {
    const title = readStringSetting(host, 'title', content.statistics.title);
    const highlight = readStringSetting(
        host,
        'highlight',
        content.statistics.highlight
    );
    const description = readStringSetting(
        host,
        'description',
        content.statistics.description
    );
    const items = content.statistics.items.map((fallback, index) => ({
        imageAlt: readStringSetting(
            host,
            `metric-${index + 1}-icon-alt`,
            fallback.imageAlt
        ),
        imageURL: readStringSetting(
            host,
            `metric-${index + 1}-icon-url`,
            resolveStaticAsset(fallback.image)
        ),
        label: readStringSetting(
            host,
            `metric-${index + 1}-label`,
            fallback.label
        ),
        value: readStringSetting(
            host,
            `metric-${index + 1}-value`,
            fallback.value
        ),
    }));

    return (
        <section className="business" id="product">
            <div className="business__container">
                <div className="business__block block">
                    <div className="block__item">
                        <h2 className="block__title">
                            {title}{' '}
                            <span className="bright-headline">{highlight}</span>
                        </h2>
                        <p className="block__info">{description}</p>
                    </div>
                </div>

                <div className="business__items">
                    {items.map((item, index) => (
                        <div className="business__item" key={`${item.label}-${index}`}>
                            <div className="business__icon">
                                <img src={item.imageURL} alt={item.imageAlt} />
                            </div>
                            <div className="business__info">
                                <p>{item.value}</p>
                                <p>{item.label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export function StaticTestimonial({host}: HostProps) {
    const quote = readStringSetting(host, 'quote', content.testimonial.quote);
    const author = readStringSetting(host, 'author', content.testimonial.author);
    const organization = readStringSetting(
        host,
        'organization',
        content.testimonial.organization
    );
    const imageURL = readStringSetting(
        host,
        'image-url',
        resolveStaticAsset(content.testimonial.image)
    );
    const imageAlt = readStringSetting(
        host,
        'image-alt',
        content.testimonial.imageAlt
    );
    const linkLabel = readStringSetting(
        host,
        'link-label',
        content.testimonial.linkLabel
    );
    const linkHref = readStringSetting(
        host,
        'link-url',
        content.testimonial.linkHref
    );
    const linkTarget = readStringSetting(host, 'link-target', '_self');
    const showPartnerLogos = readBooleanSetting(host, 'show-partner-logos', true);

    return (
        <section className="customers" id="testimonial">
            <div className="customers__container block">
                <div className="customers__item block__item">
                    <p className="customers__info block__info">{quote}</p>
                    <p className="customers__box block__box mt">{author}</p>
                    <p className="customers__text">{organization}</p>

                    <div className="customers__partner ticker">
                        <div className="customers__wrapper">
                            {showPartnerLogos ? (
                                <div className="customers__items ticker__items">
                                    {FALLBACK_CLIENT_LOGOS.map((logo, index) => (
                                        <div
                                            className="customers__icon ticker__item"
                                            key={`${logo.imageURL}-${index}`}
                                        >
                                            <img src={logo.imageURL} alt={logo.alt} />
                                        </div>
                                    ))}
                                </div>
                            ) : null}
                            <div className="customers__btn">
                                <a
                                    className="btn__wrapper"
                                    href={linkHref}
                                    target={linkTarget || undefined}
                                >
                                    {linkLabel} &nbsp; →
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="customers__img img">
                    <img src={imageURL} alt={imageAlt} />
                </div>
            </div>
        </section>
    );
}

function mapMarketingContent(
    structuredContent: HeadlessStructuredContent,
    index: number
): MarketingItem {
    const fallback =
        FALLBACK_MARKETING_ITEMS[index % FALLBACK_MARKETING_ITEMS.length] ??
        FALLBACK_MARKETING_ITEMS[0];
    const image = readContentImage(
        structuredContent,
        ['thumbnail', 'image', 'thumbnailFile'],
        {alt: fallback.imageAlt, url: fallback.imageURL}
    );
    const targetUrl = readContentText(
        structuredContent,
        ['targetUrl', 'linkUrl', 'ctaUrl'],
        structuredContent.friendlyUrlPath
            ? `/w/${structuredContent.friendlyUrlPath}`
            : fallback.linkHref
    );

    return {
        imageAlt: readContentText(
            structuredContent,
            ['thumbnailAlt', 'imageAlt'],
            image.alt
        ),
        imageURL: image.url,
        linkHref: targetUrl,
        linkLabel: readContentText(
            structuredContent,
            ['linkLabel', 'ctaLabel'],
            ''
        ),
        linkTarget: readContentText(
            structuredContent,
            ['linkTarget', 'ctaTarget'],
            '_self'
        ),
        title: readContentText(
            structuredContent,
            ['title', 'heading'],
            structuredContent.title || fallback.title
        ),
    };
}

export function StaticMarketing({host}: HostProps) {
    const structureIdentifier = readStringSetting(
        host,
        'structure-identifier',
        'NXC Community Card'
    );
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
    const readMoreLabel = readStringSetting(host, 'read-more-label', 'Readmore');
    const {error, items, status} = useStructuredContentCollection({
        fallback: FALLBACK_MARKETING_ITEMS,
        host,
        mapContent: mapMarketingContent,
        maxItems,
        structureIdentifier,
    });

    return (
        <section className="marketing" data-runtime-state={status}>
            <div className="marketing__container">
                <div className="marketing__title title">
                    <h2>{title}</h2>
                    <p>{description}</p>
                </div>

                <div className="marketing__items mt">
                    {items.map((item, index) => (
                        <article className="marketing__item" key={`${item.title}-${index}`}>
                            <div className="marketing__img img">
                                <img src={item.imageURL} alt={item.imageAlt} />
                            </div>
                            <div className="marketing__info">
                                <p>{item.title}</p>
                                <a
                                    className="btn__wrapper"
                                    href={item.linkHref}
                                    target={item.linkTarget || undefined}
                                >
                                    {item.linkLabel || readMoreLabel} &nbsp; →
                                </a>
                            </div>
                        </article>
                    ))}
                </div>

                {error ? (
                    <span className="sr-only" role="status">
                        Marketing cards are using fallback content: {error.message}
                    </span>
                ) : null}
            </div>
        </section>
    );
}

export function StaticCta({host}: HostProps) {
    const title = readStringSetting(host, 'title', content.cta.title);
    const buttonLabel = readStringSetting(
        host,
        'button-label',
        content.cta.buttonLabel
    );
    const buttonHref = readStringSetting(
        host,
        'button-url',
        content.cta.buttonHref
    );
    const buttonTarget = readStringSetting(host, 'button-target', '_self');
    const showButton = readBooleanSetting(host, 'show-button', true);

    return (
        <section className="suscipit" id="faq">
            <div className="suscipit__container block">
                <div className="suscipit__info block__item">
                    <h2 className="block__title big-fs">{title}</h2>
                    {showButton ? (
                        <a
                            className="suscipit__btn btn block__box"
                            href={buttonHref}
                            target={buttonTarget || undefined}
                        >
                            {buttonLabel} &nbsp; →
                        </a>
                    ) : null}
                </div>
            </div>
        </section>
    );
}
