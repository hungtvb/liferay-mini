# Nexcent Editable Header

Self-contained Header shell fragment for the Nexcent Master Page.

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
- Guest Login and Sign up labels/settings remain owned by `Nexcent Account Actions`.
- Authenticated users continue to use Liferay's OOTB User Personal Bar through `Nexcent Account Actions`.

The Header fragment does not hard-code navigation items.

## Authoring

1. Package and import the `Nexcent Components` Fragment Set.
2. Remove the existing Header Inner composition from the Master Page.
3. Drag `Nexcent Editable Header` directly into the Page Header area.
4. Drag OOTB `Menu Display` into `Menu Display Drop Zone`.
5. Select the `Nexcent Header` Navigation Menu in Menu Display.
6. Add class `nxc-header-navigation` to Menu Display when the fragment wrapper does not already supply it.
7. Drag `Nexcent Account Actions` into `Account Actions Drop Zone`.
8. Edit the logo inline and configure the brand/accessibility settings.
9. Verify guest and authenticated states at desktop and 375px widths.

## Runtime checkpoints

- Desktop layout matches the static Nexcent header.
- Navigation remains managed by OOTB Menu Display.
- Mobile navigation is closed by default.
- Toggle updates `aria-expanded` and its accessible label.
- Escape closes the panel and restores focus to the toggle.
- Selecting a menu or account link closes the panel.
- Clicking outside closes the panel.
- Edit mode exposes both drop zones for authoring.
