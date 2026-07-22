# React Site Shell and section Fragment shells

## Goal

The reference frontend under `prototypes/nexcent-static` is implemented as
React custom elements in:

```text
client-extensions/nexcent-landing-elements/src/static-site/
```

The production Master Page uses thin Liferay Fragment shells. Each shell owns
only the matching custom-element tag and the attributes generated from Fragment
Settings.

## Source layout

The React runtime and its production Fragment Set are colocated:

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
├── scripts/package-fragments.mjs
└── src/static-site/
```

This `fragments/` directory is the production source of truth. The training
folder contains course examples and compatibility scripts; it must not be used
as the source for the production React Fragment Set.

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
                ▼
GET /o/nexcent-site-shell/v1.0/sites/{siteId}/site-shell
        ├── Header Navigation Menu
        ├── Footer Company Navigation Menu
        ├── Footer Support Navigation Menu
        ├── Guest/authenticated account context
        └── Site identity
```

Header and Footer share one browser request cache. The BFF resolves menus by
stable ERC first and by name as a compatibility fallback. Every item passes the
current Liferay permission check.

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

The body intentionally uses the simplest suitable source per component.

```text
Fragment Settings → custom-element attributes → React props
├── Clients
├── Feature
├── Statistics
├── Testimonial
└── CTA

Headless Delivery API
├── Hero
├── Community / Services
└── Marketing / Articles
```

The three Headless sections satisfy the course requirement while covering three
different use cases:

```text
Hero
→ one Structured Content item with repeatable slide fields

Community / Services
→ a list of Structured Content items

Marketing / Articles
→ article collection, image, and detail Display Page
```

`prototypes/nexcent-static/content.json` remains the static preview fixture,
visual parity baseline, unit-test data, and development fallback. It is not the
intended production source for body copy.

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

`global.css` keeps legacy Master Page rules. `react-shell.css` contains only host
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
npm run typecheck
npm test
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

From the React project:

```bash
cd client-extensions/nexcent-landing-elements
npm run package:fragments
```

Generated package:

```text
client-extensions/nexcent-landing-elements/
build/fragments/collections-nexcent-components.zip
```

Import the ZIP through:

```text
Site Menu → Design → Fragments
```

The old command remains available as a compatibility alias and delegates to the
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

## Header and Footer Fragment Settings

Header:

```text
Branding
├── Logo URL override
└── Logo alt text

Account actions
├── Show account actions
├── Login label
├── Sign-up label
├── My Account label
└── Sign-out label
```

Footer:

```text
Branding
├── Footer logo URL override
├── Logo alt text
├── Copyright text
└── Rights text

Navigation columns
├── Company heading
└── Support heading

Newsletter
├── Show newsletter
├── Title and placeholder
├── Object endpoint
├── Submit label
└── Submitting, success, and error messages

Social links
├── Show social links
└── Instagram, Dribbble, Twitter, and YouTube URLs
```

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

- Guest and authenticated Header states.
- Mobile menu and nested navigation.
- Newsletter submit, success, and error states.
- Style Book primary color propagation through Shadow DOM.
- No wrapper spacing or horizontal overflow.
- No console errors or failed Site Shell/content requests.

Keep the PR Draft until runtime screenshots pass.
