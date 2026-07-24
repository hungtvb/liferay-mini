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
→ resolve the exact NXC_ARTICLE Structure by ERC
→ generate a folder-bound Excel template
→ enter Article data and existing Image Document ERCs
→ upload and validate the workbook
→ report row-level issues before mutation
→ preview StructuredContent JSON
→ choose INSERT/UPSERT and error strategy
→ revalidate folder, Structure, and images
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
- Exact Article Structure resolution by ERC.
- Folder lookup by External Reference Code.
- Root folder creation when the configured folder does not exist.
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
LIFERAY_ARTICLE_STRUCTURE_ERC=NXC_ARTICLE
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

The Structure ERC and folder ERC are stable identities. Names are display values only.

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

### Load Structures

```text
GET /o/headless-delivery/v1.0/sites/{siteId}/content-structures
GET /o/headless-delivery/v1.0/content-structures/{contentStructureId}
```

The importer exposes only the Structure whose `externalReferenceCode` equals `NXC_ARTICLE`.

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

```text
Structure ERC: NXC_ARTICLE

System properties:
- title
- externalReferenceCode
- datePublished
- friendlyUrlPath

Structure fields:
- body        rich text
- coverImage  image
```

`Article Title` and `External Reference Code` are StructuredContent system properties, not Structure fields.

There is no Structured Content `contentUrl` property in this contract. The `contentUrl` property exists only inside an Image value and points to the Documents and Media asset.

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
- Empty rows are ignored.
- An old template is rejected when the Structure fingerprint changes.
- A template is rejected when its target folder ERC differs from the current configuration.

## 9. Validation

### Mapping-level checks

- Every required target is mapped.
- Nested, repeatable, or unsupported field types are blocked.
- Workbook headers match the generated template exactly.
- Structure fingerprint matches the live Structure.
- Target folder ERC matches the live configuration.
- Live Structure ERC matches `NXC_ARTICLE`.

### Row-level checks

- Required value is empty.
- Boolean, number, or date cannot be parsed.
- Article ERC is duplicated within the workbook.
- Image ERC does not resolve to a Document.
- Document exists but is not an image.

### Mutation gate

```text
errors.length === 0
AND payload.length > 0
AND NXC_ARTICLE is resolved
AND target folder is resolved
AND every referenced image resolves to an image Document
```

Immediately before import, the server resolves the folder and Structure again, clears its Document cache, reruns validation, and submits only if the second validation passes.

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

## 11. Article delivery

The Home React section requests `NXC_ARTICLE` content using:

```text
GET /o/headless-delivery/v1.0/content-structures/{structureId}/structured-contents
    ?flatten=true
    &pageSize=100
```

It does not send `contentFields/sortOrder` because Article has no such field. It sorts by `datePublished` descending when no optional order field exists.

Card mapping:

```text
Title → StructuredContent.title
Image → contentFields.coverImage
Alt   → image.description → image.title → title
Slug  → StructuredContent.friendlyUrlPath
```

The Fragment passes the current Site display URL using `themeDisplay.getScopeGroup().getDisplayURL(...)`. React resolves the detail URL as:

```text
{siteDisplayURL}/w/{friendlyUrlPath}
```

Example:

```text
http://localhost:8080/web/nexcent-public-website/w/test-nexcent-article
```

The default Nexcent Article Display Page Template then renders the detail using the Nexcent Master Page.

## 12. Local API

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/api/config` | Return safe configuration |
| `POST` | `/api/connect` | Authenticate, resolve/create folder, and resolve NXC_ARTICLE |
| `GET` | `/api/structures/{id}` | Load the guarded Article Structure |
| `GET` | `/api/structures/{id}/template` | Generate folder-bound Excel template |
| `POST` | `/api/workbooks` | Parse and validate a workbook |
| `POST` | `/api/imports` | Revalidate and submit Batch Engine task |
| `GET` | `/api/imports/{taskId}` | Poll normalized task status |

## 13. Verification

Automated checks cover:

- JavaScript syntax;
- exact Structure ERC guarding;
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
- duplicate ERC and required-value errors;
- Article list `flatten=true` behavior;
- absence of server-side `sortOrder` for Article;
- friendly URL path based detail-link construction.

Runtime acceptance still requires the exact DXP 2026.Q1.1 instance:

1. OAuth2 permissions succeed.
2. Exact `NXC_ARTICLE` resolution succeeds.
3. Folder lookup and creation succeed.
4. Existing image ERCs resolve correctly.
5. Missing images block import with the expected row number.
6. Batch Engine accepts the Image payload shape.
7. Created Articles appear inside the configured folder.
8. Headless Delivery returns `friendlyUrlPath`.
9. Article cards open the expected Site `/w/{slug}` URL.
10. The default Article Display Page renders under Nexcent Master Page.
11. UPSERT behavior by Article ERC is verified.
12. No secret or access token appears in browser responses or logs.
