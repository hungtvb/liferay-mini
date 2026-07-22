import {afterEach, describe, expect, it, vi} from 'vitest';

import {
    clearSiteShellRequestCache,
    createFallbackSiteShell,
    loadSiteShell,
    normalizeSiteShell,
} from './siteShellClient';

afterEach(() => {
    clearSiteShellRequestCache();
    vi.restoreAllMocks();
});

describe('Site Shell client', () => {
    it('builds a complete static fallback', () => {
        const fallback = createFallbackSiteShell();

        expect(fallback.headerNavigation).toHaveLength(6);
        expect(fallback.companyNavigation.length).toBeGreaterThan(0);
        expect(fallback.supportNavigation.length).toBeGreaterThan(0);
        expect(fallback.account.signedIn).toBe(false);
    });

    it('normalizes nested navigation and account state', () => {
        const shell = normalizeSiteShell({
            account: {
                displayName: 'Hung Tran',
                signedIn: true,
            },
            companyNavigation: [],
            headerNavigation: [
                {
                    children: [
                        {
                            label: 'Child',
                            url: '/child',
                        },
                    ],
                    label: 'Parent',
                    selected: true,
                    url: '/parent',
                },
            ],
            site: {
                name: 'Nexcent',
                siteId: 123,
            },
            supportNavigation: [],
            warnings: [],
        });

        expect(shell.account.signedIn).toBe(true);
        expect(shell.headerNavigation[0].selected).toBe(true);
        expect(shell.headerNavigation[0].children[0].label).toBe('Child');
        expect(shell.site.siteId).toBe(123);
    });

    it('shares one request between Header and Footer hosts', async () => {
        const fetchMock = vi.fn().mockResolvedValue({
            json: async () => ({
                account: {signedIn: false},
                companyNavigation: [],
                headerNavigation: [],
                site: {name: 'Nexcent', siteId: 321},
                supportNavigation: [],
                warnings: [],
            }),
            ok: true,
            status: 200,
            statusText: 'OK',
        });

        vi.stubGlobal('fetch', fetchMock);

        const host = {
            getAttribute: (name: string) =>
                name === 'site-id' ? '321' : null,
        } as HTMLElement;

        const [headerShell, footerShell] = await Promise.all([
            loadSiteShell(host),
            loadSiteShell(host),
        ]);

        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(headerShell).toBe(footerShell);
    });
});
