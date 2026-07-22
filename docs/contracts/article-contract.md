# Article FE–BE Contract

This is the stable integration contract for the Nexcent Article list, Article detail, and the `NXC_ARTICLE_V1` import profile. Shared import behavior is defined in [`../architecture/content-import-framework.md`](../architecture/content-import-framework.md); Article rationale is in [`../architecture/article-content-pipeline.md`](../architecture/article-content-pipeline.md).

## Stable identifiers

| Resource | Identifier |
|---|---|
| Web Content Structure | `NXC-STRUCTURE-ARTICLE` |
| Structure key | `NXC_ARTICLE` |
| Vocabulary | `NXC-VOCABULARY-ARTICLE-TOPICS` |
| Article | `NXC-ARTICLE-*` |
| Cover image | `NXC-DOC-ARTICLE-*` |
| Import package folder | `NXC-FOLDER-ARTICLE-IMPORT-PACKAGES` |
| Imported media folder | `NXC-FOLDER-ARTICLE-ASSETS` |
| Import profile | `NXC_ARTICLE_V1` |
| Import job | `NXC-CONTENT-IMPORT-*` |

Frontend configuration must not contain environment-specific numeric IDs. The runtime may resolve an ID from an ERC and cache it for the current session.

## Article fields

| Source | API property/field reference | Client type |
|---|---|---|
| System | `externalReferenceCode` | `string` |
| System | `title` | `string` |
| System | `datePublished` | ISO timestamp |
| System | friendly URL | canonical detail URL |
| Structure | `summary` | `string` |
| Structure | `body` | sanitized HTML |
| Structure | `coverImage` | media value |
| Structure | `coverImageAlt` | `string` |
| Structure | `authorName` | `string` |
| Structure | `featured` | `boolean` |
| Structure | `sortOrder` | `number` |
| Asset | categories | category array |
| Asset | keywords | tag array |

```ts
export type ArticleCard = {
    authorName: string;
    coverImage: {
        alt: string;
        externalReferenceCode?: string;
        url: string;
    };
    datePublished: string;
    detailUrl: string;
    externalReferenceCode: string;
    featured: boolean;
    sortOrder: number;
    summary: string;
    title: string;
};

export type ArticleDetail = ArticleCard & {
    bodyHtml: string;
    categories: Array<{
        externalReferenceCode?: string;
        name: string;
    }>;
    tags: string[];
};
```

## Delivery contract

1. Resolve `NXC Article` from the site content-structure collection using a stable ERC/key.
2. Read its Structured Contents with `flatten=true`, pagination, and supported server-side sort/filter options.
3. Map content fields by field `name`, not array index.
4. Link cards to the default Display Page Template using the canonical `/w/{friendlyUrlPath}` URL.
5. Display only content returned to the current user by Liferay permissions and workflow.

The list component supports `loading`, `ready`, `empty`, and `error`. Missing content never falls back to hard-coded Article data.

## Import package contract

The editor selects `NXC_ARTICLE_V1` and uploads one self-contained `nexcent-article-import.zip`. Its manifest contains `"importProfileKey": "NXC_ARTICLE_V1"`:

```text
nexcent-article-import.zip
├── manifest.json
├── articles.xlsx
└── assets/
    └── <image files>
```

The workbook contains `Articles`, `Assets`, `Taxonomy`, and `Instructions` sheets. `Articles` references media through `coverImageKey`; the `Assets` sheet maps that key to a relative package path and stable Documents and Media ERC.

Article header order:

```text
operation,externalReferenceCode,locale,title,friendlyUrlPath,summary,bodyHtml,coverImageKey,coverImageAlt,authorName,publicationDate,expirationDate,categoryERCs,tags,featured,sortOrder,publish
```

Asset header order:

```text
imageKey,filePath,documentERC,title,altText,folderERC
```

Identity is `(siteId, externalReferenceCode)` for an Article, `(externalReferenceCode, locale)` for an Article row, and `documentERC` for a media file. `UPSERT` creates or versions content; `ARCHIVE` expires it. `publish` defaults to `false`.

All timestamps are normalized to UTC. List separators are semicolons. Numeric IDs, absolute workstation paths, Base64 images, and filenames are not stable integration keys. The package must pass ZIP-safety, workbook, image MIME, checksum, permission, and cross-reference validation before any mutation.

## Import REST contract

Article uses the generic Content Import API:

| Method | Path |
|---|---|
| `GET` | `/o/nexcent-training/v1.0/sites/{siteId}/content-import-profiles` |
| `POST` | `/o/nexcent-training/v1.0/sites/{siteId}/content-import-jobs` |
| `POST` | `/o/nexcent-training/v1.0/sites/{siteId}/content-import-jobs/{jobERC}/validate` |
| `POST` | `/o/nexcent-training/v1.0/sites/{siteId}/content-import-jobs/{jobERC}/execute` |
| `POST` | `/o/nexcent-training/v1.0/sites/{siteId}/content-import-jobs/{jobERC}/retry` |
| `GET` | `/o/nexcent-training/v1.0/sites/{siteId}/content-import-jobs` |
| `GET` | `/o/nexcent-training/v1.0/sites/{siteId}/content-import-jobs/{jobERC}` |
| `GET` | `/o/nexcent-training/v1.0/sites/{siteId}/content-import-jobs/{jobERC}/items` |

The UI discovers `NXC_ARTICLE_V1` from the profile endpoint, uploads the ZIP to the restricted D&M package folder through the standard Documents API, then creates a job:

```json
{
  "externalReferenceCode": "NXC-CONTENT-IMPORT-20260722-001",
  "packageFileEntryId": 38201,
  "importProfileKey": "NXC_ARTICLE_V1"
}
```

The manifest and request profile must match. Execute is valid only after successful validation. All list endpoints are paged.

## Error codes

```text
INVALID_PACKAGE_LAYOUT
UNSAFE_ZIP_ENTRY
PACKAGE_LIMIT_EXCEEDED
INVALID_MANIFEST
INVALID_HEADER
DUPLICATE_ERC_LOCALE
DUPLICATE_FRIENDLY_URL
INVALID_LOCALE
IMAGE_KEY_NOT_FOUND
IMAGE_FILE_NOT_FOUND
DUPLICATE_DOCUMENT_ERC
INVALID_IMAGE_TYPE
CATEGORY_ERC_NOT_FOUND
UNSAFE_HTML
INVALID_DATE_RANGE
INVALID_STATE
PERMISSION_DENIED
```

Clients branch on the code and show the human-readable message. They do not parse message text.

## Administration UI contract

The final UI is the generic React `nexcent-training-web` MVC Portlet registered through `PanelApp` under the current site's **Content & Data** menu. It populates the content-type/profile selector from `GET /content-import-profiles`; Article is not hard-coded.

It derives site context from Liferay, downloads the selected profile template, uploads packages through Documents and Media, and calls the generic REST Builder workflow. Required views are upload/validate, paged job history, and job detail with asset and Article row results. A dedicated `Nexcent Content Importer` site role controls access; Publish is granted separately.

A private page Custom Element is PoC-only. A separately hosted application is out of the current baseline.

## Acceptance

- Re-importing identical data creates no duplicate and no unnecessary Web Content version.
- Editing a published Article updates the list/detail after the normal cache lifecycle without rebuilding frontend assets.
- An Article detail works at `/w/{friendlyUrlPath}` without a dedicated site page.
- Missing image key/file/category references and unsafe ZIP entries fail validation before execution.
- Media is upserted by D&M ERC before dependent Article rows.
- Guest cannot upload or execute imports.
- The importer UI is a site-scoped application under Site Menu → Content & Data, not a public Content Page or external tool.
- Adding another registered handler makes its enabled profile appear without modifying the generic admin UI or REST resource.
- The list and detail pass at `1440px`, `768px`, and `375px` before merge.
