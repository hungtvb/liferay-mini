# Article Pipeline Code Labs

> **Status:** DESIGN READY / IMPLEMENTATION AND RUNTIME QA PENDING
>
> Target runtime: Liferay DXP 2026.Q1.1. Complete these labs on a clean local bundle and keep screenshots for every checkpoint. Do not merge the Article branch until the final screenshot matrix passes.

Read first:

- [`../architecture/article-content-pipeline.md`](../architecture/article-content-pipeline.md)
- [`../contracts/article-contract.md`](../contracts/article-contract.md)

---

# Lab ART-01 — Create the Article Structure

## 1. Create the Structure

Open:

```text
Site Menu → Content & Data → Web Content → Structures
```

Create:

```text
Name: NXC Article
Key:  NXC_ARTICLE
ERC:  NXC-STRUCTURE-ARTICLE
```

Add the exact field references:

| Label | Field Reference | Type | Required |
|---|---|---|---:|
| Summary | `summary` | Long Text | Yes |
| Body | `body` | Rich Text | Yes |
| Cover Image | `coverImage` | Image | Yes |
| Cover Image Alt | `coverImageAlt` | Text | Yes |
| Author Name | `authorName` | Text | Yes |
| Featured | `featured` | Boolean | Yes |
| Sort Order | `sortOrder` | Integer/Number | Yes |

Do not add title, friendly URL, publish date, expiration date, categories, tags, status, or ERC as custom fields. Liferay already owns them.

## 2. Export the Structure

Export the Structure JSON from the target runtime. Keep the runtime-generated JSON unedited as the deployment artifact; it captures the schema syntax supported by that exact release.

## Checkpoint

- Structure ERC and key match exactly.
- Field references match exactly and are not localized labels.
- The exported JSON can be re-imported on a clean test site.

---

# Lab ART-02 — Create Taxonomy and Media ERCs

## 1. Create the vocabulary

Create `NXC Article Topics` with ERC:

```text
NXC-VOCABULARY-ARTICLE-TOPICS
```

Create categories:

```text
NXC-TOPIC-MEMBERSHIP  → Membership
NXC-TOPIC-SAFEGUARDING → Safeguarding
NXC-TOPIC-COMMUNITY   → Community
NXC-TOPIC-TECHNOLOGY  → Technology
```

Associate the vocabulary with Web Content where the runtime requires asset-type configuration.

## 2. Upload cover images

Create a Documents and Media folder for Article covers. Upload the three sample images and assign:

```text
NXC-DOC-COMMUNITY-01
NXC-DOC-COMMUNITY-02
NXC-DOC-COMMUNITY-03
```

The workbook references media by ERC, not filename or numeric `fileEntryId`.

## Checkpoint

- Every category and image resolves by ERC.
- Guest can view only the media used by published public Articles.
- Import upload files are stored in a separate restricted folder.

---

# Lab ART-03 — Build Article Detail

## 1. Create Display Page Template

Open Display Page Templates and create:

```text
NXC Article Detail
```

Associate it with `NXC Article` and map:

| UI element | Source |
|---|---|
| H1 | Web Content title |
| Hero image | `coverImage` |
| Image alt | `coverImageAlt` |
| Lead | `summary` |
| Author | `authorName` |
| Date | system publish date |
| Body | `body` |
| Topics | asset categories |

Set this template as the default for the Structure.

## 2. Create one manual Article

Use ERC `NXC-ARTICLE-MANUAL-001`, save it as Draft, review the preview, then publish it.

## 3. Verify canonical detail URL

Open:

```text
http://localhost:8080/w/<friendly-url-path>
```

Do not create a separate site page for the Article.

## Checkpoint

- Draft is not publicly visible.
- Published detail renders through the Display Page Template.
- H1, alt text, body links, canonical URL, and SEO preview are correct.

---

# Lab ART-04 — Inspect Headless Delivery

Use API Explorer or authenticated curl:

```text
GET /o/headless-delivery/v1.0/sites/{siteId}/content-structures
GET /o/headless-delivery/v1.0/content-structures/{structureId}/structured-contents?flatten=true&page=1&pageSize=9&sort=datePublished:desc
GET /o/headless-delivery/v1.0/structured-contents/{structuredContentId}
```

Resolve the Structure by ERC/key before using its runtime ID. Inspect:

```text
/o/headless-delivery/v1.0/openapi.json
```

Use only fields declared filterable by the running OpenAPI contract. Do not invent OData filters.

## Checkpoint

- The response contains every Article field reference.
- Guest receives published public content only.
- Numeric IDs appear only in runtime requests, never checked-in frontend configuration.

---

# Lab ART-05 — Prepare and Validate Excel

Use:

```text
training/master-track-code-labs/sample-data/nxc-article-import-template.xlsx
```

The workbook has `Articles`, `Taxonomy`, and `Instructions` sheets. Keep headers unchanged.

Before upload:

- verify all image and category ERCs exist;
- keep `publish=false` for the first run;
- use UTC Date/Time values;
- keep one `(externalReferenceCode, locale)` per row;
- remove formulas, macros, and external links.

Upload the workbook, run **Validate**, review all row results, then run **Execute** only when the job is `VALIDATED`.

## Negative exercises

Create separate workbook copies containing:

1. duplicate ERC and locale;
2. unknown image ERC;
3. unknown category ERC;
4. duplicate friendly URL;
5. unsafe `<script>` HTML;
6. invalid publication/expiration order;
7. a formula cell.

Every case must fail validation before Article mutation.

## Checkpoint

- First valid run creates Draft Articles.
- An identical second run reports `NO_CHANGE` and creates no duplicates.
- A changed row creates an updated Web Content version.
- `ARCHIVE` expires content and keeps its history.

---

# Lab ART-06 — Implement the Import Service

Create a dedicated OSGi implementation module, for example:

```text
modules/nexcent-training/nexcent-training-article-importer
```

Responsibilities:

```text
XlsxArticleParser
ArticleImportValidator
ArticleImportExecutor
ArticleImportManager
ArticleImportConfiguration
```

Use Apache POI inside this module only. The REST implementation must not parse worksheets.

Extend Service Builder with `ImportJob` and `ImportJobItem` from the detailed design. Then regenerate:

```bash
./gradlew :modules:nexcent-training:nexcent-training-service:buildService
```

Write unit tests for normalization and validation and integration tests for create, update, no-change, translation, archive, and retry.

## Checkpoint

- `buildService` completes.
- Generated source contains no hand edits.
- Re-running generation produces no unexpected diff.
- The service module compiles and its DS components are satisfied.

---

# Lab ART-07 — Implement the REST Workflow

Replace the old JSON metadata-only import endpoint with the Article job workflow:

```text
POST /sites/{siteId}/article-import-jobs
POST /sites/{siteId}/article-import-jobs/{jobERC}/validate
POST /sites/{siteId}/article-import-jobs/{jobERC}/execute
GET  /sites/{siteId}/article-import-jobs
GET  /sites/{siteId}/article-import-jobs/{jobERC}
GET  /sites/{siteId}/article-import-jobs/{jobERC}/items
```

The upload endpoint is `multipart/form-data` and returns `202 Accepted`. Collection endpoints use Liferay pagination.

Regenerate:

```bash
./gradlew :modules:nexcent-training:nexcent-training-rest-impl:buildREST
```

Compile and deploy API → service → importer → REST API → REST implementation. Verify permissions and problem responses in API Explorer.

## Checkpoint

- `buildREST` succeeds and a second generation produces no unexpected diff.
- Endpoints appear in `/o/api`.
- Guest receives `401/403` for upload, validate, and execute.
- Invalid state transitions return `INVALID_STATE`.
- Row result pagination is stable.

---

# Lab ART-08 — Wire the Article List

The list component must:

1. resolve the Article Structure by stable ERC/key;
2. call Structured Content collection with `flatten=true` and pagination;
3. map fields by `name`;
4. render loading, ready, empty, and error states;
5. link each card to `/w/{friendlyUrlPath}`;
6. avoid hard-coded business content and numeric IDs.

Do not perform client-side filtering over an unbounded content collection. Use a supported Headless filter, a Liferay Collection/Info provider, or a dedicated read endpoint.

## Checkpoint

- Adding a published Article appears without rebuilding frontend assets.
- Draft and expired Articles do not appear to Guest.
- Long titles, broken images, and empty responses do not break layout.

---

# Lab ART-09 — Runtime and Responsive QA Gate

Capture Article list and detail screenshots at:

```text
1440px
768px
375px
```

For each viewport verify:

- no horizontal overflow;
- card grid and typography;
- keyboard focus and link target;
- loading, empty, error, and populated list states;
- detail H1 hierarchy, cover image alt, Rich Text, taxonomy, and return navigation;
- canonical URL and SEO/social metadata;
- Master Page has only the new Header/Footer visual shells, with no duplicate wrapper padding.

Also capture API Explorer or curl evidence for upload → validate → execute and the final import counts.

## Merge gate

- Header/Footer screenshot gate passes independently.
- Article importer, list, and detail screenshots pass at all three widths.
- No merge occurs before both gates pass.

---

# Optional Lab ART-X — Evaluate Liferay Headless CMS

DXP 2026.Q1 includes the newer object-based Headless CMS behind release feature flags. Evaluate it only in a disposable environment:

1. confirm the exact quarterly/update release and relevant feature-flag semantics;
2. reproduce the Article structure, space, permissions, workflow, friendly URL, import, list, and detail requirements;
3. compare stable identifiers, export/import, API support, and rollback;
4. record a migration ADR before changing the baseline.

Do not enable release feature flags in the shared training baseline merely to complete the Article lab.
