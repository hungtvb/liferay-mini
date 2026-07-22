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
    contentUrl?: string;
    datePublished?: string;
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

type ArticleCard = {
    externalReferenceCode: string;
    featured: boolean;
    publishedDate?: string;
    sortOrder: number;
    targetUrl: string;
    thumbnail: {
        alt: string;
        url: string;
    };
    title: string;
};

type ArticleData = {
    description: string;
    heading: string;
    items: ArticleCard[];
};

type LoadState =
    | {status: 'loading'}
    | {status: 'empty'}
    | {message: string; status: 'error'}
    | {data: ArticleData; status: 'ready'};

type ThemeDisplay = {
    getPortalURL?: () => string;
    getScopeGroupId?: () => number | string;
};

declare global {
    interface Window {
        Liferay?: {ThemeDisplay?: ThemeDisplay};
    }
}

const DEFAULT_HEADING = 'Caring is the new marketing';
const DEFAULT_DESCRIPTION =
    "The Nexcent blog is the best place to read about the latest membership insights, trends and more. See who's joining the community, read about how our community are increasing their membership income and lot's more.";

function fieldMap(content: StructuredContent): Map<string, ContentField> {
    return new Map(
        (content.contentFields ?? [])
            .filter(
                (field): field is ContentField & {name: string} =>
                    Boolean(field.name)
            )
            .map((field) => [field.name, field])
    );
}

function text(fields: Map<string, ContentField>, name: string): string {
    const value = fields.get(name)?.contentFieldValue?.data;

    return value == null ? '' : String(value).trim();
}

function bool(
    fields: Map<string, ContentField>,
    name: string,
    fallback = false
): boolean {
    const value = fields.get(name)?.contentFieldValue?.data;

    if (typeof value === 'boolean') {
        return value;
    }

    if (typeof value === 'string') {
        return value.toLowerCase() === 'true';
    }

    return fallback;
}

function numberValue(
    fields: Map<string, ContentField>,
    name: string
): number {
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
    const contentUrl =
        value?.image?.contentUrl ?? value?.document?.contentUrl ?? '';

    return contentUrl ? new URL(contentUrl, `${portalURL}/`).toString() : '';
}

async function getJson<T>(url: string): Promise<T> {
    const response = await fetch(url, {
        credentials: 'include',
        headers: {Accept: 'application/json'},
    });

    if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
    }

    return (await response.json()) as T;
}

async function resolveStructureId(
    portalURL: string,
    siteId: string,
    identifier: string
): Promise<number> {
    const response = await getJson<CollectionResponse<ContentStructure>>(
        `${portalURL}/o/headless-delivery/v1.0/sites/${encodeURIComponent(
            siteId
        )}/content-structures?pageSize=200`
    );
    const normalized = identifier.trim().toLowerCase();
    const structure = (response.items ?? []).find((item) =>
        [item.name, item.externalReferenceCode]
            .filter(Boolean)
            .some(
                (value) =>
                    String(value).trim().toLowerCase() === normalized
            )
    );

    if (!structure?.id) {
        throw new Error(`Content Structure not found: ${identifier}`);
    }

    return structure.id;
}

async function getStructuredContents(
    portalURL: string,
    structureId: number
): Promise<StructuredContent[]> {
    const response = await getJson<CollectionResponse<StructuredContent>>(
        `${portalURL}/o/headless-delivery/v1.0/content-structures/${structureId}/structured-contents?flatten=true&page=1&pageSize=100&sort=datePublished:desc`
    );

    return response.items ?? [];
}

async function loadArticleData(
    element: HTMLElement
): Promise<ArticleData | null> {
    const themeDisplay = window.Liferay?.ThemeDisplay;
    const portalURL = (
        element.getAttribute('liferay-base-url') ??
        themeDisplay?.getPortalURL?.() ??
        window.location.origin
    ).replace(/\/$/, '');
    const siteId =
        element.getAttribute('site-id') ??
        String(themeDisplay?.getScopeGroupId?.() ?? '');
    const structureIdentifier =
        element.getAttribute('article-structure-identifier') ??
        'NXC-STRUCTURE-ARTICLE';

    if (!siteId) {
        throw new Error(
            'Site context is unavailable. Add site-id when running outside Liferay.'
        );
    }

    const structureId = await resolveStructureId(
        portalURL,
        siteId,
        structureIdentifier
    );
    const contents = await getStructuredContents(portalURL, structureId);
    const items = contents
        .map((content): ArticleCard | null => {
            const fields = fieldMap(content);
            const title = content.title?.trim() || '';
            const targetUrl = safeLinkUrl(content.contentUrl ?? '');
            const thumbnailUrl = mediaUrl(fields, 'coverImage', portalURL);

            if (!title || !targetUrl || !thumbnailUrl) {
                return null;
            }

            return {
                externalReferenceCode:
                    content.externalReferenceCode ?? String(content.id ?? ''),
                featured: bool(fields, 'featured'),
                publishedDate: content.datePublished,
                sortOrder: numberValue(fields, 'sortOrder'),
                targetUrl,
                thumbnail: {
                    alt: text(fields, 'coverImageAlt') || title,
                    url: thumbnailUrl,
                },
                title,
            };
        })
        .filter((item): item is ArticleCard => item !== null)
        .sort(
            (left, right) =>
                Number(right.featured) - Number(left.featured) ||
                left.sortOrder - right.sortOrder ||
                String(right.publishedDate ?? '').localeCompare(
                    String(left.publishedDate ?? '')
                )
        )
        .slice(0, 3);

    if (!items.length) {
        return null;
    }

    return {
        description:
            element.getAttribute('description') ?? DEFAULT_DESCRIPTION,
        heading: element.getAttribute('heading') ?? DEFAULT_HEADING,
        items,
    };
}

function ArticleThumbnail({item}: {item: ArticleCard}) {
    const [failed, setFailed] = useState(false);

    if (failed) {
        return (
            <div
                aria-label={`Image unavailable for ${item.title}`}
                className="nxc-articles-card__image-fallback"
                role="img"
            >
                <svg aria-hidden="true" viewBox="0 0 48 48">
                    <path
                        d="M7 9h34v30H7V9Zm4 4v17l8-8 6 6 4-4 8 8V13H11Zm8 5a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
                        fill="currentColor"
                    />
                </svg>
                <span>Image unavailable</span>
            </div>
        );
    }

    return (
        <img
            alt={item.thumbnail.alt}
            className="nxc-articles-card__image"
            loading="lazy"
            onError={() => setFailed(true)}
            src={item.thumbnail.url}
        />
    );
}

function ArticleApp({host}: {host: HTMLElement}) {
    const [reloadKey, setReloadKey] = useState(0);
    const [state, setState] = useState<LoadState>({status: 'loading'});
    const retry = useMemo(
        () => () => setReloadKey((value) => value + 1),
        []
    );

    useEffect(() => {
        let active = true;

        setState({status: 'loading'});

        loadArticleData(host)
            .then((data) => {
                if (active) {
                    setState(data ? {data, status: 'ready'} : {status: 'empty'});
                }
            })
            .catch((error: unknown) => {
                if (active) {
                    setState({
                        message:
                            error instanceof Error
                                ? error.message
                                : 'Unable to load articles.',
                        status: 'error',
                    });
                }
            });

        return () => {
            active = false;
        };
    }, [host, reloadKey]);

    if (state.status === 'loading') {
        return (
            <section
                aria-busy="true"
                aria-label="Loading articles"
                className="nxc-articles nxc-articles--state"
            >
                <div className="nxc-articles__loading-grid" aria-hidden="true">
                    <span /><span /><span />
                </div>
            </section>
        );
    }

    if (state.status === 'empty') {
        return (
            <section className="nxc-articles nxc-articles--state">
                <h2>{host.getAttribute('heading') ?? DEFAULT_HEADING}</h2>
                <p>
                    No published articles with a Display Page are available.
                </p>
            </section>
        );
    }

    if (state.status === 'error') {
        return (
            <section
                className="nxc-articles nxc-articles--state"
                role="alert"
            >
                <h2>Articles are unavailable</h2>
                <p>{state.message}</p>
                <button
                    className="nxc-articles__retry"
                    onClick={retry}
                    type="button"
                >
                    Try again
                </button>
            </section>
        );
    }

    return (
        <section
            aria-labelledby="nxc-articles-heading"
            className="nxc-articles"
        >
            <div className="nxc-articles__container">
                <header className="nxc-articles__header">
                    <h2 id="nxc-articles-heading">{state.data.heading}</h2>
                    <p>{state.data.description}</p>
                </header>

                <div className="nxc-articles__grid">
                    {state.data.items.map((item) => (
                        <article
                            className="nxc-articles-card"
                            key={item.externalReferenceCode}
                        >
                            <ArticleThumbnail item={item} />
                            <div className="nxc-articles-card__overlay">
                                <h3>{item.title}</h3>
                                <a
                                    className="nxc-articles-card__link"
                                    href={item.targetUrl}
                                >
                                    Read more
                                    <span aria-hidden="true">→</span>
                                </a>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}

class NexcentArticlesElement extends HTMLElement {
    private root?: Root;

    connectedCallback() {
        if (!this.root) {
            this.root = createRoot(this);
        }

        this.root.render(<ArticleApp host={this} />);
    }

    disconnectedCallback() {
        this.root?.unmount();
        this.root = undefined;
    }
}

const ELEMENT_NAME = 'nexcent-articles';

if (!customElements.get(ELEMENT_NAME)) {
    customElements.define(ELEMENT_NAME, NexcentArticlesElement);
}
