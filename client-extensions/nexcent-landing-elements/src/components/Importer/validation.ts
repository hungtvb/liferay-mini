import {
    type ClientRow,
    type ClientsIntroRow,
    type CommunityCardRow,
    type CommunityIntroRow,
    type CtaRow,
    type FeatureRow,
    type HeroRow,
    type LinkTarget,
    type MigrationWorkbook,
    type RawWorkbook,
    type ServiceRow,
    type ServicesIntroRow,
    type StatisticRow,
    type StatisticsIntroRow,
    type TestimonialRow,
    type ValidationIssue,
} from './types';
import {REQUIRED_SHEETS} from './workbook';

type RecordValue = Record<string, unknown>;

const LINK_TARGETS = new Set<LinkTarget>(['', '_blank', '_self']);
const SCRIPT_PATTERN = /<\s*script\b|\son\w+\s*=|javascript:/i;

function basename(path: string): string {
    return path.split(/[\\/]/).filter(Boolean).pop() ?? path;
}

function rowNumber(record: RecordValue): number | undefined {
    const value = Number(record.__rowNumber);

    return Number.isFinite(value) ? value : undefined;
}

function stringValue(record: RecordValue, name: string): string {
    const value = record[name];

    return value === null || value === undefined ? '' : String(value).trim();
}

function numberValue(record: RecordValue, name: string): number {
    const value = Number(record[name]);

    return Number.isFinite(value) ? value : Number.NaN;
}

function booleanValue(record: RecordValue, name: string): boolean | undefined {
    const value = record[name];

    if (typeof value === 'boolean') {
        return value;
    }

    if (typeof value === 'number') {
        return value === 1 ? true : value === 0 ? false : undefined;
    }

    if (typeof value === 'string') {
        const normalized = value.trim().toLowerCase();

        if (['true', 'yes', '1'].includes(normalized)) {
            return true;
        }

        if (['false', 'no', '0'].includes(normalized)) {
            return false;
        }
    }

    return undefined;
}

function isValidUrl(value: string): boolean {
    return (
        value === '' ||
        value.startsWith('/') ||
        /^https?:\/\//i.test(value) ||
        value.startsWith('#')
    );
}

function addIssue(
    issues: ValidationIssue[],
    sheet: string,
    record: RecordValue,
    message: string
) {
    issues.push({
        level: 'error',
        message,
        row: rowNumber(record),
        sheet,
    });
}

function addRequiredIssues(
    record: RecordValue,
    sheet: string,
    fields: string[],
    issues: ValidationIssue[]
) {
    for (const field of fields) {
        if (!stringValue(record, field)) {
            addIssue(issues, sheet, record, `Required column "${field}" is empty.`);
        }
    }
}

function addItemBaseIssues(
    record: RecordValue,
    sheet: string,
    titleField: string,
    issues: ValidationIssue[]
) {
    addRequiredIssues(
        record,
        sheet,
        ['externalReferenceCode', titleField, 'sortOrder', 'active'],
        issues
    );

    if (!Number.isFinite(numberValue(record, 'sortOrder'))) {
        addIssue(issues, sheet, record, 'sortOrder must be a number.');
    }

    if (booleanValue(record, 'active') === undefined) {
        addIssue(issues, sheet, record, 'active must be true or false.');
    }
}

function addIntroIssues(
    record: RecordValue,
    sheet: string,
    issues: ValidationIssue[]
) {
    addRequiredIssues(record, sheet, ['externalReferenceCode', 'heading'], issues);
}

function addAssetIssue(
    record: RecordValue,
    sheet: string,
    field: string,
    assetNames: Set<string>,
    issues: ValidationIssue[]
) {
    const assetPath = stringValue(record, field);

    if (assetPath && !assetNames.has(basename(assetPath).toLowerCase())) {
        addIssue(issues, sheet, record, `Asset "${assetPath}" was not selected.`);
    }
}

function addUrlIssue(
    record: RecordValue,
    sheet: string,
    field: string,
    issues: ValidationIssue[]
) {
    if (!isValidUrl(stringValue(record, field))) {
        addIssue(
            issues,
            sheet,
            record,
            `${field} must be a relative, anchor, HTTP, or HTTPS URL.`
        );
    }
}

function addOptionalPairIssue(
    record: RecordValue,
    sheet: string,
    left: string,
    right: string,
    issues: ValidationIssue[]
) {
    if (Boolean(stringValue(record, left)) !== Boolean(stringValue(record, right))) {
        addIssue(
            issues,
            sheet,
            record,
            `${left} and ${right} must either both be set or both be empty.`
        );
    }
}

function addTargetIssue(
    record: RecordValue,
    sheet: string,
    field: string,
    issues: ValidationIssue[]
) {
    const value = stringValue(record, field) as LinkTarget;

    if (!LINK_TARGETS.has(value)) {
        addIssue(issues, sheet, record, `${field} must be empty, _self, or _blank.`);
    }
}

function addUnsafeHtmlIssue(
    record: RecordValue,
    sheet: string,
    field: string,
    issues: ValidationIssue[]
) {
    if (SCRIPT_PATTERN.test(stringValue(record, field))) {
        addIssue(issues, sheet, record, `${field} contains executable or unsafe markup.`);
    }
}

function addDuplicateSortOrderIssues(
    rawWorkbook: RawWorkbook,
    sheets: string[],
    issues: ValidationIssue[]
) {
    for (const sheet of sheets) {
        const sortOrders = new Map<number, number | undefined>();

        for (const record of rawWorkbook[sheet] ?? []) {
            const sortOrder = numberValue(record, 'sortOrder');

            if (!Number.isFinite(sortOrder)) {
                continue;
            }

            if (sortOrders.has(sortOrder)) {
                addIssue(
                    issues,
                    sheet,
                    record,
                    `sortOrder ${sortOrder} is duplicated in ${sheet}.`
                );
            }
            else {
                sortOrders.set(sortOrder, rowNumber(record));
            }
        }
    }
}

function normalizeIntro(record: RecordValue): ClientsIntroRow {
    return {
        description: stringValue(record, 'description'),
        externalReferenceCode: stringValue(record, 'externalReferenceCode'),
        heading: stringValue(record, 'heading'),
    };
}

function normalizeHero(record: RecordValue): HeroRow {
    return {
        active: booleanValue(record, 'active') ?? false,
        ctaLabel: stringValue(record, 'ctaLabel'),
        ctaTarget: stringValue(record, 'ctaTarget') as LinkTarget,
        ctaUrl: stringValue(record, 'ctaUrl'),
        description: stringValue(record, 'description'),
        externalReferenceCode: stringValue(record, 'externalReferenceCode'),
        highlightedText: stringValue(record, 'highlightedText'),
        imageAlt: stringValue(record, 'imageAlt'),
        imageFile: stringValue(record, 'imageFile'),
        sortOrder: numberValue(record, 'sortOrder'),
        title: stringValue(record, 'title'),
    };
}

function normalizeClient(record: RecordValue): ClientRow {
    return {
        active: booleanValue(record, 'active') ?? false,
        externalReferenceCode: stringValue(record, 'externalReferenceCode'),
        logoAlt: stringValue(record, 'logoAlt'),
        logoFile: stringValue(record, 'logoFile'),
        name: stringValue(record, 'name'),
        sortOrder: numberValue(record, 'sortOrder'),
        websiteUrl: stringValue(record, 'websiteUrl'),
    };
}

function normalizeService(record: RecordValue): ServiceRow {
    return {
        active: booleanValue(record, 'active') ?? false,
        description: stringValue(record, 'description'),
        externalReferenceCode: stringValue(record, 'externalReferenceCode'),
        iconAlt: stringValue(record, 'iconAlt'),
        iconFile: stringValue(record, 'iconFile'),
        linkLabel: stringValue(record, 'linkLabel'),
        linkUrl: stringValue(record, 'linkUrl'),
        sortOrder: numberValue(record, 'sortOrder'),
        title: stringValue(record, 'title'),
    };
}

function normalizeFeature(record: RecordValue): FeatureRow {
    return {
        active: booleanValue(record, 'active') ?? false,
        backgroundVariant: stringValue(record, 'backgroundVariant') as
            | 'default'
            | 'muted',
        ctaLabel: stringValue(record, 'ctaLabel'),
        ctaUrl: stringValue(record, 'ctaUrl'),
        descriptionHTML: stringValue(record, 'descriptionHTML'),
        externalReferenceCode: stringValue(record, 'externalReferenceCode'),
        imageAlt: stringValue(record, 'imageAlt'),
        imageFile: stringValue(record, 'imageFile'),
        imagePosition: stringValue(record, 'imagePosition') as 'left' | 'right',
        sortOrder: numberValue(record, 'sortOrder'),
        title: stringValue(record, 'title'),
    };
}

function normalizeStatistic(record: RecordValue): StatisticRow {
    return {
        active: booleanValue(record, 'active') ?? false,
        externalReferenceCode: stringValue(record, 'externalReferenceCode'),
        iconAlt: stringValue(record, 'iconAlt'),
        iconFile: stringValue(record, 'iconFile'),
        label: stringValue(record, 'label'),
        sortOrder: numberValue(record, 'sortOrder'),
        value: numberValue(record, 'value'),
        valueSuffix: stringValue(record, 'valueSuffix'),
    };
}

function normalizeStatisticsIntro(record: RecordValue): StatisticsIntroRow {
    return {
        ...normalizeIntro(record),
        highlightedText: stringValue(record, 'highlightedText'),
    };
}

function normalizeTestimonial(record: RecordValue): TestimonialRow {
    return {
        active: booleanValue(record, 'active') ?? false,
        ctaLabel: stringValue(record, 'ctaLabel'),
        ctaUrl: stringValue(record, 'ctaUrl'),
        customerCompany: stringValue(record, 'customerCompany'),
        customerImageAlt: stringValue(record, 'customerImageAlt'),
        customerImageFile: stringValue(record, 'customerImageFile'),
        customerName: stringValue(record, 'customerName'),
        customerRole: stringValue(record, 'customerRole'),
        externalReferenceCode: stringValue(record, 'externalReferenceCode'),
        quote: stringValue(record, 'quote'),
        sortOrder: numberValue(record, 'sortOrder'),
    };
}

function normalizeCommunityCard(record: RecordValue): CommunityCardRow {
    return {
        active: booleanValue(record, 'active') ?? false,
        externalReferenceCode: stringValue(record, 'externalReferenceCode'),
        publishedDate: stringValue(record, 'publishedDate'),
        sortOrder: numberValue(record, 'sortOrder'),
        summary: stringValue(record, 'summary'),
        targetUrl: stringValue(record, 'targetUrl'),
        thumbnailAlt: stringValue(record, 'thumbnailAlt'),
        thumbnailFile: stringValue(record, 'thumbnailFile'),
        title: stringValue(record, 'title'),
    };
}

function normalizeCta(record: RecordValue): CtaRow {
    return {
        active: booleanValue(record, 'active') ?? false,
        backgroundVariant: stringValue(record, 'backgroundVariant') as CtaRow['backgroundVariant'],
        ctaLabel: stringValue(record, 'ctaLabel'),
        ctaTarget: stringValue(record, 'ctaTarget') as LinkTarget,
        ctaUrl: stringValue(record, 'ctaUrl'),
        externalReferenceCode: stringValue(record, 'externalReferenceCode'),
        heading: stringValue(record, 'heading'),
    };
}

export function validateWorkbook(
    rawWorkbook: RawWorkbook,
    assetFiles: File[]
): {data?: MigrationWorkbook; issues: ValidationIssue[]} {
    const issues: ValidationIssue[] = [];
    const assetNames = new Set(assetFiles.map((file) => file.name.toLowerCase()));

    for (const sheet of REQUIRED_SHEETS) {
        if (!rawWorkbook[sheet]) {
            issues.push({
                level: 'error',
                message: `Required sheet "${sheet}" is missing.`,
                sheet,
            });
        }
    }

    for (const record of rawWorkbook.Heroes ?? []) {
        addItemBaseIssues(record, 'Heroes', 'title', issues);
        addRequiredIssues(record, 'Heroes', ['description', 'imageFile', 'imageAlt'], issues);
        addAssetIssue(record, 'Heroes', 'imageFile', assetNames, issues);
        addOptionalPairIssue(record, 'Heroes', 'ctaLabel', 'ctaUrl', issues);
        addUrlIssue(record, 'Heroes', 'ctaUrl', issues);
        addTargetIssue(record, 'Heroes', 'ctaTarget', issues);
    }

    for (const record of rawWorkbook.ClientsIntro ?? []) {
        addIntroIssues(record, 'ClientsIntro', issues);
    }

    for (const record of rawWorkbook.Clients ?? []) {
        addItemBaseIssues(record, 'Clients', 'name', issues);
        addRequiredIssues(record, 'Clients', ['logoFile', 'logoAlt'], issues);
        addAssetIssue(record, 'Clients', 'logoFile', assetNames, issues);
        addUrlIssue(record, 'Clients', 'websiteUrl', issues);
    }

    for (const record of rawWorkbook.ServicesIntro ?? []) {
        addIntroIssues(record, 'ServicesIntro', issues);
    }

    for (const record of rawWorkbook.Services ?? []) {
        addItemBaseIssues(record, 'Services', 'title', issues);
        addRequiredIssues(record, 'Services', ['description', 'iconFile'], issues);
        addAssetIssue(record, 'Services', 'iconFile', assetNames, issues);
        addOptionalPairIssue(record, 'Services', 'linkLabel', 'linkUrl', issues);
        addUrlIssue(record, 'Services', 'linkUrl', issues);
    }

    for (const record of rawWorkbook.Features ?? []) {
        addItemBaseIssues(record, 'Features', 'title', issues);
        addRequiredIssues(
            record,
            'Features',
            ['descriptionHTML', 'imageFile', 'imageAlt', 'imagePosition', 'backgroundVariant'],
            issues
        );
        addAssetIssue(record, 'Features', 'imageFile', assetNames, issues);
        addUnsafeHtmlIssue(record, 'Features', 'descriptionHTML', issues);
        addOptionalPairIssue(record, 'Features', 'ctaLabel', 'ctaUrl', issues);
        addUrlIssue(record, 'Features', 'ctaUrl', issues);

        if (!['left', 'right'].includes(stringValue(record, 'imagePosition'))) {
            addIssue(issues, 'Features', record, 'imagePosition must be left or right.');
        }

        if (!['default', 'muted'].includes(stringValue(record, 'backgroundVariant'))) {
            addIssue(
                issues,
                'Features',
                record,
                'backgroundVariant must be default or muted.'
            );
        }
    }

    for (const record of rawWorkbook.StatisticsIntro ?? []) {
        addIntroIssues(record, 'StatisticsIntro', issues);
    }

    for (const record of rawWorkbook.Statistics ?? []) {
        addItemBaseIssues(record, 'Statistics', 'label', issues);
        addRequiredIssues(record, 'Statistics', ['value', 'iconFile'], issues);
        addAssetIssue(record, 'Statistics', 'iconFile', assetNames, issues);

        if (!Number.isFinite(numberValue(record, 'value'))) {
            addIssue(issues, 'Statistics', record, 'value must be a number.');
        }
    }

    for (const record of rawWorkbook.Testimonials ?? []) {
        addItemBaseIssues(record, 'Testimonials', 'customerName', issues);
        addRequiredIssues(
            record,
            'Testimonials',
            ['quote', 'customerImageFile', 'customerImageAlt'],
            issues
        );
        addAssetIssue(record, 'Testimonials', 'customerImageFile', assetNames, issues);
        addUnsafeHtmlIssue(record, 'Testimonials', 'quote', issues);
        addOptionalPairIssue(record, 'Testimonials', 'ctaLabel', 'ctaUrl', issues);
        addUrlIssue(record, 'Testimonials', 'ctaUrl', issues);
    }

    for (const record of rawWorkbook.CommunityIntro ?? []) {
        addIntroIssues(record, 'CommunityIntro', issues);
    }

    for (const record of rawWorkbook.CommunityCards ?? []) {
        addItemBaseIssues(record, 'CommunityCards', 'title', issues);
        addRequiredIssues(
            record,
            'CommunityCards',
            ['thumbnailFile', 'thumbnailAlt', 'targetUrl'],
            issues
        );
        addAssetIssue(record, 'CommunityCards', 'thumbnailFile', assetNames, issues);
        addUrlIssue(record, 'CommunityCards', 'targetUrl', issues);

        const publishedDate = stringValue(record, 'publishedDate');

        if (publishedDate && Number.isNaN(Date.parse(publishedDate))) {
            addIssue(
                issues,
                'CommunityCards',
                record,
                'publishedDate must be a valid date or empty.'
            );
        }
    }

    for (const record of rawWorkbook.CTA ?? []) {
        addRequiredIssues(
            record,
            'CTA',
            ['externalReferenceCode', 'heading', 'ctaLabel', 'ctaUrl', 'active'],
            issues
        );

        if (booleanValue(record, 'active') === undefined) {
            addIssue(issues, 'CTA', record, 'active must be true or false.');
        }

        addUrlIssue(record, 'CTA', 'ctaUrl', issues);
        addTargetIssue(record, 'CTA', 'ctaTarget', issues);

        if (
            !['', 'brand', 'default', 'muted'].includes(
                stringValue(record, 'backgroundVariant')
            )
        ) {
            addIssue(
                issues,
                'CTA',
                record,
                'backgroundVariant must be empty, default, muted, or brand.'
            );
        }
    }

    addDuplicateSortOrderIssues(
        rawWorkbook,
        ['Heroes', 'Clients', 'Services', 'Features', 'Statistics', 'Testimonials', 'CommunityCards'],
        issues
    );

    const externalReferenceCodes = new Map<string, string>();

    for (const [sheet, records] of Object.entries(rawWorkbook)) {
        for (const record of records) {
            const externalReferenceCode = stringValue(record, 'externalReferenceCode');
            const normalized = externalReferenceCode.toLowerCase();

            if (!normalized) {
                continue;
            }

            const previousSheet = externalReferenceCodes.get(normalized);

            if (previousSheet) {
                addIssue(
                    issues,
                    sheet,
                    record,
                    `externalReferenceCode "${externalReferenceCode}" is duplicated in ${previousSheet} and ${sheet}.`
                );
            }
            else {
                externalReferenceCodes.set(normalized, sheet);
            }
        }
    }

    if (issues.some((issue) => issue.level === 'error')) {
        return {issues};
    }

    return {
        data: {
            clients: (rawWorkbook.Clients ?? []).map(normalizeClient),
            clientsIntro: (rawWorkbook.ClientsIntro ?? []).map(normalizeIntro),
            communityCards: (rawWorkbook.CommunityCards ?? []).map(normalizeCommunityCard),
            communityIntro: (rawWorkbook.CommunityIntro ?? []).map(normalizeIntro),
            cta: (rawWorkbook.CTA ?? []).map(normalizeCta),
            features: (rawWorkbook.Features ?? []).map(normalizeFeature),
            heroes: (rawWorkbook.Heroes ?? []).map(normalizeHero),
            services: (rawWorkbook.Services ?? []).map(normalizeService),
            servicesIntro: (rawWorkbook.ServicesIntro ?? []).map(normalizeIntro),
            statistics: (rawWorkbook.Statistics ?? []).map(normalizeStatistic),
            statisticsIntro: (rawWorkbook.StatisticsIntro ?? []).map(normalizeStatisticsIntro),
            testimonials: (rawWorkbook.Testimonials ?? []).map(normalizeTestimonial),
        },
        issues,
    };
}

export function assetBasename(path: string): string {
    return basename(path);
}
