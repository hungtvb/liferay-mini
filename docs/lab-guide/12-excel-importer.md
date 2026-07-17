# Lab 12 — Import Web Content from Excel

## Overview

Build a signed-in Liferay Custom Element that reads a multi-sheet Excel workbook, validates every row, uploads referenced images to Documents and Media, and creates or updates Classic Web Content through Headless Delivery APIs.

This lab implements the runtime flow required by the assignment:

```text
Excel workbook + image files
            ↓
Parse and validate in the browser
            ↓
Upload missing Documents and Media assets
            ↓
Resolve Web Content Structures
            ↓
Create or update Web Content by external reference code
            ↓
Site Content → Web Content
```

## Estimated time

150–210 minutes.

## Prerequisites

- Labs 00–11 are complete.
- Liferay DXP `2026.Q1.1 LTS` is running locally.
- The four Structures are already available:
  - `NXC Landing Hero`
  - `NXC Services Intro`
  - `NXC Service Item`
  - `NXC Feature Item`
- The signed-in user can manage Web Content and Documents and Media.
- Node.js satisfies the version in `package.json`.

## Learning goals

By the end of this lab, you can:

1. Parse an `.xlsx` file with ExcelJS.
2. Convert worksheet rows into typed TypeScript records.
3. Validate required columns, values, URLs, HTML, assets, and duplicate identities.
4. Send multipart requests without overriding the browser-generated boundary.
5. Upload Documents and Media assets through Headless Delivery.
6. Map Excel rows into Structured Content payloads.
7. Use external reference codes for repeatable imports.
8. Display validation, progress, and import reports.

## Architecture decision

The runtime uploader is a **Custom Element Client Extension**, not a Batch Client Extension.

A Batch Client Extension packages `.batch-engine-data.json` files and imports them during deployment. The assignment also asks users to select an Excel file at runtime, so the project separates the concerns:

```text
Lab 12: Custom Element Excel importer
Lab 13: deployable Batch Client Extension
```

Both flows use the same content models and stable external reference codes.

---

## Part 1 — Prepare the sample workbook

### Step 1 — Install dependencies

From the Custom Element project:

```bash
cd client-extensions/nexcent-landing-elements
npm install
```

The project uses:

```json
{
  "dependencies": {
    "exceljs": "4.4.0"
  }
}
```

### Step 2 — Generate the workbook

Run:

```bash
npm run generate:workbook
```

The command reads:

```text
sample-data/json/landing-content.json
```

and generates:

```text
sample-data/excel/nexcent-content.xlsx
```

The workbook is generated instead of manually maintained as an opaque binary. This prevents JSON, CSV, and Excel samples from drifting apart.

### Step 3 — Inspect the sheets

The workbook contains:

| Sheet | Web Content Structure | Expected sample rows |
|---|---|---:|
| `Instructions` | Not imported | Guidance only |
| `Heroes` | `NXC Landing Hero` | 1 |
| `ServicesIntro` | `NXC Services Intro` | 1 |
| `Services` | `NXC Service Item` | 3 |
| `Features` | `NXC Feature Item` | 2 |

Do not rename sheets or headers. Headers match the Web Content field references.

### Step 4 — Understand portable asset references

The workbook stores paths such as:

```text
assets/hero-illustration.svg
assets/service-membership.svg
assets/feature-content.svg
```

It does not store a Liferay document ID. At import time, the user selects the actual files in `sample-data/assets/`, and the importer resolves them by filename.

---

## Part 2 — Parse the Excel workbook

### Step 5 — Define typed migration records

Create:

```text
src/components/Importer/types.ts
```

Start with a shared row:

```ts
export type BaseMigrationRow = {
    active: boolean;
    externalReferenceCode: string;
    sortOrder: number;
    title: string;
};
```

Extend it for each sheet:

```ts
export type ServiceRow = BaseMigrationRow & {
    descriptionHtml: string;
    iconAlt: string;
    iconFile: string;
    targetUrl: string;
};
```

Group all normalized sheets:

```ts
export type MigrationWorkbook = {
    features: FeatureRow[];
    heroes: HeroRow[];
    services: ServiceRow[];
    servicesIntro: ServicesIntroRow[];
};
```

### Step 6 — Load the workbook with ExcelJS

Create:

```text
src/components/Importer/workbook.ts
```

Read the selected file:

```ts
export async function parseMigrationWorkbook(file: File) {
    const workbook = new ExcelJS.Workbook();
    const buffer = await file.arrayBuffer();

    await workbook.xlsx.load(buffer);

    // Convert worksheets to plain row objects.
}
```

ExcelJS cell values can be strings, numbers, dates, formulas, hyperlinks, or rich text. Normalize each supported form before validation.

### Step 7 — Read headers safely

`Row.values` can be an array or an object. Guard it before using array methods:

```ts
const rowValues: CellValue[] = Array.isArray(headerRow.values)
    ? headerRow.values
    : [];
```

The first row becomes the column list. Every following non-empty row becomes a plain object with an internal `__rowNumber` used only for error reporting.

---

## Part 3 — Validate before calling Liferay

### Step 8 — Validate required sheets

Create:

```text
src/components/Importer/validation.ts
```

Require:

```ts
const REQUIRED_SHEETS = [
    'Heroes',
    'ServicesIntro',
    'Services',
    'Features',
];
```

A missing sheet is a blocking error.

### Step 9 — Validate common fields

Every import row requires:

```text
externalReferenceCode
title
sortOrder
active
```

Rules:

- `externalReferenceCode` is non-empty.
- `sortOrder` converts to a finite number.
- `active` is `true` or `false`.
- All external reference codes are unique across the entire workbook.

Cross-sheet uniqueness matters because the importer uses one ERC lookup endpoint for Structured Content.

### Step 10 — Validate URLs and variants

Allow CTA URLs and service links that are:

- Relative paths beginning with `/`
- Page anchors beginning with `#`
- `http://`
- `https://`

For Features, allow only:

```text
imagePosition: left | right
backgroundVariant: white | silver
```

Do not use arbitrary spreadsheet text directly as a CSS class.

### Step 11 — Validate HTML fields

Reject HTML containing executable patterns such as:

```text
<script>
onclick=
javascript:
```

The frontend also sanitizes HTML while rendering, but migration validation prevents unsafe content from being created in the first place.

### Step 12 — Validate asset selection

For every `imageFile` and `iconFile`:

1. Extract the filename from the portable path.
2. Compare it case-insensitively with the files selected in the browser.
3. Report the exact sheet and row when an asset is missing.

Validation must finish successfully before enabling the import button.

---

## Part 4 — Call Headless Delivery APIs

### Step 13 — Support multipart requests

The existing `portalFetch()` helper defaults JSON requests to:

```text
Content-Type: application/json
```

Do not set that header when the request body is `FormData`:

```ts
const isFormData = init.body instanceof FormData;

if (init.body && !isFormData && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
}
```

The browser must generate the multipart boundary itself.

### Step 14 — Resolve the current site

Use the shared portal context:

```ts
const siteId = getSiteId();
```

Never commit a numeric site ID from one environment.

### Step 15 — Resolve the Structures

Resolve the four Structures concurrently:

```ts
const [hero, servicesIntro, service, feature] = await Promise.all([
    resolveContentStructure(siteId, 'NXC Landing Hero'),
    resolveContentStructure(siteId, 'NXC Services Intro'),
    resolveContentStructure(siteId, 'NXC Service Item'),
    resolveContentStructure(siteId, 'NXC Feature Item'),
]);
```

The importer uses names or external reference codes and converts them to environment-specific IDs at runtime.

### Step 16 — Reuse existing documents

List Documents and Media assets:

```http
GET /o/headless-delivery/v1.0/sites/{siteId}/documents?flatten=true&pageSize=200
```

Build a filename lookup. When a referenced file already exists, reuse the returned Document object instead of uploading a duplicate.

> The page size is sufficient for this lab dataset. A production importer must implement API pagination.

### Step 17 — Upload a missing document

Create a `FormData` body:

```ts
const formData = new FormData();
formData.append('file', file, file.name);
```

Send:

```http
POST /o/headless-delivery/v1.0/sites/{siteId}/documents
```

Use the returned Document object in the Structured Content image field.

### Step 18 — Map a row into content fields

A Hero payload contains:

```ts
contentFields: [
    dataField('title', row.title),
    dataField('highlightedText', row.highlightedText),
    dataField('description', row.description),
    dataField('ctaLabel', row.ctaLabel),
    dataField('ctaUrl', row.ctaUrl),
    imageField('illustration', imageDocument),
    dataField('illustrationAlt', row.imageAlt),
    dataField('sortOrder', row.sortOrder),
    dataField('active', row.active),
]
```

The field names must exactly match the Structure field references created in Labs 05 and 06.

### Step 19 — Look up Web Content by ERC

Before creating content, request:

```http
GET /o/headless-delivery/v1.0/sites/{siteId}/structured-contents/by-external-reference-code/{externalReferenceCode}
```

Interpret only HTTP `404` as not found. Re-throw authentication, authorization, validation, and server errors.

### Step 20 — Create or update

When the article does not exist:

```http
POST /o/headless-delivery/v1.0/sites/{siteId}/structured-contents
```

When it already exists:

```http
PUT /o/headless-delivery/v1.0/sites/{siteId}/structured-contents/by-external-reference-code/{externalReferenceCode}
```

This is the idempotency rule:

```text
Missing ERC → create
Existing ERC → update
```

Do not use the article title as identity. Editors can change titles without breaking future imports.

---

## Part 5 — Build the importer interface

### Step 21 — Create the component

Create:

```text
src/components/Importer/ContentImporter.tsx
```

The UI requires two file controls:

1. One `.xlsx` workbook.
2. Multiple image files.

The component state supports:

```text
idle
validating
ready
importing
done
error
```

### Step 22 — Separate validation from import

The user must first click:

```text
Validate package
```

After validation succeeds, display row counts and enable:

```text
Import Web Content
```

Do not begin network writes automatically when a file is selected.

### Step 23 — Require a signed-in user

The browser importer uses the current Liferay session and CSRF token. If the user is signed out, show an actionable warning and disable import.

Do not place Basic Authentication credentials in frontend code.

### Step 24 — Display progress and reports

Use an `aria-live="polite"` region for progress messages:

```text
Resolving Web Content Structures...
Resolving and uploading Documents and Media assets...
Importing 3/7: National Associations
Imported 7 Web Content articles.
```

After completion, show:

- `created` or `updated`
- Content type
- Title
- External reference code

### Step 25 — Register the Custom Element

In `src/index.tsx`:

```tsx
registerReactElement('nexcent-content-importer', () => (
    <ContentImporter />
));
```

### Step 26 — Expose the widget

Add to `client-extension.yaml`:

```yaml
nexcent-content-importer:
    cssURLs:
        - style.css
    friendlyURLMapping: nexcent-content-importer
    htmlElementName: nexcent-content-importer
    instanceable: false
    name: Nexcent Content Importer
    portletCategoryName: category.client-extensions
    type: customElement
    urls:
        - index.js
    useESM: true
```

---

## Part 6 — Build, deploy, and test

### Step 27 — Validate the project

```bash
cd client-extensions/nexcent-landing-elements
npm install
npm run typecheck
npm run build
npm run generate:workbook
```

Expected files:

```text
build/index.js
build/style.css
sample-data/excel/nexcent-content.xlsx
```

### Step 28 — Deploy

From the workspace root:

```bash
./gradlew :client-extensions:nexcent-landing-elements:deploy
```

Create a private administration page and add **Nexcent Content Importer**. Do not place the importer on the public landing page.

### Step 29 — Run the first migration

1. Sign in as a user with content permissions.
2. Select `sample-data/excel/nexcent-content.xlsx`.
3. Select all six files from `sample-data/assets/`.
4. Click **Validate package**.
5. Confirm the expected count is seven articles.
6. Click **Import Web Content**.

Expected report:

```text
1 Hero created
1 Services Intro created
3 Services created
2 Features created
```

### Step 30 — Verify Liferay data

Open:

```text
Site Menu → Content & Data → Web Content
```

Verify all seven articles exist under the correct Structures. Open Documents and Media and verify the six selected assets exist.

### Step 31 — Prove idempotency

Run the same workbook a second time.

Expected:

- Seven rows report `updated`.
- No duplicate Web Content is created.
- Existing assets are reused by filename.

Then change one Service description in Excel and import again. The matching article must update because its ERC is unchanged.

---

## Expected result

- The importer parses all four content sheets.
- Invalid data is blocked before any API write.
- Missing images are uploaded to Documents and Media.
- All sample rows appear in Web Content.
- A second import updates the same records.
- No site, Structure, article, or document numeric IDs are stored in Excel.
- The public landing page renders the migrated content through Headless APIs.

## Checkpoint

- [ ] The workbook generator creates all five sheets.
- [ ] Missing sheets and columns produce readable errors.
- [ ] Duplicate ERCs are rejected.
- [ ] Missing asset files are rejected.
- [ ] Unsafe HTML is rejected.
- [ ] Signed-out users cannot import.
- [ ] Seven sample articles are imported successfully.
- [ ] Imported articles appear in **Site Content → Web Content**.
- [ ] The second run updates instead of duplicating.
- [ ] TypeScript and Vite checks are green.

## Troubleshooting

### `Required sheet is missing`

Use the generated workbook and do not rename `ServicesIntro` to `Services Intro`. Sheet matching is exact.

### `Asset was not selected`

Select the physical file whose filename appears in the workbook. The folder portion of the spreadsheet path is ignored, but the filename must match.

### HTTP 401 or 403

Confirm the user is signed in and has permission to create Web Content and Documents and Media assets in the current site.

### HTTP 400 when creating content

Compare the payload field names with the Structure field references. Labels visible to editors are not necessarily API field names.

### Image field is empty after import

Confirm the asset upload returned a Document object and that the field payload uses:

```ts
contentFieldValue: {image: document}
```

### Content remains pending instead of published

The site may have a workflow assigned. The importer creates or updates the article, but workflow rules still control approval and publication.

### A large site does not reuse an existing image

This lab reads up to 200 documents. Implement pagination or resolve documents by a stable external reference code before using the importer on a large production library.

## Knowledge check

1. Why must FormData requests omit a manually generated `Content-Type` header?
2. Why is an ERC safer than a title for migration identity?
3. Why does validation run before any document upload?
4. What is the difference between portable asset paths and Liferay document IDs?
5. Why does the importer use the signed-in session instead of embedding credentials?
6. Why is the runtime Excel uploader not itself a Batch Client Extension?
7. What would you change to support thousands of Documents and Media assets?

## Challenge

1. Add a fourth Service row to the workbook and import it without modifying React code.
2. Change one Feature to `backgroundVariant=silver` and re-import.
3. Add a dry-run JSON download containing the exact Structured Content payloads without sending API requests.
4. Add an optional Documents and Media folder selector.

## Official references

- Document API basics: https://learn.liferay.com/w/dxp/integration/headless-apis/digital-asset-management-apis/document-api-basics
- Advanced Web Content API: https://learn.liferay.com/w/dxp/integration/headless-apis/content-management-apis/web-content-apis/advanced-web-content-api
- External reference codes: https://learn.liferay.com/w/dxp/integration/headless-apis/using-liferay-as-a-headless-platform/consuming-apis/using-external-reference-codes
