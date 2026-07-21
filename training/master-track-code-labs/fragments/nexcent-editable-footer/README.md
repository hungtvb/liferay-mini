# Nexcent Editable Footer

Editable Footer shell for the Nexcent Master Page.

## Composition

```text
Nexcent Editable Footer
├── Editable branding
│   ├── Logo
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

## Authoring

1. Package and import the `Nexcent Components` Fragment Set.
2. Remove the existing Footer grid composition from the Master Page.
3. Drag `Nexcent Editable Footer` into the Page Footer area.
4. Drag OOTB `Menu Display` into `Company Menu Display Drop Zone`.
5. Select the Company Navigation Menu.
6. Drag another OOTB `Menu Display` into `Support Menu Display Drop Zone`.
7. Select the Support Navigation Menu.
8. Drag the Newsletter Custom Element or Form into `Newsletter Drop Zone`.
9. Edit logo, titles, and copyright inline.
10. Configure brand, social, and accessibility settings in the fragment configuration panel.

## Responsive order

Desktop:

```text
Branding | Company | Support | Newsletter
```

Mobile:

```text
Company
Support
Newsletter
Branding
```

## Runtime checkpoints

- Both Menu Display instances render the selected Navigation Menus.
- Footer content aligns to the Nexcent desktop reference.
- Mobile order and centered alignment are correct at `375px`.
- Social links expose accessible labels and visible focus states.
- Newsletter controls fill the Newsletter column without overflow.
- Edit mode exposes all three drop zones.
- No horizontal scrollbar is introduced.
