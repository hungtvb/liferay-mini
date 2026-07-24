import {useEffect, useState} from 'react';

import {
    createFallbackSiteShell,
    loadSiteShell,
} from './siteShellClient';
import type {SiteShellLoadState} from './types';

export function useSiteShell(host?: HTMLElement): SiteShellLoadState {
    const [state, setState] = useState<SiteShellLoadState>({
        shell: createFallbackSiteShell(),
        status: host ? 'loading' : 'fallback',
    });

    useEffect(() => {
        let active = true;

        if (!host) {
            setState({
                shell: createFallbackSiteShell(),
                status: 'fallback',
            });

            return () => {
                active = false;
            };
        }

        host.dataset.siteShellState = 'loading';

        loadSiteShell(host)
            .then((shell) => {
                if (!active) {
                    return;
                }

                host.dataset.siteShellState = 'ready';
                setState({shell, status: 'ready'});
            })
            .catch((error: unknown) => {
                if (!active) {
                    return;
                }

                const normalizedError =
                    error instanceof Error
                        ? error
                        : new Error('Unable to load the Nexcent Site Shell.');

                host.dataset.siteShellState = 'fallback';
                host.dataset.siteShellError = normalizedError.message;
                console.warn('[Nexcent Site Shell]', normalizedError);
                setState({
                    error: normalizedError,
                    shell: createFallbackSiteShell(),
                    status: 'fallback',
                });
            });

        return () => {
            active = false;
        };
    }, [host]);

    return state;
}
