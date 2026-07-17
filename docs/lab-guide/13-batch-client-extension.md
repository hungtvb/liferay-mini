# Lab 13 — Build a Deployable Batch Client Extension

## Overview

Package the Nexcent Web Content created in Lab 12 as a real Liferay Batch Client Extension.

This lab uses the official Batch Engine workflow:

```text
Published NXC Web Content in the source site
                 ↓
Batch Engine export using the StructuredContent DTO and jsont format
                 ↓
Filter exported items by external reference code prefix NXC-
                 ↓
10-structured-content.batch-engine-data.json
                 ↓
Batch Client Extension LUFFA
                 ↓
Batch Engine import during deployment
```

## Estimated time

90–130 minutes.

## Prerequisites

- Labs 00–12 are complete.
- The local site contains the seven imported `NXC-*` Web Content articles.
- The articles are published or approved according to the site workflow.
- The four required Web Content Structures exist in the target site.
- Referenced Documents and Media assets exist in the target environment.
- Java 21, Blade CLI, Node.js, `curl`, and an archive extraction tool are installed.
- macOS/Linux users also need `jq` and `unzip`.

## Learning goals

By the end of this lab, you can:

1. Explain the difference between a runtime Excel importer and a Batch Client Extension.
2. Export Headless DTO data through Liferay's Batch Engine.
3. Use the required `jsont` format for a Batch Client Extension payload.
4. Preserve the export-generated configuration block.
5. Filter exported entities using stable external reference codes.
6. Configure a batch extension and its OAuth headless server.
7. Package files under the LUFFA `batch/` directory.
8. Deploy and verify an UPSERT-style data migration.

## Important distinction

Lab 12 and Lab 13 solve different problems:

| Concern | Lab 12 | Lab 13 |
|---|---|---|
| Input | User-selected Excel and images | Batch Engine `jsont` export |
| Trigger | User clicks Import | Client Extension deployment |
| Runtime | Browser Custom Element | Batch Engine job |
| Authentication | Signed-in browser session | OAuth headless server |
| Main use | Editorial migration tool | Repeatable environment seed or transfer |

Do not rename the Excel uploader to “Batch Client Extension.” A batch extension is a separate deployable project.

---

## Part 1 — Create the project

### Step 1 — Add the directory structure

Create:

```text
client-extensions/nexcent-content-batch/
├── batch/
│   └── README.md
└── client-extension.yaml
```

The generated payload is added later as:

```text
batch/10-structured-content.batch-engine-data.json
```

Liferay processes multiple payload files in alphanumeric order. Numeric filename prefixes make dependencies explicit.

### Step 2 — Configure assembly

Add:

```yaml
assemble:
    - from: batch
      into: batch
```

When the project builds, every `*.batch-engine-data.json` file under the source `batch/` folder is copied into the LUFFA's root `batch/` folder.

### Step 3 — Define the batch extension

```yaml
nexcent-content-batch:
    name: Nexcent Web Content Batch
    oAuthApplicationHeadlessServer: nexcent-content-batch-oauth
    type: batch
```

A batch extension requires an OAuth application headless server identity.

### Step 4 — Add the OAuth server

```yaml
nexcent-content-batch-oauth:
    .serviceAddress: localhost:8080
    .serviceScheme: http
    name: Nexcent Web Content Batch OAuth
    scopes:
        - Liferay.Headless.Batch.Engine.everything
        - Liferay.Headless.Delivery.everything
    type: oAuthApplicationHeadlessServer
```

The two scopes allow the job to execute Batch Engine tasks and work with Structured Content through Headless Delivery.

The `localhost:8080` address is correct for this self-hosted local lab. Use environment-appropriate service configuration for cloud deployment.

---

## Part 2 — Understand the payload contract

### Step 5 — Use the Structured Content DTO class name

The export class is:

```text
com.liferay.headless.delivery.dto.v1_0.StructuredContent
```

You can verify it in your local API Explorer at:

```text
http://localhost:8080/o/api
```

Open the `StructuredContent` schema and inspect its `x-class-name` value.

### Step 6 — Use `jsont`

A Batch Client Extension payload must originate from the Batch Engine's `jsont` export format.

Do not:

- Rename an arbitrary REST response to `.batch-engine-data.json`.
- Hand-write the configuration block from memory.
- Copy numeric IDs from screenshots.
- Convert the Excel workbook directly into an unverified Batch Engine payload.

The running Liferay version generates the compatible configuration and item format.

### Step 7 — Examine the exported shape

A generated file has two top-level members:

```json
{
  "configuration": {
    "className": "com.liferay.headless.delivery.dto.v1_0.StructuredContent",
    "parameters": {
      "createStrategy": "UPSERT",
      "importStrategy": "ON_ERROR_FAIL",
      "updateStrategy": "UPDATE"
    },
    "taskItemDelegateName": "DEFAULT"
  },
  "items": []
}
```

Exact fields can vary with the running Liferay release. Preserve the configuration generated by your instance.

---

## Part 3 — Export the source site's data

### Step 8 — Configure local credentials

The included scripts use Basic Authentication only for this local training environment.

macOS/Linux:

```bash
export LIFERAY_HOST=http://localhost:8080
export LIFERAY_SITE_ID=YOUR_SITE_ID_OR_ERC
export LIFERAY_USER=YOUR_ADMIN_EMAIL
export LIFERAY_PASSWORD=YOUR_LOCAL_PASSWORD
export LIFERAY_ERC_PREFIX=NXC-
```

Windows PowerShell:

```powershell
$env:LIFERAY_HOST = "http://localhost:8080"
$env:LIFERAY_SITE_ID = "YOUR_SITE_ID_OR_ERC"
$env:LIFERAY_USER = "YOUR_ADMIN_EMAIL"
$env:LIFERAY_PASSWORD = "YOUR_LOCAL_PASSWORD"
$env:LIFERAY_ERC_PREFIX = "NXC-"
```

In DXP 2026, the Batch Engine site parameter accepts a site ID, key, or external reference code. Using the site ERC improves portability of the command.

Never commit passwords to Git.

### Step 9 — Run the export script

macOS/Linux:

```bash
chmod +x scripts/batch/export-structured-content.sh
./scripts/batch/export-structured-content.sh
```

Windows PowerShell:

```powershell
Set-ExecutionPolicy Bypass -Scope Process
.\scripts\batch\export-structured-content.ps1
```

The script performs these calls:

```text
POST /o/headless-batch-engine/v1.0/export-task/{className}/jsont?siteId={site}
GET  /o/headless-batch-engine/v1.0/export-task/{taskId}
GET  /o/headless-batch-engine/v1.0/export-task/{taskId}/content
```

It waits for `executeStatus=COMPLETED`, downloads the ZIP, extracts the `jsont` payload, and passes it to the preparation script.

### Step 10 — Filter the Nexcent records

The preparation command is:

```bash
node scripts/batch/prepare-structured-content-export.mjs \
  exported-structured-content.jsont \
  client-extensions/nexcent-content-batch/batch/10-structured-content.batch-engine-data.json \
  NXC-
```

The script:

1. Verifies `configuration.className`.
2. Verifies an `items` array exists.
3. Keeps only ERCs beginning with `NXC-`.
4. Rejects missing or duplicate ERCs.
5. Preserves the export-generated configuration and item data.
6. Writes a formatted `.batch-engine-data.json` file.

Expected output:

```text
Prepared 7 Structured Content items in .../10-structured-content.batch-engine-data.json.
```

### Step 11 — Inspect the generated payload

Open the file and verify:

- `configuration.className` is `StructuredContent`.
- There are seven items.
- Every ERC begins with `NXC-`.
- Hero, Services Intro, three Services, and two Features are present.
- The export does not include unrelated site articles.

Treat the generated JSON as deployment data. Review it before committing it to a delivery branch.

---

## Part 4 — Understand dependencies and portability

### Step 12 — Keep prerequisite models available

`StructuredContent` requires a valid Web Content Structure. Image fields require Documents and Media assets.

For this mini project, prepare a target environment in this order:

```text
1. Create the four Structures and Templates from Labs 05–06
2. Upload or migrate the six assets
3. Deploy the Structured Content Batch Client Extension
4. Verify the articles
```

The current Web Content APIs do not provide a supported create endpoint for Classic Web Content Structures and Templates, so the course keeps their creation as an explicit setup prerequisite.

### Step 13 — Do not assume numeric IDs are portable

An exported item may include environment-specific numeric IDs. The exported `jsont` is the correct Batch Engine format, but a target environment must contain compatible prerequisite entities.

For a production migration:

- Export related dependencies through supported batch APIs where available.
- Use external reference codes consistently.
- Preserve file ordering.
- Test the complete package on a clean environment.
- Never edit IDs blindly until an import “looks green.”

The local lab first proves the deployment mechanism against the instance that produced the export.

---

## Part 5 — Validate and deploy

### Step 14 — Validate the payload locally

The repository includes a fixture used only for CI:

```text
scripts/batch/fixtures/structured-content-export.jsont
```

Run the preparation script manually:

```bash
node scripts/batch/prepare-structured-content-export.mjs \
  scripts/batch/fixtures/structured-content-export.jsont \
  /tmp/10-structured-content.batch-engine-data.json \
  NXC-
```

The output must contain one `NXC-HERO-001` item and exclude the unrelated fixture item.

### Step 15 — Build the Client Extension

From the workspace root:

```bash
./gradlew :client-extensions:nexcent-content-batch:build
```

Inspect the generated archive. It must contain:

```text
batch/10-structured-content.batch-engine-data.json
```

A batch payload outside the archive's `batch/` directory is ignored.

### Step 16 — Deploy

```bash
./gradlew :client-extensions:nexcent-content-batch:deploy
```

Watch the Tomcat log for:

- OAuth application registration
- Batch Client Extension deployment
- Batch import task creation
- Imported or updated item counts
- Any failed item and its error message

### Step 17 — Verify Web Content

Open:

```text
Site Menu → Content & Data → Web Content
```

Verify the seven `NXC-*` articles still exist and display the expected content.

### Step 18 — Prove repeatability

Deploy the same Batch Client Extension again.

Expected behavior:

- The Batch Engine uses the exported strategy.
- Existing records are updated or left consistent rather than duplicated.
- ERCs remain stable.
- No unrelated Web Content is imported.

If the exported configuration does not use an UPSERT-compatible strategy, re-export through the current Batch Engine instead of manually inventing strategy fields.

---

## Expected result

- `nexcent-content-batch` is a real `type: batch` Client Extension.
- The project packages a valid exported `.batch-engine-data.json` file.
- OAuth scopes cover Batch Engine and Headless Delivery.
- Only `NXC-*` Web Content is included.
- Deployment imports or updates the seven sample articles.
- A second deployment does not create duplicate ERCs.
- The runtime Excel importer remains a separate Custom Element.

## Checkpoint

- [ ] The source site contains seven published `NXC-*` articles.
- [ ] The export format is `jsont`.
- [ ] The generated filename ends with `.batch-engine-data.json`.
- [ ] The payload is under the Client Extension's `batch/` directory.
- [ ] The payload contains the export-generated configuration block.
- [ ] Exactly seven `NXC-*` items are included.
- [ ] The OAuth headless server has Batch Engine and Headless Delivery scopes.
- [ ] The Batch Client Extension builds successfully.
- [ ] Deployment completes without failed items.
- [ ] A second deployment does not create duplicate ERCs.

## Troubleshooting

### Export task remains `INITIAL` or `STARTED`

Continue polling the task endpoint. Large exports are asynchronous. This lab times out after 120 seconds to avoid hanging indefinitely.

### Export task is `FAILED`

Read `errorMessage`. Confirm the class name, site identifier, credentials, and permissions.

### No items use the `NXC-` prefix

Verify the articles were imported with the ERC values from the sample workbook. Titles do not replace ERCs.

### Deployment ignores the JSON file

Confirm:

- The extension is `type: batch`.
- `assemble` copies `batch` into `batch`.
- The filename ends with `.batch-engine-data.json`.
- The built archive contains the file.

### HTTP 401 during deployment

The OAuth application or service configuration is invalid. Check the OAuth companion entry and server address.

### HTTP 403 during deployment

The OAuth token is valid but a required scope is missing. Verify:

```text
Liferay.Headless.Batch.Engine.everything
Liferay.Headless.Delivery.everything
```

### Import fails on `contentStructureId`

The target site does not contain a compatible Structure. Create or migrate the prerequisite Structure before deploying content.

### Image fields fail

The target environment is missing compatible Documents and Media dependencies. Migrate assets first or regenerate the export from the target-ready source environment.

## Knowledge check

1. Why must Batch Client Extension payloads use `jsont`?
2. What is the purpose of the configuration block?
3. Why does the project filter by ERC after export?
4. Why is file ordering important when multiple payloads have dependencies?
5. Why does a Batch Client Extension require an OAuth headless server?
6. Why can a correctly formatted Structured Content export still fail on a clean target environment?
7. How does Lab 13 differ from the Excel uploader in Lab 12?

## Challenge

1. Export Documents through the Batch Engine and package them as an earlier numbered payload.
2. Split Hero, Services, and Features into separate files and define their processing order.
3. Add a CI check that rejects any exported item whose ERC does not start with `NXC-`.
4. Test the complete package on a second clean Liferay bundle.

## Official references

- Importing and exporting data: https://learn.liferay.com/w/dxp/development/importing-exporting-data
- Batch YAML configuration: https://learn.liferay.com/w/dxp/development/importing-exporting-data/batch-yaml-configuration-reference
- Packaging Client Extensions: https://learn.liferay.com/w/dxp/development/client-extensions/packaging-client-extensions
- Batch Engine export API: https://learn.liferay.com/w/dxp/integration/headless-apis/using-liferay-as-a-headless-platform/consuming-apis/batch-engine-api-basics-exporting-data
