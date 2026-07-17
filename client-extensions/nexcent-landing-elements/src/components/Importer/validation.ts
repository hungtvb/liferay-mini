import {
    type FeatureRow,
    type HeroRow,
    type MigrationWorkbook,
    type RawWorkbook,
    type ServiceRow,
    type ServicesIntroRow,
    type ValidationIssue,
} from './types';
import {REQUIRED_SHEETS} from './workbook';

type RecordValue = Record<string, unknown>;

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

    if (value === null || value === undefined) {
        return '';
    }

    return String(value).trim();
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

function addRequiredIssues(
    record: RecordValue,
    sheet: string,
    fields: string[],
    issues: ValidationIssue[]
) {
    for (const field of fields) {
        if (!stringValue(record, field)) {
            issues.push({
                level: 'error',
                message: `Required column "${field}" is empty.`,
                row: rowNumber(record),
                sheet,
            });
        }
    }
}

function addBaseIssues(
    record: RecordValue,
    sheet: string,
    issues: ValidationIssue[]
) {
    addRequiredIssues(
        record,
        sheet,
        ['externalReferenceCode', 'title', 'sortOrder', 'active'],
        issues
    );

    if (!Number.isFinite(numberValue(record, 'sortOrder'))) {
        issues.push({
            level: 'error',
            message: 'sortOrder must be a number.',
            row: rowNumber(record),
            sheet,
        });
    }

    if (booleanValue(record, 'active') === undefined) {
        issues.push({
            level: 'error',
            message: 'active must be true or false.',
            row: rowNumber(record),
            sheet,
        });
    }
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
        issues.push({
            level: 'error',
            message: `Asset "${assetPath}" was not selected.`,
            row: rowNumber(record),
            sheet,
        });
    }
}

function normalizeHero(record: RecordValue): HeroRow {
    return {
        active: booleanValue(record, 'active') ?? false,
        ctaLabel: stringValue(record, 'ctaLabel'),
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

function normalizeServicesIntro(record: RecordValue): ServicesIntroRow {
    return {
        active: booleanValue(record, 'active') ?? false,
        description: stringValue(record, 'description'),
        externalReferenceCode: stringValue(record, 'externalReferenceCode'),
        sortOrder: numberValue(record, 'sortOrder'),
        title: stringValue(record, 'title'),
    };
}

function normalizeService(record: RecordValue): ServiceRow {
    return {
        active: booleanValue(record, 'active') ?? false,
        descriptionHtml: stringValue(record, 'descriptionHtml'),
        externalReferenceCode: stringValue(record, 'externalReferenceCode'),
        iconAlt: stringValue(record, 'iconAlt'),
        iconFile: stringValue(record, 'iconFile'),
        sortOrder: numberValue(record, 'sortOrder'),
        targetUrl: stringValue(record, 'targetUrl'),
        title: stringValue(record, 'title'),
    };
}

function normalizeFeature(record: RecordValue): FeatureRow {
    return {
        active: booleanValue(record, 'active') ?? false,
        backgroundVariant: stringValue(record, 'backgroundVariant') as
            | 'silver'
            | 'white',
        ctaLabel: stringValue(record, 'ctaLabel'),
        ctaUrl: stringValue(record, 'ctaUrl'),
        descriptionHtml: stringValue(record, 'descriptionHtml'),
        externalReferenceCode: stringValue(record, 'externalReferenceCode'),
        imageAlt: stringValue(record, 'imageAlt'),
        imageFile: stringValue(record, 'imageFile'),
        imagePosition: stringValue(record, 'imagePosition') as 'left' | 'right',
        sortOrder: numberValue(record, 'sortOrder'),
        title: stringValue(record, 'title'),
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
        addBaseIssues(record, 'Heroes', issues);
        addRequiredIssues(
            record,
            'Heroes',
            ['description', 'imageFile', 'imageAlt'],
            issues
        );
        addAssetIssue(record, 'Heroes', 'imageFile', assetNames, issues);

        if (!isValidUrl(stringValue(record, 'ctaUrl'))) {
            issues.push({
                level: 'error',
                message: 'ctaUrl must be a relative, anchor, HTTP, or HTTPS URL.',
                row: rowNumber(record),
                sheet: 'Heroes',
            });
        }
    }

    for (const record of rawWorkbook.ServicesIntro ?? []) {
        addBaseIssues(record, 'ServicesIntro', issues);
        addRequiredIssues(record, 'ServicesIntro', ['description'], issues);
    }

    for (const record of rawWorkbook.Services ?? []) {
        addBaseIssues(record, 'Services', issues);
        addRequiredIssues(
            record,
            'Services',
            ['descriptionHtml', 'iconFile', 'iconAlt'],
            issues
        );
        addAssetIssue(record, 'Services', 'iconFile', assetNames, issues);

        if (SCRIPT_PATTERN.test(stringValue(record, 'descriptionHtml'))) {
            issues.push({
                level: 'error',
                message: 'descriptionHtml contains executable or unsafe markup.',
                row: rowNumber(record),
                sheet: 'Services',
            });
        }

        if (!isValidUrl(stringValue(record, 'targetUrl'))) {
            issues.push({
                level: 'error',
                message: 'targetUrl must be a relative, anchor, HTTP, or HTTPS URL.',
                row: rowNumber(record),
                sheet: 'Services',
            });
        }
    }

    for (const record of rawWorkbook.Features ?? []) {
        addBaseIssues(record, 'Features', issues);
        addRequiredIssues(
            record,
            'Features',
            [
                'descriptionHtml',
                'imageFile',
                'imageAlt',
                'imagePosition',
                'backgroundVariant',
            ],
            issues
        );
        addAssetIssue(record, 'Features', 'imageFile', assetNames, issues);

        if (!['left', 'right'].includes(stringValue(record, 'imagePosition'))) {
            issues.push({
                level: 'error',
                message: 'imagePosition must be left or right.',
                row: rowNumber(record),
                sheet: 'Features',
            });
        }

        if (
            !['white', 'silver'].includes(
                stringValue(record, 'backgroundVariant')
            )
        ) {
            issues.push({
                level: 'error',
                message: 'backgroundVariant must be white or silver.',
                row: rowNumber(record),
                sheet: 'Features',
            });
        }

        if (SCRIPT_PATTERN.test(stringValue(record, 'descriptionHtml'))) {
            issues.push({
                level: 'error',
                message: 'descriptionHtml contains executable or unsafe markup.',
                row: rowNumber(record),
                sheet: 'Features',
            });
        }

        if (!isValidUrl(stringValue(record, 'ctaUrl'))) {
            issues.push({
                level: 'error',
                message: 'ctaUrl must be a relative, anchor, HTTP, or HTTPS URL.',
                row: rowNumber(record),
                sheet: 'Features',
            });
        }
    }

    const externalReferenceCodes = new Map<string, string>();

    for (const [sheet, records] of Object.entries(rawWorkbook)) {
        for (const record of records) {
            const externalReferenceCode = stringValue(
                record,
                'externalReferenceCode'
            );
            const normalized = externalReferenceCode.toLowerCase();

            if (!normalized) {
                continue;
            }

            const previousSheet = externalReferenceCodes.get(normalized);

            if (previousSheet) {
                issues.push({
                    level: 'error',
                    message: `externalReferenceCode "${externalReferenceCode}" is duplicated in ${previousSheet} and ${sheet}.`,
                    row: rowNumber(record),
                    sheet,
                });
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
            features: (rawWorkbook.Features ?? []).map(normalizeFeature),
            heroes: (rawWorkbook.Heroes ?? []).map(normalizeHero),
            services: (rawWorkbook.Services ?? []).map(normalizeService),
            servicesIntro: (rawWorkbook.ServicesIntro ?? []).map(
                normalizeServicesIntro
            ),
        },
        issues,
    };
}

export function assetBasename(path: string): string {
    return basename(path);
}
