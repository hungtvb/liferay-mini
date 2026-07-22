import type {ReactNode} from 'react';

const RUNTIME_OVERRIDES = `
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
