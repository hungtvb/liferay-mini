# Nexcent static-to-React runtime

This package converts the markup and behaviour from `prototypes/nexcent-static`
into React components while keeping that prototype as the visual baseline.

## Runtime contract

- One Vite bundle registers all `nexcent-react-*` custom elements.
- Each element renders into a Shadow DOM to prevent the original static reset
  and component selectors from leaking into Liferay.
- The original `rem` scale is converted to pixels inside the Shadow DOM because
  the static source was authored against a 62.5% root font size.
- Business copy is read from `prototypes/nexcent-static/content.json`; it is not
  embedded in JSX.
- The hero carousel is implemented with React state and timers, so Swiper and
  AOS CDNs are no longer runtime dependencies.

Attach **Nexcent React Runtime** as Global JavaScript to the Master Page before
using the Fragment shells.

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
