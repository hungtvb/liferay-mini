# Figma 100% Visual Fidelity Gate

## Requirement

The delivered Nexcent landing page must reproduce the supplied Figma frame and Style Guide without intentional visual reinterpretation.

The header must include, in this order:

1. Nexcent logo
2. Home
3. Service
4. Feature
5. Product
6. Testimonial
7. FAQ
8. Login
9. Sign up

`Login` is a separate interactive header action and must remain visible beside `Sign up` at desktop widths. On mobile, both actions remain available inside the accessible navigation menu.

## Acceptance viewports

- Desktop: 1440px wide
- Tablet: 768px wide
- Mobile: 375px wide

## Visual acceptance

For every viewport:

- content order, labels, line breaks, alignment, spacing, widths, heights, typography, colors, radii, shadows, and illustrations match the accepted Figma reference;
- no placeholder logo, client logo, icon, illustration, portrait, or community image remains;
- no extra eyebrow, badge, text, link, date, summary, or animation appears unless it exists in Figma;
- the page has no horizontal overflow;
- focus states and mobile navigation do not alter the default desktop screenshot;
- a screenshot comparison is recorded before merge.

## Evidence rule

"100%" is not accepted from code inspection alone. It requires:

1. a current screenshot of Figma node `1:2`;
2. screenshots of the implementation at 1440, 768, and 375px;
3. visual diff review;
4. zero known asset substitutions;
5. reviewer sign-off recorded in the pull request.

## Current blocker

As of 2026-07-20, both the Figma REST export and Figma MCP access are rate-limited on the connected Starter plan. The repository contains a full-page Figma reference export and a partial icon export, but the component-ready logo, client logos, illustrations, portrait, and community images are not yet complete.

Until current Figma access is restored or the approved assets are supplied directly, source changes can improve fidelity but cannot honestly be certified as 100% pixel-identical.
