# Nexcent Local Article Importer

A small local Node.js utility with a plain HTML/CSS/JavaScript UI for importing Liferay Web Content articles from an Excel workbook.

## Flow

```text
Connect with OAuth2 client credentials
→ load Content Structures from the configured Site
→ select the Articles Structure
→ upload .xlsx
→ auto-map Excel columns to Structure fields
→ validate and preview StructuredContent JSON
→ submit Headless Batch Engine import
→ poll ImportTask until COMPLETED or FAILED
```

The OAuth2 client secret is read only by the local Node server. It is never returned to browser JavaScript.

## Scope

Included:

- `.xlsx` parsing from a sheet named `Articles`, or the first non-empty sheet
- scalar text, HTML/string, number, boolean, and date fields
- required `title` and `externalReferenceCode`
- duplicate ERC detection before mutation
- generated JSON preview and download
- `ON_ERROR_CONTINUE` or `ON_ERROR_FAIL`
- Batch Engine task progress and failed-item display

Not included in version 1:

- image upload or Documents and Media lookup
- nested fields
- repeatable fields
- multi-sheet import in one job
- persistent import history outside Liferay Batch Engine

## Liferay OAuth2 setup

Create an OAuth2 application in **Control Panel → Security → OAuth 2 Administration**.

Use Client Credentials and select a Liferay user that can read Structures and create Web Content in the configured Site. Grant these scopes:

```text
Liferay.Headless.Delivery.everything
Liferay.Headless.Batch.Engine.everything
```

Because the browser calls only the local Node server, no Liferay CORS change is required for this utility.

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

`LIFERAY_SITE_ID` can remain an environment-specific numeric ID. Do not commit the populated `.env` file.

## Expected workbook

One header row and one article per row. Column names can match either the Structure field name or label. The mapper also recognizes common aliases for the two system fields.

Example:

```text
externalReferenceCode | title         | summary       | active | publicationDate
NXC-ARTICLE-001       | First article | Intro content | true   | 2026-07-24
```

The generated Batch Engine item is:

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

## API endpoints used

```text
POST /o/oauth2/token
GET  /o/headless-delivery/v1.0/sites/{siteId}/content-structures
GET  /o/headless-delivery/v1.0/content-structures/{contentStructureId}
POST /o/headless-batch-engine/v1.0/import-task/com.liferay.headless.delivery.dto.v1_0.StructuredContent?siteId={siteId}&importStrategy=ON_ERROR_CONTINUE
GET  /o/headless-batch-engine/v1.0/import-task/{taskId}
```

## Verification boundary

Automated tests verify mapping and payload generation. A real Liferay DXP 2026.Q1.1 instance is still required to verify OAuth permissions, the exact target Structure contract, Batch Engine acceptance, and the created articles under **Site Content → Web Content**.
