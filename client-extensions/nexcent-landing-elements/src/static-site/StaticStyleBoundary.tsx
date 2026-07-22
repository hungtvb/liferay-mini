import type {ReactNode} from 'react';

import staticCss from '../../../../prototypes/nexcent-static/css/style.css?inline';

const LOCAL_OVERRIDES = `
:host {
    color: #18191f;
    display: block;
    font-family: Inter, Arial, sans-serif;
    line-height: 1.5;
    min-width: 0;
    scroll-margin-top: 80px;
}

:host *, :host *::before, :host *::after {
    box-sizing: border-box;
}

:host a:focus-visible,
:host button:focus-visible,
:host input:focus-visible {
    outline: 2px solid #4caf4f;
    outline-offset: 3px;
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
    return css
        .replace(/\/\*# sourceMappingURL=.*?\*\//g, '')
        .replace(/(-?\d*\.?\d+)rem\b/g, (_, value: string) => {
            const pixels = Number(value) * 10;

            return `${Number.isInteger(pixels) ? pixels : Number(pixels.toFixed(3))}px`;
        });
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
