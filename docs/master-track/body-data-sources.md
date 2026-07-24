# Nexcent body data source contracts

## Decision

The body uses the simplest production source that fits each section.

```text
Fragment Settings → custom-element attributes → React props
├── Clients
├── Feature Primary
├── Statistics
├── Feature Secondary
├── Testimonial
└── CTA

Headless Delivery API
├── Hero       → NXC_LANDING_HERO
├── Services   → NXC_SERVICE_ITEM
└── Articles   → NXC_ARTICLE
```

`prototypes/nexcent-static/content.json` remains preview/test fallback data only.

## Shared Headless runtime

```text
GET /o/headless-delivery/v1.0/sites/{siteId}/content-structures?pageSize=200
        ↓ resolve configured Structure by numeric ID, key, or ERC
GET /o/headless-delivery/v1.0/content-structures/{structureId}/structured-contents
    ?flatten=true
    &pageSize=100
```

The shared loader:

- caches same-origin browser requests;
- sends the current locale;
- uses `flatten=true` because content may be stored in folders;
- resolves Structure identifiers without relying on editable display names;
- treats `active`/`enabled` as optional fields;
- sorts by `sortOrder`/`displayOrder` on the client when those fields exist;
- otherwise sorts by `datePublished` descending;
- never sends an optional Structure field such as `contentFields/sortOrder` as a generic server sort.

## Hero

Structure:

```text
NXC_LANDING_HERO
```

Supported fields include title, highlightedText, description, CTA fields, image fields, optional `sortOrder`, and optional `active`.

## Services

Structure:

```text
NXC_SERVICE_ITEM
```

Supported fields include title, description, icon/image fields, optional link fields, optional `sortOrder`, and optional `active`.

## Articles

The visual section keeps the existing `marketing` CSS and custom-element key, but its production model is Article content.

Structure:

```text
NXC_ARTICLE
```

Canonical contract:

```text
System fields:
- title
- externalReferenceCode
- datePublished
- friendlyUrlPath

Structure fields:
- body
- coverImage
```

Not part of the contract:

```text
sortOrder
active
featured
summary
authorName
thumbnail
thumbnailAlt
targetUrl
linkLabel
linkTarget
contentUrl on StructuredContent
```

Article card mapping:

```text
Title     → StructuredContent.title
Image     → contentFields.coverImage
Image alt → image.description → image.title → Article title
Slug      → StructuredContent.friendlyUrlPath
Order     → datePublished descending when no optional order field exists
```

The Fragment passes the current Site display URL from `themeDisplay.getScopeGroup().getDisplayURL(...)`. React combines that Site URL with `/w/` and `friendlyUrlPath`:

```text
{siteDisplayURL}/w/{friendlyUrlPath}
```

Examples:

```text
http://localhost:8080/web/nexcent-public-website/w/test-nexcent-article
https://nexcent.example.com/w/test-nexcent-article
```

The `contentUrl` property is valid for the nested Image value, but it is not a system property of the Structured Content response.

## Article detail

Article detail is rendered by a Display Page Template inside the existing Nexcent Site.

```text
Name: Nexcent Article Detail
Content Type: Web Content Article
Subtype: NXC Article
Master Page: Nexcent Master Page
Default: Yes
```

Fragment mapping:

```text
title          → System Field / Title
publishedDate  → System Field / Publish Date
coverImage     → NXC Article / coverImage
body            → NXC Article / body
```

Example local URL:

```text
/web/nexcent-public-website/w/test-nexcent-article
```

The source Fragment is under:

```text
training/master-track-code-labs/fragments/nexcent-article-detail
```

## Import and runtime order

```text
1. Create NXC_ARTICLE with body and coverImage.
2. Create or verify the NXC_ARTICLES Web Content folder.
3. Create and default the Nexcent Article Detail Display Page Template.
4. Deploy the React Client Extension and import the Fragment Set.
5. Run the local Article importer.
6. Add the Article/Marketing Fragment to Home.
7. Verify the Headless host reports data-content-state="ready".
8. Verify Article cards build the Site URL from friendlyUrlPath and open under the Nexcent Master Page.
```

## Runtime diagnostics

Each Headless host exposes:

```text
data-content-state="loading|ready|fallback"
data-content-error="..."
```

A screenshot is accepted only when the required Headless hosts report `ready` and the Network panel has no failed Headless Delivery request.

## Validation

```bash
cd client-extensions/nexcent-landing-elements
npm run validate:data-sources
npm test
npm run typecheck
npm run build
npm run package:fragments
```
