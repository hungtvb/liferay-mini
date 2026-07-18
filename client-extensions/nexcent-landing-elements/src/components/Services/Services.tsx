import {useEffect, useState} from 'react';

import {
    listStructuredContents,
    resolveContentStructure,
} from '../../api/structuredContent';
import {getSiteId} from '../../liferay/global';
import {
    ServiceContent,
    ServicesIntroContent,
    mapServiceContent,
    mapServicesIntroContent,
} from './serviceMapper';

import './services.css';

type ServicesProps = {
    introStructureIdentifier: string;
    itemStructureIdentifier: string;
};

type ServicesState =
    | {status: 'loading'}
    | {message: string; status: 'error'}
    | {status: 'empty'}
    | {
          intro?: ServicesIntroContent;
          services: ServiceContent[];
          status: 'ready';
      };

export function Services({
    introStructureIdentifier,
    itemStructureIdentifier,
}: ServicesProps) {
    const [state, setState] = useState<ServicesState>({status: 'loading'});

    useEffect(() => {
        let active = true;

        const load = async () => {
            try {
                const siteId = getSiteId();
                const [introStructure, itemStructure] = await Promise.all([
                    resolveContentStructure(siteId, introStructureIdentifier),
                    resolveContentStructure(siteId, itemStructureIdentifier),
                ]);
                const [introItems, serviceItems] = await Promise.all([
                    listStructuredContents(introStructure.id),
                    listStructuredContents(itemStructure.id),
                ]);

                const intro = introItems
                    .map(mapServicesIntroContent)
                    [0];
                const services = serviceItems
                    .map(mapServiceContent)
                    .filter((item) => item.active)
                    .sort((left, right) => left.sortOrder - right.sortOrder);

                if (!active) {
                    return;
                }

                setState(
                    services.length
                        ? {intro, services, status: 'ready'}
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
                            : 'Unable to load Services content.',
                    status: 'error',
                });
            }
        };

        setState({status: 'loading'});
        void load();

        return () => {
            active = false;
        };
    }, [introStructureIdentifier, itemStructureIdentifier]);

    if (state.status === 'loading') {
        return (
            <section className="nxc-services nxc-services--loading" aria-busy="true">
                <div className="nxc-services__skeleton" />
            </section>
        );
    }

    if (state.status === 'error') {
        return (
            <section className="nxc-services nxc-services--message" role="alert">
                <strong>Services content could not be loaded.</strong>
                <span>{state.message}</span>
            </section>
        );
    }

    if (state.status === 'empty') {
        return (
            <section className="nxc-services nxc-services--message">
                <strong>No active Services are published.</strong>
                <span>
                    Create articles using the {itemStructureIdentifier} Structure.
                </span>
            </section>
        );
    }

    const {intro, services} = state;
    const headingId = intro ? `nxc-services-${intro.id}` : undefined;

    return (
        <section className="nxc-services" aria-labelledby={headingId}>
            <div className="nxc-services__container">
                {intro && (
                    <header className="nxc-services__header">
                        <h2 id={headingId}>{intro.heading}</h2>
                        {intro.description && <p>{intro.description}</p>}
                    </header>
                )}

                <div className="nxc-services__grid">
                    {services.map((service) => (
                        <article className="nxc-service-card" key={service.id}>
                            {service.iconUrl && (
                                <img
                                    alt={service.iconAlt}
                                    className="nxc-service-card__icon"
                                    decoding="async"
                                    loading="lazy"
                                    src={service.iconUrl}
                                />
                            )}

                            <h3>{service.title}</h3>

                            <p className="nxc-service-card__description">
                                {service.description}
                            </p>

                            {service.linkLabel && service.linkUrl ? (
                                <a
                                    className="nxc-service-card__link"
                                    href={service.linkUrl}
                                >
                                    {service.linkLabel}
                                    <span aria-hidden="true">→</span>
                                </a>
                            ) : null}
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
