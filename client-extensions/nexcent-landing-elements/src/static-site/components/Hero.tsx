import {useEffect, useMemo, useState} from 'react';

import content from '../../../../../prototypes/nexcent-static/content.json';
import {resolveStaticAsset} from '../assets';
import {
    type HeadlessStructuredContent,
    readContentImage,
    readContentText,
    readContentValue,
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

function normalizeLinkTarget(value: string): string {
    const normalized = value.trim().toLowerCase();

    if (
        normalized === '_blank' ||
        normalized === 'blank' ||
        normalized === 'new window' ||
        normalized === 'new-window' ||
        normalized.includes('_blank')
    ) {
        return '_blank';
    }

    if (
        normalized === '_self' ||
        normalized === 'self' ||
        normalized === 'same window' ||
        normalized === 'same-window' ||
        normalized.includes('_self')
    ) {
        return '_self';
    }

    return '_self';
}

export function mapHeroContent(
    structuredContent: HeadlessStructuredContent
): HeroSlide {
    const image = readContentImage(
        structuredContent,
        ['illustration', 'image', 'heroImage', 'imageFile'],
        {alt: '', url: ''}
    );

    return {
        buttonHref: readContentText(structuredContent, [
            'ctaUrl',
            'buttonUrl',
            'linkUrl',
        ]),
        buttonLabel: readContentText(structuredContent, [
            'ctaLabel',
            'buttonLabel',
            'linkLabel',
        ]),
        buttonTarget: normalizeLinkTarget(
            readContentValue(
                structuredContent,
                ['ctaTarget', 'buttonTarget', 'linkTarget'],
                '_self'
            )
        ),
        description: readContentText(structuredContent, [
            'description',
            'summary',
        ]),
        highlight: readContentText(structuredContent, [
            'highlightedText',
            'highlight',
        ]),
        imageAlt: image.alt,
        imageURL: image.url,
        title: readContentText(
            structuredContent,
            ['title', 'heading'],
            structuredContent.title
        ),
    };
}

export function StaticHero({host}: HeroProps) {
    const structureIdentifier = readStringSetting(
        host,
        'structure-identifier',
        'NXC_LANDING_HERO'
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
                                    {slide.buttonLabel && slide.buttonHref ? (
                                        <a
                                            className="home__btn btn block__box"
                                            href={slide.buttonHref}
                                            rel={
                                                slide.buttonTarget === '_blank'
                                                    ? 'noreferrer'
                                                    : undefined
                                            }
                                            target={slide.buttonTarget}
                                        >
                                            {slide.buttonLabel}
                                        </a>
                                    ) : null}
                                </div>

                                {slide.imageURL ? (
                                    <div className="home__img img">
                                        <img
                                            alt={slide.imageAlt}
                                            src={slide.imageURL}
                                        />
                                    </div>
                                ) : null}
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
