export type BaseMigrationRow = {
    active: boolean;
    externalReferenceCode: string;
    sortOrder: number;
    title: string;
};

export type IntroMigrationRow = {
    description: string;
    externalReferenceCode: string;
    heading: string;
};

export type HeroRow = BaseMigrationRow & {
    ctaLabel: string;
    ctaTarget: LinkTarget;
    ctaUrl: string;
    description: string;
    highlightedText: string;
    imageAlt: string;
    imageFile: string;
};

export type ClientsIntroRow = IntroMigrationRow;

export type ClientRow = Omit<BaseMigrationRow, 'title'> & {
    logoAlt: string;
    logoFile: string;
    name: string;
    websiteUrl: string;
};

export type ServicesIntroRow = IntroMigrationRow;

export type ServiceRow = BaseMigrationRow & {
    description: string;
    iconAlt: string;
    iconFile: string;
    linkLabel: string;
    linkUrl: string;
};

export type FeatureRow = BaseMigrationRow & {
    backgroundVariant: 'default' | 'muted';
    ctaLabel: string;
    ctaUrl: string;
    descriptionHTML: string;
    imageAlt: string;
    imageFile: string;
    imagePosition: 'left' | 'right';
};

export type StatisticsIntroRow = IntroMigrationRow & {
    highlightedText: string;
};

export type StatisticRow = Omit<BaseMigrationRow, 'title'> & {
    iconAlt: string;
    iconFile: string;
    label: string;
    value: number;
    valueSuffix: string;
};

export type TestimonialRow = Omit<BaseMigrationRow, 'title'> & {
    ctaLabel: string;
    ctaUrl: string;
    customerCompany: string;
    customerImageAlt: string;
    customerImageFile: string;
    customerName: string;
    customerRole: string;
    quote: string;
};

export type CommunityIntroRow = IntroMigrationRow;

export type CommunityCardRow = BaseMigrationRow & {
    publishedDate: string;
    summary: string;
    targetUrl: string;
    thumbnailAlt: string;
    thumbnailFile: string;
};

export type LinkTarget = '' | '_blank' | '_self';

export type CtaRow = {
    active: boolean;
    backgroundVariant: '' | 'brand' | 'default' | 'muted';
    ctaLabel: string;
    ctaTarget: LinkTarget;
    ctaUrl: string;
    externalReferenceCode: string;
    heading: string;
};

export type MigrationWorkbook = {
    clients: ClientRow[];
    clientsIntro: ClientsIntroRow[];
    communityCards: CommunityCardRow[];
    communityIntro: CommunityIntroRow[];
    cta: CtaRow[];
    features: FeatureRow[];
    heroes: HeroRow[];
    services: ServiceRow[];
    servicesIntro: ServicesIntroRow[];
    statistics: StatisticRow[];
    statisticsIntro: StatisticsIntroRow[];
    testimonials: TestimonialRow[];
};

export type RawWorkbook = Record<string, Record<string, unknown>[]>;

export type ValidationIssue = {
    level: 'error' | 'warning';
    message: string;
    row?: number;
    sheet?: string;
};

export type ImportResult = {
    action: 'created' | 'failed' | 'updated';
    externalReferenceCode: string;
    message?: string;
    title: string;
    type:
        | 'CTA'
        | 'Client'
        | 'Clients Intro'
        | 'Community Card'
        | 'Community Intro'
        | 'Feature'
        | 'Hero'
        | 'Service'
        | 'Services Intro'
        | 'Statistic'
        | 'Statistics Intro'
        | 'Testimonial';
};
