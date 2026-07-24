# Excel Web Content Importer — Detailed Design

Status: **SOURCE IMPLEMENTED / LIFERAY RUNTIME PENDING**  
Target: **Liferay DXP 2026.Q1.1 LTS**  
Branch: **`feat/excel-web-content-importer`**  
Implementation: **`tools/liferay-article-importer`**

## 1. Goal

Build a small local utility with a plain HTML/CSS/JavaScript wizard that imports Web Content articles from Excel through Liferay Headless APIs.

```text
Start local tool
→ Connect with OAuth2 client credentials
→ Load Content Structures from configured Site
→ Select the Articles Structure
→ Upload .xlsx workbook
→ Auto-map Excel columns to Structure fields
→ Validate every row and preview StructuredContent JSON
→ Submit one Headless Batch Engine ImportTask
→ Poll the task until a terminal status
```

The tool must make a real HTTP request to Liferay Headless Batch Engine. It does not call `BatchEngineImportTaskLocalService` or another local Liferay service.

## 2. Architecture decision

Use a local Node.js server plus a static browser UI.

```text
Browser UI
HTML + CSS + JavaScript
        │
        │ same-origin /api calls
        ▼
Local Node.js server
Express + ExcelJS + Multer
        │
        ├── OAuth2 token request
        ├── Headless Delivery Structure requests
        └── Headless Batch Engine requests
                │
                ▼
          Liferay DXP
```

### Why a Node server is required

`LIFERAY_OAUTH_CLIENT_SECRET` must not be embedded in browser JavaScript. Environment variables are read by the local Node process, and only non-secret configuration is returned to the UI.

The server binds to `127.0.0.1` by default. The browser communicates only with the local server, so the initial version does not require Liferay CORS configuration.

## 3. Scope

### In scope

- Local-only utility under `tools/liferay-article-importer`.
- Configuration through `.env`.
- OAuth2 Client Credentials.
- Dynamic Content Structure discovery for one configured Site.
- User selects the Structure at runtime.
- `.xlsx` workbook parsing.
- Sheet named `Articles`, with fallback to the first non-empty sheet.
- Automatic column mapping by Structure field name, label, or common system-field alias.
- Manual mapping correction in the UI.
- Scalar string, HTML/string, number, boolean, and date fields.
- Required `title` and `externalReferenceCode` system fields.
- Workbook-wide preflight validation before mutation.
- StructuredContent JSON preview, copy, and download.
- One Batch Engine import task for the validated workbook.
- Polling and failed-item display.
- `ON_ERROR_CONTINUE` and `ON_ERROR_FAIL` configuration.

### Out of scope for version 1

- Image upload or Documents and Media lookup.
- Image fields.
- Nested fields.
- Repeatable fields.
- Fieldsets.
- Multiple sheets in one import task.
- Multiple Sites in one running process.
- Multiple locales in one workbook.
- Taxonomy and categories.
- Persistent local import history.
- Custom queue, worker, retry engine, or per-row executor.
- Service Builder or REST Builder modules.
- A Batch Client Extension package.

## 4. Configuration

Template:

```text
tools/liferay-article-importer/.env.example
```

Required values:

```dotenv
LIFERAY_BASE_URL=http://localhost:8080
LIFERAY_SITE_ID=20117
LIFERAY_OAUTH_CLIENT_ID=your-client-id
LIFERAY_OAUTH_CLIENT_SECRET=your-client-secret
```

Optional values:

```dotenv
PORT=4174
LIFERAY_LOCALE=en-US
LIFERAY_IMPORT_STRATEGY=ON_ERROR_CONTINUE
BATCH_POLL_INTERVAL_MS=1500
BATCH_POLL_TIMEOUT_MS=600000
MAX_UPLOAD_MB=10
MAX_IMPORT_ROWS=5000
SESSION_TTL_MS=1800000
```

Rules:

- `.env` is ignored by Git.
- The browser never receives the client ID, client secret, or access token.
- `LIFERAY_SITE_ID` is environment-specific and must not be committed in a populated `.env`.
- Startup fails fast when required values are missing or malformed.

## 5. OAuth2 setup

Create an OAuth2 application in Liferay and enable Client Credentials for a user that can:

- read Content Structures in the configured Site;
- create or update Web Content in that Site;
- create and read Batch Engine import tasks.

Required scopes:

```text
Liferay.Headless.Delivery.everything
Liferay.Headless.Batch.Engine.everything
```

The local server requests a token from:

```text
POST /o/oauth2/token
```

The client caches the access token until shortly before expiry. A Liferay API response with HTTP 401 triggers one forced token refresh and one retry.

## 6. External Liferay APIs

### 6.1 Load Structures

```text
GET /o/headless-delivery/v1.0/sites/{siteId}/content-structures
GET /o/headless-delivery/v1.0/content-structures/{contentStructureId}
```

The list request is paginated. The browser receives only the Structure metadata needed for selection.

### 6.2 Submit the import

Class name:

```text
com.liferay.headless.delivery.dto.v1_0.StructuredContent
```

Request:

```text
POST /o/headless-batch-engine/v1.0/import-task/{className}
    ?siteId={siteId}
    &importStrategy={ON_ERROR_CONTINUE|ON_ERROR_FAIL}
```

Body:

```json
[
  {
    "externalReferenceCode": "NXC-ARTICLE-001",
    "title": "First article",
    "contentStructureId": 12345,
    "contentFields": [
      {
        "name": "summary",
        "contentFieldValue": {
          "data": "Intro content"
        }
      }
    ]
  }
]
```

### 6.3 Poll task status

```text
GET /o/headless-batch-engine/v1.0/import-task/{taskId}
```

The UI polls until one of these terminal states is received:

```text
COMPLETED
COMPLETED_WITH_ERRORS
FAILED
CANCELLED
```

A local polling timeout stops browser polling but does not cancel the Liferay task. The task ID remains visible for manual inspection.

## 7. Local API

The browser uses same-origin endpoints exposed by the Node server.

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/api/config` | Return safe display configuration |
| `POST` | `/api/connect` | Authenticate and load Site Structures |
| `GET` | `/api/structures/{id}` | Load one Structure and derive mapping targets |
| `POST` | `/api/workbooks` | Upload, parse, and create an in-memory workbook session |
| `POST` | `/api/workbooks/{sessionId}/validate` | Validate mapping and generate payload |
| `POST` | `/api/imports` | Submit validated payload to Batch Engine |
| `GET` | `/api/imports/{taskId}` | Read normalized ImportTask status |

No endpoint returns an access token or OAuth2 secret.

## 8. Workbook contract

### 8.1 File rules

- Extension: `.xlsx`.
- Maximum size: configured by `MAX_UPLOAD_MB`.
- Maximum data rows: configured by `MAX_IMPORT_ROWS`.
- Preferred worksheet: `Articles`, case-insensitive.
- Fallback worksheet: first non-empty worksheet.
- First non-empty row is treated as the header row.
- Fully empty rows are ignored.
- Header names must be unique, case-insensitive.

### 8.2 Required logical columns

The exact Excel header text can vary because the user maps columns in the UI, but every import requires mappings for:

```text
title
externalReferenceCode
```

Structure fields are discovered dynamically. Their required flag and scalar data type are used during validation.

### 8.3 Automatic mapping

The importer normalizes names by:

- trimming;
- lowercasing;
- removing spaces and punctuation;
- removing Vietnamese diacritics, including `đ` and `Đ`.

It compares Excel headers against:

- Structure field reference/name;
- Structure field label;
- Structure field external reference code when exposed;
- common aliases for `title` and `externalReferenceCode`.

Every mapping remains editable before validation.

## 9. Validation

Validation is read-only and runs before any Liferay mutation.

### 9.1 Mapping-level checks

- Required target is unmapped.
- A mapped Structure field is nested or repeatable.
- Unsupported field types are blocked rather than silently serialized.

### 9.2 Row-level checks

- Required value is empty.
- Boolean is not one of `true`, `false`, `yes`, `no`, `1`, or `0`.
- Integer or number cannot be parsed safely.
- Date is not a valid `YYYY-MM-DD` value.
- `externalReferenceCode` is duplicated in the workbook, case-insensitive.

### 9.3 Mutation gate

The import button is enabled only when:

```text
errors.length === 0
AND payload.length > 0
```

The current implementation rejects the whole workbook when any preflight error exists. It does not submit only the valid subset.

## 10. Payload generation

Payload order follows the selected Structure field order, not JavaScript object insertion order.

Each row becomes one `StructuredContent` item:

```json
{
  "externalReferenceCode": "...",
  "title": "...",
  "contentStructureId": 12345,
  "contentFields": [
    {
      "name": "fieldReference",
      "contentFieldValue": {
        "data": "convertedValue"
      }
    }
  ]
}
```

Blank optional fields are omitted. Empty required fields are validation errors.

## 11. UI flow

### Step 1 — Connect

- Display configured Liferay URL and Site ID.
- User clicks **Connect**.
- OAuth2 authentication runs on the Node server.
- Content Structures are loaded and shown in a selector.
- A Structure containing `Article` in its name is preferred automatically when present.

### Step 2 — Workbook

- User selects or drops one `.xlsx` file.
- Scope warning states that images, nested fields, and repeatable fields are unsupported.
- The server parses the workbook and creates a temporary session.

### Step 3 — Validate and map

Tabs:

- **Mapping:** Structure target to Excel column selectors.
- **Issues:** mapping and row diagnostics.
- **JSON payload:** formatted batch payload with copy and download actions.

Changing a selector requires revalidation. Import remains disabled while validation fails.

### Step 4 — Import

- Submit the validated payload.
- Display task ID, import strategy, processed count, total count, status, and progress.
- Poll until terminal state or local timeout.
- Display failed items returned by Liferay.

## 12. Temporary state

Parsed workbook data and generated payload are held in an in-memory session store.

- Session ID: random UUID.
- Sliding expiration: `SESSION_TTL_MS`.
- Cleanup runs periodically.
- Restarting the local process clears all sessions.
- Secrets and tokens are not placed in workbook sessions.

This is intentional for a small local migration utility. Persistent history remains in Liferay Batch Engine.

## 13. Error handling

Local errors use a consistent JSON envelope:

```json
{
  "error": {
    "code": "WORKBOOK_INVALID",
    "message": "The uploaded file is not a readable .xlsx workbook",
    "details": {}
  }
}
```

Important error classes:

- invalid or missing environment configuration;
- OAuth2 failure;
- unreachable Liferay endpoint;
- Liferay API response error;
- unsupported or oversized workbook;
- duplicate headers;
- expired workbook session;
- validation required or validation failed;
- Batch task submission or polling failure.

## 14. Source layout

```text
tools/liferay-article-importer/
├── .env.example
├── .gitignore
├── README.md
├── package.json
├── public/
│   ├── app.js
│   ├── index.html
│   └── styles.css
├── scripts/
│   └── check.mjs
├── server/
│   ├── app.js
│   ├── config.js
│   ├── errors.js
│   ├── index.js
│   ├── liferay-client.js
│   ├── mapping.js
│   ├── session-store.js
│   ├── validation.js
│   └── workbook.js
└── test/
    ├── mapping.test.js
    └── validation.test.js
```

## 15. Runbook

```bash
cd tools/liferay-article-importer
cp .env.example .env
# populate the four required LIFERAY_* values
npm install
npm run check
npm test
npm start
```

Open:

```text
http://127.0.0.1:4174
```

## 16. Automated verification

Implemented tests cover:

- case, punctuation, accent, and Vietnamese `đ` normalization;
- automatic mapping for system and Structure fields;
- nested and repeatable fields marked unsupported;
- valid StructuredContent payload generation;
- Structure field order preservation;
- duplicate ERC and empty title rejection;
- scalar boolean, integer, decimal, and date conversion.

Syntax verification checks all JavaScript and MJS files under `server`, `public`, `scripts`, and `test`.

## 17. Runtime acceptance gates

Source-level tests do not prove Liferay integration. Before merge, verify against the exact DXP 2026.Q1.1 runtime:

1. OAuth2 Client Credentials succeeds with the configured application.
2. The expected Site Structures appear after Connect.
3. The real Article Structure field metadata matches the mapper assumptions.
4. A valid workbook produces the expected JSON.
5. An invalid workbook cannot reach the import step.
6. Batch Engine accepts the `StructuredContent` payload.
7. Polling reaches the real terminal status.
8. Created articles appear under **Site Content → Web Content**.
9. Re-import behavior by ERC is verified for the chosen import strategy.
10. No client secret or access token appears in browser network responses, HTML, logs, or committed files.

Current evidence is therefore:

```text
SOURCE IMPLEMENTED
SYNTAX CHECKED
UNIT TESTED
LIFERAY RUNTIME PENDING
```
