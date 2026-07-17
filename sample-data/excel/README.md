# Nexcent Excel Sample

The sample workbook is generated from the version-controlled JSON source instead of being edited as an opaque binary file.

## Generate the workbook

From the repository root:

```bash
cd client-extensions/nexcent-landing-elements
npm install
npm run generate:workbook
```

The command creates:

```text
sample-data/excel/nexcent-content.xlsx
```

## Workbook sheets

| Sheet | Purpose |
|---|---|
| `Instructions` | Import guidance and validation rules |
| `Heroes` | `NXC Landing Hero` articles |
| `ServicesIntro` | `NXC Services Intro` articles |
| `Services` | `NXC Service Item` articles |
| `Features` | `NXC Feature Item` articles |

Do not rename sheets or column headers. The importer maps each header to the Web Content field reference documented in Labs 05 and 06.

## Asset paths

Workbook values such as:

```text
assets/hero-illustration.svg
```

are portable references. When running the importer, select the actual files from `sample-data/assets/`. Matching uses the filename, so numeric Liferay document IDs never appear in the workbook.

## Idempotency

Every row has a stable `externalReferenceCode`. Running the same workbook again updates the matching Web Content instead of creating duplicates.

## Source of truth

Edit this file when sample content changes:

```text
sample-data/json/landing-content.json
```

Then regenerate the workbook. Do not manually maintain conflicting JSON, CSV, and Excel values.
