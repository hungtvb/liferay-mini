# Nexcent Editable Footer

Design-faithful Footer shell fragment for the Nexcent Master Page.

## Composition

```text
Nexcent Editable Footer
├── Editable branding
│   ├── Exact vector logo
│   ├── Copyright lines
│   └── Configurable social links
├── Editable Company title
│   └── Company Menu Display Drop Zone
├── Editable Support title
│   └── Support Menu Display Drop Zone
└── Editable Newsletter title
    └── Newsletter Drop Zone
```

## Content ownership

- Logo, column titles, copyright, and rights text are edited inline.
- Brand URL, logo alternative text, social URLs, and accessibility labels are fragment configuration.
- Company and Support labels, links, hierarchy, and ordering remain managed by Liferay Navigation.
- Both navigation columns are rendered by separate OOTB Menu Display instances.
- Newsletter behavior belongs to the Newsletter Custom Element or Form placed in the Newsletter Drop Zone.

The Footer fragment does not hard-code Company or Support menu items and does not submit newsletter data itself.

## Master Page ownership rule

This fragment owns the complete visual Footer shell: dark background, vertical spacing, container, grid, responsive order, menu styling, social interactions, and Newsletter slot styling.

Before adding it, remove the previous Footer Grid composition and remove custom padding/background classes such as `nxc-site-footer` from the Page Footer area. The Page Footer area must be a neutral, full-width host; otherwise the old shell creates duplicate background, container, or `64px` padding.

## Authoring

1. Package and import the `Nexcent Components` Fragment Set.
2. Remove the existing Footer Grid, Branding, Company, Support, and Newsletter composition.
3. Clear custom spacing/background classes from the Page Footer area.
4. Drag `Nexcent Editable Footer` directly into the Page Footer area.
5. Drag OOTB `Menu Display` into `Company Menu Display Drop Zone` and select the Company Navigation Menu.
6. Drag another OOTB `Menu Display` into `Support Menu Display Drop Zone` and select the Support Navigation Menu.
7. Drag the Newsletter Custom Element or Form into `Newsletter Drop Zone`.
8. Edit logo, titles, and copyright inline.
9. Configure brand, social, and accessibility settings in the fragment configuration panel.

Do not add another Container, Grid, or Page Builder CSS around the fragment.

## Design contract

- Background: `#263238`.
- Content container: `1182px` with `15px` side gutters.
- Vertical padding: `64px`.
- Desktop columns: fluid branding, `160px` Company, `160px` Support, `255px` Newsletter.
- Desktop column gap: `30px`.
- Footer heading: Inter `20px`, weight `600`.
- Footer links and copyright: Inter `14px`, weight `400`.
- Menu item gap: `12px`.
- Social buttons: `32px`; social gap: `16px`.
- Newsletter target size: `255 × 40px`, radius `8px`.
- Footer logo uses vector paths only; no SVG `<text>` and no font-dependent rendering.

## Responsive layout

Desktop above `900px`:

```text
Branding | Company | Support | Newsletter
```

Tablet from `681px` through `900px`:

```text
Branding | Company
Support  | Newsletter
```

Mobile at `680px` and below:

```text
Company
Support
Newsletter
Branding
```

## Runtime checkpoints

- Both Menu Display instances render the selected Navigation Menus without portlet chrome.
- Footer content aligns to the Nexcent desktop reference at `1440px`.
- Tablet at `768px` uses a stable two-column layout rather than four compressed columns.
- Mobile order and centered alignment are correct at `375px`.
- Social links expose accessible labels and visible focus states.
- Newsletter controls fill the Newsletter column without overflow.
- Edit mode exposes all three drop zones.
- No horizontal scrollbar or duplicate outer padding is introduced.
