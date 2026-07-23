# React Fragment shells

## Goal

The Nexcent static reference is implemented as React custom elements under:

```text
client-extensions/nexcent-landing-elements/src/static-site/
```

Liferay Fragments remain the integration layer. They select Liferay resources,
resolve request context, and pass a small JSON contract to React. React owns the
pixel-perfect markup and Shadow DOM styles.

## Runtime architecture

```text
Nexcent Master Page
├── Nexcent React Header
│   ├── Header Navigation Menu selector
│   ├── themeDisplay account context
│   └── FreeMarker JSON → React
├── Main Content drop zone
│   ├── Hero → Headless Delivery
│   ├── Services → Headless Delivery
│   ├── Marketing → Headless Delivery
│   └── scalar sections → Fragment Settings
└── Nexcent React Footer
    ├── Company Navigation Menu selector
    ├── Support Navigation Menu selector
    ├── Social Navigation Menu selector
    ├── FreeMarker JSON → React
    └── Newsletter → Liferay Object API
```

Header and Footer do not call a Site Shell API. The existing
`modules/nexcent-site-shell` REST Builder module is retained only as an advanced
training lab and is not required by the production Master Page.

## Header contract

The Header Fragment exposes:

```text
Logo URL and alt text
Header navigationMenuSelector
Show account actions
Login / Sign up / My Account / Sign out labels
Create Account URL
```

FreeMarker reads:

```text
navigationSourceObject.navItems
themeDisplay.isSignedIn()
themeDisplay.getUser()
themeDisplay.getURLSignIn()
themeDisplay.getURLMyAccount()
themeDisplay.getURLSignOut()
```

It embeds the result in:

```html
<script data-nexcent-header-props type="application/json">…</script>
```

React reads the light-DOM script and renders nested navigation, guest actions,
or the authenticated account dropdown.

## Footer contract

The Footer Fragment exposes:

```text
Branding and copyright text
Company heading + navigationMenuSelector
Support heading + navigationMenuSelector
Social navigationMenuSelector
Newsletter text, endpoint, and visibility
```

Create these Navigation Menus:

```text
Header
Footer Company
Footer Support
Footer Social
```

The Social menu item label controls the design SVG mapping. Supported labels and
aliases include:

```text
Instagram
Dribbble
Twitter
X
X.com
YouTube
YouTube Channel
```

The Navigation Menu controls item presence, label, URL, target, and order. React
controls the branded SVG, size, color, and hover behavior. Unknown labels render a
text fallback instead of a Clay icon.

## Body data sources

The following sections call Headless Delivery directly from the browser with the
current Liferay session:

```text
Hero       → NXC_LANDING_HERO
Services   → NXC_SERVICE_ITEM
Marketing  → NXC_COMMUNITY_CARD
```

The keys are environment-stable contracts. The runtime resolves a Structure by:

```text
numeric ID → key → ERC
```

It does not use the editable Structure display name.

Request flow:

```text
GET /o/headless-delivery/v1.0/sites/{siteId}/content-structures?pageSize=200
        ↓ resolve key/ERC to numeric ID
GET /o/headless-delivery/v1.0/content-structures/{id}/structured-contents?flatten=true&pageSize=100
```

The loader sends the current locale, removes disabled entries, sorts by
`sortOrder`/`displayOrder`, limits the result, and de-duplicates identical browser
requests.

Scalar sections continue to use Fragment Settings because they are not reusable
content collections:

```text
Clients
Feature Primary
Statistics
Feature Secondary
Testimonial
CTA
```

See `docs/master-track/body-data-sources.md` for field mapping details.

## Theme contract

React components render in Shadow DOM. Style Book values reach them through
inherited CSS custom properties:

```text
Style Book tokens
    ↓
Nexcent Global CSS aliases
    ↓
custom-element host
    ↓
Shadow DOM component styles
```

Files:

```text
client-extensions/nexcent-theme/assets/global-entry.css
├── global.css
└── react-shell.css
```

## Build

```bash
cd client-extensions/nexcent-landing-elements
npm ci
npm run validate:data-sources
npm run typecheck
npm test
npm run build
npm run package:fragments
../../gradlew clean build

cd ../nexcent-theme
../../gradlew clean build
```

Import the generated Fragment package from:

```text
client-extensions/nexcent-landing-elements/build/fragments/
collections-nexcent-components.zip
```

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

Remove the previous Header/Footer composition to avoid duplicate navigation,
spacing, and mobile overlays.

## Runtime gates

Keep the PR Draft until all checks pass:

```text
Header data-runtime-state = ready
Footer data-runtime-state = ready
Hero data-content-state = ready
Services data-content-state = ready
Marketing data-content-state = ready
```

Also verify:

- All four Navigation Menus are selected in Fragment settings.
- Guest Login and Sign up URLs work.
- Authenticated avatar, My Account, and Sign out work.
- Social order, target, and branded SVG mapping are correct.
- Newsletter Object submission succeeds.
- Screenshots pass at 1440px, 768px, and 375px.
- No horizontal overflow, failed Headless request, or console error.
