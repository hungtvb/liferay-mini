import {ApiError, portalFetch} from '../../api/http';
import {
    type ContentStructure,
    type ImageValue,
    type Page,
    type StructuredContent,
    resolveContentStructure,
} from '../../api/structuredContent';
import {assetBasename} from './validation';
import {
    type ClientRow,
    type CommunityCardRow,
    type CtaRow,
    type FeatureRow,
    type HeroRow,
    type ImportResult,
    type IntroMigrationRow,
    type MigrationWorkbook,
    type ServiceRow,
    type StatisticRow,
    type StatisticsIntroRow,
    type TestimonialRow,
} from './types';

type Document = ImageValue & {
    externalReferenceCode?: string;
    id: number;
    title: string;
};

type ContentFieldPayload = {
    contentFieldValue: {
        data?: boolean | number | string;
        image?: Document;
    };
    name: string;
};

type StructuredContentPayload = {
    contentFields: ContentFieldPayload[];
    contentStructureId: number;
    externalReferenceCode: string;
    title: string;
};

type StructureMap = {
    client: ContentStructure;
    clientsIntro: ContentStructure;
    communityCard: ContentStructure;
    communityIntro: ContentStructure;
    cta: ContentStructure;
    feature: ContentStructure;
    hero: ContentStructure;
    service: ContentStructure;
    servicesIntro: ContentStructure;
    statistic: ContentStructure;
    statisticsIntro: ContentStructure;
    testimonial: ContentStructure;
};

type ImportJob = {
    payload: StructuredContentPayload;
    type: ImportResult['type'];
};

function slug(value: string): string {
    return value
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .toUpperCase();
}

function dataField(
    name: string,
    data: boolean | number | string
): ContentFieldPayload {
    return {
        contentFieldValue: {data},
        name,
    };
}

function imageField(name: string, image: Document): ContentFieldPayload {
    return {
        contentFieldValue: {image},
        name,
    };
}

function requireDocument(
    documents: Map<string, Document>,
    assetPath: string,
    contentType: string
): Document {
    const document = documents.get(assetPath);

    if (!document) {
        throw new Error(`Unable to resolve ${contentType} asset "${assetPath}".`);
    }

    return document;
}

async function listDocuments(siteId: string): Promise<Document[]> {
    const page = await portalFetch<Page<Document>>(
        `/o/headless-delivery/v1.0/sites/${encodeURIComponent(siteId)}/documents?flatten=true&pageSize=200`
    );

    return page.items;
}

async function uploadDocument(siteId: string, file: File): Promise<Document> {
    const formData = new FormData();
    const externalReferenceCode = `NXC-ASSET-${slug(file.name)}`;

    formData.append('file', file, file.name);
    formData.append(
        'document',
        JSON.stringify({
            externalReferenceCode,
            title: file.name,
        })
    );

    return portalFetch<Document>(
        `/o/headless-delivery/v1.0/sites/${encodeURIComponent(siteId)}/documents`,
        {
            body: formData,
            method: 'POST',
        }
    );
}

async function resolveDocuments(
    siteId: string,
    workbook: MigrationWorkbook,
    assetFiles: File[]
): Promise<Map<string, Document>> {
    const referencedPaths = new Set(
        [
            ...workbook.heroes.map((item) => item.imageFile),
            ...workbook.clients.map((item) => item.logoFile),
            ...workbook.services.map((item) => item.iconFile),
            ...workbook.features.map((item) => item.imageFile),
            ...workbook.statistics.map((item) => item.iconFile),
            ...workbook.testimonials.map((item) => item.customerImageFile),
            ...workbook.communityCards.map((item) => item.thumbnailFile),
        ].filter(Boolean)
    );
    const selectedFiles = new Map(
        assetFiles.map((file) => [file.name.toLowerCase(), file])
    );
    const existingDocuments = await listDocuments(siteId);
    const documentsByTitle = new Map(
        existingDocuments.map((document) => [
            document.title.toLowerCase(),
            document,
        ])
    );
    const resolved = new Map<string, Document>();

    for (const assetPath of referencedPaths) {
        const fileName = assetBasename(assetPath);
        const key = fileName.toLowerCase();
        const existingDocument = documentsByTitle.get(key);

        if (existingDocument) {
            resolved.set(assetPath, existingDocument);
            continue;
        }

        const selectedFile = selectedFiles.get(key);

        if (!selectedFile) {
            throw new Error(`Asset "${assetPath}" was not selected.`);
        }

        const uploadedDocument = await uploadDocument(siteId, selectedFile);

        documentsByTitle.set(key, uploadedDocument);
        resolved.set(assetPath, uploadedDocument);
    }

    return resolved;
}

async function findStructuredContent(
    siteId: string,
    externalReferenceCode: string
): Promise<StructuredContent | undefined> {
    try {
        return await portalFetch<StructuredContent>(
            `/o/headless-delivery/v1.0/sites/${encodeURIComponent(siteId)}/structured-contents/by-external-reference-code/${encodeURIComponent(externalReferenceCode)}`
        );
    }
    catch (error: unknown) {
        if (error instanceof ApiError && error.status === 404) {
            return undefined;
        }

        throw error;
    }
}

async function upsertStructuredContent(
    siteId: string,
    payload: StructuredContentPayload,
    type: ImportResult['type']
): Promise<ImportResult> {
    const existing = await findStructuredContent(
        siteId,
        payload.externalReferenceCode
    );
    const path = existing
        ? `/o/headless-delivery/v1.0/sites/${encodeURIComponent(siteId)}/structured-contents/by-external-reference-code/${encodeURIComponent(payload.externalReferenceCode)}`
        : `/o/headless-delivery/v1.0/sites/${encodeURIComponent(siteId)}/structured-contents`;

    await portalFetch<StructuredContent>(path, {
        body: JSON.stringify(payload),
        method: existing ? 'PUT' : 'POST',
    });

    return {
        action: existing ? 'updated' : 'created',
        externalReferenceCode: payload.externalReferenceCode,
        title: payload.title,
        type,
    };
}

function introPayload(
    row: IntroMigrationRow,
    structure: ContentStructure,
    extraFields: ContentFieldPayload[] = []
): StructuredContentPayload {
    return {
        contentFields: [
            dataField('heading', row.heading),
            dataField('description', row.description),
            ...extraFields,
        ],
        contentStructureId: structure.id,
        externalReferenceCode: row.externalReferenceCode,
        title: row.heading,
    };
}

function heroPayload(
    row: HeroRow,
    structure: ContentStructure,
    documents: Map<string, Document>
): StructuredContentPayload {
    return {
        contentFields: [
            dataField('title', row.title),
            dataField('highlightedText', row.highlightedText),
            dataField('description', row.description),
            dataField('ctaLabel', row.ctaLabel),
            dataField('ctaUrl', row.ctaUrl),
            dataField('ctaTarget', row.ctaTarget),
            imageField(
                'illustration',
                requireDocument(documents, row.imageFile, 'Hero')
            ),
            dataField('illustrationAlt', row.imageAlt),
            dataField('sortOrder', row.sortOrder),
            dataField('active', row.active),
        ],
        contentStructureId: structure.id,
        externalReferenceCode: row.externalReferenceCode,
        title: row.title,
    };
}

function clientPayload(
    row: ClientRow,
    structure: ContentStructure,
    documents: Map<string, Document>
): StructuredContentPayload {
    return {
        contentFields: [
            dataField('name', row.name),
            imageField('logo', requireDocument(documents, row.logoFile, 'Client')),
            dataField('logoAlt', row.logoAlt),
            dataField('websiteUrl', row.websiteUrl),
            dataField('sortOrder', row.sortOrder),
            dataField('active', row.active),
        ],
        contentStructureId: structure.id,
        externalReferenceCode: row.externalReferenceCode,
        title: row.name,
    };
}

function servicePayload(
    row: ServiceRow,
    structure: ContentStructure,
    documents: Map<string, Document>
): StructuredContentPayload {
    return {
        contentFields: [
            dataField('title', row.title),
            dataField('description', row.description),
            imageField('icon', requireDocument(documents, row.iconFile, 'Service')),
            dataField('iconAlt', row.iconAlt),
            dataField('linkLabel', row.linkLabel),
            dataField('linkUrl', row.linkUrl),
            dataField('sortOrder', row.sortOrder),
            dataField('active', row.active),
        ],
        contentStructureId: structure.id,
        externalReferenceCode: row.externalReferenceCode,
        title: row.title,
    };
}

function featurePayload(
    row: FeatureRow,
    structure: ContentStructure,
    documents: Map<string, Document>
): StructuredContentPayload {
    return {
        contentFields: [
            dataField('title', row.title),
            dataField('descriptionHTML', row.descriptionHTML),
            imageField('image', requireDocument(documents, row.imageFile, 'Feature')),
            dataField('imageAlt', row.imageAlt),
            dataField('ctaLabel', row.ctaLabel),
            dataField('ctaUrl', row.ctaUrl),
            dataField('imagePosition', row.imagePosition),
            dataField('backgroundVariant', row.backgroundVariant),
            dataField('sortOrder', row.sortOrder),
            dataField('active', row.active),
        ],
        contentStructureId: structure.id,
        externalReferenceCode: row.externalReferenceCode,
        title: row.title,
    };
}

function statisticPayload(
    row: StatisticRow,
    structure: ContentStructure,
    documents: Map<string, Document>
): StructuredContentPayload {
    return {
        contentFields: [
            dataField('label', row.label),
            dataField('value', row.value),
            dataField('valueSuffix', row.valueSuffix),
            imageField('icon', requireDocument(documents, row.iconFile, 'Statistic')),
            dataField('iconAlt', row.iconAlt),
            dataField('sortOrder', row.sortOrder),
            dataField('active', row.active),
        ],
        contentStructureId: structure.id,
        externalReferenceCode: row.externalReferenceCode,
        title: row.label,
    };
}

function testimonialPayload(
    row: TestimonialRow,
    structure: ContentStructure,
    documents: Map<string, Document>
): StructuredContentPayload {
    return {
        contentFields: [
            dataField('quote', row.quote),
            dataField('customerName', row.customerName),
            dataField('customerRole', row.customerRole),
            dataField('customerCompany', row.customerCompany),
            imageField(
                'customerImage',
                requireDocument(documents, row.customerImageFile, 'Testimonial')
            ),
            dataField('customerImageAlt', row.customerImageAlt),
            dataField('ctaLabel', row.ctaLabel),
            dataField('ctaUrl', row.ctaUrl),
            dataField('sortOrder', row.sortOrder),
            dataField('active', row.active),
        ],
        contentStructureId: structure.id,
        externalReferenceCode: row.externalReferenceCode,
        title: row.customerName,
    };
}

function communityCardPayload(
    row: CommunityCardRow,
    structure: ContentStructure,
    documents: Map<string, Document>
): StructuredContentPayload {
    const publishedDateField = row.publishedDate
        ? [dataField('publishedDate', row.publishedDate)]
        : [];

    return {
        contentFields: [
            dataField('title', row.title),
            dataField('summary', row.summary),
            imageField(
                'thumbnail',
                requireDocument(documents, row.thumbnailFile, 'Community Card')
            ),
            dataField('thumbnailAlt', row.thumbnailAlt),
            dataField('targetUrl', row.targetUrl),
            ...publishedDateField,
            dataField('sortOrder', row.sortOrder),
            dataField('active', row.active),
        ],
        contentStructureId: structure.id,
        externalReferenceCode: row.externalReferenceCode,
        title: row.title,
    };
}

function ctaPayload(
    row: CtaRow,
    structure: ContentStructure
): StructuredContentPayload {
    return {
        contentFields: [
            dataField('heading', row.heading),
            dataField('ctaLabel', row.ctaLabel),
            dataField('ctaUrl', row.ctaUrl),
            dataField('ctaTarget', row.ctaTarget),
            dataField('backgroundVariant', row.backgroundVariant),
            dataField('active', row.active),
        ],
        contentStructureId: structure.id,
        externalReferenceCode: row.externalReferenceCode,
        title: row.heading,
    };
}

async function resolveStructures(siteId: string): Promise<StructureMap> {
    const [
        hero,
        clientsIntro,
        client,
        servicesIntro,
        service,
        feature,
        statisticsIntro,
        statistic,
        testimonial,
        communityIntro,
        communityCard,
        cta,
    ] = await Promise.all([
        resolveContentStructure(siteId, 'NXC Landing Hero'),
        resolveContentStructure(siteId, 'NXC Clients Intro'),
        resolveContentStructure(siteId, 'NXC Client Logo'),
        resolveContentStructure(siteId, 'NXC Services Intro'),
        resolveContentStructure(siteId, 'NXC Service Item'),
        resolveContentStructure(siteId, 'NXC Feature Item'),
        resolveContentStructure(siteId, 'NXC Statistics Intro'),
        resolveContentStructure(siteId, 'NXC Statistic Item'),
        resolveContentStructure(siteId, 'NXC Testimonial'),
        resolveContentStructure(siteId, 'NXC Community Intro'),
        resolveContentStructure(siteId, 'NXC Community Card'),
        resolveContentStructure(siteId, 'NXC CTA'),
    ]);

    return {
        client,
        clientsIntro,
        communityCard,
        communityIntro,
        cta,
        feature,
        hero,
        service,
        servicesIntro,
        statistic,
        statisticsIntro,
        testimonial,
    };
}

export async function importMigrationWorkbook(
    siteId: string,
    workbook: MigrationWorkbook,
    assetFiles: File[],
    onProgress?: (message: string) => void
): Promise<ImportResult[]> {
    onProgress?.('Resolving Web Content Structures...');
    const structures = await resolveStructures(siteId);

    onProgress?.('Resolving and uploading Documents and Media assets...');
    const documents = await resolveDocuments(siteId, workbook, assetFiles);
    const jobs: ImportJob[] = [
        ...workbook.heroes.map((row) => ({
            payload: heroPayload(row, structures.hero, documents),
            type: 'Hero' as const,
        })),
        ...workbook.clientsIntro.map((row) => ({
            payload: introPayload(row, structures.clientsIntro),
            type: 'Clients Intro' as const,
        })),
        ...workbook.clients.map((row) => ({
            payload: clientPayload(row, structures.client, documents),
            type: 'Client' as const,
        })),
        ...workbook.servicesIntro.map((row) => ({
            payload: introPayload(row, structures.servicesIntro),
            type: 'Services Intro' as const,
        })),
        ...workbook.services.map((row) => ({
            payload: servicePayload(row, structures.service, documents),
            type: 'Service' as const,
        })),
        ...workbook.features.map((row) => ({
            payload: featurePayload(row, structures.feature, documents),
            type: 'Feature' as const,
        })),
        ...workbook.statisticsIntro.map((row: StatisticsIntroRow) => ({
            payload: introPayload(row, structures.statisticsIntro, [
                dataField('highlightedText', row.highlightedText),
            ]),
            type: 'Statistics Intro' as const,
        })),
        ...workbook.statistics.map((row) => ({
            payload: statisticPayload(row, structures.statistic, documents),
            type: 'Statistic' as const,
        })),
        ...workbook.testimonials.map((row) => ({
            payload: testimonialPayload(row, structures.testimonial, documents),
            type: 'Testimonial' as const,
        })),
        ...workbook.communityIntro.map((row) => ({
            payload: introPayload(row, structures.communityIntro),
            type: 'Community Intro' as const,
        })),
        ...workbook.communityCards.map((row) => ({
            payload: communityCardPayload(row, structures.communityCard, documents),
            type: 'Community Card' as const,
        })),
        ...workbook.cta.map((row) => ({
            payload: ctaPayload(row, structures.cta),
            type: 'CTA' as const,
        })),
    ];
    const results: ImportResult[] = [];

    for (const [index, job] of jobs.entries()) {
        onProgress?.(
            `Importing ${index + 1}/${jobs.length}: ${job.payload.title}`
        );
        try {
            results.push(
                await upsertStructuredContent(siteId, job.payload, job.type)
            );
        }
        catch (error: unknown) {
            results.push({
                action: 'failed',
                externalReferenceCode: job.payload.externalReferenceCode,
                message:
                    error instanceof Error
                        ? error.message
                        : 'Unknown import error.',
                title: job.payload.title,
                type: job.type,
            });
        }
    }

    const failureCount = results.filter(
        (result) => result.action === 'failed'
    ).length;

    onProgress?.(
        failureCount
            ? `Processed ${results.length} articles with ${failureCount} failure(s).`
            : `Imported ${results.length} Web Content articles.`
    );

    return results;
}
