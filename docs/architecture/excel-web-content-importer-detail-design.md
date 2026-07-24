# Excel Web Content Importer — Detailed Design

Status: **SOURCE IMPLEMENTED / LIFERAY RUNTIME PENDING**  
Target: **Liferay DXP 2026.Q1.1 LTS**  
Branch: **`feat/excel-web-content-importer`**  
Implementation: **`tools/liferay-article-importer`**

## 1. Goal

Build a small local JavaScript utility that imports Web Content Articles from a Structure-driven Excel workbook into one configured Liferay Site and Web Content folder.

```text
Connect with OAuth2 Client Credentials
→ resolve or create the configured Web Content folder
→ load Site Content Structures
→ select the Article Structure
→ generate a folder-bound Excel template
→ enter Article data and existing Image Document ERCs
→ upload and validate the workbook
→ report row-level issues before mutation
→ preview StructuredContent JSON
→ choose INSERT/UPSERT and error strategy
→ revalidate folder and images
→ submit one Headless Batch Engine ImportTask
→ poll until terminal status
```

The utility does not use Service Builder, REST Builder, a portlet, or browser-side OAuth secrets.

## 2. Architecture

```text
Browser UI
HTML + CSS + JavaScript
        │
        │ same-origin /api
        ▼
Local Node.js server
Express + ExcelJS + Multer
        │
        ├── OAuth2 Client Credentials
        ├── Headless Delivery
        │   ├── Content Structures
        │   ├── Structured Content Folders
        │   └── Documents by ERC
        └── Headless Batch Engine
                │
                ▼
          Liferay DXP
```

The Node process owns the OAuth2 client secret and access token. The browser receives only safe environment metadata, validation results, and Batch Engine status.

## 3. Scope

### Included

- One configured Liferay Site per process.
- One configured target Web Content folder.
- Folder lookup by External Reference Code.
- Root folder creation when the configured folder does not exist.
- Dynamic Content Structure discovery.
- Structure-driven `.xlsx` template generation.
- Required `title` and `externalReferenceCode` system fields.
- Scalar string, rich text, number, boolean, and date fields.
- Non-repeatable Image fields referencing existing Documents by ERC.
- Structure fingerprint and target-folder binding in hidden workbook Metadata.
- Workbook-wide validation before mutation.
- Row-level errors for missing and non-image Documents.
- JSON preview, copy, and download.
- `INSERT` or `UPSERT` create strategy.
- `ON_ERROR_FAIL` or `ON_ERROR_CONTINUE` import strategy.
- Batch Engine submission and polling.

### Excluded

- Image upload.
- Documents and Media folder creation.
- Generic Document fields.
- Nested fields and fieldsets.
- Repeatable fields.
- Relationships, geolocation, and grid fields.
- Multiple Sites or locales in one workbook.
- Taxonomy assignment.
- Persistent local import history.
- Custom queue, worker, or retry engine.

## 4. Configuration

Required `.env` values:

```dotenv
LIFERAY_BASE_URL=http://localhost:8080
LIFERAY_SITE_ID=20117
LIFERAY_ARTICLE_FOLDER_ERC=NXC_ARTICLES
LIFERAY_ARTICLE_FOLDER_NAME=Articles
LIFERAY_OAUTH_CLIENT_ID=your-client-id
LIFERAY_OAUTH_CLIENT_SECRET=your-client-secret
```

Optional values:

```dotenv
PORT=4174
LIFERAY_LOCALE=en-US
IMAGE_LOOKUP_CONCURRENCY=8
BATCH_POLL_INTERVAL_MS=1500
BATCH_POLL_TIMEOUT_MS=600000
MAX_UPLOAD_MB=10
MAX_IMPORT_ROWS=5000
SESSION_TTL_MS=1800000
```

The folder ERC is the stable folder identity. The folder name is used only when the folder must be created.

## 5. OAuth2 permissions

Use Client Credentials for a Liferay user that can:

- read Content Structures;
- read Documents and Media entries;
- read and create Web Content folders;
- create or update Web Content;
- create and read Batch Engine import tasks.

Scopes:

```text
Liferay.Headless.Delivery.everything
Liferay.Headless.Batch.Engine.everything
```

## 6. External APIs

### Authentication

```text
POST /o/oauth2/token
```

### Resolve or create target folder

```text
GET  /o/headless-delivery/v1.0/sites/{siteId}/structured-content-folders/by-external-reference-code/{folderERC}
POST /o/headless-delivery/v1.0/sites/{siteId}/structured-content-folders
```

Creation body:

```json
{
  "externalReferenceCode": "NXC_ARTICLES",
  "name": "Articles"
}
```

### Load Structures

```text
GET /o/headless-delivery/v1.0/sites/{siteId}/content-structures
GET /o/headless-delivery/v1.0/content-structures/{contentStructureId}
```

### Resolve images

```text
GET /o/headless-delivery/v1.0/sites/{siteId}/documents/by-external-reference-code/{documentERC}
```

A `404` is normalized to `null` and becomes a row validation error. A returned Document must have an ID and an `encodingFormat` beginning with `image/`.

### Submit and poll Batch Engine

```text
POST /o/headless-batch-engine/v1.0/import-task/com.liferay.headless.delivery.dto.v1_0.StructuredContent
    ?siteId={siteId}
    &createStrategy={INSERT|UPSERT}
    &importStrategy={ON_ERROR_FAIL|ON_ERROR_CONTINUE}

GET /o/headless-batch-engine/v1.0/import-task/{taskId}
```

## 7. Article Structure contract

Current target Structure:

```text
NXC Article
├── Body        rich text   fieldReference: body
└── Cover Image image       fieldReference: coverImage
```

`Article Title` and `External Reference Code` are StructuredContent system properties, not Structure fields.

## 8. Workbook contract

Sheets:

```text
Articles     Data entry
Field Guide  Field reference, type, required flag, and notes
Metadata     Very hidden Structure and folder binding
```

Expected current columns:

```text
Article Title *
External Reference Code *
Body * [body]
Cover Image * ERC [coverImage]
```

Rules:

- Do not rename, add, remove, or reorder columns.
- Image cells contain existing Document ERCs, not filenames or URLs.
- The first row is the header.
- Empty rows are ignored.
- An old template is rejected when the Structure fingerprint changes.
- A template is rejected when its target folder ERC differs from the current configuration.

Metadata includes:

```text
templateVersion
structureId
structureExternalReferenceCode
structureFingerprint
targetFolderId
targetFolderExternalReferenceCode
targetFolderName
generatedAt
defaultLocale
```

## 9. Validation

### Mapping-level checks

- Every required target is mapped.
- Nested, repeatable, or unsupported field types are blocked.
- Workbook headers match the generated template exactly.
- Structure fingerprint matches the live Structure.
- Target folder ERC matches the live configuration.

### Row-level checks

- Required value is empty.
- Boolean, number, or date cannot be parsed.
- Article ERC is duplicated within the workbook.
- Image ERC does not resolve to a Document.
- Document exists but is not an image.

Missing image example:

```text
Excel row 12 · content.coverImage
Image with Document external reference code “NXC-IMAGE-404” does not exist in the configured Site
```

### Mutation gate

```text
errors.length === 0
AND payload.length > 0
AND target folder is resolved
AND every referenced image resolves to an image Document
```

The importer rejects the whole workbook when any preflight error exists. It does not submit only the valid rows.

Immediately before import, the server resolves the folder again, clears its Document cache, reruns validation, and submits only if the second validation passes.

## 10. Payload generation

Each valid Excel row becomes one item:

```json
{
  "externalReferenceCode": "NXC-ARTICLE-001",
  "title": "First Article",
  "contentStructureId": 12345,
  "structuredContentFolderId": 67890,
  "contentFields": [
    {
      "name": "body",
      "contentFieldValue": {
        "data": "<p>Article body</p>"
      }
    },
    {
      "name": "coverImage",
      "contentFieldValue": {
        "image": {
          "id": 45678,
          "title": "cover.png",
          "description": "Article cover",
          "encodingFormat": "image/png",
          "contentUrl": "/documents/..."
        }
      }
    }
  ]
}
```

Blank optional fields are omitted. Content field order follows the Structure order.

## 11. Local API

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/api/config` | Return safe configuration |
| `POST` | `/api/connect` | Authenticate, resolve/create folder, and load Structures |
| `GET` | `/api/structures/{id}` | Load one Structure and derived field support |
| `GET` | `/api/structures/{id}/template` | Generate folder-bound Excel template |
| `POST` | `/api/workbooks` | Parse and validate a workbook |
| `POST` | `/api/imports` | Revalidate and submit Batch Engine task |
| `GET` | `/api/imports/{taskId}` | Poll normalized task status |

## 12. Temporary state

Workbook data, mapping, validation output, resolved folder, and task ID are held in memory with sliding expiration. Restarting the local server clears all sessions. Secrets and access tokens are never stored in workbook sessions.

## 13. Verification

Automated checks cover:

- JavaScript syntax;
- normalization and deterministic mapping;
- Image ERC template columns;
- unsupported nested and repeatable fields;
- folder creation when lookup returns `404`;
- Document lookup caching;
- folder-bound Metadata;
- Structure fingerprinting;
- scalar conversion;
- `structuredContentFolderId` payload generation;
- image payload generation;
- row-level missing-image errors;
- duplicate ERC and required-value errors.

Runtime acceptance still requires the exact DXP 2026.Q1.1 instance:

1. OAuth2 permissions succeed.
2. Folder lookup and creation succeed.
3. Real Article Structure metadata matches the expected fields.
4. Existing image ERCs resolve correctly.
5. Missing images block import with the expected row number.
6. Batch Engine accepts the Image payload shape.
7. Created Articles appear inside the configured folder.
8. UPSERT behavior by Article ERC is verified.
9. No secret or access token appears in browser responses or logs.

Current evidence:

```text
SOURCE IMPLEMENTED
SYNTAX CHECKED
UNIT TESTED
LIFERAY RUNTIME PENDING
```
