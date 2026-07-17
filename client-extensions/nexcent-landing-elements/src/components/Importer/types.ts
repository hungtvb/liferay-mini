export type BaseMigrationRow = {
    active: boolean;
    externalReferenceCode: string;
    sortOrder: number;
    title: string;
};

export type HeroRow = BaseMigrationRow & {
    ctaLabel: string;
    ctaUrl: string;
    description: string;
    highlightedText: string;
    imageAlt: string;
    imageFile: string;
};

export type ServicesIntroRow = BaseMigrationRow & {
    description: string;
};

export type ServiceRow = BaseMigrationRow & {
    descriptionHtml: string;
    iconAlt: string;
    iconFile: string;
    targetUrl: string;
};

export type FeatureRow = BaseMigrationRow & {
    backgroundVariant: 'silver' | 'white';
    ctaLabel: string;
    ctaUrl: string;
    descriptionHtml: string;
    imageAlt: string;
    imageFile: string;
    imagePosition: 'left' | 'right';
};

export type MigrationWorkbook = {
    features: FeatureRow[];
    heroes: HeroRow[];
    services: ServiceRow[];
    servicesIntro: ServicesIntroRow[];
};

export type RawWorkbook = Record<string, Record<string, unknown>[]>;

export type ValidationIssue = {
    level: 'error' | 'warning';
    message: string;
    row?: number;
    sheet?: string;
};

export type ImportResult = {
    action: 'created' | 'updated';
    externalReferenceCode: string;
    title: string;
    type: 'Feature' | 'Hero' | 'Service' | 'Services Intro';
};
