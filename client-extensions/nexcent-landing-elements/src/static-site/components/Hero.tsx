import {useEffect, useMemo, useState} from 'react';

import content from '../../../../../prototypes/nexcent-static/content.json';
import {resolveStaticAsset} from '../assets';

export function StaticHero() {
    const slides = content.hero.slides;
    const [activeIndex, setActiveIndex] = useState(0);
    const [paused, setPaused] = useState(false);
    const reduceMotion = useMemo(
        () =>
            typeof window !== 'undefined' &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        []
    );

    useEffect(() => {
        if (paused || reduceMotion || slides.length < 2) {
            return;
        }

        const timer = window.setInterval(() => {
            setActiveIndex((index) => (index + 1) % slides.length);
        }, 3000);

        return () => window.clearInterval(timer);
    }, [paused, reduceMotion, slides.length]);

    const slide = slides[activeIndex];

    return (
        <section className="home" id="home">
            <div className="home__container">
                <div
                    className="swiper mySwiper"
                    onMouseEnter={() => setPaused(true)}
                    onMouseLeave={() => setPaused(false)}
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
                                    >
                                        {slide.buttonLabel}
                                    </a>
                                </div>

                                <div className="home__img img">
                                    <img
                                        src={resolveStaticAsset(slide.image)}
                                        alt={slide.imageAlt}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

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
                </div>
            </div>
        </section>
    );
}
