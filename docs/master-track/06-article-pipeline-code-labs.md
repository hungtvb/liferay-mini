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

## 2. Create stable media folders

Create separate Documents and Media folders:

```text
NXC-FOLDER-ARTICLE-ASSETS          → imported public Article media
NXC-FOLDER-ARTICLE-IMPORT-PACKAGES → restricted source ZIP packages
```

The ZIP package owns sample images and maps each `imageKey` to a stable D&M ERC such as:

```text
NXC-DOC-ARTICLE-001
NXC-DOC-ARTICLE-002
NXC-DOC-ARTICLE-003
```

Do not pre-upload the baseline sample images manually. This lab must prove that the importer creates or updates Documents and Media before creating dependent Articles. A manually uploaded file may be used only for the separate Display Page smoke test.

## Checkpoint

- Every category and folder resolves by ERC.
- The importer can create sample images with stable document ERCs from the package.
- Guest can view only media used by published public Articles.
- ZIP packages remain in the separate restricted folder.

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

# Lab ART-05 — Prepare and Validate the Import Package

Use the generated workbook and sample assets to build:

```text
nexcent-article-import.zip
├── manifest.json
├── articles.xlsx
└── assets/
    ├── community-management-cover.webp
    ├── membership-guide-cover.webp
    └── safeguarding-guide-cover.webp
```

The workbook has `Articles`, `Assets`, `Taxonomy`, and `Instructions` sheets. Keep headers unchanged.

Before upload:

- keep `publish=false` for the first run;
- use UTC Date/Time values;
- keep one `(externalReferenceCode, locale)` per Article row;
- make every `coverImageKey` resolve to one Assets row;
- give each asset a stable `documentERC` and relative `assets/...` path;
- remove formulas, macros, external links, absolute paths, and Base64 data.

In the Nexcent Article Import Site Administration App:

1. upload the ZIP to the restricted package folder;
2. run **Validate** and review package, asset, and Article results;
3. run **Execute** only when the job is `VALIDATED`;
4. verify media is imported before Articles.

## Negative exercises

Create separate package copies containing:

1. duplicate Article ERC and locale;
2. missing image key;
3. missing image file;
4. duplicate document ERC;
5. unknown category ERC;
6. duplicate friendly URL;
7. unsafe `<script>` HTML;
8. invalid publication/expiration order;
9. a formula cell;
10. `../` ZIP path traversal or a duplicate ZIP entry;
11. a renamed non-image payload with an image extension.

Every case must fail validation before asset or Article mutation.

## Checkpoint

- First valid run creates D&M images and Draft Articles.
- An identical second run reports `NO_CHANGE` and creates no duplicate media, Article, or unnecessary version.
- Changed image bytes update the existing document identified by ERC.
- A changed Article row creates a new Web Content version.
- `ARCHIVE` expires content and keeps its history.

---

# Lab ART-06 — Implement the Import Service

Implement Article as the first profile of the shared [Content Import Framework](../architecture/content-import-framework.md). Create a dedicated OSGi implementation module, for example:

```text
modules/nexcent-training/nexcent-training-article-importer
```

Responsibilities:

```text
SafeZipPackageReader
ImportManifestParser
XlsxArticleParser
ArticleAssetValidator
ArticleAssetImporter
ArticleImportValidator
ArticleImportExecutor
ContentImportHandlerRegistry
ContentImportJobManager
ArticleContentImportHandler
ArticleImportConfiguration
```

Use Apache POI and ZIP processing inside this module only. Reject traversal, symlinks, duplicate entries, decompression bombs, invalid MIME signatures, and configured size/count limits. Stream files; do not buffer the full package. The REST implementation must not parse worksheets or import media.

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

Replace the transitional Article-specific multipart endpoint with generic profile discovery and content-job orchestration:

```text
GET  /sites/{siteId}/content-import-profiles
POST /sites/{siteId}/content-import-jobs
POST /sites/{siteId}/content-import-jobs/{jobERC}/validate
POST /sites/{siteId}/content-import-jobs/{jobERC}/execute
POST /sites/{siteId}/content-import-jobs/{jobERC}/retry
GET  /sites/{siteId}/content-import-jobs
GET  /sites/{siteId}/content-import-jobs/{jobERC}
GET  /sites/{siteId}/content-import-jobs/{jobERC}/items
```

The UI discovers `NXC_ARTICLE_V1`, uploads the ZIP through the standard Documents API, then creates the generic job with `packageFileEntryId` and `importProfileKey`. REST Builder returns `202 Accepted`; collection endpoints use Liferay pagination. Adding a future handler must not require a REST resource change.

Regenerate:

```bash
./gradlew :modules:nexcent-training:nexcent-training-rest-impl:buildREST
```

Compile and deploy API → service → importer → REST API → REST implementation. Verify permissions and problem responses in API Explorer.

## Checkpoint

- `buildREST` succeeds and a second generation produces no unexpected diff.
- Endpoints appear in `/o/api`.
- Guest receives `401/403` for create-job, validate, and execute.
- A package outside the approved site/folder or owned by another site is rejected.
- Invalid state transitions return `INVALID_STATE`.
- Row result pagination is stable.
- `NXC_ARTICLE_V1` is returned by profile discovery only when its handler/prerequisites are available.
- Request profile and manifest profile mismatch returns `INVALID_PROFILE`.

---

# Lab ART-08 — Build the Site Administration App

Create:

```text
modules/nexcent-training/nexcent-training-web
```

Deliver one generic React UI inside an MVC Portlet and register it with a `PanelApp` under:

```text
Site Menu → Content & Data → Nexcent Content Import
```

Required views:

- Upload and Validate: server-driven import-profile dropdown, selected-profile template download, ZIP chooser, Draft/Publish option, validation summary.
- Job History: paged status, progress, creator, timestamps, and counts.
- Job Detail: package, asset, and Article row results; stable error codes; retry and report download.

The app derives the current site from Liferay context and populates the dropdown from `GET /content-import-profiles`. Do not hard-code Article/profile options, expose a numeric site-ID input, add the app to Home, or apply the public Master Page. Create the `Nexcent Content Importer` site role and keep Publish as a separate permission.

## Checkpoint

- The app appears only for authorized users in the current site's Content & Data menu.
- `NXC_ARTICLE_V1` appears through profile discovery; registering a test handler adds another enabled option without UI source changes.
- Guest and ordinary members cannot open or call it.
- Package upload uses Documents and Media; orchestration uses REST Builder.
- Refreshing Job Detail preserves durable state from Service Builder.
- The public landing page contains no import widget.

---

# Lab ART-09 — Wire the Article List

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

# Lab ART-10 — Runtime and Responsive QA Gate

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

Also capture the Site Administration App plus API Explorer/curl evidence for D&M package upload → create job → validate → execute, media-first results, retry/no-change behavior, and final counts.

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
