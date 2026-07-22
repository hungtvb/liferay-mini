# Nexcent static-to-React runtime

This package converts the markup and behaviour from `prototypes/nexcent-static`
into React components while keeping that prototype as the visual baseline.

## Standalone static preview

The complete React page can run without Liferay and without the Site Shell API.
It reads the bundled mock content from:

```text
prototypes/nexcent-static/content.json
```

Run:

```bash
cd client-extensions/nexcent-landing-elements
npm ci
npm run preview:static
```

Open:

```text
http://localhost:4173
```

This preview renders `nexcent-react-page`, including the React Header, all body
sections, and the React Footer. Header and Footer intentionally use the bundled
fallback Site Shell generated from `content.json`; no request is sent to
Liferay.

The intended side-by-side workflow is:

```text
Static React preview: http://localhost:4173
Liferay runtime:       http://localhost:8080
```

## Runtime contract

- One Vite bundle registers all `nexcent-react-*` custom elements.
- Each element renders into a Shadow DOM to prevent the original static reset
  and component selectors from leaking into Liferay.
- The original `rem` scale is converted to pixels inside the Shadow DOM because
  the static source was authored against a 62.5% root font size.
- Static preview copy is read from `prototypes/nexcent-static/content.json`; it
  is not embedded in JSX.
- The hero carousel is implemented with React state and timers, so Swiper and
  AOS CDNs are no longer runtime dependencies.

Attach **Nexcent React Runtime** as Global JavaScript to the Master Page before
using the Fragment shells.

## Fragment source and packaging

The production Fragment Set source is colocated with the React runtime:

```text
client-extensions/nexcent-landing-elements/fragments/
├── collection.json
├── nexcent-react-header/
├── nexcent-react-hero/
├── ...
└── nexcent-react-footer/
```

This directory is the single source of truth for React Fragment shells. Files
under `training/master-track-code-labs/fragments` are training examples and must
not be used to package the production React Fragment Set.

Build the importable Fragment Set ZIP with:

```bash
cd client-extensions/nexcent-landing-elements
npm run package:fragments
```

Output:

```text
build/fragments/collections-nexcent-components.zip
```

The legacy PowerShell helper under `training/master-track-code-labs/scripts`
delegates to this command for backwards compatibility.

## Body content strategy

Production body sections intentionally use two data paths:

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

`content.json` remains the visual-test fixture and development fallback; it is
not the intended production source for body copy.

## Production Site Shell

`nexcent-react-header` and `nexcent-react-footer` are production components.
They share a cached request to:

```text
GET /o/nexcent-site-shell/v1.0/sites/{siteId}/site-shell
```

The endpoint returns permission-filtered Navigation Menu items, guest or
authenticated account state, and site identity. The REST Builder contract is
flat for generator compatibility; `siteShellClient.ts` reconstructs the nested
navigation tree in the browser.

If the endpoint is unavailable, both components render the bundled static
fallback and mark their custom-element host with
`data-site-shell-state="fallback"`.

`nexcent-react-page` remains a visual parity preview that uses the same React
components with fallback data.
