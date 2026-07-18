import {readFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

import {describe, expect, it} from 'vitest';

import {type RawWorkbook} from './types';
import {validateWorkbook} from './validation';

type SourceData = Record<string, Array<Record<string, unknown>>>;

const projectDirectory = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    '../../..'
);
const source = JSON.parse(
    readFileSync(
        path.resolve(projectDirectory, '../../sample-data/json/landing-content.json'),
        'utf8'
    )
) as SourceData;

function rawWorkbook(): RawWorkbook {
    return {
        CTA: structuredClone(source.cta),
        Clients: structuredClone(source.clients),
        ClientsIntro: structuredClone(source.clientsIntro),
        CommunityCards: structuredClone(source.communityCards),
        CommunityIntro: structuredClone(source.communityIntro),
        Features: structuredClone(source.features),
        Heroes: structuredClone(source.hero),
        Services: structuredClone(source.services),
        ServicesIntro: structuredClone(source.servicesIntro),
        Statistics: structuredClone(source.statistics),
        StatisticsIntro: structuredClone(source.statisticsIntro),
        Testimonials: structuredClone(source.testimonials),
    };
}

function assetFiles(workbook: RawWorkbook): File[] {
    const assetFields = new Set([
        'customerImageFile',
        'iconFile',
        'imageFile',
        'logoFile',
        'thumbnailFile',
    ]);
    const names = new Set<string>();

    for (const records of Object.values(workbook)) {
        for (const record of records) {
            for (const [field, value] of Object.entries(record)) {
                if (assetFields.has(field) && typeof value === 'string') {
                    names.add(value.split('/').at(-1) ?? value);
                }
            }
        }
    }

    return Array.from(names, (name) => new File([], name));
}

describe('validateWorkbook', () => {
    it('accepts the complete 12-sheet landing-page contract', () => {
        const workbook = rawWorkbook();
        const result = validateWorkbook(workbook, assetFiles(workbook));

        expect(result.issues).toEqual([]);
        expect(result.data).toBeDefined();
        expect(
            result.data &&
                Object.values(result.data).reduce(
                    (total, records) => total + records.length,
                    0
                )
        ).toBe(22);
    });

    it('blocks missing referenced assets before mutation', () => {
        const workbook = rawWorkbook();
        const files = assetFiles(workbook).filter(
            (file) => file.name !== 'hero-illustration.svg'
        );
        const result = validateWorkbook(workbook, files);

        expect(result.data).toBeUndefined();
        expect(result.issues.some((issue) => issue.message.includes('hero-illustration.svg'))).toBe(true);
    });

    it('blocks partial CTA pairs and unsafe rich text', () => {
        const workbook = rawWorkbook();

        workbook.Features[0].ctaUrl = '';
        workbook.Features[1].descriptionHTML = '<script>alert(1)</script>';

        const result = validateWorkbook(workbook, assetFiles(workbook));

        expect(result.issues.some((issue) => issue.message.includes('must either both be set'))).toBe(true);
        expect(result.issues.some((issue) => issue.message.includes('unsafe markup'))).toBe(true);
    });

    it('blocks duplicate ERC and sort order values', () => {
        const workbook = rawWorkbook();

        workbook.Clients[1].sortOrder = workbook.Clients[0].sortOrder;
        workbook.Clients[1].externalReferenceCode =
            workbook.Heroes[0].externalReferenceCode;

        const result = validateWorkbook(workbook, assetFiles(workbook));

        expect(result.issues.some((issue) => issue.message.includes('sortOrder 1 is duplicated'))).toBe(true);
        expect(result.issues.some((issue) => issue.message.includes('is duplicated in'))).toBe(true);
    });
});
