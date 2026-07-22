# React Site Shell and section Fragment shells

## Goal

The reference frontend under `prototypes/nexcent-static` is implemented as
React custom elements in:

```text
client-extensions/nexcent-landing-elements/src/static-site/
```

The production Master Page uses thin Liferay Fragment shells. Each shell owns
only the matching custom-element tag and attributes generated from Fragment
Settings.

## Source layout

The React runtime and production Fragment Set are colocated:

```text
client-extensions/nexcent-landing-elements/
├── client-extension.yaml
├── fragments/
│   ├── collection.json
│   ├── nexcent-react-header/
│   ├── nexcent-react-hero/
│   ├── nexcent-react-clients/
│   ├── nexcent-react-community/
│   ├── nexcent-react-feature-primary/
│   ├── nexcent-react-statistics/
│   ├── nexcent-react-feature-secondary/
│   ├── nexcent-react-testimonial/
│   ├── nexcent-react-marketing/
│   ├── nexcent-react-cta/
│   └── nexcent-react-footer/
├── scripts/
│   ├── package-fragments.mjs
│   └── validate-data-sources.mjs
└── src/static-site/
```

This `fragments/` directory is the production source of truth. The training
folder contains course examples and compatibility scripts; it is not the source
for the production React Fragment Set.

## Runtime architecture

```text
Nexcent Master Page
├── Nexcent React Header + Fragment Settings
├── Main Content drop zone
└── Nexcent React Footer + Fragment Settings
        │
        ├── Nexcent React Runtime Global JavaScript
        ├── Nexcent Theme CSS / Style Book tokens
        └── Nexcent Global CSS React host bridge
                │
                ├── Site Shell REST Builder
                └── Headless Delivery API
```

Header and Footer share one cached Site Shell request:

```text
GET /o/nexcent-site-shell/v1.0/sites/{siteId}/site-shell
```

The BFF resolves Navigation Menus by stable ERC first and by name as a
compatibility fallback. Every item passes the current Liferay permission check.

Expected menu aliases:

```text
Header:
NXC-HEADER | NEXCENT-HEADER | Nexcent Header | Header

Footer Company:
NXC-FOOTER-COMPANY | NEXCENT-FOOTER-COMPANY
Nexcent Footer Company | Footer Company

Footer Support:
NXC-FOOTER-SUPPORT | NEXCENT-FOOTER-SUPPORT
Nexcent Footer Support | Footer Support
```

## Body content strategy

The body uses the simplest suitable production source per section.

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

The three Headless sections share one browser cache and use:

```text
GET /o/headless-delivery/v1.0/sites/{siteId}/content-structures?pageSize=200
        ↓ resolve Structure identifier
GET /o/headless-delivery/v1.0/content-structures/{structureId}/structured-contents?pageSize=100
```

The configured Structure identifier may be a numeric ID, external reference
code, key, or name. Prefer an ERC or key for environment portability.

The loader:

- Sends the current page locale.
- Loads approved Structured Content.
- Excludes entries with `active=false`.
- Sorts by `sortOrder` or `displayOrder`.
- Applies the Fragment maximum-item setting.
- Caches duplicate structure and content requests.
- Marks the host with `data-content-state` and `data-content-error`.

### Hero

One Structured Content entry represents one slide. This matches the existing
`Heroes` Excel sheet and allows each slide to have an independent workflow,
localization, schedule, and order.

Recommended Structure identifier:

```text
Nexcent Hero
NXC-HERO
```

Expected fields:

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

### Community / Services

The section heading comes from Fragment Settings. Reusable service cards come
from Structured Content.

Recommended Structure identifier:

```text
Nexcent Service
NXC-SERVICE
```

Expected fields:

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

### Marketing / Articles

The section heading comes from Fragment Settings. Cards come from Article
Structured Content and can link to a Display Page.

Recommended Structure identifier:

```text
Nexcent Article
NXC-ARTICLE
```

Expected fields:

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

When no target URL field is populated, React uses `/w/{friendlyUrlPath}`. Set up
a Display Page Template for the Article Structure before using this fallback.

Fragment Settings:

```text
Content Structure identifier
Maximum articles
Title
Description
Read more label
```

The complete mapping contract is in:

```text
docs/master-track/body-data-sources.md
```

`prototypes/nexcent-static/content.json` remains the static preview fixture,
visual parity baseline, unit-test data, and runtime fallback. It is not the
production body-content source.

## Fragment Settings-only sections

These sections do not make body-content API requests.

### Clients

```text
Title and description
Ticker visibility
Six logo URL and alt-text pairs
```

### Feature Primary and Secondary

```text
Title and description
Image URL and alt text
Button visibility, label, URL, and target
```

### Statistics

```text
Title, highlighted text, and description
Four metric value, label, icon URL, and icon-alt groups
```

### Testimonial

```text
Quote, author, and organization
Portrait URL and alt text
Partner-logo visibility
Link label, URL, and target
```

### CTA

```text
Title
Button visibility, label, URL, and target
```

## Theme and Style Book contract

The React elements render in Shadow DOM, but CSS custom properties inherit from
each custom-element host.

```text
client-extensions/nexcent-theme/assets/global-entry.css
├── global.css
└── react-shell.css
```

Style precedence:

```text
Style Book frontend tokens
    ↓
Nexcent Global CSS aliases
    ↓
React custom-element host
    ↓
Shadow DOM component CSS
```

`global.css` keeps legacy Master Page rules. `react-shell.css` contains host
defaults, Style Book aliases, Liferay wrapper normalization, and Header stacking.
Component-level visual rules remain inside the Shadow DOM.

## Build and deploy

Build Site Shell REST modules:

```bash
./gradlew \
  :modules:nexcent-site-shell:nexcent-site-shell-rest-impl:buildREST \
  :modules:nexcent-site-shell:nexcent-site-shell-rest-api:build \
  :modules:nexcent-site-shell:nexcent-site-shell-rest-impl:build

cp modules/nexcent-site-shell/nexcent-site-shell-rest-api/build/libs/*.jar \
  bundles/osgi/modules/
cp modules/nexcent-site-shell/nexcent-site-shell-rest-impl/build/libs/*.jar \
  bundles/osgi/modules/
```

Build and deploy React runtime:

```bash
cd client-extensions/nexcent-landing-elements
npm ci
npm run validate:data-sources
npm test
npm run typecheck
npm run build
../../gradlew clean build
cp build/liferay-client-extension-build/*.zip \
  ../../bundles/osgi/client-extensions/
```

Build and deploy Theme Client Extension:

```bash
cd ../nexcent-theme
../../gradlew clean build
cp build/liferay-client-extension-build/*.zip \
  ../../bundles/osgi/client-extensions/
```

Attach **Nexcent React Runtime** as Global JavaScript and confirm **Nexcent Global
CSS** remains applied to the Master Page.

## Package and import the Fragments

```bash
cd client-extensions/nexcent-landing-elements
npm run package:fragments
```

Generated package:

```text
client-extensions/nexcent-landing-elements/
build/fragments/collections-nexcent-components.zip
```

Import through:

```text
Site Menu → Design → Fragments
```

The old PowerShell command remains as a compatibility alias and delegates to the
same production source:

```powershell
./training/master-track-code-labs/scripts/package-fragments.ps1
```

## Static React preview

```bash
cd client-extensions/nexcent-landing-elements
npm ci
npm run preview:static
```

Open `http://localhost:4173` while Liferay runs at `http://localhost:8080`.

## Master Page composition

```text
Nexcent React Header
Main Content drop zone
Nexcent React Footer
```

Recommended body order:

```text
Nexcent React Hero
Nexcent React Clients
Nexcent React Community
Nexcent React Feature Primary
Nexcent React Statistics
Nexcent React Feature Secondary
Nexcent React Testimonial
Nexcent React Marketing
Nexcent React CTA
```

Remove the previous OOTB/editable Header and Footer composition to avoid duplicate
navigation, spacing, and mobile overlays.

## Header and Footer settings

Header supports logo overrides, account-action visibility, and guest/authenticated
labels. Footer supports branding, navigation headings, newsletter endpoint and
state messages, visibility toggles, and social URLs.

Header/Footer value precedence:

```text
Fragment Setting override
    ↓ when empty
Site Shell site/account value
    ↓ when unavailable
Bundled static fallback
```

Navigation items and authenticated account URLs remain runtime data.

## Newsletter

Default endpoint:

```text
/o/c/nxcnewslettersubscriptions
```

Expected Object fields:

```text
email
locale
sourcePage
consent
```

## Runtime gates

Capture the complete Master Page at `1440px`, `768px`, and `375px`. Also verify:

- All three Headless hosts report `data-content-state="ready"`.
- No failed Headless Delivery or Site Shell requests.
- Guest and authenticated Header states.
- Mobile menu and nested navigation.
- Newsletter submit, success, and error states.
- Style Book primary-color propagation through Shadow DOM.
- No wrapper spacing or horizontal overflow.
- No console errors.

Keep the PR Draft until runtime screenshots pass.
