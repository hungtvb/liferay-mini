# 05 — Implement Header, Hero, and Client Logos

## Header

### Delivery decision

Build the Header in the `Nexcent Master Page`. Do not create a full theme.

Use:

- OOTB Image for the logo.
- OOTB Menu Display sourced from `Nexcent Header`.
- `Nexcent Account Actions` for the Clarity-style guest/login state.
- `Nexcent Mobile Navigation` as the responsive shell and hamburger controller.

`Nexcent Mobile Navigation` contains a button and a fragment drop zone. It does not embed Menu Display as a runtime widget. Authors drag the OOTB Menu Display and Account Actions into its drop zone.

### Source status

```text
SOURCE READY / RUNTIME PENDING
```

The source is ready when the `Nexcent Components` Fragment Set contains:

```text
Nexcent Account Actions
Nexcent Mobile Navigation
Nexcent Section Wrapper
```

Runtime completion requires testing the authored Master Page on DXP 2026.Q1.1.

### Browser tree

```text
Page Header                              [Container: nxc-site-header]
└── Header Inner                         [Container: nxc-header-inner]
    ├── Nexcent Logo                     [OOTB Image: navbar-brand]
    └── Nexcent Mobile Navigation        [Custom Fragment]
        └── Navigation Drop Zone
            └── Header Menu              [Container: nxc-header-menu]
                ├── Header Navigation    [OOTB Menu Display: nxc-header-navigation]
                └── Account Actions      [Nexcent Account Actions]

Master Page Drop Zone
```

### Authoring order

1. Package and import `collections-nexcent-components.zip` with overwrite enabled when updating an existing Fragment Set.
2. Confirm `Nexcent Mobile Navigation` appears in `Nexcent Components`.
3. Keep `Nexcent Master Page` in Draft.
4. Build `Page Header` above the Master Page Drop Zone.
5. Add `Header Inner`.
6. Add the logo as the first child.
7. Add `Nexcent Mobile Navigation` as the second child.
8. Drag `Header Menu` into the fragment drop zone.
9. Drag OOTB Menu Display and `Nexcent Account Actions` into `Header Menu`.
10. Select `Nexcent Header` as the Menu Display source.
11. Test desktop, tablet, mobile, guest, and authenticated states.
12. Publish only after the Header and Footer gates pass.

### Required classes

```text
Page Header:          nxc-site-header
Header Inner:         nxc-header-inner
Logo:                 navbar-brand
Header Menu:          nxc-header-menu
Menu Display:         nxc-header-navigation
```

Do not enter duplicate background, spacing, breakpoint, or toggle CSS in Page Builder. These rules are owned by the Theme CSS and fragment source.

### Mobile behavior

At widths above `767.98px`:

- The hamburger is hidden.
- The navigation panel is visible.
- Logo, navigation, and account actions remain on one row when space permits.

At widths up to `767.98px`:

- The hamburger is visible.
- The panel is closed by default in View mode.
- The panel stays open in Edit mode so authors can access the drop zone.
- Clicking the button toggles the panel.
- `aria-expanded`, `aria-controls`, and the accessible label update.
- Escape closes the panel and returns focus to the toggle.
- Selecting a navigation link closes the panel.

### Header runtime gate

```text
[ ] Desktop does not show the hamburger
[ ] Mobile shows the hamburger
[ ] Toggle opens and closes the authored panel
[ ] aria-expanded changes between false and true
[ ] aria-controls points to a unique panel ID
[ ] Escape closes and returns focus
[ ] Selecting a menu link closes the panel
[ ] Guest shows Login and Sign up
[ ] Authenticated user shows the OOTB User Personal Menu
[ ] Menu source is Nexcent Header
[ ] No horizontal scrollbar at 375 px
[ ] Header does not cover the Control Menu
[ ] Master Page remains editable in mobile preview
```

### FE

- Maintain the Header layout and responsive shell through source-controlled fragments and Theme CSS.
- Keep navigation content in Liferay Navigation Menus.
- Preserve focus, Escape, current-page state, and mobile focus return.

### BE/Liferay

- Create site navigation items and order.
- Configure the site logo and friendly URLs.
- Maintain Create Account and login behavior without environment-specific URLs.

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
- [ ] Mobile navigation passes the runtime gate.
- [ ] Hero is a complete Custom Element.
- [ ] Hero has all four runtime states.
- [ ] Client logos are backend-managed.
- [ ] Visual output follows Figma and Style Book tokens.
