import {useEffect, useMemo, useState} from 'react';

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

type HeroProps = {
    host?: HTMLElement;
};

type HeroSlide = {
    buttonHref: string;
    buttonLabel: string;
    buttonTarget: string;
    description: string;
    highlight: string;
    imageAlt: string;
    imageURL: string;
    title: string;
};

const FALLBACK_HERO_SLIDES: HeroSlide[] = content.hero.slides.map((slide) => ({
    buttonHref: slide.buttonHref,
    buttonLabel: slide.buttonLabel,
    buttonTarget: '_self',
    description: slide.description,
    highlight: slide.highlight,
    imageAlt: slide.imageAlt,
    imageURL: resolveStaticAsset(slide.image),
    title: slide.title,
}));

function mapHeroContent(
    structuredContent: HeadlessStructuredContent,
    index: number
): HeroSlide {
    const fallback =
        FALLBACK_HERO_SLIDES[index % FALLBACK_HERO_SLIDES.length] ??
        FALLBACK_HERO_SLIDES[0];
    const image = readContentImage(
        structuredContent,
        ['image', 'illustration', 'heroImage', 'imageFile'],
        {alt: fallback.imageAlt, url: fallback.imageURL}
    );

    return {
        buttonHref: readContentText(
            structuredContent,
            ['ctaUrl', 'buttonUrl', 'linkUrl'],
            fallback.buttonHref
        ),
        buttonLabel: readContentText(
            structuredContent,
            ['ctaLabel', 'buttonLabel', 'linkLabel'],
            fallback.buttonLabel
        ),
        buttonTarget: readContentText(
            structuredContent,
            ['ctaTarget', 'buttonTarget', 'linkTarget'],
            '_self'
        ),
        description: readContentText(
            structuredContent,
            ['description', 'summary'],
            fallback.description
        ),
        highlight: readContentText(
            structuredContent,
            ['highlightedText', 'highlight'],
            fallback.highlight
        ),
        imageAlt: readContentText(
            structuredContent,
            ['imageAlt', 'illustrationAlt'],
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

export function StaticHero({host}: HeroProps) {
    const structureIdentifier = readStringSetting(
        host,
        'structure-identifier',
        'Nexcent Hero'
    );
    const maxSlides = readNumberSetting(host, 'max-slides', 3, {
        max: 10,
        min: 1,
    });
    const autoplay = readBooleanSetting(host, 'autoplay', true);
    const interval = readNumberSetting(host, 'interval', 3000, {
        max: 30000,
        min: 1000,
    });
    const pauseOnHover = readBooleanSetting(host, 'pause-on-hover', true);
    const showPagination = readBooleanSetting(host, 'show-pagination', true);
    const {error, items: slides, status} = useStructuredContentCollection({
        fallback: FALLBACK_HERO_SLIDES,
        host,
        mapContent: mapHeroContent,
        maxItems: maxSlides,
        structureIdentifier,
    });
    const [activeIndex, setActiveIndex] = useState(0);
    const [paused, setPaused] = useState(false);
    const reduceMotion = useMemo(
        () =>
            typeof window !== 'undefined' &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        []
    );

    useEffect(() => {
        if (activeIndex >= slides.length) {
            setActiveIndex(0);
        }
    }, [activeIndex, slides.length]);

    useEffect(() => {
        if (!autoplay || paused || reduceMotion || slides.length < 2) {
            return;
        }

        const timer = window.setInterval(() => {
            setActiveIndex((index) => (index + 1) % slides.length);
        }, interval);

        return () => window.clearInterval(timer);
    }, [autoplay, interval, paused, reduceMotion, slides.length]);

    const slide = slides[activeIndex] ?? slides[0];

    return (
        <section className="home" data-runtime-state={status} id="home">
            <div className="home__container">
                <div
                    className="swiper mySwiper"
                    onMouseEnter={() => pauseOnHover && setPaused(true)}
                    onMouseLeave={() => pauseOnHover && setPaused(false)}
                >
                    <div className="swiper-wrapper">
                        <div className="swiper-slide nxc-react-fade" key={activeIndex}>
                            <div className="home__slide block">
                                <div className="home__info block__item">
                                    <h1 className="block__title big-fs">
                                        {slide.title}{' '}
                                        <span className="bright-headline">
                                            {slide.highlight}
                                        </span>
                                    </h1>
                                    <p className="block__info">{slide.description}</p>
                                    <a
                                        className="home__btn btn block__box"
                                        href={slide.buttonHref}
                                        target={slide.buttonTarget || undefined}
                                    >
                                        {slide.buttonLabel}
                                    </a>
                                </div>

                                <div className="home__img img">
                                    <img src={slide.imageURL} alt={slide.imageAlt} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {showPagination && slides.length > 1 ? (
                        <div
                            aria-label="Choose hero slide"
                            className="swiper-pagination"
                            role="group"
                        >
                            {slides.map((item, index) => (
                                <button
                                    aria-label={`Show slide ${index + 1}: ${item.title}`}
                                    aria-pressed={index === activeIndex}
                                    className={`swiper-pagination-bullet${
                                        index === activeIndex
                                            ? ' swiper-pagination-bullet-active'
                                            : ''
                                    }`}
                                    key={`${item.title}-${index}`}
                                    onClick={() => setActiveIndex(index)}
                                    type="button"
                                />
                            ))}
                        </div>
                    ) : null}

                    {error ? (
                        <span className="sr-only" role="status">
                            Hero is using fallback content: {error.message}
                        </span>
                    ) : null}
                </div>
            </div>
        </section>
    );
}
