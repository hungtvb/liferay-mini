import {
    type FormEvent,
    type MouseEvent,
    useState,
} from 'react';

import content from '../../../../../prototypes/nexcent-static/content.json';
import {resolveStaticAsset} from '../assets';
import type {NavigationItem} from '../site-shell/types';
import {useSiteShell} from '../site-shell/useSiteShell';

type FooterProps = {
    host?: HTMLElement;
};

type LiferayWindow = Window & {
    Liferay?: {
        authToken?: string;
    };
};

const socialLinkDefinitions = [
    {
        asset: 'instagram',
        attribute: 'instagram-url',
        fallbackURL: '#instagram',
        label: 'Instagram',
    },
    {
        asset: 'ball',
        attribute: 'dribbble-url',
        fallbackURL: '#dribbble',
        label: 'Dribbble',
    },
    {
        asset: 'twitter',
        attribute: 'twitter-url',
        fallbackURL: '#twitter',
        label: 'Twitter',
    },
    {
        asset: 'youtube',
        attribute: 'youtube-url',
        fallbackURL: '#youtube',
        label: 'YouTube',
    },
] as const;

function readSetting(
    host: HTMLElement | undefined,
    name: string,
    fallback: string
) {
    return host?.getAttribute(name)?.trim() || fallback;
}

function readBooleanSetting(
    host: HTMLElement | undefined,
    name: string,
    fallback: boolean
) {
    const value = host?.getAttribute(name)?.trim().toLowerCase();

    if (!value) {
        return fallback;
    }

    return value !== 'false';
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
                        target={item.target || undefined}
                    >
                        {item.label}
                    </a>
                    {item.children.length > 0 ? (
                        <FooterNavigation
                            items={item.children}
                            onNavigate={onNavigate}
                        />
                    ) : null}
                </li>
            ))}
        </ul>
    );
}

export function StaticFooter({host}: FooterProps) {
    const {error, shell, status} = useSiteShell(host);
    const [newsletterState, setNewsletterState] = useState<
        'error' | 'idle' | 'submitting' | 'success'
    >('idle');
    const logoURL = readSetting(
        host,
        'logo-url',
        shell.site.logoURL || resolveStaticAsset('logoDark')
    );
    const logoAlt = readSetting(
        host,
        'logo-alt',
        shell.site.name || 'Nexcent'
    );
    const copyrightText = readSetting(
        host,
        'copyright-text',
        content.footer.copyright
    );
    const rightsText = readSetting(host, 'rights-text', content.footer.rights);
    const companyHeading = readSetting(host, 'company-heading', 'Company');
    const supportHeading = readSetting(host, 'support-heading', 'Support');
    const newsletterTitle = readSetting(
        host,
        'newsletter-title',
        content.footer.newsletterTitle
    );
    const newsletterPlaceholder = readSetting(
        host,
        'newsletter-placeholder',
        content.footer.newsletterPlaceholder
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
    const socialLinks = socialLinkDefinitions.map((item) => ({
        ...item,
        href: readSetting(host, item.attribute, item.fallbackURL),
    }));

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
                    locale:
                        document.documentElement.lang || navigator.language,
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
                    <a className="footer__logo" href={shell.site.homeURL}>
                        <img src={logoURL} alt={logoAlt} />
                    </a>
                    <p>{copyrightText}</p>
                    <p>{rightsText}</p>

                    {showSocialLinks ? (
                        <div className="footer__social social">
                            {socialLinks.map((item) => (
                                <a
                                    aria-label={item.label}
                                    href={item.href}
                                    key={item.label}
                                >
                                    <img
                                        src={resolveStaticAsset(item.asset)}
                                        alt=""
                                        aria-hidden="true"
                                    />
                                </a>
                            ))}
                        </div>
                    ) : null}
                </div>

                <div className="footer__items">
                    <div className="footer__item">
                        <h3>{companyHeading}</h3>
                        <FooterNavigation
                            items={shell.companyNavigation}
                            onNavigate={handleNavigation}
                        />
                    </div>

                    <div className="footer__item">
                        <h3>{supportHeading}</h3>
                        <FooterNavigation
                            items={shell.supportNavigation}
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
                                        type="email"
                                        required
                                        placeholder={newsletterPlaceholder}
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
                        Footer navigation is using fallback data: {error.message}
                    </span>
                ) : null}
            </div>
        </footer>
    );
}
