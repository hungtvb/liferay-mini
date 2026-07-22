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

Attach **Nexcent React Runtime** as Global JavaScript to the Master Page or
page before using the Fragment shells.

Production Header and Footer remain owned by the existing editable/OOTB
Liferay composition. `nexcent-react-header`, `nexcent-react-footer`, and
`nexcent-react-page` exist for visual parity preview only.
