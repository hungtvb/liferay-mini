# Lab 09 — Build the Dynamic Hero Component

## Overview

Build the first production-style landing-page component. The Hero resolves its Web Content Structure at runtime, maps the fields into a frontend DTO, and renders loading, error, empty, and success states.

## Estimated time

75–90 minutes.

## Step 1: Inspect the Hero files

```text
src/components/Hero/
├── Hero.tsx
├── hero.css
└── heroMapper.ts
```

## Step 2: Map Structured Content into a DTO

```ts
export type HeroContent = {
    active: boolean;
    ctaLabel: string;
    ctaUrl: string;
    description: string;
    highlightedText: string;
    id: number;
    imageAlt: string;
    imageUrl: string;
    sortOrder: number;
    title: string;
};
```

Mapper example:

```ts
const fields = flattenContentFields(item.contentFields);
const image = readImage(fields, 'illustration');

return {
    active: readBoolean(fields, 'active', true),
    ctaLabel: readText(fields, 'ctaLabel'),
    description: readText(fields, 'description'),
    imageUrl: image?.contentUrl ?? '',
    sortOrder: readNumber(fields, 'sortOrder'),
    title: readText(fields, 'title', item.title),
};
```

## Step 3: Load the Hero

```ts
const siteId = getSiteId();
const structure = await resolveContentStructure(
    siteId,
    structureIdentifier
);
const contents = await listStructuredContents(structure.id);
const hero = contents
    .map(mapHeroContent)
    .filter((item) => item.active)
    .sort((left, right) => left.sortOrder - right.sortOrder)[0];
```

## Step 4: Handle all UI states

```text
loading → skeleton
error   → accessible alert
empty   → editor guidance
ready   → Figma Hero
```

Never return a silent blank area for API errors.

## Step 5: Configure the widget

```yaml
nexcent-hero:
    cssURLs:
        - style.css
    friendlyURLMapping: nexcent-hero
    htmlElementName: nexcent-hero
    instanceable: false
    name: Nexcent Hero
    portletCategoryName: category.client-extensions
    properties:
        - "structure-identifier=NXC Landing Hero"
    type: customElement
    urls:
        - index.js
    useESM: true
```

## Step 6: Register the element

```tsx
registerReactElement('nexcent-hero', (element) => (
    <Hero
        structureIdentifier={
            element.getAttribute('structure-identifier') ??
            'NXC Landing Hero'
        }
    />
));
```

## Step 7: Build and deploy

```bash
cd client-extensions/nexcent-landing-elements
yarn typecheck
yarn build
../../gradlew clean deploy
```

## Step 8: Add the Hero to a page

1. Edit the Content Page.
2. Open Widgets → Client Extensions.
3. Drag **Nexcent Hero** to the top.
4. Publish.

Expected result:

- Light silver background.
- Left-aligned content on desktop.
- Green highlighted text.
- Illustration on the right.
- Single-column centered mobile layout.

## Step 9: Test content changes

Change and republish the Hero Web Content:

- Title
- Illustration
- CTA label
- Active status

The page must update without rebuilding frontend code.

## Step 10: Accessibility checks

- Heading relationship via `aria-labelledby`.
- Image alt text comes from content.
- Visible CTA focus state.
- Loading uses `aria-busy`.
- Errors use `role="alert"`.
- Reduced motion is respected.

## Checkpoint

- [ ] Hero appears in Client Extensions.
- [ ] No numeric site or Structure ID is hard-coded.
- [ ] Text and image come from Web Content.
- [ ] All four UI states work.
- [ ] Content changes require no frontend rebuild.
- [ ] Desktop and mobile layouts work.
- [ ] Keyboard focus is visible.

## Troubleshooting

### Empty state despite published content

Confirm the article uses `NXC Landing Hero`, `active` is true, and `sortOrder` is valid.

### Illustration does not render

Verify `contentFieldValue.image.contentUrl` exists in the API response.

### Structure not found

Compare the `structure-identifier` attribute with the Structure name/ERC.

## Challenge

Support multiple active Hero articles as an accessible carousel with manual controls, optional autoplay, pause on hover/focus, swipe support, and reduced-motion behavior.

## Knowledge check

1. Why use a mapper instead of reading fields directly in JSX?
2. What lets content update without a frontend deployment?
3. Why is an empty state different from an error state?
