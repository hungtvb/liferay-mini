# Content Import Framework — Architecture and Extension Contract

Status: **DESIGN READY / IMPLEMENTATION AND RUNTIME QA PENDING**  
Target: **Liferay DXP 2026.Q1.1**

> **Implementation delta:** current source is Article-specific and still exposes a transitional multipart-XLSX endpoint. The generic profile registry, standard Documents API handoff, ZIP + assets pipeline, generic REST resources, and Site Administration App described here are target work and are not yet runtime-verified.

## 1. Decision

Build one reusable, site-scoped Content Import Framework. Article is the first fully implemented import profile, not the framework boundary.

- The final UI appears at Site Menu → Content & Data → Nexcent Content Import.
- Editors choose an import profile from a server-provided dropdown.
- One job executes exactly one profile and one package schema.
- Profiles own field mapping and validation; users never select an arbitrary Structure or enter a numeric ID.
- ZIP/package safety, Excel reading, media upload, job state, permissions, idempotency, logging, and error reporting are shared.
- Documents and Media owns binaries; the target Liferay content application owns content.
- Service Builder stores generic operational state only.
- REST Builder exposes profile discovery and generic job orchestration.
- Batch Engine remains a separate migration/deployment path for version-generated JSON/JSONT payloads.

## 2. Import profiles

Initial registry:

| Profile key | Display name | Target | Status |
|---|---|---|---|
| `NXC_ARTICLE_V1` | Article | Structured Web Content: `NXC-STRUCTURE-ARTICLE` | Required first implementation |
| `NXC_HERO_V1` | Hero Slide | Structured Web Content: `NXC-STRUCTURE-HERO` | Planned |
| `NXC_SERVICE_V1` | Service Item | Structured Web Content: `NXC-STRUCTURE-SERVICE` | Planned |
| `NXC_FEATURE_V1` | Feature Item | Structured Web Content: `NXC-STRUCTURE-FEATURE` | Planned |
| `NXC_TESTIMONIAL_V1` | Testimonial | Structured Web Content: `NXC-STRUCTURE-TESTIMONIAL` | Planned |
| `NXC_COMMUNITY_CARD_V1` | Community Card | Structured Web Content: `NXC-STRUCTURE-COMMUNITY-CARD` | Planned |
| `NXC_LANDING_CONTENT_V1` | Complete Landing Content | Explicit composite profile | Optional |

A profile is enabled only when its handler is registered and its prerequisites resolve in the current site. The API may return a disabled profile with actionable missing prerequisites.

Do not build a generic “inspect any Structure and guess Excel mapping” feature. Explicit versioned profiles provide deterministic validation, security, upgrade behavior, and repeatable migration.

## 3. Package contract

Every package contains:

```text
<profile>-import.zip
├── manifest.json
├── content.xlsx
└── assets/
    └── <binary files>
```

Example manifest:

```json
{
  "schemaVersion": "1.0",
  "importProfileKey": "NXC_ARTICLE_V1",
  "siteExternalReferenceCode": "NEXCENT-PUBLIC-WEBSITE",
  "mode": "UPSERT"
}
```

The selected UI profile, manifest profile, registered handler, workbook schema, and target site must agree. A mismatch fails validation before mutation.

Each profile defines its executable sheets and columns. The shared `Assets` sheet uses:

```text
assetKey,filePath,documentERC,title,altText,folderERC
```

Content sheets reference `assetKey`, never filenames, absolute paths, Base64 values, or numeric Liferay IDs.

One job cannot combine unrelated profiles. A deliberately versioned composite profile such as `NXC_LANDING_CONTENT_V1` may own multiple content sheets and their dependency order.

## 4. Handler SPI

```java
public interface ContentImportHandler {

    String getImportProfileKey();

    ContentImportProfile getProfile();

    ContentImportValidationResult validate(
        ContentImportPackage contentImportPackage,
        ContentImportContext contentImportContext);

    ContentImportExecutionResult execute(
        ValidatedContentImportPackage validatedContentImportPackage,
        ContentImportContext contentImportContext);
}
```

Implementations:

```text
ArticleContentImportHandler
HeroContentImportHandler
ServiceContentImportHandler
FeatureContentImportHandler
TestimonialContentImportHandler
CommunityCardContentImportHandler
LandingContentImportHandler
```

The OSGi registry is keyed by `importProfileKey`:

```java
ContentImportHandler handler =
    contentImportHandlerRegistry.getHandler(importProfileKey);
```

Duplicate profile keys fail component activation or registry binding. The REST resource never selects handlers with conditionals.

## 5. Shared services

```text
SafeZipPackageReader
ImportManifestParser
XlsxWorkbookReader
ContentImportHandlerRegistry
ContentImportProfileService
AssetPackageValidator
DocumentMediaImporter
ContentImportJobManager
ContentImportPermissionChecker
ContentImportErrorReportWriter
```

Shared validation includes ZIP traversal, symlink, duplicate entry, decompression bomb, MIME signature, size/count limits, checksum, manifest, site scope, permissions, formulas, macros, external links, and encrypted content.

Handlers add profile-specific field, locale, taxonomy, workflow, relationship, and business validation.

## 6. Generic Service Builder model

### `ImportJob`

Keep generic job fields and add:

| Field | Purpose |
|---|---|
| `importProfileKey` | Versioned handler/profile identity |
| `packageSchemaVersion` | Package contract version |
| `fileEntryId` | Restricted source ZIP |
| `jobKey` | Public stable job ERC |
| counts/status/audit | Durable orchestration state |

### `ImportJobItem`

Replace Article-specific identity with:

| Field | Purpose |
|---|---|
| `targetType` | `STRUCTURED_CONTENT`, `DOCUMENT`, or future supported type |
| `targetERC` | Stable target resource identity |
| `sheetName` | Workbook sheet |
| `rowNumber` | Workbook row |
| operation/result/severity/message | Generic row outcome |
| `payloadHash` | Idempotency |

The current `articleERC` column requires a Service Builder schema upgrade to `targetERC`; do not silently reinterpret it without an upgrade step and build-number bump.

## 7. Generic REST API

Base path: `/o/nexcent-training/v1.0`

```http
GET  /sites/{siteId}/content-import-profiles
POST /sites/{siteId}/content-import-jobs
GET  /sites/{siteId}/content-import-jobs
GET  /sites/{siteId}/content-import-jobs/{jobERC}
POST /sites/{siteId}/content-import-jobs/{jobERC}/validate
POST /sites/{siteId}/content-import-jobs/{jobERC}/execute
POST /sites/{siteId}/content-import-jobs/{jobERC}/retry
GET  /sites/{siteId}/content-import-jobs/{jobERC}/items
GET  /sites/{siteId}/content-import-jobs/{jobERC}/error-report
```

Profile discovery response:

```json
{
  "items": [
    {
      "key": "NXC_ARTICLE_V1",
      "name": "Article",
      "schemaVersion": "1.0",
      "enabled": true
    },
    {
      "key": "NXC_SERVICE_V1",
      "name": "Service Item",
      "schemaVersion": "1.0",
      "enabled": false,
      "disabledReasonCode": "STRUCTURE_NOT_FOUND"
    }
  ]
}
```

Create-job request after the ZIP is uploaded through the standard Documents API:

```json
{
  "externalReferenceCode": "NXC-CONTENT-IMPORT-20260722-001",
  "packageFileEntryId": 38201,
  "importProfileKey": "NXC_ARTICLE_V1"
}
```

REST Builder is an adapter. It validates authentication, site context, package ownership, and request shape, then delegates to `ContentImportJobManager`.

## 8. Site Administration App

The React MVC Portlet calls `GET /content-import-profiles` and builds the dropdown from the response. It never hard-codes profile options.

Required flow:

1. Select an enabled profile.
2. Download that profile's workbook/package template.
3. Choose a ZIP.
4. Upload it to the restricted D&M package folder.
5. Create the generic job with `packageFileEntryId` and `importProfileKey`.
6. Validate and review package, asset, and content results.
7. Execute, monitor, retry, and download errors.

The app is site-scoped, derives the current site from Liferay context, and never appears on the public page. The `Nexcent Content Importer` role controls access; Publish remains separate.

## 9. Extension procedure

To add a content type:

1. Define a versioned profile key and prerequisites.
2. Add workbook/template fixtures.
3. Implement one `ContentImportHandler`.
4. Register the handler in OSGi.
5. Add contract, negative, idempotency, permission, and clean-runtime tests.
6. Verify it appears automatically in profile discovery and the UI dropdown.
7. Capture runtime evidence before marking the profile enabled/verified.

Adding a handler must not require changes to the REST resource, job manager, ZIP reader, generic admin UI, or Service Builder schema.

## 10. Initial delivery scope

Phase 1 implements and runtime-verifies only `NXC_ARTICLE_V1`.

Phase 2 adds Hero, Service, Feature, Testimonial, and Community Card profiles one by one. The dropdown may show planned profiles as disabled only when the UI clearly explains their missing implementation/prerequisite; otherwise return enabled profiles only.

The framework is not complete merely because the generic interfaces compile. Article package upload, media-first execution, list/detail rendering, permissions, retry, and responsive Site Admin QA must pass first.
