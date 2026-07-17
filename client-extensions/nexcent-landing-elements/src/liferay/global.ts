export type PortalContext = {
    host: string;
    languageId: string;
    scopeGroupId: string;
    signedIn: boolean;
};

export type LiferayGlobal = {
    authToken?: string;
    ThemeDisplay?: {
        getLanguageId?: () => string;
        getScopeGroupId?: () => number | string;
        isSignedIn?: () => boolean;
    };
};

export type NexcentGlobal = {
    dispatch?: (name: string, detail?: unknown) => void;
    getPortalContext?: () => PortalContext;
    version?: string;
};

type LiferayWindow = Window & {
    Liferay?: LiferayGlobal;
    Nexcent?: NexcentGlobal;
};

function getWindow(): LiferayWindow {
    return window as LiferayWindow;
}

export function getLiferay(): LiferayGlobal | undefined {
    return getWindow().Liferay;
}

export function getNexcent(): NexcentGlobal | undefined {
    return getWindow().Nexcent;
}

export function getPortalContext(): PortalContext {
    const globalContext = getNexcent()?.getPortalContext?.();

    if (globalContext) {
        return globalContext;
    }

    const liferay = getLiferay();

    return {
        host: window.location.host,
        languageId: liferay?.ThemeDisplay?.getLanguageId?.() ?? 'unknown',
        scopeGroupId:
            liferay?.ThemeDisplay?.getScopeGroupId?.()?.toString() ??
            'unknown',
        signedIn: liferay?.ThemeDisplay?.isSignedIn?.() ?? false,
    };
}

export function getSiteId(): string {
    const siteId = getPortalContext().scopeGroupId;

    if (!siteId || siteId === 'unknown') {
        throw new Error(
            'Unable to resolve the current Liferay site from Nexcent Global JS or ThemeDisplay.'
        );
    }

    return siteId;
}
