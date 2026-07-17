(() => {
    const VERSION = '0.1.0';

    const getPortalContext = () => {
        const themeDisplay = window.Liferay?.ThemeDisplay;

        return {
            host: window.location.host,
            languageId: themeDisplay?.getLanguageId?.() ?? 'unknown',
            scopeGroupId:
                themeDisplay?.getScopeGroupId?.()?.toString() ?? 'unknown',
            signedIn: themeDisplay?.isSignedIn?.() ?? false,
        };
    };

    const dispatch = (name, detail = {}) => {
        window.dispatchEvent(
            new CustomEvent(`nexcent:${name}`, {
                detail,
            })
        );
    };

    window.Nexcent = {
        ...(window.Nexcent ?? {}),
        dispatch,
        getPortalContext,
        version: VERSION,
    };

    dispatch('global-ready', {
        context: getPortalContext(),
        version: VERSION,
    });
})();
