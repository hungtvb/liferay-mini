# React Site Shell and section Fragment shells

## Goal

The reference frontend under `prototypes/nexcent-static` is implemented as
React custom elements in:

```text
client-extensions/nexcent-landing-elements/src/static-site/
```

The production Master Page can now use React for Header, body sections, and
Footer. Every Liferay Fragment remains intentionally thin and contains only the
matching custom-element tag plus attributes generated from Fragment Settings.

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

## Theme and Style Book contract

The React custom elements render in Shadow DOM, but CSS custom properties still
inherit from each custom-element host. The runtime converts the static prototype
brand colors to active Nexcent Style Book variables.

The theme project now loads:

```text
client-extensions/nexcent-theme/assets/global-entry.css
├── global.css
└── react-shell.css
```

`global.css` keeps the existing Nexcent and legacy Master Page rules.
`react-shell.css` is limited to:

- React custom-element host defaults.
- Style Book token propagation.
- Liferay Fragment wrapper margin/padding normalization.
- Header stacking and mobile sticky behavior.

Component-level visual CSS remains inside the React Shadow DOM. Do not duplicate
Header/Footer component rules in Theme CSS.

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

Keep old `.nxc-site-*` rules temporarily for the legacy Master Page until React
runtime screenshots pass. They do not penetrate the React Shadow DOM.

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

Build and redeploy the updated theme project:

```bash
cd ../nexcent-theme
../../gradlew clean build
cp dist/*.zip ../../bundles/osgi/client-extensions/
```

The client-extension key and UI name remain unchanged:

```text
nexcent-global-css
Nexcent Global CSS
```

Only its resource URL changed from `global.css` to `global-entry.css`. After
redeploying, confirm the existing **Nexcent Global CSS** entry is still applied
to the Master Page.

Add **Nexcent React Runtime** as Global JavaScript to the Master Page. A
Fragment custom tag does not load the JavaScript bundle by itself.

## Static React preview

The standalone preview uses the bundled mock JSON and does not call Liferay:

```bash
cd client-extensions/nexcent-landing-elements
npm ci
npm run preview:static
```

Open `http://localhost:4173` while Liferay remains available at
`http://localhost:8080`.

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

The Header and Footer Fragment HTML stays one custom-element tag only. It passes
the runtime site ID from `themeDisplay.getScopeGroupId()` and safely escaped
Fragment Settings to React.

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

## Fragment Settings

Select the Header or Footer Fragment on the Master Page and use its **General**
configuration tab.

Header settings:

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

Footer settings:

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

Runtime value precedence is:

```text
Fragment Setting override
    ↓ when empty
Site Shell site/account value
    ↓ when unavailable
Bundled content.json/static asset fallback
```

Navigation items and authenticated account URLs remain runtime data and are not
copied into Fragment Settings.

## Authentication and fallback behavior

- Guest users receive Login and Sign up URLs.
- Authenticated users receive portrait, display name, My Account, and Sign out.
- The endpoint is read-only and guest accessible; each navigation item still
  passes its Liferay permission check.
- The REST response uses flat navigation items for REST Builder compatibility;
  React reconstructs nested trees using `parentExternalReferenceCode`.
- If the REST module is unavailable, React renders the bundled static fallback
  and marks the custom element with `data-site-shell-state="fallback"` plus an
  error detail attribute for runtime diagnostics.

## Newsletter

The default Footer setting posts to:

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

The endpoint and every visible newsletter state message can be changed through
the Footer Fragment Settings.

## Content and styling

- Static demo copy remains in `prototypes/nexcent-static/content.json`.
- Images and icons reuse the original prototype assets.
- React elements use Shadow DOM so the static reset cannot leak into Clay.
- Prototype colors are mapped to the active Style Book variables at build time.
- Container width, gutter, font family, focus color, surfaces, primary colors,
  navigation colors, and footer colors inherit from the custom-element host.
- Hero carousel behavior is React-owned; Swiper and AOS CDN scripts are not
  required.

## Runtime gates

Capture the complete Master Page at `1440px`, `768px`, and `375px`. Also change
the Style Book primary color to a temporary non-default value and verify Header,
buttons, links, selected navigation, and focus states update inside Shadow DOM.
Do not merge while typography, navigation dropdowns, authenticated/guest states,
mobile menu, article overlays, newsletter states, Header, Footer, Style Book
token propagation, wrapper spacing, or console/network checks still fail.
