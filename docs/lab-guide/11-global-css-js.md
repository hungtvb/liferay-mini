# Lab 11 — Add Global CSS and JavaScript Client Extensions

## Overview

Move the shared Nexcent design foundation and browser utilities out of the React bundle and into dedicated Liferay Client Extensions.

At the end of this lab:

- Design tokens are defined once in a company-scoped Global CSS Client Extension.
- Shared button and accessibility utilities are available to every Nexcent component.
- A company-scoped Global JavaScript Client Extension exposes a small `window.Nexcent` namespace.
- React components use Global JavaScript when available and fall back to `Liferay.ThemeDisplay` when it is not.
- Component CSS no longer redefines global design tokens.

## Estimated time

60–90 minutes.

## Prerequisites

- Labs 00–10 are complete.
- Hero, Services, and Features build successfully.
- Liferay DXP `2026.Q1.1 LTS` is running locally.
- You understand the difference between component styles and global design foundations.

## Why use separate Global Client Extensions?

The landing page has multiple Custom Elements, but they share the same:

- Brand colors
- Typography
- Container width
- Radius and shadow values
- Button states
- Focus styles
- Portal context lookup

Copying these definitions into every React component creates drift and increases the bundle size. Global CSS and JavaScript Client Extensions provide one deployable source of truth.

The course uses `scope: company` because DXP 2026.Q1 supports company-scoped Global CSS and Global JavaScript. Once deployed, the assets apply across the instance without adding them individually to every page.

## Step 1 — Create the Client Extension project

Create this structure:

```text
client-extensions/nexcent-global-assets/
├── assets/
│   ├── global.css
│   └── global.js
└── client-extension.yaml
```

This project contains static files only. It does not require Node.js, React, or a package manager.

## Step 2 — Configure Global CSS and JavaScript

Add `client-extension.yaml`:

```yaml
assemble:
    - from: assets
      hashify: global.css
      into: static
    - from: assets
      hashify: global.js
      into: static

nexcent-global-css:
    name: Nexcent Global CSS
    scope: company
    type: globalCSS
    url: global.*.css

nexcent-global-js:
    name: Nexcent Global JavaScript
    scope: company
    scriptElementAttributes:
        data-senna-track: permanent
    scriptLocation: head
    type: globalJS
    url: global.*.js
```

### What the configuration does

- `hashify` adds a content hash to the deployed filename for cache invalidation.
- `scope: company` applies the asset to the whole Liferay instance.
- `scriptLocation: head` makes the shared namespace available before page widgets initialize.
- `data-senna-track: permanent` prevents the script from being reloaded unnecessarily during SPA navigation.

## Step 3 — Define the design tokens

Create `assets/global.css` and begin with the Figma tokens:

```css
:root {
    --nxc-color-primary: #4caf4f;
    --nxc-color-primary-hover: #388e3b;
    --nxc-color-primary-active: #237d31;
    --nxc-color-primary-dark: #103e13;
    --nxc-color-text: #4d4d4d;
    --nxc-color-heading: #263238;
    --nxc-color-muted: #717171;
    --nxc-color-border: #abbed1;
    --nxc-color-surface: #f5f7fa;
    --nxc-color-white: #ffffff;
    --nxc-font-family: Inter, system-ui, sans-serif;
    --nxc-container-width: 72rem;
    --nxc-radius-sm: 0.25rem;
    --nxc-radius-md: 0.75rem;
    --nxc-shadow-card: 0 0.5rem 1.5rem rgb(38 50 56 / 10%);
}
```

The Figma file contains two possible green values. This course uses `#4caf4f` because it is the primary color used by the landing page components and buttons.

## Step 4 — Add shared component foundations

Move reusable button behavior into Global CSS:

```css
.nxc-button {
    align-items: center;
    border: 0;
    border-radius: var(--nxc-radius-sm);
    cursor: pointer;
    display: inline-flex;
    font-family: var(--nxc-font-family);
    font-size: 1rem;
    font-weight: 600;
    justify-content: center;
    min-height: 3rem;
    padding: 0.75rem 1.5rem;
    text-decoration: none;
}

.nxc-button--primary {
    background: var(--nxc-color-primary);
    color: var(--nxc-color-white);
}
```

Also implement:

- Hover state
- Active state
- Visible keyboard focus
- Disabled state
- Reduced-motion behavior
- `.nxc-visually-hidden` accessibility utility

Keep section-specific spacing in the component stylesheet. For example, Hero may define:

```css
.nxc-hero .nxc-button {
    margin-top: 2rem;
}
```

Global CSS owns what a button is. Hero CSS owns where the button is placed inside Hero.

## Step 5 — Add shared browser utilities

Create `assets/global.js`:

```js
(() => {
    const getPortalContext = () => {
        const themeDisplay = window.Liferay?.ThemeDisplay;

        return {
            host: window.location.host,
            languageId: themeDisplay?.getLanguageId?.() ?? 'unknown',
            scopeGroupId:
                themeDisplay?.getScopeGroupId?.()?.toString() ?? 'unknown',
            signedIn: themeDisplay?.isSignedIn?.() ?? false,
        };
    };

    const dispatch = (name, detail = {}) => {
        window.dispatchEvent(
            new CustomEvent(`nexcent:${name}`, {detail})
        );
    };

    window.Nexcent = {
        ...(window.Nexcent ?? {}),
        dispatch,
        getPortalContext,
        version: '0.1.0',
    };
})();
```

The global script exposes a deliberately small API. It does not contain page content, Structure IDs, passwords, tokens, or business rules.

## Step 6 — Use Global JavaScript from TypeScript

Update:

```text
client-extensions/nexcent-landing-elements/src/liferay/global.ts
```

Define the shared contract:

```ts
export type NexcentGlobal = {
    dispatch?: (name: string, detail?: unknown) => void;
    getPortalContext?: () => PortalContext;
    version?: string;
};
```

Read `window.Nexcent` first and preserve a local fallback:

```ts
export function getPortalContext(): PortalContext {
    const globalContext = getNexcent()?.getPortalContext?.();

    if (globalContext) {
        return globalContext;
    }

    // Fall back to Liferay.ThemeDisplay.
}
```

The fallback allows the React project to run in isolation during development and gives an actionable error if the global asset was not deployed.

## Step 7 — Remove duplicated tokens from component CSS

Search the component source:

```bash
grep -R --line-number -- "--nxc-color-primary:" \
  client-extensions/nexcent-landing-elements/src
```

Expected result: no matches.

Component styles should consume variables:

```css
.nxc-services {
    color: var(--nxc-color-text);
    font-family: var(--nxc-font-family, Inter, system-ui, sans-serif);
}

.nxc-services__container {
    max-width: var(--nxc-container-width, 72rem);
}
```

Fallback values are allowed for essential layout properties, but canonical token definitions remain in `nexcent-global-assets`.

## Step 8 — Deploy the Global Client Extensions

From the workspace root:

```bash
./gradlew :client-extensions:nexcent-global-assets:deploy
```

Watch the Liferay log for both entries:

```text
Nexcent Global CSS
Nexcent Global JavaScript
```

Because both entries use company scope, you do not need to add them manually to each page.

## Step 9 — Rebuild and deploy the Custom Elements

```bash
cd client-extensions/nexcent-landing-elements
npm install
npm run typecheck
npm run build
cd ../..

./gradlew :client-extensions:nexcent-landing-elements:deploy
```

The build must still create:

```text
build/index.js
build/style.css
```

## Step 10 — Verify in the browser

Open the published landing page and run:

```js
window.Nexcent
```

Expected: an object containing `dispatch`, `getPortalContext`, and `version`.

Check the current site context:

```js
window.Nexcent.getPortalContext()
```

Check the CSS token:

```js
getComputedStyle(document.documentElement)
    .getPropertyValue('--nxc-color-primary')
    .trim()
```

Expected:

```text
#4caf4f
```

Test SPA navigation between two Liferay pages. `window.Nexcent` must remain available and must not be registered repeatedly.

## Expected result

- Hero, Services, and Features retain the same visual design.
- Shared buttons use one global implementation.
- Global tokens are available on every Liferay page.
- `window.Nexcent.getPortalContext()` returns the current language, site ID, host, and sign-in state.
- React components no longer own global design tokens.

## Checkpoint

- [ ] `nexcent-global-css` is deployed with company scope.
- [ ] `nexcent-global-js` is deployed with company scope.
- [ ] Global JavaScript loads in the page head.
- [ ] The script is permanent across Senna navigation.
- [ ] `window.Nexcent` is available in the console.
- [ ] `--nxc-color-primary` resolves to `#4caf4f`.
- [ ] The React project passes type-check and build.
- [ ] Component source does not redefine canonical tokens.

## Troubleshooting

### `window.Nexcent` is undefined

1. Confirm `nexcent-global-js` deployed successfully.
2. Hard refresh the browser to bypass an old cached page.
3. Inspect the page source for `global.<hash>.js`.
4. Verify the environment supports company-scoped Global JavaScript.
5. Confirm `scriptLocation` is `head`.

### The CSS variables are empty

1. Inspect the page source for `global.<hash>.css`.
2. Confirm `scope: company` is present on the Global CSS entry.
3. Confirm the deployed asset contains `:root` tokens.
4. Clear the browser cache after changing a hashified asset.

### Buttons lost their styling

Deploy Global CSS before or together with the refactored Custom Elements. The component bundle intentionally no longer contains the shared button foundation.

### Styles conflict with Clay or another theme

Keep selectors prefixed with `nxc-`. Avoid global element selectors such as `button`, `a`, `h1`, or `section` unless they are scoped under a Nexcent component root.

## Knowledge check

1. Why is a company-scoped Global CSS Client Extension preferable to copying tokens into every component?
2. What does `hashify` solve?
3. Why does Global JavaScript expose a small namespace instead of adding many global functions?
4. What problem does `data-senna-track: permanent` address?
5. Why does the TypeScript client retain a `ThemeDisplay` fallback?
6. Which styles belong globally, and which styles should remain inside a component?

## Challenge

Add a secondary button variant to Global CSS and use it in one Feature article without duplicating the button foundation in `features.css`.

## Official references

- Global CSS Client Extensions: https://learn.liferay.com/w/dxp/development/client-extensions/style-themes-and-sites/global-css
- Global JavaScript Client Extensions: https://learn.liferay.com/w/dxp/development/client-extensions/style-themes-and-sites/global-js
- Client Extension YAML reference: https://learn.liferay.com/w/dxp/development/client-extensions/client-extension-yaml-configuration-reference
