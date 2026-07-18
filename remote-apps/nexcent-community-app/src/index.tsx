import React, {useEffect, useMemo, useState} from 'react';
import {createRoot, Root} from 'react-dom/client';

import './styles.css';

type ContentField = {
    contentFieldValue?: {
        data?: boolean | number | string;
        document?: {contentUrl?: string; title?: string};
        image?: {contentUrl?: string; title?: string};
    };
    name?: string;
};

type StructuredContent = {
    contentFields?: ContentField[];
    externalReferenceCode?: string;
    id?: number;
    title?: string;
};

type CollectionResponse<T> = {
    items?: T[];
};

type ContentStructure = {
    externalReferenceCode?: string;
    id?: number;
    name?: string;
};

type CommunityCard = {
    active: boolean;
    externalReferenceCode: string;
    publishedDate?: string;
    sortOrder: number;
    summary?: string;
    targetUrl: string;
    thumbnail: {
        alt: string;
        url: string;
    };
    title: string;
};

type CommunityData = {
    intro: {
        description?: string;
        heading: string;
    };
    items: CommunityCard[];
};

type LoadState =
    | {status: 'loading'}
    | {status: 'empty'}
    | {message: string; status: 'error'}
    | {data: CommunityData; status: 'ready'};

type ThemeDisplay = {
    getPortalURL?: () => string;
    getScopeGroupId?: () => number | string;
};

declare global {
    interface Window {
        Liferay?: {ThemeDisplay?: ThemeDisplay};
    }
}

function fieldMap(content: StructuredContent): Map<string, ContentField> {
    return new Map(
        (content.contentFields ?? [])
            .filter((field): field is ContentField & {name: string} => Boolean(field.name))
            .map((field) => [field.name, field])
    );
}

function text(fields: Map<string, ContentField>, name: string): string {
    const value = fields.get(name)?.contentFieldValue?.data;

    return value == null ? '' : String(value).trim();
}

function bool(fields: Map<string, ContentField>, name: string, fallback = true): boolean {
    const value = fields.get(name)?.contentFieldValue?.data;

    if (typeof value === 'boolean') {
        return value;
    }

    if (typeof value === 'string') {
        return value.toLowerCase() !== 'false';
    }

    return fallback;
}

function numberValue(fields: Map<string, ContentField>, name: string): number {
    const parsed = Number(fields.get(name)?.contentFieldValue?.data ?? 0);

    return Number.isFinite(parsed) ? parsed : 0;
}

function safeLinkUrl(value: string): string {
    const url = value.trim();

    if (url.startsWith('/') || url.startsWith('#')) {
        return url;
    }

    try {
        const parsed = new URL(url);

        return ['http:', 'https:'].includes(parsed.protocol) ? url : '';
    }
    catch {
        return '';
    }
}

function mediaUrl(
    fields: Map<string, ContentField>,
    name: string,
    portalURL: string
): string {
    const value = fields.get(name)?.contentFieldValue;
    const contentUrl = value?.image?.contentUrl ?? value?.document?.contentUrl ?? '';

    return contentUrl ? new URL(contentUrl, `${portalURL}/`).toString() : '';
}

async function getJson<T>(url: string): Promise<T> {
    const response = await fetch(url, {
        credentials: 'include',
        headers: {'Accept': 'application/json'},
    });

    if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
    }

    return (await response.json()) as T;
}

async function resolveStructureIds(
    portalURL: string,
    siteId: string,
    identifiers: string[]
): Promise<number[]> {
    const response = await getJson<CollectionResponse<ContentStructure>>(
        `${portalURL}/o/headless-delivery/v1.0/sites/${encodeURIComponent(siteId)}/content-structures?pageSize=200`
    );
    return identifiers.map((identifier) => {
        const normalized = identifier.trim().toLowerCase();
        const structure = (response.items ?? []).find((item) =>
            [item.name, item.externalReferenceCode]
                .filter(Boolean)
                .some((value) => String(value).trim().toLowerCase() === normalized)
        );

        if (!structure?.id) {
            throw new Error(`Content Structure not found: ${identifier}`);
        }

        return structure.id;
    });
}

async function getStructuredContents(
    portalURL: string,
    structureId: number
): Promise<StructuredContent[]> {
    const response = await getJson<CollectionResponse<StructuredContent>>(
        `${portalURL}/o/headless-delivery/v1.0/content-structures/${structureId}/structured-contents?flatten=true&pageSize=200`
    );

    return response.items ?? [];
}

async function loadCommunityData(element: HTMLElement): Promise<CommunityData | null> {
    const themeDisplay = window.Liferay?.ThemeDisplay;
    const portalURL = (
        element.getAttribute('liferay-base-url') ??
        themeDisplay?.getPortalURL?.() ??
        window.location.origin
    ).replace(/\/$/, '');
    const siteId =
        element.getAttribute('site-id') ??
        String(themeDisplay?.getScopeGroupId?.() ?? '');
    const introIdentifier =
        element.getAttribute('intro-structure-identifier') ??
        'NXC Community Intro';
    const itemIdentifier =
        element.getAttribute('item-structure-identifier') ??
        'NXC Community Card';

    if (!siteId) {
        throw new Error(
            'Site context is unavailable. Add site-id when running the app outside Liferay.'
        );
    }

    const [introStructureId, itemStructureId] = await resolveStructureIds(
        portalURL,
        siteId,
        [introIdentifier, itemIdentifier]
    );
    const [introContents, itemContents] = await Promise.all([
        getStructuredContents(portalURL, introStructureId),
        getStructuredContents(portalURL, itemStructureId),
    ]);
    const introContent = introContents[0];

    if (!introContent) {
        return null;
    }

    const introFields = fieldMap(introContent);
    const items = itemContents
        .map((content): CommunityCard | null => {
            const fields = fieldMap(content);
            const title = text(fields, 'title') || content.title?.trim() || '';
            const targetUrl = safeLinkUrl(text(fields, 'targetUrl'));
            const thumbnailUrl = mediaUrl(fields, 'thumbnail', portalURL);

            if (!bool(fields, 'active') || !title || !targetUrl || !thumbnailUrl) {
                return null;
            }

            return {
                active: true,
                externalReferenceCode: content.externalReferenceCode ?? String(content.id ?? ''),
                publishedDate: text(fields, 'publishedDate') || undefined,
                sortOrder: numberValue(fields, 'sortOrder'),
                summary: text(fields, 'summary') || undefined,
                targetUrl,
                thumbnail: {
                    alt: text(fields, 'thumbnailAlt'),
                    url: thumbnailUrl,
                },
                title,
            };
        })
        .filter((item): item is CommunityCard => item !== null)
        .sort((left, right) => left.sortOrder - right.sortOrder);

    if (!items.length) {
        return null;
    }

    return {
        intro: {
            description: text(introFields, 'description') || undefined,
            heading: text(introFields, 'heading') || introContent.title || 'Community updates',
        },
        items,
    };
}

function CommunityThumbnail({item}: {item: CommunityCard}) {
    const [failed, setFailed] = useState(false);

    if (failed) {
        return (
            <div
                aria-label={item.thumbnail.alt || `Image unavailable for ${item.title}`}
                className="nxc-community-card__image-fallback"
                role="img"
            >
                <svg aria-hidden="true" viewBox="0 0 48 48">
                    <path d="M7 9h34v30H7V9Zm4 4v17l8-8 6 6 4-4 8 8V13H11Zm8 5a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" fill="currentColor" />
                </svg>
                <span>Image unavailable</span>
            </div>
        );
    }

    return (
        <img
            alt={item.thumbnail.alt}
            className="nxc-community-card__image"
            loading="lazy"
            onError={() => setFailed(true)}
            src={item.thumbnail.url}
        />
    );
}

function formatPublishedDate(value: string): string {
    const date = new Date(value);

    return Number.isNaN(date.getTime())
        ? value
        : new Intl.DateTimeFormat(undefined, {dateStyle: 'medium'}).format(date);
}

function CommunityApp({host}: {host: HTMLElement}) {
    const [reloadKey, setReloadKey] = useState(0);
    const [state, setState] = useState<LoadState>({status: 'loading'});
    const retry = useMemo(() => () => setReloadKey((value) => value + 1), []);

    useEffect(() => {
        let active = true;

        setState({status: 'loading'});

        loadCommunityData(host)
            .then((data) => {
                if (!active) {
                    return;
                }

                setState(data ? {data, status: 'ready'} : {status: 'empty'});
            })
            .catch((error: unknown) => {
                if (!active) {
                    return;
                }

                const message =
                    error instanceof Error ? error.message : 'Unable to load community updates.';

                setState({message, status: 'error'});
            });

        return () => {
            active = false;
        };
    }, [host, reloadKey]);

    if (state.status === 'loading') {
        return (
            <section aria-busy="true" className="nxc-community nxc-community--state">
                <p>Loading community updates…</p>
                <div className="nxc-community__loading-grid" aria-hidden="true">
                    <span /><span /><span />
                </div>
            </section>
        );
    }

    if (state.status === 'empty') {
        return (
            <section className="nxc-community nxc-community--state">
                <h2>Community updates</h2>
                <p>No published community updates are available.</p>
            </section>
        );
    }

    if (state.status === 'error') {
        return (
            <section className="nxc-community nxc-community--state" role="alert">
                <h2>Community updates are unavailable</h2>
                <p>{state.message}</p>
                <button className="nxc-button nxc-button--primary" onClick={retry} type="button">
                    Try again
                </button>
            </section>
        );
    }

    return (
        <section className="nxc-community" aria-labelledby="nxc-community-heading">
            <div className="nxc-community__container">
                <header className="nxc-community__header">
                    <h2 id="nxc-community-heading">{state.data.intro.heading}</h2>
                    {state.data.intro.description ? <p>{state.data.intro.description}</p> : null}
                </header>
                <div className="nxc-community__grid">
                    {state.data.items.map((item) => (
                        <article className="nxc-community-card" key={item.externalReferenceCode}>
                            <CommunityThumbnail item={item} />
                            <div className="nxc-community-card__body">
                                {item.publishedDate ? (
                                    <time dateTime={item.publishedDate}>
                                        {formatPublishedDate(item.publishedDate)}
                                    </time>
                                ) : null}
                                <h3>{item.title}</h3>
                                {item.summary ? <p>{item.summary}</p> : null}
                                <a className="nxc-community-card__link" href={item.targetUrl}>
                                    Read more <span aria-hidden="true">→</span>
                                </a>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}

class NexcentCommunityElement extends HTMLElement {
    private root?: Root;

    connectedCallback() {
        if (!this.root) {
            this.root = createRoot(this);
        }

        this.root.render(<CommunityApp host={this} />);
    }

    disconnectedCallback() {
        this.root?.unmount();
        this.root = undefined;
    }
}

const ELEMENT_NAME = 'nexcent-community-app';

if (!customElements.get(ELEMENT_NAME)) {
    customElements.define(ELEMENT_NAME, NexcentCommunityElement);
}
