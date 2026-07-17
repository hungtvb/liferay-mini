# 07 — Implement Statistics, Testimonial, Community Updates, CTA, and Footer

## Statistics

### FE

- Render intro and KPI items from backend data.
- Format numbers and suffixes without hard-coded values.
- Support two-column and single-column responsive layouts.
- Respect reduced motion if counter animation is used.

### BE

- Publish `NXC Statistics Intro` and `NXC Statistic Item` records.
- Store numeric value and suffix separately.
- Validate ordering and active state.

## Testimonial

### FE

- Use semantic blockquote markup.
- Support one or more records without adding an unrequested carousel.
- Implement responsive image and attribution layout.

### BE

- Publish `NXC Testimonial` records.
- Manage customer image, identity, quote, and optional CTA.

## Community Updates

This section is implemented by the externally hosted Remote App in Lab 08.

### BE

- Publish `NXC Community Intro` and three `NXC Community Card` records.
- Provide card image, alt text, title, URL, and optional date/summary.

## Final CTA

### FE

- Build a mapped responsive CTA component using shared tokens and button styles.

### BE

- Publish `NXC CTA`.

## Footer

### FE

- Build Footer in the Master Page or Fragment.
- Consume Navigation Menus and site settings.
- Implement accessible social links.
- Do not implement a fake newsletter submission.

### BE/Liferay

- Configure footer navigation groups and site settings.
- Treat newsletter as out of scope until a real submission destination is defined.

## Joint verification

- Change a KPI value and confirm display update.
- Disable a Testimonial and confirm collection behavior.
- Reorder Footer links without FE changes.
- Verify CTA and footer at all target breakpoints.

## Checkpoint

- [ ] Statistics, Testimonial, CTA, and Footer are data/configuration driven.
- [ ] Community content is ready for the Remote App.
- [ ] Form-like UI has no misleading submit behavior.
