import content from '../../../../../prototypes/nexcent-static/content.json';

import type {NavigationItem, SiteShell} from './types';

type LiferayWindow = Window & {
    Liferay?: {
        ThemeDisplay?: {
            getScopeGroupId?: () => number | string;
        };
    };
};

const requestCache = new Map<string, Promise<SiteShell>>();

function toNavigationItem(
    item: {href: string; label: string},
    index: number
): NavigationItem {
    return {
        children: [],
        externalReferenceCode: `NXC-FALLBACK-${index + 1}`,
        label: item.label,
        selected: false,
        target: '',
        url: item.href,
    };
}

export function createFallbackSiteShell(): SiteShell {
    const companyColumn = content.footer.columns[0];
    const supportColumn = content.footer.columns[1];

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
        companyNavigation: companyColumn.links.map(toNavigationItem),
        headerNavigation: content.navigation.map(toNavigationItem),
        site: {
            externalReferenceCode: 'NEXCENT-PREVIEW',
            homeURL: '#home',
            logoURL: '',
            name: 'Nexcent',
            siteId: 0,
        },
        supportNavigation: supportColumn.links.map(toNavigationItem),
        warnings: ['Using the bundled static Site Shell fallback.'],
    };
}

function normalizeNavigationItems(value: unknown): NavigationItem[] {
    if (!Array.isArray(value)) {
        return [];
    }

    return value
        .filter((item): item is Record<string, unknown> => Boolean(item && typeof item === 'object'))
        .map((item, index) => ({
            children: normalizeNavigationItems(item.children),
            externalReferenceCode:
                typeof item.externalReferenceCode === 'string'
                    ? item.externalReferenceCode
                    : `NXC-RUNTIME-${index + 1}`,
            label: typeof item.label === 'string' ? item.label : '',
            selected: item.selected === true,
            target: typeof item.target === 'string' ? item.target : '',
            url: typeof item.url === 'string' && item.url ? item.url : '#',
        }))
        .filter((item) => Boolean(item.label));
}

export function normalizeSiteShell(value: unknown): SiteShell {
    const fallback = createFallbackSiteShell();

    if (!value || typeof value !== 'object') {
        throw new Error('Site Shell response must be an object.');
    }

    const response = value as Record<string, unknown>;
    const account =
        response.account && typeof response.account === 'object'
            ? (response.account as Record<string, unknown>)
            : {};
    const site =
        response.site && typeof response.site === 'object'
            ? (response.site as Record<string, unknown>)
            : {};

    return {
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
                typeof account.displayName === 'string' ? account.displayName : '',
            emailAddress:
                typeof account.emailAddress === 'string' ? account.emailAddress : '',
            loginURL:
                typeof account.loginURL === 'string'
                    ? account.loginURL
                    : fallback.account.loginURL,
            logoutURL:
                typeof account.logoutURL === 'string'
                    ? account.logoutURL
                    : fallback.account.logoutURL,
            portraitURL:
                typeof account.portraitURL === 'string' ? account.portraitURL : '',
            signedIn: account.signedIn === true,
        },
        companyNavigation: normalizeNavigationItems(response.companyNavigation),
        headerNavigation: normalizeNavigationItems(response.headerNavigation),
        site: {
            externalReferenceCode:
                typeof site.externalReferenceCode === 'string'
                    ? site.externalReferenceCode
                    : fallback.site.externalReferenceCode,
            homeURL:
                typeof site.homeURL === 'string'
                    ? site.homeURL
                    : fallback.site.homeURL,
            logoURL: typeof site.logoURL === 'string' ? site.logoURL : '',
            name: typeof site.name === 'string' ? site.name : fallback.site.name,
            siteId: typeof site.siteId === 'number' ? site.siteId : 0,
        },
        supportNavigation: normalizeNavigationItems(response.supportNavigation),
        warnings: Array.isArray(response.warnings)
            ? response.warnings.filter(
                  (warning): warning is string => typeof warning === 'string'
              )
            : [],
    };
}

export function resolveSiteId(host?: HTMLElement): string | null {
    const attributeValue = host?.getAttribute('site-id')?.trim();

    if (attributeValue) {
        return attributeValue;
    }

    if (typeof window === 'undefined') {
        return null;
    }

    const scopeGroupId = (window as LiferayWindow).Liferay?.ThemeDisplay?.getScopeGroupId?.();

    return scopeGroupId == null ? null : String(scopeGroupId);
}

export function loadSiteShell(host?: HTMLElement): Promise<SiteShell> {
    const siteId = resolveSiteId(host);

    if (!siteId) {
        return Promise.reject(
            new Error('Missing site-id for the Nexcent React Site Shell.')
        );
    }

    const apiBase =
        host?.getAttribute('api-base')?.replace(/\/$/, '') ||
        '/o/nexcent-site-shell/v1.0';
    const requestURL = `${apiBase}/sites/${encodeURIComponent(siteId)}/site-shell`;
    const cachedRequest = requestCache.get(requestURL);

    if (cachedRequest) {
        return cachedRequest;
    }

    const request = fetch(requestURL, {
        credentials: 'same-origin',
        headers: {
            Accept: 'application/json',
        },
    }).then(async (response) => {
        if (!response.ok) {
            throw new Error(
                `Site Shell request failed with ${response.status} ${response.statusText}`
            );
        }

        return normalizeSiteShell(await response.json());
    });

    requestCache.set(requestURL, request);

    request.catch(() => {
        requestCache.delete(requestURL);
    });

    return request;
}

export function clearSiteShellRequestCache() {
    requestCache.clear();
}
