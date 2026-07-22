# React section runtime and Fragment shells

## Goal

The original reference frontend under `prototypes/nexcent-static` is now
available as React components in:

```text
client-extensions/nexcent-landing-elements/src/static-site/
```

The Liferay Fragment source remains intentionally thin. Each
`nexcent-react-*` Fragment contains only the matching custom-element tag.

## Build and deploy the runtime

```bash
cd client-extensions/nexcent-landing-elements
npm ci
npm run typecheck
npm test
npm run build
../../gradlew clean build
cp dist/*.zip ../../bundles/osgi/client-extensions/
```

After deployment, add **Nexcent React Runtime** to the Master Page or page
under Global JavaScript. The runtime is an ES module and registers every
`nexcent-react-*` tag once.

A Fragment tag by itself does not load JavaScript. The Global JavaScript
binding is therefore required before any React Fragment shell can render.

## Package and import the Fragments

```powershell
./training/master-track-code-labs/scripts/package-fragments.ps1
```

Import the generated
`training/master-track-code-labs/fragments/collections-nexcent-components.zip`
into **Site Menu → Design → Fragments**.

## Production page composition

Use the body shells in this order:

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

Keep the reviewed editable/OOTB Header and Footer in the Master Page.
`Nexcent React Header Preview`, `Nexcent React Footer Preview`, and
`Nexcent React Full Page Preview` are visual parity tools only.

## Content and styling

- Demo copy is stored in `prototypes/nexcent-static/content.json`.
- Images and icons are imported from the static prototype so there is one
  visual asset source.
- Each React section uses Shadow DOM. The original reset and selectors cannot
  leak into Clay or other Liferay fragments.
- The hero carousel is implemented in React; Swiper and AOS CDN scripts are no
  longer required.

## Runtime gates

Capture the page at `1440px`, `768px`, and `375px` and compare it with the
static prototype. Do not merge while spacing, typography, image crop,
three-card desktop layout, article overlays, hover states, Header, or Footer
still diverge.
