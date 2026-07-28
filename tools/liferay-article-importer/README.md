# Liferay Structured Content Importer

Local Excel importer for flat, non-repeatable Liferay Structured Content.

- Web UI: guided template, validation, import, and reports.
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

The Web UI reads its connection values from `.env`. CLI `init` stores non-sensitive selections in `~/.liferay-import`.

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

Direct flows:

```bash
npm run cli init
npm run cli template
npm run cli validate
npm run cli import
npm run cli -- status --latest
```

Pass the workbook directly or let the CLI ask for it:

```bash
npm run cli import .\workbooks\articles.xlsx
```

Safe defaults:

```text
createStrategy = INSERT
importStrategy = ON_ERROR_FAIL
```

Non-interactive examples:

```bash
npm run cli -- import .\workbooks\articles.xlsx --non-interactive --create-strategy INSERT --import-strategy ON_ERROR_FAIL

npm run cli -- import .\workbooks\articles.xlsx --non-interactive --create-strategy UPSERT --import-strategy ON_ERROR_CONTINUE --confirm-upsert
```

Useful flags: `--profile`, `--dry-run`, `--verbose`, and `--non-interactive`.

Put local Excel files in `workbooks/`. The folder is tracked; `.xlsx` files are ignored.

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

## Safety

- Validation failures block Batch submission.
- `INSERT` blocks existing ERC collisions.
- `UPSERT` updates by ERC and keeps existing items in their current folder.
- Batch POST is not retried automatically.
- Check Liferay Batch Engine before retrying an uncertain submission.

## Layout

```text
cli/             CLI, terminal output, profiles, and latest-run state
server/          Shared Liferay, workbook, validation, and import services
ui/              React Web UI
scripts/         Static contract checks
test/            Node unit tests and CLI process regression tests
dev-smoke/       Vite development-runtime Playwright smoke test
evidence-tests/  Built-preview Playwright journey
workbooks/       Local Excel files
```

The two Playwright suites are intentional: one checks Vite dev runtime behavior, the other checks the built preview.

## Checks

```bash
npm run check
npm test
npm run smoke:dev
npm run evidence
```

`npm run check` covers typecheck, UI build, static contracts, and CLI help. Live Liferay verification is still required for runtime-dependent changes.
