import {
    type MouseEvent,
    useEffect,
    useMemo,
    useState,
} from 'react';

import content from '../../../../../prototypes/nexcent-static/content.json';
import {resolveStaticAsset} from '../assets';
import type {AccountContext, NavigationItem} from '../site-shell/types';

type HeaderProps = {
    host?: HTMLElement;
};

type HeaderRuntimeContext = {
    account: AccountContext;
    navigation: NavigationItem[];
    site: {
        homeURL: string;
        name: string;
    };
};

type NavigationListProps = {
    items: NavigationItem[];
    onNavigate: (
        event: MouseEvent<HTMLAnchorElement>,
        navigationItem: NavigationItem
    ) => void;
    root?: boolean;
};

type RuntimeState = {
    context: HeaderRuntimeContext;
    error?: Error;
    status: 'fallback' | 'preview' | 'ready';
};

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

function normalizeTarget(value: unknown): string {
    if (typeof value !== 'string') {
        return '';
    }

    if (value.includes('_blank')) {
        return '_blank';
    }

    if (value.includes('_parent')) {
        return '_parent';
    }

    if (value.includes('_top')) {
        return '_top';
    }

    return value.includes('_self') ? '_self' : '';
}

function normalizeNavigation(value: unknown, prefix = 'NXC-NAV'): NavigationItem[] {
    if (!Array.isArray(value)) {
        return [];
    }

    return value
        .filter(
            (item): item is Record<string, unknown> =>
                Boolean(item && typeof item === 'object')
        )
        .map((item, index) => ({
            children: normalizeNavigation(item.children, `${prefix}-${index + 1}`),
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

function createFallbackContext(): HeaderRuntimeContext {
    return {
        account: {
            accountURL: '/group/control_panel/manage',
            createAccountURL: '/web/guest/create-account',
            displayName: '',
            emailAddress: '',
            loginURL: '/c/portal/login',
            logoutURL: '/c/portal/logout',
            portraitURL: '',
            signedIn: false,
        },
        navigation: content.navigation.map((item, index) => ({
            children: [],
            externalReferenceCode: `NXC-PREVIEW-${index + 1}`,
            label: item.label,
            selected: false,
            target: '',
            url: item.href,
        })),
        site: {
            homeURL: '#home',
            name: 'Nexcent',
        },
    };
}

function readRuntimeContext(host?: HTMLElement): RuntimeState {
    const fallback = createFallbackContext();

    if (!host) {
        return {context: fallback, status: 'preview'};
    }

    const script = host.querySelector<HTMLScriptElement>(
        'script[data-nexcent-header-props]'
    );

    if (!script?.textContent?.trim()) {
        return {
            context: fallback,
            error: new Error('Missing embedded Header Fragment props.'),
            status: 'fallback',
        };
    }

    try {
        const value = JSON.parse(script.textContent) as Record<string, unknown>;
        const account =
            value.account && typeof value.account === 'object'
                ? (value.account as Record<string, unknown>)
                : {};
        const site =
            value.site && typeof value.site === 'object'
                ? (value.site as Record<string, unknown>)
                : {};

        return {
            context: {
                account: {
                    accountURL:
                        typeof account.accountURL === 'string'
                            ? account.accountURL
                            : fallback.account.accountURL,
                    createAccountURL:
                        typeof account.createAccountURL === 'string'
                            ? account.createAccountURL
                            : fallback.account.createAccountURL,
                    displayName:
                        typeof account.displayName === 'string'
                            ? account.displayName
                            : '',
                    emailAddress: '',
                    loginURL:
                        typeof account.loginURL === 'string'
                            ? account.loginURL
                            : fallback.account.loginURL,
                    logoutURL:
                        typeof account.logoutURL === 'string'
                            ? account.logoutURL
                            : fallback.account.logoutURL,
                    portraitURL:
                        typeof account.portraitURL === 'string'
                            ? account.portraitURL
                            : '',
                    signedIn: account.signedIn === true,
                },
                navigation: normalizeNavigation(value.navigation),
                site: {
                    homeURL:
                        typeof site.homeURL === 'string' && site.homeURL
                            ? site.homeURL
                            : fallback.site.homeURL,
                    name:
                        typeof site.name === 'string' && site.name
                            ? site.name
                            : fallback.site.name,
                },
            },
            status: 'ready',
        };
    }
    catch (cause: unknown) {
        return {
            context: fallback,
            error:
                cause instanceof Error
                    ? cause
                    : new Error('Invalid embedded Header Fragment props.'),
            status: 'fallback',
        };
    }
}

function NavigationList({items, onNavigate, root = false}: NavigationListProps) {
    return (
        <ul className={root ? 'header__navigation-list' : 'header__submenu'}>
            {items.map((item) => (
                <li
                    className={item.selected ? 'is-selected' : undefined}
                    key={item.externalReferenceCode || `${item.label}-${item.url}`}
                >
                    <a
                        aria-current={item.selected ? 'page' : undefined}
                        href={item.url}
                        onClick={(event) => onNavigate(event, item)}
                        rel={item.target === '_blank' ? 'noopener noreferrer' : undefined}
                        target={item.target || undefined}
                    >
                        {item.label}
                    </a>
                    <span className="decor-line" />
                    {item.children.length > 0 ? (
                        <NavigationList
                            items={item.children}
                            onNavigate={onNavigate}
                        />
                    ) : null}
                </li>
            ))}
        </ul>
    );
}

export function StaticHeader({host}: HeaderProps) {
    const {context, error, status} = readRuntimeContext(host);
    const [accountOpen, setAccountOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const initials = useMemo(
        () =>
            context.account.displayName
                .split(/\s+/)
                .filter(Boolean)
                .slice(0, 2)
                .map((part) => part[0]?.toUpperCase())
                .join('') || 'U',
        [context.account.displayName]
    );
    const logoURL = readSetting(host, 'logo-url', resolveStaticAsset('logo'));
    const logoAlt = readSetting(host, 'logo-alt', context.site.name);
    const loginLabel = readSetting(host, 'login-label', 'Login');
    const signUpLabel = readSetting(host, 'sign-up-label', 'Sign up');
    const myAccountLabel = readSetting(
        host,
        'my-account-label',
        'My Account'
    );
    const signOutLabel = readSetting(host, 'sign-out-label', 'Sign out');
    const showAccountActions = readBooleanSetting(
        host,
        'show-account-actions',
        true
    );

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key !== 'Escape') {
                return;
            }

            setAccountOpen(false);
            setMenuOpen(false);
        };

        window.addEventListener('keydown', handleEscape);

        return () => window.removeEventListener('keydown', handleEscape);
    }, []);

    const closeNavigation = () => {
        setAccountOpen(false);
        setMenuOpen(false);
    };

    const handleNavigation = (
        event: MouseEvent<HTMLAnchorElement>,
        navigationItem: NavigationItem
    ) => {
        closeNavigation();

        const href = navigationItem.url;

        if (!href.startsWith('#') || href === '#') {
            return;
        }

        const rootNode = event.currentTarget.getRootNode();
        const shadowTarget =
            rootNode instanceof ShadowRoot
                ? rootNode.querySelector<HTMLElement>(href)
                : null;
        const target = document.querySelector<HTMLElement>(href) ?? shadowTarget;

        if (!target) {
            return;
        }

        event.preventDefault();
        target.scrollIntoView({behavior: 'smooth', block: 'start'});
        window.history.replaceState(null, '', href);
    };

    return (
        <header className="header" data-runtime-state={status}>
            <div className="header__container">
                <a
                    className="header__logo"
                    href={context.site.homeURL}
                    onClick={(event) =>
                        handleNavigation(event, {
                            children: [],
                            externalReferenceCode: 'NXC-HOME',
                            label: context.site.name,
                            selected: false,
                            target: '',
                            url: context.site.homeURL,
                        })
                    }
                >
                    <img src={logoURL} alt={logoAlt} />
                </a>

                <button
                    aria-controls="nexcent-react-navigation"
                    aria-expanded={menuOpen}
                    aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
                    className={`header__burger-menu${menuOpen ? ' active' : ''}`}
                    onClick={() => setMenuOpen((value) => !value)}
                    type="button"
                >
                    <span />
                    <span />
                    <span />
                </button>

                <div
                    className={`header__menu${menuOpen ? ' active' : ''}`}
                    id="nexcent-react-navigation"
                >
                    <nav aria-label="Primary navigation">
                        <NavigationList
                            items={context.navigation}
                            onNavigate={handleNavigation}
                            root
                        />
                    </nav>

                    {showAccountActions ? (
                        <div className="header__btns">
                            {context.account.signedIn ? (
                                <div className="header__account">
                                    <button
                                        aria-expanded={accountOpen}
                                        className="header__account-trigger"
                                        onClick={() =>
                                            setAccountOpen((value) => !value)
                                        }
                                        type="button"
                                    >
                                        {context.account.portraitURL ? (
                                            <img
                                                className="header__account-avatar"
                                                src={context.account.portraitURL}
                                                alt=""
                                            />
                                        ) : (
                                            <span
                                                aria-hidden="true"
                                                className="header__account-initials"
                                            >
                                                {initials}
                                            </span>
                                        )}
                                        <span className="header__account-name">
                                            {context.account.displayName}
                                        </span>
                                        <span aria-hidden="true">▾</span>
                                    </button>

                                    <div
                                        className={`header__account-menu${
                                            accountOpen ? ' is-open' : ''
                                        }`}
                                    >
                                        <a
                                            href={context.account.accountURL}
                                            onClick={closeNavigation}
                                        >
                                            {myAccountLabel}
                                        </a>
                                        <a
                                            href={context.account.logoutURL}
                                            onClick={closeNavigation}
                                        >
                                            {signOutLabel}
                                        </a>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <a
                                        className="btn btn-light"
                                        href={context.account.loginURL}
                                        onClick={closeNavigation}
                                    >
                                        {loginLabel}
                                    </a>
                                    <a
                                        className="btn"
                                        href={context.account.createAccountURL}
                                        onClick={closeNavigation}
                                    >
                                        {signUpLabel}
                                    </a>
                                </>
                            )}
                        </div>
                    ) : null}
                </div>

                {error ? (
                    <span className="sr-only" role="status">
                        Header is using preview fallback data: {error.message}
                    </span>
                ) : null}
            </div>
        </header>
    );
}
