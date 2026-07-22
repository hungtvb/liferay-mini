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
└── Marketing / Community cards
```

The split satisfies the requirement that at least three sections use Headless
APIs without making every component perform a runtime request.

`prototypes/nexcent-static/content.json` is only the standalone preview fixture,
visual parity baseline, test data, and runtime fallback. It is not the intended
production content source.

## Shared Headless runtime

The project has one shared Structured Content API client. Legacy lab components
and the pixel-perfect React sections both reuse it.

```text
GET /o/headless-delivery/v1.0/sites/{siteId}/content-structures?pageSize=200
        ↓ resolve configured Structure identifier
GET /o/headless-delivery/v1.0/content-structures/{structureId}/structured-contents?flatten=true&pageSize=100
```

The client:

- Shares one browser request cache.
- Sends the current page locale.
- Includes Web Content stored in folders by using `flatten=true`.
- Resolves a Structure by numeric ID, external reference code, key, or name.
- Filters entries with `active=false`.
- Sorts by `sortOrder` or `displayOrder`.
- Applies the maximum-item value configured on the Fragment.

No credentials, OAuth secrets, passwords, or fixed portal host are embedded in
the React bundle. Requests are same-origin and use the current Liferay session.

## Structure defaults

The Fragment defaults are intentionally aligned with the existing Excel importer
in `nexcent-landing-elements`:

```text
Hero                 NXC Landing Hero
Community / Services NXC Service Item
Marketing cards      NXC Community Card
```

These are Structure names used by the current lab importer. A Fragment can be
pointed to a numeric ID, ERC, key, or different Structure name in General
settings when another environment uses different identifiers.

Do not change these defaults to `Nexcent Hero`, `Nexcent Service`, or
`Nexcent Article` unless the corresponding Structures have actually been created
and the importer contract has been updated too.

## Hero

One Structured Content entry represents one slide. This matches the `Heroes`
Excel sheet and allows each slide to have an independent workflow, localization,
schedule, active state, and order.

Default Structure:

```text
NXC Landing Hero
```

Supported fields:

```text
title
highlightedText
description
ctaLabel
ctaUrl
ctaTarget
illustration or image
illustrationAlt or imageAlt
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

The section title and description belong to the Fragment instance. Reusable
service cards come from Structured Content.

Default Structure:

```text
NXC Service Item
```

Supported fields:

```text
title
description
icon or image
iconAlt
linkLabel
linkUrl
sortOrder
active
```

The current pixel-perfect card layout does not render the optional service link,
but the importer keeps it for reuse by a Services page or another card variant.

Fragment Settings:

```text
Content Structure identifier
Maximum cards
Title
Description
```

## Marketing cards

The section title and description belong to the Fragment instance. The current
branch loads the three marketing cards from the Structure already supported by
the workbook importer.

Default Structure:

```text
NXC Community Card
```

Supported fields:

```text
title
summary
thumbnail or image
thumbnailAlt
targetUrl or linkUrl
linkLabel
linkTarget
publishedDate
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

The separate Article pipeline may later configure this Fragment to use an Article
Structure and Display Page. It is not the default until that pipeline is deployed
to the same target environment.

Fragment Settings:

```text
Content Structure identifier
Maximum articles
Title
Description
Read more label
```

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

Both Fragments render the same React feature implementation with different
default copy and placement in the page composition.

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

## Runtime diagnostics

Each Headless custom element exposes:

```text
data-content-state="loading|ready|fallback"
data-content-error="..."
```

Fallback prevents a missing local Structure from destroying the page layout, but
it is not a runtime pass. A Liferay screenshot is accepted only when all three
Headless hosts report:

```text
data-content-state="ready"
```

The browser Network panel must also have no failed Headless Delivery request.

## Import and runtime order

```text
1. Create the required Web Content Structures.
2. Deploy Nexcent React Runtime.
3. Import the Nexcent Fragment Set.
4. Run the Excel importer with referenced assets.
5. Add the Fragments to the page.
6. Confirm each Headless Fragment default points to the imported Structure.
7. Reload the page and verify data-content-state="ready".
```

The importer requires the Structures to exist first; it creates or updates Web
Content entries and uploads missing Documents and Media assets, but it does not
invent an unknown Structure contract at runtime.

## Validation

```bash
cd client-extensions/nexcent-landing-elements
npm run validate:data-sources
npm test
npm run typecheck
npm run build
npm run package:fragments
```

The Frontend Check workflow enforces:

- Exactly three Headless body sections.
- Six Fragment Settings-only body sections.
- Importer-aligned Structure defaults.
- Reuse of the shared Structured Content API client.
- Presence of every configuration file in the packaged Fragment Set.
