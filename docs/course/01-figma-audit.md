# 01 — Audit the Figma Landing Page and Style Guide

## Outcome

Produce a signed-off design handoff before coding.

## Section inventory

```text
Header
Hero
Client Logos
Services
Feature 1
Statistics
Feature 2
Testimonial
Community Updates
Final CTA
Footer
```

## Style Guide inventory

Extract and document:

- Neutral, primary, secondary, information, action, shade, and tint colors.
- Headline and body typography.
- Standard, icon, and link button variants.
- Default, hover, focus, pressed, loading, and disabled states.
- Shadows and effects.
- UI and directional icons.
- Container width, spacing, radius, and breakpoint assumptions.

## FE tasks

- Record Figma node/frame references.
- Identify reusable components and variants.
- Write desktop/tablet/mobile reflow rules.
- Export and optimize SVG/raster assets.
- Identify missing states not shown in Figma.

## BE tasks

- Mark every visible value as one of:
  - Style token.
  - Navigation/site configuration.
  - Structured content.
  - Collection item.
  - Static decorative asset.
- Identify editor ownership and validation.
- Propose Structure names and field references.

## Deliverables

```text
docs/contracts/component-contracts.md
sample-data/assets/
Figma token table
Asset manifest
Responsive specification
Open design questions
```

## Checkpoint

- [ ] Every landing-page section has an FE owner and BE owner.
- [ ] No component is selected only because a technology must be demonstrated.
- [ ] Style Guide values are separated from business content.
- [ ] Newsletter/form-like UI is not treated as a working form without a submission requirement.
