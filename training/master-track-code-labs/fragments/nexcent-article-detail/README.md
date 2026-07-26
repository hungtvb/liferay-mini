# Nexcent Article Detail Fragment

Use this Fragment inside a Liferay Display Page Template in the existing Nexcent Site.

## Content contract

```text
Structure ERC: NXC_ARTICLE
System fields: title, datePublished, contentUrl
Structure fields: body, coverImage
```

The Fragment intentionally does not use `summary`, `authorName`, `active`, `featured`, or `sortOrder`.

## Manual creation

1. Go to **Site Menu → Design → Fragments**.
2. Create a Fragment named **Nexcent Article Detail**.
3. Copy `index.html`, `index.css`, and `index.js` into the Fragment editors.
4. Save and publish the Fragment.

## Display Page Template

Create a Display Page Template in the same Nexcent Site:

```text
Name: Nexcent Article Detail
Content Type: Web Content Article
Subtype: NXC Article
Master Page: Nexcent Master Page
```

Add this Fragment and map:

| Editable ID | Source |
|---|---|
| `title` | System Field → Title |
| `publishedDate` | System Field → Publish Date |
| `coverImage` | NXC Article → coverImage |
| `body` | NXC Article → body |
| `backLink` | Leave editable; default `/#articles` |

Publish the Display Page Template and mark it as default for `NXC Article`.

A published Article with friendly URL `test-nexcent-article` is then expected at:

```text
/web/nexcent-public-website/w/test-nexcent-article
```

The React Article list must use `structuredContent.contentUrl`; it must not construct this path manually.
