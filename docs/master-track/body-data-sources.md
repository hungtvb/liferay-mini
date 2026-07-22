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
├── Hero
├── Community / Services
└── Marketing / Articles
```

`prototypes/nexcent-static/content.json` is only the standalone preview fixture,
visual parity baseline, test data, and runtime fallback. It is not the intended
production content source.

## Shared Headless runtime

The three Headless sections use one browser request cache and the same loader:

```text
GET /o/headless-delivery/v1.0/sites/{siteId}/content-structures?pageSize=200
        ↓ resolve configured structure identifier
GET /o/headless-delivery/v1.0/content-structures/{structureId}/structured-contents?pageSize=100
```

The Fragment setting **Content Structure identifier** accepts any value returned
by the API as:

- Numeric structure ID.
- External reference code.
- Structure key.
- Structure name.

Use a stable external reference code or key when the target environment exposes
it. A numeric ID is supported for local lab setup but is not portable between
environments.

Only approved Structured Content is delivered by Headless Delivery. The client
filters entries with `active=false`, sorts by `sortOrder` or `displayOrder`, and
then applies the Fragment maximum-item setting.

All requests use the current site ID and page locale passed by the thin Fragment.
No credentials, passwords, OAuth secrets, or fixed host names are embedded in the
React bundle.

## Hero

The Hero is a list of Structured Content entries. One entry represents one slide.
This matches the existing `Heroes` Excel sheet and allows slides to be created,
updated, reordered, scheduled, localized, and removed independently.

Recommended structure name/ERC:

```text
Nexcent Hero
NXC-HERO
```

Supported fields:

```text
title
highlightedText
description
ctaLabel
ctaUrl
ctaTarget
image or illustration
imageAlt
sortOrder
active
```

Fragment Settings:

```text
Content Structure identifier
Maximum slides
Autoplay
Slide interval
Pause on hover
Show pagination
```

## Community / Services

The section heading belongs to the Fragment instance. The cards are reusable
Structured Content entries.

Recommended structure name/ERC:

```text
Nexcent Service
NXC-SERVICE
```

Supported card fields:

```text
title
description
icon or image
iconAlt
sortOrder
active
```

Fragment Settings:

```text
Content Structure identifier
Maximum cards
Title
Description
```

The current pixel-perfect design does not render the optional service link. The
Headless model can retain `linkLabel` and `linkUrl` for another card variant or a
future Services page without changing this section layout.

## Marketing / Articles

The section heading belongs to the Fragment instance. Article cards come from a
Structured Content structure so each article can have its own workflow,
localization, taxonomy, and Display Page.

Recommended structure name/ERC:

```text
Nexcent Article
NXC-ARTICLE
```

Supported card fields:

```text
title
summary
thumbnail or image
thumbnailAlt
targetUrl or linkUrl
linkLabel
linkTarget
sortOrder
active
```

Link resolution order:

```text
targetUrl / linkUrl / ctaUrl
    ↓ when empty
/w/{friendlyUrlPath}
    ↓ when unavailable
static fallback URL
```

Fragment Settings:

```text
Content Structure identifier
Maximum articles
Title
Description
Read more label
```

Configure a Display Page Template for the Article structure before relying on the
`/w/{friendlyUrlPath}` fallback.

## Fragment Settings-only sections

These sections make no body-content API request. Their `configuration.json`
values are escaped in FreeMarker, passed as custom-element attributes, and read
as React props.

### Clients

```text
Title
Description
Enable logo ticker
Six logo URL and alt-text pairs
```

An empty logo URL uses the bundled design asset.

### Feature Primary and Secondary

```text
Title
Description
Image URL and alt text
Show button
Button label, URL, and target
```

Both fragments render the same React feature component with different default
copy. They remain separate Fragment entries so the current page composition and
visual ordering do not change.

### Statistics

```text
Title
Highlighted text
Description
Four value, label, icon URL, and icon-alt groups
```

These values are marketing copy. Replace this source with an Object or business
API only when the numbers become operational data.

### Testimonial

```text
Quote
Author
Organization
Portrait URL and alt text
Show partner logos
Link label, URL, and target
```

### CTA

```text
Title
Show button
Button label, URL, and target
```

## Runtime diagnostics and fallback

Each Headless custom element exposes:

```text
data-content-state="loading|ready|fallback"
data-content-error="..."
```

Fallback behavior is intentional so a missing local structure does not destroy
the page layout. A runtime acceptance screenshot is valid only when all three
Headless elements report `data-content-state="ready"` and the Network panel has
no failed Headless Delivery request.

## Validation

Run:

```bash
cd client-extensions/nexcent-landing-elements
npm run validate:data-sources
npm test
npm run typecheck
npm run build
npm run package:fragments
```

The Frontend Check workflow enforces this contract and verifies that the packaged
Fragment Set contains the Headless and Fragment Settings configurations.
