import type {ReactNode} from 'react';

import staticCss from './fallback/assets/css/style.css?inline';

const THEME_COLOR_REPLACEMENTS: Array<[RegExp, string]> = [
    [/#4caf4f(?![0-9a-f])/gi, 'var(--nxc-color-primary, #4caf4f)'],
    [/#388e3b(?![0-9a-f])/gi, 'var(--nxc-color-primary-hover, #388e3b)'],
    [/#237d31(?![0-9a-f])/gi, 'var(--nxc-color-primary-active, #237d31)'],
    [/#263238(?![0-9a-f])/gi, 'var(--nxc-color-secondary, #263238)'],
    [/#4d4d4d(?![0-9a-f])/gi, 'var(--nxc-color-heading, #4d4d4d)'],
    [/#717171(?![0-9a-f])/gi, 'var(--nxc-color-text, #717171)'],
    [/#89939e(?![0-9a-f])/gi, 'var(--nxc-color-muted, #89939e)'],
    [/#18191f(?![0-9a-f])/gi, 'var(--nxc-color-navigation, #18191f)'],
    [/#abbed1(?![0-9a-f])/gi, 'var(--nxc-color-border, #abbed1)'],
    [/#f5f7fa(?![0-9a-f])/gi, 'var(--nxc-color-surface, #f5f7fa)'],
    [/#e8f5e9(?![0-9a-f])/gi, 'var(--nxc-color-accent-surface, #e8f5e9)'],
    [/#d9dbe1(?![0-9a-f])/gi, 'var(--nxc-color-footer-placeholder, #d9dbe1)'],
    [/#ffffff(?![0-9a-f])/gi, 'var(--nxc-color-white, #ffffff)'],
    [/#fff(?![0-9a-f])/gi, 'var(--nxc-color-white, #fff)'],
];

const LOCAL_OVERRIDES = `
:host {
    color: var(--nxc-color-navigation, #18191f);
    display: block;
    font-family: var(
        --nxc-font-family,
        Inter,
        system-ui,
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        sans-serif
    );
    line-height: 1.5;
    min-width: 0;
    scroll-margin-top: var(--nxc-react-header-height, 80px);
    width: 100%;
}

:host *, :host *::before, :host *::after {
    box-sizing: border-box;
}

:host a:focus-visible,
:host button:focus-visible,
:host input:focus-visible {
    outline: 2px solid var(--nxc-color-primary, #4caf4f);
    outline-offset: 3px;
}

:host([data-site-shell-state='fallback']) {
    --nxc-site-shell-runtime-state: fallback;
}

:host([data-site-shell-state='ready']) {
    --nxc-site-shell-runtime-state: ready;
}

.container {
    max-width: var(
        --nxc-react-container-width,
        var(--nxc-container-width, 1182px)
    );
    padding-inline: var(
        --nxc-react-page-gutter,
        var(--nxc-page-gutter, 15px)
    );
}

.header__container {
    max-width: var(
        --nxc-react-wide-container-width,
        var(--nxc-wide-container-width, 1330px)
    );
    padding-inline: var(
        --nxc-react-page-gutter,
        var(--nxc-page-gutter, 15px)
    );
}

.sr-only {
    clip: rect(0, 0, 0, 0);
    clip-path: inset(50%);
    height: 1px;
    overflow: hidden;
    position: absolute;
    white-space: nowrap;
    width: 1px;
}

.swiper {
    overflow: hidden;
    position: relative;
}

.swiper-wrapper {
    height: 100%;
    position: relative;
}

.swiper-pagination {
    bottom: 16px;
    left: 0;
    position: absolute;
    right: 0;
    text-align: center;
    z-index: 2;
}

.swiper-pagination-bullet {
    appearance: none;
    border: 0;
    border-radius: 50%;
    cursor: pointer;
    display: inline-block;
    margin-inline: 4px;
    padding: 0;
}

.header__logo img,
.footer__logo img {
    display: block;
    height: auto;
    max-height: 40px;
    max-width: 191px;
    width: auto;
}

.header__menu nav .header__navigation-list {
    align-items: center;
}

.header__navigation-list > li {
    overflow: visible !important;
}

.header__submenu {
    background: var(--nxc-color-white, #fff);
    border-radius: var(--nxc-radius-md, 8px);
    box-shadow: var(
        --nxc-shadow-raised,
        0 8px 24px rgba(38, 50, 56, 0.14)
    );
    display: flex !important;
    flex-direction: column;
    gap: 4px;
    left: 0;
    min-width: 220px;
    opacity: 0;
    padding: 8px !important;
    pointer-events: none;
    position: absolute;
    top: calc(100% + 8px);
    transform: translateY(-6px);
    transition: opacity 180ms ease, transform 180ms ease;
    visibility: hidden;
    z-index: 20;
}

.header__submenu .header__submenu {
    left: calc(100% + 8px);
    top: 0;
}

.header__navigation-list li:hover > .header__submenu,
.header__navigation-list li:focus-within > .header__submenu {
    opacity: 1;
    pointer-events: auto;
    transform: translateY(0);
    visibility: visible;
}

.header__submenu li {
    overflow: visible !important;
    width: 100%;
}

.header__submenu a {
    border-radius: var(--nxc-radius-sm, 4px);
    display: block !important;
    width: 100%;
}

.header__navigation-list .is-selected > a {
    color: var(--nxc-color-primary, #4caf4f);
    font-weight: 600;
}

.header__account {
    position: relative;
}

.header__account-trigger {
    align-items: center;
    background: var(--nxc-color-surface, #f5f7fa);
    border: 1px solid transparent;
    border-radius: 6px;
    color: var(--nxc-color-navigation, #18191f);
    display: flex;
    gap: 8px;
    min-height: 42px;
    padding: 6px 10px;
    white-space: nowrap;
}

.header__account-trigger:hover {
    border-color: var(--nxc-color-primary, #4caf4f);
}

.header__account-avatar,
.header__account-initials {
    align-items: center;
    background: var(--nxc-color-primary, #4caf4f);
    border-radius: 50%;
    color: var(--nxc-color-white, #fff);
    display: flex;
    height: 30px;
    justify-content: center;
    object-fit: cover;
    width: 30px;
}

.header__account-initials {
    font-size: 12px;
    font-weight: 700;
}

.header__account-name {
    max-width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
}

.header__account-menu {
    background: var(--nxc-color-white, #fff);
    border-radius: var(--nxc-radius-md, 8px);
    box-shadow: var(
        --nxc-shadow-raised,
        0 8px 24px rgba(38, 50, 56, 0.14)
    );
    display: none;
    min-width: 180px;
    padding: 8px;
    position: absolute;
    right: 0;
    top: calc(100% + 8px);
    z-index: 30;
}

.header__account-menu.is-open {
    display: flex;
    flex-direction: column;
}

.header__btns .header__account-menu a {
    border-radius: var(--nxc-radius-sm, 4px);
    color: var(--nxc-color-navigation, #18191f);
    font-size: 14px;
    margin: 0;
    padding: 9px 10px;
    text-align: left;
}

.header__btns .header__account-menu a:hover {
    background: var(--nxc-color-surface, #f5f7fa);
    color: var(--nxc-color-primary, #4caf4f);
}

.footer__navigation {
    display: flex;
    flex-direction: column;
    width: 100%;
}

.footer__navigation li {
    width: 100%;
}

.footer__item .footer__navigation a {
    display: inline-block;
    margin-top: 12px;
}

.footer__item .footer__navigation > li:first-child > a {
    margin-top: 24px;
}

.footer__navigation .footer__navigation {
    padding-left: 12px;
}

.footer__form-status {
    color: var(--nxc-color-footer-placeholder, #d9dbe1);
    font-size: 12px;
    line-height: 1.4;
    margin-top: 8px;
    min-height: 17px;
}

.footer__form-status--success {
    color: var(--nxc-style-success, #a5d6a7);
}

.footer__form-status--error {
    color: var(--nxc-style-error, #ffb4ab);
}

.nxc-react-fade {
    animation: nxc-react-fade 320ms ease both;
}

@keyframes nxc-react-fade {
    from {
        opacity: 0;
        transform: translateY(8px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@media (max-width: 991.98px) and (min-width: 768px) {
    .header__account-name {
        display: none;
    }
}

@media (max-width: 767.98px) {
    .header__menu nav .header__navigation-list {
        align-items: stretch;
    }

    .header__navigation-list > li {
        text-align: center;
        width: 100%;
    }

    .header__submenu,
    .header__submenu .header__submenu {
        background: var(--nxc-color-surface, #f5f7fa);
        box-shadow: none;
        display: flex !important;
        left: auto;
        margin-top: 8px;
        min-width: 0;
        opacity: 1;
        padding: 8px !important;
        pointer-events: auto;
        position: static;
        top: auto;
        transform: none;
        visibility: visible;
        width: 100%;
    }

    .header__submenu a,
    .header__btns .header__account-menu a {
        font-size: 18px !important;
    }

    .header__account {
        width: min(100%, 300px);
    }

    .header__account-trigger {
        justify-content: center;
        width: 100%;
    }

    .header__account-menu {
        box-shadow: none;
        margin-top: 8px;
        position: static;
        width: 100%;
    }

    .footer__navigation,
    .footer__navigation li {
        text-align: center;
    }

    .footer__navigation .footer__navigation {
        padding-left: 0;
    }
}

@media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        scroll-behavior: auto !important;
        transition-duration: 0.01ms !important;
    }
}
`;

export function normalizeStaticCss(css: string): string {
    let normalizedCss = css
        .replace(/\/\*# sourceMappingURL=.*?\*\//g, '')
        .replace(/(-?\d*\.?\d+)rem\b/g, (_, value: string) => {
            const pixels = Number(value) * 10;

            return `${Number.isInteger(pixels) ? pixels : Number(pixels.toFixed(3))}px`;
        });

    for (const [pattern, replacement] of THEME_COLOR_REPLACEMENTS) {
        normalizedCss = normalizedCss.replace(pattern, replacement);
    }

    return normalizedCss;
}

export const staticShadowCss = `${normalizeStaticCss(staticCss)}\n${LOCAL_OVERRIDES}`;

export function StaticStyleBoundary({children}: {children: ReactNode}) {
    return (
        <>
            <style>{staticShadowCss}</style>
            {children}
        </>
    );
}
