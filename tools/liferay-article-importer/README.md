# Nexcent Local Article Importer

A local Node.js migration utility with a plain HTML/CSS/JavaScript UI for importing `NXC_ARTICLE` Web Content from a Structure-driven Excel workbook.

## Canonical content contract

```text
Structure ERC: NXC_ARTICLE
Target folder ERC: NXC_ARTICLES
Target folder name: Articles

System fields:
- title
- externalReferenceCode
- datePublished
- contentUrl

Structure fields:
- body
- coverImage
```

The importer does not add `sortOrder`, `active`, `featured`, `summary`, `authorName`, `thumbnail`, or `targetUrl` fields.

## Flow

```text
Connect with OAuth2 Client Credentials
→ resolve or create the configured Articles folder
→ resolve the exact NXC_ARTICLE Structure by ERC
→ generate a Structure-driven Excel template
→ fill Article data and existing Image Document ERCs
→ upload and validate the workbook
→ preview StructuredContent JSON
→ choose INSERT/UPSERT
→ choose ON_ERROR_FAIL/ON_ERROR_CONTINUE
→ revalidate folder, Structure, and images
→ submit a Headless Batch Engine ImportTask
→ poll until terminal status
```

The OAuth2 client secret and access token remain server-side. The tool does not upload images.

## Configuration

```bash
cd tools/liferay-article-importer
cp .env.example .env
```

Required values:

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

Never commit a populated `.env` file.

## Exact Structure guard

The application loads all Site Structures, but exposes only the Structure whose External Reference Code exactly matches `LIFERAY_ARTICLE_STRUCTURE_ERC`.

The server validates the Structure again when:

- opening the Structure summary;
- generating the workbook;
- uploading and validating the workbook;
- submitting the Batch Engine task.

A similarly named Structure cannot be selected accidentally.

## Target folder contract

1. Connect looks up the configured folder by ERC.
2. When missing, the tool creates it at the Site root.
3. The workbook stores the folder ERC and ID in hidden Metadata.
4. Validation rejects a workbook generated for another folder.
5. Every payload item includes `structuredContentFolderId`.
6. The folder is resolved again immediately before mutation.

## Image contract

The current workbook contains:

```text
Cover Image * ERC [coverImage]
```

Each Image cell contains the External Reference Code of an existing Documents and Media image.

Validation:

- resolves each unique Document ERC;
- caches duplicate references in one pass;
- verifies that the Document exists;
- verifies that `encodingFormat` starts with `image/`;
- reports failures against the exact Excel row;
- resolves images again before import.

Image description remains a child property of the Image value. No separate `coverImageAlt` field is required.

## Workbook contract

Sheets:

```text
Articles     User data entry
Field Guide  Field reference, type, required flag, and notes
Metadata     Very hidden Structure fingerprint and folder binding
```

Expected columns for `NXC_ARTICLE`:

```text
Article Title *
External Reference Code *
Body * [body]
Cover Image * ERC [coverImage]
```

Do not rename, add, remove, or reorder columns. Generate a new template whenever the Structure or target folder changes.

## Generated payload

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

## Article delivery after import

The Home page React Article list uses the same `NXC_ARTICLE` Structure:

```text
Title: StructuredContent.title
Image: contentFields.coverImage
Image alt: image.description → image.title → Article title
Link: StructuredContent.contentUrl
Order: sortOrder/displayOrder when present; otherwise datePublished descending
```

The Headless list request uses `flatten=true` because imported Articles are stored inside `NXC_ARTICLES`. It does not send `contentFields/sortOrder` to the server because Article does not have that field.

Create a default Display Page Template in the existing Nexcent Site:

```text
Name: Nexcent Article Detail
Content Type: Web Content Article
Subtype: NXC Article
Master Page: Nexcent Master Page
```

Map the Article Detail Fragment:

```text
title          → System Field / Title
publishedDate  → System Field / Publish Date
coverImage     → NXC Article / coverImage
body           → NXC Article / body
```

Example detail URL:

```text
/web/nexcent-public-website/w/test-nexcent-article
```

React must use `contentUrl`; it must not construct the Site path manually.

## OAuth2 permissions

The Client Credentials user needs permission to:

- read Content Structures;
- read Documents and Media;
- read and create Web Content folders;
- create or update Web Content;
- create and read Batch Engine tasks.

Scopes:

```text
Liferay.Headless.Delivery.everything
Liferay.Headless.Batch.Engine.everything
```

## Run and verify

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

Runtime gates remain:

- exact `NXC_ARTICLE` resolution;
- real image ERC validation;
- Batch Engine Image payload acceptance;
- imported content inside `NXC_ARTICLES`;
- `contentUrl` returned after the Display Page Template is defaulted;
- Article detail rendering under the Nexcent Master Page;
- UPSERT behavior by Article ERC;
- no secret or access-token exposure.
