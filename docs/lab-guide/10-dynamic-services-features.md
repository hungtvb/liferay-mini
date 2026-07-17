# Lab 10 — Build Dynamic Services and Features Components

## Overview

Build two complete Custom Elements that resolve Web Content Structures by name or external reference code, load published Structured Content through Headless Delivery, map field values into typed frontend models, and render responsive layouts based on the Figma design.

## Estimated time

90–120 minutes.

## Prerequisites

- Labs 00–09 are complete.
- `NXC Services Intro`, `NXC Service Item`, and `NXC Feature Item` are published.
- The Hero component builds successfully.
- Node.js satisfies the version declared in `package.json`.

## What you will build

```text
<nexcent-services>
├── Services intro from NXC Services Intro
└── Service cards from NXC Service Item

<nexcent-features>
└── Alternating feature rows from NXC Feature Item
```

Both components include:

- Loading state
- Empty state
- Error state
- Active filtering
- Stable sorting
- Image alt text
- Responsive layout
- Sanitized HTML field rendering

## Step 1: Add a safe Rich Text renderer

Create:

```text
src/components/RichText/RichText.tsx
```

The component removes blocked elements, inline event handlers, inline styles, and executable URL schemes before passing trusted editor content to React.

Core usage:

```tsx
<RichText
    className="nxc-service-card__description"
    html={service.descriptionHtml}
/>
```

React escapes normal string fields automatically. Only HTML fields use this renderer.

## Step 2: Map Service fields

Create:

```text
src/components/Services/serviceMapper.ts
```

Map the exact Structure field references:

```ts
return {
    active: readBoolean(fields, 'active', true),
    descriptionHtml: readText(fields, 'descriptionHtml'),
    iconAlt: readText(fields, 'iconAlt'),
    iconUrl: readImage(fields, 'icon')?.contentUrl ?? '',
    sortOrder: readNumber(fields, 'sortOrder'),
    targetUrl: readText(fields, 'targetUrl'),
    title: readText(fields, 'title', item.title),
};
```

Create a second mapper for `NXC Services Intro`:

```ts
return {
    active: readBoolean(fields, 'active', true),
    description: readText(fields, 'description'),
    sortOrder: readNumber(fields, 'sortOrder'),
    title: readText(fields, 'title', item.title),
};
```

## Step 3: Load the two Services Structures

Create:

```text
src/components/Services/Services.tsx
```

Resolve the Structures concurrently:

```ts
const [introStructure, itemStructure] = await Promise.all([
    resolveContentStructure(siteId, introStructureIdentifier),
    resolveContentStructure(siteId, itemStructureIdentifier),
]);
```

Then load both collections:

```ts
const [introItems, serviceItems] = await Promise.all([
    listStructuredContents(introStructure.id),
    listStructuredContents(itemStructure.id),
]);
```

Filter and sort content instead of depending on API response order:

```ts
const services = serviceItems
    .map(mapServiceContent)
    .filter((item) => item.active)
    .sort((left, right) => left.sortOrder - right.sortOrder);
```

## Step 4: Render the Services grid

Use semantic markup:

```tsx
<section aria-labelledby={headingId} className="nxc-services">
    <header className="nxc-services__header">
        <h2 id={headingId}>{intro.title}</h2>
        <p>{intro.description}</p>
    </header>

    <div className="nxc-services__grid">
        {services.map((service) => (
            <article className="nxc-service-card" key={service.id}>
                {/* icon, title, URL, and HTML description */}
            </article>
        ))}
    </div>
</section>
```

Add responsive CSS in:

```text
src/components/Services/services.css
```

Expected columns:

```text
Desktop: 3
Tablet: 2
Mobile: 1
```

## Step 5: Map Feature fields

Create:

```text
src/components/Features/featureMapper.ts
```

Validate Select values instead of trusting arbitrary strings:

```ts
backgroundVariant: readChoice(
    readText(fields, 'backgroundVariant'),
    ['white', 'silver'] as const,
    'white'
),
imagePosition: readChoice(
    readText(fields, 'imagePosition'),
    ['left', 'right'] as const,
    'left'
),
```

This guarantees that only supported CSS modifiers reach the DOM.

## Step 6: Build the Features collection

Create:

```text
src/components/Features/Features.tsx
```

Load, map, filter, and sort the articles:

```ts
const features = (await listStructuredContents(structure.id))
    .map(mapFeatureContent)
    .filter((item) => item.active)
    .sort((left, right) => left.sortOrder - right.sortOrder);
```

Render content-driven variants:

```tsx
<section
    className={`nxc-feature nxc-feature--${feature.backgroundVariant} nxc-feature--image-${feature.imagePosition}`}
>
```

Do not write conditions tied to article IDs or array indexes.

## Step 7: Register the Custom Elements

Update `src/index.tsx`:

```tsx
registerReactElement('nexcent-services', (element) => (
    <Services
        introStructureIdentifier={
            element.getAttribute('intro-structure-identifier') ??
            'NXC Services Intro'
        }
        itemStructureIdentifier={
            element.getAttribute('item-structure-identifier') ??
            'NXC Service Item'
        }
    />
));

registerReactElement('nexcent-features', (element) => (
    <Features
        structureIdentifier={
            element.getAttribute('structure-identifier') ?? 'NXC Feature Item'
        }
    />
));
```

## Step 8: Expose both widgets to Liferay

Update `client-extension.yaml` with two `customElement` entries:

```yaml
nexcent-services:
    cssURLs:
        - style.css
    friendlyURLMapping: nexcent-services
    htmlElementName: nexcent-services
    instanceable: false
    name: Nexcent Services
    portletCategoryName: category.client-extensions
    properties:
        - "intro-structure-identifier=NXC Services Intro"
        - "item-structure-identifier=NXC Service Item"
    type: customElement
    urls:
        - index.js
    useESM: true
```

Repeat the same pattern for `nexcent-features` using:

```text
structure-identifier=NXC Feature Item
```

## Step 9: Validate locally

```bash
cd client-extensions/nexcent-landing-elements
npm install
npm run typecheck
npm run build
```

Expected output:

```text
build/index.js
build/style.css
```

## Step 10: Deploy and assemble the page

From the workspace root:

```bash
./gradlew :client-extensions:nexcent-landing-elements:deploy
```

In Liferay:

1. Open the landing page in Edit mode.
2. Add **Nexcent Services** below the Hero.
3. Add **Nexcent Features** below Services.
4. Publish the page.
5. Test signed-in and signed-out views.

## Expected result

- The Services heading comes from `NXC Services Intro`.
- Three service cards render in `sortOrder`.
- Feature rows alternate based on `imagePosition`.
- Changing Web Content updates the page without rebuilding React.
- Setting `active=false` removes an item after publishing.
- Missing Structures show an actionable error state.

## Checkpoint

- [ ] No visible Services or Features content is hard-coded in React.
- [ ] Both widgets are available in the page editor.
- [ ] Service cards use a 3/2/1 responsive grid.
- [ ] Features stack image-first on mobile.
- [ ] HTML descriptions do not execute scripts or inline event handlers.
- [ ] `npm run typecheck` succeeds.
- [ ] `npm run build` creates deterministic output files.

## Troubleshooting

### `Content Structure was not found`

Confirm the Structure name, external reference code, site scope, and publication status. Custom Element properties can override the default identifiers.

### The widget shows an empty state

Confirm at least one article has `active=true` and is published. Draft articles are not returned as public published content.

### Select values always fall back

Verify the stored values are exactly `left`, `right`, `white`, or `silver`. Labels shown to editors may differ from stored values.

### Styles look different inside the portal

Inspect whether a portal or theme selector has higher specificity. Keep component selectors prefixed with `nxc-` and avoid styling generic tags outside a component root.

## Knowledge check

1. Why does the Services component make two Headless API requests?
2. Why should Select values be converted to a TypeScript union?
3. Why should sorting happen after mapping?
4. What does the `active` field provide that deleting content does not?
5. Why does the Custom Element unmount its React root in `disconnectedCallback()`?

## Challenge

Add a fourth service article and a third feature article without changing frontend code. Then change one feature to `backgroundVariant=silver` and verify that only content changes are required.
