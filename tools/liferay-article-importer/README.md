# Liferay Flat Structured Content Importer

Local Node.js migration utility for importing any supported **flat, non-repeatable Liferay Structured Content** from a generated Excel workbook. Article, Hero, Service, Testimonial, Partner, and FAQ Structures use the same code path.

## Boundary

One run uses one configured Liferay Site, one selected Content Structure, one selected Web Content folder, one default locale, one selected image source, one selected visibility policy, one workbook, and one Batch Engine task.

Supported field types: string/rich text, boolean, date, integer/long, decimal/number, image, and single-value select/radio. Nested, repeatable, relationship, document, geolocation, and grid fields are not imported. A required unsupported field blocks the Structure. Optional unsupported scalar fields are excluded with a warning.

## Configuration ownership

- ENV: Liferay URL, OAuth2 credentials, Site, default locale, default visibility, local bind, and technical limits.
- UI: Structure, target folder, image source type, Site/Asset Library source, optional image folder, content visibility, workbook, INSERT/UPSERT, and error strategy.
- Excel: title, ERC, dynamic Structure field values, and image references.

Copy `.env.example` to `.env`. Never commit credentials.

The OAuth2 client must be able to:

- Read the configured Site's Content Structures and Web Content folders.
- Read Site Documents and Media when the current Site is selected as the image source.
- List and read Asset Libraries that should be selectable as image sources.
- Submit and read Batch Engine import tasks.

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
2. Select a supported Structure and an existing Web Content folder.
3. Select one image source:
   - Current Site; or
   - One Asset Library visible to the OAuth2 client and connected to the configured Site.
4. Optionally restrict image resolution to one folder in that source.
5. Select content visibility: `Anyone`, `Members`, or `Owner`.
6. Generate the Structure- and scope-bound workbook.
7. Fill the `Content Items` sheet and upload it.
8. Resolve all validation issues.
9. Choose exactly two import options: existing-content handling and error handling.
10. Submit one Batch Engine import task and poll it to completion.

`INSERT` is the default and verified folder-safe path. `UPSERT` requires confirmation because a missing item may be created at the Web Content root and existing items keep their current folder.

## Workbook

Sheets:

- `Content Items`: headers only; this is the importable sheet.
- `Field Guide`: fieldReference, internal DDM name, type, required flag, input control, options, and accepted value.
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
- Image source type and ID.
- Optional image folder.
- Content visibility.

Changing any of these requires generating a new template. The current template contract version is `5`.

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
- A source root is loaded recursively with `flatten=true`.
- An explicitly selected image folder resolves only documents directly in that folder.
- The selected source is paginated once and indexed in memory by fileName and ERC.
- Missing, ambiguous, or non-image Documents block every affected row before Batch submission.

## Visibility

The ENV value:

```text
LIFERAY_DEFAULT_CONTENT_VIEWABLE_BY=Anyone
```

only controls the default UI selection. Each run may choose:

```text
Anyone
Members
Owner
```

The selected visibility is stored in workbook metadata, validation session state, and every Structured Content payload item.

## Example: NXC Article

Select `NXC Article`, the `Articles` folder, the image source/folder containing the covers, and the desired visibility. Generate a template with Article fields such as Body and Cover Image. Use `file:article-cover.webp` or `erc:NXC_ARTICLE_COVER` in the single Cover Image Reference column.

## Example: NXC Hero

Select a flat `NXC Hero` Structure and the `Heroes` folder. Select the Site or Asset Library that stores the Hero images. The same importer generates Heading, Description, Hero Image Reference, and CTA columns from the live Structure. No Hero-specific code path is used.

## Batch request

```text
POST /o/headless-batch-engine/v1.0/import-task/com.liferay.headless.delivery.dto.v1_0.StructuredContent
  ?createStrategy={INSERT|UPSERT}
  &importStrategy={ON_ERROR_FAIL|ON_ERROR_CONTINUE}
  &siteId={SITE_ID}
```

Each payload item carries `contentStructureId`, `structuredContentFolderId`, `viewableBy`, title, ERC, and dynamic fields.

## Not in this release

ZIP image upload, nested/repeatable fields, Site selection, per-run locale selection, multi-source image fallback, downloadable reports, and database-backed import history remain future enhancements.
