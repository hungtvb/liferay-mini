# Nexcent Local Article Importer

A local Node.js migration utility with a plain HTML/CSS/JavaScript UI for importing Liferay Web Content Articles from an Excel template generated from the live Content Structure.

## Flow

```text
Connect with OAuth2 client credentials
→ resolve the configured Web Content folder by ERC
→ create the folder at Site root when it does not exist
→ load Content Structures from the configured Site
→ select the Article Structure
→ generate and download the Excel template
→ fill the Articles sheet without changing headers
→ use existing Documents and Media ERCs for Image fields
→ upload the completed template
→ validate Structure, folder, rows, and every image reference
→ preview StructuredContent JSON
→ choose INSERT/UPSERT and ON_ERROR_FAIL/ON_ERROR_CONTINUE
→ revalidate folder and images immediately before mutation
→ submit the Headless Batch Engine import
→ poll ImportTask until terminal status
```

The OAuth2 client secret and access token remain server-side. The tool does not upload images.

## Target folder contract

All imported Articles are assigned to one configured Web Content folder.

```dotenv
LIFERAY_ARTICLE_FOLDER_ERC=NXC_ARTICLES
LIFERAY_ARTICLE_FOLDER_NAME=Articles
```

The folder ERC is the stable identity:

1. `Connect` looks up the folder by ERC in the configured Site.
2. When it is missing, the tool creates it at the Site root using the configured name.
3. The generated workbook stores the target folder ERC and ID in hidden Metadata.
4. Validation rejects a workbook generated for a different folder.
5. The payload includes `structuredContentFolderId` for every Article.
6. The folder is resolved again immediately before Batch Engine submission.

## Image contract

Image fields in the selected Structure become Excel columns such as:

```text
Cover Image * ERC [coverImage]
```

Each cell must contain the **External Reference Code of an existing Document** in the configured Site's Documents and Media repository.

During validation, the tool:

- resolves each unique Document ERC through Headless Delivery;
- caches duplicate references within the validation pass;
- verifies that the Document exists;
- verifies that `encodingFormat` starts with `image/`;
- reports missing or non-image Documents against the exact Excel row;
- blocks the entire workbook while any validation error exists;
- resolves all images again immediately before import to reduce stale-validation risk.

The tool does not search by filename because filenames are not guaranteed to be unique or stable.

## Template contract

Each generated workbook contains:

```text
Articles     User data entry sheet
Field Guide  Field reference, type, required flag, and format notes
Metadata     Very hidden Structure fingerprint and target folder binding
```

For the current `NXC Article` Structure, the expected columns are:

```text
Article Title *
External Reference Code *
Body * [body]
Cover Image * ERC [coverImage]
```

Do not rename, add, remove, or reorder columns. The field reference in `[]` is the stable mapping key. When the Structure or target folder changes, generate a fresh template.

The template includes one sample row. Replace or delete it before the real migration.

## Scope

Included:

- dynamic Content Structure discovery;
- automatic target-folder lookup and creation;
- Structure-driven Excel generation;
- scalar text/HTML, number, boolean, and date fields;
- non-repeatable Image fields referencing existing Documents by ERC;
- required title/ERC validation;
- duplicate Article ERC detection;
- row-level missing-image and non-image errors;
- Structure fingerprint and target-folder workbook binding;
- JSON preview, copy, and download;
- exactly two migration options:
  - `INSERT` or `UPSERT`;
  - `ON_ERROR_FAIL` or `ON_ERROR_CONTINUE`;
- Batch Engine progress and failed-item display.

Not included:

- image upload;
- Documents and Media folder creation;
- generic Document fields;
- nested or repeatable fields;
- relationships, geolocation, or grid fields;
- multi-locale or multi-sheet import;
- persistent local history.

## Liferay OAuth2 setup

Create an OAuth2 application in **Control Panel → Security → OAuth 2 Administration** using Client Credentials. Select a Liferay user that can:

- read Content Structures;
- read Documents and Media entries;
- read and create Web Content folders;
- create or update Web Content;
- create and read Batch Engine import tasks.

Required scopes:

```text
Liferay.Headless.Delivery.everything
Liferay.Headless.Batch.Engine.everything
```

No browser-to-Liferay CORS configuration is required because the browser calls only the local Node server.

## Configuration

```bash
cd tools/liferay-article-importer
cp .env.example .env
```

Required values:

```dotenv
LIFERAY_BASE_URL=http://localhost:8080
LIFERAY_SITE_ID=20117
LIFERAY_ARTICLE_FOLDER_ERC=NXC_ARTICLES
LIFERAY_ARTICLE_FOLDER_NAME=Articles
LIFERAY_OAUTH_CLIENT_ID=your-client-id
LIFERAY_OAUTH_CLIENT_SECRET=your-client-secret
```

Optional values include:

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

Never commit the populated `.env` file.

## Run

```bash
npm install
npm run check
npm test
npm start
```

Open:

```text
http://127.0.0.1:4174
```

## Generated payload

A valid row becomes a `StructuredContent` item similar to:

```json
{
  "externalReferenceCode": "NXC-ARTICLE-001",
  "title": "First article",
  "contentStructureId": 12345,
  "structuredContentFolderId": 67890,
  "contentFields": [
    {
      "name": "body",
      "contentFieldValue": {
        "data": "<p>Article content</p>"
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

## Liferay API calls

```text
POST /o/oauth2/token
GET  /o/headless-delivery/v1.0/sites/{siteId}/structured-content-folders/by-external-reference-code/{folderERC}
POST /o/headless-delivery/v1.0/sites/{siteId}/structured-content-folders
GET  /o/headless-delivery/v1.0/sites/{siteId}/content-structures
GET  /o/headless-delivery/v1.0/content-structures/{contentStructureId}
GET  /o/headless-delivery/v1.0/sites/{siteId}/documents/by-external-reference-code/{documentERC}
POST /o/headless-batch-engine/v1.0/import-task/com.liferay.headless.delivery.dto.v1_0.StructuredContent?siteId={siteId}&createStrategy={INSERT|UPSERT}&importStrategy={ON_ERROR_FAIL|ON_ERROR_CONTINUE}
GET  /o/headless-batch-engine/v1.0/import-task/{taskId}
```

## Verification boundary

Automated checks cover syntax, folder creation behavior, Document ERC lookup caching, deterministic template columns, hidden Metadata, Structure fingerprinting, folder binding, image resolution, row-level missing-image errors, scalar conversion, payload generation, duplicate ERCs, and required values.

A real Liferay DXP 2026.Q1.1 instance is still required to verify OAuth permissions, exact Batch Engine image payload acceptance, folder assignment after import, task completion, and created Web Content.
