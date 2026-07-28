# Liferay Structured Content Importer

Local tool for importing flat Liferay Structured Content from Excel. It provides a guided Web UI and an internal CLI for developers preparing test content.

## Current scope

- One configured Liferay Site.
- Flat, non-repeatable Content Structures.
- Existing Web Content target folder.
- Images already uploaded to the Current Site Documents and Media.
- Exact image lookup by file name or external reference code.
- `INSERT` and `UPSERT` Batch Engine imports.
- `Anyone`, `Members`, and `Owner` visibility.

Supported fields include text/rich text, boolean, date, integer, decimal, image, and single-value select/radio.

Nested, repeatable, relationship, document, geolocation, and grid fields are not imported. A required unsupported field blocks the selected Structure.

## Requirements

- Node.js `22.12+`.
- Liferay DXP `2026.Q1.1 LTS` target environment.
- OAuth2 Client Credentials application allowed to read Site content and submit Batch Engine tasks.

Install dependencies once:

```bash
cd tools/liferay-article-importer
npm install
```

Copy `.env.example` to `.env`. The local `.env` is ignored by Git.

```env
LIFERAY_BASE_URL=http://localhost:8080
LIFERAY_SITE_ID=34371
LIFERAY_OAUTH_CLIENT_ID=nexcent-import-tool
LIFERAY_OAUTH_CLIENT_SECRET=your-secret
LIFERAY_DEFAULT_LOCALE=en-US
LIFERAY_DEFAULT_CONTENT_VIEWABLE_BY=Anyone
```

## Web UI

The Web UI supports template download, workbook validation, Excel reports, Batch submission, and automatic status polling.

Start:

```bash
npm start
```

Open:

```text
http://127.0.0.1:4174
```

Workflow:

```text
Connect
→ choose Structure, Web Content folder, image folder, and visibility
→ download and fill the Excel template
→ upload and validate every row
→ download the validation report if needed
→ choose INSERT/UPSERT and error strategy
→ submit and monitor the Batch task
→ download the import report
```

## Internal CLI

The CLI runs only from this project directory and is intended for developers initializing content for testers.

Keep local Excel files in:

```text
tools/liferay-article-importer/workbooks/
```

The folder is committed, but its `.xlsx` files are ignored by Git.

### Interactive workflow

Run the main menu:

```bash
npm run cli
```

Or open a specific flow directly:

```bash
npm run cli init
npm run cli template
npm run cli validate
npm run cli import
```

`validate` and `import` ask for the workbook path when it is not provided. You may also provide it directly:

```bash
npm run cli validate .\workbooks\articles.xlsx
npm run cli import .\workbooks\articles.xlsx
```

During import, the CLI asks you to choose:

```text
INSERT or UPSERT
ON_ERROR_FAIL or ON_ERROR_CONTINUE
```

Pressing Enter selects the safe defaults: `INSERT` and `ON_ERROR_FAIL`.

Choosing `UPSERT` shows its folder-safety warning and asks for confirmation inside the interactive flow. No `--yes` flag is used.

`init` saves the selected Site settings, Structure, Web Content folder, Documents and Media folder, locale, visibility, and Client ID.

Profiles are stored at:

```text
Windows: %USERPROFILE%\.liferay-import\profiles
macOS/Linux: ~/.liferay-import/profiles
```

The Client Secret stays in the local `.env`; it is never stored in the CLI profile.

### Flags and automation

Plain positional commands do not require npm's `--` separator. Use the separator when passing options that start with `--`:

```bash
npm run cli -- status --latest
npm run cli -- import .\workbooks\articles.xlsx --dry-run
```

For non-interactive automation, pass all required choices explicitly:

```bash
npm run cli -- import .\workbooks\articles.xlsx --non-interactive --create-strategy INSERT --import-strategy ON_ERROR_FAIL
npm run cli -- import .\workbooks\articles.xlsx --non-interactive --create-strategy UPSERT --import-strategy ON_ERROR_CONTINUE --confirm-upsert
```

`--confirm-upsert` is required only for non-interactive UPSERT runs so a script cannot update existing content accidentally.

### Friendly failures

Normal CLI output explains what happened and the next action without printing internal error codes or stack traces.

Examples include:

- `Cancelled by user.` for `Ctrl + C`.
- `Import cancelled.` when an UPSERT confirmation is declined.
- Clear guidance for missing profiles, missing workbooks, invalid workbooks, OAuth failures, permission failures, unreachable Liferay, validation failures, and uncertain Batch submissions.

Use `--verbose` only when technical diagnostics are needed:

```bash
npm run cli -- import .\workbooks\articles.xlsx --verbose
```

Verbose output includes the internal code, status, sanitized details, and stack trace. Secret and token fields are redacted.

The CLI validates and revalidates before submission. It prints JSON results and stores the latest confirmed Batch task so `status --latest` works in a later process. Excel report download and automatic Batch polling currently belong to the Web UI.

## Excel workbook

The generated workbook contains:

- `Content Items`: import rows.
- `Field Guide`: field types, required flags, options, and accepted values.
- `Example`: non-imported sample data.
- `Metadata`: hidden binding to the selected Site, Structure, folders, locale, and visibility.

Required system columns:

```text
Content Title *
External Reference Code *
Friendly URL
```

`Friendly URL` is optional. When blank, it is generated from the title. Duplicate or invalid friendly URLs block validation.

Image fields accept:

```text
file:article-cover.webp
erc:NXC_ARTICLE_COVER
```

Matching is exact. Missing, duplicate, ambiguous, or non-image documents block the affected rows.

## Import safety

- Local validation errors block the entire submission.
- `INSERT` is the default and blocks existing ERC collisions.
- `UPSERT` requires confirmation because existing content keeps its current folder.
- Batch POST requests are not automatically retried.
- An uncertain Batch response is recorded as `BATCH_SUBMISSION_UNKNOWN`; check Liferay Batch Engine before retrying.
- The workbook is revalidated against current Liferay data immediately before import.

## Development checks

```bash
npm run check
npm test
npm run smoke:dev
npm run evidence
```

Automated checks cover TypeScript, UI build, Vite dev runtime, workbook contracts, validation, image resolution, reports, CLI configuration, profile persistence, and submission safety. Live Liferay runtime verification is still required for environment-specific behavior.
