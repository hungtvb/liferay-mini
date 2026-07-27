import {
    type FormEvent,
    type MouseEvent,
    useState,
} from 'react';

import {resolveStaticAsset, type StaticAssetKey} from '../../assets';
import type {NavigationItem} from '../../site-shell/types';

type FooterProps = {
    host?: HTMLElement;
};

type FooterRuntimeContext = {
    companyNavigation: NavigationItem[];
    site: {
        homeURL: string;
        name: string;
    };
    socialNavigation: NavigationItem[];
    supportNavigation: NavigationItem[];
};

type RuntimeState = {
    context: FooterRuntimeContext;
    error?: Error;
    status: 'error' | 'preview' | 'ready';
};

type LiferayWindow = Window & {
    Liferay?: {
        authToken?: string;
    };
};

const SOCIAL_ASSETS: Record<string, StaticAssetKey> = {
    dribbble: 'ball',
    instagram: 'instagram',
    twitter: 'twitter',
    twitterx: 'twitter',
    x: 'twitter',
    xcom: 'twitter',
    youtube: 'youtube',
    youtubechannel: 'youtube',
};

const PREVIEW_COMPANY_LINKS = [
    ['About us', '#about'],
    ['Blog', '#blog'],
    ['Contact us', '#contact'],
    ['Pricing', '#pricing'],
    ['Testimonials', '#testimonials'],
] as const;

const PREVIEW_SUPPORT_LINKS = [
    ['Help center', '#help'],
    ['Terms of service', '#terms'],
    ['Legal', '#legal'],
    ['Privacy policy', '#privacy'],
    ['Status', '#status'],
] as const;

const PREVIEW_SOCIAL_LINKS = [
    ['Instagram', '#instagram'],
    ['Dribbble', '#dribbble'],
    ['Twitter', '#twitter'],
    ['YouTube', '#youtube'],
] as const;

function readSetting(
    host: HTMLElement | undefined,
    name: string,
    fallback: string
): string {
    return host?.getAttribute(name)?.trim() || fallback;
}

function readBooleanSetting(
    host: HTMLElement | undefined,
    name: string,
    fallback: boolean
): boolean {
    const value = host?.getAttribute(name)?.trim().toLowerCase();

    return value ? value !== 'false' : fallback;
}

function normalizeTarget(value: unknown): string {
    if (typeof value !== 'string') {
        return '';
    }

    for (const target of ['_blank', '_parent', '_top', '_self']) {
        if (value.includes(target)) {
            return target;
        }
    }

    return '';
}

function normalizeNavigation(value: unknown, prefix: string): NavigationItem[] {
    if (!Array.isArray(value)) {
        return [];
    }

    return value
        .filter(
            (item): item is Record<string, unknown> =>
                Boolean(item && typeof item === 'object')
        )
        .map((item, index) => ({
            children: normalizeNavigation(
                item.children,
                `${prefix}-${index + 1}`
            ),
            externalReferenceCode:
                typeof item.externalReferenceCode === 'string' &&
                item.externalReferenceCode
                    ? item.externalReferenceCode
                    : `${prefix}-${index + 1}`,
            label: typeof item.label === 'string' ? item.label : '',
            selected: item.selected === true,
            target: normalizeTarget(item.target),
            url: typeof item.url === 'string' && item.url ? item.url : '#',
        }))
        .filter((item) => Boolean(item.label));
}

function toNavigationItems(
    items: readonly (readonly [string, string])[],
    prefix: string
): NavigationItem[] {
    return items.map(([label, url], index) => ({
        children: [],
        externalReferenceCode: `${prefix}-${index + 1}`,
        label,
        selected: false,
        target: '',
        url,
    }));
}

function createBaseContext(preview = false): FooterRuntimeContext {
    return {
        companyNavigation: preview
            ? toNavigationItems(PREVIEW_COMPANY_LINKS, 'NXC-PREVIEW-COMPANY')
            : [],
        site: {
            homeURL: '#home',
            name: 'Nexcent',
        },
        socialNavigation: preview
            ? toNavigationItems(PREVIEW_SOCIAL_LINKS, 'NXC-PREVIEW-SOCIAL')
            : [],
        supportNavigation: preview
            ? toNavigationItems(PREVIEW_SUPPORT_LINKS, 'NXC-PREVIEW-SUPPORT')
            : [],
    };
}

function readRuntimeContext(host?: HTMLElement): RuntimeState {
    if (!host) {
        return {context: createBaseContext(true), status: 'preview'};
    }

    const baseContext = createBaseContext();
    const script = host.querySelector<HTMLScriptElement>(
        'script[data-nexcent-footer-props]'
    );

    if (!script?.textContent?.trim()) {
        return {
            context: baseContext,
            error: new Error('Missing embedded Footer Fragment props.'),
            status: 'error',
        };
    }

    try {
        const value = JSON.parse(script.textContent) as Record<string, unknown>;
        const site =
            value.site && typeof value.site === 'object'
                ? (value.site as Record<string, unknown>)
                : {};

        return {
            context: {
                companyNavigation: normalizeNavigation(
                    value.companyNavigation,
                    'NXC-COMPANY'
                ),
                site: {
                    homeURL:
                        typeof site.homeURL === 'string' && site.homeURL
                            ? site.homeURL
                            : baseContext.site.homeURL,
                    name:
                        typeof site.name === 'string' && site.name
                            ? site.name
                            : baseContext.site.name,
                },
                socialNavigation: normalizeNavigation(
                    value.socialNavigation,
                    'NXC-SOCIAL'
                ),
                supportNavigation: normalizeNavigation(
                    value.supportNavigation,
                    'NXC-SUPPORT'
                ),
            },
            status: 'ready',
        };
    }
    catch (cause: unknown) {
        return {
            context: baseContext,
            error:
                cause instanceof Error
                    ? cause
                    : new Error('Invalid embedded Footer Fragment props.'),
            status: 'error',
        };
    }
}

function normalizeSocialName(label: string): string {
    return label.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
}

function resolveSocialAsset(label: string): string | null {
    const asset = SOCIAL_ASSETS[normalizeSocialName(label)];

    return asset ? resolveStaticAsset(asset) : null;
}

function FooterNavigation({
    items,
    onNavigate,
}: {
    items: NavigationItem[];
    onNavigate: (
        event: MouseEvent<HTMLAnchorElement>,
        item: NavigationItem
    ) => void;
}) {
    return (
        <ul className="footer__navigation">
            {items.map((item) => (
                <li key={item.externalReferenceCode || `${item.label}-${item.url}`}>
                    <a
                        href={item.url}
                        onClick={(event) => onNavigate(event, item)}
                        rel={item.target === '_blank' ? 'noopener noreferrer' : undefined}
                        target={item.target || undefined}
                    >
                        {item.label}
                    </a>
                    {item.children.length ? (
                        <FooterNavigation items={item.children} onNavigate={onNavigate} />
                    ) : null}
                </li>
            ))}
        </ul>
    );
}

export function Footer({host}: FooterProps) {
    const {context, error, status} = readRuntimeContext(host);
    const [newsletterState, setNewsletterState] = useState<
        'error' | 'idle' | 'submitting' | 'success'
    >('idle');
    const logoURL = readSetting(
        host,
        'logo-url',
        host ? '' : resolveStaticAsset('logoDark')
    );
    const logoAlt = readSetting(host, 'logo-alt', context.site.name);
    const copyrightText = readSetting(
        host,
        'copyright-text',
        'Copyright © 2020 Nexcent ltd.'
    );
    const rightsText = readSetting(host, 'rights-text', 'All rights reserved');
    const companyHeading = readSetting(host, 'company-heading', 'Company');
    const supportHeading = readSetting(host, 'support-heading', 'Support');
    const newsletterTitle = readSetting(
        host,
        'newsletter-title',
        'Stay up to date'
    );
    const newsletterPlaceholder = readSetting(
        host,
        'newsletter-placeholder',
        'Your email address'
    );
    const newsletterEndpoint = readSetting(
        host,
        'newsletter-endpoint',
        '/o/c/nxcnewslettersubscriptions'
    );
    const newsletterSubmitLabel = readSetting(
        host,
        'newsletter-submit-label',
        'Subscribe'
    );
    const newsletterSubmittingText = readSetting(
        host,
        'newsletter-submitting-text',
        'Submitting…'
    );
    const newsletterSuccessText = readSetting(
        host,
        'newsletter-success-text',
        'Thank you for subscribing.'
    );
    const newsletterErrorText = readSetting(
        host,
        'newsletter-error-text',
        'Subscription failed. Please try again.'
    );
    const showNewsletter = readBooleanSetting(host, 'show-newsletter', true);
    const showSocialLinks = readBooleanSetting(host, 'show-social-links', true);

    const handleNavigation = (
        event: MouseEvent<HTMLAnchorElement>,
        item: NavigationItem
    ) => {
        if (!item.url.startsWith('#') || item.url === '#') {
            return;
        }

        const rootNode = event.currentTarget.getRootNode();
        const shadowTarget =
            rootNode instanceof ShadowRoot
                ? rootNode.querySelector<HTMLElement>(item.url)
                : null;
        const target =
            document.querySelector<HTMLElement>(item.url) ?? shadowTarget;

        if (!target) {
            return;
        }

        event.preventDefault();
        target.scrollIntoView({behavior: 'smooth', block: 'start'});
        window.history.replaceState(null, '', item.url);
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setNewsletterState('submitting');

        const form = event.currentTarget;
        const formData = new FormData(form);
        const email = String(formData.get('email') ?? '').trim();
        const authToken = (window as LiferayWindow).Liferay?.authToken;

        try {
            const response = await fetch(newsletterEndpoint, {
                body: JSON.stringify({
                    consent: true,
                    email,
                    locale: document.documentElement.lang || navigator.language,
                    sourcePage: window.location.pathname,
                }),
                credentials: 'same-origin',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    ...(authToken ? {'x-csrf-token': authToken} : {}),
                },
                method: 'POST',
            });

            if (!response.ok) {
                throw new Error(
                    `Newsletter request failed with ${response.status}`
                );
            }

            form.reset();
            setNewsletterState('success');
        }
        catch (submitError) {
            console.warn('[Nexcent Newsletter]', submitError);
            setNewsletterState('error');
        }
    };

    return (
        <footer className="footer" data-runtime-state={status}>
            <div className="footer__container">
                <div className="footer__box">
                    <a className="footer__logo" href={context.site.homeURL}>
                        {logoURL ? <img src={logoURL} alt={logoAlt} /> : context.site.name}
                    </a>
                    <p>{copyrightText}</p>
                    <p>{rightsText}</p>

                    {showSocialLinks ? (
                        <div className="footer__social social">
                            {context.socialNavigation.map((item) => {
                                const iconURL = resolveSocialAsset(item.label);

                                return (
                                    <a
                                        aria-label={item.label}
                                        href={item.url}
                                        key={
                                            item.externalReferenceCode ||
                                            `${item.label}-${item.url}`
                                        }
                                        rel={
                                            item.target === '_blank'
                                                ? 'noopener noreferrer'
                                                : undefined
                                        }
                                        target={item.target || undefined}
                                    >
                                        {iconURL ? (
                                            <img src={iconURL} alt="" aria-hidden="true" />
                                        ) : (
                                            <span aria-hidden="true">
                                                {item.label.charAt(0).toUpperCase()}
                                            </span>
                                        )}
                                    </a>
                                );
                            })}
                        </div>
                    ) : null}
                </div>

                <div className="footer__items">
                    <div className="footer__item">
                        <h3>{companyHeading}</h3>
                        <FooterNavigation
                            items={context.companyNavigation}
                            onNavigate={handleNavigation}
                        />
                    </div>

                    <div className="footer__item">
                        <h3>{supportHeading}</h3>
                        <FooterNavigation
                            items={context.supportNavigation}
                            onNavigate={handleNavigation}
                        />
                    </div>

                    {showNewsletter ? (
                        <div className="footer__item footer__submit">
                            <h3>{newsletterTitle}</h3>
                            <form className="footer__form" onSubmit={handleSubmit}>
                                <div>
                                    <label
                                        className="sr-only"
                                        htmlFor="nexcent-react-email"
                                    >
                                        {newsletterPlaceholder}
                                    </label>
                                    <input
                                        autoComplete="email"
                                        disabled={newsletterState === 'submitting'}
                                        id="nexcent-react-email"
                                        name="email"
                                        placeholder={newsletterPlaceholder}
                                        required
                                        type="email"
                                    />
                                    <button
                                        aria-label={newsletterSubmitLabel}
                                        disabled={newsletterState === 'submitting'}
                                        type="submit"
                                    >
                                        <span className="footer__form-icon">
                                            <img
                                                src={resolveStaticAsset('email')}
                                                alt=""
                                                aria-hidden="true"
                                            />
                                        </span>
                                    </button>
                                </div>

                                <p
                                    aria-live="polite"
                                    className={`footer__form-status footer__form-status--${newsletterState}`}
                                >
                                    {newsletterState === 'submitting'
                                        ? newsletterSubmittingText
                                        : null}
                                    {newsletterState === 'success'
                                        ? newsletterSuccessText
                                        : null}
                                    {newsletterState === 'error'
                                        ? newsletterErrorText
                                        : null}
                                </p>
                            </form>
                        </div>
                    ) : null}
                </div>

                {error ? (
                    <span className="sr-only" role="status">
                        Unable to load Footer props: {error.message}
                    </span>
                ) : null}
            </div>
        </footer>
    );
}
