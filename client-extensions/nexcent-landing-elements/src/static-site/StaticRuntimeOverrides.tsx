import type {ReactNode} from 'react';

const RUNTIME_OVERRIDES = `
/* Shadow DOM does not inherit the reference body rule automatically. */
:host {
    color: var(--nxc-color-text, #717171);
    font-size: 14px;
    font-weight: 400;
    line-height: 1.42;
}

/* Reproduce the Swiper geometry used by the static reference without its CDN. */
.swiper-wrapper {
    display: flex;
    height: 100%;
    width: 100%;
}

.swiper-slide {
    flex-shrink: 0;
    height: 100%;
    position: relative;
    width: 100%;
}

/* Keep the original clipped navigation underline without blocking nested menus. */
.header__navigation-list > li {
    overflow: hidden !important;
}

.header__navigation-list > li:has(> .header__submenu) {
    overflow: visible !important;
}

.header__navigation-list > li:has(> .header__submenu) > .decor-line {
    display: none;
}

/* The reference footer has no reserved message row before a form status exists. */
.footer__form-status--idle {
    display: none;
    margin-top: 0;
    min-height: 0;
}
`;

export function StaticRuntimeOverrides({children}: {children: ReactNode}) {
    return (
        <>
            <style>{RUNTIME_OVERRIDES}</style>
            {children}
        </>
    );
}
