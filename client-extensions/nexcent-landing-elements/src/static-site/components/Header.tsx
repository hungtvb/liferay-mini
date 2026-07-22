import {
    type MouseEvent,
    useEffect,
    useMemo,
    useState,
} from 'react';

import {resolveStaticAsset} from '../assets';
import type {NavigationItem} from '../site-shell/types';
import {useSiteShell} from '../site-shell/useSiteShell';

type HeaderProps = {
    host?: HTMLElement;
};

type NavigationListProps = {
    items: NavigationItem[];
    onNavigate: (
        event: MouseEvent<HTMLAnchorElement>,
        navigationItem: NavigationItem
    ) => void;
    root?: boolean;
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
    const {error, shell, status} = useSiteShell(host);
    const [accountOpen, setAccountOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const initials = useMemo(
        () =>
            shell.account.displayName
                .split(/\s+/)
                .filter(Boolean)
                .slice(0, 2)
                .map((part) => part[0]?.toUpperCase())
                .join('') || 'U',
        [shell.account.displayName]
    );
    const logoURL = readSetting(
        host,
        'logo-url',
        shell.site.logoURL || resolveStaticAsset('logo')
    );
    const logoAlt = readSetting(
        host,
        'logo-alt',
        shell.site.name || 'Nexcent'
    );
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
                    href={shell.site.homeURL}
                    onClick={(event) =>
                        handleNavigation(event, {
                            children: [],
                            externalReferenceCode: 'NXC-HOME',
                            label: shell.site.name,
                            selected: false,
                            target: '',
                            url: shell.site.homeURL,
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
                            items={shell.headerNavigation}
                            onNavigate={handleNavigation}
                            root
                        />
                    </nav>

                    {showAccountActions ? (
                        <div className="header__btns">
                            {shell.account.signedIn ? (
                                <div className="header__account">
                                    <button
                                        aria-expanded={accountOpen}
                                        className="header__account-trigger"
                                        onClick={() =>
                                            setAccountOpen((value) => !value)
                                        }
                                        type="button"
                                    >
                                        {shell.account.portraitURL ? (
                                            <img
                                                className="header__account-avatar"
                                                src={shell.account.portraitURL}
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
                                            {shell.account.displayName}
                                        </span>
                                        <span aria-hidden="true">▾</span>
                                    </button>

                                    <div
                                        className={`header__account-menu${
                                            accountOpen ? ' is-open' : ''
                                        }`}
                                    >
                                        <a
                                            href={shell.account.accountURL}
                                            onClick={closeNavigation}
                                        >
                                            {myAccountLabel}
                                        </a>
                                        <a
                                            href={shell.account.logoutURL}
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
                                        href={shell.account.loginURL}
                                        onClick={closeNavigation}
                                    >
                                        {loginLabel}
                                    </a>
                                    <a
                                        className="btn"
                                        href={shell.account.createAccountURL}
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
                        Site navigation is using fallback data: {error.message}
                    </span>
                ) : null}
            </div>
        </header>
    );
}
