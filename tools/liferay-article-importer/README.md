# Liferay Structured Content Importer

Local tool for importing flat Liferay Structured Content from Excel.

It provides:

- Web UI for guided migration and reports.
- CLI for developers preparing test content.
- Liferay Batch Engine import using `INSERT` or `UPSERT`.

## Scope

Supported:

- One configured Liferay Site.
- Flat, non-repeatable Content Structures.
- Existing Web Content and Documents and Media folders.
- Images referenced by exact file name or document ERC.
- Visibility: `Anyone`, `Members`, or `Owner`.

Not supported: nested/repeatable fields, relationships, documents, geolocation, and grids.

## Setup

Requirements:

- Node.js `22.12+`.
- Liferay DXP `2026.Q1.1 LTS` target environment.
- OAuth2 Client Credentials application with Headless Delivery and Batch Engine access.

```bash
cd tools/liferay-article-importer
npm install
```

Copy `.env.example` to `.env` and set the OAuth secret:

```env
LIFERAY_OAUTH_CLIENT_SECRET=your-secret
```

The Web UI also reads the other values from `.env`. The CLI stores non-sensitive selections in `~/.liferay-import` after `init`.

## Web UI

```bash
npm start
```

Open `http://127.0.0.1:4174`.

Flow:

```text
Connect → Configure → Download template → Validate → Import → Export report
```

## CLI

Run the interactive menu:

```bash
npm run cli
```

Open a flow directly:

```bash
npm run cli init
npm run cli template
npm run cli validate
npm run cli import
npm run cli -- status --latest
```

`validate` and `import` ask for the workbook when no path is supplied:

```bash
npm run cli import .\workbooks\articles.xlsx
```

Import defaults:

```text
createStrategy = INSERT
importStrategy = ON_ERROR_FAIL
```

Interactive mode asks for both strategies. `UPSERT` requires confirmation.

Full non-interactive examples:

```bash
npm run cli -- import .\workbooks\articles.xlsx --non-interactive --create-strategy INSERT --import-strategy ON_ERROR_FAIL

npm run cli -- import .\workbooks\articles.xlsx --non-interactive --create-strategy UPSERT --import-strategy ON_ERROR_CONTINUE --confirm-upsert
```

Useful flags:

```text
--profile <name>
--dry-run
--verbose
--non-interactive
```

Local workbooks belong in `workbooks/`. The folder is tracked; `.xlsx` files are ignored.

## Workbook

Generated sheets:

- `Content Items`: import rows.
- `Field Guide`: generated field contract.
- `Example`: sample values, not imported.
- `Metadata`: hidden binding to Site, Structure, folders, locale, and visibility.

Required columns:

```text
Content Title *
External Reference Code *
Friendly URL
```

Image values:

```text
file:article-cover.webp
erc:NXC_ARTICLE_COVER
```

Matching is exact. Upload images to the selected Documents and Media folder before import.

## Safety

- Validation errors block Batch submission.
- `INSERT` blocks existing ERC collisions.
- `UPSERT` updates by ERC and keeps existing content in its current folder.
- Batch POST is not automatically retried.
- If submission status is uncertain, check Liferay Batch Engine before retrying.
- The workbook is revalidated immediately before import.

## Project layout

```text
cli/             Interactive CLI and local profile storage
server/          Shared Liferay, workbook, validation, and import services
ui/              React Web UI
scripts/         Contract checks
test/            Node unit and CLI process tests
dev-smoke/       Vite development-runtime smoke test
evidence-tests/  Production-preview Playwright journey
workbooks/       Local Excel files; ignored by Git
```

The two Playwright suites are intentionally separate: `dev-smoke` checks the Vite development runtime, while `evidence-tests` checks the built production preview.

## Development checks

```bash
npm run check
npm test
npm run smoke:dev
npm run evidence
```

`npm run check` runs typecheck, UI build, workbook contracts, and CLI help. `npm test` runs Node tests. Live Liferay verification is still required before merging runtime-dependent changes.
