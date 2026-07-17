# 05 — Implement Header, Hero, and Client Logos

## Header

### FE

- Build Header in a Master Page or Fragment.
- Consume Liferay Navigation Menu and site branding.
- Implement desktop and mobile navigation.
- Support focus, escape, current-page state, and mobile focus return.

### BE/Liferay

- Create site pages and navigation order.
- Configure site logo and friendly URLs.
- Configure optional CTA settings only when navigation is insufficient.

## Hero

### FE

- Build `nexcent-hero` as a React Custom Element.
- Resolve content through a stable Structure identifier.
- Map the Hero contract.
- Implement loading, empty, error, optional CTA, and broken-image behavior.
- Match Figma desktop/tablet/mobile composition.

### BE

- Publish `NXC Landing Hero` and its preview Template.
- Provide illustration and alt text.
- Maintain one active primary record.

## Client Logos

### FE

- Build a responsive logo grid or mapped collection component.
- Preserve aspect ratios and lazy-load images.
- Render valid optional links.

### BE

- Publish `NXC Clients Intro` and `NXC Client Logo` records.
- Order records with `sortOrder`.

## Joint verification

- Edit Hero title and confirm live page update without FE rebuild.
- Disable one client logo and confirm it disappears.
- Test 320–390 px, 768 px, 1024 px, and 1440 px.
- Test keyboard-only Header navigation.

## Checkpoint

- [ ] Header links are not hard-coded.
- [ ] Hero is a complete Custom Element.
- [ ] Hero has all four runtime states.
- [ ] Client logos are backend-managed.
- [ ] Visual output follows Figma and Style Book tokens.
