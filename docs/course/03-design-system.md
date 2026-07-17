# 03 — Build the Unified Theme Package and Style Book

## Goal

Convert the detailed Figma Style Guide into one reusable Liferay design foundation that is deployed from a single client-extension project.

## Delivery chain

```text
Figma Style Guide
        ↓
client-extensions/nexcent-theme
├── Theme CSS
├── frontend-token-definition.json
├── Global CSS
├── Global JavaScript
├── Theme Favicon
└── Nexcent Default Style Book values
        ↓
Nexcent Landing Master
        ↓
OOTB Header, Footer, Navigation, and Newsletter
+ Custom Elements and Remote App
```

## Why one project?

A client-extension project can define multiple client extension entries in one `client-extension.yaml`. The Nexcent package keeps all shared appearance assets versioned and deployed together while each item remains selectable independently in Liferay.

```text
nexcent-theme-css
nexcent-global-css
nexcent-global-js
nexcent-theme-favicon
```

The Style Book is not a separate frontend client-extension type. It is a site configuration that consumes the frontend token definition supplied by `nexcent-theme-css`. The import files are versioned inside the same project.

## Project structure

```text
client-extensions/nexcent-theme/
├── client-extension.yaml
├── package.json
├── assets/
│   ├── favicon.svg
│   ├── global.css
│   └── global.js
├── src/
│   ├── css/
│   │   ├── _clay_variables.scss
│   │   └── _custom.scss
│   └── frontend-token-definition.json
├── style-book/
│   └── nexcent-default/
│       ├── frontend-tokens-values.json
│       └── style-book.json
└── README.md
```

## Responsibility boundary

| Layer | Owns |
|---|---|
| Theme CSS | Clay/main theme output, baseline page styles, and frontend token definition |
| Style Book | Approved editor-selected values for the Theme CSS tokens |
| Global CSS | Stable `--nxc-*` aliases, utilities, accessibility rules, and OOTB Master Page styling hooks |
| Global JavaScript | Small portal context and shared event utilities under `window.Nexcent` |
| Theme Favicon | Page favicon option supplied by the Client Extension |
| Component CSS | Section layout and local variants |
| Web Content | Copy, images, links, and list data |

## Theme CSS entry

`nexcent-theme-css` uses the `styled` base theme and produces `clay.css` and `main.css`.

```yaml
nexcent-theme-css:
    clayURL: css/clay.css
    frontendTokenDefinitionJSON: src/frontend-token-definition.json
    mainURL: css/main.css
    name: Nexcent Theme CSS
    type: themeCSS
```

The frontend token definition exposes Figma-approved colors, typography, container width, section spacing, page gutter, Header height, radius, and card shadow.

## Global CSS entry

`nexcent-global-css` uses `layout` scope. It is enabled only on the Nexcent site pages or Master Page and does not affect the Control Panel.

```yaml
nexcent-global-css:
    name: Nexcent Global CSS
    scope: layout
    type: globalCSS
    url: global.css
```

Shared aliases use Style Book variables with fallbacks:

```css
--nxc-color-primary: var(--nxc-style-primary, #4caf4f);
--nxc-container-width: var(--nxc-style-container-width, 72rem);
--nxc-radius-md: var(--nxc-style-radius-md, 0.75rem);
```

OOTB Master Page elements can opt into visual hooks through Page Builder CSS classes:

```text
nxc-site-header
nxc-site-footer
nxc-newsletter
nxc-container
nxc-section
```

These classes style OOTB compositions; they do not create custom Header, Footer, Navigation, or Form fragments.

## Global JavaScript entry

`nexcent-global-js` provides portal context, Style Book token lookup, and Nexcent events.

```javascript
window.Nexcent.getPortalContext();
window.Nexcent.getStyleToken('--nxc-style-primary');
window.Nexcent.dispatch('component-ready', {component: 'hero'});
```

It must not contain hard-coded business content or custom mobile-menu behavior. Liferay OOTB Navigation Bar owns hamburger and collapse interactions.

## Favicon entry

```yaml
nexcent-theme-favicon:
    name: Nexcent Theme Favicon
    type: themeFavicon
    url: favicon.svg
```

The favicon is selected in Site/Page/Master design settings after deployment.

## Nexcent Default Style Book

The Style Book files target the Theme CSS external reference code:

```json
{
  "defaultStyleBookEntry": true,
  "frontendTokensValuesPath": "frontend-tokens-values.json",
  "name": "Nexcent Default",
  "themeId": "nexcent-theme-css"
}
```

To import:

1. Deploy `client-extensions/nexcent-theme`.
2. Apply `Nexcent Theme CSS` to the site's public pages.
3. Zip `style-book.json` and `frontend-tokens-values.json` at the archive root.
4. Open `Site Menu → Design → Style Books`.
5. Select `Options → Import`.
6. Import, publish, and mark `Nexcent Default` as the default for `Nexcent Theme CSS` when appropriate.

## Apply to the Master Page

In `Nexcent Landing Master → Page Design Options`:

1. Use the site's inherited `Nexcent Theme CSS`.
2. Select `Nexcent Theme Favicon`.
3. Select `Nexcent Default` Style Book.
4. Add `Nexcent Global CSS`.
5. Add `Nexcent Global JavaScript`.
6. Publish the Master Page.

## FE tasks

1. Maintain the unified package under `client-extensions/nexcent-theme`.
2. Keep frontend token names and CSS variable mappings stable.
3. Keep shared technical styles in Global CSS.
4. Keep portal utilities small, idempotent, and business-content free.
5. Make component styles consume `--nxc-*` aliases rather than Figma values directly.
6. Verify the favicon and Style Book package against the deployed Theme CSS key.

## BE/Liferay tasks

1. Deploy the unified Theme project.
2. Apply `Nexcent Theme CSS` to the public page set.
3. Import and publish `Nexcent Default` Style Book.
4. Configure the Master Page with the favicon, Style Book, Global CSS, and Global JavaScript.
5. Confirm editor permissions and token governance.
6. Record token-change evidence without rebuilding FE components.

## Required verification

```javascript
const styles = getComputedStyle(document.documentElement);

({
    primary: styles.getPropertyValue('--nxc-style-primary').trim(),
    componentPrimary: styles.getPropertyValue('--nxc-color-primary').trim(),
    container: styles.getPropertyValue('--nxc-style-container-width').trim(),
    headerHeight: styles.getPropertyValue('--nxc-style-header-height').trim(),
});
```

## Checkpoint

- [ ] One client-extension project defines Theme CSS, Global CSS, Global JavaScript, and Theme Favicon.
- [ ] Theme CSS builds `clay.css` and `main.css`.
- [ ] `Nexcent Default` targets `nexcent-theme-css`.
- [ ] Every Style Book value maps to a token in `frontend-token-definition.json`.
- [ ] Global CSS uses `var(--nxc-style-*, fallback)` aliases.
- [ ] Header, Footer, Navigation, and Newsletter remain OOTB compositions.
- [ ] Components do not redefine canonical tokens.
- [ ] A token change reaches the page without a React rebuild.
