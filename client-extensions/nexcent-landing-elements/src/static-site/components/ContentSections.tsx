import content from '../../../../../prototypes/nexcent-static/content.json';
import {resolveStaticAsset} from '../assets';

function ClientLogos({duplicate = false}: {duplicate?: boolean}) {
    return (
        <div
            aria-hidden={duplicate || undefined}
            className="ticker__items ticker__marquee"
        >
            {content.clients.logos.map((logo) => (
                <div className="ticker__item" key={`${logo.image}-${duplicate}`}>
                    <img src={resolveStaticAsset(logo.image)} alt={duplicate ? '' : logo.alt} />
                </div>
            ))}
        </div>
    );
}

export function StaticClients() {
    return (
        <section className="clients">
            <div className="clients__container">
                <div className="title">
                    <h2>{content.clients.title}</h2>
                    <p>{content.clients.description}</p>
                </div>

                <div className="clients__wrapper mt">
                    <div className="clients__ticker ticker">
                        <div className="clients__box ticker__wrapper">
                            <ClientLogos />
                            <ClientLogos duplicate />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export function StaticCommunity() {
    return (
        <section className="community" id="services">
            <div className="community__container">
                <div className="community__title title">
                    <h2>{content.community.title}</h2>
                    <p>{content.community.description}</p>
                </div>

                <div className="community__items mt">
                    {content.community.items.map((item) => (
                        <article className="community__item" key={item.title}>
                            <div className="community__icon">
                                <img
                                    src={resolveStaticAsset(item.image)}
                                    alt={item.imageAlt}
                                />
                            </div>
                            <h3>{item.title}</h3>
                            <p>{item.description}</p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}

type FeatureKey = keyof typeof content.features;

export function StaticFeature({featureKey}: {featureKey: FeatureKey}) {
    const feature = content.features[featureKey];

    return (
        <section className="pixelgrade section" id={featureKey === 'primary' ? 'features' : undefined}>
            <div className="pixelgrade__container section__container block">
                <div className="pixelgrade__item section__item block__item">
                    <h2 className="pixelgrade__title block__title">{feature.title}</h2>
                    <p className="block__info">{feature.description}</p>
                    <a
                        className="pixelgrade__btn btn block__box"
                        href={feature.buttonHref}
                    >
                        {feature.buttonLabel}
                    </a>
                </div>

                <div className="pixelgrade__img section__img">
                    <img
                        src={resolveStaticAsset(feature.image)}
                        alt={feature.imageAlt}
                    />
                </div>
            </div>
        </section>
    );
}

export function StaticStatistics() {
    return (
        <section className="business" id="product">
            <div className="business__container">
                <div className="business__block block">
                    <div className="block__item">
                        <h2 className="block__title">
                            {content.statistics.title}{' '}
                            <span className="bright-headline">
                                {content.statistics.highlight}
                            </span>
                        </h2>
                        <p className="block__info">{content.statistics.description}</p>
                    </div>
                </div>

                <div className="business__items">
                    {content.statistics.items.map((item) => (
                        <div className="business__item" key={item.label}>
                            <div className="business__icon">
                                <img
                                    src={resolveStaticAsset(item.image)}
                                    alt={item.imageAlt}
                                />
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

export function StaticTestimonial() {
    return (
        <section className="customers" id="testimonial">
            <div className="customers__container block">
                <div className="customers__item block__item">
                    <p className="customers__info block__info">
                        {content.testimonial.quote}
                    </p>
                    <p className="customers__box block__box mt">
                        {content.testimonial.author}
                    </p>
                    <p className="customers__text">
                        {content.testimonial.organization}
                    </p>

                    <div className="customers__partner ticker">
                        <div className="customers__wrapper">
                            <div className="customers__items ticker__items">
                                {content.clients.logos.map((logo) => (
                                    <div
                                        className="customers__icon ticker__item"
                                        key={logo.image}
                                    >
                                        <img
                                            src={resolveStaticAsset(logo.image)}
                                            alt={logo.alt}
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="customers__btn">
                                <a
                                    className="btn__wrapper"
                                    href={content.testimonial.linkHref}
                                >
                                    {content.testimonial.linkLabel} &nbsp; →
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="customers__img img">
                    <img
                        src={resolveStaticAsset(content.testimonial.image)}
                        alt={content.testimonial.imageAlt}
                    />
                </div>
            </div>
        </section>
    );
}

export function StaticMarketing() {
    return (
        <section className="marketing">
            <div className="marketing__container">
                <div className="marketing__title title">
                    <h2>{content.marketing.title}</h2>
                    <p>{content.marketing.description}</p>
                </div>

                <div className="marketing__items mt">
                    {content.marketing.items.map((item) => (
                        <article className="marketing__item" key={item.title}>
                            <div className="marketing__img img">
                                <img
                                    src={resolveStaticAsset(item.image)}
                                    alt={item.imageAlt}
                                />
                            </div>
                            <div className="marketing__info">
                                <p>{item.title}</p>
                                <a className="btn__wrapper" href={item.linkHref}>
                                    {item.linkLabel} &nbsp; →
                                </a>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}

export function StaticCta() {
    return (
        <section className="suscipit" id="faq">
            <div className="suscipit__container block">
                <div className="suscipit__info block__item">
                    <h2 className="block__title big-fs">{content.cta.title}</h2>
                    <a
                        className="suscipit__btn btn block__box"
                        href={content.cta.buttonHref}
                    >
                        {content.cta.buttonLabel} &nbsp; →
                    </a>
                </div>
            </div>
        </section>
    );
}
