# Nexcent Theme Client Extension Project

This client-extension project packages the shared visual foundation for the Nexcent site.

The active visual baseline is the reference frontend under `prototypes/nexcent-static`, imported from upstream commit `7d6c7dbc57be24febeca0e18fabdd35278809039` on 2026-07-20. Theme values are translated into Liferay-safe tokens and OOTB Master Page hooks; the upstream global reset, custom hamburger JavaScript, hard-coded content, Swiper, and AOS behavior are not copied into the theme.

## Included client extensions

| Key | Type | Purpose |
|---|---|---|
| `nexcent-theme-css` | `themeCSS` | Clay/main theme output and frontend token definition |
| `nexcent-global-css` | `globalCSS` | Shared aliases, utilities, OOTB Master Page styling hooks, and accessibility rules |
| `nexcent-global-js` | `globalJS` | Small portal context and event utilities under `window.Nexcent` |
| `nexcent-theme-favicon` | `themeFavicon` | Project favicon |

The CSS and JavaScript extensions use `layout` scope. They affect only site pages where an administrator enables them; they do not modify the Control Panel.

## 2026-07-20 visual sync

The theme now mirrors the accepted reference frontend for:

- Inter typography with a 14px body baseline;
- `#4caf4f` brand green, `#4d4d4d` headings, `#717171` body copy, and `#18191f` navigation;
- 1182px content containers and 1330px header containers;
- 15px horizontal page gutters;
- 48px default section spacing;
- 4px button radius and 8px card radius;
- reference card and raised-card shadows;
- OOTB Header Login and Sign up action treatments;
- OOTB Footer and newsletter visual treatment.

The imported reference removes keyboard focus outlines and owns a custom mobile menu. Those choices are intentionally not ported. Liferay owns the Navigation Bar collapse/hamburger interaction, and the theme preserves visible focus states and reduced-motion support.

## Style Book

`src/frontend-token-definition.json` defines the editable Nexcent tokens exposed by the Theme CSS client extension.

The default values are versioned under:

```text
style-book/nexcent-default/
├── frontend-tokens-values.json
└── style-book.json
```

To create the import ZIP, place both files at the root of the ZIP archive. Deploy and apply `Nexcent Theme CSS` before importing the Style Book because the Style Book targets the theme CSS external reference code `nexcent-theme-css`.

Import it from:

```text
Site Menu → Design → Style Books → Options → Import
```

## Apply to the Nexcent site

1. Deploy this client extension project.
2. Open `Site Builder → Pages → Configuration` and apply `Nexcent Theme CSS` to the public pages.
3. Import and publish `Nexcent Default` under `Design → Style Books`.
4. Edit `Nexcent Landing Master` and open its design configuration.
5. Select `Nexcent Theme Favicon`.
6. Select the `Nexcent Default` Style Book.
7. Add `Nexcent Global CSS` and `Nexcent Global JavaScript`.
8. Publish the Master Page and the pages using it.

When an older `Nexcent Default` entry already exists, import the updated package and confirm that the new token values are published. Existing Style Book values may otherwise continue overriding the updated Theme CSS fallbacks.

## OOTB Master Page hooks

Header, Footer, Navigation, and Newsletter remain Liferay OOTB compositions. Add these CSS classes through the Page Builder Advanced panel:

```text
nxc-site-header
nxc-header-inner
nxc-header-actions
nxc-login-action
nxc-signup-action
nxc-site-footer
nxc-footer-inner
nxc-newsletter
nxc-container
nxc-container--wide
nxc-section
```

Suggested mapping:

| Liferay element | CSS class |
|---|---|
| Header container | `nxc-site-header` |
| Inner header row | `nxc-header-inner` |
| Login action | `nxc-button nxc-login-action` |
| Sign up action | `nxc-button nxc-signup-action` |
| Footer container | `nxc-site-footer` |
| Inner footer row | `nxc-footer-inner` |
| Object Form / newsletter wrapper | `nxc-newsletter` |

No custom Header, Footer, Navigation, mobile-menu, or Form fragment is required.

## Verification

After applying the updated Style Book, run in the browser console:

```javascript
const styles = getComputedStyle(document.documentElement);

({
    body: styles.getPropertyValue('--nxc-style-body-size').trim(),
    container: styles.getPropertyValue('--nxc-style-container-width').trim(),
    headerContainer: styles
        .getPropertyValue('--nxc-style-wide-container-width')
        .trim(),
    gutter: styles.getPropertyValue('--nxc-style-page-gutter').trim(),
    heading: styles.getPropertyValue('--nxc-style-heading').trim(),
    navigation: styles.getPropertyValue('--nxc-style-navigation').trim(),
});
```

Expected default values:

```text
body: 0.875rem
container: 73.875rem
headerContainer: 83.125rem
gutter: 0.9375rem
heading: #4d4d4d
navigation: #18191f
```
