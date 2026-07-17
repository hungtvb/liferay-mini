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
    type FeatureRow,
    type HeroRow,
    type ImportResult,
    type MigrationWorkbook,
    type ServiceRow,
    type ServicesIntroRow,
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
    feature: ContentStructure;
    hero: ContentStructure;
    service: ContentStructure;
    servicesIntro: ContentStructure;
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
    const referencedPaths = new Set([
        ...workbook.heroes.map((item) => item.imageFile),
        ...workbook.services.map((item) => item.iconFile),
        ...workbook.features.map((item) => item.imageFile),
    ]);
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

function heroPayload(
    row: HeroRow,
    structure: ContentStructure,
    documents: Map<string, Document>
): StructuredContentPayload {
    const image = documents.get(row.imageFile);

    if (!image) {
        throw new Error(`Unable to resolve Hero asset "${row.imageFile}".`);
    }

    return {
        contentFields: [
            dataField('title', row.title),
            dataField('highlightedText', row.highlightedText),
            dataField('description', row.description),
            dataField('ctaLabel', row.ctaLabel),
            dataField('ctaUrl', row.ctaUrl),
            imageField('illustration', image),
            dataField('illustrationAlt', row.imageAlt),
            dataField('sortOrder', row.sortOrder),
            dataField('active', row.active),
        ],
        contentStructureId: structure.id,
        externalReferenceCode: row.externalReferenceCode,
        title: row.title,
    };
}

function servicesIntroPayload(
    row: ServicesIntroRow,
    structure: ContentStructure
): StructuredContentPayload {
    return {
        contentFields: [
            dataField('title', row.title),
            dataField('description', row.description),
            dataField('sortOrder', row.sortOrder),
            dataField('active', row.active),
        ],
        contentStructureId: structure.id,
        externalReferenceCode: row.externalReferenceCode,
        title: row.title,
    };
}

function servicePayload(
    row: ServiceRow,
    structure: ContentStructure,
    documents: Map<string, Document>
): StructuredContentPayload {
    const icon = documents.get(row.iconFile);

    if (!icon) {
        throw new Error(`Unable to resolve Service asset "${row.iconFile}".`);
    }

    return {
        contentFields: [
            dataField('title', row.title),
            dataField('descriptionHtml', row.descriptionHtml),
            imageField('icon', icon),
            dataField('iconAlt', row.iconAlt),
            dataField('targetUrl', row.targetUrl),
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
    const image = documents.get(row.imageFile);

    if (!image) {
        throw new Error(`Unable to resolve Feature asset "${row.imageFile}".`);
    }

    return {
        contentFields: [
            dataField('title', row.title),
            dataField('descriptionHtml', row.descriptionHtml),
            imageField('image', image),
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

async function resolveStructures(siteId: string): Promise<StructureMap> {
    const [hero, servicesIntro, service, feature] = await Promise.all([
        resolveContentStructure(siteId, 'NXC Landing Hero'),
        resolveContentStructure(siteId, 'NXC Services Intro'),
        resolveContentStructure(siteId, 'NXC Service Item'),
        resolveContentStructure(siteId, 'NXC Feature Item'),
    ]);

    return {feature, hero, service, servicesIntro};
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
    const jobs: Array<{
        payload: StructuredContentPayload;
        type: ImportResult['type'];
    }> = [
        ...workbook.heroes.map((row) => ({
            payload: heroPayload(row, structures.hero, documents),
            type: 'Hero' as const,
        })),
        ...workbook.servicesIntro.map((row) => ({
            payload: servicesIntroPayload(row, structures.servicesIntro),
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
    ];
    const results: ImportResult[] = [];

    for (const [index, job] of jobs.entries()) {
        onProgress?.(
            `Importing ${index + 1}/${jobs.length}: ${job.payload.title}`
        );
        results.push(
            await upsertStructuredContent(siteId, job.payload, job.type)
        );
    }

    onProgress?.(`Imported ${results.length} Web Content articles.`);

    return results;
}
