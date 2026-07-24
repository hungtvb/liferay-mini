# Liferay Flat Structured Content Importer

Local Node.js migration utility for importing any supported **flat, non-repeatable Liferay Structured Content** from a generated Excel workbook. Article, Hero, Service, Testimonial, Partner, and FAQ Structures use the same code path.

## Boundary

One run uses one configured Liferay Site, one selected Content Structure, one selected Web Content folder, one fixed default locale, one fixed image source, one workbook, and one Batch Engine task.

Supported field types: string/rich text, boolean, date, integer/long, decimal/number, image, and single-value select/radio fields. Nested, repeatable, relationship, document, geolocation, and grid fields are not imported. A required unsupported field blocks the Structure. Optional unsupported fields are excluded with a warning.

## Configuration ownership

- ENV: Liferay URL, OAuth2 credentials, Site, default locale, visibility policy, one image source, local bind address, and technical limits.
- UI: Structure, target folder, workbook, INSERT/UPSERT, and error strategy.
- Excel: title, ERC, dynamic Structure field values, and image references.

Copy `.env.example` to `.env`. Never commit credentials.

The server binds to `127.0.0.1` by default. Set `HOST` explicitly only when the migration UI must be reachable from another machine.

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
2. The tool validates the configured image Site/Asset Library and optional image folder.
3. Select a supported Structure and an existing Web Content folder.
4. Generate the Structure-bound workbook using `LIFERAY_DEFAULT_LOCALE`.
5. Fill the `Content Items` sheet and upload it.
6. Resolve all validation issues.
7. Choose exactly two options: existing-content handling and error handling.
8. Submit one Batch Engine import task and poll it to completion.

`INSERT` is the default and verified folder-safe path. `UPSERT` requires confirmation because a missing item may be created at the Web Content root and existing items keep their current folder.

When a Batch POST may have succeeded but no task ID is received, the validation session is locked as `BATCH_SUBMISSION_UNKNOWN`. Do not submit that session again; inspect Batch Engine tasks in Liferay.

## Workbook

Sheets:

- `Content Items`: headers only; this is the importable sheet.
- `Field Guide`: fieldReference, internal DDM name, type, required flag, input control, and accepted value.
- `Example`: sample values that cannot be imported accidentally.
- `Metadata`: very hidden migration binding.

System columns:

```text
Content Title *
External Reference Code *
```

Dynamic columns are generated from the selected Structure. Both `fieldReference` and internal `name` are preserved in the final payload.

For select and radio fields, the Field Guide lists the exact accepted option values. Display labels are not accepted in place of option values.

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
- A Site or Asset Library source root includes descendants.
- When `LIFERAY_IMAGE_SOURCE_FOLDER_ID` is set, only documents directly inside that validated folder are indexed.
- Missing, ambiguous, or non-image Documents block every affected row before Batch submission.
- A Structure with no populated image references does not load the configured image source.

## Example: NXC Article

Select `NXC Article` and the `Articles` folder. Generate a template with Article fields such as Body and Cover Image. Use `file:article-cover.webp` or `erc:NXC_ARTICLE_COVER` in the single Cover Image Reference column.

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

## Current safety limits

- Structure and target Web Content folder must belong to the configured Site.
- Optional image folder must belong to the configured image source.
- All duplicate workbook ERC rows are blocked.
- Batch POST requests are never automatically retried.
- Ambiguous Batch submissions remain locked.
- Validation sessions are TTL-bound and capped by `MAX_ACTIVE_SESSIONS`.

## Not in this release

Per-run locale selection, multilingual values, ZIP image upload, nested/repeatable fields, multi-source image search, downloadable reports, and database-backed import history remain future enhancements.
