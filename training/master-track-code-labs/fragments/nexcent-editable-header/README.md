# Nexcent Editable Header

Design-faithful Header shell fragment for the Nexcent Master Page.

## Composition

```text
Nexcent Editable Header
├── Editable logo
├── Mobile toggle and responsive panel
├── Menu Display Drop Zone
│   └── OOTB Menu Display → Nexcent Header navigation
└── Account Actions Drop Zone
    └── Nexcent Account Actions
```

## Content ownership

- Logo image is edited inline in the fragment.
- Brand URL, accessible brand label, and logo alternative text are fragment configuration.
- Navigation labels, links, hierarchy, and ordering are managed by Liferay Navigation and rendered by OOTB Menu Display.
- Guest Login and Sign up remain owned by `Nexcent Account Actions`.
- Authenticated users continue to use Liferay's OOTB User Personal Bar through `Nexcent Account Actions`.

The Header fragment does not hard-code navigation items.

## Master Page ownership rule

This fragment owns the complete visual Header shell: background, height, container, spacing, responsive panel, and hover states.

Before adding it, remove the previous Header Inner composition and remove custom padding/background classes such as `nxc-site-header` from the Page Header area. The Page Header area must be a neutral, full-width host; otherwise Liferay applies the old shell and causes duplicate height or padding.

## Authoring

1. Package and import the `Nexcent Components` Fragment Set.
2. Remove the old Header Inner, Logo, Mobile Navigation, Menu Display, and Account Actions composition.
3. Clear custom spacing/background classes from the Page Header area.
4. Drag `Nexcent Editable Header` directly into the Page Header area.
5. Drag OOTB `Menu Display` into `Menu Display Drop Zone`.
6. Select the `Nexcent Header` Navigation Menu.
7. Drag `Nexcent Account Actions` into `Account Actions Drop Zone`.
8. Edit the logo inline and configure brand/accessibility settings.

Do not add Page Builder CSS or another Container around the fragment.

## Design contract

- Desktop Header height: `84px`.
- Mobile/tablet Header height: `72px`.
- Wide Header container: `1330px` with `15px` side gutters.
- Logo: exact `155 × 24` vector asset.
- Menu region: maximum `588px` inside the `895px` navigation/action region.
- Navigation typography: Inter `14px`, weight `500`.
- Login and Sign up height: `40px`; action gap: `8px`.
- Navigation collapses at `900px` and below, matching the reference tablet behavior.
- Default Header surface: `#F5F7FA`.

## Runtime checkpoints

- Desktop at `1440px` matches the Nexcent reference spacing and typography.
- Tablet at `768px` uses the hamburger panel rather than a compressed desktop menu.
- Mobile at `375px` has no horizontal overflow.
- Navigation remains managed by OOTB Menu Display.
- Mobile navigation is closed by default.
- Toggle updates `aria-expanded`, `aria-controls`, `aria-hidden`, and its accessible label.
- Escape closes the panel and restores focus to the toggle.
- Selecting a menu or account link closes the panel.
- Clicking outside closes the panel.
- Edit mode exposes both drop zones for authoring.
