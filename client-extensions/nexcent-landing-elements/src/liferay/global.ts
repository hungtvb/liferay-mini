export type LiferayGlobal = {
    authToken?: string;
    ThemeDisplay?: {
        getLanguageId?: () => string;
        getScopeGroupId?: () => number | string;
        isSignedIn?: () => boolean;
    };
};

type LiferayWindow = Window & {
    Liferay?: LiferayGlobal;
};

export function getLiferay(): LiferayGlobal | undefined {
    return (window as LiferayWindow).Liferay;
}

export function getPortalContext() {
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
    const siteId = getLiferay()?.ThemeDisplay?.getScopeGroupId?.();

    if (siteId === undefined || siteId === null || siteId === '') {
        throw new Error(
            'Unable to resolve the current Liferay site from ThemeDisplay.'
        );
    }

    return String(siteId);
}
