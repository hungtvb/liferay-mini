# 06 — Implement Services and Reusable Feature Sections

## Services

### FE

- Build `nexcent-services` Custom Element.
- Fetch `NXC Services Intro` and `NXC Service Item` articles.
- Sort by `sortOrder` and filter by `active`.
- Render equal-height cards with accessible icons and optional links.
- Support 3/2/1-column layouts.
- Implement loading, empty, error, and long-content states.

### BE

- Create and publish the Services intro.
- Publish the three Figma service cards.
- Validate ERC, sort order, link pairs, and media references.
- Confirm a fourth active service can be added without FE changes.

## Feature sections

### FE

- Build `nexcent-features` Custom Element.
- Use one reusable renderer for all image-and-copy sections.
- Support `imagePosition`, `backgroundVariant`, optional CTA, and Rich Text.
- Sanitize or constrain HTML rendering.
- Define deterministic mobile stacking.

### BE

- Publish two `NXC Feature Item` articles representing the Figma sections.
- Use HTML/Rich Text only for formatted body copy.
- Enforce allowed values for image position and background variant.

## Joint verification

- Add a fourth service and confirm dynamic rendering.
- Swap a Feature image position through Web Content.
- Remove a CTA and confirm no empty button remains.
- Test missing content, API denial, and image failure.

## Checkpoint

- [ ] Services is a complete dynamic Custom Element.
- [ ] Features is a complete dynamic Custom Element.
- [ ] No service or feature business copy exists in JSX.
- [ ] Both Figma Feature sections use one renderer.
- [ ] Rich Text is controlled and does not inject unsafe markup.
