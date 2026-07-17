(() => {
    const VERSION = '0.2.0';

    if (window.Nexcent?.version === VERSION) {
        return;
    }

    const getPortalContext = () => {
        const themeDisplay = window.Liferay?.ThemeDisplay;

        return {
            companyId: themeDisplay?.getCompanyId?.()?.toString() ?? 'unknown',
            host: window.location.host,
            languageId: themeDisplay?.getLanguageId?.() ?? 'unknown',
            scopeGroupId:
                themeDisplay?.getScopeGroupId?.()?.toString() ?? 'unknown',
            signedIn: themeDisplay?.isSignedIn?.() ?? false,
        };
    };

    const getStyleToken = (name, fallback = '') => {
        const value = getComputedStyle(document.documentElement)
            .getPropertyValue(name)
            .trim();

        return value || fallback;
    };

    const dispatch = (name, detail = {}) => {
        window.dispatchEvent(
            new CustomEvent(`nexcent:${name}`, {
                detail,
            })
        );
    };

    const notifyReady = () => {
        dispatch('global-ready', {
            context: getPortalContext(),
            version: VERSION,
        });
    };

    window.Nexcent = {
        ...(window.Nexcent ?? {}),
        dispatch,
        getPortalContext,
        getStyleToken,
        version: VERSION,
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', notifyReady, {once: true});
    }
    else {
        notifyReady();
    }

    window.Liferay?.on?.('endNavigate', () => {
        dispatch('navigation-end', {
            context: getPortalContext(),
            url: window.location.href,
        });
    });
})();
