import type {ReactNode} from 'react';

import landingCss from './styles/landing.scss?inline';

export const staticShadowCss = landingCss;

export function StaticStyleBoundary({children}: {children: ReactNode}) {
    return (
        <>
            <style>{staticShadowCss}</style>
            {children}
        </>
    );
}
