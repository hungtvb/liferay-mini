# 03 — Build Theme CSS, Style Book, Global CSS, and Global JavaScript

## Goal

Convert the detailed Figma Style Guide into a reusable Liferay design foundation.

## Delivery chain

```text
Figma Style Guide
        ↓
frontend-token-definition.json
        ↓
Nexcent Theme CSS
        ↓
Nexcent Default Style Book
        ↓
--nxc-style-* variables
        ↓
Global CSS aliases
        ↓
Custom Elements and Remote App
```

## FE tasks

1. Maintain `client-extensions/nexcent-theme-css` using the `styled` base theme.
2. Define tokens for brand colors, typography, width, spacing, radius, and effects.
3. Maintain `client-extensions/nexcent-global-assets`.
4. Keep shared buttons, links, focus states, visually-hidden utilities, and reduced-motion rules in Global CSS.
5. Keep portal utilities in `window.Nexcent` through Global JavaScript.
6. Make component styles consume aliases rather than Figma values directly.

## BE/Liferay tasks

1. Deploy Nexcent Theme CSS.
2. Create and publish `Nexcent Default` Style Book.
3. Apply it to the landing page.
4. Confirm editor permissions and token governance.
5. Record temporary token-change evidence without rebuilding FE.

## Responsibility boundary

| Layer | Owns |
|---|---|
| Theme CSS | Clay/main theme output and token definition |
| Style Book | Editor-selected design values |
| Global CSS | Stable aliases and technical shared styles |
| Component CSS | Section layout and local variants |
| Web Content | Copy, images, links, and list data |

## Required verification

```javascript
const styles = getComputedStyle(document.documentElement);

({
    primary: styles.getPropertyValue('--nxc-style-primary').trim(),
    componentPrimary: styles.getPropertyValue('--nxc-color-primary').trim(),
    container: styles.getPropertyValue('--nxc-style-container-width').trim(),
});
```

## Checkpoint

- [ ] Theme CSS builds `clay.css` and `main.css`.
- [ ] Style Book exposes the Figma-approved token set.
- [ ] Global CSS uses `var(--nxc-style-*, fallback)` aliases.
- [ ] Components do not redefine canonical tokens.
- [ ] A token change reaches the page without a React rebuild.
