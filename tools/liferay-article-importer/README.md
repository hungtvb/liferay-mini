# Liferay Flat Structured Content Importer

Local Node.js migration utility for importing any supported **flat, non-repeatable Liferay Structured Content** from a generated Excel workbook. Article, Hero, Service, Testimonial, Partner, and FAQ Structures use the same code path.

## Boundary

One run uses one configured Liferay Site, one selected Content Structure, one selected Web Content folder, one locale, one fixed image source, one workbook, and one Batch Engine task.

Supported field types: string/rich text, boolean, date, integer/long, decimal/number, and image. Nested, repeatable, relationship, document, geolocation, and grid fields are not imported. A required unsupported field blocks the Structure. Optional unsupported scalar fields are excluded with a warning.

## Configuration ownership

- ENV: Liferay URL, OAuth2 credentials, Site, visibility policy, one image source, technical limits.
- UI: Structure, target folder, locale, workbook, INSERT/UPSERT, error strategy.
- Excel: title, ERC, dynamic Structure field values, image references.

Copy `.env.example` to `.env`. Never commit credentials.

## Run

```bash
npm install
npm run check
npm test
npm start
```

Open `http://localhost:4174`.

## Workflow

1. Connect with OAuth2 Client Credentials. Connect is read-only.
2. Select a supported Structure, an existing Web Content folder, and one locale.
3. Generate the Structure-bound workbook.
4. Fill the `Content Items` sheet and upload it.
5. Resolve all validation issues.
6. Choose exactly two options: existing-content handling and error handling.
7. Submit one Batch Engine import task and poll it to completion.

`INSERT` is the default and verified folder-safe path. `UPSERT` requires confirmation because a missing item may be created at the Web Content root and existing items keep their current folder.

## Workbook

Sheets:

- `Content Items`: headers only; this is the importable sheet.
- `Field Guide`: fieldReference, internal DDM name, type, required flag, and accepted value.
- `Example`: sample values that cannot be imported accidentally.
- `Metadata`: very hidden migration binding.

System columns:

```text
Content Title *
External Reference Code *
```

Dynamic columns are generated from the selected Structure. Both `fieldReference` and internal `name` are preserved in the final payload.

### Images

Every image field generates exactly one Excel column. Accepted values:

```text
file:hero-home.webp
erc:NXC_HERO_HOME
```

- `file:` exact-matches `Document.fileName`, including extension.
- `erc:` exact-matches `Document.externalReferenceCode`.
- Prefix is mandatory.
- No title lookup, fuzzy matching, fallback, Document ID, or cross-source search.
- The configured Site/Asset Library or folder is paginated once and indexed in memory by fileName and ERC.
- Missing, ambiguous, or non-image Documents block every affected row before Batch submission.

## Example: NXC Article

Select `NXC Article`, the `Articles` folder, and the desired locale. Generate a template with Article fields such as Body and Cover Image. Use `file:article-cover.webp` or `erc:NXC_ARTICLE_COVER` in the single Cover Image Reference column.

## Example: NXC Hero

Select a flat `NXC Hero` Structure and the `Heroes` folder. The same importer generates Heading, Description, Hero Image Reference, and CTA columns from the live Structure. No Hero-specific code path is used.

## Batch request

```text
POST /o/headless-batch-engine/v1.0/import-task/com.liferay.headless.delivery.dto.v1_0.StructuredContent
  ?createStrategy={INSERT|UPSERT}
  &importStrategy={ON_ERROR_FAIL|ON_ERROR_CONTINUE}
  &siteId={SITE_ID}
```

Each payload item carries `contentStructureId`, `structuredContentFolderId`, `viewableBy`, title, ERC, and dynamic fields.

## Not in this release

ZIP image upload, nested/repeatable fields, multi-source image search, downloadable reports, and database-backed import history remain future enhancements.
