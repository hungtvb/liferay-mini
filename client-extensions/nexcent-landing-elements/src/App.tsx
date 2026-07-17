type LiferayGlobal = {
    ThemeDisplay?: {
        getLanguageId?: () => string;
        getScopeGroupId?: () => string;
        isSignedIn?: () => boolean;
    };
};

type LiferayWindow = Window & {
    Liferay?: LiferayGlobal;
};

function readPortalContext() {
    const liferay = (window as LiferayWindow).Liferay;

    return {
        host: window.location.host,
        languageId: liferay?.ThemeDisplay?.getLanguageId?.() ?? 'unknown',
        scopeGroupId:
            liferay?.ThemeDisplay?.getScopeGroupId?.() ?? 'unknown',
        signedIn: liferay?.ThemeDisplay?.isSignedIn?.() ?? false,
    };
}

export function App() {
    const context = readPortalContext();

    return (
        <section className="nxc-lab-status" aria-labelledby="nxc-lab-title">
            <div className="nxc-lab-status__badge">Client Extension ready</div>

            <h2 id="nxc-lab-title">Nexcent Landing Page Lab</h2>

            <p>
                React is mounted inside a Liferay Custom Element. The next
                exercise replaces this status card with data from Headless
                Delivery APIs.
            </p>

            <dl className="nxc-lab-status__details">
                <div>
                    <dt>Host</dt>
                    <dd>{context.host}</dd>
                </div>
                <div>
                    <dt>Signed in</dt>
                    <dd>{context.signedIn ? 'Yes' : 'No'}</dd>
                </div>
                <div>
                    <dt>Language</dt>
                    <dd>{context.languageId}</dd>
                </div>
                <div>
                    <dt>Scope group</dt>
                    <dd>{context.scopeGroupId}</dd>
                </div>
            </dl>
        </section>
    );
}
