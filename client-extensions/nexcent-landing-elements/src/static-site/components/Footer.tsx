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

const socialLinks = [
    {asset: 'instagram', label: 'Instagram'},
    {asset: 'ball', label: 'Dribbble'},
    {asset: 'twitter', label: 'Twitter'},
    {asset: 'youtube', label: 'YouTube'},
];

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
        const endpoint =
            host?.getAttribute('newsletter-endpoint')?.trim() ||
            '/o/c/nxcnewslettersubscriptions';
        const authToken = (window as LiferayWindow).Liferay?.authToken;

        try {
            const response = await fetch(endpoint, {
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
                        <img
                            src={
                                shell.site.logoURL ||
                                resolveStaticAsset('logoDark')
                            }
                            alt={shell.site.name || 'Nexcent'}
                        />
                    </a>
                    <p>{content.footer.copyright}</p>
                    <p>{content.footer.rights}</p>

                    <div className="footer__social social">
                        {socialLinks.map((item) => (
                            <a
                                aria-label={item.label}
                                href={`#${item.label.toLowerCase()}`}
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
                </div>

                <div className="footer__items">
                    <div className="footer__item">
                        <h3>Company</h3>
                        <FooterNavigation
                            items={shell.companyNavigation}
                            onNavigate={handleNavigation}
                        />
                    </div>

                    <div className="footer__item">
                        <h3>Support</h3>
                        <FooterNavigation
                            items={shell.supportNavigation}
                            onNavigate={handleNavigation}
                        />
                    </div>

                    <div className="footer__item footer__submit">
                        <h3>{content.footer.newsletterTitle}</h3>
                        <form className="footer__form" onSubmit={handleSubmit}>
                            <div>
                                <label
                                    className="sr-only"
                                    htmlFor="nexcent-react-email"
                                >
                                    {content.footer.newsletterPlaceholder}
                                </label>
                                <input
                                    autoComplete="email"
                                    disabled={newsletterState === 'submitting'}
                                    id="nexcent-react-email"
                                    name="email"
                                    type="email"
                                    required
                                    placeholder={
                                        content.footer.newsletterPlaceholder
                                    }
                                />
                                <button
                                    aria-label="Subscribe"
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
                                    ? 'Submitting…'
                                    : null}
                                {newsletterState === 'success'
                                    ? 'Thank you for subscribing.'
                                    : null}
                                {newsletterState === 'error'
                                    ? 'Subscription failed. Please try again.'
                                    : null}
                            </p>
                        </form>
                    </div>
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
