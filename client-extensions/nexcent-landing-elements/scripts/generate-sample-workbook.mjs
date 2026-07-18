import ExcelJS from 'exceljs';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

const projectDirectory = path.dirname(
    path.dirname(fileURLToPath(import.meta.url))
);
const repositoryRoot = path.resolve(projectDirectory, '../..');
const inputPath = path.join(
    repositoryRoot,
    'sample-data/json/landing-content.json'
);
const outputPath = path.join(
    repositoryRoot,
    'sample-data/excel/nexcent-content.xlsx'
);
const source = JSON.parse(await readFile(inputPath, 'utf8'));
const workbook = new ExcelJS.Workbook();

workbook.creator = 'Liferay Mini Project Lab';
workbook.created = new Date('2026-07-18T00:00:00Z');
workbook.modified = new Date('2026-07-18T00:00:00Z');

function addSheet(name, columns, rows) {
    const worksheet = workbook.addWorksheet(name, {
        views: [{state: 'frozen', ySplit: 1}],
    });

    worksheet.columns = columns.map((key) => ({
        header: key,
        key,
        width: Math.max(14, key.length + 2),
    }));
    worksheet.addRows(rows);
    worksheet.getRow(1).font = {bold: true};
    worksheet.getRow(1).alignment = {vertical: 'middle'};
    worksheet.autoFilter = {
        from: {column: 1, row: 1},
        to: {column: columns.length, row: Math.max(1, rows.length + 1)},
    };

    for (const column of worksheet.columns) {
        let width = column.width ?? 14;

        column.eachCell?.({includeEmpty: false}, (cell) => {
            width = Math.min(
                60,
                Math.max(width, String(cell.value ?? '').length + 2)
            );
        });
        column.width = width;
    }
}

const instructions = workbook.addWorksheet('Instructions');
instructions.columns = [
    {header: 'Item', key: 'item', width: 24},
    {header: 'Guidance', key: 'guidance', width: 90},
];
instructions.addRows([
    {
        item: 'Required sheets',
        guidance:
            'Heroes, ClientsIntro, Clients, ServicesIntro, Services, Features, StatisticsIntro, Statistics, Testimonials, CommunityIntro, CommunityCards, CTA. Do not rename headers.',
    },
    {
        item: 'Assets',
        guidance:
            'Select every referenced file in Nexcent Content Importer. Paths may include assets/, but matching uses the filename.',
    },
    {
        item: 'External reference codes',
        guidance:
            'Values must be unique across every sheet. Reusing the same workbook updates existing Web Content instead of creating duplicates.',
    },
    {
        item: 'HTML',
        guidance:
            'Only Features.descriptionHTML accepts editorial HTML. Scripts, event handlers, and javascript: URLs are rejected.',
    },
    {
        item: 'Links',
        guidance:
            'Optional label and URL fields must be provided together. Targets are empty, _self, or _blank.',
    },
    {
        item: 'Boolean values',
        guidance: 'Use true or false.',
    },
]);
instructions.getRow(1).font = {bold: true};

addSheet(
    'Heroes',
    [
        'externalReferenceCode',
        'title',
        'highlightedText',
        'description',
        'ctaLabel',
        'ctaUrl',
        'ctaTarget',
        'imageFile',
        'imageAlt',
        'sortOrder',
        'active',
    ],
    source.hero
);

addSheet(
    'ClientsIntro',
    ['externalReferenceCode', 'heading', 'description'],
    source.clientsIntro
);

addSheet(
    'Clients',
    [
        'externalReferenceCode',
        'name',
        'logoFile',
        'logoAlt',
        'websiteUrl',
        'sortOrder',
        'active',
    ],
    source.clients
);

addSheet(
    'ServicesIntro',
    ['externalReferenceCode', 'heading', 'description'],
    source.servicesIntro
);

addSheet(
    'Services',
    [
        'externalReferenceCode',
        'title',
        'description',
        'iconFile',
        'iconAlt',
        'linkLabel',
        'linkUrl',
        'sortOrder',
        'active',
    ],
    source.services
);

addSheet(
    'Features',
    [
        'externalReferenceCode',
        'title',
        'descriptionHTML',
        'imageFile',
        'imageAlt',
        'ctaLabel',
        'ctaUrl',
        'imagePosition',
        'backgroundVariant',
        'sortOrder',
        'active',
    ],
    source.features
);

addSheet(
    'StatisticsIntro',
    ['externalReferenceCode', 'heading', 'highlightedText', 'description'],
    source.statisticsIntro
);

addSheet(
    'Statistics',
    [
        'externalReferenceCode',
        'label',
        'value',
        'valueSuffix',
        'iconFile',
        'iconAlt',
        'sortOrder',
        'active',
    ],
    source.statistics
);

addSheet(
    'Testimonials',
    [
        'externalReferenceCode',
        'quote',
        'customerName',
        'customerRole',
        'customerCompany',
        'customerImageFile',
        'customerImageAlt',
        'ctaLabel',
        'ctaUrl',
        'sortOrder',
        'active',
    ],
    source.testimonials
);

addSheet(
    'CommunityIntro',
    ['externalReferenceCode', 'heading', 'description'],
    source.communityIntro
);

addSheet(
    'CommunityCards',
    [
        'externalReferenceCode',
        'title',
        'summary',
        'thumbnailFile',
        'thumbnailAlt',
        'targetUrl',
        'publishedDate',
        'sortOrder',
        'active',
    ],
    source.communityCards
);

addSheet(
    'CTA',
    [
        'externalReferenceCode',
        'heading',
        'ctaLabel',
        'ctaUrl',
        'ctaTarget',
        'backgroundVariant',
        'active',
    ],
    source.cta
);

await workbook.xlsx.writeFile(outputPath);
console.log(`Generated ${outputPath}`);
