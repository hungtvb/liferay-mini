# Liferay Structured Content Importer

Local Excel importer for flat, non-repeatable Liferay Structured Content.

- Web UI: template, validation, import, and Excel reports.
- CLI: developer workflow for preparing tester content.
- Batch strategies: `INSERT` and `UPSERT`.

Nested/repeatable fields, relationships, documents, geolocation, and grids are not supported.

## Setup

Requirements: Node.js `22.12+`, Liferay DXP `2026.Q1.1 LTS`, and an OAuth2 Client Credentials application with Headless Delivery and Batch Engine access.

```bash
cd tools/liferay-article-importer
npm install
```

Copy `.env.example` to `.env` and set at least:

```env
LIFERAY_OAUTH_CLIENT_SECRET=your-secret
```

The Web UI reads connection values from `.env`. CLI `init` stores non-sensitive selections in `~/.liferay-import`.

## Web UI

```bash
npm start
```

Open `http://127.0.0.1:4174`.

```text
Connect → Configure → Template → Validate → Import → Report
```

## CLI

Interactive menu:

```bash
npm run cli
```

Main commands:

```bash
npm run cli init
npm run cli template
npm run cli validate
npm run cli import
npm run cli report
npm run cli -- status --latest
```

Pass a workbook directly or let the CLI ask for it:

```bash
npm run cli import .\workbooks\articles.xlsx
npm run cli report validation .\workbooks\articles.xlsx
```

Export the latest completed import report:

```bash
npm run cli -- report import --latest
```

Export a report for a specific Batch task:

```bash
npm run cli report import 12345 .\workbooks\articles.xlsx
```

Reports default to `reports/`. Override the file path with `--output`:

```bash
npm run cli -- report import --latest --output .\reports\latest-import.xlsx
```

Safe import defaults:

```text
createStrategy = INSERT
importStrategy = ON_ERROR_FAIL
```

Non-interactive examples:

```bash
npm run cli -- import .\workbooks\articles.xlsx --non-interactive --create-strategy INSERT --import-strategy ON_ERROR_FAIL

npm run cli -- import .\workbooks\articles.xlsx --non-interactive --create-strategy UPSERT --import-strategy ON_ERROR_CONTINUE --confirm-upsert
```

Useful flags: `--profile`, `--output`, `--dry-run`, `--verbose`, and `--non-interactive`.

Put local Excel files in `workbooks/`. Generated reports and local `.xlsx` files are ignored by Git.

## Workbook contract

Generated sheets:

- `Content Items`: import rows.
- `Field Guide`: field contract.
- `Example`: sample data, not imported.
- `Metadata`: hidden Site/Structure/folder binding.

Required columns:

```text
Content Title *
External Reference Code *
Friendly URL
```

Image values use exact matching:

```text
file:article-cover.webp
erc:NXC_ARTICLE_COVER
```

Upload images to the selected Documents and Media folder before import.

## Reports

Validation report:

```text
Summary
Rows
Issues
```

Import report adds:

```text
Batch
Batch Failed Items (when available)
```

The CLI stores the original validation snapshot for each submitted Batch task so later import reports match that import run.

## Safety

- Validation failures block Batch submission.
- `INSERT` blocks existing ERC collisions.
- `UPSERT` updates by ERC and keeps existing items in their current folder.
- Batch POST is not retried automatically.
- Import reports are available only after the Batch task reaches a terminal status.
- Check Liferay Batch Engine before retrying an uncertain submission.

## Layout

```text
cli/        CLI, terminal output, profiles, run state, and report snapshots
server/     Shared Liferay, workbook, validation, import, and report services
ui/         React Web UI
scripts/    Static contract checks
test/       Node unit and CLI regression tests
workbooks/  Local Excel files
reports/    Generated CLI reports
```

## Checks

```bash
npm run check
npm test
```

`npm run check` covers typecheck, UI build, static contracts, and CLI help. Live Liferay verification is still required for runtime-dependent changes.
