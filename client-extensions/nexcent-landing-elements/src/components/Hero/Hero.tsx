import {useEffect, useState} from 'react';

import {
    listStructuredContents,
    resolveContentStructure,
} from '../../api/structuredContent';
import {getSiteId} from '../../liferay/global';
import {HeroContent, mapHeroContent} from './heroMapper';

import './hero.css';

type HeroProps = {
    structureIdentifier: string;
};

type HeroState =
    | {status: 'loading'}
    | {message: string; status: 'error'}
    | {status: 'empty'}
    | {hero: HeroContent; status: 'ready'};

export function Hero({structureIdentifier}: HeroProps) {
    const [state, setState] = useState<HeroState>({status: 'loading'});

    useEffect(() => {
        let active = true;

        const load = async () => {
            try {
                const siteId = getSiteId();
                const structure = await resolveContentStructure(
                    siteId,
                    structureIdentifier
                );
                const contents = await listStructuredContents(structure.id);
                const hero = contents
                    .map(mapHeroContent)
                    .filter((item) => item.active)
                    .sort((left, right) => left.sortOrder - right.sortOrder)[0];

                if (!active) {
                    return;
                }

                setState(hero ? {hero, status: 'ready'} : {status: 'empty'});
            }
            catch (error: unknown) {
                if (!active) {
                    return;
                }

                setState({
                    message:
                        error instanceof Error
                            ? error.message
                            : 'Unable to load the Hero content.',
                    status: 'error',
                });
            }
        };

        setState({status: 'loading'});
        void load();

        return () => {
            active = false;
        };
    }, [structureIdentifier]);

    if (state.status === 'loading') {
        return (
            <section className="nxc-hero nxc-hero--loading" aria-busy="true">
                <div className="nxc-hero__skeleton" />
            </section>
        );
    }

    if (state.status === 'error') {
        return (
            <section className="nxc-hero nxc-hero--message" role="alert">
                <strong>Hero content could not be loaded.</strong>
                <span>{state.message}</span>
            </section>
        );
    }

    if (state.status === 'empty') {
        return (
            <section className="nxc-hero nxc-hero--message">
                <strong>No active Hero content is published.</strong>
                <span>
                    Create an article using the {structureIdentifier} Structure.
                </span>
            </section>
        );
    }

    const {hero} = state;

    return (
        <section className="nxc-hero" aria-labelledby={`nxc-hero-${hero.id}`}>
            <div className="nxc-hero__container">
                <div className="nxc-hero__content">
                    <h1 id={`nxc-hero-${hero.id}`}>
                        {hero.title}{' '}
                        {hero.highlightedText && (
                            <span>{hero.highlightedText}</span>
                        )}
                    </h1>

                    {hero.description && <p>{hero.description}</p>}

                    {hero.ctaLabel && hero.ctaUrl && (
                        <a
                            className="nxc-button nxc-button--primary"
                            href={hero.ctaUrl}
                            rel={hero.ctaTarget === '_blank' ? 'noopener noreferrer' : undefined}
                            target={hero.ctaTarget}
                        >
                            {hero.ctaLabel}
                        </a>
                    )}
                </div>

                {hero.imageUrl && (
                    <div className="nxc-hero__media">
                        <img
                            alt={hero.imageAlt}
                            decoding="async"
                            loading="eager"
                            src={hero.imageUrl}
                        />
                    </div>
                )}
            </div>
        </section>
    );
}
