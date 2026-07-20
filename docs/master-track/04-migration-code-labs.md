# Batch and Data Migration Code Labs

# Lab MIG-01 — Prepare Excel Import Data

## Sample data

Use:

```text
training/master-track-code-labs/sample-data/community-articles.csv
```

Open the file in Excel and save it as:

```text
community-articles.xlsx
```

Do not rename the headers. The import contract is:

```text
externalReferenceCode
title
summary
imageFileName
imageAlt
linkLabel
linkUrl
publicationDate
sortOrder
active
```

Prepare the matching image files in one folder:

```text
assets/
├── community-01.jpg
├── community-02.jpg
└── community-03.jpg
```

For the full 12-content-group workbook, use the implemented generator:

```bash
cd client-extensions/nexcent-landing-elements
npm ci
npm run generate:workbook
```

## Importer build

```bash
npm run typecheck
npm test
npm run build
../../gradlew clean build
cp dist/*.zip ../../bundles/osgi/client-extensions/
```

## Runtime test

1. Add `Nexcent Content Importer` to an administrator-only page.
2. Select the workbook and asset files.
3. Run validation before mutation.
4. Confirm the asset upload step finishes before Structured Content creation.
5. Run the import.
6. Run the same import a second time.

## Checkpoint

- First run creates the three Community records.
- Second run updates by ERC and creates no duplicates.
- Images appear in Documents and Media.
- Content appears in Site Content → Web Content.
- Row-level errors identify the sheet, row, field, and reason.

---

# Lab MIG-02 — Create an Import Job through REST Builder

Before starting the browser mutation, create an operational job:

```text
POST /o/nexcent-training/v1.0/sites/{siteId}/import-jobs
```

Request:

```json
{
  "externalReferenceCode": "NXC-IMPORT-20260720-001",
  "fileName": "community-articles.xlsx",
  "totalRows": 3
}
```

After the import, use `ImportJobLocalService.completeImportJob(...)` from the orchestration layer to persist success and failure counts.

Editorial content stays in Web Content. Operational status stays in the Service Builder table.

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

1. Workbook and asset folder names.
2. Validation summary before mutation.
3. First import create counts.
4. Second import update counts.
5. Web Content and Documents and Media screenshots.
6. ImportJob REST response.
7. Batch task IDs and final statuses.
8. Failed item details, when present.
