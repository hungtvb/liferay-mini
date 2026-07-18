# 09 — Build the Excel Content Importer

## Current delivery status (2026-07-18)

- **Implemented:** all 12 content sheets below are parsed into the corresponding `NXC-*` payloads; `Instructions` is intentionally not an import payload.
- **Safety contract implemented:** validation completes before mutation, ERC-based upsert is used for repeatability, assets are resolved before Structured Content, and failures include sheet/row/field detail plus a downloadable report.
- **Automated evidence:** importer unit tests cover workbook parsing, invalid values, duplicate ERCs, unsafe HTML, partial CTA pairs, missing assets, and upsert/report behavior. `npm test`, `npm run typecheck`, `npm run build`, workbook generation, and **Landing Elements Check** pass for [PR #12](https://github.com/hungtvb/liferay-mini/pull/12).
- **Runtime acceptance still required:** execute first and second imports against a clean Liferay site and attach Web Content/Documents and Media screenshots plus the two generated reports. Source tests prove the mutation plan; they do not replace a live API import.

## Goal

Import all backend-managed landing-page content and assets through a browser Custom Element.

The importer is not the Batch Client Extension. It is an editorial migration tool that parses Excel and calls Liferay APIs from the signed-in browser session.

## Workbook contract

```text
Instructions
Heroes
ClientsIntro
Clients
ServicesIntro
Services
Features
StatisticsIntro
Statistics
Testimonials
CommunityIntro
CommunityCards
CTA
```

Columns use the Structure field references defined in the component contract.

## FE tasks

- Extend `nexcent-content-importer` to support every sheet.
- Parse Excel with ExcelJS.
- Show sheet, row, field, and error details.
- Let the user select the workbook and referenced asset files.
- Validate before any API mutation.
- Upload missing Documents and Media assets.
- Create or update Structured Content by ERC.
- Display created, updated, skipped, and failed counts.
- Allow downloading or copying a migration report.

## BE tasks

- Own workbook columns and allowed values.
- Configure Structure discovery by stable name/ERC.
- Configure API permissions.
- Define asset ERC and filename matching.
- Define allowed HTML, URL schemes, select values, and record dependencies.

## Required validation

- Missing required field.
- Duplicate ERC inside workbook.
- Existing ERC resolution.
- Duplicate or invalid sort order.
- Missing asset.
- Invalid image position or background variant.
- Invalid URL scheme.
- Unsafe HTML.
- Partial CTA pair: label without URL or URL without label.
- Numeric value and date parsing.

## Import order

```text
1. Validate workbook and files
2. Upload or resolve assets
3. Resolve Structures
4. Import singleton intro/CTA records
5. Import collection items
6. Publish report
```

## Repeatability test

First run:

```text
created > 0
updated = 0 or only pre-existing samples
failed = 0
```

Second run using the same ERCs:

```text
created = 0
updated = expected record count
failed = 0
no duplicate Web Content
```

## Checkpoint

- [x] All Figma-managed content types are represented in the workbook.
- [x] Validation blocks bad rows before mutation.
- [x] Assets are uploaded or resolved before Structured Content in the import plan.
- [ ] Imported articles appear in Site Content → Web Content.
- [ ] Second import is idempotent by ERC.
