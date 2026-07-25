# Liferay Flat Structured Content Importer

Local Node.js migration utility for importing supported **flat, non-repeatable Liferay Structured Content** from a generated Excel workbook. Article, Hero, Service, Testimonial, Partner, FAQ, and similar Structures use the same runtime path.

## Demo scope

Version 1 is intentionally scoped to one configured Liferay Site:

```text
Configured Current Site
→ load Content Structures
→ load Web Content folders
→ load Documents and Media folders
→ generate a scope-bound Excel workbook
→ validate rows and image references
→ submit one Structured Content Batch Engine task
```

Asset Library support is a planned enhancement. The demo does not call `headless-asset-library`, does not require JSONWS access, and does not expose a second content or media location in the UI.

## Supported contract

One run uses:

- One configured Liferay Site.
- One selected Content Structure.
- One selected Web Content folder in that Site.
- One optional Documents and Media folder in that Site.
- One fixed default locale.
- One selected visibility policy.
- One workbook.
- One Batch Engine task.

Supported field types: string/rich text, boolean, date, integer/long, decimal/number, image, and single-value select/radio.

Nested, repeatable, relationship, document, geolocation, and grid fields are not imported. A required unsupported field blocks the Structure. Optional unsupported scalar fields are excluded with a warning.

## Configuration ownership

- ENV: Liferay URL, OAuth2 credentials, Site ID, default locale, default visibility, local bind address, and technical limits.
- UI: Structure, target Web Content folder, optional Documents and Media folder, content visibility, workbook, INSERT/UPSERT, and error strategy.
- Excel: title, ERC, dynamic Structure field values, and image references.

Copy `.env.example` to `.env`. Never commit secrets.

The OAuth2 client must be able to:

- Read the configured Site's Content Structures.
- Read the configured Site's Web Content folders.
- Read the configured Site's Documents and Media folders and documents.
- Submit and read Batch Engine import tasks.

## Run

```bash
npm install
npm run check
npm test
npm start
```

Open `http://127.0.0.1:4174`.

## Workflow

1. Connect with OAuth2 Client Credentials. Connect is read-only.
2. Select a supported Structure and an existing Web Content folder.
3. Select content visibility: `Anyone`, `Members`, or `Owner`.
4. Use the Current Site Documents and Media root, or restrict image resolution to one folder.
5. Generate the Structure- and scope-bound workbook.
6. Fill the `Content Items` sheet and upload it.
7. Resolve every validation issue.
8. Choose existing-content handling and error handling.
9. Submit one Batch Engine import task and poll it to completion.

`INSERT` is the default and verified folder-safe path. `UPSERT` requires confirmation because a missing item may be created at the Web Content root and existing items keep their current folder.

## Liferay APIs

### Content Structures

```text
GET /o/headless-delivery/v1.0/sites/{SITE_ID}/content-structures
```

### Web Content folders

```text
GET /o/headless-delivery/v1.0/sites/{SITE_ID}/structured-content-folders?flatten=true
```

### Documents and Media folders

```text
GET /o/headless-delivery/v1.0/sites/{SITE_ID}/document-folders?flatten=true
```

### Documents

Source root:

```text
GET /o/headless-delivery/v1.0/sites/{SITE_ID}/documents?flatten=true
```

Selected folder:

```text
GET /o/headless-delivery/v1.0/document-folders/{FOLDER_ID}/documents
```

### Batch import

```text
POST /o/headless-batch-engine/v1.0/import-task/com.liferay.headless.delivery.dto.v1_0.StructuredContent
  ?createStrategy={INSERT|UPSERT}
  &importStrategy={ON_ERROR_FAIL|ON_ERROR_CONTINUE}
  &siteId={SITE_ID}
```

Each payload item carries `contentStructureId`, `structuredContentFolderId`, `viewableBy`, title, ERC, and dynamic fields.

## Workbook

Sheets:

- `Content Items`: headers only; this is the importable sheet.
- `Field Guide`: field reference, internal DDM name, type, required flag, input control, options, and accepted value.
- `Example`: sample values that cannot be imported accidentally.
- `Metadata`: very-hidden migration binding.

System columns:

```text
Content Title *
External Reference Code *
```

Dynamic columns are generated from the selected Structure. Both `fieldReference` and internal `name` are preserved in the final payload.

The metadata contract binds the workbook to:

- Site.
- Structure ID and fingerprint.
- Target Web Content folder.
- Default locale.
- Current Site image source ID.
- Optional Documents and Media folder.
- Content visibility.

Changing any bound value requires generating a new template. The current template contract version is `5`.

## Image references

Every image field generates exactly one Excel column. Accepted values:

```text
file:hero-home.webp
erc:NXC_HERO_HOME
```

Rules:

- `file:` exact-matches `Document.fileName`, including extension.
- `erc:` exact-matches `Document.externalReferenceCode`.
- Prefix is mandatory.
- No title lookup, fuzzy matching, fallback, Document ID, or cross-source search.
- The Site root is loaded recursively with `flatten=true`.
- An explicitly selected folder resolves only documents directly in that folder.
- Documents are paginated once and indexed in memory by file name and ERC.
- Missing, ambiguous, or non-image Documents block every affected row before Batch submission.

## Visibility

The ENV value:

```text
LIFERAY_DEFAULT_CONTENT_VIEWABLE_BY=Anyone
```

controls the default UI selection. Each run may choose:

```text
Anyone
Members
Owner
```

The selected visibility is stored in workbook metadata, validation session state, and every Structured Content payload item.

## Examples

### NXC Article

Select `NXC Article`, the `Articles` Web Content folder, the Documents and Media folder containing the covers, and the desired visibility. Generate the template and use `file:article-cover.webp` or `erc:NXC_ARTICLE_COVER` in the Cover Image Reference column.

### NXC Hero

Select a flat `NXC Hero` Structure and the `Heroes` Web Content folder. Choose the Documents and Media folder containing Hero images. The same importer generates Heading, Description, Hero Image Reference, and CTA columns from the live Structure.

## Planned enhancements

- Connected Asset Library discovery and validation.
- Site or Asset Library content destination.
- Site or Asset Library media source.
- ZIP image upload.
- Nested and repeatable fields.
- Per-run Site and locale selection.
- Downloadable validation reports.
- Database-backed import history.
