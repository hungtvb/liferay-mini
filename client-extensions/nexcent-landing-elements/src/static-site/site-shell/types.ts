export type AccountContext = {
    accountURL: string;
    createAccountURL: string;
    displayName: string;
    emailAddress: string;
    loginURL: string;
    logoutURL: string;
    portraitURL: string;
    signedIn: boolean;
};

export type NavigationItem = {
    children: NavigationItem[];
    externalReferenceCode: string;
    label: string;
    selected: boolean;
    target: string;
    url: string;
};

export type SiteIdentity = {
    externalReferenceCode: string;
    homeURL: string;
    logoURL: string;
    name: string;
    siteId: number;
};

export type SiteShell = {
    account: AccountContext;
    companyNavigation: NavigationItem[];
    headerNavigation: NavigationItem[];
    site: SiteIdentity;
    supportNavigation: NavigationItem[];
    warnings: string[];
};

export type SiteShellLoadState = {
    error?: Error;
    shell: SiteShell;
    status: 'fallback' | 'loading' | 'ready';
};
