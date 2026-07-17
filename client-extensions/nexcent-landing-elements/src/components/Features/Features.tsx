import {useEffect, useState} from 'react';

import {
    listStructuredContents,
    resolveContentStructure,
} from '../../api/structuredContent';
import {getSiteId} from '../../liferay/global';
import {RichText} from '../RichText/RichText';
import {FeatureContent, mapFeatureContent} from './featureMapper';

import './features.css';

type FeaturesProps = {
    structureIdentifier: string;
};

type FeaturesState =
    | {status: 'loading'}
    | {message: string; status: 'error'}
    | {status: 'empty'}
    | {features: FeatureContent[]; status: 'ready'};

export function Features({structureIdentifier}: FeaturesProps) {
    const [state, setState] = useState<FeaturesState>({status: 'loading'});

    useEffect(() => {
        let active = true;

        const load = async () => {
            try {
                const siteId = getSiteId();
                const structure = await resolveContentStructure(
                    siteId,
                    structureIdentifier
                );
                const features = (await listStructuredContents(structure.id))
                    .map(mapFeatureContent)
                    .filter((item) => item.active)
                    .sort((left, right) => left.sortOrder - right.sortOrder);

                if (!active) {
                    return;
                }

                setState(
                    features.length
                        ? {features, status: 'ready'}
                        : {status: 'empty'}
                );
            }
            catch (error: unknown) {
                if (!active) {
                    return;
                }

                setState({
                    message:
                        error instanceof Error
                            ? error.message
                            : 'Unable to load Features content.',
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
            <section className="nxc-features nxc-features--loading" aria-busy="true">
                <div className="nxc-features__skeleton" />
            </section>
        );
    }

    if (state.status === 'error') {
        return (
            <section className="nxc-features nxc-features--message" role="alert">
                <strong>Features content could not be loaded.</strong>
                <span>{state.message}</span>
            </section>
        );
    }

    if (state.status === 'empty') {
        return (
            <section className="nxc-features nxc-features--message">
                <strong>No active Features are published.</strong>
                <span>
                    Create articles using the {structureIdentifier} Structure.
                </span>
            </section>
        );
    }

    return (
        <div className="nxc-features">
            {state.features.map((feature) => {
                const headingId = `nxc-feature-${feature.id}`;

                return (
                    <section
                        aria-labelledby={headingId}
                        className={`nxc-feature nxc-feature--${feature.backgroundVariant} nxc-feature--image-${feature.imagePosition}`}
                        key={feature.id}
                    >
                        <div className="nxc-feature__container">
                            {feature.imageUrl && (
                                <div className="nxc-feature__media">
                                    <img
                                        alt={feature.imageAlt}
                                        decoding="async"
                                        loading="lazy"
                                        src={feature.imageUrl}
                                    />
                                </div>
                            )}

                            <div className="nxc-feature__content">
                                <h2 id={headingId}>{feature.title}</h2>

                                <RichText
                                    className="nxc-feature__description"
                                    html={feature.descriptionHtml}
                                />

                                {feature.ctaLabel && feature.ctaUrl && (
                                    <a
                                        className="nxc-button nxc-button--primary"
                                        href={feature.ctaUrl}
                                    >
                                        {feature.ctaLabel}
                                    </a>
                                )}
                            </div>
                        </div>
                    </section>
                );
            })}
        </div>
    );
}
