# Nexcent Local Article Importer

A local Node.js migration utility with a plain HTML/CSS/JavaScript UI for importing Liferay Web Content articles from an Excel template generated from the live Content Structure.

## Flow

```text
Connect with OAuth2 client credentials
→ load Content Structures from the configured Site
→ select the Article Structure
→ generate and download the Excel template
→ fill the Articles sheet without changing its headers
→ upload the completed template
→ verify Metadata + Structure fingerprint
→ validate and preview StructuredContent JSON
→ choose INSERT/UPSERT and ON_ERROR_FAIL/ON_ERROR_CONTINUE
→ submit Headless Batch Engine import
→ poll ImportTask until terminal status
```

The OAuth2 client secret and access token remain server-side.

## Template contract

Each generated workbook contains:

```text
Articles     User data entry sheet
Field Guide  Field reference, type, required flag, and format notes
Metadata     Hidden template version, Structure ID/ERC, and schema fingerprint
```

The `Articles` headers are deterministic:

```text
Article Title *
External Reference Code *
Summary [summary]
Body * [body]
Active [active]
```

Do not rename, add, remove, or reorder columns. The field reference in `[]` is the stable mapping key. When the Structure changes, the fingerprint check blocks the old workbook and asks the user to generate a fresh template.

The template includes one sample row. Replace or delete it before the real migration.

## Scope

Included:

- dynamic Content Structure discovery
- Excel template generation with formatting, freeze pane, filters, guide, metadata, and boolean validation
- scalar text/HTML, number, boolean, and date fields
- required title/ERC validation
- duplicate ERC detection before mutation
- unsupported image/document/nested/repeatable field reporting
- JSON preview, copy, and download
- exactly two migration options:
  - `INSERT` or `UPSERT`
  - `ON_ERROR_FAIL` or `ON_ERROR_CONTINUE`
- Batch Engine progress and failed-item display

Not included in version 1:

- image upload or Documents and Media lookup
- nested or repeatable fields
- relationships, geolocation, or grid fields
- multi-locale/multi-sheet import
- persistent local history

## Liferay OAuth2 setup

Create an OAuth2 application in **Control Panel → Security → OAuth 2 Administration** using Client Credentials. Select a Liferay user that can read Structures and create Web Content in the configured Site.

Required scopes:

```text
Liferay.Headless.Delivery.everything
Liferay.Headless.Batch.Engine.everything
```

No browser-to-Liferay CORS configuration is required because the browser calls only the local Node server.

## Run

```bash
cd tools/liferay-article-importer
cp .env.example .env
npm install
npm run check
npm test
npm start
```

Open:

```text
http://127.0.0.1:4174
```

Required `.env` values:

```dotenv
LIFERAY_BASE_URL=http://localhost:8080
LIFERAY_SITE_ID=20117
LIFERAY_OAUTH_CLIENT_ID=your-client-id
LIFERAY_OAUTH_CLIENT_SECRET=your-client-secret
```

`LIFERAY_SITE_ID` may remain an environment-specific numeric ID. Never commit the populated `.env` file.

## Generated payload

A completed row becomes:

```json
{
  "externalReferenceCode": "NXC-ARTICLE-001",
  "title": "First article",
  "contentStructureId": 12345,
  "contentFields": [
    {
      "name": "summary",
      "contentFieldValue": {"data": "Intro content"}
    }
  ]
}
```

## Local API

```text
POST /api/connect
GET  /api/structures/{structureId}
GET  /api/structures/{structureId}/template
POST /api/workbooks
POST /api/imports
GET  /api/imports/{taskId}
```

## Liferay API calls

```text
POST /o/oauth2/token
GET  /o/headless-delivery/v1.0/sites/{siteId}/content-structures
GET  /o/headless-delivery/v1.0/content-structures/{contentStructureId}
POST /o/headless-batch-engine/v1.0/import-task/com.liferay.headless.delivery.dto.v1_0.StructuredContent?siteId={siteId}&createStrategy={INSERT|UPSERT}&importStrategy={ON_ERROR_FAIL|ON_ERROR_CONTINUE}
GET  /o/headless-batch-engine/v1.0/import-task/{taskId}
```

## Verification boundary

Automated checks cover syntax, deterministic template columns, hidden metadata, Structure fingerprinting, supported-field filtering, scalar conversion, payload generation, duplicate ERCs, and required values. A real Liferay DXP 2026.Q1.1 instance is still required to verify OAuth permissions, Batch Engine query parameter acceptance, task completion, and created Web Content.
