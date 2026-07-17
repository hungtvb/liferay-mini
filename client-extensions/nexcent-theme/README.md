# Nexcent Theme Client Extension Project

This single client-extension project packages the shared visual foundation for the Nexcent site.

## Included client extensions

| Key | Type | Purpose |
|---|---|---|
| `nexcent-theme-css` | `themeCSS` | Clay/main theme output and frontend token definition |
| `nexcent-global-css` | `globalCSS` | Shared aliases, utilities, OOTB Master Page styling hooks, and accessibility rules |
| `nexcent-global-js` | `globalJS` | Small portal context and event utilities under `window.Nexcent` |
| `nexcent-theme-favicon` | `themeFavicon` | Project favicon |

The CSS and JavaScript extensions use `layout` scope. They affect only site pages where an administrator enables them; they do not modify the Control Panel.

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
2. Open `Site Builder → Pages → Configuration` and apply `Nexcent Theme CSS` to the public pages so its frontend token definition is available site-wide.
3. Import and publish `Nexcent Default` under `Design → Style Books`.
4. Edit `Nexcent Landing Master` and open its design configuration.
5. Select `Nexcent Theme Favicon`.
6. Select the `Nexcent Default` Style Book.
7. Add `Nexcent Global CSS` and `Nexcent Global JavaScript`.
8. Publish the Master Page and the pages using it.

## OOTB Master Page hooks

Header, Footer, Navigation, and Newsletter remain Liferay OOTB compositions. Add these CSS classes through the Page Builder Advanced panel when the matching visual treatment is needed:

```text
nxc-site-header
nxc-site-footer
nxc-newsletter
nxc-container
nxc-section
```

No custom Header, Footer, Navigation, or Form fragment is required.
