# Article FE–BE Contract

This is the stable integration contract for the Nexcent Article list, Article detail, and Excel importer. The rationale and operational design are in [`../architecture/article-content-pipeline.md`](../architecture/article-content-pipeline.md).

## Stable identifiers

| Resource | Identifier |
|---|---|
| Web Content Structure | `NXC-STRUCTURE-ARTICLE` |
| Structure key | `NXC_ARTICLE` |
| Vocabulary | `NXC-VOCABULARY-ARTICLE-TOPICS` |
| Article | `NXC-ARTICLE-*` |
| Cover image | `NXC-DOC-COMMUNITY-*` |
| Import job | `NXC-ARTICLE-IMPORT-*` |

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

## Import contract

The workbook header order is:

```text
operation,externalReferenceCode,locale,title,friendlyUrlPath,summary,bodyHtml,coverImageERC,coverImageAlt,authorName,publicationDate,expirationDate,categoryERCs,tags,featured,sortOrder,publish
```

Identity is `(siteId, externalReferenceCode)` for an Article and `(externalReferenceCode, locale)` for a workbook row. `UPSERT` creates or versions content; `ARCHIVE` expires it. `publish` defaults to `false`.

All timestamps are normalized to UTC. List separators are semicolons. Images and categories are referenced by ERC; numeric IDs and filenames are not stable integration keys.

## Import REST contract

| Method | Path |
|---|---|
| `POST` | `/o/nexcent-training/v1.0/sites/{siteId}/article-import-jobs` |
| `POST` | `/o/nexcent-training/v1.0/sites/{siteId}/article-import-jobs/{jobERC}/validate` |
| `POST` | `/o/nexcent-training/v1.0/sites/{siteId}/article-import-jobs/{jobERC}/execute` |
| `GET` | `/o/nexcent-training/v1.0/sites/{siteId}/article-import-jobs` |
| `GET` | `/o/nexcent-training/v1.0/sites/{siteId}/article-import-jobs/{jobERC}` |
| `GET` | `/o/nexcent-training/v1.0/sites/{siteId}/article-import-jobs/{jobERC}/items` |

Upload is `multipart/form-data`; execute is valid only after successful validation. All list endpoints are paged.

## Error codes

```text
INVALID_HEADER
DUPLICATE_ERC_LOCALE
DUPLICATE_FRIENDLY_URL
INVALID_LOCALE
IMAGE_ERC_NOT_FOUND
CATEGORY_ERC_NOT_FOUND
UNSAFE_HTML
INVALID_DATE_RANGE
INVALID_STATE
PERMISSION_DENIED
```

Clients branch on the code and show the human-readable message. They do not parse message text.

## Acceptance

- Re-importing identical data creates no duplicate and no unnecessary Web Content version.
- Editing a published Article updates the list/detail after the normal cache lifecycle without rebuilding frontend assets.
- An Article detail works at `/w/{friendlyUrlPath}` without a dedicated site page.
- Missing image/category references fail validation before execution.
- Guest cannot upload or execute imports.
- The list and detail pass at `1440px`, `768px`, and `375px` before merge.
