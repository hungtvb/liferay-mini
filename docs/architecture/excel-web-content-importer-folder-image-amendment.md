# Excel Web Content Importer — Folder and Existing Image Amendment

Status: **SOURCE IMPLEMENTED / LIFERAY RUNTIME PENDING**  
Target: **Liferay DXP 2026.Q1.1 LTS**  
Branch: **`feat/excel-web-content-importer`**

This amendment supersedes the original v1 exclusions for Web Content folder placement and non-repeatable Image fields.

## Decisions

1. Every imported Article must be stored in one configured Web Content folder.
2. The folder is identified by External Reference Code, not by display name or numeric ID.
3. The importer creates the folder at the Site root when lookup by ERC returns `404`.
4. Image files must already exist in the configured Site's Documents and Media repository.
5. Excel references an image by Document External Reference Code.
6. Missing and non-image Documents are row-level preflight errors.
7. Any preflight error blocks the entire Batch Engine submission.
8. Folder and image resolution run again immediately before submission.

## Configuration

```dotenv
LIFERAY_ARTICLE_FOLDER_ERC=NXC_ARTICLES
LIFERAY_ARTICLE_FOLDER_NAME=Articles
IMAGE_LOOKUP_CONCURRENCY=8
```

The folder name is used only when the folder must be created. Its ERC is the stable identity.

## Excel contract

For the current Article Structure:

```text
Article Title *
External Reference Code *
Body * [body]
Cover Image * ERC [coverImage]
```

The Image cell contains a Document ERC, for example:

```text
NXC-IMAGE-COMMUNITY-001
```

The workbook Metadata sheet includes:

```text
targetFolderExternalReferenceCode
targetFolderId
targetFolderName
```

A workbook generated for a different folder ERC is rejected.

## Folder flow

```text
GET /sites/{siteId}/structured-content-folders/by-external-reference-code/{folderERC}
    ├── 200: use the returned folder
    └── 404: POST /sites/{siteId}/structured-content-folders
              { externalReferenceCode, name }
```

Each generated StructuredContent item contains:

```json
{
  "structuredContentFolderId": 67890
}
```

## Image preflight

For each unique non-empty Image ERC:

```text
GET /sites/{siteId}/documents/by-external-reference-code/{documentERC}
```

Validation outcomes:

- `404`: add an error to every Excel row using that ERC;
- Document exists but `encodingFormat` is not `image/*`: add a row error;
- valid image: build `contentFieldValue.image` from the returned Document metadata.

Example row error:

```text
Excel row 12 · content.coverImage
Image with Document external reference code “NXC-IMAGE-404” does not exist in the configured Site
```

## Mutation gate

```text
errors.length === 0
AND payload.length > 0
AND target folder is resolved
AND every referenced image resolves to an image Document
```

Before Batch Engine submission, the importer:

1. resolves the folder again;
2. clears its Document lookup cache;
3. reruns the complete workbook validation;
4. submits only when the new validation still passes.

## Verification

Automated source tests cover:

- target folder creation on `404`;
- folder lookup by ERC;
- Document lookup and caching;
- Image ERC template columns;
- folder-bound workbook Metadata;
- `structuredContentFolderId` payload generation;
- resolved image payload generation;
- missing-image row errors;
- duplicate Article ERC and required-value errors.

Runtime verification remains required against the exact DXP instance for OAuth permissions, Batch Engine Image payload acceptance, folder assignment, and final Web Content creation.
