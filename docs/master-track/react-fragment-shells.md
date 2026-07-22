# React Site Shell and section Fragment shells

## Goal

The reference frontend under `prototypes/nexcent-static` is implemented as
React custom elements in:

```text
client-extensions/nexcent-landing-elements/src/static-site/
```

The production Master Page can now use React for Header, body sections, and
Footer. Every Liferay Fragment remains intentionally thin and contains only the
matching custom-element tag.

## Runtime architecture

```text
Nexcent Master Page
├── Nexcent React Header
├── Main Content drop zone
└── Nexcent React Footer
        │
        ▼
Nexcent React Runtime Global JavaScript
        │
        ▼
GET /o/nexcent-site-shell/v1.0/sites/{siteId}/site-shell
        ├── Header Navigation Menu
        ├── Footer Company Navigation Menu
        ├── Footer Support Navigation Menu
        ├── Guest/authenticated account context
        └── Site identity
```

Header and Footer share one browser request cache. The BFF resolves the menus by
stable ERC first and by name as a compatibility fallback. Menu items are filtered
through the current Liferay permission checker before being returned.

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

## Build and deploy

Generate and build the read-only Site Shell REST modules:

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

Build and deploy the React runtime:

```bash
cd client-extensions/nexcent-landing-elements
npm ci
npm run typecheck
npm test
npm run build
../../gradlew clean build
cp dist/*.zip ../../bundles/osgi/client-extensions/
```

Add **Nexcent React Runtime** as Global JavaScript to the Master Page. A
Fragment custom tag does not load the JavaScript bundle by itself.

## Package and import the Fragments

```powershell
./training/master-track-code-labs/scripts/package-fragments.ps1
```

Import:

```text
training/master-track-code-labs/fragments/collections-nexcent-components.zip
```

through **Site Menu → Design → Fragments**.

## Master Page composition

```text
Nexcent React Header
Main Content drop zone
Nexcent React Footer
```

The Header and Footer Fragment HTML stays one tag only. It passes the runtime
site ID from `themeDisplay.getScopeGroupId()` to React. The Footer also passes
the newsletter Object endpoint.

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

Remove the previous OOTB/editable Header and Footer composition from the new
Master Page to avoid duplicated navigation, spacing, and mobile overlays.

## Authentication and fallback behavior

- Guest users receive Login and Sign up URLs.
- Authenticated users receive portrait, display name, My Account, and Sign out.
- The endpoint is read-only and guest accessible; each navigation item still
  passes its Liferay permission check.
- If the REST module is unavailable, React renders the bundled static fallback
  and marks the custom element with `data-site-shell-state="fallback"` plus an
  error detail attribute for runtime diagnostics.

## Newsletter

The Footer posts to:

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

The UI exposes submitting, success, and error states. Change the
`newsletter-endpoint` attribute in the thin Footer Fragment if the Object ERC
or endpoint differs.

## Content and styling

- Static demo copy remains in `prototypes/nexcent-static/content.json`.
- Images and icons reuse the original prototype assets.
- React elements use Shadow DOM so the static reset cannot leak into Clay.
- Style Book CSS variables remain available through the custom-element host.
- Hero carousel behavior is React-owned; Swiper and AOS CDN scripts are not
  required.

## Runtime gates

Capture the complete Master Page at `1440px`, `768px`, and `375px`. Do not merge
while typography, navigation dropdowns, authenticated/guest states, mobile
menu, article overlays, newsletter states, Header, or Footer still diverge or
produce console/network errors.
