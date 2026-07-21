# Nexcent Editable Header

Self-contained Header fragment for the Nexcent Master Page.

## Editable content

- Logo image
- Home, Service, Feature, Product, Testimonial, and FAQ labels and links
- Login label
- Sign up label and link

## Fragment configuration

- Brand URL, brand accessible label, and logo alternative text
- Show or hide each navigation item
- Show or hide guest Login and Sign up actions
- Primary navigation, open navigation, and close navigation labels

Authenticated users continue to use Liferay's OOTB User Personal Bar.

## Authoring

1. Package and import the `Nexcent Components` Fragment Set.
2. Remove the existing Header Inner composition from the Master Page.
3. Drag `Nexcent Editable Header` directly into the Page Header area.
4. Edit the logo and links inline.
5. Use the fragment configuration panel for visibility and accessibility settings.
6. Verify guest and authenticated states at desktop and 375px widths.

## Runtime checkpoints

- Desktop layout matches the static Nexcent header.
- Mobile navigation is closed by default.
- Toggle updates `aria-expanded` and its accessible label.
- Escape closes the panel and restores focus to the toggle.
- Selecting a link closes the panel.
- Clicking outside closes the panel.
- Edit mode exposes the full mobile panel for authoring.
