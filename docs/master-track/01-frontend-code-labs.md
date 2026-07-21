# Frontend Code Labs

## Prerequisites

- Liferay DXP 2026.Q1.1 is running.
- Java 21 and Node.js 22+ are available.
- The learner is working from the repository root.
- Complete Practitioner Labs 01.1–01.4 first.

---

# Lab FE-01 — Theme CSS, Style Book, Global CSS/JS

## Copy source

Use the reviewed project:

```text
client-extensions/nexcent-theme/
```

The learner can create the same files manually by copying the content from this directory, or copy the project into a clean workspace:

```bash
mkdir -p client-extensions
cp -R client-extensions/nexcent-theme /path/to/clean-workspace/client-extensions/
```

## Build

```bash
cd client-extensions/nexcent-theme
../../gradlew clean build
find dist -maxdepth 1 -type f -name '*.zip' -print
```

## Deploy to the local bundle

```bash
cp dist/*.zip ../../bundles/osgi/client-extensions/
```

Then apply:

1. `Nexcent Theme CSS` to the public page set.
2. Import and publish `Nexcent Default` Style Book.
3. Add `Nexcent Global CSS` and `Nexcent Global JavaScript` to the Master Page design configuration.
4. Select `Nexcent Theme Favicon`.
5. Keep the Master Page in Draft until Header and Footer runtime gates pass.

## Checkpoint

Run in the browser console:

```javascript
const styles = getComputedStyle(document.documentElement);

console.table({
    body: styles.getPropertyValue('--nxc-style-body-size').trim(),
    container: styles.getPropertyValue('--nxc-style-container-width').trim(),
    headerContainer: styles
        .getPropertyValue('--nxc-style-wide-container-width')
        .trim(),
    navigation: styles.getPropertyValue('--nxc-style-navigation').trim(),
});
```

Expected defaults:

```text
body: 0.875rem
container: 73.875rem
headerContainer: 83.125rem
navigation: #18191f
```

---

# Lab FE-02 — Nexcent Component Fragments

## Source

Use the Fragment Set source from:

```text
training/master-track-code-labs/fragments/
```

The set contains:

```text
fragments/
├── collection.json
├── nexcent-account-actions/
├── nexcent-mobile-navigation/
└── nexcent-section-wrapper/
```

Every fragment folder must contain a valid `fragment.json` and all files referenced by `htmlPath`, `cssPath`, `jsPath`, and `configurationPath`.

## Validate

From the repository root:

```bash
node training/master-track-code-labs/scripts/validate-lab-kit.mjs
```

## Package the Fragment Set

On Windows PowerShell:

```powershell
./training/master-track-code-labs/scripts/package-fragments.ps1
```

Expected output:

```text
training/master-track-code-labs/fragments/collections-nexcent-components.zip
```

The ZIP must use the Liferay Fragment Set import structure:

```text
collections-nexcent-components.zip
└── nexcent-components/
    ├── collection.json
    └── fragments/
        ├── nexcent-account-actions/
        ├── nexcent-mobile-navigation/
        └── nexcent-section-wrapper/
```

Do not ZIP one fragment folder directly for this course flow.

## Import or update

```text
Site Menu
→ Design
→ Fragments
→ Fragment Sets options
→ Import
```

Import `collections-nexcent-components.zip`.

For an existing `Nexcent Components` set, enable overwrite/update for matching items. Keep the same fragment and collection keys so Liferay updates the source instead of creating duplicates.

Confirm the set contains:

```text
Nexcent Account Actions
Nexcent Mobile Navigation
Nexcent Section Wrapper
```

## Use `Nexcent Section Wrapper`

Add it to a Content Page and configure:

```text
Section ID: services
Background: surface
Use Wide Container: enabled
```

Drag a Custom Element or another Fragment into its drop zone.

Checkpoint:

```javascript
const section = document.querySelector('#services');

console.log({
    ready: section?.dataset.nexcentFragmentReady,
    className: section?.className,
});
```

Expected `ready` value: `true`.

## Use `Nexcent Mobile Navigation`

Author the Header in the `Nexcent Master Page`:

```text
Page Header
└── Header Inner
    ├── Nexcent Logo
    └── Nexcent Mobile Navigation
        └── Navigation Drop Zone
            └── Header Menu
                ├── OOTB Menu Display → Nexcent Header
                └── Nexcent Account Actions
```

Required Page Builder classes:

```text
Page Header:          nxc-site-header
Header Inner:         nxc-header-inner
Logo:                 navbar-brand
Header Menu:          nxc-header-menu
Menu Display:         nxc-header-navigation
```

The mobile navigation fragment owns only the responsive shell, hamburger button, ARIA state, and drop zone. It does not embed Menu Display as a runtime widget.

Runtime checkpoint at `375px`:

```text
[ ] Hamburger is visible
[ ] Panel is closed by default in View mode
[ ] Click toggles the panel
[ ] aria-expanded updates
[ ] Escape closes and returns focus
[ ] Selecting a menu link closes the panel
[ ] Guest and authenticated states both work
[ ] No horizontal scrollbar
```

In Edit mode the panel remains open so the author can access its drop zone.

---

# Lab FE-03 — Hero, Services, and Features Custom Elements

## Copy source

Use the reviewed application:

```text
client-extensions/nexcent-landing-elements/
```

It registers:

```text
nexcent-hero
nexcent-services
nexcent-features
nexcent-content-importer
nexcent-lab-status
```

The registration contract is in:

```text
client-extensions/nexcent-landing-elements/client-extension.yaml
```

## Install, test, and build

```bash
cd client-extensions/nexcent-landing-elements
npm ci
npm run typecheck
npm test
npm run build
../../gradlew clean build
```

## Deploy

```bash
cp dist/*.zip ../../bundles/osgi/client-extensions/
```

## Start with mock data

Use:

```text
training/master-track-code-labs/sample-data/nexcent-landing.mock.json
```

Mock data is for FE development only. After Content Lab C-01 passes, configure the application to consume live Headless Delivery responses.

## Add to the page

1. Edit the page.
2. Add `Nexcent Section Wrapper`.
3. Drag the matching Custom Element widget into the wrapper drop zone.
4. Publish.

## Checkpoint

- Hero renders loading, ready, empty, and error states.
- Services sort by `sortOrder` and exclude `active=false`.
- Features use one reusable renderer for left/right variants.
- No numeric content structure ID is committed to frontend source.

---

# Lab FE-04 — Community Remote App

## Copy source

```text
remote-apps/nexcent-community-app/
client-extensions/nexcent-remote-app-registration/
```

## Build the hosted app

```bash
cd remote-apps/nexcent-community-app
npm ci
npm run typecheck
npm run build
```

Host the generated assets on an HTTPS origin. The project preview currently publishes them under:

```text
https://nexcent-liferay-static.vercel.app/remote-app/
```

## Build and deploy the registration

```bash
cd ../../client-extensions/nexcent-remote-app-registration
../../gradlew clean build
cp dist/*.zip ../../bundles/osgi/client-extensions/
```

## Checkpoint

- The Remote App is visible in Liferay Client Extensions.
- Its script and CSS load from the external host.
- Loading, empty, error, and permission failures are visible rather than silently replaced with hard-coded cards.

## Evidence to capture

- Client Extension registration screen.
- Browser Network entries for hosted JS/CSS.
- Page screenshot at desktop and mobile widths.
- Console free of unhandled exceptions.
