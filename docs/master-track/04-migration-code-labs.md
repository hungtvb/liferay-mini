# Batch and Data Migration Code Labs

> The operational Article import path is a native Site Administration App. It accepts one ZIP containing Excel plus images. The browser-only Content Importer and separate asset picker are retired from the final baseline.

# Lab MIG-01 — Build the Article Import Package

## Package source

Use:

```text
training/master-track-code-labs/sample-data/nxc-article-import-template.xlsx
training/master-track-code-labs/sample-data/article-import-package/
```

Build:

```text
nexcent-article-import.zip
├── manifest.json
├── articles.xlsx
└── assets/
    ├── community-management-cover.webp
    ├── membership-guide-cover.webp
    └── safeguarding-guide-cover.webp
```

The workbook sheets are:

```text
Articles
Assets
Taxonomy
Instructions
```

Article headers:

```text
operation
externalReferenceCode
locale
title
friendlyUrlPath
summary
bodyHtml
coverImageKey
coverImageAlt
authorName
publicationDate
expirationDate
categoryERCs
tags
featured
sortOrder
publish
```

Asset headers:

```text
imageKey
filePath
documentERC
title
altText
folderERC
```

Rules:

- `coverImageKey` must resolve to exactly one Assets row.
- `filePath` is relative to `assets/`; absolute and parent paths are forbidden.
- D&M identity is `documentERC`, not filename or numeric ID.
- Keep `publish=false` for the first training run.
- Do not embed Base64 media in Excel.
- Do not include formulas, macros, external links, encrypted content, symlinks, or duplicate ZIP entries.

## Runtime flow

1. Sign in with the `Nexcent Content Importer` site role.
2. Open Site Menu → Content & Data → Nexcent Article Import.
3. Upload the ZIP. The UI stores it in the restricted D&M package folder.
4. Run Validate before any mutation.
5. Review package, image, taxonomy, permission, and Article row results.
6. Execute only from `VALIDATED`.
7. Confirm image upserts finish before dependent Article upserts.
8. Execute the identical package again.

## Checkpoint

- First run creates Documents and Media assets and Draft Articles.
- Second run produces `NO_CHANGE` without duplicate media, Articles, or unnecessary versions.
- Changed media bytes update the existing document by ERC.
- Images appear in the public Article assets folder.
- ZIP packages remain in the restricted import folder.
- Row errors identify package entry/sheet, row, field, stable code, and reason.

---

# Lab MIG-02 — Create and Track the Import Job

The UI first uploads the ZIP through the standard Documents API and receives `packageFileEntryId`. It then calls REST Builder:

```text
POST /o/nexcent-training/v1.0/sites/{siteId}/article-import-jobs
```

Request:

```json
{
  "externalReferenceCode": "NXC-ARTICLE-IMPORT-20260722-001",
  "packageFileEntryId": 38201,
  "structureExternalReferenceCode": "NXC-STRUCTURE-ARTICLE"
}
```

Then run:

```text
POST /sites/{siteId}/article-import-jobs/{jobERC}/validate
POST /sites/{siteId}/article-import-jobs/{jobERC}/execute
GET  /sites/{siteId}/article-import-jobs/{jobERC}
GET  /sites/{siteId}/article-import-jobs/{jobERC}/items
```

The service must verify that the package belongs to the current site and approved restricted folder. Editorial content stays in Web Content, images stay in Documents and Media, and operational status stays in Service Builder.

## Checkpoint

- Guest and unauthorized members receive `401/403`.
- A package from another site or folder is rejected.
- Validate mutates no Article or imported media.
- Execute persists progress and row results across page refresh.
- Retry is idempotent after a partial failure.

---

# Lab MIG-03 — Package a Version-Generated Batch Engine Export

## Important rule

Do not invent a `configuration` block for a Batch Client Extension. Generate the export from the same Liferay version that receives the import.

## Export flow

Use API Explorer or an authenticated request:

```text
POST /o/headless-batch-engine/v1.0/export-task/{className}/jsont?siteId={siteId}
GET  /o/headless-batch-engine/v1.0/export-task/{taskId}
GET  /o/headless-batch-engine/v1.0/export-task/{taskId}/content
```

Download and extract the JSONT export.

## Filter and package approved records

Run:

```bash
node training/master-track-code-labs/scripts/package-batch-export.mjs \
    /path/to/export.json \
    client-extensions/nexcent-training-batch-lab/batch \
    20-structured-content.batch-engine-data.json
```

The script:

- rejects a missing generated `configuration` block;
- requires an `items` array;
- keeps only records with an `NXC-` ERC;
- rejects duplicate ERCs;
- writes a formatted `*.batch-engine-data.json` payload.

For a clean environment, package dependencies in order:

```text
10-documents.batch-engine-data.json
20-structured-content.batch-engine-data.json
```

Structures and Templates are target prerequisites unless the target version exposes a supported portable creation API for them.

## Batch Client Extension source

Copy:

```text
client-extensions/nexcent-training-batch-lab/client-extension.yaml
```

The OAuth application includes:

```text
Liferay.Headless.Batch.Engine.everything
Liferay.Headless.Delivery.everything
```

## Build

```bash
cd client-extensions/nexcent-training-batch-lab
../../gradlew clean build
find dist -maxdepth 1 -type f -name '*.zip' -print
```

## Deploy

```bash
cp dist/*.zip ../../bundles/osgi/client-extensions/
```

Deploy the same package twice and inspect Batch Engine tasks after each deployment.

## Checkpoint

- The archive contains payloads under `batch/`.
- The OAuth Headless Server Client Extension is registered.
- The first deployment imports the approved records.
- The second deployment does not create duplicate ERCs.
- Failed items show actionable dependency, permission, or validation errors.
- Export/import evidence is recorded in `SUBMISSION.md`.

---

# Final Migration Evidence

Capture:

1. ZIP package name, manifest version, workbook, and asset entries.
2. Site Administration App and restricted package upload evidence.
3. Validation summary before mutation.
4. First import media and Article create counts.
5. Second import `NO_CHANGE` counts.
6. Web Content and Documents and Media screenshots.
7. ImportJob REST response and row results.
8. Batch task IDs and final statuses.
9. Failed item details, when present.
